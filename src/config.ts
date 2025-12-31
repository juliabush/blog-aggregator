import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  dbUrl: string;
  currentUserName: string;
};

export function setUser(currentUserName: string): void {
  const cfg = readConfig();
  cfg.currentUserName = currentUserName;
  writeConfig(cfg);
}
export function readConfig(): Config {
  const rawText = fs.readFileSync(getConfigFilePath(), "utf-8");
  const rawJson = JSON.parse(rawText);
  return validateConfig(rawJson);
}

function getConfigFilePath(): string {
  return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(cfg: Config): void {
  const raw = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };
  fs.writeFileSync(getConfigFilePath(), JSON.stringify(raw, null, 2), "utf-8");
}

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
