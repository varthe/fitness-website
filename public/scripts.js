// sidebar

var sidebarOpen = false;
var sidebar = document.getElementById("sidebar");
var caloriesConsumed = 2489;
var totalCalories = 3000;
var caloriesPercentage = (caloriesConsumed / totalCalories) * 100;
var caloriesRemainingPlaceholder = document.getElementById("caloriesRemaining-placeholder");



function openSidebar() {
    if(!sidebarOpen) {
        sidebar.classList.add("sidebar-responsive");
        sidebarOpen = true;
    }
}

function closeSidebar() {
    if(sidebarOpen){
         sidebar.classList.remove("sidebar-responsive");
         sidebarOpen = false;
    }
}

// CHARTS
// RADIAL CHART

var radialBarOptions = {
    chart: {
      height: 280,
      type: "radialBar",
    },
    series: [caloriesPercentage],
    colors: ["#f5b74f"],
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: '#333',
          startAngle: -90,
          endAngle: 90,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "30px",
            show: true,
            formatter: function(val) {
                return Math.round(val) + "%";
            }
          }
        }
      }
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        gradientToColors: ["#f4580b"],
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: "butt"
    },
    labels: ["Progress"]
  };

  
  var radialBarChart = new ApexCharts(document.querySelector("#radial-chart"), radialBarOptions);
  
  radialBarChart.render();
  caloriesRemainingPlaceholder.innerHTML += "<span class='text-primary font-weight-bold'>" + (totalCalories - caloriesConsumed) + " </span>";  

// LINE AREA CHART

var lineChartOptions = {
    series: [{
    name: 'Your steps',
    data: [1380, 1732, 3221, 1421, 671, 1200,562]
  }, {
    name: 'User average steps',
    data: [1270, 1940, 2210, 1760, 1242, 900, 974]
  }],
    chart: {
    height: 350,
    type: 'area',
    toolbar: {
        show: false
    }
  },
  colors: ["#367952", "#666666"],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  }, 
  labels: ['Dec 01', 'Dec 02','Dec 03','Dec 04','Dec 05','Dec 06','Dec 07','Dec 08','Dec 09 ','Dec 10','Dec 11'],
  markers: {
    size: 0
  },
  yaxis: [
    {
      title: {
        text: 'Steps',
      },
    },
    {
      opposite: true,
    },
  ],
  tooltip: {
    shared: true,
    intersect: false,
  }
  };

  var lineChart = new ApexCharts(document.querySelector("#line-chart"), lineChartOptions);
  lineChart.render();


