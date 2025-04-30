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
    const commentDataObject = {
      name: data.name || 'Anonymous', // Usa nome ou Anonymous
      email: data.email || '',       // Usa email ou vazio
      date: new Date().toISOString(),
      page_url: data['page-url'],
      comment: data.comment || '',   // Conteúdo do comentário
      // status: 'pending'          // Manteremos isso para moderação depois
    };
    const fileContentJson = JSON.stringify(commentDataObject, null, 2);
    const urlPath = new URL(data['page-url']).pathname;
    const postSlug = urlPath.replace(/\.html$/, '').replace(/^\//, '');
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
    const authorNameSlug = data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : 'anonymous';
    const uniqueFileName = `${timestamp}-${authorNameSlug.substring(0, 20)}.json`;
    const commentFilePath = `_data/comments/${postSlug}/${uniqueFileName}`;
    const fileContentBase64 = Buffer.from(fileContentJson, 'utf8').toString('base64');
    const createFileResponse = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'rregio', 
      repo: 'perdido-anotante',
      path: commentFilePath, 
      message: `Novo comentário de ${commentDataObject.name} no post "${data['post-title']}"`,
      content: fileContentBase64,
      branch: 'main',
      committer: {
        name: 'Netlify Comment Bot',
        email: 'seu-email-de-deploy-no-netlify@example.com'
      },
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
  
    console.log("Arquivo de comentário DINÂMICO (JSON) criado no GitHub:", createFileResponse.data.content.path);
    console.log("URL do commit/PR:", createFileResponse.data.commit.html_url);
  } catch (error) {
    console.error("Erro ao criar arquivo de comentário no GitHub:", error.message);
  }
  return {
    statusCode: 200, // Código HTTP 200: OK (Sucesso)
    body: "Comentário recebido com sucesso (processamento futuro)"
  };
};