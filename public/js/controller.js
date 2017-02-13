app.controller('TransactionAppCtrl', function ($scope, $interval, $location, API) {

    var userId = "9cb8da9bf6f311f9c5b8bb58eb0d30f8"; // Defaults to Cam`s Id
    if ($location.search().userId) {
        userId = $location.search().userId;
    }

    $scope.transactions = [];
    $scope.address = null;

    // Get an initial list of transactions
    API.getTransactions({
        userId: userId
    }).$promise.then(function (transactions) {
        // $scope.transactions = transactions;

        $scope.transactions = [{
            status: "OK",
            address: "123 fake st",
            id: "4y3242"
        }, {
            status: "ALERT",
            address: "123 fake st",
            id: "4y3242"
        }]
    });

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

    // Check every 5 minutes for a new status on the "ALERT" transaction
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

    // $interval(checkTransactionsOnAlert, 5000);

})