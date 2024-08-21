import { Module } from '@nestjs/common';
import { JwtscController } from './jwtsc.controller';
import { JwtscService } from './jwtsc.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [JwtscController],
  providers: [JwtscService],
  exports: [JwtscService]
})
export class JwtscModule {}
