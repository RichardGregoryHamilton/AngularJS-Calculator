angular.module('Calculator', [])
    .controller('CalculatorCtrl', ['$scope', function($scope) {

        // The buttons are ordered in standard calculator format
        $scope.buttons = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, '.', '='];

        $scope.output = '0';
        $scope.newNumber = true;
        $scope.pendingOperation = null;            // Holds pending operation
        $scope.token = '';                         // Displays operation in view
        $scope.total = null;

        $scope.pendingValue = null;                // Holds string value
        $scope.lastOperation = null;               // Prevents double clicks

        // Constants
        var ADD = 'adding';
        var SUBTRACT = 'subtracting';

        $scope.numDigits = 0;

        // Displays the input typed from the calculator

        $scope.updateOutput = function (btn) {
            if ($scope.output == '0' || $scope.newNumber) {
                $scope.output = btn;
                $scope.newNumber = false;
            }
            else {
                if ($scope.numDigits < 20) {                //Limit digits
                    if (btn != '=') {
                        $scope.numDigits++;
                        $scope.output += String(btn);
                    }
                }
            }
            $scope.pendingValue = toNumber($scope.output);

        };

        function evaluateExpressions() {
            if ($scope.pendingValue) {
                if ($scope.total && $scope.pendingOperation == ADD) {
                    $scope.total += $scope.pendingValue;
                } else if ($scope.total && $scope.pendingOperation == SUBTRACT) {
                    $scope.total -= $scope.pendingValue;
                } else {
                    $scope.total = $scope.pendingValue;
                }
            }
        }

        // This function is run for every addition operation
        $scope.add = function () {
            evaluateExpressions();
            setToken(ADD);
            setOutput(String($scope.total));
            $scope.pendingOperation = ADD;
            resetValues();
        };

        // This function is run for every subtraction operation

        $scope.subtract = function () {
            evaluateExpressions();
            setToken(SUBTRACT);
            setOutput(String($scope.total));
            $scope.pendingOperation = SUBTRACT;
            resetValues();
        };

        function resetValues() {
            $scope.newNumber = true;
            $scope.numDigits = 0;
            $scope.pendingValue = null;
        }

         $scope.operations = [
            { 'symbol': '+', 'name': 'add', 'function': $scope.add },
            { 'symbol': '-', 'name': 'subtract', 'function': $scope.subtract },
        ]

        // This function runs whenever equals sign is pressed

        $scope.calculate = function () {
            if (!$scope.newNumber) {
                $scope.pendingValue = toNumber($scope.output);
                $scope.lastValue = $scope.pendingValue;
            }
            switch ($scope.pendingOperation) {
                case ADD:
                    $scope.total += $scope.pendingValue;
                    $scope.lastOperation = ADD;
                    break;
                case SUBTRACT:
                    $scope.total -= $scope.pendingValue;
                    $scope.lastOperation = SUBTRACT;
                    break;
                default:
                    checkOperation();
                    break;
            }

            setOutput($scope.total);
            setToken();
            $scope.pendingOperation = null;
            $scope.pendingValue = null;
        };

        function checkOperation() {
            if ($scope.lastOperation) {
                switch($scope.lastOperation) {
                    case ADD:
                        $scope.total += ($scope.total) ? $scope.lastValue : 0;
                        break;
                    case SUBTRACT:
                        $scope.total -= ($scope.total) ? $scope.lastValue : 0;
                        break;
                    default:
                        $scope.total = 0;
                }
            } else {
                $scope.total = 0;
            }
        }

        // Resets the calculator

        $scope.clear = function () {
            $scope.total = null;
            $scope.pendingValue = null;
            $scope.pendingOperation = null;
            $scope.numDigits = 0;
            setOutput('0');
        };

        // Updates the display output and resets the newNumber flag.

        setOutput = function (string) {
            $scope.output = string;
            $scope.newNumber = true;
        };

        // Sets the mathematical operation to use

        setToken = function (operation) {
            switch(operation) {
                case ADD:
                    $scope.token = '+';
                    break;
                case SUBTRACT:
                    $scope.token = '-';
                    break;
                default:
                    $scope.token = '';
                    break;
            }
        };

        // Converts a string to a number so we can perform calculations.

        toNumber = function (string) {
            return string ? string * 1 : 0;
        };

    }]);
