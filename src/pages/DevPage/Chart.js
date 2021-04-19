import { createChart } from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";

var rendered = false;
var chartObj = {sma: {}};

function makeChart(data, ref) {
  chartObj["data"] = data;
  var chart = createChart(ref.current, {
    width: 1000,
    height: 750,
  });
  chartObj["chart"] = chart;
  chart.timeScale().fitContent();
  var candleSeries = chart.addCandlestickSeries();
  candleSeries.setData(data);
  chartObj["candleSeries"] = candleSeries;
}

function clearSMA() {
    for (var series in chartObj["sma"]) {
      chartObj["chart"].removeSeries(chartObj["sma"][series]);
    }
    chartObj['sma'] = {}
}

function updateChartData(data) {
    clearSMA();
    chartObj["data"] = data;
    chartObj["candleSeries"].setData(data);
}

function addSMALine(count) {
    if(chartObj['sma'][count]) return; // prevent dupes

    var smaData = calculateSMA(count)
    var smaLine = chartObj['chart'].addLineSeries({
      color: "rgba(4, 111, 232, 1)",
      lineWidth: 2,
    });
    smaLine.setData(smaData);
    chartObj['sma'][count] = smaLine
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
    var smallSMA = chartObj["sma"]["50"]
    var largeSMA = chartObj["sma"]["200"]

    

}

export { makeChart, updateChartData, addSMALine, clearSMA };
