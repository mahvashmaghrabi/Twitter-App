const mongoose = require('mongoose');

const PostSchema = require('./post.schema').PostSchema

const PostModel = mongoose.model("Post", PostSchema);

function createPost(post){
    return PostModel.create(post);
}

function getAllPost(){
    return PostModel.find().sort({created: -1}).exec();
}

// may need to updated the sorting mechamisum
function getAllPostForUser(user){
    return PostModel.find({
        username: user
    }).sort({updated: -1}).exec();
}

function deletePostById(id){
    return PostModel.deleteOne({
        _id: id
    });
}

function updatePostById(id, contents){

    const filter = { _id: id };
    const update = { content: contents };

    return PostModel.findOneAndUpdate(filter, update);
}

module.exports = {
    createPost,
    getAllPost,
    getAllPostForUser,
    deletePostById,
    updatePostById,
}