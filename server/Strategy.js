class Strategy {
  constructor(ticker, interval, type) {
    this.ticker = ticker;
    this.interval = interval;
    this.type = type;
    this.strategy = initiateStrategy();
  }

  initiateStrategy;
}
