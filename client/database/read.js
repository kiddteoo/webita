const { User } = require('./connection')
const { Post } = require('./connection')
const { Chat } = require('./connection')


const getUser = async (nomUsuari, callback) => {
    const userSelected = await User.findOne({ username: nomUsuari})
    callback(userSelected);
}
const getUserByEmail = async (email, callback) => {
    const userSelected = await User.findOne({ email: email})
    callback(userSelected);
}

const getChat = async (chat_id, callback) => {
    const chatSelected = await Chat.findOne({ _id: chat_id })
    callback(chatSelected);
}

const getPublicacio = async (id_publi, callback) => {
    const postSelected = await Post.findOne({ _id: id_publi })
    callback(postSelected)
}

const getPosts = async (callback) =>{
    const posts = await Post.find();
    callback(posts);
}

const getUserByID = async (id, callback) => {
    const userID = await User.findOne({ _id: id })
    callback(userID);
}

const getUsers = async (callback) =>{
    const users = await User.find();
    callback(users);
}


module.exports = {
    getUser,
    getUserByEmail,
    getUserByID,
    getChat,
    getPosts,
    getUsers,
    getPublicacio
}