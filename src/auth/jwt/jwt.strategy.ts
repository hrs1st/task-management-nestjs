import { PassportStrategy } from '@nestjs/passport';
import { Strategy , ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt-payload..interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../storage/user.repository';
import { UserEntity } from '../storage/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'My1080Secret'
        });
    }

    async validate(payload: JwtPayload): Promise<UserEntity> {
        const { username } = payload;
        const user = await this.userRepository.findOne({username});

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}