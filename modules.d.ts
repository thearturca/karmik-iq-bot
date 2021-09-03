declare namespace NodeJS {
    export interface ProcessEnv {
        TWITCH_USERNAME: string;
        TWITCH_OAUTH: string;
        TWITCH_TARGET_CHANNEL?: string;
    }
  }