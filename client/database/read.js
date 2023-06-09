const { User } = require('./connection')
const { Post } = require('./connection')
const { Chat } = require('./connection')


const getUser = async (username, email, callback) => {
    
    const userSelected = await User.find({ 
        $or: [
          { username: username },
          { email: email }
        ]
      })
      console.log("callback", userSelected)
      if(userSelected == [])
        {
            console.log("goooooo")
            userSelected = false;}
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

const checkUserExists = async (username, callback) => {
    const userSelected = await User.findOne({ username: username });
    if (userSelected) {
        callback(true)
    } else {
        callback(false)
    }
}

const checkEmailExists = async (email, callback) => {
    const userSelected = await User.findOne({ email: email });
    if (userSelected) {
        callback(true)
    } else {
        callback(false)
    }
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

const getUserByUsername = async (user, callback) => {
    const userID = await User.findOne({ username: user })
    callback(userID);
}


const getUsers = async (callback) =>{
    const users = await User.find();
    callback(users);
}


module.exports = {
    getUser,
    getUserByEmail,checkUserExists,
    checkEmailExists,
    getUserByID,
    getChat,
    getUserByUsername,
    getPosts,
    getUsers,
    getPublicacio
}