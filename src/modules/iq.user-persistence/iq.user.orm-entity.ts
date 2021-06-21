import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("User", {})
export class IqUserOrmEntity {
    @PrimaryGeneratedColumn()   
    id: number;

    @Column()
    username: string;

    @Column()
    userdisplayname: string;

    @Column()
    iq: number;
}