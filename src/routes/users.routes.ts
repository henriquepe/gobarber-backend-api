import { Router } from 'express';
import multer from 'multer';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import CreateUserService from '../services/CreateUserService';
import uploadConfig from '../config/upload';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
    const { email, password, name } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({ email, password, name });

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

        const updateUserAvatar = new UpdateUserAvatarService();

        const updatedAvatar = await updateUserAvatar.execute({
            user_id: id,
            avatarFileName: filename,
        });

        return response.json({ updatedAvatarName: updatedAvatar });
    },
);

export default usersRouter;
