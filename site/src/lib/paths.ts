/**
 * Внутренние ссылки с учётом base-пути.
 *
 * Сайт публикуется на GitHub Pages по адресу https://ntiwgg.github.io/school29-site/
 * (base: '/school29-site/'). Astro не переписывает корневые ссылки в разметке
 * (`href="/news/"` остаётся как есть), поэтому все внутренние пути — к страницам
 * и public-ассетам — префиксуем вручную через import.meta.env.BASE_URL.
 *
 * Внешние ссылки (https://…) и якоря (#…) возвращаются без изменений.
 */
export const url = (path: string): string =>
  path.startsWith('/') ? `${import.meta.env.BASE_URL}${path.slice(1)}` : path;
