export const GetEnvConfig = (): EnvConfig => window.config

export class Config {
    public static readonly mapboxKey = GetEnvConfig().MAPBOX_TOKEN
}
