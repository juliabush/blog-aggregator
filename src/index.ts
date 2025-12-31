import { readConfig, setUser } from "./config";

function main() {
  setUser("Julia");
  const cfg = readConfig();
  console.log(cfg);
}

main();
