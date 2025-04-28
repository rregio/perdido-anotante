// netlify/functions/receber-comentario.js
exports.handler = async function(event, context) {
    console.log("Função receber-comentario acionada!");
  
    // Verificar se a requisição é um POST, como esperado de um formulário
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405, // Método não permitido
        body: "Método não permitido"
      };
    }
  
    // Tentativa simples de parsear o corpo da requisição (esperamos dados de formulário)
    const data = JSON.parse(event.body); // Netlify Forms geralmente envia como JSON
  
    console.log("Dados recebidos do formulário:", data);
  
    // Resposta simples de sucesso por enquanto
    return {
      statusCode: 200,
      body: "Comentário recebido com sucesso (processamento futuro)"
    };
};