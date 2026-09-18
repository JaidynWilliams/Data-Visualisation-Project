export async function loadData() {
    const data = await d3.csv("../OECD_health_mortality_total.csv");

    console.log("CSV loaded:", data);

    return data;
}