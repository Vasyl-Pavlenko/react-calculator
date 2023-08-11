import { useCallback, useEffect, useState } from "react";
import "./App.css";
import * as math from 'mathjs';

const BUTTONS_DATA = [
  { id: "clear", className: "col-span-2 bg-gray-400 button", value: "clear", text: "AC" },
  { id: "del", className: "col-span-1 bg-gray-400 button", value: "del", text: "DEL" },
  { id: "divide", className: "bg-gray-800 button", value: "/", text: "/" },
  { id: "seven", className: "bg-gray-600 button", value: "7", text: "7" },
  { id: "eight", className: "bg-gray-600 button", value: "8", text: "8" },
  { id: "nine", className: "bg-gray-600 button", value: "9", text: "9" },
  { id: "multiply", className: "bg-gray-800 button", value: "X", text: "X" },
  { id: "four", className: "bg-gray-600 button", value: "4", text: "4" },
  { id: "five", className: "bg-gray-600 button", value: "5", text: "5" },
  { id: "six", className: "bg-gray-600 button", value: "6", text: "6" },
  { id: "subtract", className: "bg-gray-800 button", value: "-", text: "-" },
  { id: "one", className: "bg-gray-600 button", value: "1", text: "1" },
  { id: "two", className: "bg-gray-600 button", value: "2", text: "2" },
  { id: "three", className: "bg-gray-600 button", value: "3", text: "3" },
  { id: "add", className: "bg-gray-800 button", value: "+", text: "+" },
  { id: "decimal", className: "bg-gray-600 button", value: ".", text: "." },
  { id: "zero", className: "bg-gray-600 button", value: "0", text: "0" },
  { id: "equals", className: "bg-red-600 col-span-2 button", value: "=", text: "=" },
];

export const App = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("0");
  const [equalPressed, setEqualPressed] = useState(false);
  const [error, setError] = useState(false);

    const handleClick = useCallback((event) => {
    const value = event.target.value;
    if (!isNaN(value)) {
      if (equalPressed) {
        setEqualPressed(false);
        setInput("");
        setResult(value);

        return;
      }

      if (result.includes(".")) {
        setResult(result + value);

        return;
      }
      if (isNaN(result)) {
        setInput(input + result);
        setResult("" + +value);

        return;
      }
      setResult((prev) => (prev = "" + +(result + value)));

      return;
    }

    if (value === ".") {
      if (result.includes(".")) {

        return;
      }
      setResult(result + value);

      return;
    }

    if (value === "clear") {
      setInput("");
      setResult("0");
      setEqualPressed(false);
      setError(false);

      return;
    }

    if (value === "del") {
      if (equalPressed) {
        setInput("");
        setResult("0");

        return;
      }

      if (result.length > 1) {
        setResult(result.slice(0, -1));
      } else {
        setResult("0");
      }

      return;
    }

    if (["+", "-", "/", "X"].includes(value)) {
      if (equalPressed) {
        setEqualPressed(false);
        setInput(result);
        setResult(value);

        return;
      }

      if (!["+", "/", "X", "-"].includes(result[0])) {
        setInput(input + result);
        setResult(value);

        return;
      }

      if (value === "-" && result !== "-" && result.length < 2 && !equalPressed) {
        setResult(result + value);

        return;
      }

      setResult(value);

      return;
    }

    if (value === '=') {
      if (equalPressed) {
        return;
      }

      setEqualPressed(true);
      try {
        const calc = math.evaluate(input.replaceAll('X', '*') + result);
        const roundedCalc = +calc.toFixed(4);
        setResult(roundedCalc.toString());
        setInput(input + result + '=');
      } catch (err) {
        setError(true);
      }
    }
  }, [input, result, equalPressed]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      event.preventDefault();
      const key = event.key;
      const digitRegex = /^[0-9]$/;

      if (key.match(digitRegex)) {
        handleClick({ target: { value: key } });
      } else {
        switch (key) {
          case ".":
            handleClick({ target: { value: "." } });
            break;
          case "+":
          case "-":
          case "/":
            handleClick({ target: { value: key } });
            break;
          case "*":
            handleClick({ target: { value: "X" } }); 
            break;
          case "=":
          case "Enter":
            handleClick({ target: { value: "=" } });
            break;
          case "Backspace":
            handleClick({ target: { value: "del" } });
            break;
          case "Escape":
            handleClick({ target: { value: "clear" } });
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClick]);


  return (
    <div
      id="calculator"
      className="text-white w-64 bg-grey-300 grid grid-cols-4 text-2xl shadow-2xl"
    >
      <div className="col-span-4 pl-4 text-gray-100 text-center border-b border-gray-500 text-black bg-gray-400 text-base cursor-default">
        React Calculator
      </div>

      <div
        className="screen bg-gray-300 text-gray-800  col-span-4 text-right px-3 pt-1"
        id="log-screen"
      >
        {!error ? input + result : input + result + "= Error"}
      </div>

      <div
        className="screen bg-gray-300 text-black text-3xl col-span-4 pb-2 text-right px-3 pt-1"
        id="display"
      >
        {!error ? result : "ERROR!"}
      </div>

      {BUTTONS_DATA.map(({ id, className, value, text}) => (
        <button
          key={id}
          id={id}
          className={className}
          value={value}
          onClick={handleClick}
        >
          {text}
        </button>
      ))}
    </div>
  );
}
