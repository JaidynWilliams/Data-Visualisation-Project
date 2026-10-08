//stuff for chart 8 & 9.
//put this stuff here to keep tidy other files

import { setupChartMenus, getChartSelections } from "./menu.js";
import { setupChartEvents } from "./events.js";
import { filterData } from "./loaddata.js";
import { drawLineChart } from "./chart8.js";
import { drawRankingChart } from "./chart9.js";

export function initZacCharts(healthData) {
    setupChartMenus(8, healthData.values);
    setupChartMenus(9, healthData.values);

    d3.select("#chart-8-compare-select")
    .selectAll("option").data(["None", ...healthData.values.country]).join("option")
    .attr("value", (d) => d).text((d) => d);

    d3.select("#chart-9-compare-select")
    .selectAll("option").data(["None", ...healthData.values.country]).join("option")
    .attr("value", (d) => d).text((d) => d);

    d3.select("#chart-9-country-select")
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

    function updateChart9() {
        const selections = getChartSelections(9);

        d3.select("#chart-9-method-select").property("disabled", selections.measure !== "Mortality");
        const method = selections.measure === "Mortality" ? selections.method : null;

        const rows = filterData(healthData.rawData, {
            year: selections.year, sex: selections.sex, method,
            category: "Total", measure: selections.measure
        }).map((d) => ({ country: d.country, value: d.value }));

        drawRankingChart(rows, {
            country: d3.select("#chart-9-country-select").property("value"),
                         compare: d3.select("#chart-9-compare-select").property("value"),
                         year: selections.year,
                         higherIsBetter: selections.measure !== "Mortality"
        });
    }

    setupChartEvents(8, updateChart8);
    d3.select("#chart-8-compare-select").on("change", updateChart8);
    setupChartEvents(9, updateChart9);
    d3.select("#chart-9-compare-select").on("change", updateChart9);
    d3.select("#chart-9-country-select").on("change", updateChart9);

    updateChart8();
    updateChart9();
}
