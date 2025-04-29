// netlify/functions/receber-comentario.js
exports.handler = async function(event, context) {
  console.log("Função receber-comentario acionada!");
  // Verificar se a requisição é um POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Método não permitido"
    };
  }
  // --- Código CORRIGIDO para parsear dados form-urlencoded ---
  const body = event.body; // O corpo da requisição (string URL-encoded)
  const params = new URLSearchParams(body); // Cria um objeto URLSearchParams a partir da string

  // Converter URLSearchParams para um objeto JavaScript simples para facilitar o uso e logging
  const data = {};
  for (const [key, value] of params) {
    data[key] = value;
  }
  // --- Fim do Código CORRIGIDO ---
  console.log("Dados recebidos do formulário:", data);
  return {
    statusCode: 200,
    body: "Comentário recebido com sucesso (processamento futuro)"
  };
};