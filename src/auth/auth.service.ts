import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtscService } from 'src/jwtsc/jwtsc.service';
import { ShascService } from 'src/shasc/shasc.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService,
        private readonly jwtscService: JwtscService,
        private readonly shascService: ShascService
    ){}
    async signIn(username: string, password: string){
        if(!username){
            return {
                status: "error",
                message: "Username can't be empty!",
                data: null
            }
        }
        if(!this.validatePassword(password)){
            return {
                status: "error",
                message: "Password can't be empty!",
                data: null
            }
        }
        const salt = this.shascService.generateSalt(username);
        const encryptedPw = this.shascService.sha256(salt + password);
        const user = await this.usersService.findWithUsername(username);
        if(user?.password !== encryptedPw){
            return {
                status: "error",
                message: "Invalid credentials",
                data: null
            }
        }
        const admStatus = await this.usersService.getAdminStatus(+user.id);
        const payload = { sub: user.id, username: user.username, adm: admStatus};
        const token = await this.jwtscService.encode(payload);
        return {
            status: "success",
            message: "Login success",
            data:{
                username: username,
                token: token
            }
        }
    }
    async signUp(username: string, fullname: string, email: string, password: string){
        if(!username){
            return {
                status: "error",
                message: "Username can't be empty!",
                data: null
            }
        }
        if(!fullname){
            return {
                status: "error",
                message: "Name can't be empty!",
                data: null
            }
        }
        if(!email){
            return {
                status: "error",
                message: "Email can't be empty!",
                data: null
            }
        }
        if(!this.validateUsername(username)){
            return {
                status: "error",
                message: "Username can only contain alphanumeric!",
                data: null
            }
        }
        if(!this.validateEmail(email)){
            return {
                status: "error",
                message: "Invalid email!",
                data: null
            }
        }
        if(!this.validatePassword(password)){
            return {
                status: "error",
                message: "Password length must be greater than 4!",
                data: null
            }
        }
        const salt = this.shascService.generateSalt(username);
        const encryptedPw = this.shascService.sha256(salt + password);
        const __user = await this.usersService.create({username: username, fullname: fullname, email: email, password: encryptedPw});
        const admStatus = await this.usersService.getAdminStatus(+__user.id);
        const payload = { sub: __user.id, username: username, adm: admStatus};
        return {
            status: "success",
            message: "Signup success",
            data:{
                username: username,
                token: await this.jwtscService.encode(payload)
            }
        }
    }
    async getSelf(request: any){
        const username = request['user'].username;
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        if(type !== "Bearer"){
            throw new ForbiddenException('Fatal error! Contact admin');
        }
        return {
            status: "success",
            message: "Self Token",
            data: {
                username: username,
                token: token,
            }
        };
    }
    validateEmail(email: string){
        return String(email)
            .toLowerCase()
            .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };
    validatePassword(password: string){
        if(!password) return false;
        if(password.length <= 4) return false;
        return true;
    };
    validateUsername(str: string){
        var code, i, len;

        for (i = 0, len = str.length; i < len; i++) {
          code = str.charCodeAt(i);
          if (!(code > 47 && code < 58) && // numeric (0-9)
              !(code > 64 && code < 91) && // upper alpha (A-Z)
              !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false;
          }
        }
        return true;
    }
}
