// netlify/functions/receber-comentario.js

// Importa a classe Octokit
const { Octokit } = await import("@octokit/core"); // Importação dinâmica

// Obtém o token do GitHub
const githubToken = process.env.GITHUB_COMMENT_TOKEN;

// Cria instância do Octokit
const octokit = new Octokit({ auth: githubToken });

// O handler é a função principal que o Netlify executa
exports.handler = async function(event, context) {
  console.log("Função receber-comentario acionada!");

  // Verificar se a requisição é um POST
  if (event.httpMethod !== "POST") {
    console.log("Método não permitido:", event.httpMethod);
    return {
      statusCode: 405, // Método Não Permitido
      body: "Método não permitido"
    };
  }

  // --- Código para parsear dados form-urlencoded ---
  const body = event.body;
  const params = new URLSearchParams(body);
  const data = {};
  for (const [key, value] of params) {
    data[key] = value;
  }
  // --- Fim do Código de parseamento ---

  console.log("Dados recebidos do formulário:", data);

  // --- Bloco para criar o Arquivo e o Pull Request no GitHub ---
  try {
    // 1. Formatar os dados do comentário (em JSON)
    const commentDataObject = {
      name: data.name || 'Anonymous',
      email: data.email || '',
      date: new Date().toISOString(),
      page_url: data['page-url'],
      comment: data.comment || '',
      // status: 'pending' // Adicionaremos status se necessário, mas PR já indica pending
    };

    // Converter para string JSON formatada
    const fileContentJson = JSON.stringify(commentDataObject, null, 2);

    // 2. Extrair o slug do post para usar no caminho da pasta
    const urlPath = new URL(data['page-url']).pathname;
    const postSlug = urlPath.replace(/\.html$/, '').replace(/^\//, '');

    // 3. Gerar um nome de arquivo único (timestamp + um pequeno identificador)
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
    const authorNameSlug = data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : 'anonymous';
    const uniqueFileName = `${timestamp}-${authorNameSlug.substring(0, 20)}.json`;

    // 4. Definir o caminho COMPLETO do arquivo no repositório
    const commentFilePath = `_data/comments/${postSlug}/${uniqueFileName}`;

    // 5. Definir o nome da nova branch para o Pull Request
    const newBranchName = `netlify-comment-${timestamp}`; // Nome único para a branch

    // 6. Obter o SHA do último commit da branch base (geralmente 'main' ou 'master')
    const baseBranch = 'main'; // << CONFIRME SE SUA BRANCH PRINCIPAL SE CHAMA 'main' OU 'master' >>
    console.log(`Obtendo SHA do último commit da branch base: ${baseBranch}`);
    const { data: baseBranchInfo } = await octokit.request('GET /repos/{owner}/{repo}/branches/{branch}', {
      owner: 'rregio', // Seu nome de usuário GitHub
      repo: 'perdido-anotante', // O nome do seu repositório
      branch: baseBranch,
      headers: { 'X-GitHub-Api-Version': '2022-11-28' }
    });
    const lastCommitSha = baseBranchInfo.commit.sha;
    console.log(`Último commit SHA da branch ${baseBranch}: ${lastCommitSha}`);

    // 7. Criar a nova branch a partir do último commit da branch base
    console.log(`Criando nova branch: ${newBranchName}`);
    await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
      owner: 'rregio',
      repo: 'perdido-anotante',
      ref: `refs/heads/${newBranchName}`, // Caminho completo para a ref da nova branch
      sha: lastCommitSha, // O SHA do commit a partir do qual criar a branch
      headers: { 'X-GitHub-Api-Version': '2022-11-28' }
    });
    console.log(`Branch ${newBranchName} criada com sucesso.`);

    // 8. O conteúdo do arquivo JSON precisa ser codificado em Base64 para a API do GitHub
    const fileContentBase64 = Buffer.from(fileContentJson, 'utf8').toString('base64');

    // 9. Usar a GitHub API para criar o arquivo na NOVA BRANCH
    console.log(`Criando arquivo ${commentFilePath} na branch ${newBranchName}`);
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'rregio',
      repo: 'perdido-anotante',
      path: commentFilePath,
      message: `Adiciona comentário de ${commentDataObject.name} para moderação`, // Mensagem do commit na nova branch
      content: fileContentBase64,
      branch: newBranchName, // << CRIANDO NA NOVA BRANCH, NÃO NA MAIN >>
      committer: {
        name: 'Netlify Comment Bot',
        email: 'seu-email-de-deploy-no-netlify@example.com'
      },
      headers: { 'X-GitHub-Api-Version': '2022-11-28' }
    });
<<<<<<< HEAD
    console.log(`Arquivo ${commentFilePath} criado com sucesso na branch ${newBranchName}.`);

    // 10. Criar o Pull Request da nova branch para a branch base
    console.log(`Criando Pull Request de ${newBranchName} para ${baseBranch}`);
    const { data: prResponse } = await octokit.request('POST /repos/{owner}/{repo}/pulls', {
      owner: 'rregio',
      repo: 'perdido-anotante',
      title: `Novo comentário de ${commentDataObject.name} no post: "${data['post-title']}"`, // Título do Pull Request
      head: newBranchName, // A branch de onde o PR vem
      base: baseBranch, // A branch para onde o PR vai (main)
      body: `Comentário submetido por ${commentDataObject.name} (${commentDataObject.email}) em ${commentDataObject.date} no post ${commentDataObject.page_url}.\n\nConteúdo:\n${commentDataObject.comment}`, // Descrição do PR (opcional, mas útil)
      headers: { 'X-GitHub-Api-Version': '2022-11-28' }
    });
    console.log(`Pull Request criado com sucesso! PR #: ${prResponse.number}, URL: ${prResponse.html_url}`);

    // A função retornou sucesso, o PR foi criado
    return {
      statusCode: 200,
      body: `Comentário recebido. Por favor, aguarde moderação. PR #${prResponse.number}: ${prResponse.html_url}`
    };

=======
  
    console.log("Arquivo de comentário DINÂMICO (JSON) criado no GitHub:", createFileResponse.data.content.path);
    console.log("URL do commit/PR:", createFileResponse.data.commit.html_url);
>>>>>>> 1304f07076b96417fd731c82fe0491125ae6e2c6
  } catch (error) {
    // Se ocorrer um erro em QUALQUER PASSO da interação com a API
    console.error("Erro no processo de criação de Pull Request no GitHub:", error); // Logar o objeto de erro completo

    // Retornar um status de erro para o Netlify Forms
    return {
      statusCode: 500,
      body: "Ocorreu um erro ao submeter seu comentário. Por favor, tente novamente mais tarde."
    };
  }
  // --- Fim do bloco de criação de Pull Request ---

  // Esta linha de retorno final não será mais alcançada se o try...catch retornar
  // return { statusCode: 200, body: "Comentário recebido com sucesso (processamento futuro)" };
};