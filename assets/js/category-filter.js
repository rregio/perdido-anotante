document.addEventListener('DOMContentLoaded', function() {
  // Seleciona todos os links de categoria (incluindo o 'Todas' que já está no HTML)
  const categoryLinks = document.querySelectorAll('.category-list a');
  const postListItems = document.querySelectorAll('.post-block');

  // Adiciona listeners de clique para cada link de categoria
  categoryLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault(); // Previne o comportamento padrão do link (não recarrega a página)
      const selectedCategory = this.getAttribute('data-category'); // Pega a categoria do atributo data-category

      // Itera sobre todos os blocos de post
      postListItems.forEach(item => {
        const postCategories = item.getAttribute('data-categories'); // Pega as categorias do post
        // Mostra o post se a categoria for 'all' ou se as categorias do post incluirem a categoria selecionada
        if (selectedCategory === 'all' || (postCategories && postCategories.includes(selectedCategory))) {
          item.style.display = 'block'; // Mostra o post
        } else {
          item.style.display = 'none'; // Esconde o post
        }
      });

      // Remove a classe 'active' de todos os links e adiciona ao link clicado para destacar
      categoryLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // O código para mostrar todos os posts inicialmente (o link 'Todas' já está no HTML e selecionado)
  // A parte que causava erro e tentava adicionar 'allCategoryLink' foi removida.

  // Mostra todos os posts inicialmente (isso já acontece pelo CSS, mas garantimos)
  postListItems.forEach(item => item.style.display = 'block');
});