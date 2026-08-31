// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Сохраняем разметку 1:1 с исходным HTML-дизайном (в т.ч. пробелы
  // между inline-элементами), чтобы не менять визуал сайта.
  compressHTML: false,
});
