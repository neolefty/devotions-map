import {GetEnvConfig} from "./GetEnvConfig"

export class Config {
    static readonly mapboxToken = GetEnvConfig().mapboxToken
    static readonly mapboxStyleUrl = GetEnvConfig().mapboxStyleUrl
    static readonly region = GetEnvConfig().region
    static readonly firebaseConfig = GetEnvConfig().firebaseConfig
}
