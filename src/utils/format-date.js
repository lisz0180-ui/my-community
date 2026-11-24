/**
 * ISO 날짜 문자열을 'YYYY.MM.DD' 형태로 변환한다.
 *
 * @param {string} isoString - ISO 형식 날짜 문자열 [Required]
 * @returns {string} 변환된 날짜 문자열 (값이 없으면 빈 문자열)
 *
 * Example usage:
 * formatDate('2026-11-24T12:00:00Z'); // '2026.11.24'
 */
export function formatDate(isoString) {
  if (!isoString) {
    return '';
  }
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${ year }.${ month }.${ day }`;
}
