/**
 * Общие помощники для новостей: рубрика → класс метки, слаг рубрики
 * и форматирование даты. Используются в NewsCard.astro (карточки),
 * NewsFilters.astro (фильтры), news/[slug].astro и news/tag/[tag].astro.
 */

/** Рубрика → класс цветовой метки (классы из styles.css) */
export const TAG_CLASS_MAP: Record<string, string> = {
  'События': 'tag-event',
  'Достижения': 'tag-achiev',
  'Приём': 'tag-announce',
  'Объявления': 'tag-announce',
  'Спорт': 'tag-event',
  'Безопасность': 'tag-safe',
};

/** Кириллица → латиница для слагов рубрик (строчные буквы, без диакритики) */
const TRANSLIT: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
  'з': 'z', 'и': 'i', 'й': 'i', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
  'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c',
  'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e',
  'ю': 'yu', 'я': 'ya',
};

/**
 * Рубрика «События» → слаг `sobytiya` для URL /news/tag/<слаг>/.
 * Символы вне кириллицы/латиницы заменяются на «-»; результат всегда
 * строчный и пригодный для URL (например, «Безопасность» → `bezopasnost`).
 */
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .split('')
    .map((char) => TRANSLIT[char] ?? char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Русские названия месяцев в родительном падеже — формат «27 августа 2026» */
const MONTHS_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

/** Дата «2026-08-27» → «27 августа 2026» (без сдвига часовых поясов) */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-');
  return `${Number(day)} ${MONTHS_GENITIVE[Number(month) - 1]} ${year}`;
}

/**
 * Планирование публикации: запись считается опубликованной, если её день
 * уже наступил (сегодня — опубликована). Даты из frontmatter без времени,
 * поэтому сравнение идёт по началу дня, без сдвигов часовых поясов.
 * Записи с датой в будущем скрываются с сайта, но остаются в git и админке.
 */
export function isPublished(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day <= today;
}
