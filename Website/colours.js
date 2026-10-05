export function createCategoryColours(categories) {

    const palette = [
        "#4E79A7",
        "#F28E2B",
        "#E15759",
        "#76B7B2",
        "#59A14F",
        "#EDC948",
        "#B07AA1",
        "#FF9DA7",
        "#9C755F",
        "#BAB0AC",

        "#86BCB6",
        "#D4A6C8",
        "#A0CBE8",
        "#FFBE7D",
        "#8CD17D",
        "#B6992D",
        "#499894",
        "#D37295",
        "#79706E"
    ];

    return d3.scaleOrdinal()
        .domain(categories)
        .range(palette);
}