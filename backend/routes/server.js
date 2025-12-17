// backend/routes/ai.js (Exemplo Node.js/Express)
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/check-code', async (req, res) => {
  const { userCode, exerciseContext } = req.body;

  const prompt = `
    Você é um tutor de programação sênior, paciente e didático.
    O aluno está resolvendo este exercício: "${exerciseContext}".
    
    Código do aluno:
    ${userCode}

    Tarefa:
    1. Verifique se o código resolve o problema corretamente.
    2. Se estiver errado, explique o erro sem dar a resposta pronta.
    3. Se estiver certo, sugira uma melhoria de performance ou estilo (Pythonic way).
    4. Responda em formato JSON: { "status": "pass" | "fail", "feedback": "string", "pontos": number }
  `;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "gpt-4o-mini",
    response_format: { type: "json_object" } // Garante que a IA responda JSON
  });

  const aiResponse = JSON.parse(completion.choices[0].message.content);
  
  // Se passou, salva os pontos no banco de dados aqui
  if (aiResponse.status === "pass") {
      await database.users.incrementPoints(req.userId, aiResponse.pontos);
  }

  res.json(aiResponse);
});