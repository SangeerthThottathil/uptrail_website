export type PaymentOption = {
  id?: number | string
  pillText: string
  title: string
  description: string
  bulletPoints: string[]
  buttonLabel: string
  icon?: string
  redirectUrl?: string
  isHighlighted?: boolean
}

export type Programme = {
  slug: string
  title: string
  category: 'Data' | 'Business' | 'Digital'
  track: 'career' | 'bootcamp' | 'certification'
  duration: string
  format: string
  level: string
  blurb: string
  skills: string[]
  outcomes: string
  salary: string
  image: string
  modules: { title: string; detail: string; takeaways?: string[] }[]
  price?: {
    amount: string
    original?: string
    save?: string
    plan?: string
  }
  aboutRole?: string
  salaryLadder?: { role: string; range: string }[]
  certifications?: { name: string; detail: string; logoUrl?: string }[]
  faqs?: { q: string; a: string }[]
  showInMenu?: boolean
  paymentOptions?: PaymentOption[]
  seoTitle?: string
  metaDescription?: string
  brochureEnabled?: boolean
  brochureUrl?: string
}

export const programmes: Programme[] = [
  {
    slug: 'ai-data-analyst-career-programme',
    title: 'AI Data Analyst Career Programme',
    seoTitle: 'AI Data Analyst Career Programme — 6 Months | Uptrail',
    metaDescription: 'Become a job-ready data analyst in 6 months, part-time. Live mentoring in Excel, SQL, Python, Power BI and Azure AI, plus CV, interview and job-search coaching.',
    category: 'Data',
    track: 'career',
    duration: '6 months',
    format: '100% online, part-time',
    level: 'Beginner friendly',
    blurb:
      'A 6-month, part-time pathway that takes you from beginner to job-ready analyst with Excel, SQL, Python, Power BI and Azure AI — backed by a job guarantee.',
    skills: ['Excel', 'SQL', 'Python', 'Statistics', 'Power BI', 'Azure AI', 'Machine Learning'],
    outcomes: 'Job guarantee within 8 months or your full fee back',
    salary: '3 globally recognised certifications',
    image: '/images/programmes/ai-data-analyst-career-programme.png',
    price: {
      amount: '£2,495',
      original: '£2,775',
      save: 'Save 10% — £280',
      plan: '£350 first payment, followed by five monthly interest-free payments of £429.',
    },
    aboutRole:
      'Data analysis is the backbone of the digital economy — today’s world runs on data. Companies in finance, healthcare, retail and tech are desperate for professionals who can turn raw data into actionable insights. It’s a future-proof role with plenty of room for advancement; you can grow into senior analyst, data scientist or business intelligence roles, commanding competitive salaries even at entry level.',
    salaryLadder: [
      { role: 'Junior Data Analyst', range: '£27k – £35k' },
      { role: 'Data Analyst', range: '£50k – £60k' },
      { role: 'Senior Data Analyst', range: '£55k – £65k' },
      { role: 'Lead Data Analyst', range: '£75k – £85k' },
    ],
    certifications: [
      {
        name: 'CompTIA Data+',
        detail: 'A globally recognised certification proving your ability to analyse and communicate data insights.',
      },
      {
        name: 'Microsoft Power BI (PL-300)',
        detail: 'Master dashboard design, data modelling and reporting with Power BI, validated by Microsoft.',
      },
      {
        name: 'Microsoft Azure AI (AI-900)',
        detail: 'Gain essential knowledge of AI and machine learning concepts using Microsoft Azure.',
      },
    ],
    modules: [
      {
        title: 'Data fundamentals & Excel',
        detail: 'Data literacy, spreadsheets and analytical thinking from the ground up.',
        takeaways: [
          'Understand core concepts of data analysis and its role in decision-making.',
          'Gain confidence using Excel for data cleaning, organisation and analysis.',
          'Learn data types, formats and how to prepare raw datasets for analysis.',
          'Build your first portfolio project demonstrating Excel-based analysis.',
        ],
      },
      {
        title: 'Databases & SQL',
        detail: 'Query, join and model data from real-world databases.',
        takeaways: [
          'Write SQL queries to extract and filter data from relational databases.',
          'Join and aggregate data across multiple tables.',
          'Model and structure data for reliable analysis.',
        ],
      },
      {
        title: 'Python programming for data',
        detail: 'Clean, analyse and explore data with Python and its core libraries.',
        takeaways: [
          'Use Python and pandas to clean and transform datasets.',
          'Automate repetitive data workflows.',
          'Run exploratory analysis to surface patterns and insights.',
        ],
      },
      {
        title: 'Data visualisation & BI tools',
        detail: 'Build dashboards and earn the Microsoft Power BI PL-300 certification.',
        takeaways: [
          'Design interactive dashboards in Power BI.',
          'Model data and build reusable reports.',
          'Prepare for and sit the Microsoft Power BI PL-300 exam.',
        ],
      },
      {
        title: 'Advanced analysis & predictive modelling',
        detail: 'Apply statistics, AI and machine learning with Azure (AI-900).',
        takeaways: [
          'Apply statistical techniques to interpret data with confidence.',
          'Experiment with Azure Machine Learning.',
          'Prepare for and sit the Microsoft Azure AI-900 exam.',
        ],
      },
      {
        title: 'Capstone project & career prep',
        detail: 'Build a job-ready portfolio with CV reviews, interview prep and job search strategy.',
        takeaways: [
          'Deliver an end-to-end capstone project reviewed by a mentor.',
          'Build a professional, ATS-optimised CV and LinkedIn profile.',
          'Practise technical and behavioural interviews with coaching.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do I need a technical background?',
        a: 'No. The programme is beginner friendly and starts from the basics. We guide you step by step from spreadsheets through to AI and machine learning.',
      },
      {
        q: 'What certifications will I earn?',
        a: 'You’ll prepare for and earn three globally recognised certifications: CompTIA Data+, Microsoft Power BI (PL-300) and Microsoft Azure AI-900.',
      },
      {
        q: 'How does the job guarantee and career support work?',
        a: 'You receive CV reviews, LinkedIn optimisation, mock interviews and access to our employer network. If you don’t secure a role in data within 8 months of completing the programme, you receive your full programme fee back.',
      },
      {
        q: 'What kind of jobs can I apply for after completing the programme?',
        a: 'Graduates typically apply for roles such as Data Analyst, Junior Data Analyst, Business Intelligence Analyst and Reporting Analyst across finance, healthcare, retail and tech.',
      },
      {
        q: 'How much time will I need to commit each week?',
        a: 'The programme is part-time and designed to fit around work. Most learners commit around 10–15 hours per week across live sessions, labs and projects.',
      },
      {
        q: 'Do you offer flexible payment options?',
        a: 'Yes. You can pay in full and save 10%, or spread the cost across interest-free monthly instalments.',
      },
    ],
  },
  {
    slug: 'comptia-data-plus',
    title: 'CompTIA Data+ Certification Programme',
    seoTitle: 'CompTIA Data+ Certification Programme | Uptrail',
    metaDescription: 'Pass CompTIA Data+ in 3 months with weekly live mentoring, hands-on data projects and complete exam preparation. Globally recognised — beginner friendly.',
    category: 'Data',
    track: 'certification',
    duration: '3 months',
    format: '100% online, live mentoring',
    level: 'Beginner friendly',
    blurb:
      'Earn a globally recognised data certification in just 3 months, combining weekly live mentoring, hands-on projects and full exam preparation.',
    skills: ['Data concepts', 'Data analysis', 'Data visualisation', 'Exam prep', 'Live mentoring'],
    outcomes: 'Globally recognised CompTIA Data+ certification',
    salary: 'Certification included',
    image: '/images/programmes/comptia-data-plus.png',
    aboutRole:
      'CompTIA Data+ is an industry-recognised certification that validates your ability to analyse and communicate data insights. It’s an ideal credential for aspiring data analysts and professionals who want to prove their data skills to employers, opening doors to analyst and reporting roles across every sector.',
    salaryLadder: [
      { role: 'Junior Data Analyst', range: '£27k – £35k' },
      { role: 'Data Analyst', range: '£50k – £60k' },
      { role: 'Senior Data Analyst', range: '£55k – £65k' },
    ],
    certifications: [
      {
        name: 'CompTIA Data+',
        detail: 'A globally recognised certification proving your ability to mine, analyse and communicate data insights.',
      },
    ],
    modules: [
      { title: 'Data concepts & environments', detail: 'Master the core data concepts that underpin the CompTIA Data+ exam.' },
      { title: 'Data mining & analysis', detail: 'Hands-on projects analysing real datasets.' },
      { title: 'Visualisation & reporting', detail: 'Communicate insights clearly through effective visualisation.' },
      { title: 'Data governance & quality', detail: 'Understand quality, governance and best practice.' },
      { title: 'Exam preparation', detail: 'Full preparation and practice for the CompTIA Data+ exam.' },
    ],
    faqs: [
      {
        q: 'Do I need experience to take this programme?',
        a: 'No prior experience is required. The programme is beginner friendly and includes weekly live mentoring to support you through every topic.',
      },
      {
        q: 'Is the certification exam included?',
        a: 'The programme provides full preparation and practice for the CompTIA Data+ exam so you walk in exam-ready.',
      },
      {
        q: 'How is the programme delivered?',
        a: 'It’s 100% online over three months, combining weekly live mentoring sessions with hands-on projects and self-paced study.',
      },
    ],
  },
  {
    slug: 'digital-marketing-bootcamp',
    title: 'Digital Marketing Bootcamp',
    seoTitle: 'Digital Marketing Bootcamp — 5 Weeks, Live | Uptrail',
    metaDescription: 'Learn SEO, PPC, analytics and AI marketing tools in a 5-week live bootcamp with expert mentors and 1:1 career coaching. Beginner friendly — join the next cohort.',
    category: 'Digital',
    track: 'bootcamp',
    duration: '5 weeks',
    format: '100% online, flexible',
    level: 'Beginner friendly',
    blurb:
      'Level up your digital marketing career in a 5-week bootcamp — learn SEO, PPC, analytics and AI-driven marketing tools from expert mentors, with 1:1 career coaching.',
    skills: ['SEO', 'PPC', 'Analytics', 'AI marketing tools', 'Social media'],
    outcomes: 'Portfolio and career readiness for marketing roles',
    salary: '1:1 career coaching included',
    image: '/images/programmes/digital-marketing-bootcamp.png',
    aboutRole:
      'Digital marketing sits at the heart of how modern brands grow. Every business needs people who can drive traffic, run profitable campaigns and measure what works. It’s a creative, fast-moving field with strong demand and clear progression — from executive roles into management and specialist paths like SEO, paid media and growth.',
    salaryLadder: [
      { role: 'Marketing Executive', range: '£24k – £30k' },
      { role: 'Digital Marketer', range: '£30k – £40k' },
      { role: 'Marketing Manager', range: '£45k – £60k' },
    ],
    modules: [
      { title: 'Marketing foundations', detail: 'Channels, funnels and positioning for modern brands.' },
      { title: 'SEO', detail: 'Technical, on-page and content SEO that drives traffic.' },
      { title: 'PPC & paid acquisition', detail: 'Build and run paid campaigns across major platforms.' },
      { title: 'Analytics & AI tools', detail: 'Measure performance and use AI-driven marketing tools.' },
      { title: 'Real project & portfolio', detail: 'Work on a real project and build a professional profile.' },
    ],
    faqs: [
      {
        q: 'Is this bootcamp suitable for beginners?',
        a: 'Yes. It’s designed for both beginners and those already working in marketing who want to level up with modern, AI-driven skills.',
      },
      {
        q: 'What support do I get?',
        a: 'You’ll learn from expert mentors and receive 1:1 career coaching to help you apply your new skills and progress your career.',
      },
      {
        q: 'How long is the bootcamp?',
        a: 'The bootcamp runs over five weeks, delivered 100% online with flexible scheduling around your commitments.',
      },
    ],
  },
  {
    slug: 'ai-data-analyst-bootcamp',
    title: 'AI Data Analyst Bootcamp',
    seoTitle: 'AI Data Analyst Bootcamp — 6 Weeks, Live | Uptrail',
    metaDescription: 'Get job-ready in 6 weeks with Python, SQL, BI and AI tools. Build end-to-end analytics projects on real datasets, guided live by expert mentors. Beginner friendly.',
    category: 'Data',
    track: 'bootcamp',
    duration: '6 weeks',
    format: '100% online, hands-on',
    level: 'Beginner friendly',
    blurb:
      'A 6-week, hands-on experience designed to make you job-ready using Python, SQL, BI tools and AI, working with real-world datasets and end-to-end analytics projects.',
    skills: ['Python', 'SQL', 'BI tools', 'AI tools', 'Data visualisation'],
    outcomes: 'A portfolio-ready project for data analyst roles',
    salary: 'Job-ready portfolio project',
    image: '/images/programmes/ai-data-analyst-bootcamp.png',
    aboutRole:
      'Data analysts are in demand across every industry, turning raw data into the insights that drive decisions. This bootcamp gives you the hands-on, AI-enhanced toolkit employers look for and a real project to prove it — a strong stepping stone into a fast-growing, future-proof career.',
    salaryLadder: [
      { role: 'Junior Data Analyst', range: '£27k – £35k' },
      { role: 'Data Analyst', range: '£50k – £60k' },
      { role: 'Senior Data Analyst', range: '£55k – £65k' },
    ],
    modules: [
      { title: 'Python for analytics', detail: 'Use Python to clean, analyse and explore real datasets.' },
      { title: 'SQL & data querying', detail: 'Query and combine data from multiple sources.' },
      { title: 'BI & visualisation', detail: 'Build dashboards and reports with modern BI tools.' },
      { title: 'AI-assisted analysis', detail: 'Use modern AI tools to analyse trends and generate insights.' },
      { title: 'End-to-end capstone', detail: 'Deliver a portfolio-ready analytics project from start to finish.' },
    ],
    faqs: [
      {
        q: 'Do I need prior coding experience?',
        a: 'No. The bootcamp is hands-on and beginner friendly, building your Python and SQL skills as you work through real datasets.',
      },
      {
        q: 'Will I have something to show employers?',
        a: 'Yes. You finish with an end-to-end, portfolio-ready analytics project you can talk through in interviews.',
      },
      {
        q: 'How is it different from the career programme?',
        a: 'This is a focused six-week bootcamp to build core skills and a project. The AI Data Analyst Career Programme is a six-month pathway with certifications and a job guarantee.',
      },
    ],
  },
  {
    slug: 'business-analysis-bootcamp',
    title: 'Business Analysis Bootcamp',
    seoTitle: 'Business Analysis Bootcamp — 3 Weeks, Live | Uptrail',
    metaDescription: 'Learn requirements, process mapping, stakeholder management and Agile in an intensive 3-week live bootcamp — built for graduates and career switchers moving into tech.',
    category: 'Business',
    track: 'bootcamp',
    duration: '3 weeks',
    format: '100% online, intensive',
    level: 'Beginner friendly',
    blurb:
      'An intensive 3-week bootcamp for aspiring analysts, recent graduates and professionals looking to transition into the tech and business domain.',
    skills: ['Requirements', 'Process mapping', 'Stakeholders', 'Agile', 'Documentation'],
    outcomes: 'Practical skills to transition into business analysis',
    salary: 'Professional references on completion',
    image: '/images/programmes/business-analysis-bootcamp.png',
    aboutRole:
      'Business analysts are the bridge between business needs and technical delivery, shaping how organisations improve and change. It’s a versatile, well-paid role in constant demand across tech, finance and consulting — and a natural entry point for graduates and professionals moving into the tech industry.',
    salaryLadder: [
      { role: 'Junior Business Analyst', range: '£28k – £35k' },
      { role: 'Business Analyst', range: '£40k – £55k' },
      { role: 'Senior Business Analyst', range: '£55k – £70k' },
    ],
    modules: [
      { title: 'The business analysis toolkit', detail: 'Core frameworks, documentation and discovery techniques.' },
      { title: 'Requirements gathering', detail: 'Elicit, document and prioritise stakeholder requirements.' },
      { title: 'Process & modelling', detail: 'Map processes and write clear user stories.' },
      { title: 'Agile delivery & live project', detail: 'Work inside agile teams on a real business challenge.' },
    ],
    faqs: [
      {
        q: 'Who is this bootcamp for?',
        a: 'It’s built for aspiring analysts, recent graduates and professionals looking to transition into the tech and business domain.',
      },
      {
        q: 'How long is the bootcamp?',
        a: 'It’s an intensive three-week programme delivered 100% online, combining live teaching with a real business project.',
      },
      {
        q: 'What will I be able to do afterwards?',
        a: 'You’ll be able to gather and document requirements, map processes and contribute confidently within an agile delivery team.',
      },
    ],
  },
]

export type Testimonial = {
  quote: string
  name: string
  role: string
  programme: string
  rating: number
  isFeatured?: boolean
  featuredTitle?: string
  image?: string
  iframeUrl?: string
}

export const testimonials: Testimonial[] = [
  {
    quote:
      'I went from a retail job to a data analyst role at a bank in five months. The live mentor sessions made all the difference — someone reviewed my work every single week.',
    name: 'Amara Okafor',
    role: 'Data Analyst, Tesco Bank',
    programme: 'Data Analytics',
    rating: 5,
  },
  {
    quote:
      'The portfolio projects were exactly what interviewers wanted to talk about. I had three offers before the programme even ended.',
    name: 'Daniel Wright',
    role: 'Business Analyst, HSBC',
    programme: 'Business Analysis',
    rating: 5,
  },
  {
    quote:
      'As a career switcher in my late twenties, I was nervous. The community kept me accountable and the mentors treated me like a peer, not a number.',
    name: 'Priya Sharma',
    role: 'Associate PM, Amazon',
    programme: 'Product Management',
    rating: 5,
  },
  {
    quote:
      'Uptrail is the most practical learning I have ever done. Every session ended with something I could put straight into my CV.',
    name: 'Liam Connolly',
    role: 'Marketing Executive, PwC',
    programme: 'Digital Marketing',
    rating: 5,
  },
  {
    quote:
      'The career coaching was relentless in the best way. Mock interviews, CV reviews, salary negotiation — I felt prepared for everything.',
    name: 'Fatima Al-Hassan',
    role: 'Product Designer, Deloitte',
    programme: 'UX & Product Design',
    rating: 5,
  },
  {
    quote:
      'I joined from outside the UK and still felt completely supported. The cohort spanned a dozen countries and that made it richer.',
    name: 'Tomás Rivera',
    role: 'Data Engineer, NHS Digital',
    programme: 'Data Engineering',
    rating: 5,
  },
]

export type VideoTestimonial = {
  id?: number
  name: string
  role: string
  programme: string
  quote: string
  poster: string
  src: string
  programmeSlugs?: string[]
  showOnHome?: boolean
}

export const videoTestimonials: VideoTestimonial[] = [
  {
    name: 'Amara Okafor',
    role: 'Data Analyst, Tesco Bank',
    programme: 'Data Analytics',
    quote: 'From a retail job to a data analyst role at a bank in five months.',
    poster: '/images/video-amara.png',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  },
  {
    name: 'Daniel Wright',
    role: 'Business Analyst, HSBC',
    programme: 'Business Analysis',
    quote: 'I had three offers before the programme even ended.',
    poster: '/images/video-daniel.png',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  },
  {
    name: 'Priya Sharma',
    role: 'Associate PM, Amazon',
    programme: 'Product Management',
    quote: 'The mentors treated me like a peer, not a number.',
    poster: '/images/video-priya.png',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  },
]

export const employers = [
  { name: 'Amazon', slug: 'amazon' },
  { name: 'HSBC', slug: 'hsbc' },
  { name: 'Tesco', slug: 'tesco' },
  { name: 'Accenture', slug: 'accenture' },
  { name: 'Barclays', slug: 'barclays' },
  { name: 'IBM', slug: 'ibm' },
  { name: 'Santander', slug: 'santander' },
  { name: 'Google', slug: 'google' },
]

export const stats = [
  { value: '1,500+', label: 'Learners trained' },
  { value: '55+', label: 'Countries represented' },
  { value: '80%', label: 'Hired within 6 months' },
  { value: '4.9/5', label: 'Average learner rating' },
]

export type Post = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readingTime: string
  author: string
  image: string
  bodyContent?: string
  isFeatured?: boolean
  seoTitle?: string
  metaDescription?: string
}

