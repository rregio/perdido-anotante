---
layout: default
title: Página Inicial
lang: pt
---

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
  {% for post in site.posts %}
    {% if post.lang == 'pt' %}
      <li data-categories="{% for category in post.categories %}{{ category | slugify }} {% endfor %}">
        <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>
        <h3>
          <a class="post-link" href="{{ post.url | relative_url }}">
            {{ post.title | escape }}
          </a>
        </h3>
        {% if post.excerpt %}
          {{ post.excerpt }}
        {% endif %}
      </li>
    {% endif %}
  {% endfor %}
</ul>