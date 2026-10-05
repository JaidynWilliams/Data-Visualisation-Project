import {
    createTooltip,
    showTooltip,
    moveTooltip,
    hideTooltip
} from "./extras.js";

export function drawPieChart(data, colours) {

    const width = 500;
    const height = 500;
    const radius = Math.min(width, height) / 2;
    const total = d3.sum(data, d => d.value);

    const tooltip = createTooltip();
    d3.select("#chart-1")
        .selectAll("*")
        .remove();


    const svg = d3.select("#chart-1")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


    const chartGroup = svg.append("g")
        .attr(
            "transform",
            `translate(${width / 2}, ${height / 2})`
        );


    const pie = d3.pie()
        .value(d => d.value);


    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);


    const pieData = pie(data);


    chartGroup
        .selectAll("path")
        .data(pieData)
        .join("path")
        .attr("d", arc)
        .attr(
            "fill",
            d => colours(d.data.category)
        )

        .on("mouseover", function(event, d) {

            d3.select(this)
                .attr("opacity", 0.7);

            showTooltip(
                tooltip,
                event,
                    `
                        <strong>${d.data.category}</strong><br>
                        ${((d.data.value / total) * 100).toFixed(1)}%
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
}