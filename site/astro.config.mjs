// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Машинный sitemap.xml для поисковиков (интеграция генерирует только
  // Astro-страницы; /admin/ из public/ в него не попадает).
  integrations: [sitemap()],
  // Домен сайта: нужен для canonical и OG-тегов (полный URL страницы).
  site: 'https://ntiwgg.github.io',
  // Сохраняем разметку 1:1 с исходным HTML-дизайном (в т.ч. пробелы
  // между inline-элементами), чтобы не менять визуал сайта.
  compressHTML: false,
  // Сайт публикуется на GitHub Pages по адресу
  // https://ntiwgg.github.io/school29-site/. Base нужен, чтобы внутренние
  // ссылки и собранные ассеты указывали на /school29-site/.
  base: '/school29-site/',
  // Редиректы /admin → /admin/index.html убраны: на статическом хостинге
  // GitHub Pages они не работают, а /school29-site/admin/ и так отдаёт
  // public/admin/index.html (статические хостинги для директории
  // автоматически отдают index.html). В dev-режиме /admin/ даёт 404 —
  // админка открывается как /admin/index.html (известный нюанс dev).
});
