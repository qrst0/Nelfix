import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { FilmsService } from 'src/films/films.service';
import { HistoryService } from 'src/history/history.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class FecommService {
    private UNIT_PAGE = 8;
    private ALL_UNIT_PAGE = 16;
    constructor(private readonly filmService: FilmsService, private readonly historyService: HistoryService, private readonly usersService: UsersService, private readonly authService: AuthService) {}

    async filmQuery(title: string, genre: string, minprice: number, maxprice: number, page: number){
        const allFilms = await this.filmService.findAll("");
        let newData = [];
        for(const film of allFilms.data){
            if(this.filmQueryCond(film, title, genre, minprice, maxprice)){
                newData.push(film);
            }
        }
        newData.sort((a, b) => {
            if(+(a.id) < +(b.id)) return -1;
            else if(+(a.id) === +(b.id)) return 0;
            else return 1;
        });
        let totalPage = Math.ceil(newData.length / this.UNIT_PAGE);
        let slicedData = [];
        for(let i = (page - 1) * this.UNIT_PAGE; i < Math.min(newData.length, page * this.UNIT_PAGE); i++){
            slicedData.push(newData[i]);
        }
        return {
            status: "success",
            message: "Query success",
            data: slicedData,
            total_pages: totalPage,
            genre_name: genre
        }
    }

    filmQueryCond(film: Record<string, any>, title: string, genre_q: string, minprice: number, maxprice: number){
        const genres = film.genre;
        let existG = false;
        for(const genre of genres){
            const cleanedGenre = genre.replace(/\W/g, '');
            const lowerGenre = cleanedGenre.toLowerCase();
            if(lowerGenre.includes(genre_q)){
                existG = true;
                break;
            }
        }
        const cleanedTitle = film.title.replace(/\W/g, '');
        const lowerTitle = cleanedTitle.toLowerCase();
        let existT = false;
        if(lowerTitle.includes(title)){
            existT = true;
        }
        let existD = false;
        const lowerDirector = film.director.toLowerCase();
        if(lowerDirector.includes(title)){
            existD = true;
        }
        let existU = (film.price >= minprice && film.price <= maxprice && (minprice != 0 || maxprice != 1000));
        return (existU || (existG && genre_q != "") || (existT && title != "") || (existD && title != ""));
    }

    async filmQueryAll(page: number){
        const resp = await this.filmService.findAll("");
        let totalPage = Math.ceil(resp.data.length / this.ALL_UNIT_PAGE);
        let newData = [];
        for(let i = (page - 1) * this.ALL_UNIT_PAGE; i < Math.min(resp.data.length, page * this.ALL_UNIT_PAGE); i++){
            newData.push(resp.data[i]);
        }
        resp.data = newData;
        resp['total_pages'] = totalPage;
        return resp;
    }

    async getFilmById(id: number, userId: number | null){
        let stat = 0;
        const resp = await this.filmService.findOne(id);
        if(userId === null){
            stat = 0;
        }else{
            const hasBought = await this.historyService.checkHistory(userId, id);
            if(hasBought){
                stat = 1;
            }else{
                const user = await this.usersService.findOne(userId);
                const balance = user.data.balance;
                if(balance >= resp.data.price){
                    stat = 2;
                }else{
                    stat = 3;
                }
            }
        }
        resp.data['stat'] = stat;
        return resp;
    }

    async buy(filmId: number, userId: number){
        const filmData = await this.filmService.findOne(filmId);
        const filmPrice = filmData.data.price;

        const userData = await this.usersService.findOne(userId);
        const userBalance = userData.data.balance;

        if(userBalance < filmPrice){
            throw new BadRequestException('Not enough balance!');
        }

        const resp = await this.historyService.addHistory(userId, filmId);
        const minusBalance = await this.usersService.increment(userId, -filmPrice);
        return minusBalance;
    }

    async get_bought(page: number, userId: number){
        const film_bought = await this.filmService.getBought(userId); 
        film_bought.sort((a, b) => {
            if(+(a.id) < +(b.id)) return -1;
            else if(+(a.id) === +(b.id)) return 0;
            else return 1;
        });
        let this_page = [];
        let totalPage = Math.ceil(this_page.length / this.UNIT_PAGE);
        for(let i = (page - 1) * this.UNIT_PAGE; i < Math.min(film_bought.length, page * this.UNIT_PAGE); i++){
            this_page.push(film_bought[i]);
        }
        return {
            status: "success",
            message: "Query success",
            data: this_page,
            total_pages: totalPage
        }
    }

    async signIn(userOrEmail: string, password: string){
        if(!userOrEmail){
            return {
                status: "error",
                message: "Username can't be empty!",
                data: null
            }
        }
        let username = userOrEmail;
        if(!this.authService.validateUsername(userOrEmail)){
            const userByEmail = await this.usersService.findWithEmail(userOrEmail);
            username = userByEmail.username;
        }
        return await this.authService.signIn(username, password);
    }
}
