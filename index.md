---
layout: default
title: Página Inicial
lang: pt
---
<div class="intro-section">
  <img src="/assets/imagens/logo_site.jpg" alt="Perdido Anotante Logo na Introdução" class="intro-logo-image">
  <div class="intro-text-content">
    <p>Sejam bem-vindos ao <b>PerdidoAnotante</b>!</p>
    <p>Meu nome é <u><b>Rodrigo</b></u>, tenho mais de 40 anos e, honestamente, me sinto um pouco perdido. Mas decidi documentar essa jornada, anotando tudo o que acontece nos meus cadernos e compartilhando por aqui.</p>
    <p>Neste espaço, vocês encontrarão um pouco de tudo: desde reflexões sobre games, minha busca por mais bem-estar mental, até vivências do dia a dia e pensamentos diversos e meus pensamentos sobre livros que venho lendo.</p>
  </div>
</div>

<h1 class="page-heading">Posts Recentes</h1>

<div class="category-list-container">
  <strong>Categorias:</strong>
  <div class="category-list">
    <a href="#" data-category="all" class="active">Todas</a>
    {% for category in site.categories %}
      {% assign posts_in_pt = category.last | where: "lang", "pt" %}
      {% if posts_in_pt.size > 0 and category.first != nil %}
        {% unless forloop.first %}, {% endunless %}
        <a href="#" data-category="{{ category.first | slugify }}">{{ category.first }}</a>
      {% endif %}
    {% endfor %}
  </div>
</div>

<ul class="post-list">
  <div class="post-grid">
    {% assign portuguese_posts = site.posts | where: "lang", "pt" %}
    {% for post in portuguese_posts %}
      <div class="post-block" data-categories="{% for category in post.categories %}{{ category | slugify }} {% endfor %}">
        {% if post.header_image %}
          <img src="{{ post.header_image | relative_url }}" alt="{{ post.title | escape }}">
        {% endif %}
        <h3 class="post-title">
          <a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
        </h3>
        <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>
        {% if post.excerpt %}
          <p class="post-excerpt">{{ post.excerpt }}</p>
        {% endif %}
      </div>
    {% endfor %}
  </div>
</ul>
