---
layout: default
title: Home Page
lang: en
---

<h1 class="page-heading">Recently added posts</h1>

<div class="category-list-container">
  <strong>Categories:</strong>
  <div class="category-list">
    <a href="#" data-category="all" class="active">All</a>, {% for category in site.categories %}
      {% assign posts_in_en = category.last | where: "lang", "en" %}
      {% if posts_in_en.size > 0 and category.first != nil %}
        {% unless forloop.first %}, {% endunless %}
        <a href="#" data-category="{{ category.first | slugify }}">{{ category.first }}</a>
      {% endif %}
    {% endfor %}
  </div>
</div>

<ul class="post-list">
  {% for post in site.posts %}
    {% if post.lang == 'en' %}
      <li data-categories="{% for category in post.categories %}{{ category | slugify }} {% endfor %}">
        <span class="post-meta">{{ post.date | date: "%Y %b %-d" }}</span>
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