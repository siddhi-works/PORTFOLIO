// content.mjs: the one file you edit.
// Everything on the site (copy, links, photos, numbers) comes from here.
// After editing run `node build.mjs` (Vercel does this for you on every push).
//
// Photos and files: drop them into the `media/` folder using the names below.
//   media/siddhi.jpg                         your portrait (hero + ID card)
//   media/Siddhi-Kale-Resume.pdf             your general resume (already added)
//   media/resumes/<role>.pdf                 one resume per role (names listed under `resumes`)
//   media/projects/<slug>.png                a screenshot per project
//   media/beyond/<name>.jpg                  volunteering photos
// If a file is missing the site shows a quiet, clearly marked slot instead.
//
// Lines marked  // CONFIRM  are my best reading of your facts. Check them.
// Lines marked  // SLOT     are waiting for real content from you.
// Almost every number below comes from your resume.

export default {
  site: {
    name: 'Siddhi Kale',
    initials: 'SK',
    role: 'Full-stack and AI engineer',
    place: 'Pune, India',
    timeZone: 'Asia/Kolkata',
    url: 'https://siddhi-kale.vercel.app', // feeds canonical links, sitemap, social preview; change it if you add a custom domain
    status: 'Open to work',
    openTo: ['Internships', 'Full-time roles', 'Freelance projects', 'Collaborations'],
    description:
      'Siddhi Kale is a full-stack and AI engineer in Pune. TechVerse 2026 First Prize winner, author of a published research paper (Springer Nature). Builds AI agents, data dashboards and production web apps.',
    showSlotHints: false, // true shows marked slots for missing photos and files
  },

  contact: {
    email: 'siddhi.kale2503@gmail.com',
    emails: ['siddhi.kale2503@gmail.com', 'siddhi.kale@adypu.edu.in'],
    phone: '+91 85301 82828',
    phoneHref: '+918530182828',
    github: 'https://github.com/siddhi-works',
    githubHandle: 'siddhi-works',
    linkedin: 'https://www.linkedin.com/in/siddhikale25/',
    linkedinHandle: 'siddhikale25',
    resume: '/media/Siddhi-Kale-Resume.pdf',
    formEndpoint: null, // SLOT: paste a Formspree URL (https://formspree.io/f/xxxx) so the form sends mail directly; empty opens the visitor’s email app instead
    whatsapp: null, // SLOT: e.g. 'https://wa.me/918530182828' (hidden until set)
  },

  portrait: {
    src: '/media/siddhi.jpg', // SLOT: your photo; .jpg .jpeg .png .webp all work
    alt: 'Siddhi Kale in a blush blazer, standing against a dark stone wall lit by thin strips of amber light',
    scale: 1.04, // this crop has no frame, so only a hair of zoom
    position: '50% 22%', // keeps the face in view
  },

  hero: {
    // *word* gets the highlight.
    quote: 'I build systems that actually make a *difference*.',
    lede: 'TechVerse 2026 First Prize. Published with Springer Nature. 20+ projects, 8 live in production.',
  },

  // Let the numbers speak. All from your resume and project notes.
  // Four metrics in one strip. `fill` is unused now; kept so old data still builds.
  numbers: [
    { id: 'wins', href: '#records', n: 2, label: 'wins in 2026' },
    { id: 'paper', href: '/records/icaiml-ae-2026/', n: 1, label: 'research paper published at an international conference' },
    { id: 'cgpa', href: '#about', n: 9.02, dec: 2, label: 'academic CGPA up to the 6th semester' },
    { id: 'projects', href: '#work', n: 10, plus: true, label: 'projects, interdomain and multidisciplinary' },
  ],

  // What the avatar says in the opening. Paste her exact words into `speech`; the captions appear on the left
  // and right in typewriter style, timed across the seconds she is speaking (start and end, in seconds).
  intro: {
    speech: '', // SLOT: the words spoken in media/intro/avatar.webm
    speechStart: 0.8,
    speechEnd: 8.6,
  },

  marquee: ['Agentic AI', 'Automation', 'System integration', 'Machine learning', 'Data analytics', 'Full-stack engineering'],
  marqueeProof: ['Generative AI', 'Natural language processing', 'Deep learning', 'API design', 'Computer vision', 'Data pipelines', 'Published research'],

  about: {
    title: "Hi, I’m Siddhi.",
    paragraphs: [
      "I’m a full-stack and AI engineer who builds, automates and evolves. I don’t just solve a problem; I look for the most efficient way to solve it. I lead, I take responsibility, I work smart and I love what I do. If I make mistakes, I learn from them, which is why I’m not rigid: I adapt and evolve.",
      "I build the whole thing: the model, the API and the interface, on LangGraph, Gemini, React, TypeScript, Node.js and Python. Each project is built to run for real users, not just a demo.",
    ],
    facts: [
      ['Based in', 'Pune, India'],
      ['Education', 'BTech in Artificial Intelligence and Data Science (final year), Ajeenkya DY Patil University, Pune'],
      ['Languages', 'English, Hindi, Marathi'],
    ],
  },

  // Experience, newest first. From the resume.
  experience: [
    { when: 'Sep 2026 – Present', type: 'Internship', role: 'AI Product Analyst Intern', org: 'NK Company, Pune', what: 'Real estate analytics: ML pricing forecasts (accuracy up 14%), CRM buyer analysis (engagement up 20%), a lead-scoring model that cut sales response time by 35%, and dashboards that save leadership 8+ hours a week.' },
    { when: 'Apr 2025 – Nov 2025', type: 'Position', role: 'Content Editor and Management Coordinator', org: 'Abhivyakti Editorial Team, ADYPU', what: 'Ran the content calendar across 5 platforms. Engagement up 25% year over year, errors down 15%, production efficiency up 30%.' },
    { when: 'Sep 2024 – Present', type: 'Volunteer', role: 'Research Volunteer', org: 'NSS, ADYPU', what: 'Supported 8 youth programmes reaching 100+ children a year.' },
    { when: 'Nov 2021 – Mar 2023', type: 'Volunteer', role: 'Content and Marketing Volunteer', org: 'Bindu Non-Profit Organisation', what: 'Led 5 creators. Content output up 25%, organic traffic up 15%, lead generation up 10%.' },
  ],

  // Tech stack cards. Everything here appears on your resume or project notes.
  stackCards: [
    { title: 'Languages', items: ['Python', 'R', 'SQL', 'TypeScript'] },
    { title: 'AI and ML', items: ['TensorFlow', 'Keras', 'scikit-learn', 'OpenCV', 'NLTK', 'NumPy', 'pandas'] },
    { title: 'Agents and LLMs', items: ['LangGraph', 'LangChain'] },
    { title: 'Web and data', items: ['React', 'Node.js', 'Express', 'Flask', 'Streamlit', 'REST APIs', 'SQLite', 'MySQL'] },
  ],
  stackCore: [
    { title: 'Core concepts', items: ['Machine learning', 'Deep learning', 'Natural language processing', 'Generative AI', 'Large language models', 'Agentic AI'] },
    { title: 'Engineering', items: ['API design', 'Data structures and algorithms', 'Database management', 'Git and GitHub', 'CI/CD with GitHub Actions', 'Deployment on Vercel'] },
    { title: 'Working style', items: ['Problem solving', 'Analytical thinking', 'Teamwork', 'Communication', 'Leadership'] },
  ],
  stackR: [],
  // Which projects each core concept shows up in (hover a concept to see them).
  conceptUse: {
    'Machine learning': ['bot-detection', 'resolve-iq', 'chicago-crime'],
    'Deep learning': ['skin-lesion', 'chest-xray'],
    'Natural language processing': ['bot-detection', 'resolve-iq', 'plagiarism'],
    'Generative AI': ['claimmate', 'aria', 'censusguru'],
    'Large language models': ['claimmate', 'aria', 'verdict', 'censusguru'],
    'Agentic AI': ['claimmate', 'aria', 'verdict', 'resolve-iq'],
    'API design': ['claimmate', 'bhusamhita', 'censusguru'],
    'Database management': ['resolve-iq', 'bhusamhita'],
    'CI/CD with GitHub Actions': ['devops-demo'],
    'Deployment on Vercel': ['chicago-crime', 'censusguru'],
  },

  // Projects. `top` ones are the stacking cards on the home page. `page` ones get a detail page.
  // `map` places the project on the /work/ map (0-100). `tags` draw the links between them.
  projects: [
    {
      slug: 'bot-detection',
      card: 'Random Forest bot detector in R. 90% accuracy on 10,000 held-out accounts.',
      name: 'Bot Detection in R',
      short: 'Bot Detection',
      line: 'A Random Forest model that separates bots from real accounts by reading what they post and how they behave. 90% accuracy on about 10,000 held-out accounts. Published at ICAIML-AE 2026.',
      badge: 'Published research paper',
      top: true,
      page: true,
      visual: 'bots',
      cluster: 'Models',
      map: [38, 62],
      tags: ['paper', 'ml'],
      tools: ['R', 'ranger', 'caret', 'text2vec', 'tidyverse', 'ggplot2', 'pROC'],
      repo: 'socialmedia-bot-detection-using-R',
      live: null,
      post: 'https://www.linkedin.com/posts/siddhikale25_machinelearning-artificialintelligence-datascience-ugcPost-7473658377227624448-6KJW/',
      builtFor: 'ICAIML-AE 2026, where the paper was published by Atlantis Press (Springer Nature)',
      team: 'With Akriti Biswas, guided by Dr. Vishal Shirsath',
      when: '2026',
      facts: [
        { n: '90', unit: '%', label: 'accuracy on held-out accounts', count: 90 },
        { n: '4,184', label: 'bots caught' },
        { n: '179', label: 'real accounts wrongly flagged' },
      ],
      flow: [
        ['Data', 'A labelled set of social media accounts with their tweets and activity counts'],
        ['Behaviour', 'Log follower count, retweets, mentions, engagement ratio, mention ratio and verified status'],
        ['Text', 'TF-IDF features built with text2vec from the words accounts use'],
        ['Model', 'A Random Forest in ranger with 300 trees, trained on 80% of the data'],
        ['Check', 'Confusion matrix, ROC curve, precision, recall and F1 on the other 20%'],
      ],
      study: {
        problem: [
          'Bot accounts are no longer easy to spot. Many of them post ordinary sentences and look like any other profile. What gives them away is the pattern: how often they mention other accounts, how their engagement compares with the number of followers they have, and the promotional phrases they repeat.',
          'A detector that only reads text misses the behaviour, and one that only counts activity misses the language. The question behind this project was whether the two signals together separate bots from real people reliably enough to be useful as a backend layer for a platform.',
        ],
        solution: [
          'I built the detector end to end in R. Behavioural features are engineered first: log-scaled follower counts, engagement and mention ratios, retweet and mention counts and the verified flag. Tweet text is cleaned, tokenised and turned into TF-IDF features with text2vec, keeping only terms that appear often enough to matter and not so often that they carry no signal.',
          'Both feature sets are joined and fed to a Random Forest built with ranger (300 trees, mtry set to the square root of the feature count). The data is split 80/20 with caret so the evaluation is on accounts the model has never seen, and the same script produces the confusion matrix, ROC curve and the precision, recall and F1 charts that sit in the repository.',
        ],
        build: [
          'About 60% of the effort went into preparing the data, around 35% into testing different approaches, and the remaining 5% into debugging, visualisation and documentation. The repository also contains the data-preparation step in full, including the part that adjusts counts and adds phrases for a 65% sample of records, so the way the dataset was shaped can be inspected.',
          'Supervised models beat unsupervised ones, and combining behavioural and text features beat using either alone. The takeaway: understanding the data pays off more than trying another algorithm.',
        ],
        result: [
          'On roughly 10,000 held-out accounts the model reaches 90.0% accuracy. It correctly flagged 4,184 bots and cleared 4,817 real accounts, with 179 real accounts wrongly flagged and 819 bots missed. The work was written up with co-author Akriti Biswas and faculty advisor Dr. Vishal Shirsath and published at ICAIML-AE 2026.',
        ],
      },
      shot: '/media/projects/gallery/bot-detection-3.jpg',
      gallery: ['/media/projects/gallery/bot-detection-1.jpg', '/media/projects/gallery/bot-detection-2.jpg'],
    },
    {
      slug: 'chicago-crime',
      card: 'TechVerse First Prize. 1.05M crime records, 8 KPIs, 10 charts and a district map.',
      name: 'Chicago Crime Analytics',
      short: 'Chicago Crime',
      line: 'A dashboard that turns 1,048,575 crime reports into 8 KPIs, 10 charts and a district map, with an assistant called Detective Dot and a page that shows exactly how the data was cleaned.',
      badge: 'TechVerse 2026 First Prize',
      role: 'Team leader, in charge of cleaning and visualising the data and drawing the insights.',
      top: true,
      page: true,
      visual: 'chicago',
      cluster: 'Data',
      map: [72, 66],
      tags: ['dashboard', 'live', 'winner'],
      tools: ['Python', 'pandas', 'React', 'TypeScript', 'Vite', 'd3', 'Vercel'],
      repo: 'ChicagoCrime-DataAnalytics',
      live: 'https://chicago-crime-data-analytics.vercel.app',
      builtFor: 'TechVerse 2026 at Ajeenkya DY Patil University, Pune',
      team: 'Team Moleculens',
      when: '2026',
      facts: [
        { n: '1.05', unit: 'M', label: 'crime reports analysed', count: 1.05, dec: 2 },
        { n: '8', label: 'KPIs', count: 8 },
        { n: '10', label: 'charts', count: 10 },
      ],
      flow: [
        ['Source', '1,048,575 records, 22 columns, 33 crime types and 24 districts from 2001 to 2026'],
        ['Clean', '424,638 swapped dates repaired and no rows deleted, with every step logged'],
        ['Summary', '8 KPIs: 20.5% arrest rate, 18.3% domestic, 17.7% at night and 29.2% violent'],
        ['Explore', '10 charts, four filters and a map of about 2,400 patches coloured by district'],
        ['Ask', 'Detective Dot answers from the project’s own analysis and recalculates on the filtered data'],
      ],
      study: {
        problem: [
          'The organisers of TechVerse supplied an extract of the City of Chicago crime data: more than a million police reports with 22 columns, mixed types, swapped dates and large gaps in the coordinates. The brief was to turn it into something a person could actually read, with a fixed set of KPIs and charts.',
          'The risk with data this size is a dashboard that looks convincing but hides how much has been cleaned, inferred or left out. We wanted the numbers to be both easy to read and easy to question.',
        ],
        solution: [
          'We built an interactive dashboard in React and TypeScript on top of an analysis done in Python. All 8 KPIs and 10 required charts sit on one page, and four filters (crime type, district, arrest and domestic) update every number at once.',
          'A Story view writes the findings as short chapters, for example that summer has 17% more crime per day than winter and weekend nights run 69% above weekday nights. A district map shows about 2,400 patches coloured by police district with a panel for totals, top crime types and arrest rate against expectation. Detective Dot, the built-in assistant, answers questions from the project’s own analysis and recalculates live on the filtered data.',
        ],
        build: [
          'A Fair Arrest analysis adjusts arrest rates for crime type, which shows that 86% of the gap between evening and night comes from what was reported rather than the time of day. The Data Trust page lists every cleaning step, metric definition, method and limitation in one place, including that 31% of coordinates are missing and that no rows were removed.',
          'Charts are hand-built in SVG and Canvas with d3 for scales and shapes, with Motion for animation, and the whole dashboard is deployed on Vercel.',
        ],
        result: [
          'The project took First Prize at TechVerse 2026 at Ajeenkya DY Patil University, with me leading Team Moleculens. The live dashboard is open for anyone to filter and question.',
        ],
      },
      shot: '/media/projects/chicago-crime.png',
    },
    {
      slug: 'aria',
      card: 'An agent that reads arXiv papers and writes a LaTeX research paper as a PDF.',
      name: 'ARIA',
      short: 'ARIA',
      line: 'Automated Research and Intelligence Agent. Searches arXiv, reads the papers, finds gaps and writes a publication-style LaTeX paper that exports as a PDF.',
      top: true,
      page: true,
      visual: 'aria',
      cluster: 'Agents',
      map: [16, 20],
      tags: ['agents', 'langgraph', 'gemini'],
      tools: ['LangGraph', 'LangChain', 'Gemini 2.5 Flash', 'arXiv API', 'PyPDF2', 'LaTeX', 'Tectonic', 'Streamlit'],
      repo: 'ARIA',
      live: null,
      post: 'https://www.linkedin.com/posts/siddhikale25_artificialintelligence-generativeai-aiagents-ugcPost-7489367890979098624-xYlM/',
      builtFor: 'Researchers, students and anyone who needs to get from a topic to a first structured draft',
      when: 'June to August 2026',
      facts: [
        { n: 'arXiv', label: 'in' },
        { n: 'LaTeX', label: 'draft' },
        { n: 'PDF', label: 'out' },
      ],
      flow: [
        ['Discover', 'Searches arXiv for recent papers on a topic and returns metadata and PDF links'],
        ['Analyse', 'Downloads the PDFs, extracts the text and summarises findings, limitations and future work'],
        ['Ideate', 'Identifies research gaps and proposes directions that are not yet covered'],
        ['Write', 'Drafts a complete paper: abstract, introduction, literature review, methodology, results and references'],
        ['Deliver', 'Compiles the LaTeX with Tectonic and offers the PDF for download'],
      ],
      study: {
        problem: [
          'Research is rarely limited by access to papers. It is limited by the time it takes to find the relevant ones, read them, compare them and turn what you learned into a structured document. For a student starting on a new topic that can be weeks of work before there is a first draft.',
          'Search engines retrieve. They do not read across papers, notice what is missing, or produce a document. ARIA was built to close that gap between finding information and creating knowledge.',
        ],
        solution: [
          'ARIA is an agent built on LangGraph and LangChain with Google Gemini 2.5 Flash as the model. It has three tools: an arXiv search tool, a PDF analysis tool and a PDF rendering tool. The agent decides which tool to call next in a loop, so a single request like “write a research paper on prompt engineering” becomes a sequence of searching, reading, synthesising and writing.',
          'The output is not a text blob. The paper is generated as LaTeX with proper sections and mathematical formulations, compiled with Tectonic and delivered as a downloadable PDF from a Streamlit chat interface, with session memory kept by LangGraph so the conversation can continue.',
        ],
        build: [
          'The code is split by responsibility: the agent graph and tool orchestration, the arXiv client, the PDF reader that prepares text for analysis, the LaTeX and PDF builder, and the Streamlit front end. Dependencies are managed with uv and the project runs on Python 3.11 or newer.',
          'The README is explicit that generated papers must be reviewed and cited properly before any academic use. The roadmap includes a vector database, research knowledge graphs and IEEE and ACM formatting.',
        ],
        result: [
          'Topic in, finished paper out: a working research assistant, shared publicly on LinkedIn with the source open on GitHub.',
        ],
      },
      shot: '/media/projects/aria.png',
      gallery: ['/media/projects/gallery/aria-1.jpg'],
    },
    {
      slug: 'bhusamhita',
      card: 'One layer over land records in 3 states and 4 languages, tied by ULPIN and GIS.',
      name: 'BhuSamhita',
      short: 'BhuSamhita',
      line: 'One parcel, one ULPIN, every connected land record. A single layer across the separate land systems of Maharashtra, Uttar Pradesh and Gujarat, with GIS, validation and four languages. Winner of the Smart India Hackathon internal round.',
      badge: 'Smart India Hackathon internal winner',
      top: true,
      page: true,
      visual: 'landgpt',
      cluster: 'Public systems',
      map: [62, 18],
      tags: ['multilingual', 'gis', 'winner'],
      tools: ['Python', 'FastAPI', 'React', 'GIS', 'GeoJSON', 'SQLite', 'REST APIs', 'ULPIN', 'RBAC', 'Anthropic API'],
      repo: 'BhuSamhita',
      live: null,
      demo: 'https://youtu.be/CldL2wF95Po',
      post: 'https://www.linkedin.com/posts/siddhikale25_sih2026-smartindiahackathon-sih-ugcPost-7516230406061400064-cw8e/',
      postImage: '/media/projects/bhusamhita-linkedin.jpg',
      builtFor: 'Smart India Hackathon, internal round',
      team: 'AIgniters',
      role: 'Backend and integrations: everything behind the interface, except the frontend.',
      when: '2026',
      facts: [
        { n: '3', label: 'states', count: 3 },
        { n: '4', label: 'languages', count: 4 },
        { n: 'SIH', label: 'Smart India Hackathon internal winner' },
      ],
      flow: [
        ['Adapters', 'One adapter each for Maharashtra, Uttar Pradesh and Gujarat keeps every state’s own data structure'],
        ['Model', 'A canonical land model gives every source the same shape'],
        ['Identity', 'ULPIN-based parcel registry so a plot is the same plot everywhere'],
        ['Verify', 'A validation engine cross-checks sources and flags data-quality problems'],
        ['Serve', 'A citizen portal and state-specific government workflows with mutation and verification reports'],
      ],
      study: {
        problem: [
          'Land records in India sit in separate systems for the land record itself, registration, mutation, planning, tax and utilities, and every state organises them differently. A citizen who wants to confirm a parcel has to visit several portals that disagree on format, language and sometimes on the facts.',
          'Replacing those systems is not realistic. The problem the hackathon asked us to solve was how to let them speak to each other without forcing every state to rebuild.',
        ],
        solution: [
          'BhuSamhita is an integrated, GIS-based digital infrastructure for land governance: one parcel, one ULPIN (Unique Land Parcel Identification Number), every connected land record. It federates instead of replacing. A canonical land model sits in the middle, and state adapters for Maharashtra, Uttar Pradesh and Gujarat translate each state’s records into it. Parcels are identified through a ULPIN-based registry, so the same plot can be traced across land records, registration, mutation, planning, tax and utility data.',
          'On top of that sit Unified Land Profiles that bring land records, registration, mutation, land use and encumbrance together for one parcel, GIS-based parcel visualisation, and a cross-record validation engine that surfaces actionable data-quality findings for government officers. Two portals use it: a citizen portal and a government officer portal with parcel search, e-services, analytics, role-based access and audit trails. The interface runs in English, Hindi, Marathi and Gujarati.',
        ],
        build: [
          'I built everything except the frontend: the integrations that connect three states’ land systems, and the Python backend behind them. That covers the state adapters, the canonical land model, the ULPIN parcel registry, the validation engine, glossary and translation, analytics and workflow, role-based access and the audit trail. Tests cover normalisation, validation, immutability, GIS and the API. An optional AI assistant, built on the Anthropic API, uses the selected parcel’s records and validation findings as its context.',
          'All data in the demo is replicated government-system data used for demonstration only.',
        ],
        result: [
          'BhuSamhita won the internal round of the Smart India Hackathon (SIH) at Ajeenkya DY Patil University.',
        ],
      },
      shot: '/media/projects/bhusamhita.png',
    },
    {
      slug: 'claimmate',
      card: 'Four agents that guide an Indian insurance claim, in English and Hindi.',
      name: 'ClaimMate',
      short: 'ClaimMate',
      line: 'A claim companion for Indian insurance in English and Hindi. Four specialised agents and a supervisor turn a claim into what is missing, who must act and what happens next.',
      top: true,
      page: true,
      visual: 'claimmate',
      cluster: 'Agents',
      map: [30, 32],
      tags: ['agents', 'gemini', 'multilingual'],
      tools: ['Gemini', 'React', 'TypeScript', 'Vite', 'Node.js', 'Express', 'Render'],
      repo: 'ClaimMate',
      live: 'https://claimmate.onrender.com',
      post: 'https://www.linkedin.com/posts/siddhikale25_hackdevengers-agenticai-generativeai-ugcPost-7496140159357415424-aLyO/',
      builtFor: 'HackDeVengers 1.0, organised by Devengers',
      when: 'August 2026',
      team: 'Solo, in one day',
      facts: [
        { n: '4', label: 'specialised agents', count: 4 },
        { n: '2', label: 'languages: English, Hindi', count: 2 },
        { n: 'Live', label: 'on Render' },
      ],
      flow: [
        ['Policy agent', 'Reads the policy and what it covers'],
        ['Claim agent', 'Understands the incident and the claim situation'],
        ['Document agent', 'Checks which documents are present, missing or inconsistent'],
        ['Audit agent', 'Looks for gaps and contradictions across the file'],
        ['Supervisor', 'Combines the four outputs into one clear next step'],
      ],
      study: {
        problem: [
          'People file insurance claims at the worst moments: after an accident, during a hospital stay, under financial stress. The insurer’s portal tells them which document to upload. It does not explain what is wrong, who has to act or what happens afterwards.',
          'The problem statement arrived at the start of the day, and I took on the gap between a process built to handle claims and a person who needs to know what to do next.',
        ],
        solution: [
          'ClaimMate splits a claim across four specialised agents instead of asking one language model to do everything: a Policy agent, a Claim agent, a Document agent and an Audit agent. A Supervisor turns their outputs into a single plan: what is happening, what is missing, who needs to act, what to do now and what happens next.',
          'The assistant remembers the context of the same claim, so follow-up questions in the Doubt section are answered from the actual claim rather than from scratch. A Claim Stuck flow explains why progress may be blocked and points to the right escalation route. The interface works in English and Hindi, and the roadmap adds more Indian languages.',
        ],
        build: [
          'The backend extracts text from PDFs, validates the structured output from Gemini, applies timeouts and error handling, and falls back to deterministic responses when the model is unavailable. The Gemini credentials stay on the server behind an Express API. The front end is React, TypeScript and Vite, deployed on Render.',
          'The project states plainly that it gives informational guidance and does not guarantee approval or replace the insurer, a lawyer or the regulator.',
        ],
        result: [
          'Live on Render, and built from problem statement to deployment in a single day at HackDeVengers 1.0.',
        ],
      },
      shot: '/media/projects/claimmate.png',
      gallery: ['/media/projects/gallery/claimmate-1.jpg', '/media/projects/gallery/claimmate-2.jpg', '/media/projects/gallery/claimmate-3.jpg'],
    },

    // Two more projects with their own detail pages.
    {
      slug: 'verdict',
      card: 'Audits fleet contracts and automates a verdict only when every reading agrees.',
      name: 'Verdict: Agentic SLA Auditor',
      short: 'Verdict',
      line: 'An audit system for outcome-based fleet contracts. It reads the contract, checks it against vehicle telemetry and automates a verdict only when every reasonable reading agrees; everything else goes to a person with a brief.',
      badge: 'Michelin x AI Tinkerers Harness Hackathon',
      page: true,
      visual: 'generic',
      cluster: 'Agents',
      map: [50, 46],
      tags: ['agents', 'ml'],
      tools: ['Python', 'LLM reader', 'Deterministic decision engine', 'REST API', 'Tamper-evident audit log'],
      repo: null,
      live: null,
      builtFor: 'Michelin x AI Tinkerers Harness Engineering Hackathon, Pune (Operations and Compliance track), extended afterwards',
      when: '2026',
      facts: [
        { n: '0', label: 'wrong automatic verdicts, against 28 for a single-reading baseline', count: 0 },
        { n: '194', label: 'generated contracts evaluated', count: 194 },
        { n: '108', label: 'tests in the suite', count: 108 },
      ],
      flow: [
        ['Read', 'An LLM reads the contract and proposes values, each with the exact source sentence'],
        ['Verify', 'A quote verifier checks every proposed number against the contract text'],
        ['Test', 'A verdict envelope tests each plausible reading of the contract against trusted and doubtful telemetry'],
        ['Decide', 'Deterministic code decides, and only when the outcome is the same under every reading'],
        ['Escalate', 'Anything unstable goes to a person with a brief and the dollar range at stake'],
      ],
      study: {
        problem: [
          'Outcome-based fleet contracts pay on results such as uptime, so every period someone has to read the contract, pull the vehicle telemetry and decide whether the service level was met. Wording is vague, clauses conflict, precedence rules change the answer, and the telemetry itself is sometimes doubtful.',
          'An AI that simply answers is dangerous here. One invented threshold or a misread clause turns into a wrong payment. The hackathon, run by Michelin with AI Tinkerers in Pune, asked for a harness around the model that makes automation safe to trust.',
        ],
        solution: [
          'Verdict is an agentic auditor that automates a verdict only when it is the same under every reasonable reading of the contract and the data. Otherwise it escalates to a person with a brief that includes the dollar range at stake.',
          'The model never decides. It acts as a reader that proposes numbers together with the exact sentence they came from; a quote verifier and a deterministic decision engine check the quote and make the call, so an invented threshold can never reach a verdict. A verdict envelope then tests conflicts, vague wording and precedence clauses against both trusted and doubtful telemetry views.',
        ],
        build: [
          'It was built at the Michelin x AI Tinkerers Harness Engineering Hackathon in Pune (Operations and Compliance track) and extended afterwards. It ships with a tamper-evident audit trail with offline replay, a role-based review console, a secured REST API, run tracing and a test suite of 108 tests.',
          'Beyond generated contracts, the system ran on real public cloud SLAs from AWS and Google, added tiered service-credit support, and surfaced three reader defects that were fixed and locked in with regression tests.',
        ],
        result: [
          'On 194 generated contracts, about 83,000 telemetry rows, Verdict produced 0 wrong automatic verdicts, against 28 for a single-reading baseline. An ablation that removed the verdict envelope caused 19 wrong automatic verdicts, which shows the envelope is what makes the automation safe.',
        ],
      },
    },
    {
      slug: 'censusguru',
      card: 'A Census 2027 guide in 5 languages with a Gemini assistant and a claim checker.',
      name: 'CensusGuru',
      short: 'CensusGuru',
      line: 'A citizen guide to Census 2027 in 5 languages: phases explained, state schedules, a self-enumeration practice run, a Gemini assistant and a misinformation claim checker.',
      page: true,
      visual: 'census',
      cluster: 'Public systems',
      map: [84, 56],
      tags: ['gemini', 'multilingual', 'live'],
      tools: ['React', 'TypeScript', 'Vite', 'Express', 'Gemini', 'Zod', 'Vercel'],
      repo: 'censussetu',
      live: 'https://censussetu.vercel.app',
      post: 'https://www.linkedin.com/posts/siddhikale25_buildwithai-vibecoding-promptwars-ugcPost-7500774900912242688-c1bw/',
      badge: 'Built in 4 hours at PromptWars',
      builtFor: 'PromptWars x ADYPU, a four-hour hackathon with Google for Developers and Hack2skill',
      when: '2026',
      facts: [
        { n: '5', label: 'languages', count: 5 },
        { n: '4', label: 'hours to build', count: 4 },
        { n: '8', label: 'features', count: 8 },
      ],
      flow: [
        ['Guide', 'The phases of Census 2027 in plain language'],
        ['Schedules', 'A searchable reference of state and UT schedules'],
        ['Practice', 'A self-enumeration simulator that uses demo data and submits nothing'],
        ['Ask', 'AI Census Saathi answers questions through Gemini'],
        ['Check', 'A claim checker for census-related misinformation'],
      ],
      study: {
        problem: [
          'A census asks every household to take part, and many people are unsure what will be asked, who is allowed to ask it and which messages are genuine. That uncertainty is where rumours and scams spread.',
          'PromptWars gave four hours to build something useful with generative AI. I went for the part of Census 2027 that matters most to an ordinary citizen: understanding it and taking part safely.',
        ],
        solution: [
          'CensusGuru is a citizen-first guide. It explains the census phases, lists state and UT schedules, lets people rehearse the digital self-enumeration process with demo data, and shows privacy and enumerator-safety guidance on how to recognise a suspicious request. Public Insights visualises reference statistics.',
          'AI Census Saathi answers questions using Google Gemini, and a claim checker helps test census-related claims. The whole interface works in English, Hindi, Marathi, Bengali and Kannada.',
        ],
        build: [
          'Gemini is called from an Express server so the API key never reaches the browser. Inputs are validated with Zod, and selected common questions have deterministic fallback answers so the app still helps when the model does not. The simulator is clearly marked as demo-only: it never submits anything to a government system or generates a real Self-Enumeration ID.',
          'The repository includes a test file for the census logic. The front end is React, TypeScript and Vite, deployed on Vercel.',
        ],
        result: [
          'A deployed, five-language product, shipped inside a four-hour hackathon. It also set a rule I still follow: with half an hour left, repeated AI-assisted edits broke a working build, so every change is now tested before the next one.',
        ],
      },
      shot: '/media/projects/censusguru.png',
    },
    {
      slug: 'resolve-iq',
      card: 'Routes and resolves IT tickets with ML and hands uncertain cases to a person.',
      name: 'Resolve IQ',
      short: 'Resolve IQ',
      line: 'An AI ticket routing and resolution agent for enterprise IT support, built with Akriti Biswas for The Great Agent Hackathon. It classifies, prioritises and routes tickets, retrieves similar past issues and escalates uncertain cases to a person.',
      visual: 'generic',
      cluster: 'Agents',
      map: [14, 46],
      tags: ['agents', 'ml'],
      tools: ['Python', 'scikit-learn', 'TF-IDF', 'Logistic Regression', 'Flask', 'SQLite'],
      repo: 'ai-ticket-routing-agent',
      live: 'https://resolveiq-bs1s.onrender.com',
      extra: [{ label: 'Original repository', href: 'https://github.com/akritiib30/ai-ticket-routing-agent' }],
      post: 'https://www.linkedin.com/posts/siddhikale25_thegreatagenthackathon-ai-aiagents-ugcPost-7504510671020064768-3HgA/',
      builtFor: 'The Great Agent Hackathon',
      team: 'With Akriti Biswas',
      when: '2026',
      facts: [
        { n: '8', label: 'pipeline stages', count: 8 },
        { n: '4', label: 'priority levels', count: 4 },
        { n: 'Human', label: 'escalation built in' },
      ],
      flow: [
        ['Understand', 'Clean the ticket text and extract what it is about'],
        ['Classify', 'TF-IDF and Logistic Regression predict the category'],
        ['Route', 'Map the category to the right support team and estimate priority'],
        ['Retrieve', 'Find similar historical tickets and related knowledge'],
        ['Decide', 'Score confidence, then resolve automatically or escalate to a person'],
      ],
      study: {
        problem: [
          'In enterprise IT support, tickets get misclassified, land with the wrong team and treat recurring problems as new ones. Simple requests wait behind complex ones, and engineers spend their time on triage instead of resolving.',
          'The hackathon asked for an agent that takes work off that queue, with one condition we held ourselves to: automation should support human responsibility and never hide it.',
        ],
        solution: [
          'Resolve IQ runs every ticket through one pipeline: understand, classify, route, retrieve knowledge, assess confidence, resolve or escalate, and track. A TF-IDF and Logistic Regression classifier predicts the category, routing maps it to a team, and a priority estimate marks it urgent, high, medium or low.',
          'Similar past tickets and knowledge-base entries are retrieved to suggest a resolution, recurring issues are detected by comparing against earlier tickets, and a confidence score decides whether the system can act or must hand the ticket to a person. Low-confidence and sensitive cases always go to human review.',
        ],
        build: [
          'The system has a ticket submission and queue interface, ticket history with search and filters, an analytics dashboard, CSV export and PDF reports, and pages that show each pipeline stage. Its modules are separated by stage: preprocessing, classification, confidence, routing, retrieval, resolution, escalation and recurring-issue detection.',
          'The classifier is trained on a generated, enterprise-style ticket dataset. The data is clean and generated, so its perfect validation accuracy on the current split says little about real tickets. The next step is testing against noisy, real-world ones. The roadmap includes semantic retrieval with embeddings, LLM-written resolution steps and integrations with tools like ServiceNow and Jira.',
        ],
        result: [
          'An end-to-end triage agent with a full pipeline, a dashboard and a clear path to a human, built with Akriti Biswas for The Great Agent Hackathon.',
        ],
      },
      shot: '/media/projects/resolve-iq.png',
    },

    // More work: no detail page, each links to its GitHub repository.
    {
      slug: 'skin-lesion',
      card: 'CNN that classifies skin lesions as benign or malignant. 88 to 92% accuracy.',
      name: 'Skin Lesion Classifier',
      line: 'A CNN in TensorFlow and Keras that classifies dermoscopic images as benign or malignant, with augmentation, early stopping and a Streamlit interface that returns a confidence score. 88 to 92% validation accuracy.',
      cluster: 'Models',
      map: [18, 70],
      tags: ['vision', 'ml'],
      facts: [
        { n: '88–92', unit: '%', label: 'validation accuracy' },
        { n: '3', label: 'conv layers', count: 3 },
      ],
      tools: ['TensorFlow', 'Keras', 'Streamlit', 'scikit-learn'],
      repo: 'Skin-Lesion-Classification-Using-Deep-Learning',
      shot: '/media/projects/skin-lesion.jpg',
      post: 'https://www.linkedin.com/posts/siddhikale25_machinelearning-deeplearning-computervision-ugcPost-7448059968882421761-ccW-/',
    },
    {
      slug: 'chest-xray',
      card: 'ResNet-50 sorting chest X-rays into four classes through a Flask app.',
      name: 'Chest X-Ray Detection',
      line: 'ResNet-50 with transfer learning that sorts chest X-rays into COVID-19, viral pneumonia, lung opacity and normal, served through a Flask app for real-time prediction. 88 to 92% accuracy.',
      cluster: 'Models',
      map: [30, 82],
      tags: ['vision', 'ml'],
      facts: [
        { n: '88–92', unit: '%', label: 'accuracy' },
        { n: '4', label: 'classes', count: 4 },
      ],
      tools: ['TensorFlow', 'Keras', 'ResNet-50', 'Flask', 'OpenCV'],
      repo: 'ai-chest-xray-disease-detection',
    },
    {
      slug: 'plagiarism',
      card: 'TF-IDF and cosine similarity plagiarism detector. 90% on 1,000 documents.',
      name: 'Plagiarism Detector',
      line: 'NLP with TF-IDF and cosine similarity that finds duplicated content across a document set. 90% accuracy on 1,000 documents.',
      cluster: 'Models',
      map: [12, 88],
      tags: ['ml'],
      facts: [{ n: '90', unit: '%', label: 'accuracy', count: 90 }],
      tools: ['Python', 'NLTK', 'TF-IDF', 'Cosine similarity'],
      repo: null,
    },
    {
      slug: 'devops-demo',
      card: 'A three-tier app shipped through GitHub Actions and Kubernetes.',
      name: 'SkillPulse DevOps pipeline',
      line: 'A three-tier app taken from commit to running update through GitHub Actions, with Kubernetes on a local kind cluster, worked through from the TrainWithShubham masterclass.',
      cluster: 'Data',
      map: [88, 86],
      tags: [],
      tools: ['GitHub Actions', 'Docker', 'Kubernetes', 'CI/CD'],
      repo: 'github-actions-demo',
    },
  ],

  // The Projects section is split by the technology behind the work. Cards are the same as before.
  projectGroups: [
    { id: 'agentic', image: '/media/projects/claimmate.png', title: 'Agentic AI and LLM systems', line: 'Multi-agent workflows, LangGraph and LangChain, language models with checks and human fallbacks.', projects: ['claimmate', 'aria', 'verdict', 'resolve-iq'] },
    { id: 'data', image: '/media/projects/chicago-crime.webp', title: 'Data analytics and research ML', line: 'Large datasets, dashboards, feature engineering, classical machine learning, a published paper.', projects: ['chicago-crime', 'bot-detection'] },
    { id: 'deep', image: '/media/projects/skin-lesion.jpg', title: 'Deep learning and computer vision', line: 'CNNs and transfer learning (ResNet-50), image pipelines, models served through a web app.', projects: ['skin-lesion', 'chest-xray'] },
    { id: 'platforms', image: '/media/projects/bhusamhita.webp', title: 'Full-stack platforms and integration', line: 'APIs, multilingual interfaces, GIS, data integration, deployed apps for real users.', projects: ['bhusamhita', 'censusguru'] },
    { id: 'more', title: 'More work', line: 'Smaller builds, each with its code on GitHub.', projects: ['plagiarism', 'devops-demo'] },
  ],

  clusters: [
    { name: 'Agents', at: [22, 8] },
    { name: 'Public systems', at: [70, 6] },
    { name: 'Models', at: [20, 94] },
    { name: 'Data', at: [78, 94] },
  ],

  // Services. Each gets its own page at /services/<slug>/.
  services: [
    {
      slug: 'ai-agents',
      name: 'AI agents and LLM apps',
      short: 'AI agents',
      titleParts: ['AI agents and', 'LLM apps'],
      icon: 'agent',
      line: 'Multi-agent assistants and LLM applications that automate real workflows.',
      pitch: 'Agents already at work on insurance claims, research papers and IT tickets, built with Gemini 2.5 Flash, LangGraph and LangChain.',
      deliver: [
        'A working agent scoped to one real task, end to end',
        'Specialised agents with clear roles, orchestrated with LangGraph or LangChain',
        'Retrieval over your documents and history',
        'Support for the languages your users actually speak',
      ],
      steps: [
        ['Scope', 'Pick one task and define what a good answer looks like.'],
        ['Build', 'Ship the thinnest version that does the job end to end.'],
        ['Test', 'Run it on real examples and record what fails.'],
        ['Ship', 'Deploy it and hand over the code.'],
      ],
      projects: ['verdict', 'claimmate', 'aria', 'resolve-iq'],
      tools: ['LangGraph', 'LangChain', 'Gemini 2.5 Flash', 'Anthropic API', 'Python', 'TypeScript'],
    },
    {
      slug: 'data-dashboards',
      name: 'Data dashboards and analytics',
      short: 'Dashboards',
      titleParts: ['Data dashboards and', 'analytics'],
      icon: 'chart',
      line: 'Interactive dashboards and analytics that turn large datasets into clear insight.',
      pitch: 'The dashboard that took First Prize at TechVerse 2026 turns 1.05 million records into 8 KPIs, 10 charts and a district map.',
      deliver: [
        'A dashboard with the KPIs that matter and the detail behind them',
        'Maps and charts that answer a question',
        'A data-trust page so readers know what the numbers can and cannot say',
        'An assistant that answers questions from the data',
      ],
      steps: [
        ['Understand', 'Learn the data, its gaps and who will read the result.'],
        ['Model', 'Clean it and agree on the few numbers that count.'],
        ['Design', 'Build the views and test them with a real reader.'],
        ['Publish', 'Ship it live with the sources visible.'],
      ],
      projects: ['chicago-crime', 'bot-detection'],
      tools: ['Python', 'pandas', 'R', 'ggplot2', 'SQL', 'SQLite', 'Streamlit'],
    },
    {
      slug: 'full-stack',
      name: 'Full-stack web apps',
      short: 'Full-stack apps',
      titleParts: ['Full-stack', 'web apps'],
      icon: 'layers',
      line: 'Complete web applications, from database and API to a responsive interface.',
      pitch: 'React and TypeScript on the front end, Node.js, Express or Flask on the back end, SQLite or MySQL for data. Eight of my projects are live in production.',
      deliver: [
        'A responsive app with accounts and the right access for each role',
        'A backend and database that fit the problem',
        'Multilingual interfaces where your audience needs them',
        'Deployed, documented and handed over',
      ],
      steps: [
        ['Shape', 'Define the roles, the flows and the first release.'],
        ['Build', 'Frontend and backend together, in small slices.'],
        ['Harden', 'Login, errors, accessibility and speed.'],
        ['Launch', 'Deploy and hand over.'],
      ],
      projects: ['resolve-iq', 'censusguru', 'claimmate', 'chicago-crime'],
      tools: ['React', 'TypeScript', 'Node.js', 'Express', 'Flask', 'SQLite', 'MySQL', 'Vercel'],
    },
    {
      slug: 'automation',
      name: 'Automation',
      short: 'Automation',
      titleParts: ['Workflow', 'automation'],
      icon: 'bolt',
      line: 'Pipelines that automate repetitive work and log every run.',
      pitch: 'ARIA automates research from retrieval to a LaTeX paper. Resolve IQ classifies and routes IT tickets with TF-IDF and Logistic Regression.',
      deliver: [
        'A pipeline that takes a manual process from input to finished output',
        'Classification and routing with a machine learning fallback',
        'Logs and checks so every run can be inspected',
        'Continuous delivery for the project itself',
      ],
      steps: [
        ['Map', 'Write down the manual steps and where the time goes.'],
        ['Automate', 'Replace the tedious steps and keep judgement calls with a person.'],
        ['Observe', 'Add logs and checks so nothing runs unseen.'],
        ['Hand over', 'Document it so your team can own it.'],
      ],
      projects: ['verdict', 'aria', 'resolve-iq', 'devops-demo'],
      tools: ['Python', 'LangGraph', 'scikit-learn', 'GitHub Actions', 'Git'],
    },
    {
      slug: 'freelance',
      name: 'Freelance work',
      short: 'Freelance',
      titleParts: ['Freelance', 'work'],
      icon: 'briefcase',
      line: 'Project-based work with a clear scope, regular updates and code you own.',
      pitch: 'Share what you need. You get a defined scope, visible progress and full ownership of the code.',
      deliver: [
        'A clear scope and timeline before any work starts',
        'Visible progress instead of a reveal at the end',
        'Code and documentation that you own',
        'Direct contact with the person doing the work',
      ],
      steps: [
        ['Talk', 'Send a short note about what you need.'],
        ['Scope', 'We agree the outcome, the timeline and the cost.'],
        ['Build', 'You see progress as it happens.'],
        ['Hand over', 'You get the code, the docs and a walkthrough.'],
      ],
      projects: ['chicago-crime', 'claimmate', 'bot-detection'],
      tools: ['Python', 'TypeScript', 'React', 'Node.js', 'LangGraph', 'R'],
      slots: ['Typical project length', 'How you price', 'Hours you are available'], // SLOT: tell me these
    },
  ],

  // Role-wise resumes. Drop each PDF at the path shown; until then the general resume is used.
  resumes: [
    {
      slug: 'ai-ml-engineer',
      title: 'AI / ML Engineer',
      tag: 'Main résumé',
      summary: 'Machine learning models, agents and data pipelines.',
      points: [
        '90% accuracy detecting bot accounts on about 10,000 held-out accounts, published as a research paper with Springer Nature',
        'Chest X-ray classification with ResNet-50 and transfer learning, served through Flask',
        'Multi-agent systems built with LangGraph, LangChain and Gemini 2.5 Flash',
      ],
      file: '/media/Siddhi-Kale-Resume.pdf',
    },
    {
      slug: 'software-development',
      title: 'Software Development',
      summary: 'Full-stack applications with clean APIs, databases and deployment.',
      points: [
        'ClaimMate: a bilingual React and TypeScript app with a Node.js and Express backend and secure server-side Gemini APIs',
        'Resolve IQ: Flask and Streamlit interfaces with SQLite, search, analytics, file attachments and CSV or PDF reports',
        'API design, database management with SQLite and MySQL, and collaborative work in Git and GitHub',
      ],
      file: '/media/resumes/software-development.pdf',
    },
    {
      slug: 'ai-research-product-intern',
      title: 'AI Research and Product Intern',
      summary: 'Multi-agent AI design and data pipelines, prototyping intelligent product features.',
      points: [
        'ARIA: a LangGraph and LangChain multi-agent workflow from arXiv papers to a publication-ready LaTeX paper',
        'Resolve IQ: ticket classification, routing, retrieval and escalation with TF-IDF and Logistic Regression',
        'Prototypes intelligent product features and integrates AI tools into data pipelines',
      ],
      file: '/media/resumes/ai-research-product-intern.pdf',
    },
    {
      slug: 'marketing',
      title: 'Marketing',
      summary: 'Content strategy, campaigns and lead generation.',
      points: [
        'Led 5 creators, content output up 25% in the first quarter',
        'Organic traffic up 15% year over year',
        'Lead generation up 10% from whitepapers, case studies and campaigns',
      ],
      // No separate marketing PDF yet: this card downloads the main résumé until media/resumes/marketing.pdf exists.
      file: '/media/resumes/marketing.pdf',
    },
  ],

  // The records section: three cards, each opens to its detail.
  records: [
    {
      slug: 'techverse-2026', date: ['Oct', '2026'], kind: 'prize', title: 'TechVerse 2026', result: 'First Prize',
      line: 'I led Team Moleculens to first place at Ajeenkya DY Patil University with Chicago Crime Analytics: 1.05 million crime records turned into a dashboard anyone can question.',
      href: '/records/techverse-2026/',
    },
    {
      slug: 'sih-internal-2026', date: ['Sep', '2026'], kind: 'rank', title: 'Smart India Hackathon 2026', result: 'Internal winner',
      line: 'BhuSamhita: one trusted layer across land records, GIS, courts, tax and payment. I built its backend and every integration.',
      href: '/work/bhusamhita/',
    },
    {
      slug: 'icaiml-ae-2026', date: ['Jul', '2026'], kind: 'paper', title: 'Research paper, international conference', result: 'Published paper',
      line: 'Co-authored a machine learning paper on spotting coordinated bot accounts. Presented at an international AI conference (ICAIML-AE 2026) and published by Atlantis Press, part of Springer Nature.',
      href: '/records/icaiml-ae-2026/',
    },
  ],

  recordPages: {
    'techverse-2026': {
      headline: 'TechVerse 2026',
      result: 'First Prize',
      facts: [
        ['Result', 'First Prize'],
        ['Event', 'Skill Carnival 2026, organised by SkillSurge Club'],
        ['Date', '7 October 2026'],
        ['Location', 'Ajeenkya DY Patil University, Pune, India'],
        ['Team', 'Moleculens, ADYPU'],
        ['Role', 'Team leader'],
        ['My contribution', 'Data cleaning, visualisation and insights'],
        ['Project', 'Chicago Crime Analytics'],
      ],
      body: [
        'I led Team Moleculens to first place at TechVerse 2026, held at Ajeenkya DY Patil University in Pune as part of Skill Carnival 2026.',
        'As team leader I owned the data: cleaning about 1.05 million raw crime records, visualising them, and drawing out the insights the dashboard tells.',
        'Chicago Crime Analytics turned those records into 8 KPIs, 10 charts and a district map, with a built-in assistant and a data-trust page that shows every cleaning step.',
      ],
      project: 'chicago-crime',
    },
    'icaiml-ae-2026': {
      headline: 'Published research paper',
      result: 'Springer Nature',
      facts: [
        ['Conference', 'International Conference on Artificial Intelligence and Machine Learning for Agro-Ecosystems (ICAIML-AE 2026)'],
        ['Dates', '2 to 3 July 2026'],
        ['Organised by', 'Vishwakarma University, with Binghamton University, USA'],
        ['Published by', 'Atlantis Press (Springer Nature)'],
        ['Role', 'Co-author'],
        ['Related project', 'Bot Detection in R'],
      ],
      body: [
        'I co-authored “Hybrid Feature-Based Comparative Analysis of Supervised and Unsupervised ML-Based Intelligent Bot Detection Model for Social Media Data”. It was presented at the International Conference on Artificial Intelligence and Machine Learning for Agro-Ecosystems (ICAIML-AE 2026) and published in the proceedings by Atlantis Press, part of Springer Nature.',
        'The paper compares supervised and unsupervised ways of finding coordinated bot accounts. It builds on the R pipeline behind the Bot Detection project, which reaches 90% accuracy on about 10,000 held-out accounts.',
      ],
      project: 'bot-detection',
    },
  },

  achievements: [
    {
      title: 'TechVerse 2026',
      result: 'First Prize',
      detail: 'Led Team Moleculens to first place with Chicago Crime Analytics.',
      href: '/work/chicago-crime/',
    },
    {
      title: 'Smart India Hackathon 2026',
      result: 'Internal round winner',
      detail: 'Built the backend and every integration for BhuSamhita.',
      href: '/work/bhusamhita/',
    },
    { title: 'ADYPU internal hackathon', result: 'Winner', detail: 'Won in my first semester.' },
  ],

  publication: {
    venue: 'ICAIML-AE 2026',
    publisher: 'Atlantis Press, Springer Nature',
    organiser: 'International Conference on Artificial Intelligence and Machine Learning for Agro-Ecosystems, organised by Vishwakarma University in collaboration with Binghamton University, USA.',
    title:
      'Hybrid Feature-Based Comparative Analysis of Supervised and Unsupervised ML-Based Intelligent Bot Detection Model for Social Media Data',
    href: 'https://www.atlantis-press.com/proceedings/icaiml-ae-26/126028086',
    post: 'https://www.linkedin.com/posts/siddhikale25_research-researchpublication-scopus-ugcPost-7485733002136965120-RzVJ/',
  },

  path: [
    { when: 'Nov 2021 to Mar 2023', what: 'Content and marketing volunteer at Bindu Non-Profit. Led 5 creators. Content output up 25%, organic traffic up 15%.' },
    { when: 'Sep 2024', what: 'Research volunteer with NSS at ADYPU. 8 youth programmes, 100+ children a year.' },
    { when: '2026', what: 'Won the Smart India Hackathon internal round with BhuSamhita.' },
    { when: '2026', what: 'Led Team Moleculens to the TechVerse First Prize with Chicago Crime Analytics.' },
    { when: '2026', what: 'Co-authored a research paper presented at an international AI conference and published by Springer Nature.' },
  ],

  // Where each volunteering photo is centred in its frame (CSS object-position), so faces stay in view.
  photoFocus: {
    '/media/beyond/nss/1.jpg': '50% 24%', '/media/beyond/nss/2.jpg': '50% 50%', '/media/beyond/nss/3.jpg': '50% 55%',
    '/media/beyond/ivolunteer/1.jpg': '50% 50%', '/media/beyond/ivolunteer/2.jpg': '55% 40%', '/media/beyond/ivolunteer/3.jpg': '50% 46%',
    '/media/beyond/swabhiman/1.jpg': '50% 40%', '/media/beyond/swabhiman/2.jpg': '50% 36%', '/media/beyond/swabhiman/3.jpg': '50% 30%', '/media/beyond/swabhiman/4.jpg': '50% 50%',
    '/media/beyond/mad/1.jpg': '50% 50%', '/media/beyond/mad/2.jpg': '50% 15%',
  },

  // The warm part. Photos: media/beyond/<activity>/1.jpg, 2.jpg ... (listed in `photos`; the first one shows first)
  beyond: [
    {
      org: 'NSS, ADYPU',
      role: 'Research volunteer',
      when: 'September 2024 to present',
      facts: ['8 youth programmes', '100+ children a year', 'Records kept for 100% of attendees'],
      photo: '/media/beyond/nss.jpg',
      photos: ['/media/beyond/nss/1.jpg', '/media/beyond/nss/2.jpg', '/media/beyond/nss/3.jpg'],
      art: 'research',
    },
    {
      org: 'Bindu Non-Profit',
      role: 'Content and marketing volunteer',
      when: 'November 2021 to March 2023',
      facts: ['Led a team of 5 creators', 'Content output up 25%', 'Organic traffic up 15%'],
      photo: '/media/beyond/bindu.jpg',
      art: 'content',
    },
    {
      org: 'iVolunteer',
      role: 'Volunteer',
      when: '',
      facts: ['A tree plantation drive', 'A school painting drive'],
      photo: '/media/beyond/ivolunteer.jpg',
      photos: ['/media/beyond/ivolunteer/1.jpg', '/media/beyond/ivolunteer/2.jpg', '/media/beyond/ivolunteer/3.jpg'],
      art: 'plant',
    },
    {
      org: 'Swabhiman Empowerment Foundation',
      role: 'Volunteer',
      when: '',
      facts: ["Children’s Day"],
      photo: '/media/beyond/swabhiman.jpg',
      photos: ['/media/beyond/swabhiman/3.jpg', '/media/beyond/swabhiman/4.jpg', '/media/beyond/swabhiman/1.jpg', '/media/beyond/swabhiman/2.jpg'],
      art: 'balloons',
    },
    {
      org: 'MAD Foundation',
      role: 'Teaching volunteer',
      when: '',
      facts: ['Teaching'],
      photo: '/media/beyond/mad.jpg',
      photos: ['/media/beyond/mad/1.jpg', '/media/beyond/mad/2.jpg'],
      art: 'book',
    },
  ],
};



