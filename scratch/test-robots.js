async function testRobots() {
  console.log("Testing fetch on http://localhost:3000/robots.txt...");
  const res = await fetch("http://localhost:3000/robots.txt");
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Content:\n", text);
}

testRobots().catch(console.error);
