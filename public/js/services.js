app.factory('API', function ($resource) {
        'use strict';
    
    return $resource('/', {}, {
        getTransactions: {
            method: 'GET',
            url: '/getTransactions/:userId',
            isArray: true
        },
        createTransaction: {
            method: 'POST',
            url: '/createTransaction'
        },
        checkTransaction: {
            method: 'GET',
            url: '/checkTransaction/:transactionId'
        },
        createUser: {
            method: 'POST',
            url: '/createUser'
        },
        getUsers: {
            method: 'GET',
            url: '/getUsers',
            isArray: true
        }
    });
});