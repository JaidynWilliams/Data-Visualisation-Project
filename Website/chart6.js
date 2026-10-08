// ranked dot plot

import { createTooltip, showTooltip, moveTooltip, hideTooltip } from "./extras.js";

const ROLE_COLOUR = { main: "#4E79A7", compare: "#E15759" };
const tooltip = createTooltip();


export function drawRankingChart(rows, { country, compare, year, higherIsBetter }) {
    const width = 680;
    const margin = { top: 42, right: 50, bottom: 30, left: 170 };
    const innerW = width - margin.left - margin.right;
    const BAND = 20;

    const container = d3.select("#chart-6");
    container.selectAll("*").remove();


    if (rows.length === 0) {
        container.append("svg").attr("width", width).attr("height", 80)
            .append("text").attr("x", width / 2).attr("y", 40).attr("text-anchor", "middle")
            .text("No data for this selection");
        return;
    }

    const ranked = d3.sort(rows, (a, b) =>
        higherIsBetter ? d3.descending(a.value, b.value) : d3.ascending(a.value, b.value)
    );


    const innerH = BAND * ranked.length;
    const height = margin.top + innerH + margin.bottom;

    const svg = container.append("svg").attr("width", width).attr("height", height);
    const plot = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const [lo, hi] = d3.extent(ranked, (d) => d.value);
    const pad = (hi - lo) * 0.08 || 1;
    const x = d3.scaleLinear().domain([lo - pad, hi + pad]).range([0, innerW]).nice();
    const y = d3.scaleBand().domain(ranked.map((d) => d.country)).range([0, innerH]).paddingInner(0);

    // gridlines + top axis
    const xTicks = x.ticks(6);
    plot.append("g").selectAll("line").data(xTicks).join("line")
        .attr("x1", (d) => x(d)).attr("x2", (d) => x(d)).attr("y1", 0).attr("y2", innerH)
        .attr("stroke", "#eee");
    plot.append("g").call(d3.axisTop(x).tickValues(xTicks).tickFormat(d3.format(",")));

    const roleOf = (c) => (c === country ? "main" : c === compare ? "compare" : null);


    // avrg line
    const avg = d3.mean(ranked, (d) => d.value);
    plot.append("line")
        .attr("x1", x(avg)).attr("x2", x(avg)).attr("y1", 0).attr("y2", innerH)
        .attr("stroke", "#999").attr("stroke-dasharray", "5 4");
    plot.append("text").attr("x", x(avg)).attr("y", innerH + 16).attr("text-anchor", "middle")
        .style("font-size", "11px").style("fill", "#999")
        .text(`Average ${d3.format(",.1f")(avg)}`);

    const row = plot.selectAll("g.row").data(ranked, (d) => d.country).join("g")
        .attr("class", "row")
        .attr("transform", (d) => `translate(0,${y(d.country)})`);

    row.append("line")
        .attr("x1", 0).attr("x2", innerW).attr("y1", BAND / 2).attr("y2", BAND / 2)
        .attr("stroke", "#f0f0f0");

    row.append("text")
        .attr("x", -10).attr("y", BAND / 2).attr("dy", "0.35em").attr("text-anchor", "end")
        .style("font-size", "11px")
        .style("font-weight", (d) => (roleOf(d.country) ? "bold" : "normal"))
        .style("fill", (d) => ROLE_COLOUR[roleOf(d.country)] ?? "#333")
        .text((d) => d.country);



    row.append("circle")
        .attr("cx", (d) => x(d.value)).attr("cy", BAND / 2)
        .attr("r", (d) => (roleOf(d.country) ? 6 : 4))
        .attr("fill", (d) => ROLE_COLOUR[roleOf(d.country)] ?? "#6b7785")
        .style("cursor", "pointer")
        .on("mouseover", (event, d) => showTooltip(tooltip, event, `<strong>${d.country}</strong><br>${year}: ${d3.format(",.1f")(d.value)}`))
        .on("mousemove", (event) => moveTooltip(tooltip, event))
        .on("mouseout", () => hideTooltip(tooltip));

    svg.append("text").attr("x", width / 2).attr("y", 14).attr("text-anchor", "middle")
        .style("font-size", "13px").style("font-weight", "bold")
        .text(`Ranked, ${year} - ${higherIsBetter ? "highest" : "lowest"} (best) at the top`);
}
