const { sanitizeEmbedCode } = require('./lib/utils');

const testCases = [
  '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://youtu.be/dQw4w9WgXcQ',
  'https://player.vimeo.com/video/76979871',
];

for (const code of testCases) {
  try {
    const clean = sanitizeEmbedCode(code);
    console.log("INPUT:", code);
    console.log("OUTPUT:", clean);
    console.log("---");
  } catch(e) {
    console.error("INPUT:", code, "ERROR:", e.message);
  }
}
