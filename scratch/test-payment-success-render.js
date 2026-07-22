async function testFetch() {
  console.log("Testing fetch on http://localhost:3000/payment-success...");
  const res = await fetch("http://localhost:3000/payment-success");
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Contains Welcome to Uptrail?", text.includes("Welcome to Uptrail"));
  console.log("Contains Payment Successful?", text.includes("Payment Successful"));
}

testFetch().catch(console.error);
