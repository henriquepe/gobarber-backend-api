import { Router } from 'express';
import { parseISO } from 'date-fns';

import { container } from 'tsyringe';

import CreateAppointmentsService from '@modules/appointments/services/CreateAppointmentService';

import ensureAuthenticated from '../../../../users/infra/http/middlewares/ensureAuthenticated';

const appointmentsRouter = Router();


appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get('/', async (request, response) => {


//     const appointments = await appointmentsRepository.find();

//     return response.status(200).json(appointments);
// });

appointmentsRouter.post('/', async (request, response) => {
    const { provider_id, date } = request.body;

    const parsedDate = parseISO(date);



    const createAppointmentsService = container.resolve(CreateAppointmentsService);

    const appointment = await createAppointmentsService.execute({
        provider_id,
        date: parsedDate,
    });

    return response.json(appointment);
});

export default appointmentsRouter;
