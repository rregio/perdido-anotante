// Variáveis globais para manter o estado
let categoriaAtual = 'all';
let termoBusca = '';

// Função para aplicar os filtros
function aplicarFiltros() {
  const postItems = document.querySelectorAll('.post-item');
  const postBlocks = document.querySelectorAll('.post-block');
  const campoBusca = document.getElementById('search-input');
  
  // Atualiza o termo de busca
  termoBusca = campoBusca ? campoBusca.value.toLowerCase().trim() : '';

  postItems.forEach((item, index) => {
    const block = postBlocks[index];
    const categorias = block.getAttribute('data-categories') || '';
    const titulo = block.querySelector('.post-title a')?.textContent.toLowerCase() || '';
    const resumo = block.querySelector('.post-excerpt')?.textContent.toLowerCase() || '';
    
    // Verifica se o post corresponde à categoria selecionada
    const correspondeCategoria = categoriaAtual === 'all' || categorias.includes(categoriaAtual);
    
    // Verifica se o post corresponde ao termo de busca
    const correspondeBusca = !termoBusca || 
      titulo.includes(termoBusca) || 
      resumo.includes(termoBusca);
    
    // Mostra ou esconde o post baseado em ambos os filtros
    if (correspondeCategoria && correspondeBusca) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  });

  // Atualiza a mensagem de resultados
  const postsVisiveis = document.querySelectorAll('.post-item:not(.hidden)').length;
  const mensagemResultados = document.getElementById('mensagem-resultados');
  
  if (mensagemResultados) {
    if (postsVisiveis === 0) {
      mensagemResultados.textContent = 'Nenhum post encontrado.';
      mensagemResultados.style.display = 'block';
    } else {
      mensagemResultados.style.display = 'none';
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Seleciona todos os links de categoria
  const categoryLinks = document.querySelectorAll('.category-list a');
  const campoBusca = document.getElementById('search-input');

  // Adiciona listeners de clique para cada link de categoria
  categoryLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      
      // Atualiza a categoria atual
      categoriaAtual = this.getAttribute('data-category');
      
      // Atualiza a classe active
      categoryLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      
      // Aplica os filtros
      aplicarFiltros();
    });
  });

  // Adiciona listener para o campo de busca
  if (campoBusca) {
    let timeoutId;
    campoBusca.addEventListener('input', function() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(aplicarFiltros, 300);
    });
  }

  // Aplica os filtros iniciais
  aplicarFiltros();
});