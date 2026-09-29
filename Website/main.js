import { loadData, filterData } from "./loaddata.js";
import {setupChart1Menus, getChart1Selections} from "./menu.js";

import { drawPieChart } from "./chart1.js";


// 1. Load data
const healthData = await loadData();


// 2. Build the menus
setupChart1Menus(healthData);


// 3. Define what happens when the chart updates
function updateChart1() {

    const selections = getChart1Selections();

    const filteredData = filterData(
        healthData.rawData,
        {
            country: selections.country,
            year: selections.year,
            sex: selections.sex,
            method: selections.method,
            measure: "Mortality"
        }
    );

    drawPieChart(filteredData);
}


// 4. Connect controls to updateChart1
document
    .querySelector("#country-select")
    .addEventListener("change", updateChart1);

document
    .querySelector("#sex-select")
    .addEventListener("change", updateChart1);

document
    .querySelector("#method-select")
    .addEventListener("change", updateChart1);

document
    .querySelector("#year-slider")
    .addEventListener("input", updateChart1);


// 5. Draw the chart once when the page first loads
updateChart1();