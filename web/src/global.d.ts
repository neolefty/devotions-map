export declare global {
    // extending javascript's window object to accommodate
    // config variable (window.config) found in public/config.js
    interface Window {
        readonly config: EnvConfig;
    }

    interface EnvConfig {
        mapboxToken: string,
        mapboxStyleUrl: string,
        region: {
            sw: {lat: number, lng: number},
            ne: {lat: number, lng: number},
        }
    }
}
