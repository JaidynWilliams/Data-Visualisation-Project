export const chartMenus = {

    1: ["country", "sex", "method"],
    2: ["country", "sex", "method", "measure"],
    3: ["sex", "method"],
    4: ["sex", "method"],
    5: ["country", "sex", "method"],
    6: ["sex", "method", "measure"]
};


export function setupChartMenus(chartNumber, values) {

    const controls = chartMenus[chartNumber];

    controls.forEach(control => {

        setupSelect(
            `#chart-${chartNumber}-${control}-select`,
            values[control]
        );

    });

    setupYearSlider(
        chartNumber,
        values.year
    );
}


export function getChartSelections(chartNumber) {

    const controls = chartMenus[chartNumber];

    const selections = {};

    controls.forEach(control => {

        const select =
            document.querySelector(
                `#chart-${chartNumber}-${control}-select`
            );

        selections[control] =
            select.value;

    });


    const slider =
        document.querySelector(
            `#chart-${chartNumber}-year-slider`
        );

    selections.year =
        +slider.value;


    return selections;
}


function setupSelect(selector, values) {

    d3.select(selector)
        .selectAll("option")
        .data(values)
        .join("option")
        .attr("value", d => d)
        .text(d => d);
}


function setupYearSlider(chartNumber, years) {

    const slider =
        d3.select(
            `#chart-${chartNumber}-year-slider`
        );


    slider
        .attr("min", d3.min(years))
        .attr("max", d3.max(years))
        .attr("step", 1)
        .property("value", d3.max(years));


    d3.select(
        `#chart-${chartNumber}-year-value`
    )
        .text(d3.max(years));


    slider.on("input", function () {

        d3.select(
            `#chart-${chartNumber}-year-value`
        )
        .text(this.value);

    });
}
