import { IqActivityEntity } from "./iq.activity.entity";


export class IqActivityWindowEntity {
    private readonly _activities: IqActivityEntity[] = [];

    get activities(): IqActivityEntity[] {
        return this._activities;
    }

    addActivity(activity: IqActivityEntity) {
        this.activities.push(activity);
        return this.activities;
    }
}