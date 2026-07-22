const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function run() {
  const filePath = 'C:\\Users\\habib\\.gemini\\antigravity-ide\\brain\\16803511-eef7-4c71-9b37-cf8ceb239d66\\.system_generated\\logs\\transcript.jsonl';
  if (!fs.existsSync(filePath)) {
    console.error("File does not exist!");
    return;
  }

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineCount = 0;
  for await (const line of rl) {
    lineCount++;
    try {
      const obj = JSON.parse(line);
      if (obj.type === 'USER_INPUT') {
        console.log(`Line ${lineCount} (USER):`, obj.content);
      }
    } catch (e) {}
  }
}

run().catch(console.error);
