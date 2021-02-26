import 'reflect-metadata';

import AuthenticateUserService from './AuthenticateUserService';

import CreateUserService from './CreateUserService';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';


import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';

interface AuthenticateReturn {

    user: User;
    token: string;

}

describe('AuthenticateUser', () => {
    it('should be able to authenticate user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();

        const fakeHashProvider = new FakeHashProvider();

        const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

        await createUser.execute({
            name: 'Henrique Pires',
            email: 'henrique@gmail.com',
            password: '123456'
        })

        const response = await authenticateUser.execute({
            email: 'henrique@gmail.com',
            password: '123456'
        })

        expect(response).toHaveProperty('token')

    })


     it('should not be able to authenticate user if it not exists', async() => {
         const fakeUsersRepository = new FakeUsersRepository();

         const fakeHashProvider = new FakeHashProvider();

         const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

         expect(authenticateUser.execute({
            email: 'henrique@gmail.com',
            password: '123456'
        })).rejects.toBeInstanceOf(AppError)


     }),

     it('should not be able to authenticate user if password is wrong', async() => {
        const fakeUsersRepository = new FakeUsersRepository();

        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

        const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

        await createUser.execute({
            email: 'henrique@gmail.com',
            name: "Henrique Pires",
            password: '123456'
        })

       expect(authenticateUser.execute({email: 'henrique@gmail.com', password: '1234567'})).rejects.toBeInstanceOf(AppError)


    })



})
