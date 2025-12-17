// backend/server.js
const express = require('express');
const cors = require('cors');
// Importa a biblioteca do Google Gemini
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Configure sua API KEY do Google aqui
const genAI = new GoogleGenerativeAI("AIzaSyD_DAIq87MFo8CscfPGU51f4eDAMbxhWyM");

// Configuração para o Gemini sempre responder em JSON (Importante!)
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash", // Modelo rápido e eficiente
  generationConfig: { responseMimeType: "application/json" } 
});

app.get('/', (req, res) => {
  res.send('O Cérebro (Gemini) está ligado!');
});

app.post('/api/check-code', async (req, res) => {
  console.log("Recebi código para o Gemini analisar...");
  const { userCode } = req.body;

  try {
    const prompt = `
      Você é um professor de Python focado em iniciantes.
      Analise o seguinte código enviado por um aluno:
      "${userCode}"
      
      Regras:
      1. Se houver erro, explique de forma curta.
      2. Se estiver certo, parabenize.
      3. RESPONDA APENAS NESTE FORMATO JSON:
      { "message": "sua explicação aqui" }
    `;

    // 1. Gera o conteúdo
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // 2. Pega o texto da resposta
    const text = response.text();
    
    // 3. Envia para o frontend
    // Como configuramos responseMimeType: "application/json", o texto já vem formatado
    res.json(JSON.parse(text));

  } catch (error) {
    console.error("Erro no Gemini:", error);
    res.status(500).json({ message: "O Gemini está confuso... (Erro no servidor)" });
  }
});

app.listen(PORT, () => {
  console.log(`✨ Cérebro Gemini rodando na porta ${PORT}`);
});