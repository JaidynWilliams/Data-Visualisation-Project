export async function loadData() {

    const rawData = await d3.csv(
        "../health_master_totals.csv",
        d => {

            const valueText = d.value.trim();
            const value = +valueText;

            if (
                valueText === "" ||
                !Number.isFinite(value)
            ) {
                return null;
            }

            return {
                country: d.country,
                year: +d.year,
                sex: d.sex,
                measure: d.measure,
                category: d.category,
                method: d.method,
                unit: d.unit,
                value: value
            };
        }
    );
    //sets are used for creating menus
    //excludes countries with no mortality data, China, etc, 
    const countries =
    [...new Set(
        rawData
            .filter(d => d.measure === "Mortality")
            .map(d => d.country)
    )]
    .sort();

    const years = [...new Set(rawData.map(d => d.year))]
        .sort((a, b) => a - b);

    const measures = [...new Set(rawData.map(d => d.measure))];

    const categories = [...new Set(rawData.map(d => d.category))];

    const sexes = [...new Set(rawData.map(d => d.sex))];

    const methods = [...new Set(rawData.map(d => d.method))];

    return {
        rawData,

        values: {
            country: countries,
            year: years,
            sex: sexes,
            method: methods,
            category: categories,
            measure: measures
        }
    };
}
    //used for filtering data, thought it would be better it go in this instead of extras
export function filterData(
    data,
    {
        country = null,
        year = null,
        measure = null,
        sex = null,
        method = null,
        category = null
    } = {}
) {
    return data.filter(d =>
        (country === null || d.country === country) &&
        (year === null || d.year === year) &&
        (measure === null || d.measure === measure) &&
        (sex === null || d.sex === sex) &&
        (method === null || d.method === method) &&
        (category === null || d.category === category)
    );
}