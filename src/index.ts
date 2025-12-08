import { setUser, readConfig } from "./config.js";

function main() {
  setUser("Julia");
  readConfig();
}

main();
