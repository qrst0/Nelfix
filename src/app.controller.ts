import { Controller, Get, Render, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/constants';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @Render('index')
  empty(): object{
    return {}
  }

  @Public()
  @Get('login')
  @Render('login')
  login() : object{
    return {}
  }

  @Public()
  @Get('signup')
  @Render('signup')
  signup() : any {
    return {}
  }

  @Public()
  @Get('index')
  @Render('index')
  index() : object {
    return {  }
  }

  @Public()
  @Get('detail')
  @Render('detail')
  async detail() {
    return {}
  }

  @Public()
  @Get('movie-list')
  @Render('movie-list')
  async movie_list() : Promise<any> {
    return {}
  }

  @Public()
  @Get('all-films')
  @Render('all-films')
  async all_films() {
    return {}
  }

  @Public()
  @Get('bought-films')
  @Render('bought-films')
  async bought_films() {
    return {}
  }
}
