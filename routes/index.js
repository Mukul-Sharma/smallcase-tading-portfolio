var express = require('express');
var router = express.Router();
const stocks = require('../stocks');
const TECH_ERROR_MESSGE = "We are facing technical difficulties, please try later";
const databaseHandler = require('../db');
let db;

databaseHandler.openDatabase().then(function (result) {
  db = result;
}).catch(e => {
  console.warn(e);
});

router.use(function initChecks (req, res, next) {
  if (!db) {
    return next(new Error("We are setting up our servers, Please hold on a second"));
  }
  next();
})

function techError(res) {
  res.status(500).send(TECH_ERROR_MESSGE);
}

router.get("/", async function (req, res, next) {
  try {
    let trades = await databaseHandler.find(db, "trade", {});
    if (!trades) {
      trades = [];
    }
    tradesBuy = trades.filter((trade) => trade.type == "buy");
    tradesSell = trades.filter((trade) => trade.type == "sell");

    res.send({
      success: true,
      data: {
        buys: tradesBuy,
        sells: tradesSell,
        total: trades.length
      }
    })
  } catch (e) {
    techError(res);
  }
})

router.post("/trade/", async function (req, res, next) {
  try {

    let body = req.body;
    let stockSymbol = body.stock;
    let amount = body.amount;
    if (!amount) {
      amount = 1;
    }
    let type = body.type;
    if (!type) {
      res.status(400).send("Missing trade type");
      return;
    }
    if (type != "buy" && type != "sell") {
      res.status(400).send("Only buy and sell type allowed");
      return;
    }
    let userPrice = body.price;

    let stock = await stocks.getPrice(stockSymbol);
    console.log("Current price of " + stockSymbol + " = " + stock.price);
    let price = stock.price;
    if (type == "sell" && body.price) {
      // User can decide to sell at lower price than market
      price = body.price;
    }
    let tradeEntry = {
      "user": "currentUserId",
      "stock": stockSymbol,
      "price": price,
      "amount": amount,
      "type": type,
      "time": new Date().toISOString()
    };
    let result = await databaseHandler.insert(db, "trade", tradeEntry);
    if (result.result.n == 1) {
      res.send({
        success: true,
        data: tradeEntry
      });
    } else {
      res.send({
        success: false,
        data: {}
      })
    }
  } catch (e) {
    console.warn(e);
    techError(res);
  }
})

router.put("/trade/", async function (req, res, next) {

  let body = req.body;
  let id = body.id;

  if (!id) {
    res.status(400).send("Missing trade id");
    return;
  }

  let amount = body.amount;
  if (!amount) {
    amount = 1;
  }
  let type = body.type;
  // update sell price only
  if (type != "sell") {
    res.status(403).send("Only sell prices can be updated");
    return;
  }
  let userPrice = body.price;

  let price = body.price;
  if (!body.price) {
    // If not passed updated price, Update from api
    let stock = await stocks.getPrice(stockSymbol);
    console.log("Current price of " + stockSymbol + " = " + stock.price);
    price = stock.price;
  }

  let tradeEntry = {
    "user": "currentUserId",
    "price": price,
    "amount": amount,
    "type": type,
    "time": new Date().toISOString()
  };

  console.log("Updating trade with id = " + id);
  try {
    let result = await databaseHandler.update(db, "trade", {"_id": id}, tradeEntry);

    if (result.result.n > 0) {
      res.send({
        success: true,
        data: result
      });
    } else {
      res.send({
        success: false,
        data: {}
      })
    }
  } catch (e) {
    console.warn(e);
    techError(res);
  }
})

router.delete("/trade/:id", async function (req, res, next) {
  let id = req.params.id;
  if (!id) {
    res.status(400).send("Missing trade id");
    return;
  }

  console.log("Deleting trade with id = " + id);
  try {
    let result = await databaseHandler.remove(db, "trade", {"_id": id});
    if (result.result.n > 0) {
      res.send({
        success: true,
        data: result
      });
    } else {
      res.send({
        success: false,
        data: {}
      })
    }
  } catch (e) {
    console.warn(e);
    techError(res);
  }
})

router.get("/holdings", async function (req, res, next) {
  try {
    let group = {
      "_id": "$stock",
      "average": {
        "$avg": "$price"
      }
    };
    let trades = await databaseHandler.aggregate(db, "trade", {"type": "buy"}, group);

    console.log(trades);

    if (!trades) {
      trades = [];
    }

    res.send({
      success: true,
      data: {
        holdings: trades
      }
    })
  } catch (e) {
    techError(res);
  }
})

router.get("/returns", async function (req, res, next) {
  try {
    let trades = await databaseHandler.find(db, "trade", {"type": "buy"});
    if (!trades) {
      res.send({
        success: true,
        data: {
          "return": []
        }
      })
      return;
    }

    // We will get the current price for each trade using the mock stocks api,
    // This will be an issue as we scale, We can use sockets instead to push data to user, or
    // Use pagination (Limit + Skip)
    // For now, we will keep a cache to store the current price, so that we dont have to compute it redundantly for the same stock

    let stockPrice = {};
    let results = [];

    trades.forEach(async function (trade, index) {
      let stock = trade.stock;
      let currentPrice = stockPrice[stock];
      if (!currentPrice) {
        currentPrice = await stocks.getPrice(stock);
      }
      let boughtPrice = trade.price;
      let diff = boughtPrice - currentPrice.price;
      let returnType = "stable";
      if (diff < 0) {
        returnType = "loss";
      } else if (diff > 0){
        returnType = "gain";
      }

      let result = {
        _id: trade._id,
        type: returnType,
        buyPrice: trade.price,
        currentPrice: currentPrice.price
      };

      results.push(result);

      if (index == trades.length - 1) {
        console.log(results);
        res.send({
          success: true,
          data: {
            "return": results
          }
        })
      }
    });
  } catch (e) {
    techError(res);
  }
})

module.exports = router;
