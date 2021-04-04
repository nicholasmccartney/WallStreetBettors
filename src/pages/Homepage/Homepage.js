import React from 'react'
import Chart from "react-apexcharts";
import "./Homepage.css"
import { getTickerData } from '../../api/api.js'
import {series} from "./tempData.js"
import Search from './tickerSearch.js'
import axios from 'axios'

// Universal variables so that they can be used in the getCross function
// Since getSMA gets called twice for (5,20) this universal variable stores sma5 in the function 
// call since the sma20 function call would set it to 0 since nothing is returned 
var sma5 =[];
var sma20 = [];

function getSMA(data,period){
  var arr = [];
  var value = 0;
  for(var i = 0; i <= data.length - period; i++){
      if(arr[i-1]){
        arr.push({x:data[i+period-1].x,y:(arr[i-1].y * period - data[i-1].y[3] + data[i+period-1].y[3]) / period})
      } else{
        for(var j = i; j < i+period; j++){
          value += data[j].y[3]
        }
        arr.push({x:data[i+period-1].x,y:(value / period)})
        value = 0
      }
  }
    for(var i = 0; i < period - 1; i++){
      arr.unshift({x:"undefined",y:null})
    }
  
  getCross(arr,period);
  //console.log(data)
  //console.log(arr)
  return arr;
}
// getCross shows when the sma5 and sma20 cross it then takes into
// account the price and will buy or sell depending on previous action
function getCross(arr,period){
  var sma20Single, sma5Single;
  var cross , previousCross = false;
  var buy = true;
  var totalMoney =0;
  // setting the universal array variables to sma5, and sma20 equal to 
  // their respective calls
  if(period === 5) sma5 = arr;
  if(period === 20) sma20 = arr;
  
  // will iterate through the length of the sma20 array (all of the data points)
  for(var i =0; i < sma20.length; i++){

    // This checks if the values are undefined incase we get 
    // bad/missing data and just wont run anything in that case. 
    if((sma20[i] !==undefined && sma5[i] !== undefined)){

      //Setting objects equal to a single datapoint so the properties (x(date),y(price)) can be used
      sma20Single = Object.values(sma20[i]);
      sma5Single = Object.values(sma5[i]);
      
      // Checks if the values arent null. Due to it being '20 data pt simple moving average' 
      // before 20 data pts it is null
      if(sma20Single[1] !== null && sma5Single [1] !== null){
        
        // logic needs to be changed slightly incase sma5 starts greater than sma20
        // as it shows an instant buy but this will only impact the first run if the above is true
        if(sma5Single[1] > sma20Single[1]){
          cross = true;
        }
        if(sma5Single[1] < sma20Single[1]){
          cross = false;
        }

        // First time a cross is set to true (sma5 > sma20) then it will signal a cross and a buy must happen
        if(cross !== previousCross){
          // Then the previousCross signal is set to the same as the current cross signal it it can see 
          // when a change happens the next time for it to run
          previousCross = cross;
          console.log(`Lined Crossed at: ${sma5Single[0]}`);

          if(buy === true){
            //totalMoney variable once something is bought it set = to the -purchase price
            totalMoney -= sma5Single[1];
            console.log(`Buy! @ ${sma5Single[1]}`);
            buy = false;
          }else{
            // totamoney variable once something is sold is set = to the + sell price
            totalMoney += sma5Single[1]
            console.log(`Sell! @ ${sma5Single[1]}`);
            console.log(`profit: $${totalMoney} per share`)
            buy = true;
          }
        }
      }
    }
  }
}
class Homepage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ticker: '',
      data: null,
      sma: null,
      sma2: null
    }
  }

  handleChange = (data) => {
    this.setState({ticker: data.target.value})
  }
  handleSubmit = (event) => {
    event.preventDefault()
    var ticker = event.target[0].value;
    fetch(`/ticker/${ticker}`)
    .then(res => res.json())
    .then(data => {
      this.setState({
        data: data,
        sma: getSMA(data, 5),
        sma2: getSMA(data, 20)
      })
    })
  }
  
  render () {
    var options = {
      chart: {
        id: "candlestick",
      },
      yaxis: {
        labels: {
          style: {
            colors: ["#000000"],
          },
        },
      },
      // xaxis: {
      //   labels: {
      //   },
      // },
      markers:{
        size:1
      },
      stroke: {
        width:[1,5,5]
      },
    };
    return (
      <div className="App-header">
        <Search onSubmit={this.handleSubmit}/>
        <br/>
        {this.state.data !== null && this.state.sma !== null &&
        <Chart
          options={options}
          series={[
            {
              name:"close",
              type:"candlestick",
              data: this.state.data
            },
            {
              name:"sma5",
              type:"line",
              data: this.state.sma
            },
            {
              name:"sma20",
              type:"line",
              data: this.state.sma2
            }
          ]}
          type="line"
          className="candlestickchart"
          width="1200px"
          height="750px"
        />}
      </div>
    );

  }
}

export default Homepage;