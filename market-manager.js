//Requires access to the TIX API and the 4S Mkt Data API

let fracL = 0.1;     //Fraction of assets to keep as cash in hand
let fracH = 0.2;
let commission = 100000; //Buy or sell commission
let numCycles = 2;   //Each cycle is 5 seconds

function refresh(ns, stocks, myStocks){
    let corpus = ns.getServerMoneyAvailable("home");
    myStocks.length = 0;
    for(let i = 0; i < stocks.length; i++){
        let sym = stocks[i].sym;
        stocks[i].price = ns.getStockPrice(sym);
        stocks[i].shares  = ns.getStockPosition(sym)[0];
        stocks[i].buyPrice = ns.getStockPosition(sym)[1];
        stocks[i].vol = ns.getStockVolatility(sym);
        stocks[i].prob = 2* (ns.getStockForecast(sym) - 0.5);
        stocks[i].expRet = stocks[i].vol * stocks[i].prob / 2;
        corpus += stocks[i].price * stocks[i].shares;
        if(stocks[i].shares > 0) myStocks.push(stocks[i]);
    }
    stocks.sort(function(a, b){return b.expRet - a.expRet});
    return corpus;
}

function buy(ns, stock, numShares){
    if(ns.buyStock(stock.sym, numShares) !== 0) {
        ns.print(`Bought ${format(numShares)} of ${stock.sym} for ${format(numShares * stock.price)}`);
    }
}

function sell(ns, stock, numShares){
    let profit = numShares * (stock.price - stock.buyPrice) - 2 * commission;
    ns.print(`Sold ${format(numShares)} of ${stock.sym} for profit of ${format(profit)}`);
    ns.sellStock(stock.sym, numShares);
}

function format(num){
    let symbols = ["","K","M","B","T","Qa","Qi","Sx","Sp","Oc"];
    let i = 0;
    let isNegative = true;
    if(Math.sign(num) > 0) {
        isNegative = false;
    }
    num = Math.abs(num);
    for(; (num >= 1000) && (i < symbols.length); i++) num /= 1000;
    
    return ( (isNegative)?"-":"") + num.toFixed(3) + symbols[i];
}


export async function main(ns) {
    //Initialise
    ns.disableLog("ALL");
    let stocks = [];
    let myStocks = [];
    let corpus = 0;
    for(let i = 0; i < ns.getStockSymbols().length; i++)
        stocks.push({sym:ns.getStockSymbols()[i]});
        
    while(true){
        corpus = refresh(ns, stocks, myStocks);
        
        //Sell underperforming shares
        for (let i = 0; i < myStocks.length; i++){
            if(stocks[0].expRet > myStocks[i].expRet){
                sell(ns, myStocks[i], myStocks[i].shares);
                corpus -= commission;
            }
        }
        //Sell shares if not enough cash in hand
        for (let i = 0; i < myStocks.length; i++){
            if( ns.getServerMoneyAvailable("home") < (fracL * corpus)){
                let cashNeeded = (corpus * fracH - ns.getServerMoneyAvailable("home") + commission);
                let numShares = Math.floor(cashNeeded/myStocks[i].price);
                sell(ns, myStocks[i], numShares);
                corpus -= commission;
            }
        }
        
        //Buy shares with cash remaining in hand
        let cashToSpend = ns.getServerMoneyAvailable("home") - (fracH * corpus);
        let numShares = Math.floor((cashToSpend - commission)/stocks[0].price);
        if ((numShares * stocks[0].expRet * stocks[0].price * numCycles) > commission)
            buy(ns, stocks[0], numShares);
        
        await ns.sleep(5 * 1000 * numCycles + 200);
    }
}