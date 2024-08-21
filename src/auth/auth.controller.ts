import { Body, Controller, Post, Get, Options, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './constants';
import { AuthUser } from './auth.decorator';

@Controller('')
export class AuthController {
    constructor(private authService: AuthService){}

    @Public()
    @Post('login')
    async signIn(@Body() signInDto: Record<string, any>){
        try{
            return await this.authService.signIn(signInDto.username, signInDto.password);
        } catch(error){
            return {
                status: "error",
                message: "Unexpected error",
                data: null
            }
        }
    }

    @Get('self')
    async getSelf(@AuthUser() request: any){
        try{
            return this.authService.getSelf(request);
        } catch(error){
            return {
                status: "error",
                message: "Unexpected error",
                data: null
            }
        }
    }
}
