const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.TUSER}:${process.env.TPASS}@tastelog01.h0mab5r.mongodb.net/?retryWrites=true&w=majority&appName=tastelog01`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const recipesCollection = client.db("recipeDB").collection("addrecipes");
    const userCollection = client.db("recipeDB").collection("users");

     //  ==================================
     //      Recipe related APIs
     //  ==================================

    //  ========Add a new recipe to the database========
    app.post("/addrecipes", async (req, res) => {
      const newRecipe = req.body;
      const result = await recipesCollection.insertOne(newRecipe);
      res.send(result);
    });
    
    app.get("/addrecipes", async (req, res) => {
      const result = await recipesCollection.find().toArray();
      res.send(result);
    });


    // ======== sort  top 6 recipe ========
    app.get("/top-recipe", async (req, res) => {
      const result = await recipesCollection
          .find()
          .sort({ likecount: -1 })
          .limit(6)
          .toArray();
        res.send(result);
    });

    
    app.get("/addrecipes/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };
      const result = await recipesCollection.findOne(quary);
      res.send(result);
    });

    //  ======== increase like count ========
    app.patch("/addrecipes/like/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $inc: { likecount: 1 },
      };
      const result = await recipesCollection.updateOne(filter, updateDoc);
      res.send({ message: "Like count updated successfully.", result });
    });



    // ======== Update a recipe ========
    app.put("/addrecipes/:id", async (req, res) => {
      const id = req.params.id;
      const updatedRecipe = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: updatedRecipe };

      await recipesCollection.updateOne(filter, updateDoc);
      const updated = await recipesCollection.findOne(filter);
      res.send(updated);
    });

    //  ======== Delete a recipe ========
    app.delete("/addrecipes/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await recipesCollection.deleteOne(query);
      res.send(result);
    });

    // ======== Get recipes for a specific user ========
    app.get("/myrecipes/:email", async (req, res) => {
      const userEmail = req.params.email;
      const query = { userEmail: userEmail };
      const result = await recipesCollection.find(query).toArray();
      res.send(result);
    });

      //  ==================================
      //      User related APIs
      //  ==================================

    //  ========get user form db========
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const userProfile = req.body;
      const result = await userCollection.insertOne(userProfile);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
  res.send("Your food is cooking");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
