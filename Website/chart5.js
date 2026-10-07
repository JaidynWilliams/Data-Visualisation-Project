import {
    createTooltip,
    showTooltip,
    moveTooltip,
    hideTooltip
} from "./extras.js";


export function drawCountryMeasureBarChart(data, colours) {

    const width = 950;
    const height = 610;

    const margin = {
        top: 90,
        right: 30,
        bottom: 75,
        left: 85
    };

    const container = d3.select("#chart-5");
    container.selectAll("*").remove();

    const svg = container
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("role", "img");

    const usableData = data.filter(d =>
        d.category !== "Total" &&
        Number.isFinite(d.value)
    );

    if (usableData.length === 0) {
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height / 2)
            .attr("text-anchor", "middle")
            .text("No mortality data is available for this selection.");
        return;
    }

    const years = [...new Set(usableData.map(d => d.year))]
        .sort((a, b) => a - b)
        .slice(-5);

    const recentData = usableData.filter(d => years.includes(d.year));

    // Uses the five largest causes over the displayed years.
    const categories = d3.rollups(
        recentData,
        values => d3.sum(values, d => d.value),
        d => d.category
    )
        .sort((a, b) => d3.descending(a[1], b[1]))
        .slice(0, 5)
        .map(([category]) => category);

    const valuesByYearAndCategory = new Map(
        d3.rollups(
            recentData.filter(d => categories.includes(d.category)),
            values => d3.sum(values, d => d.value),
            d => d.year,
            d => d.category
        ).flatMap(([year, entries]) =>
            entries.map(([category, value]) => [
                `${year}|||${category}`,
                value
            ])
        )
    );

    const chartData = years.flatMap(year =>
        categories.map(category => ({
            year,
            category,
            value: valuesByYearAndCategory.get(
                `${year}|||${category}`
            ) ?? 0
        }))
    );

    const x0 = d3.scaleBand()
        .domain(years)
        .range([margin.left, width - margin.right])
        .paddingInner(0.2);

    const x1 = d3.scaleBand()
        .domain(categories)
        .range([0, x0.bandwidth()])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.value) || 1])
        .nice()
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x0).tickFormat(d3.format("d")));

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height - margin.top - margin.bottom) / 2 - margin.top)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .text("Deaths per 100,000 people");

    const tooltip = createTooltip();

    svg.append("g")
        .selectAll("rect")
        .data(chartData)
        .join("rect")
        .attr("x", d => x0(d.year) + x1(d.category))
        .attr("y", d => y(d.value))
        .attr("width", x1.bandwidth())
        .attr("height", d => height - margin.bottom - y(d.value))
        .attr("fill", d => colours(d.category))
        .on("mouseover", function(event, d) {
            d3.select(this).attr("opacity", 0.72);

            showTooltip(
                tooltip,
                event,
                `<strong>${d.category}</strong><br>
                ${d.year}: ${d3.format(",.1f")(d.value)}
                deaths per 100,000`
            );
        })
        .on("mousemove", function(event) {
            moveTooltip(tooltip, event);
        })
        .on("mouseout", function() {
            d3.select(this).attr("opacity", 1);
            hideTooltip(tooltip);
        });

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 28)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("Five leading mortality causes over the latest five years");

    const legend = svg.append("g")
        .attr("transform", `translate(${margin.left}, 50)`);

    categories.forEach((category, index) => {
        const item = legend.append("g")
            .attr("transform", `translate(${index * 165}, 0)`);

        item.append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", colours(category));

        item.append("text")
            .attr("x", 18)
            .attr("y", 10)
            .style("font-size", "11px")
            .text(
                category.length > 20
                    ? `${category.slice(0, 20)}…`
                    : category
            );
    });
}