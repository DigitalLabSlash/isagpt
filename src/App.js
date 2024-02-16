import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const EssayCorrectionApp = () => {
  const [essayText, setEssayText] = useState('');
  const [customPrompt, setCustomPrompt] = useState(`Eres un profesor de español muy exigente corrigiendo todos los errores de lengua, gramática y conjugación y respondes siempre con en el texto integralmente corregido (todos los errores) con las reglas siguientes:
1. Para todos los errores lingüísticos (lengua, gramática, tiempos, conjugación, generos) marca la porción de texto incorrecta con '~~texto incorrecto~~'. Luego, escriba la o las correcciónes (para que el texto sea correcto quitandole los errores) en negrita como '**texto correcto**'. Por ejemplo, si el texto del estudiante dice 'los años recieentes', deberías corregirlo como 'los años ~~recieentes~~ **recientes**'.
Before sending your result, re-read your corrected text and improve further.`); // Default prompt
  const [selectedModel, setSelectedModel] = useState('gpt-4-1106-preview'); // Default model
  const [corrections, setCorrections] = useState({ text: '', feedback: '', evaluation: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // List of models including OpenAI and Anthropic's Claude
  const models = [
    'gpt-4-0125-preview',
    'gpt-4-turbo-preview',
    'gpt-4-1106-preview',
    'gpt-4',
    'gpt-4-32k',
    'gpt-3.5-turbo-0125',
    'gpt-3.5-turbo',
    'gpt-3.5-turbo-1106',
    'claude' // Representing Anthropic's Claude
  ];

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('https://isagpt.pythonanywhere.com/correct', {
        text: essayText,
        model: selectedModel,
        customPrompt: customPrompt // Sending custom prompt to backend
      });
      const data = response.data;
      setCorrections({
        text: data.text || '',
        feedback: data.feedback || '',
        evaluation: data.evaluation || {}
      });
      setLoading(false);
    } catch (err) {
      setError(`Error submitting essay for correction: ${err.message}`);
      setLoading(false);
    }
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

        <textarea
          className="custom-prompt-input"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Edit the GPT prompt here..."
          rows={5}
        />
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="model-select"
        >
          {models.map(model => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
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
            {/* Render evaluation */}
          </div>
        </div>
      )}
      {corrections.feedback && (
        <div className="section">
          <h2>Feedback</h2>
          <div className="feedback-output">
            {/* Render feedback */}
          </div>
        </div>
      )}
    </div>
  );
};

export default EssayCorrectionApp;
