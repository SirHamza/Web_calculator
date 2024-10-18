"use client"; // Indicate this file as a client component
import { useState } from 'react';
import jsPDF from 'jspdf';

const Calculator = () => {
  const [input, setInput] = useState<string>('0'); // Current input
  const [fullExpression, setFullExpression] = useState<string>(''); // Full expression
  const [result, setResult] = useState<number | null>(null); // Calculation result
  const [history, setHistory] = useState<string[]>([]); // Calculation history

  const handleButtonClick = (value: string) => {
    if (value === 'C') {
      resetCalculator();
    } else if (value === '=') {
      if (fullExpression) {
        const res = evalExpression(fullExpression);
        setResult(res);
        saveToHistory(fullExpression, res);
        resetForNextCalculation(res);
      }
    } else {
      // Use 'value' here
      setInput((prev) => prev === '0' ? value : prev + value);
      setFullExpression((prev) => prev + (prev ? ` ${value} ` : value));
    }
  };

  const evalExpression = (expression: string): number => {
    try {
      return Function(`'use strict'; return (${expression})`)();
    } catch {
      return 0; // Return 0 if the expression is invalid
    }
  };

  const saveToHistory = (expression: string, res: number) => {
    const entry = `${expression} = ${res}`;
    setHistory((prev) => [...prev, entry]);
  };

  const resetCalculator = () => {
    setInput('0');
    setFullExpression('');
    setResult(null);
    setHistory([]);
  };

  const resetForNextCalculation = (lastResult: number) => {
    setInput('0');
    setFullExpression(`${lastResult}`);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const historyContent = history.join('\n');
    doc.text("Calculation History", 10, 10);
    doc.text(historyContent, 10, 20);
    doc.save('calculation_history.pdf');
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-200 p-4">
      <div className="calculator w-full max-w-md rounded-lg shadow-lg bg-white p-5 flex flex-col">
        {/* Display Section */}
        <div className="bg-gray-300 text-right text-4xl p-3 rounded-lg mb-4 h-20 overflow-hidden">
          <div className="flex justify-end">
            <span>{fullExpression || input}</span>
          </div>
        </div>
        {/* Result Display */}
        {result !== null && (
          <div className="bg-gray-200 text-right text-3xl p-3 rounded-lg mb-4">
            = {result}
          </div>
        )}
        {/* Button Section */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {['7', '8', '9', '/'].map((item) => (
            <button key={item} className="bg-blue-500 text-white rounded-lg text-3xl p-3 shadow-lg transition-transform transform hover:scale-105" onClick={() => handleButtonClick(item)}>
              {item}
            </button>
          ))}
          {['4', '5', '6', '*'].map((item) => (
            <button key={item} className="bg-blue-500 text-white rounded-lg text-3xl p-3 shadow-lg transition-transform transform hover:scale-105" onClick={() => handleButtonClick(item)}>
              {item}
            </button>
          ))}
          {['1', '2', '3', '-'].map((item) => (
            <button key={item} className="bg-blue-500 text-white rounded-lg text-3xl p-3 shadow-lg transition-transform transform hover:scale-105" onClick={() => handleButtonClick(item)}>
              {item}
            </button>
          ))}
          <button className="bg-blue-500 text-white rounded-lg text-3xl p-3 shadow-lg transition-transform transform hover:scale-105 col-span-2" onClick={() => handleButtonClick('0')}>
            0
          </button>
          <button className="bg-blue-500 text-white rounded-lg text-3xl p-3 shadow-lg transition-transform transform hover:scale-105" onClick={() => handleButtonClick('+')}>
            +
          </button>
          <button className="bg-blue-500 text-white rounded-lg text-3xl p-3 shadow-lg transition-transform transform hover:scale-105 col-span-2" onClick={() => handleButtonClick('=')}>
            =
          </button>
          <button className="bg-orange-500 text-white rounded-lg text-3xl p-3 shadow-lg transition-transform transform hover:scale-105" onClick={() => handleButtonClick('C')}>
            C
          </button>
        </div>
        {/* History Section */}
        <div className="bg-gray-100 text-gray-800 text-lg p-2 rounded-lg overflow-auto h-32">
          <h3 className="font-bold mb-2">History:</h3>
          <ul className="max-h-full overflow-y-auto">
            {history.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <button 
          className="mt-4 bg-green-500 text-white rounded-lg text-lg p-3 shadow-lg transition-transform transform hover:scale-105" 
          onClick={downloadPDF}>
          Download History as PDF
        </button>
      </div>
    </div>
  );
};

export default Calculator;

