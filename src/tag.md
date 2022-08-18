---
pagination:
  data: collections
  size: 1
  alias: selectedTag
permalink: /tags/{{ selectedTag | slug }}/
layout: layouts/recipes-list.njk
eleventyComputed:
  metaTitle: "{{ selectedTag }}"
---
