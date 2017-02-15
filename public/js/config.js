app.config(function($routeProvider, $resourceProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $resourceProvider.defaults.stripTrailingSlashes = false;

    $routeProvider
	    .when("/", {
	        templateUrl : "/views/login.html",
	        controller : "LoginAppCtrl"
	    })
	    .when("/transactions", {
	        templateUrl : "/views/transactions.html",
	        controller : "TransactionAppCtrl"
	    });

});