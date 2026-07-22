async function fetchPage() {
  const res = await fetch('http://localhost:3000/programmes/data-analytics-career-accelerator/apply?plan=Upfront%20Payment');
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("HTML snippet:", text.slice(0, 1000));
}

fetchPage().catch(console.error);
