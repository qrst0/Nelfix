import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService,
        private jwtService: JwtService
    ){}
    async signIn(username: string, password: string){
        const user = await this.usersService.findWithUsername(username);
        if(user?.password !== password){
            throw new UnauthorizedException();
        }
        const payload = { sub: user.id, username: user.username};
        return {
            token: await this.jwtService.signAsync(payload)
        }
    }
    async signUp(username: string, email: string, password: string){
        const __user = await this.usersService.create({username: username, email: email, password: password});
        const payload = { sub: __user.id, username: username };
        return {
            token: await this.jwtService.signAsync(payload)
        }
    }
}
