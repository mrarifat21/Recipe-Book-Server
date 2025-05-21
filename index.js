const express = require('express')
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();

const app = express()
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());



// ==========
const uri = `mongodb+srv://${process.env.TUSER}:${process.env.TPASS}@tastelog01.h0mab5r.mongodb.net/?retryWrites=true&w=majority&appName=tastelog01`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const recipesCollection = client.db("recipeDB").collection("addrecipes");





    app.get('/addrecipes', async(req,res)=>{
      const result =await recipesCollection.find().toArray();
      res.send(result);
    })

    //  send recipe to the database
    app.post('/addrecipes', async(req,res)=>{
      const newRecipe = req.body;
      console.log(newRecipe);
      const result = await recipesCollection.insertOne(newRecipe);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// ========


app.get('/', (req, res) => {
  res.send('Your food is cooking')
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
