const { sanitizeEmbedCode } = require('../lib/utils');

function detectEmbedType(htmlOrUrl) {
  const str = (htmlOrUrl || '').toLowerCase();
  if (str.includes('linkedin.com')) {
    return 'linkedin';
  }
  if (
    str.includes('instagram.com/reel') ||
    str.includes('instagram.com/p') ||
    str.includes('tiktok.com') ||
    str.includes('youtube.com/shorts') ||
    str.includes('youtube-nocookie.com/shorts')
  ) {
    return 'vertical-video';
  }
  return 'horizontal-video';
}

const linkedinCode = `<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:7200000000000000000" height="670" width="504" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>`;
const reelCode = `<iframe src="https://www.instagram.com/reel/Cw123456789/embed" height="600" width="400"></iframe>`;
const youtubeCode = `<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>`;

console.log("LinkedIn type:", detectEmbedType(linkedinCode));
console.log("LinkedIn clean HTML:", sanitizeEmbedCode(linkedinCode));

console.log("Reel type:", detectEmbedType(reelCode));
console.log("Reel clean HTML:", sanitizeEmbedCode(reelCode));

console.log("YouTube type:", detectEmbedType(youtubeCode));
console.log("YouTube clean HTML:", sanitizeEmbedCode(youtubeCode));
