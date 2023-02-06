function getLineChart(ctx, x, y, label){
    var chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: x,
            datasets: [{
                label: label,
                data: y,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
function getPolarAreaSummaryChart(ctx, dailyDistance, dailyCalories, dailySteps){
    var chart = new Chart(ctx, {
        type: "polarArea",
        data: {
            labels: ["Distance", "Calories", "Steps"],

            datasets: [{
                label: ["Percentage Completed"],
                data: [dailyDistance, dailyCalories, dailySteps],
                backgroundColor: ["rgba(54, 121, 82, 0.6)", "rgba(245, 183, 79, 0.6)", "rgba(36, 109, 236, 0.6)"]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    return chart;
}
function getCountryComparisonChart(ctx, country, dailyDistance, dailyCalories, dailySteps){

    //TODO need to retrieve data from country. possibly csv?

    const cdcSteps = 2243;
    const recommendedCalories =  2500;
    const distance = 10;

    const data = {
        labels: ["Distance", "Calories", "Steps"],
        datasets: [
            {
                label: "Average Person in " + country,
                data: [(5.4 / distance) * 100, (2034 / recommendedCalories) * 100, 67], //TODO need to parse data
                backgroundColor: "rgba(36, 176, 219, 0.6)"
            },
            {
                label: "You",
                data: [(dailyDistance / distance) * 100, (dailyCalories / recommendedCalories) * 100, Math.min(((dailySteps / cdcSteps) * 100), 100)],
                backgroundColor: "rgba(219, 79, 36, 0.6)"
            }
        ]
    };

    var chart = new Chart(ctx, {
        type: "radar",
        data: data,
        options: {
            responsive: true,
            scale: {
                min: 0,
                max: 100,
            },
            clip: 0
        }
    });
    return chart;

}


function getDoughnutCalorieChart(ctx, consumed, remaining){
    var chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Consumed", "Remaining"],  
            datasets: [
            {
                data: [consumed, remaining],
                backgroundColor: ["#f5b74f", "#F1F1F1"]
            }
            ]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            responsive: true,
        },
    });
    return chart;
}