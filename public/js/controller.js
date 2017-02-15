app.controller('TransactionAppCtrl', function ($scope, $interval, $rootScope, API) {

    var userId = null;

    $scope.transactions = [];
    $scope.address = null;
    $scope.loggedIn = false;

    // Get an initial list of transactions

    $rootScope.$watch('user', function() {
        if($rootScope.user) {
            userId = $rootScope.user;
            $scope.loggedIn = true;

            API.getTransactions({
                userId: userId
            }).$promise.then(function (transactions) {
                $scope.transactions = transactions;
            });
        }
    })

    $scope.hasTransactionOnAlert = function() {
        return $scope.transactions.some(function(transaction) {
            return transaction.status === 'ALERT';
        });
    };

    $scope.makeTransaction = function () {
        API.createTransaction({
            userId: userId,
            lat: $scope.address.geometry.location.lat(),
            long: $scope.address.geometry.location.lng(),
            address: $scope.address.formatted_address
        }).$promise.then(function (transaction) {
            $scope.transactions.push({
                status: transaction.status,
                id: transaction.id,
                lat: $scope.address.geometry.location.lat(),
                long: $scope.address.geometry.location.lng(),
                address: $scope.address.formatted_address
            });
            $scope.address = null;
        });
    };

    // Check every 5 seconds for a new status on the "ALERT" transaction
    var checkTransactionsOnAlert = function() {
        var transactionOnAlert = $scope.transactions.find(function(transaction) {
            return transaction.status === 'ALERT';
        });
        
        if (transactionOnAlert && transactionOnAlert.id) {
            API.checkTransaction({
                transactionId: transactionOnAlert.id
            }).$promise.then(function (transactionRet) {
                if (transactionRet.status === 'OK') {
                    $scope.transactions = $scope.transactions.map(function(transaction) {
                        if (transactionRet.id === transaction.id) {
                            return transactionRet;
                        }
                        return transaction;
                    });
                }
            });
        }
    };
    $interval(checkTransactionsOnAlert, 5000);
})

app.controller('LoginAppCtrl', function($scope, $rootScope, API) {

    $scope.name = "";
    $scope.phone = null;
    $scope.address = null;
    $scope.loggedIn = false;
    $scope.userList = null;

    API.getUsers().$promise.then(function(userArray) {
        $scope.userList = userArray;
    })

    $scope.loginUser = function(userId) {
        $rootScope.user = userId;
        $scope.loggedIn = true;
    }

    $scope.submitUser = function() {
        API.createUser({
            name: $scope.name,
            phone: $scope.phone,
            lat: $scope.address.geometry.location.lat(),
            long: $scope.address.geometry.location.lng(),
        }).$promise.then(function (userRet) {
            $rootScope.user = userRet.userId;
            $scope.loggedIn = true;
        })
    }
})