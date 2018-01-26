// A layer for getting price of stocks.
module.exports = {
  getPrice: function (stockSymbol) {

    // Just a mock, Can replace with yahoo finance or google finance api later
    return Promise.resolve({"price": Math.floor((Math.random() * 1000) + 1)});
  }
}
