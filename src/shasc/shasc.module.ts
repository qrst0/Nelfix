import { Module } from '@nestjs/common';
import { ShascController } from './shasc.controller';
import { ShascService } from './shasc.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [ShascController],
  providers: [ShascService],
  exports: [ShascService]
})
export class ShascModule {}
