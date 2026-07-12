import React from 'react';

/**
 * Highlights matches of the search query inside the text with a soft amber backdrop.
 */
export function highlightText(text: string, search: string) {
  if (!text) return <></>;
  if (!search || !search.trim()) return <>{text}</>;

  try {
    const escapedSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escapedSearch})`, 'gi');
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark
              key={i}
              className="bg-amber-100 text-amber-950 dark:bg-amber-950/60 dark:text-amber-200 rounded-[2px] px-0.5"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  } catch (e) {
    return <>{text}</>;
  }
}

/**
 * Formats date into standard human readable string.
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}
