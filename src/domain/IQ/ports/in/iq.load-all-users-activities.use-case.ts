import { IqActivityWindowEntity } from "../../entities/iq.activity-window.entity";


export interface IqLoadAllUsersActivitiesUseCase {
    loadAllUsersActivities(): Promise<IqActivityWindowEntity>;
}