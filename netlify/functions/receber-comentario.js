const { Octokit } = require("@octokit/core");
const githubToken = process.env.GITHUB_COMMENT_TOKEN;
const octokit = new Octokit({ auth: githubToken });

exports.handler = async function(event, context) {
  console.log("Função receber-comentario acionada!");

  if (event.httpMethod !== "POST") {
    console.log("Método não permitido:", event.httpMethod);
    return {
      statusCode: 405, // Código HTTP 405: Método Não Permitido
      body: "Método não permitido"
    };
  }
  const body = event.body;
  const params = new URLSearchParams(body);
  const data = {};
  for (const [key, value] of params) {
    data[key] = value;
  }
  console.log("Dados recebidos do formulário:", data);
  console.log("DIAGNÓSTICO: Tentando chamar a GitHub API FORA do try...catch"); // <-- Novo log de diagnóstico
    console.log("Entrando no bloco try para chamar a API");
    const repoInfo = await octokit.request('GET /repos/{owner}/{repo}', {
      owner: 'rregio', // <-- SEU NOME DE USUÁRIO AQUI
      repo: 'perdido-anotante',     // <-- NOME DO SEU REPOSITÓRIO AQUI
      headers: {
        'X-GitHub-Api-Version': '2022-11-28' // Versão recomendada da API
      }
    });
    console.log(`Conexão com GitHub API bem sucedida. Repositório: ${repoInfo.data.full_name}`);
    console.error("Erro ao interagir com a GitHub API:", error.message);
  return {
    statusCode: 200, // Código HTTP 200: OK (Sucesso)
    body: "Comentário recebido com sucesso (processamento futuro)"
  };
};