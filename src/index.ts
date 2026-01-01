import { readConfig, setUser } from "./config";
import {
  handlerLogin,
  handlerRegisterUser,
  handlerReset,
  handlerUsers,
  handlerAgg,
  addfeed,
} from "./commandHandler";
import type { CommandsRegistry } from "./commandRegistry";
import { runCommand } from "./commandRegistry";

// import { exit } from "node:process";

async function main() {
  const registry: CommandsRegistry = {
    login: handlerLogin,
    register: handlerRegisterUser,
    reset: handlerReset,
    users: handlerUsers,
    agg: handlerAgg,
    addFeed: addfeed,
  };

  const sliced_cli = process.argv.slice(2);
  if (sliced_cli.length === 0) {
    console.error("More arguments ae required");
    process.exit(1);
  }

  const cmdName = sliced_cli[0];
  const argArray = sliced_cli.slice(1);

  try {
    await runCommand(registry, cmdName, ...argArray);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
