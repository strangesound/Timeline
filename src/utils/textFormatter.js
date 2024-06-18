// src/utils/textFormatter.js

/**
 * Форматирует русский текст, добавляя неразрывный пробел перед предлогами и цифрами.
 * @param {string} text - Исходный текст
 * @returns {string} - Отформатированный текст
 */
export function formatRussianText(text) {
  // Регулярное выражение для поиска предлогов, исключая случаи в начале строки и перед скобкой
  const prepositions = /(?<!^|\()\b(в|и|а|о|у|с|к|от|до|на|по|об|под|за|для|со|над|из|без|через|между|перед|при|про|через|среди|у|около|после|вокруг|вне|перед|сквозь|чтобы|дабы|ради)\b(?=\s)/gi;
  // Регулярное выражение для поиска чисел, исключая случаи, когда перед числом стоит открывающая скобка
  const numbers = /(?<!\()\b(\d+)\b(?=\s*[А-Яа-яЁё])/g;
  // Регулярное выражение для поиска инициалов
  const initials = /\b([А-Я])\.([А-Я])\./g;
  // Регулярное выражение для поиска годов
  const yearWithG = /\b(\d{4})\sг\./g;

  // Функция для замены, добавляющая неразрывный пробел перед предлогами и цифрами
  const replacer = (match) => `\u00A0${match}`;

  // Применяем замену к тексту
  let formattedText = text
    .replace(prepositions, replacer)
    .replace(numbers, replacer)
    .replace(initials, (match, p1, p2) => `${p1}.\u00A0${p2}.`)
    .replace(yearWithG, (match, p1) => `${p1}\u00A0г.`);

  // Удаляем лишние пробелы перед неразрывными пробелами
  formattedText = formattedText.replace(/ \u00A0/g, '\u00A0');

  // Удаляем пробелы в начале строк
  formattedText = formattedText.replace(/^\s+/gm, '');

  return formattedText;
}
