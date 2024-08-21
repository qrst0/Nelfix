import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { ALLOW_UNAUTH, IS_PUBLIC_KEY, NO_ADMIN } from './constants';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { JwtscService } from 'src/jwtsc/jwtsc.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private reflector: Reflector,
        private jwtscService: JwtscService, private usersService: UsersService
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if(isPublic){
            return true;
        }
        
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if(!token){
            const allowUnauth = this.reflector.getAllAndOverride<boolean>(ALLOW_UNAUTH, [
                context.getHandler(),
                context.getClass(),
            ]);
            if(allowUnauth){
                return true;
            }
            throw new UnauthorizedException();
        }
        try{
            const payload = await this.jwtscService.decode(token);
            const userExist = await this.usersService.findOne(payload.sub);
            if(!userExist.data){
                return false;
            }
            request['user'] = payload;
        }catch(err){
            const allowUnauth = this.reflector.getAllAndOverride<boolean>(ALLOW_UNAUTH, [
                context.getHandler(),
                context.getClass(),
            ]);
            if(allowUnauth){
                return true;
            }
            throw new ForbiddenException();
        }
        const noAdmin = this.reflector.getAllAndOverride<boolean>(NO_ADMIN, [
            context.getHandler(),
            context.getClass(),
        ]);
        if(noAdmin){
            return true;
        }
        if(!request['user'].adm){
            return false;
        }
        return true;
    }
    private extractTokenFromHeader(request: Request): string | undefined{
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}