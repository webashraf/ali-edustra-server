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


const indexKey = { id: 1 }
const indexOption = { name: 'studentId' }

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const userCollection = client.db("usersCollection").collection("users");
    const noticeCollection = client.db("usersCollection").collection("notice");
    const studentCollection = client.db("usersCollection").collection("student");
    const classCollection = client.db("userCollection").collection("class")

    const serchResult = await userCollection.createIndex(indexKey, indexOption);



    app.post("/addUser", async (req, res) => {
      const user = req.body;
      console.log(user);

      // if (user?.role === "student") {
      //   const query = { role: "student" }
      //   const sort = { registerDate: -1 }
      //   const studentResult = await userCollection.find(query).sort(sort).toArray();
      //   let studentId = studentResult[0]?.id + 1 || Math.round(Math.random()*10000);
      //   user.id = studentId;
      //   // console.log(studentResult);
      // }
      const result = await userCollection.insertOne(user);
      res.send(result)
    })    
     
    app.post("/addStudent", async (req, res) => {
      const user = req.body;
      console.log(user);

      if (user?.role === "student") {
        const query = { role: "student" }
        const sort = { registerDate: -1 }
        const studentResult = await studentCollection.find(query).sort(sort).toArray();
        console.log(studentResult[0].id);
        const studentParse = parseInt(studentResult[0].id)
        console.log("studentParse: ", studentParse);
        let studentId = studentParse + 1 || Math.round(Math.random()*10000);
        user.id = studentId.toString();
        // console.log(studentResult);
      }
      const result = await studentCollection.insertOne(user);
      res.send(result)
    })

    app.post("/addClass", async(req, res) => {
      const newClass = req.body;
      const result = await classCollection.insertOne(newClass);
      res.send(result)
    })

    app.post('/addNotice', async (req, res) => {
      const notice = req.body;
      const result = await noticeCollection.insertOne(notice);
      res.send(result);
    })


    app.get("/studentSearchById/:id", async(req, res) => {
      const studentId = req.params.id;
      console.log(studentId);
      const result = await studentCollection.find({
        $or: [
          {id: {$regex: studentId, $options: "i" }}
        ]
        
      }
      ).toArray();
      res.send(result);
    })


    app.get('/user', async (req, res) => {
      const email = req.query.email;
      // console.log(email);
      const query = { userEmail: email }

      const studentResult = await studentCollection.findOne(query);

      const result = await userCollection.findOne(query);
      console.log(studentResult?.userEmail);
      if (!studentResult?.userEmail) {
        return res.send(result);
      }
      else{

        console.log(studentResult);
        return res.send(studentResult)
        
      }
    })

    app.get('/getStudent', async (req, res) => {
      const result = await studentCollection.find().toArray();
      res.send(result);
    })


    app.get('/teachers-or-student', async (req, res) => {
      const user = req.query.user;
      const query = { role: user };
      const result = await userCollection.find(query).toArray();
      res.send(result);
    })

    app.get('/my-notice', async (req, res) => {
      const email = req?.query?.email;
      // console.log(email);
      const query = { email: email }
      const result = await noticeCollection.find(query).toArray();
      res.send(result);
    })

    app.get('/public-notice', async (req, res) => {
      const query = { type: 'public' }
      const result = await noticeCollection.find(query).toArray();
      res.send(result);
    })

    app.get('/all-notice', async (req, res) => {
      result = await noticeCollection.find().toArray();
      res.send(result);
    })

    app.get('/find-single-notice/:id', async (req, res) => {
      const noticeId = req.params.id;
      console.log(noticeId);
      const query = { _id: new ObjectId(noticeId) };
      const result = await noticeCollection.findOne(query);
      res.send(result);
    })

    app.get('/allClass', async (req, res) => {
      const result = await classCollection.find().toArray();
      res.send(result)
    })
    app.get("/find-single-Class/:id", async (req, res) => {
      const classId = req.params.id;
      const query = {_id: new ObjectId(classId)}
      console.log(classId);
      const result = await classCollection.findOne(query);
      res.send(result)
    })



    app.put('/update-single-class/:id', async (req, res) => {
      const noticeId = req.params.id;
      const data = req.body;
      const query = { _id: new ObjectId(noticeId) };
      const options = { upsert: true };
      const updatedData = {
        $set: {
          title: data.title,
          notice: data.notice,
          postTime: new Date()
        }
      }
      const result = await classCollection.updateOne(query, updatedData, options);
      res.send(result);
      console.log(noticeId, data);
    })

    app.put('/update-single-notice/:id', async (req, res) => {
      const noticeId = req.params.id;
      const data = req.body;
      const query = { _id: new ObjectId(noticeId) };
      const options = { upsert: true };
      const updatedData = {
        $set: {
          title: data.title,
          notice: data.notice,
          postTime: new Date()
        }
      }
      const result = await noticeCollection.updateOne(query, updatedData, options);
      res.send(result);
      console.log(noticeId, data);
    })

    // delete notice item
    app.delete('/delete-Class/:id', async (req, res) => {
      const noticeId = req.params.id;
      console.log("noticeId", noticeId);
      const query = { _id: new ObjectId(noticeId) }
      const result = classCollection.deleteOne(query);
      res.send(result)
    })   
     app.delete('/delete-notice/:id', async (req, res) => {
      const noticeId = req.params.id;
      console.log("noticeId", noticeId);
      const query = { _id: new ObjectId(noticeId) }
      const result = noticeCollection.deleteOne(query);
      res.send(result)
    })

    app.delete('/delete-user/:id', async (req, res) => {
      const userId = req.params.id;
      const query = { _id: new ObjectId(userId) };
      const result = await userCollection.deleteOne(query);
      res.send(result)
    })    

    app.delete('/delete-student/:id', async (req, res) => {
      const userId = req.params.id;
      const query = { _id: new ObjectId(userId) };
      const result = await studentCollection.deleteOne(query);
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