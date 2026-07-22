import { extractIframeDimensions, sanitizeEmbedCode } from '../lib/utils';

function runTests() {
  console.log("Starting Review Iframe Dimension Tests...\n");

  const testCases = [
    {
      name: "Explicit Dimensions (Standard)",
      input: '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" width="560" height="315" allowfullscreen></iframe>',
      expectedWidth: "560",
      expectedHeight: "315"
    },
    {
      name: "Single Quotes & Spaces",
      input: "<iframe src='https://www.youtube.com/embed/dQw4w9WgXcQ'   width = '640'   height = '360' ></iframe>",
      expectedWidth: "640",
      expectedHeight: "360"
    },
    {
      name: "Percentage Width & Explicit Height",
      input: '<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:1234" width="100%" height="450"></iframe>',
      expectedWidth: "100%",
      expectedHeight: "450"
    },
    {
      name: "No Explicit Dimensions",
      input: '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen></iframe>',
      expectedWidth: undefined,
      expectedHeight: undefined
    }
  ];

  let success = true;

  testCases.forEach((tc, idx) => {
    console.log(`Test Case ${idx + 1}: ${tc.name}`);
    const dims = extractIframeDimensions(tc.input);
    const sanitized = sanitizeEmbedCode(tc.input, { keepDimensions: true });

    const widthMatch = dims.width === tc.expectedWidth;
    const heightMatch = dims.height === tc.expectedHeight;

    console.log(`- Input iframe: ${tc.input}`);
    console.log(`- Extracted: width=${dims.width}, height=${dims.height}`);
    console.log(`- Sanitized: ${sanitized}`);
    
    if (widthMatch && heightMatch) {
      console.log(`- Result: PASSED`);
    } else {
      console.log(`- Result: FAILED (Expected width=${tc.expectedWidth}, height=${tc.expectedHeight})`);
      success = false;
    }
    console.log("");
  });

  // Test dimension scaling override
  console.log("Test Case 5: Dimension Override (Scaling down width to 350)");
  const rawIframe = '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" width="560" height="315"></iframe>';
  const scaled = sanitizeEmbedCode(rawIframe, { overrideWidth: "350", overrideHeight: "197" });
  console.log(`- Original: ${rawIframe}`);
  console.log(`- Scaled output: ${scaled}`);
  if (scaled.includes('width="350"') && scaled.includes('height="197"')) {
    console.log("- Scaling override: PASSED");
  } else {
    console.log("- Scaling override: FAILED");
    success = false;
  }
  console.log("");

  if (success) {
    console.log("ALL TESTS PASSED SUCCESSFULLY!");
  } else {
    console.log("SOME TESTS FAILED!");
  }
}

runTests();
