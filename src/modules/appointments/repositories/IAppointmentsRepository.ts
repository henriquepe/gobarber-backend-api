import Appointment from "../infra/typeorm/entities/Appointment";

interface IAppointmentsRepository {
    findByDate(date: Date): Promise<Appointment | undefined>;
    create(data: ICreateAppointmentDTO): Promise<Appointment>
}

export default IAppointmentsRepository;
