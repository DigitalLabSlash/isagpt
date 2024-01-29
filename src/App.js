// App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const EssayCorrectionApp = () => {
  const [essayText, setEssayText] = useState('');
  const [corrections, setCorrections] = useState({ text: '', feedback: '', evaluation: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('https://isagpt.pythonanywhere.com/correct', {
        text: essayText,
      });
      const data = response.data;
      setCorrections({
        text: data.text || '',
        feedback: data.feedback || '',
        evaluation: data.evaluation || {}
      });
      setLoading(false);
    } catch (err) {
      setError('Error submitting essay for correction: ' + err.message);
      setLoading(false);
    }
  };

  const renderEvaluation = () => {
    return Object.entries(corrections.evaluation).map(([key, value], index) => {
      // Extract the numerical mark if wrapped in brackets
      const mark = value.replace(/\[|\]/g, ''); // Remove brackets without using a character class
      return (
        <div key={index} className="evaluation-item">
          <strong>{key.replace(/_/g, ' ')}:</strong> <span className="evaluation-mark">{mark}</span>
        </div>
      );
    });
  };

  return (
    <div className="container">
      <h1>Essay Correction Tool</h1>
      <div className="input-container">
        <textarea
          className="essay-input"
          value={essayText}
          onChange={(e) => setEssayText(e.target.value)}
          placeholder="Paste the student's essay here..."
          rows={10}
        />
      </div>
      <button onClick={handleSubmit} disabled={loading} className="submit-button">
        {loading ? 'Correcting...' : 'Correct Essay'}
      </button>
      {error && <div className="error-message">{error}</div>}
      {corrections.text && (
        <div className="section">
          <h2>Corrected Text</h2>
          <div
            className="correction-output"
            dangerouslySetInnerHTML={{ __html: corrections.text }}
          />
        </div>
      )}
      {Object.keys(corrections.evaluation).length > 0 && (
        <div className="section">
          <h2>Section 2: Evaluation</h2>
          <div className="evaluation-output">
            {renderEvaluation()}
          </div>
        </div>
      )}
      {corrections.feedback && (
        <div className="section">
          <h2>Feedback</h2>
          <div className="feedback-output">
          </div>
        </div>
      )}
    </div>
  );
};

export default EssayCorrectionApp;
