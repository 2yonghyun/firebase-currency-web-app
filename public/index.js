let aWeekFullData = null
let aWeekDateList = []
let aWeekValueList = []
let minValue = 0
let maxValue = 0
let tick = 0

document.addEventListener('DOMContentLoaded', function() {
  updateAWeekData('usd')
})

function updateAWeekData(currency) {
  var aWeekFullDataRef = firebase.database().ref('/currencies').limitToLast(7)
  aWeekFullDataRef.on('value', function(snapshot) {
    aWeekFullData = snapshot.val()
    updateAWeekDateList(aWeekFullData)
    updateAWeekValueList(aWeekFullData, currency)
    updateMinAndMaxValueFromList(aWeekValueList)
  })
}

function updateAWeekDateList(aWeekFullData) {
  aWeekDateList = []
  for(var key in aWeekFullData) {
    aWeekDateList.push(aWeekFullData[key].time.substring(5, 10))
  }
}

function updateAWeekValueList(aWeekFullData, currency) {
  aWeekValueList = []
  for(var key in aWeekFullData) {
    aWeekValueList.push(aWeekFullData[key][currency].value)
  }
}

function updateMinAndMaxValueFromList(aWeekValueList) {
  minValue = Math.min(...aWeekValueList)
  maxValue = Math.max(...aWeekValueList)
  tick = (maxValue - minValue) / 7
}

Vue.component("line-chart", {
  extends: VueChartJs.Line,
  props: ["data"],
  mounted() {
    this.renderLineChart()
  },
  computed: {
    chartData: function() {
      return this.data
    }
  },
  methods: {
    renderLineChart: function() {
      this.renderChart(
        this.chartData,
        {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
                ticks: {
                  min: minValue - tick,
                  max: maxValue + tick,
                  stepSize: tick,
                  callback: function(value, index, values) {
                    return value.toFixed(1)
                }
                }
            }]
          }
        }
      )      
    }
  },
  watch: {
    data: function() {
      this._chart.destroy()
      this.renderLineChart()
    }
  }
})
