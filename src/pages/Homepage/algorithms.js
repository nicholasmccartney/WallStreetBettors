function getSMA(data, period) {
  var arr = [];
  var value = 0;
  for (var i = 0; i <= data.length - period; i++) {
    if (arr[i - 1]) {
      arr.push({
        x: data[i + period - 1].x,
        y:
          (arr[i - 1].y * period -
            data[i - 1].y[3] +
            data[i + period - 1].y[3]) /
          period,
      });
    } else if (data[i].y[3] !== null) {
      for (var j = i; j < i + period; j++) {
        value += data[j].y[3];
      }
      arr.push({ x: data[i + period - 1].x, y: value / period });
      value = 0;
    }
  }
  var length = arr.length + 1;
  for (var i = 0; i < 101 - length; i++) {
    arr.unshift({ x: "undefined", y: null });
  }
  return arr;
}

function getCandleEMA(data, period) {
  var multiplier = 2 / (1 + period);
  var ema = getSMA(data, period);
  for (var i = period - 1; i < data.length; i++) {
    if (ema[i - 1].y) {
      ema[i].y = (data[i].y[3] - ema[i - 1].y) * multiplier + ema[i - 1].y;
    }
  }
  return ema;
}

function linetocandle(data) {
  var candledata = [];
  for (var i = 0; i < data.length; i++) {
    candledata.push({
      x: data[i].x,
      y: [null, null, null, data[i].y],
    });
  }
  return candledata;
}

function getMACD(data, period1, period2) {
  var macd = [];
  var greater = period1 > period2 ? period1 : period2;
  var ema26 = getCandleEMA(data, period1);
  var ema12 = getCandleEMA(data, period2);
  for (var i = 0; i < greater; i++) {
    macd.push({
      x: data[i].x,
      y: null,
    });
  }
  for (var i = greater; i < data.length; i++) {
    macd.push({ x: ema26[i].x, y: ema12[i].y - ema26[i].y });
  }
  return macd;
}

function getHistogram(data1, data2) {
  var histData = [];
  for (var i = 0; i < data1.length; i++) {
    if (data1[i].y !== null && data2[i].y !== null) {
      histData.push({
        x: data1[i].x,
        y: data1[i].y - data2[i].y,
      });
    } else {
      histData.push({
        x: "undefined",
        y: null,
      });
    }
  }
  return histData;
}

export { getSMA , getCandleEMA, linetocandle, getMACD, getHistogram };