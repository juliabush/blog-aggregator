import { CommandHandler } from "./commandHandler";

export type CommandsRegistry = Record<string, CommandHandler>;
// mapping names to functions, key is command name, value is handler

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler
): void {
  registry[cmdName] = handler;
}

export function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Command "${cmdName}" does not exist`);
  }

  handler(cmdName, ...args);
}
