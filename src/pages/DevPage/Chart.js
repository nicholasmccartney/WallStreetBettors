import { createChart, TickMarkType } from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";

const dayjs = require("dayjs")

var rendered = false;
var smaToggle = false;
var chartObj = {sma: {}};

function makeChart(data, ref) {
  chartObj["data"] = data;
  var chart = createChart(ref.current, {
    width: 1000,
    height: 750,
  });
  chart.timeScale().fitContent();
  chartObj["chart"] = chart;
  var candleSeries = chart.addCandlestickSeries();
  candleSeries.setData(data);
  chartObj["candleSeries"] = candleSeries;
}

function clearSMA() {
    for (var series in chartObj["sma"]) {
      chartObj["chart"].removeSeries(chartObj["sma"][series]['series']);
    }
    chartObj['sma'] = {}
}

function toggleSMA() {
    smaToggle = !smaToggle
    for (var series in chartObj["sma"]) {
      chartObj["sma"][series]["series"].applyOptions({
          visible: smaToggle
      });
    }
}

function updateChartData(data) {
    clearSMA();
    chartObj["data"] = data;
    chartObj["candleSeries"].setData(data);
}

function addSMALine(count) {
    if(chartObj['sma'][count]) return; // prevent dupes

    chartObj['sma'][count] = {
        data: undefined,
        series: undefined
    }

    var smaData = calculateSMA(count)
    chartObj["sma"][count]["data"] = smaData;
    var smaLine = chartObj['chart'].addLineSeries({
      color: "rgba(4, 111, 232, 1)",
      lineWidth: 2,
    });
    smaLine.setData(smaData);
    chartObj["sma"][count]["series"] = smaLine;

    smaToggle = true;
}

function calculateSMA(count) {
  var data = chartObj["data"];
  var avg = function (data) {
    var sum = 0;
    for (var i = 0; i < data.length; i++) {
      sum += data[i].close;
    }
    return sum / data.length;
  };
  var result = [];
  for (var i = count - 1, len = data.length; i < len; i++) {
    var val = avg(data.slice(i - count + 1, i));
    result.push({ time: data[i].time, value: val });
  }
  return result;
}

function getCrosses() {
    var smallSMA = chartObj["sma"]["50"]['data']
    var largeSMA = chartObj["sma"]["200"]['data']

    var allSMA = {}
    smallSMA.forEach((x) => {
        if (!allSMA[x.time]) allSMA[x.time] = {};
        allSMA[x.time]['50'] = x.value
    });
    largeSMA.forEach((x) => {
        if (!allSMA[x.time]) allSMA[x.time] = {};
        allSMA[x.time]["200"] = x.value;
    })

    var crosses = []
    var markers = [];

    var prevDelta;
    var currentDelta;

    for(const [time, sma] of Object.entries(allSMA)) {
        var currentDelta = sma['50'] - sma['200'];

        if (currentDelta > 0 && prevDelta < 0) {
            console.log(`buy @ ${time}`)
            //buy
            markers.push({
              time: dayjs(time * 1000).format("YYYY-MM-DD hh:mm:ss"),
              position: "belowBar",
              color: "green",
              shape: "arrowUp",
              text: "Buy",
            });
        }
        if (currentDelta < 0 && prevDelta > 0) {

            console.log(`sell @ ${time}`);
            // sell
            markers.push({
              time: dayjs(time * 1000).format("YYYY-MM-DD hh:mm:ss"),
              position: "aboveBar",
              color: "red",
              shape: "arrowDown",
              text: "Sell",
            });
        }
        prevDelta = currentDelta
    }

    console.log(markers)

    //chartObj["candleSeries"].setMarkers(markers)
}

export {
  makeChart,
  updateChartData,
  addSMALine,
  clearSMA,
  getCrosses,
  toggleSMA,
};
