

export class GuardAdapter {
    private _isTimedout: boolean;
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

        get isTimedout(): boolean {
            return this._isTimedout;
        }

        set setIsTimedout(val: boolean) {
            this._isTimedout = val;
        }

        get cooldownSec(): number {
            return this._cooldownSec;
        }

        public startTimeout(duration: number): void {
            console.log(`I'm timedout. Waiting for ${duration} seconds...`);
            this.setIsTimedout = true;
            setTimeout(() => {
                this.setIsTimedout = false;
                console.log("Timeout is over. Waiting for messages...");
            }, duration * 1000);
        }

        public updateCooldownTime(): void {
            const curTime = Date.now();
            this.setCooldownTime = curTime + this.cooldownSec * 1000;
        }

        public maySendResponse(): boolean {
            if (this._isTimedout) {console.log(this.isTimedout);return false;} 
            const curTime = Date.now();
            if (curTime >= this.cooldownTime) {
                return true;
            }
            return false;
        }
}