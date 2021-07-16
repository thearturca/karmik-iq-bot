

export class GuardAdapter {
    constructor (
        private readonly _cooldownSec: number = 5,
        private _cooldownTime: number = Date.now()
    ) {}

        get cooldownTime(): number {
            return this._cooldownTime;
        }

        set setCooldownTime(value: number) {
            this._cooldownTime = value;
        }

        get cooldownSec(): number {
            return this._cooldownSec;
        }

        public updateCooldownTime(): void {
            const curTime = Date.now();
            this.setCooldownTime= curTime + this.cooldownSec * 1000;
        }

        public maySendResponse(): boolean {
            const curTime = Date.now();
            if (curTime >= this.cooldownTime) {
                return true;
            }
            return false;
        }
}