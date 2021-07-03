import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("MessagesBank")
export class GeneratedMessageOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column()
    subType: string;

    @Column()
    message: string;
}