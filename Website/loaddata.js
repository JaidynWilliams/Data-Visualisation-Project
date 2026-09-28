export async function loadData() {

    const rawData = await d3.csv(
        "../health_master_totals.csv",
        d => ({
            country: d.country,
            year: +d.year,
            sex: d.sex,
            measure: d.measure,
            category: d.category,
            method: d.method,
            unit: d.unit,
            value: +d.value
        })
    );

    const countries = [...new Set(rawData.map(d => d.country))].sort();

    const years = [...new Set(rawData.map(d => d.year))]
        .sort((a, b) => a - b);

    const measures = [...new Set(rawData.map(d => d.measure))];

    const categories = [...new Set(rawData.map(d => d.category))];

    const sexes = [...new Set(rawData.map(d => d.sex))];

    const methods = [...new Set(rawData.map(d => d.method))];


    return {
        rawData,
        countries,
        years,
        measures,
        categories,
        sexes,
        methods
    };
}