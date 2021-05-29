import React, { useState, useContext } from "react";
import Widget from "./Widget"
import TradingViewWidget, {Themes} from "react-tradingview-widget";
import TradingPanel from "./TradingPanel"
import { UserContext } from "../../providers/UserProvider";

function getWatchlist(tickers, setWatchList) {
  if(tickers === undefined) return;

  fetch(`/exchanges?tickers=${tickers}`)
  .then((res) => res.json())
  .then(data => {
    console.log(data)
    setWatchList(data)
  })
} 

export default function DevPage() {

  const user = useContext(UserContext);
  const [watchlist, setWatchList] = useState("")

  if (watchlist === "") {
      getWatchlist(user.watchlist, setWatchList);
  }

  console.log(watchlist)
  return (
    <div className="App-header">
      <br />
      <TradingViewWidget
        symbol="BTCUSD"
        theme={Themes.DARK}
        studies={[
          "MASimple@tv-basicstudies",
        ]}
        watchlist={[
          'SPY','GME'
        ]}
        hide_side_toolbar={false}
        details={true}
        withdateranges={true}
        interval={5}
        width={1500}
      />
      <TradingPanel />
    </div>
  );
}
