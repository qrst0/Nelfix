import { Module } from '@nestjs/common';
import { FecommController } from './fecomm.controller';
import { FecommService } from './fecomm.service';
import { FilmsModule } from 'src/films/films.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { HistoryModule } from 'src/history/history.module';

@Module({
  imports: [FilmsModule, UsersModule, AuthModule, HistoryModule],
  controllers: [FecommController],
  providers: [FecommService]
})
export class FecommModule {}
