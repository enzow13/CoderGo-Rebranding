// Instalar: npm install @monaco-editor/react pyodide

import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

const CodingArena = () => {
  const [code, setCode] = useState("# Escreva sua solução aqui\nprint('Olá, Mundo!')");
  const [output, setOutput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [pyodide, setPyodide] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Inicializa o Pyodide (Python no navegador)
  useEffect(() => {
    const loadPyodide = async () => {
      // Script do pyodide deve estar carregado no index.html
      const py = await window.loadPyodide();
      setPyodide(py);
    };
    loadPyodide();
  }, []);

  // 1. Função para rodar o código (Execução Local)
  const runCode = async () => {
    if (!pyodide) return;
    try {
      // Captura o 'print' do python para exibir na nossa tela
      pyodide.setStdout({ batched: (msg) => setOutput((prev) => prev + msg + "\n") });
      await pyodide.runPythonAsync(code);
    } catch (error) {
      setOutput(`Erro: ${error.message}`);
    }
  };

  // 2. Função para a IA Analisar (O "Mentor")
  const askAI = async () => {
    setLoadingAI(true);
    // Aqui você chamaria seu backend, que chama a OpenAI
    const response = await fetch('/api/check-code', {
        method: 'POST',
        body: JSON.stringify({ userCode: code, userOutput: output })
    });
    const data = await response.json();
    setFeedback(data.message); // Ex: "Sua lógica está certa, mas tente usar um loop for."
    setLoadingAI(false);
  };

  return (
    <div className="arena-container">
      <div className="sidebar">
        <h3>Desafio do Dia</h3>
        <p>Crie uma função que retorne a soma de dois números.</p>
        <button className="btn-hint">Pedir Dica</button>
      </div>

      <div className="editor-area">
        <Editor
          height="60vh"
          defaultLanguage="python"
          defaultValue={code}
          theme="vs-dark" // Tema idêntico ao VSCode
          onChange={(value) => setCode(value)}
        />
        <div className="controls">
          <button onClick={() => { setOutput(""); runCode(); }} className="btn-run">▶ Executar</button>
          <button onClick={askAI} className="btn-submit">✅ Enviar para IA</button>
        </div>
      </div>

      <div className="output-area">
        <h4>Terminal:</h4>
        <pre>{output}</pre>
        {feedback && <div className="ai-feedback">🤖 IA: {feedback}</div>}
      </div>
    </div>
  );
};

export default CodingArena;