import React, { useContext, useState } from "react";
import { UserContext } from "../../providers/UserProvider";
import "./Watchlist.css";
const queryString = require("query-string");

function getWatchlistTickers(tickers, setWatchlist) {
  if (tickers === undefined) return;
  
  var query = queryString.stringify({ tickers: tickers.toString() });
  fetch(`/watchlist${query !== "" ? "?" + query : ""}`)
    .then((res) => res.json())
    .then((data) => {
        setWatchlist(data.map((x) => {
            return <div key={x.ticker} className={x.delta > 0 ? "positive" : "negative"}>
                {x.ticker}{" | "}{x.price}
            </div>
        }))
    });
}

function Watchlist() {
  const user = useContext(UserContext);
  const [watchlist, setWatchlist] = useState("");

  if (user === null || user === undefined) {
    return null;
  } else {
    if (watchlist === "") {
      getWatchlistTickers(user.watchlist, setWatchlist);
    }

    return (
        <div className="watchlist-bar">
            {watchlist}
        </div>
    );
  }
}

export default Watchlist;
