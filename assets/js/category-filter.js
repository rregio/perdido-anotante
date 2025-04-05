document.addEventListener('DOMContentLoaded', function() {
    const categoryLinks = document.querySelectorAll('.category-list a');
    const postListItems = document.querySelectorAll('.post-list li');
  
    categoryLinks.forEach(link => {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        const selectedCategory = this.getAttribute('data-category');
  
        postListItems.forEach(item => {
          const postCategories = item.getAttribute('data-categories');
          if (selectedCategory === 'all' || (postCategories && postCategories.includes(selectedCategory))) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
  
        // Remover classe 'active' de todos os links e adicionar ao link clicado
        categoryLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      });
    });
  
    // Mostrar todos os posts inicialmente e adicionar link "Todas"
    const categoryList = document.querySelector('.category-list');
    if (categoryList && categoryList.firstChild) {
      categoryList.insertBefore(allCategoryLink, categoryList.firstChild);
    } else if (categoryList) {
      categoryList.appendChild(allCategoryLink);
    }
  
    // Inicialmente mostrar todos os posts
    postListItems.forEach(item => item.style.display = 'block');
  });