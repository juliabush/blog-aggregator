import { setUser, readConfig } from "../config.js";

function main() {
  setUser("Julia");
  const cfg = readConfig();
  console.log(cfg);
}

main();
