const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

let db;
MongoClient.connect(
  "mongodb+srv://fouad:foodiepassword@cluster0.pimnh.mongodb.net",
  (error, client) => {
    db = client.db("webstore");
  }
);

app.get("/", (req, res, next) => {
  res.send("Select a collection e.g. /collection/messages");
});

app.param("collectionName", (req, res, next, collectionName) => {
  req.collection = db.collection(collectionName);
  return next();
});

app.post("/collection/:collectionName", (req, res, next) => {
  const body = req.body;
  req.collection.insert(body, (e, results) => {
    res.send(results.ops);
  });
});

app.get("/collection/:collectionName/:id", (req, res, next) => {
  const id = req.params.id;
  console.log("id: " + id);
  req.collection.findOne(
    {
      _id: new ObjectID(id),
    },
    (e, product) => {
      if (e) {
        return console.log(error);
      }
      res.send(product);
    }
  );
});

app.put("/collection/:collectionName/:id", (req, res, next) => {
  const body = req.body;
  const id = req.params.id;
  req.collection.update(
    {
      _id: new ObjectID(id),
    },
    {
      multi: false,
      safe: true,
    },
    body,
    (e, result) => {
      if (e) {
        return next(e);
      }
      res.send({
        message:
          result.result.n == 1
            ? "Product Updated Successfuly!"
            : "Error occurred while updating product",
      });
    }
  );
});

app.get("/collection/:collectionName", (req, res, next) => {
  req.collection.find({}).toArray((error, results) => {
    if (error) {
      return next(e);
    } else {
      res.send(results);
    }
  });
});

app.delete("/collection/:collectionName/:id", (req, res, next) => {
  req.collection.deleteOne(
    {
      _id: new ObjectID(req.params.id),
    },
    (e, result) => {
      res.send(
        result.result.n == 1
          ? "Record deleted successfully"
          : "Error occurred while deleting record"
      );
    }
  );
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("omo, wahala for all of you, i don wake!");
});
