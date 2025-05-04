document.addEventListener('DOMContentLoaded', function() {
  const input = document.getElementById('search-input');
  const posts = document.querySelectorAll('.post-list .post-item');

  input.addEventListener('input', function() {
    const query = input.value.toLowerCase();
    posts.forEach(function(post) {
      const title = post.querySelector('.post-title').innerText.toLowerCase();
      const excerptElem = post.querySelector('.post-excerpt');
      const excerpt = excerptElem ? excerptElem.innerText.toLowerCase() : '';
      if (title.includes(query) || excerpt.includes(query)) {
        post.style.display = '';
      } else {
        post.style.display = 'none';
      }
    });
  });
});