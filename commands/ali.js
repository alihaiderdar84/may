import { logError } from "../utils/logError.js";
export default {
    name: "ali",
    description: "test command",
    execute(client, msg, args) {
        throw new Error("way too goated");
    }
}