import fs from "fs/promises";
import chokidar from "chokidar";
import path from "path";

const configPath = path.join(process.cwd(), "config.json");

let config;

const loadConfig = async () => {
    try{       
       const newConfig = JSON.parse(await fs.readFile(configPath, "utf-8"));
       config = newConfig;
    } catch(err) {
        console.error(`Couldn't load config: ${err}`)
    }
}

const configWatcher = chokidar.watch(configPath, {
    ignoreInitial: true
})

configWatcher.on("change", loadConfig);

loadConfig();

const getConfig = () => config;

const reloadCommand = async (file, client) => {
    const filePath = path.join(process.cwd(), file);
    console.log(filePath)
    const command = await import(`${filePath}?t=${Date.now()}`);
    client.commands.set(command.default.name, command.default);
    console.log(`${path.basename(file)} re/loaded`)
}

const deleteCommand = (file, client) => {
    client.commands.delete(path.basename(file));
    console.log(`${path.basename(file)} deleted`);
}

const watchCommands = client => {
    const commandWatcher = chokidar.watch("./commands", {
        ignoreInitial: true
    })

    commandWatcher.on("change", file => reloadCommand(file, client));
    commandWatcher.on("unlink",file => deleteCommand(file, client));
}

export { loadConfig, getConfig, watchCommands };
