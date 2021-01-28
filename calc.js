(function() {
  "use strict"

  //Whether or not the calculator is in operating state
  let state = false;

  //Whether or not a decimal number is in progress
  let decimalInProgress = false;

  //The equation string that is built up
  let equation = "";

  //Add event listeners to all buttons
  function init() {
    let calc = document.getElementById("calculator")
    let display = document.getElementById("input");
    let eqDisplay = document.getElementById("eq-display");

    for (let i = 1; i < calc.children.length; i++) {

      //Event listener for the display
      calc.children[i].addEventListener("click", function(event) {
        let buttonContent = this.textContent;

        //Handling the display and its edge cases

        //Compute final result and reset vars
        if (buttonContent === "+/=" && event.shiftKey) {
          let result = parseEquation(equation);
          
          //If NaN result, show err
          if (!result) {
            display.textContent = "err"
            equation = "";
          } else {
            display.textContent = result;
            equation = display.textContent;
          }

          eqDisplay.textContent = formatEquation();

          state = false;
          decimalInProgress = false;
          return;
        }

        //Clear screen
        if (buttonContent === "C") {
          display.textContent = "";
          state = false;
          decimalInProgress = false;
          return;
        }

        //Clicking decimal point multiple times
        if (buttonContent === "." && decimalInProgress) {
          return;
        }

        //If point button is clicked, beginning a decimal number
        if (buttonContent === "." && !decimalInProgress) {
          decimalInProgress = true;
        }

        //Display the current number, else enter operating state and end decimal
        if (!isOperator(buttonContent)) {
          //Clear the screen and add the number
          display.textContent = this.textContent;
        } else {
          state = true;
          decimalInProgress = false;
        }
      });

      //Event listener for keeping track of the running equation
      calc.children[i].addEventListener("click", function(event) {
        let buttonContent = this.textContent;

        //If equating, don't add to the equation
        if (buttonContent === "+/=" && event.shiftKey) {
          return;
        }

        //If clear is pressed, clearing equation
        if (buttonContent === "C") {
          equation = "";
        } else {
          equation += buttonContent;
        }

        eqDisplay.textContent = formatEquation();
      });
    }
  }

  //Whether or not the given text is an operator
  function isOperator(string) {
    return string == "+/=" || string == "-" || string == "/" || string == "X" || string == "+" || string == "=";
  }

  //Parses and evaluates a string equation from left to right
  function parseEquation() {
    let num1 = 0;
    let num2 = 0;
    let operator = getOperator('+')
    for (let i = 0; i < equation.length; i++) {
      //Skip any leading operator except "-"
      while (i < equation.length && isOperator(equation.charAt(i)) 
        && equation.charAt(i) != '-') {
        i++;
      }

      //Get full length of number
      let j = i;
      
      //Edge case if first num is a negative
      if (j === 0) {
        j++;
      }

      while (j < equation.length && !isOperator(equation.charAt(j))) {
        j++;
      }

      //get num2
      num2 = parseFloat(equation.substr(i, j))

      //Update num1 by carrying out operation
      num1 = operator(num1, num2)
      if (j >= equation.length) { 
        break; 
      }

      operator = getOperator(equation.charAt(j))

      //Shift i to j
      i = j;
    }

    return num1;
  }

  //Provides the operator function given the string
  function getOperator(operator) {
    switch (operator) {
      case '+':
        return (a, b) => a + b;
      case '-':
        return (a, b) => a - b;
      case "/":
        return (a, b) => a / b;
      case "X":
        return (a, b) => a * b;
      default:
        return (a, b) => a; 
    }
  }

  //Formats the equation var to be more readable
  function formatEquation() {
    let formattedEq = "";

    for (let i = 0; i < equation.length; i++) {
      let ch = equation.charAt(i);
      if (ch === '+') {
        //Skip the "=/"
        formattedEq += " + ";
        i += 2;
      } else if (ch === 'X') {
        //Converting X to *
        formattedEq += " * ";
      } else if (isOperator(ch)) {
        //Adding a space before and after operators
        formattedEq += " " + ch + " ";
      } else if (isAlphabet(ch)) {
        //Skip it
      } else {
        //Simply append digits
        formattedEq += ch;
      }
    }

    if (formattedEq === "") {
      return "..."
    }

    return formattedEq;
  }

  //Whether a given character is a Letter
  function isAlphabet(character) {
    return character.toUpperCase() != character.toLowerCase();
  }

  window.addEventListener("load", init, false);
})();