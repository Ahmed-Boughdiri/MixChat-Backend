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

//get Freinds

exports.getFreinds = functions.https.onRequest((req, res) => {
  const uid = req.body.uid;
  return admin
    .database()
    .ref(uid)
    .on("value", (snap) => {
      const data = snap.val();
      const freinds = data.freinds;
      if (freinds.length === 1) {
        res.send([]);
      } else {
        res.send(freinds);
      }
    });
});

// get Suggested Freind

const notExist = (val, arr) => {
  let test = true;
  for (i in arr) {
    if (arr[i].uid === val) {
      test = false;
      break;
    } else {
      test = true;
      continue;
    }
  }
  return test;
};

exports.getSuggestions = functions.https.onRequest(async (req, res) => {
  const freinds = req.body.freinds;
  const uid = req.body.uid;
  await admin
    .database()
    .ref(uid)
    .on("value", (snap) => {
      const data = snap.val();
      freinds.push(data);
    });
  let sugg = [];
  return admin
    .database()
    .ref()
    .once("value", (snap) => {
      snap.forEach((f) => {
        const data = f.val();
        if (notExist(data.uid, freinds)) {
          const result = {
            userName: data.userName,
            email: data.email,
          };
          sugg.push(data);
        }
      });
      res.send(sugg);
    });
});

// addd Freind

exports.addFreind = functions.https.onRequest(async (req, res) => {
  const uid = req.body.uid;
  const freindData = req.body.freind;
  //get Freind UID
  const freindEmail = freindData.email;
  let freindUID = "";
  await admin
    .database()
    .ref()
    .once("value", (snap) => {
      snap.forEach((f) => {
        const fData = f.val();
        if (fData.email === freindEmail) {
          freindUID = fData.uid;
        }
      });
    });
  let freindsList = [];
  let result = {
    success: false,
    freind: null,
  };
  await admin
    .database()
    .ref(uid)
    .on("value", (snap) => {
      const data = snap.val();
      freindsList = data;
    });
  const freindCred = {
    name: freindData.name,
    email: freindData.email,
    uid: freindUID,
    conversation: [
      {
        owner: "null",
        time: "null",
        content: "null",
      },
    ],
  };
  freindsList.push(freindCred);
  await admin.database().ref(uid).update({
    freinds: freindsList,
  });
  result.success = true;
  result.freind = freindData;
  return res.send(result);
});
