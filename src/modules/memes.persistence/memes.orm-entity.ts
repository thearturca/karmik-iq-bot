import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MemesTypes } from "../../domain/memes/entities/memes.factory-entity";
import { MemesTriggersOrmEntity } from "./memes.triggers.orm-entity";

@Entity("Memes")
export class MemesOrmEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => MemesTriggersOrmEntity, trigger => trigger.memeTrigger)
    memeTrigger: MemesTriggersOrmEntity;

    @Column({
        type: "simple-enum",
        enum: MemesTypes,
        nullable: false
    })
    meme: MemesTypes;
}