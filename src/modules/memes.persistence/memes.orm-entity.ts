import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MemesTriggersOrmEntity } from "./memes.triggers.orm-entity";

@Entity("MemesTriggers")
export class MemesOrmEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => MemesTriggersOrmEntity, trigger => trigger.memeTrigger)
    memeTrigger: MemesTriggersOrmEntity;

    @Column()
    meme: string;
}