document.addEventListener("DOMContentLoaded", function () {
    let display = document.getElementById("display");
    let buttons = document.querySelectorAll(".button");
    let equation = "";  // This will hold the entire equation
    let currentInput = "";  // This will hold the current input
    let operatorUsed = false; // Whether the operator has been used
    let logBody = document.querySelector(".log-display");
    let resetButton = document.querySelector(".reset");
    let lastResult = 0;  // To store the last result for proper calculation
    const operatorButtons = document.querySelectorAll(".operator");

    buttons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            let value = this.value;
        
            if (value === "=") {
                sendEquationToFlask(equation);
                removeOperatorHighlight();
                currentInput = "";  // Reset currentInput after calculation
            } else if (value === "AC") {
                equation = "";
                currentInput = "";
                operatorUsed = false;
                lastResult = 0;
                display.value = "0";
                removeOperatorHighlight();
            } else if (value === "+/-") {
                if (currentInput) {
                    currentInput = currentInput.startsWith("-") ? currentInput.slice(1) : "-" + currentInput;
                    let parts = equation.split(/[\+\-\x\÷]/);
                    parts[parts.length - 1] = currentInput;
                    equation = equation.replace(/[\d\.]+$/, currentInput);
                    display.value = currentInput;
                }
            } else if ("+-x÷%".includes(value)) {
                highlightOperator(this);

                // If there's a current input, add it to the equation before the operator
                if (currentInput) {
                    equation = currentInput;
                    currentInput = "";
                }

                // Append the operator to the equation
                equation += value;
                operatorUsed = true;
                display.value = value;
            } else {
                // Handling number input
                if (operatorUsed) {
                    currentInput = value;
                    operatorUsed = false;
                    removeOperatorHighlight();
                } else {
                    currentInput += value;
                }
                equation += value;
                display.value = currentInput;
            }
        });
    });

    function sendEquationToFlask(equation) {
        // Replace operator symbols for Flask
        equation = equation.replace(/÷/g, '/').replace(/x/g, "*");

        fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ equation: equation })
        })
        .then(response => response.json())
        .then(data => {
            if (data.result !== undefined) {
                let result = parseFloat(data.result).toFixed(3).replace(/\.0+$/, '');
                display.value = result;
                addToLog(equation.replace(/\*/g, "x").replace(/\//g, "÷"), result);
                equation = result;  // Set equation to the result for the next operation
                currentInput = result;  // Update currentInput with the result
            } else {
                display.value = "Error";
            }
        })
        .catch(error => console.error("Error:", error));
    }

    function addToLog(expression, result) {
        let entry = document.createElement("div");
        entry.classList.add("log-entry");
        
        // Log in a clean format
        if (lastResult !== 0) {
            // If there's a last result, we need to extract the operator and the current input
            let operator = expression.match(/[\+\-x÷]/)[0]; // Extract the operator
            let currentNumber = expression.split(/[\+\-x÷]/).pop(); // Get the last number
            entry.innerHTML = `${lastResult} ${operator} ${currentNumber} = ${result}`;
        } else {
            // First result logged
            entry.innerHTML = `${expression} = ${result}`;
        }
        
        logBody.appendChild(entry);
        lastResult = parseFloat(result);  // Update lastResult after logging
    }

    resetButton.addEventListener("click", function () {
        logBody.innerHTML = "";
        display.value = "0";
        lastResult = 0;  // Reset lastResult on reset
    });

    function highlightOperator(button) {
        operatorButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    }

    function removeOperatorHighlight() {
        setTimeout(() => {
            operatorButtons.forEach(btn => btn.classList.remove('active'));
        }, 100);
    }
});
