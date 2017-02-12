angular.module('MyApp', [])

    // App Controller
    .controller('MyCtrl', function ($scope) {
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