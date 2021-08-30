var stockSymbolList = [];
var stockList = [];
const commission = 100000;
const cashReserve = .1;

export async function main(ns) {
    ns.disableLog("ALL");
    stockSymbolList = [];
    stockList = [];

    await buildStockList(ns);

    while(true) {


    }
}

function getAllStocks(ns) {
    return ns.getStockSymbols();
}

function buildStock(ns, symbol) {
    var stock = {
        instance: ns,
        symbol: symbol,
        priceHistory: [],
        maxShares: function() { return this.instance.getStockMaxShares(this.symbol); },
        currentPosition: function() { return this.instance.getStockPosition(this.symbol);},
        askPrice: function() { return this.instance.getStockAskPrice(this.symbol); },
        bidPrice: function() { return this.instance.getStockBidPrice(this.symbol); },
        sharesOwned: function() { var position = this.currentPosition(); return position[0]; },
        averagePrice: function() { var position = this.currentPosition(); return position[1]; },
        totalCost: function() { var position = this.currentPosition(); return position[0] * position[1]; },
        totalValue: function() { var position = this.currentPosition(); return this.sharesOwned() * this.bidPrice(); },
        volatility: function() { return this.instance.getStockVolatility(this.symbol); },
        forecast: function() { return this.instance.getStockForecast(this.symbol); },
        shouldBuy: function() { return (this.forecast() >= .6 && this.isRising()); },
        buy: function(shares) { var result = false; if(this.instance.buyStock(this.symbol, shares) > 0) {result=true} return result; },
        buyMax: function() {
            var sharesNeeded = this.maxShares() - this.sharesOwned();
            var currentMoney = this.instance.getServerMoneyAvailable("home");
            var sharesCanBuy = currentMoney / this.askPrice();
            var sharesToBuy = (sharesNeeded < sharesCanBuy? sharesNeeded: sharesCanBuy);

            var success = this.instance.buyStock(this.symbol, sharesToBuy);
            return (success > 0 ? true : false);
        },
        sellAll: function() { return this.instance.sellStock(this.symbol, this.sharesOwned())},
        movingAverage: function(points) {
            var value = 0;
            var length = this.priceHistory.length;
            for(var i = 1; i <= points; i++) {
                value += this.priceHistory[length-i];
            }
            return value/points;
        },
        updatePriceHistory: function(price) {
            this.priceHistory.push(price);
            if(this.priceHistory.length > 42) {
                this.priceHistory.shift();
            }
        },
        isRising: function() {
            return (this.movingAverage(10) > this.movingAverage(40) ? true : false);
        }
    }
}

async function buildStockList(ns) {
    stockSymbolList = getAllStocks(ns);
    for(var i = 0; i < stockSymbolList.length; i++) {
        stockList.push(buildStock(ns, stockSymbolList[i]));
        await ns.sleep(100);
    }
}

async function buyStock(ns, stock, shares) {
    if(ns.buyStock(stock.symbol, shares) > 0) {
        return true;
    }
    return false;
}