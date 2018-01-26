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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Welcome to Smallcase");
});

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

router.get("/portfolio", function (req, res, next) {

})

router.get("/holdings", function (req, res, next) {

})

router.get("/returns", function (req, res, next) {

})

module.exports = router;
