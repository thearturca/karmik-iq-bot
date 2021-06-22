import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Activity', {})
export class IqUserActivityOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    timestamp: number;

    @Column()
    username: string;

    @Column()
    iq: number;
}