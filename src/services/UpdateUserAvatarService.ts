import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import User from '../models/User';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

interface Request {
    user_id: string;
    avatarFileName: string;
}

class UpdateUserAvatarService {
    public async execute({
        user_id,
        avatarFileName,
    }: Request): Promise<string> {
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne(user_id);

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

        await usersRepository.save(user);

        return user.avatar;
    }
}

export default UpdateUserAvatarService;