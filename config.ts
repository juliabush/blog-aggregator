import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  dbUrl: string;
  currentUserName: string;
};

export function setUser(currentUserName: string): Object {
  const cfg = Config = {
    cfg.currentUserName = currentUserName
  };
  fs.writeFileSync(os.homedir(".gaterconfig.json"), settings[])
}

export function readConfig() {
    fs.readFileSync(os.homedir(".gaterconfig.json"), new Config[])
}