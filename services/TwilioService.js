// require the Twilio module and create a REST client
const env = process.env;
const client = require('twilio')(env.twilio_account_sid, env.twilio_auth_token);

//Send an SMS text message
exports.sendMessage = function(to, message) {
    const deferred = Q.defer();

    //Send an SMS text message
    client.sendMessage({
        to:'+1' + to, // Any number Twilio can deliver to
        from: '+1' + env.twilio_phone_number, // A number you bought from Twilio and can use for outbound communication
        body: message // body of the SMS message
    }, function(err, responseData) { //this function is executed when a response is received from Twilio

        console.log(responseData);

        if (!err) { 
            deferred.resolve(responseData);
        } else {
            deferred.reject(err);
        }
    });

    return deferred.promise;
};