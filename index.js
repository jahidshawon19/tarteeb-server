const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

// MIDDLEWARE 
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qypzm.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const clubsCollection = client.db('tarteeb').collection('clubs')
    const bookingCollection = client.db('tarteeb').collection('bookings')

    // get all clubs data 

    app.get('/clubs', async(req, res)=>{
      const allClubs = clubsCollection.find()
      const result = await allClubs.toArray()
      res.send(result)
    })

    // get club by id 
    app.get('/club/:id', async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await clubsCollection.findOne(query)
      res.send(result)
    })

    // booking club

    app.post('/booking', async(req, res)=>{
      const bookingData = req.body
      const result = await bookingCollection.insertOne(bookingData)
      res.send(result)
    })

    // get booking data for specific user based on email 

    app.get('/bookings', async(req, res)=>{
      let query = {}
      if(req.query?.email){
        query={email:req.query?.email}

      }

      const result = await bookingCollection.find(query).toArray()
      res.send(result)
    })

    
    // delete booking by id 

    app.delete('/booking/:id', async(req, res)=>{
      const id = req.params.id 
      const query = {_id: new ObjectId(id)}
      const result = await bookingCollection.deleteOne(query)
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





app.get('/', (req, res)=>{
    res.send('Tarteeb server is running')
})  

app.listen(port, ()=>{
    console.log(`tarteeb server is running at port ${port}`)
})


