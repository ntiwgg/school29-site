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

/**
 * Коллекция «Объявления»: файлы src/content/announcements/*.md.
 * Блок на главной рендерится из этой коллекции (сортировка по дате, свежие сверху).
 * `important` — маркер важности (класс notice-important), `icon` — иконка
 * из справочника AnnouncementIcon (все имена обязательны: схема не пропустит
 * запись без них, а невалидное значение упадёт на сборке — fail fast).
 */
const announcements = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/announcements' }),
  schema: z.object({
    /** Заголовок объявления */
    title: z.string(),
    /** Дата публикации, формат YYYY-MM-DD */
    date: z.coerce.date(),
    /** Важное объявление — класс notice-important и иконка-предупреждение */
    important: z.boolean().default(false),
    /** Имя SVG-иконки из справочника AnnouncementIcon */
    icon: z.enum(['alert', 'calendar', 'book', 'utensils']),
    /** Текст объявления на главной (анонс карточки) */
    excerpt: z.string().optional(),
  }),
});

export const collections = { news, announcements };
