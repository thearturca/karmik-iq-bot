import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity("User", {})
@Unique(["username"])
@Unique(["userdisplayname"])
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