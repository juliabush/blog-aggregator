import { setUser } from "./config";

type CommandHandler = (cmdName: string, ...args: string[]) => void;

function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    throw new Error("Commands array is empty");
  }
  const username = args[0];
  setUser(username);
  console.log("User has been set");
}
