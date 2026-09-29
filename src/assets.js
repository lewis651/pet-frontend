// Media lives in /public/media and is served by Vite as-is.
// Keeping large photos and videos out of the bundler graph avoids
// processing ~180 media files at build time.
//
// Folder layout is preserved from the original src/assets folder,
// e.g. 'yorkies/york1a.jpg' -> /media/yorkies/york1a.jpg
const BASE = '/media';

export const A = (p) => `${BASE}/${p.replace(/^assets\//, '')}`;
