app.controller('TransactionAppCtrl', function ($scope, $interval, API) {

    var userId = "1a806da7f44932a9c85d087f2bd01308";

    $scope.transactions = [];
    $scope.address = null;

    // Get an initial list of transactions
    API.getTransactions({
        userId: userId
    }).$promise.then(function (transactions) {
        $scope.transactions = transactions;
    });

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

    // Check every 5 minutes for a new status on the "ALERT" transaction
    var checkTransactionsOnAlert = function() {
        var transactionOnAlert = $scope.transactions.find(function(transaction) {
            return transaction.status === 'ALERT';
        });
        
        if (transactionOnAlert && transactionOnAlert.id) {

            API.checkTransaction({
                transactionId: transactionOnAlert.id
            }).$promise.then(function (transactionRet) {

                console.log("transactionRet: ", transactionRet);

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