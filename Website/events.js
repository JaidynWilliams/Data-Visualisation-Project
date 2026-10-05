import { chartMenus } from "./menu.js";


export function setupChartEvents(
    chartNumber,
    updateFunction
) {

    const controls =
        chartMenus[chartNumber];


    controls.forEach(control => {

        document
            .querySelector(
                `#chart-${chartNumber}-${control}-select`
            )
            .addEventListener(
                "change",
                updateFunction
            );

    });


    document
        .querySelector(
            `#chart-${chartNumber}-year-slider`
        )
        .addEventListener(
            "input",
            updateFunction
        );
}