import { Column, PrimaryGeneratedColumn } from "typeorm";


export class CommandsOrmEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    command: string;

    @Column()
    commandMessage: string;
}