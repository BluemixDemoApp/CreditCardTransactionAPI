// require the Twilio module and create a REST client
const env = process.env;
const client = require('twilio')(env.twilio_account_sid, env.twilio_auth_token);
const Q = require('q');

//Send an SMS text message
exports.sendMessage = function(to, message) {
    const deferred = Q.defer();
    const toPhone = '+1' + to;
    const fromPhone = '+1' + env.twilio_phone_number;

    console.log("To: ", toPhone);
    console.log("From: ", fromPhone);
    console.log("Message: ", message);

    client.sendMessage({
        to: toPhone, // Any number Twilio can deliver to
        from: fromPhone, // A number you bought from Twilio and can use for outbound communication
        body: message
    }).then(function(responseData) {
        console.log("Send SMS: ", responseData);
        deferred.resolve(responseData);
    }).fail(function(error) {
        deferred.reject(error);
    });

    return deferred.promise;
};