// extras.js


export function createTooltip() {

    return d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("pointer-events", "none");
}


export function showTooltip(
    tooltip,
    event,
    content
) {

    tooltip
        .html(content)
        .style("visibility", "visible")
        .style("left", `${event.pageX + 12}px`)
        .style("top", `${event.pageY + 12}px`);
}


export function moveTooltip(
    tooltip,
    event
) {

    tooltip
        .style("left", `${event.pageX + 12}px`)
        .style("top", `${event.pageY + 12}px`);
}


export function hideTooltip(tooltip) {

    tooltip
        .style("visibility", "hidden");
}

