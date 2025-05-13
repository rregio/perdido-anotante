// Adiciona estilos CSS necessários
const style = document.createElement('style');
style.textContent = `
  .post-item {
    transition: opacity 0.3s ease;
  }
  .post-item.hidden {
    display: none !important;
  }
  #mensagem-resultados {
    text-align: center;
    padding: 20px;
    margin: 20px 0;
    background-color: #2c2c2c;
    border-radius: 8px;
    color: #F0F0F0;
    display: none;
  }
`;
document.head.appendChild(style);

// Configuração do Fuse.js
const fuseOptions = {
  keys: [
    { name: 'title', weight: 2 },
    { name: 'excerpt', weight: 1 }
  ],
  threshold: 0.4, // Aumentado para ser mais flexível
  distance: 200,  // Aumentado para permitir mais variações
  includeScore: true,
  minMatchCharLength: 2
};

// Função para criar o índice de busca
function criarIndiceBusca() {
  console.log('Criando índice de busca...');
  const posts = Array.from(document.getElementsByClassName('post-item')).map(post => {
    const titleElem = post.querySelector('.post-title a');
    const excerptElem = post.querySelector('.post-excerpt');
    
    const postData = {
      element: post,
      title: titleElem ? titleElem.textContent.trim() : '',
      excerpt: excerptElem ? excerptElem.textContent.trim() : ''
    };
    
    console.log('Post encontrado:', postData.title);
    return postData;
  });

  console.log(`Total de posts indexados: ${posts.length}`);
  return new Fuse(posts, fuseOptions);
}

// Função para realizar a busca
function realizarBusca(fuse, query) {
  console.log('Realizando busca por:', query);
  
  // Se a busca estiver vazia, mostra todos os posts
  if (!query.trim()) {
    document.querySelectorAll('.post-item').forEach(post => {
      post.classList.remove('hidden');
    });
    const mensagemResultados = document.getElementById('mensagem-resultados');
    if (mensagemResultados) mensagemResultados.style.display = 'none';
    return;
  }

  // Realiza a busca
  const resultados = fuse.search(query);
  console.log(`Resultados encontrados: ${resultados.length}`);
  
  // Esconde todos os posts primeiro
  document.querySelectorAll('.post-item').forEach(post => {
    post.classList.add('hidden');
  });

  // Mostra apenas os posts encontrados
  resultados.forEach(resultado => {
    resultado.item.element.classList.remove('hidden');
  });

  // Gerencia a mensagem de resultados
  let mensagemResultados = document.getElementById('mensagem-resultados');
  if (!mensagemResultados) {
    mensagemResultados = document.createElement('div');
    mensagemResultados.id = 'mensagem-resultados';
    const postList = document.querySelector('.post-list');
    if (postList) {
      postList.parentNode.insertBefore(mensagemResultados, postList);
    }
  }

  if (resultados.length === 0) {
    mensagemResultados.textContent = 'Nenhum post encontrado.';
    mensagemResultados.style.display = 'block';
  } else {
    mensagemResultados.style.display = 'none';
  }
}

// Inicializa a busca quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM carregado, inicializando busca...');
  
  const campoBusca = document.getElementById('search-input');
  if (!campoBusca) {
    console.error('Campo de busca não encontrado!');
    return;
  }

  // Cria o índice de busca
  const fuse = criarIndiceBusca();
  
  // Adiciona o evento de busca
  let timeoutId;
  campoBusca.addEventListener('input', function() {
    // Limpa o timeout anterior para evitar múltiplas buscas
    clearTimeout(timeoutId);
    
    // Espera 300ms após o usuário parar de digitar para fazer a busca
    timeoutId = setTimeout(() => {
      realizarBusca(fuse, this.value);
    }, 300);
  });

  // Faz uma busca inicial se houver texto no campo
  if (campoBusca.value) {
    realizarBusca(fuse, campoBusca.value);
  }
  
  console.log('Inicialização da busca concluída');
});