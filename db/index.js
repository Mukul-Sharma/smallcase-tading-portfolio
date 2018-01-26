const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const defaultDb = 'smallcase';

var client;

module.exports = {
  openDatabase: function (dbUrl, dbName) {
    if (!dbUrl) {
      dbUrl = url;
    }
    if (!dbName) {
      dbName = defaultDb;
    }
    return new Promise(function(resolve, reject) {
      // Use connect method to connect to the server
      MongoClient.connect(dbUrl, function(err, client) {
        if (err) {
          console.warn(err);
          reject(err);
          return;
        }
        console.log("Connected successfully to server");

        client = client;
        const db = client.db(dbName);
        resolve(db);
      });
    });
  },

  close: function () {
    client.close();
  },

  insert: function(db, collectionName, data) {
    // Get the documents collection
    if (!collectionName) {
      throw new Error("Colletion name cannot be empty");
    }

    if (!data) {
      throw new Error("Date cannot be empty during insert");
    }

    if (!db) {
      throw new Error("Database cannot be null");
    }


    return new Promise(function(resolve, reject) {
      const collection = db.collection(collectionName);
      collection.insertOne(data, function(err, result) {

        if (err) {
          reject(err);
        } else {
          resolve(result);
        }

      });
    });
  },

  insertMany: function(db, collectionName, data) {
    // Get the documents collection
    if (!collectionName) {
      throw new Error("Colletion name cannot be empty");
    }

    if (!data) {
      throw new Error("Date cannot be empty during insert");
    } else if (!data.length) {
      throw new Error("Data should be array with atlease one item")
    }

    if (!db) {
      throw new Error("Database cannot be null");
    }


    return new Promise(function(resolve, reject) {
      const collection = db.collection(collectionName);
      collection.insertMany(data, function(err, result) {

        if (err) {
          reject(err);
        } else {
          resolve(result);
        }

      });
    });
  },

  find: function(db, collectionName, query) {
    // Get the documents collection
    if (!collectionName) {
      throw new Error("Colletion name cannot be empty");
    }

    if (!query) {
      // Find all
      query = {};
    }

    if (!db) {
      throw new Error("Database cannot be null");
    }

    return new Promise(function(resolve, reject) {
      const collection = db.collection(collectionName);

      // Find some documents
      collection.find(query).toArray(function(err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

  },

  update: function(db, collectionName, query, newData) {
    if (!collectionName) {
      throw new Error("Colletion name cannot be empty");
    }

    if (!newData) {
      throw new Error("Date cannot be empty during insert");
    }

    if (!query || Object.keys(query).length == 0) {
      throw new Error("Update must have a valid query");
    }

    if (!db) {
      throw new Error("Database cannot be null");
    }

    return new Promise( function(resolve, reject) {

      const collection = db.collection(collectionName);

      collection.updateOne(query, { $set: newData }, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  updateMany: function(db, collectionName, query, newData) {
    if (!collectionName) {
      throw new Error("Colletion name cannot be empty");
    }

    if (!newData) {
      throw new Error("Date cannot be empty during insert");
    }

    if (!query || Object.keys(query).length == 0) {
      throw new Error("Update must have a valid query");
    }

    if (!db) {
      throw new Error("Database cannot be null");
    }

    return new Promise(function(resolve, reject) {

      const collection = db.collection(collectionName);

      collection.updateMany(query, { $set: newData }, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });

    });
  },

  remove: function(db, collectionName, query) {

    if (!collectionName) {
      throw new Error("Colletion name cannot be empty");
    }


    if (!query || Object.keys(query).length == 0) {
      throw new Error("Update must have a valid query");
    }

    if (!db) {
      throw new Error("Database cannot be null");
    }


    return new Promise(function(resolve, reject) {
      const collection = db.collection(collectionName);

      collection.deleteOne(query, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  // Index keys should be like {key: 1} 1 signals true
  indexCollection: function(db, collectionName, indexKeys) {
    db.collection(collectionName).createIndex(
      indexKeys,
      null,
      function(err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  }


}
