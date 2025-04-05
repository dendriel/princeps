import {readFileSync} from "fs";
import {fileURLToPath} from "url";
import path from "path";


export class ServerConfig {
    constructor(public cards: string[]) {}
}

export class ConfigLoader {
    public static load(configFile: string): ServerConfig {

        const filename = fileURLToPath(import.meta.url);
        const dirname = path.dirname(filename);
        const configPath = path.join(dirname, configFile);

        const data = readFileSync(configPath);
        return JSON.parse(data.toString()) as ServerConfig;
    }
}