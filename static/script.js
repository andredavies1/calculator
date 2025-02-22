document.addEventListener("DOMContentLoaded", function () {
    let display = document.getElementById("display");
    let buttons = document.querySelectorAll(".button");
    let equation = ""; // Store the user input

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            let value = this.value;

            if (value === "=") {
                sendEquationToFlask(equation); // Send Equation to Flask
            } else if (value === "AC") {
                equation = "";
                display.value = "0"; // Fix: Set display to "0"
            } else {
                equation += value;
                display.value = equation; // Fix: Use value instead of innerText
            }
        });
    });

    function sendEquationToFlask(equation) {
        fetch('/calculate', { // Flask route
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ equation: equation })
        })
        .then(response => response.json())
        .then(data => {
            display.value = data.result; // Update display with result
        })
        .catch(error => console.error("Error:", error));
    }
});
