import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  dbUrl: string;
  currentUserName: string;
};

export function setUser(currentUserName: string): void {
  const cfg: Config = { dbUrl: "...", currentUserName: "..." };
  fs.writeFileSync(
    os.homedir().path.join("~/.gaterconfig.json"),
    config_object(currentUserName)
  );
}
export function readConfig(): void {
  fs.readFileSync(
    os.homedir().path.join("~/.gaterconfig.json"),
    JSON.parse(config_object)
  );
}

function getConfigFilePath(): string {
  return path.join(os.homedir(), ".gaterconfig.json");
}

function writeConfig(cfg: Config): void {}

function validateConfig(rawConfig: any): Config {
  if (typeof rawConfig !== "object" || rawConfig === null) {
    throw new Error("Invalid config: not an object");
  }

  if (typeof rawConfig.db_url !== "string") {
    throw new Error("Invalid config: missing db_url");
  }

  const cfg: Config = {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };
  return cfg;
}
