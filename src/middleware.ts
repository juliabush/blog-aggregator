import type { User } from "./db/queries/users";
import type { CommandHandler } from "./commandHandler";

type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;
