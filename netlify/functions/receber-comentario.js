exports.handler = async function(event, context) {
  console.log("Função receber-comentario acionada!");
  const { Octokit } = await import("@octokit/core");
  const githubToken = process.env.GITHUB_COMMENT_TOKEN;

  if (!githubToken) {
    console.error("Erro: Variável de ambiente GITHUB_COMMENT_TOKEN não configurada!");
    return {
      statusCode: 500,
      body: "Erro interno: Token de acesso ao GitHub não configurado."
    };
  }

  const octokit = new Octokit({ auth: githubToken });
  if (event.httpMethod !== "POST") {
    console.log("Método não permitido:", event.httpMethod);
    return {
      statusCode: 405,
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
  try {
    const commentDataObject = {
      name: data.name || 'Anonymous',
      email: data.email || '',
      date: new Date().toISOString(),
      page_url: data['page-url'],
      comment: data.comment || '',
    };
    const fileContentJson = JSON.stringify(commentDataObject, null, 2);
    const urlPath = new URL(data['page-url']).pathname;
    const postSlug = urlPath.replace(/\.html$/, '').replace(/^\//, '');

    const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
    const authorNameSlug = data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : 'anonymous'; 
    const uniqueFileName = `${timestamp}-${authorNameSlug.substring(0, 20)}.json`;

    const commentFilePath = `_data/comments/${postSlug}/${uniqueFileName}`;
    const newBranchName = `netlify-comment-${timestamp}`;
    const baseBranch = 'main';
    console.log(`Configurando para criar arquivo em: ${commentFilePath} na branch: ${newBranchName}, baseada em: ${baseBranch}`);
    console.log(`Obtendo SHA do último commit da branch base: ${baseBranch}`);
    const { data: baseBranchInfo } = await octokit.request('GET /repos/{owner}/{repo}/branches/{branch}', {
      owner: 'rregio',
      repo: 'perdido-anotante',
      branch: baseBranch,
      headers: { 'X-GitHub-Api-Version': '2022-11-28' }
    });
    const lastCommitSha = baseBranchInfo.commit.sha;
    console.log(`Último commit SHA da branch ${baseBranch}: ${lastCommitSha}`);
    console.log(`Criando nova branch: ${newBranchName} a partir de ${lastCommitSha}`);
    await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
      owner: 'rregio',
      repo: 'perdido-anotante',
      ref: `refs/heads/${newBranchName}`,
      sha: lastCommitSha,
      headers: { 'X-GitHub-Api-Version': '2022-11-28' }
    });
    console.log(`Branch ${newBranchName} criada com sucesso.`);
    const fileContentBase64 = Buffer.from(fileContentJson, 'utf8').toString('base64');
    console.log(`Criando arquivo ${commentFilePath} na branch ${newBranchName}`);
    const createFileResponse = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'rregio',
      repo: 'perdido-anotante',
      path: commentFilePath,
      message: `Adiciona comentário de ${commentDataObject.name} para moderação`,
      content: fileContentBase64,
      branch: newBranchName,
      committer: {
        name: 'Netlify Comment Bot',
        email: 'seu-email-de-deploy-no-netlify@example.com'
      },
      headers: { 'X-GitHub-Api-Version': '2022-11-28' }
    });
    console.log(`Arquivo ${commentFilePath} criado com sucesso na branch ${newBranchName}.`);
    console.log(`Detalhes do commit de criação do arquivo: ${createFileResponse.data.commit.html_url}`);
    console.log(`Criando Pull Request de ${newBranchName} para ${baseBranch}`);
    const { data: prResponse } = await octokit.request('POST /repos/{owner}/{repo}/pulls', {
      owner: 'rregio',
      repo: 'perdido-anotante',
      title: `Novo comentário de ${commentDataObject.name} no post: "${data['post-title']}"`,
      head: newBranchName,
      base: baseBranch,
      body: `Comentário submetido por ${commentDataObject.name} (${commentDataObject.email}) em ${commentDataObject.date} no post ${commentDataObject.page_url}.\n\nConteúdo:\n${commentDataObject.comment}`,
      headers: { 'X-GitHub-Api-Version': '2022-11-28' }
    });
    console.log(`Pull Request criado com sucesso! PR #: ${prResponse.number}, URL: ${prResponse.html_url}`);
    const redirectUrl = `${data['page-url']}?comment_status=moderation`; 
    console.log(`Tentando redirecionar para: ${redirectUrl}`);
    return {
      statusCode: 302,
      headers: {
        "Location": redirectUrl
      },
      body: "Redirecionando você de volta para o post..."
    };
  } catch (error) {
    console.error("Erro no processo de criação de Pull Request no GitHub:", error);
    return {
      statusCode: 500,
      body: "Ocorreu um erro ao submeter seu comentário. Por favor, tente novamente mais tarde."
    };
  }
};