var express = require('express');
var router = express.Router();
const stocks = require('../stocks');

// const databaseHandler = require('../db');
// let db;
//
// databaseHandler.openDatabase().then(function (result) {
//   db = result;
// }).catch(e => {
//   console.warn(e);
// });
//
// router.use(function initChecks (req, res, next) {
//   if (!db) {
//     return next(new Error("We are setting up our servers, Please hold on a second"));
//   }
//   next();
// })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Welcome to Smallcase");
});

router.post("/trade/", async function (req, res, next) {
  let body = req.body;
  let stockSymbol = body.trade;
  let stock = await stocks.getPrice(stockSymbol);
})

router.put("/trade/", async function (req, res, next) {

})

router.delete("/trade/", function (req, res, next) {

})

router.get("/portfolio", function (req, res, next) {

})

router.get("/holdings", function (req, res, next) {

})

router.get("/returns", function (req, res, next) {

})

module.exports = router;
