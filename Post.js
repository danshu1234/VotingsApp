import mongoose from "mongoose"

const VotingSchema = new mongoose.Schema({
    usId: {
        type: String,
        required: true,
    }
})

const optionSchema = new mongoose.Schema({
    option: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        required: true,
    }
})

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    postId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    votings: {
        type: [VotingSchema],
        required: true,
    },
    options: {
        type: [optionSchema],
        required: true,
    }
})

export default mongoose.model('Post', PostSchema)