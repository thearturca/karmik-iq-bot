import { IqEntity } from "./iq.entity";


export class IqTestResultEntity {
    constructor(
        private readonly _status: string,
        private readonly _iq: IqEntity
    ) {}
}