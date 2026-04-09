import fs from "fs/promises";
import { watch } from "fs";
import path from "path";

const configPath = path.join(process.cwd(), "config.json");

let config;

const loadConfig = async () => {
    try{
       const newConfig = JSON.parse(await fs.readFile(configPath, "utf-8"));
       config = newConfig;
       console.log("Config reloaded");
    } catch(err) {
        console.error(`Couldn't load config: ${err}`)
    }
}

watch(configPath, async e => {
    if (e === "change") loadConfig;
})

loadConfig;

export const getConfig = () => config;