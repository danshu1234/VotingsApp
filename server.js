import express, { response } from "express"
import mongoose from "mongoose"
import cors from "cors"; 
import Post from "./Post.js";

mongoose.connect('mongodb+srv://alex1234:alex20012007@votings-cluster.rdrbi.mongodb.net/blog')
.then(() => console.log('Database is connecting!'))
.catch((err) => console.log('Error', err))

const app = express()

app.use(express.json())

app.use(cors({
    origin: 'http://localhost:3000' 
}));

app.post('/get/votings', async(req, res) => {
    const posts = await Post.find({userId: req.body.userId})
    if (posts.length !== 0) {
        res.json({response: posts})
    } else {
        res.json({response: 'Нет постов'})
    }
})

app.post('/create/voting', async(req, res) => {
    const newVoting = new Post(req.body.resultVotingPost)
    await newVoting.save()
    res.json({response: 'Голосование было успешно сохранено'})
})

app.post('/find/post', async(req, res) => {
    const findPost = await Post.findOne({postId: req.body.postId})
    res.json({response: findPost})
})

app.patch('/update/post', async(req, res) => {
    const updatePost = await Post.findOneAndUpdate({postId: req.body.votingId}, {votings: req.body.newVotingsList, options: req.body.newOptions}, {new: true})
    res.json({response: 'Пост был успешно обновлен'})
})

app.post('/find/voting', async(req, res) => {
    const findVotingByCode = await Post.findOne({postId: req.body.codeInput})
    if (findVotingByCode) {
        res.json({response: findVotingByCode})
    } else {
        res.json({response: 'undefined'})
    }
})

app.listen(4444, (err) => {
    if (err) {
        console.log(err)
    }
    console.log('SERVER OK')
})