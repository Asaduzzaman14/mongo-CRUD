const express = require("express")
const { MongoClient, ServerApiVersion, Collection, ObjectId } = require('mongodb');
// const ObjectId = require('mongodb').ObjectId;


const app = express()
const cors = require('cors');
const { query } = require("express");
const port = process.env.PORT || 5000



// us miidleware
app.use(cors())
app.use(express.json())



// user : dbuser1
// psss: Bi3qPFuN1pwXdpn1


const uri = "mongodb+srv://dbuser1:Bi3qPFuN1pwXdpn1@cluster0.dci89.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const userCollection = client.db('foodExpress').collection('user');


        //  get user 
        app.get('/user', async (ruq, res) => {
            const query = {}
            const cursor = userCollection.find(query)
            const users = await cursor.toArray()
            res.send(users);
        })

        app.get('/user/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await userCollection.findOne(query)
            res.send(result)

        })

        // post user : add a new user
        app.post('/user', async (req, res) => {
            const newUser = req.body
            console.log('new user', newUser);
            const result = await userCollection.insertOne(newUser)
            res.send(result)
        })


        // updated user
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id
            const updatedUser = req.body
            const filter = { id: ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                }
            }
            const result = await userCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })

        // delete a users
        app.delete('/user/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)

        })


    }
    finally {
        // client.closed()
    }

}
run().catch(console.dir())

app.get('/', (req, res) => {
    res.send('runing my node project')
})

app.listen(port, () => {
    console.log('port', port)
})
