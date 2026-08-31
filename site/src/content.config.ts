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

/**
 * Коллекция «Сведения об образовательной организации»: файлы src/content/sveden/*.md,
 * 14 подразделов по приказу Рособрнадзора № 1493.
 * `num` задаёт порядок (1–14) — по нему сортируются карточки на /sveden/ и сайдбар.
 * `title` и `description` совпадают 1:1 с разметкой карточек /sveden/.
 * Контент подраздела — markdown-тело файла (рендерится на странице /sveden/<slug>/).
 */
const sveden = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sveden' }),
  schema: z.object({
    /** Номер подраздела по приказу № 1493 (1–14) — задаёт порядок отображения */
    num: z.number(),
    /** Название подраздела (как в карточке на /sveden/) */
    title: z.string(),
    /** Краткое описание для карточки на /sveden/ */
    description: z.string(),
  }),
});

/**
 * Коллекция «Педагогический состав»: файлы src/content/teachers/*.md.
 * Поля по ПП РФ № 1802 (п. 11). Текущая таблица на /sveden-teachers/ показывает
 * 5 колонок (name, position, subjects, category, education) — остальные поля
 * (degree, profdev, retraining, experience, programs) хранятся для полного
 * состава сведений и заполняются через Decap. `order` задаёт порядок строк
 * в таблице (порядок исходной разметки не алфавитный).
 * Незаполненные поля — пустые строки/массивы по умолчанию, чтобы Decap
 * сохранял записи с пустыми полями без ошибок схемы.
 */
const teachers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/teachers' }),
  schema: z.object({
    /** Порядок строки в таблице (1 — первая) */
    order: z.number().int(),
    /** ФИО педагога */
    name: z.string(),
    /** Должность */
    position: z.string(),
    /** Преподаваемые учебные предметы */
    subjects: z.string(),
    /** Квалификационная категория */
    category: z.string().default(''),
    /** Образование и квалификация */
    education: z.string().default(''),
    /** Учёная степень / звание (пусто, если нет) */
    degree: z.string().default(''),
    /** Повышение квалификации за последние 3 года (по строке на курс) */
    profdev: z.array(z.string()).default([]),
    /** Профессиональная переподготовка (по строке на курс) */
    retraining: z.array(z.string()).default([]),
    /** Общий стаж / стаж по специальности */
    experience: z.string().default(''),
    /** Наименование программ, в которых участвует педагог */
    programs: z.string().default(''),
  }),
});

export const collections = { news, announcements, sveden, teachers };
