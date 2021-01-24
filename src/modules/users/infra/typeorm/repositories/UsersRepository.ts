import ICreateUserDTO from "@modules/users/dtos/ICreateUserDTO";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import AppError from "@shared/errors/AppError";
import { getRepository, Repository } from "typeorm";
import User from "../entities/User";

export default class UsersRepository implements IUsersRepository {

    private ormRepository: Repository<User>;

    constructor() {
        this.ormRepository = getRepository(User);
    }

    public async findByEmail(email: string): Promise<User> {

        const user = await this.ormRepository.findOne({ where: { email } })

        if (!user) {
            throw new AppError('user do not exists', 401);
        }

        return user;

    }

    public async save(user: User): Promise<User> {
        this.ormRepository.save(user);

        return user;
    }

    public async create({ email, name, password }: ICreateUserDTO): Promise<User> {

        const user = this.ormRepository.create({
            email,
            name,
            password
        });

        this.save(user)

        return user;

    }

    public async findById(id: string): Promise<User> {

        const user = await this.ormRepository.findOne(id);

        if (!user) {
            throw new AppError('user do not exists', 401)
        }

        return user;

    }




}
