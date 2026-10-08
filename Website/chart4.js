// line chart with country comparison(country vs. country over time).

import { createTooltip, showTooltip, moveTooltip, hideTooltip } from "./extras.js";

const ROLE_COLOUR = { main: "#4E79A7", compare: "#E15759" };
const tooltip = createTooltip();

export function drawLineChart({ main, compare }, markerYear, yearExtent) {
    const width = 700, height = 450;
    const margin = { top: 40, right: 30, bottom: 50, left: 70 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;



    d3.select("#chart-4").selectAll("*").remove();
    const svg = d3.select("#chart-4").append("svg").attr("width", width).attr("height", height);
    const plot = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const series = [{ ...main, role: "main" }, ...(compare ? [{ ...compare, role: "compare" }] : [])];

    if (series.every((s) => s.rows.length === 0)) {
        plot.append("text").attr("x", innerW / 2).attr("y", innerH / 2)
            .attr("text-anchor", "middle").text("No data for this selection");
        return;
    }

    const byYear = series.map((s) => d3.index(s.rows, (r) => r.year));
    const [minYear, maxYear] = yearExtent ?? d3.extent(series.flatMap((s) => s.rows), (d) => d.year);
    const years = d3.range(minYear, maxYear + 1);
    const points = series.map((s, i) => ({
        ...s,
        values: years.map((year) => ({ year, value: byYear[i].get(year)?.value ?? null }))
    }));


    const x = d3.scaleLinear().domain([minYear, maxYear]).range([0, innerW]);
    const y = d3.scaleLinear()
        .domain([0, d3.max(points, (s) => d3.max(s.values, (d) => d.value)) * 1.1])
        .nice().range([innerH, 0]);

    plot.append("g").attr("transform", `translate(0,${innerH})`).call(d3.axisBottom(x).tickFormat(d3.format("d")));
    plot.append("g").call(d3.axisLeft(y));
    svg.append("text")
        .attr("x", -(margin.top + innerH / 2)).attr("y", 14).attr("transform", "rotate(-90)").attr("text-anchor", "middle")
        .style("font-size", "12px").text(main.rows[0]?.unit ?? "");

    const line = d3.line().defined((d) => d.value != null).x((d) => x(d.year)).y((d) => y(d.value));

    plot.selectAll("path.series").data(points, (d) => d.label).join("path")
        .attr("class", "series").attr("fill", "none")
        .attr("stroke", (d) => ROLE_COLOUR[d.role]).attr("stroke-width", 2.5)
        .attr("d", (d) => line(d.values));


    points.forEach((s) => {
        plot.selectAll(`circle.pt-${s.role}`).data(s.values.filter((d) => d.value != null)).join("circle")
            .attr("class", `pt-${s.role}`).attr("cx", (d) => x(d.year)).attr("cy", (d) => y(d.value)).attr("r", 3.5)
            .attr("fill", ROLE_COLOUR[s.role]).style("cursor", "pointer")
            .on("mouseover", (event, d) => showTooltip(tooltip, event, `<strong>${s.label}</strong><br>${d.year}: ${d.value}`))
            .on("mousemove", (event) => moveTooltip(tooltip, event))
            .on("mouseout", () => hideTooltip(tooltip));
    });


    if (markerYear >= minYear && markerYear <= maxYear) {
        plot.append("line").attr("x1", x(markerYear)).attr("x2", x(markerYear))
            .attr("y1", 0).attr("y2", innerH).attr("stroke", "#999").attr("stroke-dasharray", "4 3");
    }



    const legend = svg.append("g").attr("transform", `translate(${margin.left},16)`);
    points.forEach((s, i) => {
        const g = legend.append("g").attr("transform", `translate(${i * 180},0)`);
        g.append("line").attr("x1", 0).attr("x2", 20).attr("stroke", ROLE_COLOUR[s.role]).attr("stroke-width", 2.5);
        g.append("text").attr("x", 26).attr("y", 4).style("font-size", "12px").text(s.label);
    });
}
