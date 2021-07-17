import { IqActivityWindowEntity } from "../entities/iq.activity-window.entity";
import { IqLoadAllUsersActivitiesUseCase } from "../ports/in/iq.load-all-users-activities.use-case";
import { IqLoadAllUsersActivitiesPort } from "../ports/out/iq.load-all-users-activities.port";


export  class IqLoadAllUsersActivitiesService implements IqLoadAllUsersActivitiesUseCase {
    constructor(
        private readonly _iqLoadAllUsersActivitiesPort: IqLoadAllUsersActivitiesPort
    ) {}

    async loadAllUsersActivities(): Promise<IqActivityWindowEntity> {
        return this._iqLoadAllUsersActivitiesPort.loadAllUsersActivities();
    }
}