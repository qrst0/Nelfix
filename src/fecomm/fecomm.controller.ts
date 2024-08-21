import { Controller, Get, Param, Post, Query, Body, UnauthorizedException } from '@nestjs/common';
import { FecommService } from './fecomm.service';
import { Public, AllowUnauth, NoAdmin } from 'src/auth/constants';
import { UsersService } from 'src/users/users.service';
import { AuthUser  } from 'src/auth/auth.decorator';
import { AuthService } from 'src/auth/auth.service';

@Controller('fecomm')
export class FecommController {
    constructor(private readonly fecommService: FecommService, private readonly usersService: UsersService, private readonly authService: AuthService){}

    @Public()
    @Post('login')
    async signIn(@Body() signInDto: Record<string, any>){
        try{
            return await this.fecommService.signIn(signInDto.username, signInDto.password);
        } catch(error){
            return {
                status: "error",
                message: "Unexpected error",
                data: null
            }
        }
    }

    @Public()
    @Post('signup')
    async signUp(@Body() signUpDto: Record<string, any>){
        try{
            return await this.authService.signUp(signUpDto.username, signUpDto.fullname, signUpDto.email, signUpDto.password);
        } catch(error){
            return {
                status: "error",
                message: "Unexpected error",
                data: null
            }
        }
    }

    @NoAdmin()
    @AllowUnauth()
    @Get("films/:id")
    async getFilmById(@Param('id') id: string, @AuthUser() request: any){
        try{
            let userId = null;
            if(request['user']){
                userId = request['user'].sub;
            }
            return await this.fecommService.getFilmById(+id, userId);
        } catch(error){
            return {
                status: "error",
                message: "Unexpected error",
                data: null
            }
        }
    }

    @Public()
    @Get("allfilms")
    async filmQueryAll(@Query() queryGet: Record<string, any>){
        try{
            const page = queryGet.page || 1;
            return await this.fecommService.filmQueryAll(page);
        } catch(error){
            return {
                status: "error",
                message: "Unexpected error",
                data: null
            }
        }
    }

    @Public()
    @Get("films")
    async filmQuery(@Query() query: Record<string, any>){
        try{
            // title, genre, minprice, maxprice
            const title = query.title || "";
            const genre = query.genre || "";
            const minprice = query.minprice || 0;
            const maxprice = query.maxprice || 1000;
            const page = query.page || 1;
            return await this.fecommService.filmQuery(title, genre, minprice, maxprice, page);
        } catch(error){
            return {
                status: "error",
                message: "Unexpected error",
                data: null
            }
        }
    }

    @NoAdmin()
    @Get('/users/:id')
    async findOne(@Param('id') id: string) {
        try{
            return await this.usersService.findOne(+id);
        } catch(error){
            return {
                status: "error",
                message: "Unexpected error",
                data: null
            }
        }
    }

    @NoAdmin()
    @AllowUnauth()
    @Get('authme')
    async getSelf(@AuthUser() request: any){
        if(!request['user']){
            return {
                status: "error",
                message: "Unauthorized",
                data: null
            }
        }
        try{
            const resp = await this.authService.getSelf(request);
            const user = await this.usersService.findWithUsername(request['user'].username);
            resp.data['balance'] = user.balance;
            return resp;
        } catch(error){
            return {
                status: "error",
                message: "Unexpected error",
                data: null
            }
        }
    }

    @NoAdmin()
    @Get('user')
    async findUser(@Query() queryGet: Record<string, any>) {
        const query = queryGet.q || "";
        try{
            const resp = await this.usersService.findWithUsername(query);
            return {
                status: "success",
                message: "Query success",
                data: resp
            }
        } catch(error){
            return {
                status: "error",
                message: "Unexpected error",
                data: null
            }
        }
    }

    @NoAdmin()
    @Post('films/:id')
    async buy(@Param('id') filmId: string, @AuthUser() request: any){
        try{
            const userId = request['user'].sub;
        return await this.fecommService.buy(+filmId, userId);
        } catch(error) {
            return {
                status: "error",
                message: "Unexpected error",
                data: null
            }
        }
    }

    @NoAdmin()
    @AllowUnauth()
    @Get('get-bought')
    async get_bought(@Query() query: Record<string, any>, @AuthUser() request: any){
        try{
            if(!request['user']){
                return {
                    status: "error",
                    message: "Unauthorized",
                    data: [],
                    total_pages: 0
                }
            }
            const page = query.page || 1;
            const id = request['user'].sub;
            if(id === null){
                throw new UnauthorizedException('Fatal error! Contact admin');
            }
            const resp = this.fecommService.get_bought(page, id);
            return resp;
        } catch(error){
            return {
                status: "error",
                message: "Unexpected error",
                data: null
            }
        }
    }
}
