import { loadData, filterData } from "./loaddata.js";
import { setupChartMenus, getChartSelections } from "./menu.js";
import { setupChartEvents } from "./events.js";

import { createCategoryColours } from "./colours.js";

import { drawPieChart } from "./chart1.js";
import { drawLineChart } from "./chart2.js";
import { drawBarChart } from "./chart3.js";
import { drawStackedBarChart } from "./chart4.js";
import { drawCountryMeasureBarChart } from "./chart5.js";

import { initZacCharts } from "./chartzac.js";

//loads data from csv into sets & values
const healthData = await loadData();
//
const categoryColours =
    createCategoryColours(
        healthData.values.category
    );

//sets up the menus with the sets
setupChartMenus(1, healthData.values);
setupChartMenus(2, healthData.values);
setupChartMenus(3, healthData.values);
setupChartMenus(4, healthData.values);
setupChartMenus(5, healthData.values);

//functions that do whatever the charts needs each update
function updateChart1() {

    const selections =
        getChartSelections(1);

    let data =
        filterData(
            healthData.rawData,
            {
                country: selections.country,
                year: selections.year,
                sex: selections.sex,
                method: selections.method,
                measure: "Mortality"
            }
        );

    data = data.filter(
        d => d.category !== "Total"
    );

    drawPieChart(
        data,
        categoryColours
    );
}


function updateChart2() {

    const selections =
        getChartSelections(2);

    const data =
        filterData(
            healthData.rawData,
            {
                country: selections.country,
                sex: selections.sex,
                category: selections.category,
                measure: "Mortality"
            }
        );

    drawLineChart(
        data,
        categoryColours
    );
}


function updateChart3() {

    const selections =
        getChartSelections(3);

    const data =
        filterData(
            healthData.rawData,
            {
                year: selections.year,
                sex: selections.sex,
                method: selections.method,
                measure: "Mortality"
            }
        );

    drawBarChart(
        data,
        categoryColours
    );
}

function updateChart4() {
    const selections = getChartSelections(4);

    const data = filterData(
        healthData.rawData,
        {
            year: selections.year,
            sex: selections.sex,
            method: selections.method,
            measure: "Mortality"
        }
    );

    drawStackedBarChart(data, categoryColours);
}

function updateChart5() {

    const selections = getChartSelections(5);

    let data = filterData(
        healthData.rawData,
        {
            country: selections.country,
            sex: selections.sex,
            method: selections.method,
            measure: "Mortality"
        }
    );

    data = data.filter(d => d.category !== "Total");

    drawCountryMeasureBarChart(
        data,
        categoryColours
    );
}


setupChartEvents(1, updateChart1);
setupChartEvents(2, updateChart2);
setupChartEvents(3, updateChart3);
setupChartEvents(4, updateChart4);
setupChartEvents(5, updateChart5);



updateChart1();
updateChart2();
updateChart3();
updateChart4();
updateChart5();

initZacCharts(healthData);
