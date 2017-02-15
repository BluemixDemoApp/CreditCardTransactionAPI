# RESTfulAPI

###Getting Started###

Install Cloudant locally in case you don`t have access to Bluemix:
https://www.ibm.com/support/knowledgecenter/en/SSTPQH_1.0.0/com.ibm.cloudant.local.install.doc/topics/clinstall_extract_install_cloudant_local.html

```
	> git clone git@github.com:BluemixDemoApp/CreditCardTransactionAPI.git
	> cd CreditCardTransactionAPI
	> touch .env
    > echo "cloudant_username='${CLOUDANT_USER}'" >>  .env     
    > echo "cloudant_password='${CLOUDANT_PASSWORD}'"  >> .env   
    > echo "twilio_account_sid='${TWILIO_ACCOUNT_SID}'"  >> .env   
    > echo "twilio_auth_token='${TWILIO_AUTH_TOKEN}'"  >> .env   
    > echo "twilio_phone_number='${TWILIO_PHONE_NUMBER}'"  >> .env   
    > echo "twilio_send_message='Credit Card alert, please reply CLEAR!'"  >> .env   
    > echo "twilio_unlock_code='CLEAR'"  >> .env 
    > echo "twilio_incorrect_unlock_code_message='Your message did not unlock the transaction, try again!'"  >> .env 
	> npm install
	> npm start
```

###Deploy to Bluemix###

```
    > brew tap cloudfoundry/tap
    > brew install cf-cli
    > cd CreditCardTransactionAPI
    > cf login -u ${EMAIL} -o ${USERNAME} -s dev // Example: cf login -u cam.beaudoin@ca.ibm.com -o cam.beaudoin -s dev
    > cf push ${APP_NAME} // Example: cf push demo-app-47356
    > Enjoy!
```