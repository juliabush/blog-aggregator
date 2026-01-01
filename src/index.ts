import { readConfig, setUser } from "./config";
import { handlerLogin } from "./commandHandler";
import type { CommandsRegistry } from "./commandRegistry";
import { runCommand } from "./commandRegistry";

import { exit } from "node:process";

function main() {
  setUser("Julia");
  const registry: CommandsRegistry = {
    login: handlerLogin,
  };
  let sliced_cli = process.argv.slice(2);
  if (sliced_cli.length === 0) {
    console.error("More arguments ae required");
    process.exit(1);
  }
  const cmdName = sliced_cli[0];
  const argArray = sliced_cli.slice(1);
  runCommand(registry, cmdName, ...argArray);
}

main();
