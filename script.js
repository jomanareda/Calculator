const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
const acBtn = document.getElementById("ac-btn");

let currentInput = "";
let evaluated = false;

function updateDisplay() {
  display.textContent = currentInput || "0";
}

function evaluateExpression() {
  // Prevent evaluation if input ends with operator or is empty
  if (!currentInput || "+-*/".includes(currentInput.slice(-1))) {
    return;
  }

  try {
    const result = eval(currentInput);
    if (result !== undefined) {
      currentInput = result.toString();
    } else {
      currentInput = "0";
    }
    evaluated = true;
  } catch {
    currentInput = "Error";
  }
  updateDisplay();
}

function handleAC() {
  if (currentInput === "Error") {
    currentInput = "";
    evaluated = false;
  } else if (evaluated) {
    currentInput = "";
    evaluated = false;
  } else {
    currentInput = currentInput.slice(0, -1);
  }
  updateDisplay();
}

function toggleSign() {
  if (!currentInput) return;
  const tokens = currentInput.match(/-?\d+(\.\d+)?$/);
  if (tokens) {
    const num = tokens[0];
    const flipped = num.startsWith("-") ? num.slice(1) : "-" + num;
    currentInput = currentInput.slice(0, -num.length) + flipped;
    updateDisplay();
  }
}

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.getAttribute("data-value");

    if (value === "AC") {
      handleAC();
    } else if (value === "=") {
      evaluateExpression();
    } else if (value === "-\\+") {
      toggleSign();
    } else {
      if (evaluated) {
        if ("+-*/".includes(value)) {
          evaluated = false;
        } else {
          currentInput = "";
          evaluated = false;
        }
      }
      // Replace last operator if two operators in a row
      if ("+-*/".includes(value) && "+-*/".includes(currentInput.slice(-1))) {
        currentInput = currentInput.slice(0, -1);
      }
      currentInput += value;
      updateDisplay();
    }
  });
});

// Keyboard support
document.addEventListener("keydown", (e) => {
  e.preventDefault(); // prevent default Enter or Backspace actions
  const key = e.key;
  if ((/\d|[\+\-\*/\(\)\.]/.test(key))) {
    if (evaluated) {
      if ("+-*/".includes(key)) {
        evaluated = false;
      } else {
        currentInput = "";
        evaluated = false;
      }
    }
    if ("+-*/".includes(key) && "+-*/".includes(currentInput.slice(-1))) {
      currentInput = currentInput.slice(0, -1);
    }
    currentInput += key;
    updateDisplay();
  } else if (key === "Enter") {
    if (!evaluated || currentInput === "Error") {
      evaluateExpression();
    }
  } else if (key === "Backspace") {
    handleAC();
  }
});

// Dark mode toggle
document.getElementById("mode-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
