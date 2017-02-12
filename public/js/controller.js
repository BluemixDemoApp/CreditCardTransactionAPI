app.controller('TransactionAppCtrl', function ($scope, API) {

        /* Dani Magic */
        API.getTransactions({
            userId: "b09de84e43e5892f27e44eb6e8bf3ae0"
        }).$promise.then(function(transaction) {
            console.log("getTransactions: ", transaction);
        });

        API.createTransaction( {
            userId: "b09de84e43e5892f27e44eb6e8bf3ae0",
            lat: 123,
            long: 321,
            address: "This is a test address"
        }).$promise.then(function(transaction) {
            console.log("createTransaction: ", transaction);
        });

        API.checkTransaction({
            transactionId: "66b907f33c3326578314976096ab0076"
        }).$promise.then(function(transaction) {
            console.log("checkTransaction: ", transaction);
        });

        $scope.inputContent = '';
        $scope.arrayList = [{
                status: 'OK',
                transactionId: Math.floor(Math.random() * 100),
                address: {
                    lat: 1.89768,
                    long: 0.467126
                }
            },
            {
                status: 'OK',
                transactionId: Math.floor(Math.random() * 100),
                address: {
                    lat: 1.89768,
                    long: 0.467126
                }
            },
            {
                status: 'OK',
                transactionId: Math.floor(Math.random() * 100),
                address: {
                    lat: 1.89768,
                    long: 0.467126
                }
            }
        ];

        var place;

        $scope.$watch('arrayList', function () {
            console.log("watch ping");
            $scope.arrayList.forEach(function (item) {
                if (item.status === 'ALERT') {
                    document.getElementById('transactionButton').setAttribute('disabled', true);
                }
            })
        }, true)

        $scope.makeTransaction = function () {
            console.log("transaction made", $scope.arrayList);

            // var place = autocomplete.getPlace();
            console.log(place);
            var payload = {
                // userId: req.body.userId,  // TODO: implement later
                lat: place.geometry.location.lat(),
                long: place.geometry.location.lng(),
                address: place.formatted_address
            }
                console.log(payload);


            // URL: /api/createTransaction ---> POST
            setTimeout(function () {

                $scope.arrayList.push({
                    status: 'OK',
                    transactionId: Math.floor(Math.random() * 100),
                    lat: payload.lat,
                    long: payload.long,
                    address: payload.address
                })
            }, 500);
            $scope.inputContent = '';
        }

        var autocomplete;

        function initAutocomplete() {
            console.log("hi cam");
            // Create the autocomplete object, restricting the search to geographical
            // location types.
            autocomplete = new google.maps.places.Autocomplete(
                /** @type {!HTMLInputElement} */
                (document.getElementById('autocomplete')), {
                    types: ['geocode']
                });

            // When the user selects an address from the dropdown, populate the address
            // fields in the form.
            autocomplete.addListener('place_changed', fillInAddress);
        }

        setTimeout(function () {
            initAutocomplete();
        }, 100);

          function fillInAddress() {
            // Get the place details from the autocomplete object.
            place = autocomplete.getPlace();
            console.log(place);
          }

    })