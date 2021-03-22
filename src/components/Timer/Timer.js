import React, { useState, useEffect } from 'react'
import './timer.css'

export default function Timer(props) {

    const [time, setTime] = useState(0)

    useEffect(() => {
        var marketTimer = setInterval(() => {
            var now = new Date();
            var nextTime = new Date(props.compareDate);
            var difference = nextTime.getTime() - now.getTime();
    
            var seconds = Math.floor(difference/1000)
            var minutes = Math.floor(seconds / 60)
            var hours = Math.floor(minutes / 60)

            hours %= 24
            minutes %= 60
            seconds %= 60

            setTime({"hours": hours, "minutes": minutes, "seconds": seconds})
        }, 1000);
        return () => clearInterval(marketTimer)
    });

    if (time["hours"] === 0 && time["minutes"] === 0 && time["seconds"] === 0) {
        console.log("fetch market status")
        setTime(0)
        props.resetTimer();
    }
    if (time !== 0) {
      return (
        <div className="timer">
          {time["hours"]}:{time["minutes"]}:{time["seconds"]}
        </div>
      );
    } else {
      return null;
    }
}