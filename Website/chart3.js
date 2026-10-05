export function drawBarChart(data, colours) {

    const width = 800;
    const height = 600;

    const margin = {
        top: 30,
        right: 30,
        bottom: 150,
        left: 70
    };


    d3.select("#chart-3")
        .selectAll("*")
        .remove();


    const svg = d3.select("#chart-3")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


    if (data.length === 0) {
        return;
    }


    //group rows by country
    const groupedData = d3.rollups(
        data,
        values => d3.sum(values, d => d.value),
        d => d.country
    )
    .map(([country, value]) => ({
        country,
        value
    }))
    .sort((a, b) => b.value - a.value);


    const x = d3.scaleBand()
        .domain(
            groupedData.map(d => d.country)
        )
        .range([
            margin.left,
            width - margin.right
        ])
        .padding(0.1);


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
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");


    svg.append("g")
        .attr(
            "transform",
            `translate(${margin.left}, 0)`
        )
        .call(d3.axisLeft(y));


    svg.selectAll("rect")
        .data(groupedData)
        .join("rect")
        .attr("x", d => x(d.country))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr(
            "height",
            d =>
                height -
                margin.bottom -
                y(d.value)
        );
}