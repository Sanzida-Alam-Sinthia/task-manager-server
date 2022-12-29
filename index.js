const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hhcmclk.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const tasksCollection = client.db('taskManagerServer').collection('tasks');

        // app.post('/jwt', (req, res) => {
        //     const user = req.body;
        //     const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2d' })
        //     res.send({ token })
        // })

        app.post('/tasks', async (req, res) => {
            const task = req.body;
            const result = await tasksCollection.insertOne(task);
            res.send(result);
        });
        //reviews
        // /get tasks by user email
        app.get('/tasks', async (req, res) => {


            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = tasksCollection.find(query);
            const task = await cursor.toArray();
            res.send(task);
        });
        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await tasksCollection.deleteOne(query);
            res.send(result);
        });
        app.patch('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const taskDescription = req.body.taskDescription
            const query = { _id: ObjectId(id) }
            const updatedTask = {
                $set: {
                    taskDescription: taskDescription
                }
            }
            const result = await tasksCollection.updateOne(query, updatedTask);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send(' task manager server is running')
})

app.listen(port, () => {
    console.log(`task manager  server running on ${port}`);
})