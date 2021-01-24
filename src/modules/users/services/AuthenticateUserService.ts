import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '../infra/typeorm/entities/User';
import authConfig from '../../../config/authConfig';
import AppError from '../../../shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import { injectable, inject } from 'tsyringe';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}

@injectable()
class AuthenticateUserService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository) {

    }

    public async execute({ email, password }: IRequest): Promise<IResponse> {


        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('User not exists', 401);
        }

        const passwordMatched = await compare(password, user.password);

        if (!passwordMatched) {
            throw new AppError('invalid email or password', 401);
        }

        const { expiresIn, secret } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        return {
            user,
            token,
        };
    }
}

export default AuthenticateUserService;
