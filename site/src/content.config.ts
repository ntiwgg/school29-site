import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Коллекция «Новости»: файлы src/content/news/*.md.
 * Рубрики и иконки ограничены списками из существующей разметки —
 * невалидные значения (опечатки, новые рубрики) невозможны,
 * а справочники иконок и цветов рубрик в компонентах всегда находят значение.
 */
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    /** Заголовок новости */
    title: z.string(),
    /** Дата публикации, формат YYYY-MM-DD */
    date: z.coerce.date(),
    /** Рубрика — совпадает с метками в разметке карточек */
    tag: z.enum(['События', 'Достижения', 'Объявления', 'Приём', 'Спорт', 'Безопасность']),
    /** Анонс для карточки (текст на главной и в ленте) */
    excerpt: z.string().optional(),
    /** Имя SVG-иконки из справочника NewsIcon */
    cover: z.enum(['megaphone', 'graduation', 'award', 'sun', 'clock', 'train', 'flask', 'diploma', 'shield']).optional(),
  }),
});

export const collections = { news };
