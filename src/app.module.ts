import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { FilmsModule } from './films/films.module';
import { AuthModule } from './auth/auth.module';
import { FecommModule } from './fecomm/fecomm.module';
import { HistoryModule } from './history/history.module';
import { JwtscModule } from './jwtsc/jwtsc.module'
import { ShascModule } from './shasc/shasc.module';

@Module({
  imports: [PrismaModule, UsersModule, FilmsModule, AuthModule, FecommModule, HistoryModule, JwtscModule, ShascModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
