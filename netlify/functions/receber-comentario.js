exports.handler = async function(event, context) {
  console.log("Função receber-comentario acionada!");
  const { Octokit } = await import("@octokit/core");
  const githubToken = process.env.GITHUB_COMMENT_TOKEN;
  const octokit = new Octokit({ auth: githubToken });
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
  // ... (código antes do bloco try) ...

try {
  const commentData = `
    name: ${data.name}
    email: ${data.email}
    comment: |
    ${data.comment}
      date: ${new Date().toISOString()}
      page_url: ${data['page-url']}
      # status: pending  <-- Adicionaremos status 'pending' para moderação depois
  `;
  const commentFilePath = '_data/comments/test-comment.yml'; // <-- Caminho TEMPORÁRIO para teste

  const fileContentBase64 = Buffer.from(commentData).toString('base64');

  const createFileResponse = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: 'rregio', // Seu nome de usuário GitHub
    repo: 'perdido-anotante', // O nome do seu repositório
    path: commentFilePath, // O caminho onde o arquivo será criado
    message: `Novo comentário de ${data.name} no post ${data['post-title']}`, // Mensagem do commit/PR
    content: fileContentBase64, // O conteúdo do arquivo em Base64
    branch: 'main',
      committer: {
        name: 'Netlify Comment Bot', // Nome do committer
        email: 'seu-email-de-deploy-no-netlify@example.com' // Email (pode ser genérico ou associado ao seu deploy)
      },
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    console.log("Arquivo de comentário criado no GitHub:", createFileResponse.data.content.path);
    console.log("URL do commit/PR:", createFileResponse.data.commit.html_url);
  } catch (error) {
    console.error("Erro ao criar arquivo de comentário no GitHub:", error.message);
  }
  return {
    statusCode: 200, // Código HTTP 200: OK (Sucesso)
    body: "Comentário recebido com sucesso (processamento futuro)"
  };
};