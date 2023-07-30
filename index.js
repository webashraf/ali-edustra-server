const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://aliEdustra:ZsVJ6cGZ1Th5vByh@cluster0.ugvzoq2.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    const userCollection = client.db("usersCollection").collection("users");
    const noticeCollection = client.db("usersCollection").collection("notice");

    app.post("/addUser", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result)
    })

    app.get('/user', async (req, res) => {
      const email = req.query.email;
      const query = { userEmail: email }
      const result = await userCollection.findOne(query);
      res.send(result);
    })

    app.post('/addNotice', async (req, res) => {
      const notice = req.body;
      const result = await noticeCollection.insertOne(notice);
      res.send(result);
    })

    app.get('/my-notice', async (req, res) => {
      const email = req?.query?.email;
      // console.log(email);
      const query = { email: email }
      const result = await noticeCollection.find(query).toArray();
      res.send(result);
    })

    app.get('/find-single-notice/:id', async(req, res) => {
      const noticeId = req.params.id;
      console.log(noticeId);
      const query = {_id: new ObjectId(noticeId)};
      const result = await noticeCollection.findOne(query);
      res.send(result);
    })

    // delete notice item
    app.delete('/delete-notice/:id', async (req, res) => {
      const noticeId = req.params.id;
      console.log(noticeId);
      const query = { _id: new ObjectId(noticeId) }
      const result = noticeCollection.deleteOne(query);
      res.send(result)
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












app.get("/", (req, res) => {
  res.send("Edustra is running")
})

app.listen(port, (req, res) => {
  console.log(`http://localhost:${port}`)
})