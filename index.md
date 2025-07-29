---
layout: default
title: Página Inicial
description: página inicial do blog perdido anotante.
lang: pt
---

<div class="intro-section">
  <img src="/assets/imagens/logo_site.jpg" alt="Perdido Anotante Logo na Introdução" class="intro-logo-image" width="2048" height="2048">
  <div class="intro-text-content">
    <p>Sejam bem-vindos ao <b>PerdidoAnotante</b>!</p>
    <p>Meu nome é <u><b>Rodrigo</b></u>, tenho mais de 40 anos e, honestamente, me sinto um pouco perdido. Mas decidi documentar essa jornada, anotando tudo o que acontece nos meus cadernos e compartilhando por aqui.</p>
    <p>Neste espaço, vocês encontrarão um pouco de tudo: desde reflexões sobre games, minha busca por mais bem-estar mental, até vivências do dia a dia e pensamentos diversos e meus pensamentos sobre livros que venho lendo.</p>
  </div>
</div>

<input type="text" id="search-input" placeholder="Buscar por título ou resumo..." style="width:100%;padding:10px;margin-bottom:20px;font-size:1.1em;border-radius:5px;border:1px solid #333;background:#222;color:#fff;">

<h1 class="page-heading">Posts Recentes</h1>

<div class="category-list-container">
  <strong>Categorias:</strong>
  <div class="category-list">
    <a href="#" data-category="all" class="active category-button">Todas</a>
    {% assign portuguese_categories = '' | split: ',' %}
    {% for category in site.categories %}
      {% assign posts_in_pt = category.last | where: "lang", "pt" %}
      {% if posts_in_pt.size > 0 and category.first != nil %}
        {% assign portuguese_categories = portuguese_categories | push: category.first %}
      {% endif %}
    {% endfor %}

    {% for category_name in portuguese_categories %}
      <a href="#" data-category="{{ category_name | slugify }}" class="category-button">{{ category_name }}</a>
    {% endfor %}
  </div>
</div>

<style>
/* Adicione este CSS ao seu arquivo CSS principal (ex: style.css) ou na própria página se for temporário */
.category-list .category-button {
  display: inline-block; /* Faz com que os links fiquem lado a lado */
  padding: 5px 10px; /* Espaçamento interno */
  margin: 3px; /* Espaçamento entre os botões */
  border: 1px solid #555; /* Borda leve */
  border-radius: 5px; /* Cantos arredondados */
  background-color: #333; /* Fundo escuro */
  color: #eee; /* Cor do texto claro */
  text-decoration: none; /* Sem sublinhado */
  font-size: 0.9em; /* Tamanho da fonte um pouco menor */
  transition: background-color 0.3s, color 0.3s; /* Transição suave para hover */
}

.category-list .category-button:hover {
  background-color: #555; /* Mudar cor no hover */
  color: #fff;
}

.category-list .category-button.active {
  background-color: #007bff; /* Cor para a categoria ativa */
  border-color: #007bff;
  color: #fff;
}

.category-list {
    display: flex; /* Usa flexbox para melhor controle */
    flex-wrap: wrap; /* Quebra em múltiplas linhas se não couber */
    gap: 5px; /* Espaço entre os itens flex */
    margin-top: 5px; /* Espaço acima da lista de botões */
}
</style>

<ul class="post-list post-grid">
  {% assign portuguese_posts = site.posts | where: "lang", "pt" %}
  {% for post in portuguese_posts %}
    <li class="post-item">
      <div class="post-block" data-categories="{% for category in post.categories %}{{ category | slugify }}{% unless forloop.last %},{% endunless %}{% endfor %}">
        {% if post.header_image %}
          <img src="{{ post.header_image | relative_url }}" alt="{{ post.title | escape }}" width="{{ post.header_image_size }}" height="{{ post.header_image_size }}">
        {% endif %}
        <h3 class="post-title">
          <a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
        </h3>
        <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>
        {% if post.excerpt %}
          <p class="post-excerpt">{{ post.excerpt }}</p>
        {% endif %}
      </div>
    </li>
  {% endfor %}
</ul>