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

    @Column({default: 100})
    iq: number;

    @Column({default: 3})
    maxTryNumber: number;
}