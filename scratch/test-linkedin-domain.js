const { sanitizeEmbedCode } = require('../lib/utils');

function isLinkedInDomain(htmlOrUrl) {
  const str = (htmlOrUrl || '').toLowerCase();
  return str.includes('linkedin.com');
}

const shortLinkedInEmbed = `<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:7100000000000000000" height="480" width="504" frameborder="0" allowfullscreen="" title="Short LinkedIn post"></iframe>`;
const longLinkedInEmbed = `<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:7200000000000000000" height="720" width="504" frameborder="0" allowfullscreen="" title="Long LinkedIn post"></iframe>`;
const youtubeEmbed = `<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen></iframe>`;

console.log("Short LinkedIn isLinkedIn:", isLinkedInDomain(shortLinkedInEmbed));
console.log("Short LinkedIn Clean HTML:", sanitizeEmbedCode(shortLinkedInEmbed));

console.log("\nLong LinkedIn isLinkedIn:", isLinkedInDomain(longLinkedInEmbed));
console.log("Long LinkedIn Clean HTML:", sanitizeEmbedCode(longLinkedInEmbed));

console.log("\nYouTube isLinkedIn:", isLinkedInDomain(youtubeEmbed));
console.log("YouTube Clean HTML:", sanitizeEmbedCode(youtubeEmbed));
