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
  measurementId: "G-7426HJ9D85",
});

// Creating a User Record

exports.createUserRecord = functions.https.onRequest((req, res) => {
  const data = req.body.data;
  const record = {
    uid: data.uid,
    userName: data.userName,
    email: data.email,
    freinds: [
      {
        name: "null",
        uid: "null",
        email: "null",
        conversation: [
          {
            owner: "null",
            time: "null",
            content: "null",
          },
        ],
      },
    ],
  };
  return admin.database().ref(data.uid).set(record);
});

// get Freinds

exports.getFreinds = functions.https.onRequest((req,res) =>{
  const uid = req.body.uid;
  return admin.database().ref(uid).on("value", snap =>{
    const data = snap.val()
    const result = data.freinds
    let freindsList = []
    result.map(f =>{
      if(f.email !== null || f.email !== undefined){
        freindsList.push(f)
      }
      return true
    })
    res.send(freindsList)
  })
})

// getSuggestions

const notExist = (data,freinds) =>{
  let test = true
  for(var i in freinds){
    if(freinds[i].email === data){
      test = false
      break
    }
  }
  return test
}

const getUserData = async(uid) =>{
  await admin.database().ref(uid).on("value", snap =>{
    const data = snap.val()
    const cred = {
      name: data.userName,
      email: data.email,
      uid: data.uid
    }
    return cred
  })
}

exports.getSuggestions = functions.https.onRequest(async(req,res) =>{
  const freinds = req.body.freinds
  let sug = []
  await admin.database().ref().once("value", snap =>{
    snap.forEach(f =>{
      const data = f.val()
      if(notExist(data.email,freinds)){
        const cred = {
          userName: data.userName,
          avatar: "",
          email: data.email
        }
        sug.push(cred)
      }
    })
  })
  res.send(sug)
})

// add Freind

const getFreindID = async(email) =>{
  let result
  await admin.database().ref().once("value", snap =>{
    snap.forEach(f =>{
      const data = f.val()
      if(data.email === email){
        result = data.uid
      }
    })
  })
  return result
}

exports.addFreind = functions.https.onRequest(async(req,res) =>{
  const uid = req.body.uid
  const freind = req.body.freind
  const freindsList = req.body.freinds
  const freindID = await getFreindID(freind.email)
  const cred = {
    name: freind.name,
    email: freind.email,
    uid: freindID,
    conversation: [
      {
        content: "null",
        time: "null",
        owner: "null"
      }
    ]
  }
  freindsList.push(cred)
  await admin.database().ref(uid).update({
    freinds: freindsList
  })
  res.send(cred)
})
