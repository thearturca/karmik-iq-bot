
export type order = "ASC" | "DESC";

export class IqLoadUsersTopCommand {
    constructor(
        private readonly _take: number,
        private readonly _order: order
    ) {}

    get take(): number {
        return this._take;
    }

    get order(): order {
        return this._order;
    }
}