import 'reflect-metadata';

import CreateUserService from './CreateUserService';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';


import AppError from '@shared/errors/AppError';

describe('CreateUser', () => {
    it('should be able to create a new user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();

        const fakeHashProvider = new FakeHashProvider();



        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

        const user = await createUser.execute({
            email: 'henrique@gmail.com',
            name: 'Henrique Pires',
            password: '123456'
        })



        expect(user).toHaveProperty('id')
        expect(user.name).toBe("Henrique Pires")
    })


    it('should not be able to create two users with the same email', async() => {
        const fakeUsersRepository = new FakeUsersRepository();

        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

        await createUser.execute({
            email: 'henrique@gmail.com',
            name: "Henrique Pires",
            password: '123456'
        })


        expect(createUser.execute({
            email: 'henrique@gmail.com',
            name: "Henrique Pires",
            password: '123456'
        })).rejects.toBeInstanceOf(AppError)
    })

})
