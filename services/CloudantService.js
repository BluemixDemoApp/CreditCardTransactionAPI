// Database connection
const Cloudant = require('cloudant');
const env = process.env;

const cloudant = Cloudant({
  account: env.cloudant_username || "nodejs", 
  password: env.cloudant_password,
  plugin:'promises'
});

function createDB() {
  return cloudant.db.create('credit-card-transaction-api').then(function() {
    console.log("DB created sucessfully!")
  }).catch(function(err) {
    console.log('Something went wrong when creationg the DB: ', err);
  });
}

const cloudantDB = cloudant.db.use('credit-card-transaction-api');

cloudantDB.list().then(function(data) {
  console.log('Conencted sucessfully to DB: ', data);
}).catch(function(err) {
  console.log('Creating DB!');
  createDB();
});

exports.dbConnection = cloudantDB;