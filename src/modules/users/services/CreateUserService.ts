import { hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';

import AppError from '../../../shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';




interface IRequest {
    email: string;
    name: string;
    password: string;
}

@injectable()
class CreateUserService {


    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository) {

    }

    public async execute({ name, email, password }: IRequest): Promise<User> {


        const checkUserExists = await this.usersRepository.findByEmail(email);

        if (checkUserExists) {
            throw new AppError('This email is already used', 400);
        }

        const passwordHashed = await hash(password, 8);

        const user = this.usersRepository.create({
            name,
            email,
            password: passwordHashed,
        });



        return user;
    }
}

export default CreateUserService;
