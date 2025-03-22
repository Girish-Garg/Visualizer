import React from 'react';

const Poisson = ({ inputValues, handleInputChange }) => {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium text-cyan-300">Lambda (λ) - Mean Rate:</label>
      <input 
        type="number" 
        step="any"
        min="0"
        value={inputValues.lambda}
        onChange={(e) => handleInputChange(e, 'lambda')}
        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
        placeholder="Enter lambda value"
      />
      <p className="mt-1 text-sm text-gray-400">Mean and variance are both equal to lambda</p>
    </div>
  );
};

export default Poisson;
