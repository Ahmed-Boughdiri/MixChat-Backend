const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp({
    apiKey: "AIzaSyCd0ssAahje2SRJiV8nL3trHhQeIlIZPUQ",
    authDomain: "mixchat-402d6.firebaseapp.com",
    databaseURL: "https://mixchat-402d6.firebaseio.com",
    projectId: "mixchat-402d6",
    storageBucket: "mixchat-402d6.appspot.com",
    messagingSenderId: "495622387017",
    appId: "1:495622387017:web:a8c67ef958f1283c155698",
    measurementId: "G-7426HJ9D85"
})

// Creating a User Record

exports.createUserRecord = functions.https.onRequest((req,res) =>{
    const data = req.body.data;
    const record = {
        uid: data.uid,
        userName: data.userName,
        email: data.email,
        freinds: [
            {
                name: "null"
            }
        ]
    }
    return admin.database().ref(data.uid).set(record)
})