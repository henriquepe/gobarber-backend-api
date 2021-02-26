import ICreateUserDTO from "@modules/users/dtos/ICreateUserDTO";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import AppError from "@shared/errors/AppError";
import { uuid } from "uuidv4";
import User from "../../infra/typeorm/entities/User";

export default class UsersRepository implements IUsersRepository {



    private users: User[] = [];

    public async findById(id: string): Promise<User | undefined> {

        const user = this.users.find(user => user.id === id)

        return user;

    }


    public async findByEmail(email: string): Promise<User | undefined> {

        const user = this.users.find(user => user.email === email)

        return user;

    }

    public async save(user: User): Promise<User> {

        const findUserIndex = this.users.findIndex(userSaved => userSaved.id === user.id)

        this.users[findUserIndex] = user;

        return user;


    }

    public async create(userData : ICreateUserDTO): Promise<User> {

        const user = new User();

        Object.assign(user,
            { id: uuid() },
            userData
        )

        this.users.push(user);

        return user;

    }


}
