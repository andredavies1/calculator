document.addEventListener("DOMContentLoaded", function () {
    let display = document.getElementById("display");  // connect with html
    let buttons = document.querySelectorAll(".button");
    let equation = ""; // Store the user input
    let currentInput = ""; //Current input
    let operatorUsed = false; //Check if Operator was used
    let logBody = document.querySelector(".log-display")
    let resetButton = document.querySelector (".reset")


    buttons.forEach(button => {
        button.addEventListener("click", function () {
            let value = this.value;
        
            if (value === "=") {
                sendEquationToFlask(equation);                                          // Send Equation to Flask
            } else if (value === "AC") {                                                // Resets calculator
                equation = "";
                currentInput = "";
                operatorUsed = false;
                display.value = "0";                                                    // Fix: Set display to "0"
            } else if (value === "+/-"){
                if (currentInput) {
                    if (currentInput.startsWith("-")){
                        currentInput = currentInput.slice(1);                           // remove negative
                    } else{
                        currentInput = "-" + currentInput;                          // add negative
                    }
                    let parts = equation.split(/[\+\-\x\÷]/);                       //split operators
                    parts[parts.length -1] = currentInput                               // update last number
                    equation = equation.replace(/[\d\.]+$/, currentInput);              // replace last number in the equation
                    display.value = currentInput;
                }
            } 
            else if ("+-x÷".includes(value)){
                if (operatorUsed){
                    equation = equation.slice(0, -1) + value;                           // replace last character and adds the current value of the button.
                }else{
                    equation += value
                    operatorUsed = true
                }
                display.value = value;
            }else {
                if (operatorUsed) {
                    currentInput = value;
                    operatorUsed = false;
                } else{
                    currentInput += value;
                }
                equation += value;
                display.value = currentInput;
            }
        });
    });

    function sendEquationToFlask(equation) {

        equation = equation.replace(/÷/g, '/').replace(/x/g, "*")


        fetch('/calculate', {                                                               // Flask route
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ equation: equation })
        })
        .then(response => response.json())
        .then(data => {
            if (data.result !== undefined){
                //format 3 decimal places
                let result = parseFloat(data.result).toFixed(3).replace(/\.0+$/, '');
                display.value = result;
                // Update log with the original equation and formatted result
                addToLog (equation.replace(/\*/g, "x").replace(/\//g, "÷"), result);
            } else {
                display.value = "Error"
            }
        })
        .catch(error => console.error("Error:", error));
    }

    function addToLog(expression, result) {
        let entry = document.createElement("div")
        entry.classList.add("log-entry")
        entry.innerHTML = `<span> ${expression} = ${result} </span>`;
        logBody.appendChild(entry);
    }

    resetButton.addEventListener("click", function(){
        logBody.innerHTML = "";
    })

});

