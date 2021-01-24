import { Router } from 'express';
import multer from 'multer';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import uploadConfig from '@config/upload';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import CreateUserService from '@modules/users/services/CreateUserService';

import { container } from 'tsyringe';




const usersRouter = Router();

const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
    const { email, password, name } = request.body;



    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({ email, password, name });

    /* @ts-ignore */
    delete user.password;

    return response.status(200).json(user);
});

usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (request, response) => {
        const { filename } = request.file;

        const { id } = request.user;


        const updateUserAvatar = container.resolve(UpdateUserAvatarService);

        const updatedAvatar = await updateUserAvatar.execute({
            user_id: id,
            avatarFileName: filename,
        });

        return response.json({ updatedAvatarName: updatedAvatar });
    },
);

export default usersRouter;
