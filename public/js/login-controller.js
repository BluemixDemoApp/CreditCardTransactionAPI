app.controller('LoginAppCtrl', function ($scope, $location, API) {

    $scope.users = null;

    function clearUserScope() {
        $scope.name = "";
        $scope.phone = null;
        $scope.address = null;
    }
    clearUserScope();

    API.getUsers().$promise.then(function (users) {
        $scope.users = users;
    });

    $scope.loginUser = function (userId) {
        $location.path('/transactions').search({
            userId: userId
        });
    };

    $scope.submitUser = function () {
        API.createUser({
            name: $scope.name,
            phone: $scope.phone,
            lat: $scope.address.geometry.location.lat(),
            long: $scope.address.geometry.location.lng(),
        }).$promise.then(function (ret) {
            $scope.loginUser(ret.userId);
        })
    };

    $scope.clearUser = function () {
        clearUserScope();
    };
});