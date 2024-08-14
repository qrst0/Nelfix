import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './constants'

@Controller('')
export class AuthController {
    constructor(private authService: AuthService){}

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: Record<string, any>){
        return await this.authService.signIn(signInDto.username, signInDto.password);
    }

    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post('signup')
    async signUp(@Body() signUpDto: Record<string, any>){
        return await this.authService.signUp(signUpDto.username, signUpDto.email, signUpDto.password);
    }
}
