import path from 'path';
import fs from 'fs';

import uploadConfig from '../../../config/upload';
import AppError from '../../../shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

import { injectable, inject } from 'tsyringe';




interface IRequest {
    user_id: string;
    avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {


    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository) {

    }

    public async execute({
        user_id,
        avatarFileName,
    }: IRequest): Promise<string> {


        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError(
                'Only authenticated users can change avatar',
                401,
            );
        }

        if (user.avatar) {
            const userAvatarFilePath = path.join(
                uploadConfig.directory,
                user.avatar,
            );

            try {
                const userAvatarFileExists = await fs.promises.stat(
                    userAvatarFilePath,
                );

                if (userAvatarFileExists) {
                    await fs.promises.unlink(userAvatarFilePath);
                }
            } catch (err) {
                throw new AppError('Referenced filename not found', 400);
            }
        }

        user.avatar = avatarFileName;

        await this.usersRepository.save(user);

        return user.avatar;
    }
}

export default UpdateUserAvatarService;
