---
layout: default
title: Home Page
lang: en
---

Welcome to **PerdidoAnotante**!

My name is **Rodrigo**, I'm over 40 years old, and honestly, I feel a bit lost. But I've decided to document this journey, writing down everything that happens in my notebooks and sharing it here.

In this space, you'll find a bit of everything: from reflections on games, my search for better mental well-being, to everyday experiences and various thoughts, and my thoughts on the books I've been reading.

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

<ul class="post-list">
  <div class="post-grid">
    {% assign english_posts = site.posts | where: "lang", "en" %}
    {% for post in english_posts %}
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