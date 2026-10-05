export function drawLineChart(data, colours) {

    const width = 700;
    const height = 450;

    const margin = {
        top: 30,
        right: 30,
        bottom: 50,
        left: 70
    };


    d3.select("#chart-2")
        .selectAll("*")
        .remove();


    const svg = d3.select("#chart-2")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


    if (data.length === 0) {
        return;
    }


    //group rows by year
    const groupedData = d3.rollups(
        data,
        values => d3.sum(values, d => d.value),
        d => d.year
    )
    .map(([year, value]) => ({
        year,
        value
    }))
    .sort((a, b) => a.year - b.year);


    const x = d3.scaleLinear()
        .domain(d3.extent(groupedData, d => d.year))
        .range([
            margin.left,
            width - margin.right
        ]);


    const y = d3.scaleLinear()
        .domain([
            0,
            d3.max(groupedData, d => d.value)
        ])
        .nice()
        .range([
            height - margin.bottom,
            margin.top
        ]);


    svg.append("g")
        .attr(
            "transform",
            `translate(0, ${height - margin.bottom})`
        )
        .call(
            d3.axisBottom(x)
                .tickFormat(d3.format("d"))
        );


    svg.append("g")
        .attr(
            "transform",
            `translate(${margin.left}, 0)`
        )
        .call(d3.axisLeft(y));


    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.value));


    svg.append("path")
        .datum(groupedData)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("d", line);


    svg.selectAll("circle")
        .data(groupedData)
        .join("circle")
        .attr("cx", d => x(d.year))
        .attr("cy", d => y(d.value))
        .attr("r", 4);
}