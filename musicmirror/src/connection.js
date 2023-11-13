const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://carobles:Du1UYVCn02jkYmaD@musicmirrorcluster.ke9uina.mongodb.net/?retryWrites=true&w=majority";

async function createUser(client, newUser){
    const result = await client.db("users").collection("users_data").insertOne(newUser);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}

// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    await createUser(client, 
            {
                name: 'Lebron James',
                summary: 'All-time NBA scoring leader',
            }
        );

  } catch {
    console.error(e);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
