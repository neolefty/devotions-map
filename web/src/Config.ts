export const GetEnvConfig = (): EnvConfig => window.config

export class Config {
    public static readonly mapboxToken = GetEnvConfig().mapboxToken
    public static readonly mapboxStyleUrl = GetEnvConfig().mapboxStyleUrl
}
