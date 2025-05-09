---
layout: default
title: Home Page
description: homepage of the blog
lang: en
---

<div class="intro-section">
  <img src="/assets/imagens/logo_site.jpg" alt="Perdido Anotante Logo na Introdução" class="intro-logo-image" width="2048" height="2048">
  <div class="intro-text-content">
    <p>Welcome to <b>PerdidoAnotante</b>!</p>
    <p>My name is <u><b>Rodrigo</b></u>, I'm over 40 years old and, honestly, I feel a little lost. But I decided to document this journey, writing down everything that happens in my notebooks and sharing it here.</p>
    <p>In this space, you'll find a little bit of everything: from reflections on games, my search for more mental well-being, to everyday experiences and diverse thoughts and my thoughts on books I've been reading.</p>
  </div>
</div>
<h1 class="page-heading">Recently added posts</h1>

<div class="category-list-container">
  <strong>Categories:</strong>
  <div class="category-list">
    <a href="#" data-category="all" class="active">All</a>,
    {% for category in site.categories %}
      {% assign posts_in_en = category.last | where: "lang", "en" %}
      {% if posts_in_en.size > 0 and category.first != nil %}
        {% unless forloop.first %}, {% endunless %}
        <a href="#" data-category="{{ category.first | slugify }}">{{ category.first }}</a>
      {% endif %}
    {% endfor %}
  </div>
</div>

<input type="text" id="search-input" placeholder="Buscar por título ou resumo..." style="width:100%;padding:10px;margin-bottom:20px;font-size:1.1em;border-radius:5px;border:1px solid #333;background:#222;color:#fff;">

<ul class="post-list post-grid">
  {% assign english_posts = site.posts | where: "lang", "en" %}
  {% for post in english_posts %}
    <li class="post-item">
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
    </li>
  {% endfor %}
</ul>

<script src="/assets/js/search.js"></script>