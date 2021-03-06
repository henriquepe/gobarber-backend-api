import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { uuid } from 'uuidv4'
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import { isEqual } from 'date-fns';



class AppointmentsRepository implements IAppointmentsRepository {

    private appointments: Appointment[] = [];

    public async findByDate(date: Date): Promise<Appointment | undefined> {

        const findAppointmentInSameDate = this.appointments.find(appointment => {
            return isEqual(appointment.date, date);
        })

        return findAppointmentInSameDate;

    }

    public async create({ provider_id, date }: ICreateAppointmentDTO): Promise<Appointment> {

        const appointment = new Appointment();

        Object.assign(appointment, {
            id: uuid(),
            date,
            provider_id
        })


        this.appointments.push(appointment);

        return appointment;

    }
}

export default AppointmentsRepository;
