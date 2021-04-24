const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios=require('axios')
admin.initializeApp();

exports.messanger = functions.https.onRequest((request, response) => {

    return axios.post('https://developer.bdapps.com/sms/send',JSON,stringify({
        "version": "1.0",
        "applicationId": "APP_041546",
        "message": request.body.message,
        "destinationAddresses": request.body.addresses,
        "password":"password"
    }),{
        headers: {
            "Accept": "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
        },
    }).then(res=>{
        return response.send({
            status:'completed'
        })
    }).catch(err=>{
        console.log(err)
        return response.send({
            status:'password missing'
        })
    })

})

exports.notifier = functions.https.onRequest((request, response) => {
  var topic = request.body.topic
    var title=request.body.title
    var message=request.body.message
    const payload = {
        notification: {
            title: title,
            body: message,
            tag:Date.now()+''


        }
    };
    return admin.messaging().sendToTopic(topic,payload)
        .then(function(res){
            console.log('Notification sent successfully:',res);
            return response.send({
                         status:'success'
                       });
        })
        .catch(function(error){
            console.log('Notification sent failed:',error);
            return response.send({
                         status:'failure'
                       });
        });
});
