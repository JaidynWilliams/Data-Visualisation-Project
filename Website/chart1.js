export function drawPieChart(data) {

    const width = 500;
    const height = 500;
    const radius = Math.min(width, height) / 2;

    d3.select("#chart")
        .selectAll("*")
        .remove();

    const svg = d3.select("#chart")
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

    const colour = d3.scaleOrdinal()
        .domain(data.map(d => d.category))
        .range([
            "#4e79a7",
            "#f28e2b",
            "#e15759",
            "#76b7b2",
            "#59a14f",
            "#edc948",
            "#b07aa1",
            "#ff9da7",
            "#9c755f",
            "#bab0ab",
            "#6b8e23",
            "#8a2be2",
            "#20b2aa",
            "#ff7f50",
            "#4682b4",
            "#daa520",
            "#cd5c5c",
            "#708090",
            "#2e8b57"
        ]);

    chartGroup.selectAll("path")
        .data(pieData)
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => colour(d.data.category));
}