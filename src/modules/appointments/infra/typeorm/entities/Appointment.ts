import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import User from '../../../../users/infra/typeorm/entities/User';

@Entity('appointments')
class Appointment {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    provider_id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'provider_id' })
    provider: User;

    @Column()
    date: Date;

    @CreateDateColumn()
    created_at: Date;

    @CreateDateColumn()
    updated_at: Date;
}

export default Appointment;
