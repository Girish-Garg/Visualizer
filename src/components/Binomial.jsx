import React from 'react';

const Binomial = ({ inputValues, handleInputChange }) => {
  return (
    <>
      <div className="mb-4">
        <label className="block mb-2 font-medium text-cyan-300">Number of Trials (n):</label>
        <input 
          type="number" 
          step="1"
          min="1"
          value={inputValues.n}
          onChange={(e) => handleInputChange(e, 'n')}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
          placeholder="Enter number of trials"
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 font-medium text-cyan-300">Probability of Success (p):</label>
        <input 
          type="number"
          step="0.01"
          min="0"
          max="1"
          value={inputValues.p}
          onChange={(e) => handleInputChange(e, 'p')}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
          placeholder="Enter probability (0-1)"
        />
      </div>

      {inputValues.n && inputValues.p && (
        <div className="mb-4 p-3 bg-gray-700 rounded-md">
          <p className="text-gray-300 font-medium">Mean (np):</p>
          <p className="text-cyan-400 text-lg font-mono">
            {(parseFloat(inputValues.n) * parseFloat(inputValues.p)).toFixed(4)}
          </p>
          <p className="text-gray-300 font-medium mt-2">Variance (np(1-p)):</p>
          <p className="text-cyan-400 text-lg font-mono">
            {(parseFloat(inputValues.n) * parseFloat(inputValues.p) * (1-parseFloat(inputValues.p))).toFixed(4)}
          </p>
        </div>
      )}
    </>
  );
};

export default Binomial;
