// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Сохраняем разметку 1:1 с исходным HTML-дизайном (в т.ч. пробелы
  // между inline-элементами), чтобы не менять визуал сайта.
  compressHTML: false,
  // В dev-режиме Astro отдаёт 404 на /admin/, хотя public/admin/index.html
  // существует; preview/продакшн открывают его по адресу /admin/.
  redirects: {
    '/admin': '/admin/index.html',
    '/admin/': '/admin/index.html',
  },
});
