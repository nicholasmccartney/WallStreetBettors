import React, { useState } from "react";
import Widget from "./Widget"
import TradingViewWidget, {Themes} from "react-tradingview-widget";
import TradingPanel from "./TradingPanel"


export default function DevPage() {



  return (
    <div className="App-header">
      <br/>
      <TradingViewWidget symbol="BTCUSD" theme={Themes.DARK} studies={[]} interval={5}/>
      <TradingPanel/>
    </div>
  );
}
