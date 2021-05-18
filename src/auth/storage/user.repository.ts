import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './user.entity';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../jwt/jwt-payload..interface';
import {
    ConflictException,
    InternalServerErrorException,
    UnauthorizedException
} from '@nestjs/common';


@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<UserEntity> {
        const { username , password } = authCredentialsDto;

        const user = new UserEntity();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(password, user.salt);

        try {
            return await user.save();
        } catch (error) {
            if (error.code === '23505' ) {    // 23505: duplicate entries
                throw new ConflictException(`username ${username} already exists`);
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async signIn(authCredentialsDto: AuthCredentialsDto, jwtService: JwtService): Promise<{ accessToken: string }> {
        const username = await this.validatePassword(authCredentialsDto);

        const payload: JwtPayload = {username};
        const accessToken = jwtService.sign(payload);

        return {accessToken};
    }

    private async validatePassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username , password } = authCredentialsDto;
        const user = await this.findOne({username});

        if (user) {
            const hash = await bcrypt.hash(password , user.salt);
            if (hash === user.password) {
                return user.username;
            }
            else {
                throw new UnauthorizedException('wrong credentials!');
            }
        } else {
            throw new UnauthorizedException(`wrong credentials!`);
        }
    }
}