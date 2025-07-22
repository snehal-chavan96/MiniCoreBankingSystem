import React, { useState } from "react";

const InterestCalculator = () => {
  const [formData, setFormData] = useState({
    principal: "",
    rate: "",
    time: "",
    interestType: "SIMPLE",
    compoundingFrequency: 1
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateInterest = (e) => {
    e.preventDefault();

    const { principal, rate, time, interestType, compoundingFrequency } = formData;
    const P = parseFloat(principal);
    const R = parseFloat(rate) / 100;
    const T = parseFloat(time);

    if (isNaN(P) || isNaN(R) || isNaN(T)) {
      alert("Please enter valid numbers.");
      return;
    }

    let interest, totalAmount;

    if (interestType === "SIMPLE") {
      interest = P * R * T;
      totalAmount = P + interest;
    } else {
      const n = parseInt(compoundingFrequency);
      totalAmount = P * Math.pow(1 + R / n, n * T);
      interest = totalAmount - P;
    }

    setResult({
      interest: interest.toFixed(2),
      totalAmount: totalAmount.toFixed(2)
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Interest Calculator</h2>
      <form onSubmit={calculateInterest} className="space-y-4">
        <input
          type="number"
          name="principal"
          placeholder="Principal Amount"
          value={formData.principal}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="number"
          name="rate"
          placeholder="Interest Rate (%)"
          value={formData.rate}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="number"
          name="time"
          placeholder="Time (Years)"
          value={formData.time}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
        <select
          name="interestType"
          value={formData.interestType}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="SIMPLE">Simple Interest</option>
          <option value="COMPOUND">Compound Interest</option>
        </select>

        {formData.interestType === "COMPOUND" && (
          <input
            type="number"
            name="compoundingFrequency"
            placeholder="Compounding Frequency (e.g., 12 for monthly)"
            value={formData.compoundingFrequency}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Calculate
        </button>
      </form>

      {result && (
        <div className="mt-5 text-center">
          <p className="text-lg font-semibold text-green-600">Interest: ₹{result.interest}</p>
          <p className="text-lg font-semibold text-gray-700">Total Amount: ₹{result.totalAmount}</p>
        </div>
      )}
    </div>
  );
};

export default InterestCalculator;