export const posts: Post[] = [
  {
    slug: 'breaking-into-data-without-a-degree',
    title: 'How to break into data analytics without a degree',
    seoTitle: 'How to Become a Data Analyst Without a Degree | Uptrail',
    metaDescription: 'A practical roadmap to your first analytics role without a university degree — what to learn, what to skip, and how to prove your skills to employers.',
    excerpt:
      'A practical, no-nonsense roadmap for landing your first analytics role — what to learn, what to skip, and how to prove it.',
    category: 'Career advice',
    date: 'Jun 2, 2026',
    readingTime: '7 min read',
    author: 'Sofia Castellano',
    image: '/images/blog/breaking-into-data.png',
    bodyContent: `<p className="lead">Changing careers can feel like standing at the bottom of a mountain. The path looks steep, the summit is hidden in cloud, and everyone around you seems to have started climbing years ago.</p><h2>Start with the work, not the title</h2><p>The fastest way to convince an employer you can do a job is to do a smaller version of it first. Pick a real problem, gather some real data, and produce something you would be proud to put in front of a hiring manager. A single polished project beats a dozen half-finished tutorials.</p><blockquote>"You learn by shipping, you get feedback from someone who does the job for a living, and you walk away with proof — not just a certificate."</blockquote><h2>Make your progress visible</h2><p>Share what you build. Write up what you learned. The people who get hired fastest are rarely the most talented in the room — they are the ones whose work is easiest to find and easiest to trust.</p><p>Whatever you are working toward, the trail is there. The only thing left is to take the first step.</p>`,
  },
  {
    slug: 'portfolio-projects-that-get-interviews',
    title: 'The five portfolio projects that actually get you interviews',
    seoTitle: '5 Data Portfolio Projects That Get Interviews | Uptrail',
    metaDescription: 'Recruiters skim hundreds of portfolios. These five project types make them stop and book a call — with examples you can start building this week.',
    excerpt:
      'Recruiters skim hundreds of portfolios. These are the projects that make them stop and book a call.',
    category: 'Portfolios',
    date: 'May 21, 2026',
    readingTime: '6 min read',
    author: 'Kwame Boateng',
    image: '/images/blog/portfolio-projects.png',
    bodyContent: `<p>Recruiters skim hundreds of portfolios every week. If your project list looks like a carbon copy of a online course tutorial, your application will get lost in the noise.</p><h2>1. End-to-End Business Case Study</h2><p>Instead of analyzing a toy dataset like Iris or Titanic, find a messy dataset from a real domain (e.g. e-commerce churn or log analysis) and solve a genuine business problem.</p><h2>2. Live Interactive Dashboard</h2><p>Build an interactive dashboard that lets stakeholders explore insights intuitively.</p>`,
  },
  {
    slug: 'switching-careers-in-your-thirties',
    title: 'Switching careers in your thirties: what nobody tells you',
    seoTitle: 'Career Change at 30: What Nobody Tells You | Uptrail',
    metaDescription: 'The real challenges of switching careers in your thirties, the advantages you already have, and a practical plan for making the move into tech work.',
    excerpt:
      'Changing direction later feels risky. Here is how our most successful learners reframed it as their biggest advantage.',
    category: 'Career advice',
    date: 'May 9, 2026',
    readingTime: '8 min read',
    author: 'Elena Marsh',
    image: '/images/blog/switching-careers.png',
    bodyContent: `<p>Changing direction later in your career often feels like starting over. But your past domain experience is actually your strongest superpower.</p><h2>Transferable domain knowledge</h2><p>A data analyst who previously worked in retail understands inventory logistics far better than a fresh graduate with only theoretical math skills.</p>`,
  },
  {
    slug: 'product-manager-skills-2026',
    title: 'The skills product managers really need in 2026',
    excerpt:
      'Beyond roadmaps and standups — the discovery and data skills hiring managers now expect from new PMs.',
    category: 'Industry',
    date: 'Apr 28, 2026',
    readingTime: '5 min read',
    author: 'Raj Patel',
    image: '/images/blog/pm-skills.png',
    bodyContent: `<p>Product management has evolved. Modern PMs are expected to blend user empathy with deep analytical capability and AI-assisted workflows.</p><h2>Key Focus Areas</h2><ul><li>Continuous discovery & user interviews</li><li>SQL and product analytics</li><li>AI workflow integration</li></ul>`,
  },
  {
    slug: 'ace-the-take-home-assignment',
    title: 'How to ace the take-home assignment',
    excerpt:
      'Take-homes are where offers are won and lost. A simple framework for standing out without burning a weekend.',
    category: 'Interviews',
    date: 'Apr 14, 2026',
    readingTime: '6 min read',
    author: 'Sofia Castellano',
    image: '/images/blog/take-home-assignment.png',
    bodyContent: `<p>Take-home assignments can be intimidating. Here is a step-by-step structure to deliver clear, executive-ready presentations.</p>`,
  },
  {
    slug: 'is-a-bootcamp-worth-it',
    title: 'Is a bootcamp worth it? An honest look at the numbers',
    excerpt:
      'We dug into our own outcomes data to answer the question every prospective learner asks us first.',
    category: 'Industry',
    date: 'Mar 30, 2026',
    readingTime: '9 min read',
    author: 'Elena Marsh',
    image: '/images/blog/bootcamp-worth-it.png',
    bodyContent: `<p>We analyzed employment statistics across 1,500+ Uptrail graduates to determine ROI, hiring timelines, and career trajectory post-graduation.</p>`,
  },
]

export type SuccessStory = {
  id?: string | number
  name: string
  fromRole: string
  toRole: string
  story: string
  isFeatured: boolean
  featuredTitle?: string
  displayOrder: number
}
