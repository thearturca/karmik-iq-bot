import { IqActivityWindowEntity } from "../../entities/iq.activity-window.entity";


export interface IqLoadUserActivitiesPort {
    loadActivities(username: string): Promise<IqActivityWindowEntity>
}