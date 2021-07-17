import { IqActivityWindowEntity } from "../../entities/iq.activity-window.entity";


export interface IqLoadAllUsersActivitiesPort {
    loadAllUsersActivities(): Promise<IqActivityWindowEntity>;
}