import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("PastaBank")
export class PastaOrmEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    pasta: string;

    @Column()
    alias: string;
}