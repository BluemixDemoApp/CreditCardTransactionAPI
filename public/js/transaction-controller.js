app.controller('TransactionAppCtrl', function ($scope, $interval, $location, API) {

    var userId = $location.search().userId;

    $scope.transactions = [];
    $scope.address = null;

    if (userId) {
        API.getTransactions({
            userId: userId
        }).$promise.then(function (transactions) {
            $scope.transactions = transactions;
        });
    }

    $scope.hasTransactionOnAlert = function () {
        return $scope.transactions.some(function (transaction) {
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

    $scope.changeUser = function () {
        $location.path('/');
    };

    // Check every 5 seconds for a new status on the "ALERT" transaction
    var checkTransactionsOnAlert = function () {
        var transactionOnAlert = $scope.transactions.find(function (transaction) {
            return transaction.status === 'ALERT';
        });

        if (transactionOnAlert && transactionOnAlert.id) {
            API.checkTransaction({
                transactionId: transactionOnAlert.id
            }).$promise.then(function (transactionRet) {
                if (transactionRet.status === 'OK') {
                    $scope.transactions = $scope.transactions.map(function (transaction) {
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
});