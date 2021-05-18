import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './storage/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
      JwtModule.register({
        secret: 'My1080Secret',
        signOptions: {
          expiresIn: 3600
        }
      }),
      PassportModule.register({ defaultStrategy: 'jwt' }),
      TypeOrmModule.forFeature([ UserRepository ])
  ],
  controllers: [AuthController],
  providers: [
      AuthService,
      JwtStrategy
  ],
  exports: [
      JwtStrategy,
      PassportModule
  ]
})
export class AuthModule {}
