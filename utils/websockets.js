import WebSocket from "ws";
import { log, logError } from "./logs.js";
import { EventEmitter } from "node:events";

let ws = null;
const bot = new EventEmitter();

let attempt = 0;
let reconnectTimer = null;
let wsState = "";

const connect = () => {
  ws = new WebSocket(process.env.SERVER);

  ws.on("error", logError);

  ws.on("open", async () => {
    attempt = 0;
    ws.send(JSON.stringify({ type: "auth", content: process.env.SECRET_KEY }));
    log("Websocket connected");
    wsState = "connected";
  });

  ws.on("close", (code, reason) => {
    logError(code, reason.toString());
    
    wsState = "reconnecting"
    attempt++;

    const delay = Math.min(1000 * 2 ** (attempt - 1) + Math.random() * 1000, 30000);

    reconnectTimer = setTimeout(connect, delay);
  });

  ws.on("message", (message) => {
    const { type, content } = JSON.parse(message);

    switch (type) {
      case "authorise":
        bot.emit(type, content);
        break;
      case "shellCreate":
        bot.emit(type, content);
        break;
      case "shellDelete":
        bot.emit(type, content);
        break;
      case "commandExecute":
        bot.emit(type, content);
        break;
      case "error":
        bot.emit(type, content);
    }
  });
};

const createShell = () => {
  ws.send(JSON.stringify({ type: "init" }));
};

const deleteShell = () => {
  ws.send(JSON.stringify({ type: "kill" }));
};

const executeCommand = (cmd) => {
  ws.send(JSON.stringify({ type: "cmd", content: cmd }));
};

export { bot, wsState, connect, createShell, deleteShell, executeCommand };
