var app = angular.module('customers');
app.controller("CustomerDetailController", [
          "$scope","$routeParams","$resource",
  function($scope , $routeParams , $resource) {
    $scope.customerId = $routeParams.id;
    var Customer = $resource('/customers/:customerId.json',
                             {"customerId": "@customer_id"},
                             { "save": { "method": "PUT" }});
    $scope.customer = Customer.get({ "customerId": $scope.customerId})
    $scope.customer.billingSameAsShipping = false;
    $scope.$watch('customer.billing_address_id',function() {
      $scope.customer.billingSameAsShipping =
        $scope.customer.billing_address_id ==
          $scope.customer.shipping_address_id;
    });

    $scope.save = function() {
      if ($scope.form.$valid) {
        $scope.customer.$save(
          function() {
            $scope.form.$setPristine();
            $scope.form.$setUntouched();
            $scope.closeAlert = function(index) {
              $scope.alert = undefined;
            },
            $scope.alert = {
              type: "success",
              message: "Customer successfully saved."
            };
          },
          function(data) {
            $scope.alert= {
              type: "danger",
              message: "Customer couldn't be saved"
            };
          }
        );
      }
    }
  }
]);
