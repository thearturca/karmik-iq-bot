import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("CommandsBank")
export class CommandsOrmEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    command: string;

    @Column()
    commandMessage: string;
}