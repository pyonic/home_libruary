import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../users/users.repository";
import { Repository } from "typeorm";
import { sign, verify } from "jsonwebtoken";
import { RefreshTokensRepository } from "./auth.repository";
import { UsersService } from "../users/user.service";
import { compare } from "bcrypt";
import * as dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const JWT_REFRESH_SECRET = process.env.JWT_SECRET_REFRESH_KEY;
const JWT_LIFETIME = process.env.TOKEN_EXPIRE_TIME;
const JWT_REFRESH_LIFETIME = process.env.TOKEN_REFRESH_EXPIRE_TIME;

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        @InjectRepository(RefreshTokensRepository)
        private refreshTokensRepository: Repository<RefreshTokensRepository>,
        private readonly usersService: UsersService
    ) {}

    async getTokens (payload) {
		const accessToken = this.generateJWT(payload, JWT_SECRET, { expiresIn: JWT_LIFETIME });
		const refreshToken = this.generateJWT(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_LIFETIME });
		
		await this.insertRefreshToken(refreshToken, payload.login)
		
		return {
			accessToken,
			refreshToken
		};
	}

    generateJWT (data, key, options = {}): string {
        const token = sign(data, key, options);
        return token;
    }

    async insertRefreshToken(token, login): Promise<RefreshTokensRepository> {
        return await this.refreshTokensRepository.save({ token, login });
    }

    async signUp(data) {
        const user = await this.usersService.create(data);

        const payload = { id: user.id, login: user.login }

        const { accessToken, refreshToken: refreshToken } = await this.getTokens(payload);

        return { accessToken, refreshToken }
    }

    async signIn (data: any) {
		const { login, password } = data;

		console.log(login, password);
		
    
		const user = await this.usersRepository.findOne({ where: { login }});
		if (!user) throw new ForbiddenException('Auth failed');
    
		const userPassword = user.password;

		const passwordValid = await compare(password, userPassword);
    
		if (passwordValid) {
			const payload = {
				id: user.id,
                login
			};

			return this.getTokens(payload);
		} else {
			throw new ForbiddenException('Auth failed');
		}
	}

    async refreshToken (body) {
		
		const { refreshToken } = body;

		const payload: any = this.verifyToken(refreshToken, JWT_REFRESH_SECRET);

		const data = await this.refreshTokensRepository.findOne({ where: { login: payload.login }})
		if (data?.token && data.token == refreshToken) {
			const tokens = await this.getTokens({ login: payload.login, id: payload.id });
			await this.refreshTokensRepository.delete({ login: payload.login })
			return tokens;
		} else {
			throw new ForbiddenException('Refresh token not exists or already used');
		}
	}

	async verifyToken (token, secret = JWT_SECRET) {
		try {
			const payload: any = verify(token, secret);
	
			if (!payload || !payload?.login) {
				throw new ForbiddenException("Auth failed")
			}
	
			const user: Users = await this.usersRepository.findOne({ where: { login: payload.login }});
	
			if (!user) {
				throw new ForbiddenException("Auth failed")
			}
	
			return user;
		} catch {
			throw new UnauthorizedException("Auth failed");
		}
	}
}