import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { JwtscModule } from 'src/jwtsc/jwtsc.module';
import { ShascModule } from 'src/shasc/shasc.module';

@Module({
  imports: [
    UsersModule,
    JwtscModule,
    ShascModule
  ],
  controllers: [AuthController],
  providers: [AuthService, {
    provide: APP_GUARD,
    useClass: AuthGuard
  }],
  exports: [AuthService]
})
export class AuthModule {}
