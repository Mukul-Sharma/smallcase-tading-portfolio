var expect = require('chai').expect;
const db = require('../db');

describe('openDatabase()', function () {
  it ('should create database', function () {
    return db.openDatabase().then(function (database) {
      expect(database).to.not.equal(null);
    }).catch (function (e) {
      throw e;
    });
  })
});

describe('insert()', function () {
  it ('should insert element in database ', function () {
    return db.openDatabase().then(function (database) {
      return db.insert(database, "test", {a: 1}).then(function (r) {

        expect(r.result.n).to.be.equal(1);
      }).catch(function (e) {
        throw e;
      })
    }).catch (function (e) {
      throw e;
    })
  })
});

describe('insertMany()', function () {
  it ('should insert 3 element', function () {
    return db.openDatabase().then(function (database) {
      return db.insertMany(database, "test", [{a: 1}, {b: 1}, {c: 1}]).then(function (r) {

        expect(r.result.n).to.be.equal(3);
      }).catch(function (e) {
        throw e;
      })
    }).catch (function (e) {
      throw e;
    })
  })
});

describe('find()', function () {
  it ('should find all elements', function () {
    return db.openDatabase().then(function (database) {
      return db.find(database, "test").then(function (r) {

        expect(r.length).to.not.equal(0);
      }).catch(function (e) {
        throw e;
      })
    }).catch (function (e) {
      throw e;
    })
  })
});

describe('remove()', function () {
  it ('should remove one element', function () {
    return db.openDatabase().then(function (database) {
      return db.remove(database, "test", {a: 1}).then(function (r) {

        expect(r.result.n).to.be.equal(1);
      }).catch(function (e) {
        throw e;
      })
    }).catch (function (e) {
      throw e;
    })
  })
});

describe('update()', function () {
  it ('should remove one element', function () {
    return db.openDatabase().then(function (database) {
      return db.update(database, "test", {a: 1}, {a: 2}).then(function (r) {

        expect(r.result.n).to.be.equal(1);
      }).catch(function (e) {
        throw e;
      })
    }).catch (function (e) {
      throw e;
    })
  })
});

describe('aggregate()', function () {
  it ('should return aggregate of all', function () {
    return db.openDatabase().then(function (database) {

      return db.insertMany(database, "test", [{a: 1}, {a: 2}, {a: 3}]).then(function (r) {

        return db.aggregate(database, "test", {}, {"_id": "$a", "total": {"$sum": 1}}).then(function (r) {
            expect(r).to.be.ok;
        });

      }).catch(function (e) {
        throw e;
      })
    }).catch (function (e) {
      throw e;
    })

  })
});
