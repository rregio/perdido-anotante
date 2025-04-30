// netlify/functions/receber-comentario.js

// O handler é a função principal que o Netlify executa
exports.handler = async function(event, context) {
  console.log("Função receber-comentario acionada!");

  // --- Importação Dinâmica do Octokit, Token e Setup CORRETAMENTE DENTRO do handler ---
  // Precisamos importar aqui porque import() é assíncrono e precisa de await
  // As variáveis de ambiente (process.env) também são melhor acessadas aqui
  const { Octokit } = await import("@octokit/core");

  // Obtém o token do GitHub DAS VARIÁVEIS DE AMBIENTE DO NETLIFY
  const githubToken = process.env.GITHUB_COMMENT_TOKEN;

  // Verifica se o token está disponível
  if (!githubToken) {
    console.error("Erro: Variável de ambiente GITHUB_COMMENT_TOKEN não configurada!");
    return {
      statusCode: 500,
      body: "Erro interno: Token de acesso ao GitHub não configurado."
    };
  }

  // Cria instância do Octokit USANDO O TOKEN
  const octokit = new Octokit({ auth: githubToken });
  // --- Fim da importação e setup do Octokit ---


  // Verificar se a requisição é um POST
  if (event.httpMethod !== "POST") {
    console.log("Método não permitido:", event.httpMethod);
    return {
      statusCode: 405, // Código HTTP 405: Método Não Permitido
      body: "Método não permitido"
    };
  }

  // --- Código para parsear dados form-urlencoded ---
  // O Netlify Forms envia os dados do formulário neste formato (não JSON)
  const body = event.body; // O corpo da requisição (uma string tipo 'campo1=valor1&campo2=valor2')
  const params = new URLSearchParams(body); // Cria um objeto para trabalhar com esses dados

  // Converte o objeto URLSearchParams para um objeto JavaScript simples para facilitar o acesso
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
      name: data.name || 'Anonymous', // Usa nome ou Anonymous
      email: data.email || '',       // Usa email ou vazio
      date: new Date().toISOString(), // Adiciona timestamp de quando o comentário foi processado
      page_url: data['page-url'],    // URL da página de onde veio o comentário
      comment: data.comment || '',   // Conteúdo do comentário
      // status: 'pending' // Podemos adicionar um campo de status se necessário para o Jekyll
    };

    // Converter para string JSON formatada (com indentação para legibilidade)
    const fileContentJson = JSON.stringify(commentDataObject, null, 2);

    // 2. Extrair o slug do post a partir do page-url para usar no caminho da pasta
    // Exemplo: 'https://perdidoanotante.netlify.app/mental/leituras/2025/04/26/Pensamentos-matutinos.html'
    const urlPath = new URL(data['page-url']).pathname; // Obtém a parte do caminho: '/mental/leituras/2025/04/26/Pensamentos-matutinos.html'
    const postSlug = urlPath.replace(/\.html$/, '').replace(/^\//, ''); // Remove .html e barra inicial: 'mental/leituras/2025/04/26/Pensamentos-matutinos'

    // 3. Gerar um nome de arquivo único (timestamp + um pequeno identificador do autor)
    const timestamp = new Date().toISOString().replace(/[:.-]/g, ''); // Timestamp único para o nome do arquivo
    const authorNameSlug = data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : 'anonymous'; // Nome do autor formatado para URL/slug
    const uniqueFileName = `${timestamp}-${authorNameSlug.substring(0, 20)}.json`; // Nome único + parte do nome do autor + extensão .json

    // 4. Definir o caminho COMPLETO do arquivo no repositório (dentro da pasta _data/comments/slug-do-post/)
    const commentFilePath = `_data/comments/${postSlug}/${uniqueFileName}`; // Caminho DINÂMICO com .json

    // 5. Definir o nome da nova branch para o Pull Request (nome único)
    const newBranchName = `netlify-comment-${timestamp}`; // Nome único para a branch baseada no timestamp

    // 6. Definir a branch base para o Pull Request (geralmente 'main' ou 'master')
    const baseBranch = 'main'; // CONFIRME SE SUA BRANCH PRINCIPAL SE CHAMA 'main' OU 'master'

    console.log(`Configurando para criar arquivo em: ${commentFilePath} na branch: ${newBranchName}, baseada em: ${baseBranch}`);

    // 7. Obter o SHA do último commit da branch base (precisamos disso para criar a nova branch)
    console.log(`Obtendo SHA do último commit da branch base: ${baseBranch}`);
    // Endpoint: GET /repos/{owner}/{repo}/branches/{branch}
    const { data: baseBranchInfo } = await octokit.request('GET /repos/{owner}/{repo}/branches/{branch}', {
      owner: 'rregio', // SEU NOME DE USUÁRIO NO GITHUB
      repo: 'perdido-anotante', // O nome do seu repositório
      branch: baseBranch,
      headers: { 'X-GitHub-Api-Version': '2022-11-28' }
    });
    const lastCommitSha = baseBranchInfo.commit.sha;
    console.log(`Último commit SHA da branch ${baseBranch}: ${lastCommitSha}`);

    // 8. Criar a nova branch a partir do último commit da branch base
    // Endpoint: POST /repos/{owner}/{repo}/git/refs
    console.log(`Criando nova branch: ${newBranchName} a partir de ${lastCommitSha}`);
    await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
      owner: 'rregio', // SEU NOME DE USUÁRIO NO GITHUB
      repo: 'perdido-anotante', // O nome do seu repositório
      ref: `refs/heads/${newBranchName}`, // Caminho completo para a ref da nova branch (ex: 'refs/heads/minha-nova-branch')
      sha: lastCommitSha, // O SHA do commit a partir do qual criar a branch
      headers: { 'X-GitHub-Api-Version': '2022-11-28' }
    });
    console.log(`Branch ${newBranchName} criada com sucesso.`);

    // 9. O conteúdo do arquivo JSON precisa ser codificado em Base64 para a API do GitHub
    const fileContentBase64 = Buffer.from(fileContentJson, 'utf8').toString('base64');

    // 10. Usar a GitHub API para criar o arquivo na NOVA BRANCH que acabamos de criar
    // Endpoint: PUT /repos/{owner}/{repo}/contents/{path}
    console.log(`Criando arquivo ${commentFilePath} na branch ${newBranchName}`);
    const createFileResponse = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'rregio', // SEU NOME DE USUÁRIO NO GITHUB
      repo: 'perdido-anotante', // O nome do seu repositório
      path: commentFilePath, // O caminho onde o arquivo .json será criado na branch
      message: `Adiciona comentário de ${commentDataObject.name} para moderação`, // Mensagem do commit na nova branch
      content: fileContentBase64, // O conteúdo do arquivo JSON em Base64
      branch: newBranchName, // MUITO IMPORTANTE: CRIANDO NA NOVA BRANCH, NÃO NA BASE
      committer: { // Informações de quem fez o commit (pode ser você ou um nome/email genérico)
        name: 'Netlify Comment Bot', // Nome do committer
        email: 'seu-email-de-deploy-no-netlify@example.com' // Email (use um email genérico ou associado ao seu deploy Netlify)
      },
      // sha: ... // Não precisamos do SHA do arquivo para CRIAR, apenas para atualizar/deletar
      headers: { 'X-GitHub-Api-Version': '2022-11-28' }
    });
    console.log(`Arquivo ${commentFilePath} criado com sucesso na branch ${newBranchName}.`);
    console.log(`Detalhes do commit de criação do arquivo: ${createFileResponse.data.commit.html_url}`);


    // 11. Criar o Pull Request da nova branch para a branch base
    // Endpoint: POST /repos/{owner}/{repo}/pulls
    console.log(`Criando Pull Request de ${newBranchName} para ${baseBranch}`);
    const { data: prResponse } = await octokit.request('POST /repos/{owner}/{repo}/pulls', {
      owner: 'rregio', // SEU NOME DE USUÁRIO NO GITHUB
      repo: 'perdido-anotante', // O nome do seu repositório
      title: `Novo comentário de ${commentDataObject.name} no post: "${data['post-title']}"`, // Título do Pull Request (visível no GitHub)
      head: newBranchName, // A branch de onde o PR vem (a nova branch com o arquivo)
      base: baseBranch, // A branch para onde o PR vai (sua branch principal, ex: 'main')
      body: `Comentário submetido por ${commentDataObject.name} (${commentDataObject.email}) em ${commentDataObject.date} no post ${commentDataObject.page_url}.\n\nConteúdo:\n${commentDataObject.comment}`, // Descrição do PR (visível no GitHub)
      headers: { 'X-GitHub-Api-Version': '2022-11-28' }
    });
    console.log(`Pull Request criado com sucesso! PR #: ${prResponse.number}, URL: ${prResponse.html_url}`);

    // --- Fim da lógica de criação de Pull Request ---


    // --- Retorno para o Netlify Forms (Redirecionamento) ---
    // Retornamos um objeto JSON no body com o campo 'redirect'
    // O Netlify Forms interpretará isso como uma instrução para redirecionar o usuário
    return {
      statusCode: 200, // Código HTTP 200: OK (Sucesso)
      body: JSON.stringify({
        message: "Comentário recebido para moderação. Obrigado!", // Mensagem opcional no body
        redirect: `${data['page-url']}?comment_status=moderation` // URL completa para onde redirecionar
      })
      // headers: { "Content-Type": "application/json" } // Opcional, Netlify Forms geralmente lida com isso
    };
    // --- Fim do retorno para o Netlify Forms ---


  } catch (error) {
    // --- Bloco de tratamento de erros ---
    // Se ocorrer um erro em QUALQUER PASSO da interação com a API ou outro erro não tratado no try
    console.error("Erro no processo de criação de Pull Request no GitHub:", error); // Logar o objeto de erro completo para debug

    // Retornar um status de erro para o Netlify Forms (mostrando uma mensagem de erro para o usuário)
    return {
      statusCode: 500, // Código HTTP 500: Erro Interno do Servidor
      body: "Ocorreu um erro ao submeter seu comentário. Por favor, tente novamente mais tarde."
      // Opcional: body: `Erro: ${error.message}` // Incluir detalhes do erro (bom para debug, ruim para usuário final)
    };
    // --- Fim do tratamento de erros ---
  }
}; // Certifique-se que a função handler fecha corretamente aqui