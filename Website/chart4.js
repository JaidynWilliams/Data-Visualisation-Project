import {
    createTooltip,
    showTooltip,
    moveTooltip,
    hideTooltip
} from "./extras.js";

export function drawStackedBarChart(data, colours) {

    const width = 1000;
    const height = 900;

    const margin = {
        top: 70,
        right: 30,
        bottom: 50,
        left: 140
    };

    d3.select("#chart-4")
        .selectAll("*")
        .remove();

    const svg = d3.select("#chart-4")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    if (data.length === 0) {
        return;
    }

    //find the largest causes in the selected data
    const causeTotals = d3.rollups(
        data,
        values => d3.sum(values, d => d.value),
        d => d.category
    )
    .filter(d => d[0] !== "Total")
    .sort((a, b) => b[1] - a[1]);

    const mainCauses = causeTotals
        .slice(0, 3)
        .map(d => d[0]);

    const countries = [...new Set(
        data
            .filter(d => d.category !== "Total")
            .map(d => d.country)
    )]
    .sort();

    const groupedData = [];

    countries.forEach(function(country) {

        const countryData = data.filter(function(d) {
            return d.country === country
                && d.category !== "Total";
        });

        const total = d3.sum(
            countryData,
            d => d.value
        );

        const row = {
            country: country,
            total: total
        };

        mainCauses.forEach(function(cause) {

            const value = d3.sum(
                countryData.filter(function(d) {
                    return d.category === cause;
                }),
                d => d.value
            );

            row[cause] = total > 0
                ? (value / total) * 100
                : 0;
        });

        const mainTotal = d3.sum(
            mainCauses,
            cause => row[cause]
        );

        row.Other = Math.max(0, 100 - mainTotal);

        groupedData.push(row);
    });

    const causes = [
        ...mainCauses,
        "Other"
    ];

    const x = d3.scaleLinear()
        .domain([0, 100])
        .range([
            margin.left,
            width - margin.right
        ]);

    const y = d3.scaleBand()
        .domain(countries)
        .range([
            margin.top,
            height - margin.bottom
        ])
        .padding(0.2);

    svg.append("g")
        .attr(
            "transform",
            `translate(0, ${height - margin.bottom})`
        )
        .call(
            d3.axisBottom(x)
                .ticks(10)
                .tickFormat(d => d + "%")
        );

    svg.append("g")
        .attr(
            "transform",
            `translate(${margin.left}, 0)`
        )
        .call(d3.axisLeft(y));

    const tooltip = createTooltip();

    groupedData.forEach(function(row) {

        let start = 0;

        causes.forEach(function(cause) {

            const value = row[cause];

            svg.append("rect")
                .attr("x", x(start))
                .attr("y", y(row.country))
                .attr("width", x(start + value) - x(start))
                .attr("height", y.bandwidth())
                .attr("fill", cause === "Other"
                    ? "#cccccc"
                    : colours(cause)
                )
                .on("mouseover", function(event) {

                    d3.select(this)
                        .attr("opacity", 0.7);

                    showTooltip(
                        tooltip,
                        event,
                        `
                            <strong>${row.country}</strong><br>
                            ${cause}: ${value.toFixed(1)}%
                        `
                    );
                })
                .on("mousemove", function(event) {

                    moveTooltip(
                        tooltip,
                        event
                    );
                })
                .on("mouseout", function() {

                    d3.select(this)
                        .attr("opacity", 1);

                    hideTooltip(tooltip);
                });

            start += value;
        });
    });

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("Mortality composition by country");

    const legend = svg.append("g")
        .attr("transform", `translate(${margin.left}, 40)`);

    causes.forEach(function(cause, i) {

        const legendItem = legend.append("g")
            .attr(
                "transform",
                `translate(${i * 220}, 0)`
            );

        legendItem.append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", cause === "Other"
                ? "#cccccc"
                : colours(cause)
            );

        legendItem.append("text")
            .attr("x", 18)
            .attr("y", 10)
            .style("font-size", "12px")
            .text(cause);
    });
}
