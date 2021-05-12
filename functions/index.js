const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios=require('axios')
admin.initializeApp();

exports.notifier = functions.https.onRequest((request, response) => {
  var topic = request.body.topic
    var title=request.body.title
    var message=request.body.message
    const payload = {
        notification: {
            title: title,
            body: message,
            tag:Date.now()+message
        }
    };
    return admin.messaging().sendToTopic(topic,payload)
        .then(async function(res){
            const usersSnapshot = await admin.database().ref().child('Users').once('value')
            const userTypesSnapshot = await admin.database().ref().child('User Type').child(topic).once('value')
            var usersData=usersSnapshot.val()
            var userTypesData=userTypesSnapshot.val()
            var phones=[]
            Object.keys(userTypesData).map(key=>{
                if(userTypesData[key].Type==='Saver')
                    phones.push('88'+usersData[key].phone)
            })
            var smsPhones=''
            phones.map((phone,ind)=>{
                smsPhones+=phone
                if(ind<phones.length-1)
                    smsPhones+=','
            })
            const url='https://esms.mimsms.com/smsapi'
            const smsData={
                "api_key" : "C20059345f0420cbeca6b0.66042432",
                "type" : "text",
                "contacts" :smsPhones,
                "senderid" : "8809601000500",
                "msg" : message,
                "scheduledDateTime" : "now"
            }
            return axios.post(url,smsData).then(res=>{
                return response.send({
                    status:'success'
                })
            }).catch(err=>{
                console.log(err)
                return response.send({
                    status:'error'
                });
            })
        })
        .catch(function(error){
            console.log('Notification sent failed:',error);
            return response.send({
                status:'failure'
            });
        })
});

exports.subscribe = functions.database.ref('/Users/{uid}')
    .onCreate((snapshot, context) => {
        // Grab the current value of what was written to the Realtime Database.
        const userData = snapshot.val();
        const url='https://esms.mimsms.com/smsapi'
        const message=`Dear ${userData.username}, welcome to Watcher 24/7, please reply with YES in order to subscribe to our SMS notifications, thank you.`
        const data={
            "api_key" : "C20059345f0420cbeca6b0.66042432",
            "type" : "text",
            "contacts" : "88"+userData.phone,
            "senderid" : "8809601000500",
            "msg" : message,
            "scheduledDateTime" : "now"
        }
        console.log(data)
        return axios.post(url,data).then(res=>{
            return console.log(res.data)
        }).catch(err=>{
            return console.log(err)
        })
    });
