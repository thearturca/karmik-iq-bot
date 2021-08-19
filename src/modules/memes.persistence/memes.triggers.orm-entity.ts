import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("MemesTriggers")
export class MemesTriggersOrmEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    memeTrigger: string;

}