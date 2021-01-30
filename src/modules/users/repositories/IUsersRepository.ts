import ICreateUserDTO from "../dtos/ICreateUserDTO";
import User from "../infra/typeorm/entities/User";



export default interface IUsersRepository {

    findByEmail(email: string): Promise<User | undefined>;
    create(data: ICreateUserDTO): Promise<User>;
    findById(id: string): Promise<User>;
    save(user: User): Promise<User>



}
