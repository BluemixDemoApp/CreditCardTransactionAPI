app.controller('TransactionAppCtrl', function ($scope, $q, API) {

    var place;
    var autocomplete;
    var lat;
    var long;

    $scope.arrayList = [];
    $scope.inputContent = '';

    /* Dani Magic */
    API.getTransactions({
        userId: "b09de84e43e5892f27e44eb6e8bf3ae0"
    }).$promise.then(function (transactions) {
        console.log("getTransactions: ", transactions);
        $scope.arrayList = transactions;
    });

    $scope.$watch('arrayList', function () {

        console.log("watch ping");
        $scope.arrayList.forEach(function (item) {
            if (item.status === 'ALERT') {

                API.checkTransaction({
                    transactionId: "66b907f33c3326578314976096ab0076"
                }).$promise.then(function (transaction) {
                    console.log("checkTransaction: ", transaction);
                });

                document.getElementById('transactionButton').setAttribute('disabled', true);
            }
        })
    }, true)

    $scope.makeTransaction = function () {
        console.log("transaction made", place);

        API.createTransaction({
            userId: "b09de84e43e5892f27e44eb6e8bf3ae0",
            lat: lat,
            long: long,
            address: place.formatted_address
        }).$promise.then(function (transaction) {
            console.log("createTransaction: ", transaction);
            $scope.arrayList.push({
                status: transaction.status,
                transactionId: transaction.transactionId,
                lat: lat,
                long: long,
                address: address
            })
        });

        // var place = autocomplete.getPlace();
        // console.log(place);
        // var payload = {
        //     // userId: req.body.userId,  // TODO: implement later
        // lat: place.geometry.location.lat(),
        // long: place.geometry.location.lng(),
        // address: place.formatted_address
        // }
        // console.log(payload);



        $scope.inputContent = '';
    }


    function initAutocomplete() {
        autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */
            (document.getElementById('autocomplete')), {
                types: ['geocode']
            });
        autocomplete.addListener('place_changed', fillInAddress);
    }

    setTimeout(function () {
        initAutocomplete();
    }, 123);

    function fillInAddress() {
        // Get the place details from the autocomplete object.
        place = autocomplete.getPlace();
        lat = place.geometry.location.lat();
        long = place.geometry.location.lng();
    }

})