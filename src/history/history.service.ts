import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HistoryService {
    constructor(private readonly prisma: PrismaService){}

    async addHistory(userId: number, filmId: number) : Promise<any> {
        const resp = await this.prisma.history.create({
            data: {
                filmId: filmId,
                userId: userId
            }
        });
        return resp;
    }

    async checkHistory(userId: number, filmId: number) : Promise<boolean>{
        const checker = await this.prisma.history.count({
            where: {
                filmId: filmId,
                userId: userId
            }
        });
        if(checker >= 1) return true;
        return false;
    }
}
