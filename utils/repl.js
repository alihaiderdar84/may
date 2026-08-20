import repl from "node:repl";
import { Writable, PassThrough } from "node:stream";

const sessions = new Map();

const createSession = (userId, context) => {
  if (sessions.has(userId))
    return {
      error: "You already have an active REPL",
    };

  const server = repl.start({
    prompt: "",
    input: new PassThrough(),
    output: new Writable({
      write(_, __, cb) {
        cb();
      },
    }),
    terminal: false,
  });

  Object.assign(server.context, context);

  sessions.set(userId, {
    server
  });

  return { server };
};

const getSession = (userId) => sessions.get(userId);

const deleteSession = (userId) => {
  const session = getSession(userId);

  if (!session) return false;
  session.server.close();
  return sessions.delete(userId);
};

const evaluate = async (userId, code) =>
  new Promise((resolve, reject) => {
    const session = getSession(userId);

    if (!session) return reject(new Error("No active REPL session"));

    session.server.eval(code, session.server.context, "repl", (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });

export { createSession, getSession, deleteSession, evaluate };
