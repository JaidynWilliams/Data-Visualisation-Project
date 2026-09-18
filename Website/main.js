import { loadData } from "./loaddata.js";

const data = await loadData();

console.log("Main got:", data);