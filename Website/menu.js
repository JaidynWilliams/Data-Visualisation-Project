export function setupChart1Menus(healthData) {
    setupSelect("#country-select", healthData.countries);
    setupSelect("#sex-select", healthData.sexes);
    setupSelect(
        "#method-select",
        healthData.methods.filter(d => d !== "")
    );

    setupYearSlider(healthData.years);
}

export function getChart1Selections() {
    return {
        country: document.querySelector("#country-select").value,
        year: +document.querySelector("#year-slider").value,
        sex: document.querySelector("#sex-select").value,
        method: document.querySelector("#method-select").value
    };
}


function setupSelect(selector, values) {
    d3.select(selector)
        .selectAll("option")
        .data(values)
        .join("option")
        .attr("value", d => d)
        .text(d => d);
}


function setupYearSlider(years) {
    const slider = d3.select("#year-slider");

    slider
        .attr("min", d3.min(years))
        .attr("max", d3.max(years))
        .property("value", d3.max(years));

    d3.select("#year-value")
        .text(d3.max(years));

    slider.on("input", function () {
        d3.select("#year-value")
            .text(this.value);
    });
}
