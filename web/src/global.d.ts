export declare global {
    // extending javascript's window object to accommodate
    // config variable (window.config) found in public/config.js
    interface Window {
        readonly config: EnvConfig;
    }

    interface EnvConfig {
        MAPBOX_TOKEN: string,
    }
}
