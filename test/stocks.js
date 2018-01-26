const expect = require('chai').expect;
const stocks = require('../stocks');

describe('getPrice()', () => {

  it ('should return price between 0 and 100', function () {
    return stocks.getPrice("smallcase").then(function (result) {
      console.log(result);
      expect(result.price > 0 && result.price <= 1000).to.be.equal(true);
    }).catch (function (e) {
      throw e;
    });
  });

  it ('should throw error if symbol is null', function () {
    return stocks.getPrice().then(function (result) {
      throw new Error("Test should be failing");
    }).catch (function (e) {
      expect(true).to.be.equal(trueg);
    });
  });
});
