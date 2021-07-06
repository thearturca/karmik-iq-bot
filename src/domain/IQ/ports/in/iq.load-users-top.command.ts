
export type order = "ASC" | "DESC";

export class IqLoadUsersTopCommand {
    constructor(
        private readonly _take: number,
        private readonly _order: order
    ) {}

    get take(): number {
            if (Number.isNaN(this._take) || this._take === undefined || this._take === 0) {
                return 5;
            }
            if (this._take > 10) {
                return 10;
            }

        return this._take;
    }

    get order(): order {
        return this._order;
    }
}