//stuff for chart 4 & 6.
//put this stuff here to keep tidy other files

import { setupChartMenus, getChartSelections } from "./menu.js";
import { setupChartEvents } from "./events.js";
import { filterData } from "./loaddata.js";
import { drawLineChart } from "./chart4.js";
import { drawRankingChart } from "./chart6.js";

export function initZacCharts(healthData) {
    setupChartMenus(4, healthData.values);
    setupChartMenus(6, healthData.values);

    d3.select("#chart-4-compare-select")
    .selectAll("option").data(["None", ...healthData.values.country]).join("option")
    .attr("value", (d) => d).text((d) => d);

    d3.select("#chart-6-compare-select")
    .selectAll("option").data(["None", ...healthData.values.country]).join("option")
    .attr("value", (d) => d).text((d) => d);

    d3.select("#chart-6-country-select")
    .selectAll("option").data(["None", ...healthData.values.country]).join("option")
    .attr("value", (d) => d).text((d) => d);

    function updateChart8() {
        const selections = getChartSelections(8);

        d3.select("#chart-8-method-select").property("disabled", selections.measure !== "Mortality");
        const method = selections.measure === "Mortality" ? selections.method : null;

        const compareCountry = d3.select("#chart-8-compare-select").property("value");

        const seriesFor = (country) => ({
            label: country,
            rows: filterData(healthData.rawData, {
                country, sex: selections.sex, method, category: "Total", measure: selections.measure
            })
        });

        drawLineChart(
            {
                main: seriesFor(selections.country),
                      compare: compareCountry !== "None" ? seriesFor(compareCountry) : null
            },
            selections.year
        );
    }

    function updateChart6() {
        const selections = getChartSelections(6);

        d3.select("#chart-6-method-select").property("disabled", selections.measure !== "Mortality");
        const method = selections.measure === "Mortality" ? selections.method : null;

        const rows = filterData(healthData.rawData, {
            year: selections.year, sex: selections.sex, method,
            category: "Total", measure: selections.measure
        }).map((d) => ({ country: d.country, value: d.value }));

        drawRankingChart(rows, {
            country: d3.select("#chart-6-country-select").property("value"),
                         compare: d3.select("#chart-6-compare-select").property("value"),
                         year: selections.year,
                         higherIsBetter: selections.measure !== "Mortality"
        });
    }

    setupChartEvents(4, updateChart8);
    d3.select("#chart-4-compare-select").on("change", updateChart8);
    setupChartEvents(6, updateChart9);
    d3.select("#chart-6-compare-select").on("change", updateChart9);
    d3.select("#chart-6-country-select").on("change", updateChart9);

    updateChart4();
    updateChart6();
}
