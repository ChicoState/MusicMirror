// const { MongoClient } = require('mongodb');
// import MongoClient from "mongodb";
const mongoose = require('mongoose');
const uri = "mongodb+srv://carobles:Du1UYVCn02jkYmaD@musicmirrorcluster.ke9uina.mongodb.net/?retryWrites=true&w=majority";

// export async function createUser(client, newUser){
//     const result = await client.db("users").collection("users_data").insertOne(newUser);
//     console.log(`New listing created with the following id: ${result.insertedId}`);
// }

// Create a new MongoClient
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// export async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");

//     //Example on how to create user
//     await createUser(client, 
//             {
//                 name: 'Lebron James',
//                 summary: 'All-time NBA scoring leader',
//             }
//         );

//   } catch (e) {
//     console.error(e);
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

async function main() {
  await mongoose.connect(uri);
  const userSchema = new mongoose.Schema({
    name: String,
    summary: String
  })

  const User = mongoose.model('User', userSchema);
  const LeKing = new User({
    name: 'LePookiebear James',
    summary: 'all time balling leader'
  });
  await LeKing.save();
  const q = await User.find({ name: '/^James/' }).exec();
  console.log(q);
}