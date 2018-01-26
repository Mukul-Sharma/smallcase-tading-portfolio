var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'smallcase' });
});

router.post("/trade/", function (req, res, next) {

})

router.put("/trade/", function (req, res, next) {

})

router.delete("/trade/", function (req, res, next) {

})

route.get("/portfolio", function (req, res, next) {

})

router.get("/holdings", function (req, res, next) {

})

router.get("/returns", function (req, res, next) {

})

module.exports = router;
