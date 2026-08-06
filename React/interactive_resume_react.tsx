import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp, Sun, Moon } from "lucide-react";

const stats = [
  { num: "10+", label: "Years Experience" },
  { num: "8", label: "Companies" },
  { num: "10+", label: "Global Clients" },
  { num: "3+", label: "Awards" },
];

const experiences = [
  {
    company: "Persistent Systems",
    position: "Project Lead",
    duration: "Jan 2025 – Till Date",
    current: true,
    clients: ["Microsoft", "Intuit"],
    details: [
      {
        title: "Project Lead Responsibilities",
        bullets: [
          "Led and mentored cross-functional team ensuring code quality through regular reviews.",
          "Conducted sprint planning, mid-sprint reviews, end-of-sprint retrospectives and demos.",
          "Prepared weekly status reports covering progress, risks, blockers, and milestones.",
          "Technical decision-making, architecture design, and technology selection.",
          "Leveraged AI tools — Cursor and Claude (Anthropic) — for code generation, debugging, and documentation.",
        ],
        skills: "",
      },
      {
        title: "Client: Microsoft — NYC OTI My City",
        bullets: [
          "Developed UI web pages using ReactJS, Context API, Redux, and React Hooks.",
          "Created responsive UI with wireframes, mockups, and visual designs using Figma and Material UI.",
          "Delivered WCAG-compliant product following Accessibility standards.",
        ],
        skills: "HTML5, CSS3, TypeScript, React JS, Jest, RTL, Material UI, Figma",
      },
      {
        title: "Client: Intuit — TurboTax & QBO ICC Credit Card",
        bullets: [
          "Designed Playwright E2E automation scenarios for TurboTax covering login, income, deductions, and submission.",
          "Developed reusable Page Object Models (POM) for scalable test architecture.",
          "Automated ICC Credit Card flows — Onboarding, Transactions, Profile, and Teams.",
          "Built reusable snapshot testing framework library for visual regression testing.",
          "Integrated snapshot library into CI/CD pipeline to detect UI changes early.",
        ],
        skills: "Playwright, TypeScript, React JS, POM, Snapshot Testing, CI/CD",
      },
    ],
  },
  {
    company: "Tachyon Tech",
    position: "Senior Software Engineer",
    duration: "Jul 2024 – Nov 2024",
    current: false,
    clients: ["Woolworths"],
    details: [{
      title: "Project: Woolies",
      bullets: [
        "Built React components for product details, cart, pricing, and promotions.",
        "Implemented unit tests with Jest and React Testing Library.",
        "Applied Sass and media queries for responsive design.",
      ],
      skills: "TypeScript, React JS, Jest, Storybook, Sass, Node JS, Next JS",
    }],
  },
  {
    company: "HSBC Technology India",
    position: "Consultant Specialist",
    duration: "Feb 2023 – Dec 2023",
    current: false,
    clients: ["HSBC"],
    details: [{
      title: "Project: CCAT (Client Custody Asset)",
      bullets: [
        "Designed UI components for auth and Meta Manager with global UI library.",
        "Integrated React with Redux for state management and CRUD operations.",
        "Designed RESTful APIs and MongoDB schemas using Node.js and Express.",
      ],
      skills: "TypeScript, React JS, Redux, Node JS, Express, MongoDB, Jest, Next JS",
    }],
  },
  {
    company: "Capgemini",
    position: "Consultant Specialist",
    duration: "Oct 2021 – Jan 2023",
    current: false,
    clients: ["Prudential Insurance"],
    details: [{
      title: "Project: OPOE – Prudential Insurance",
      bullets: [
        "Built global UI library with form elements and tables with search/sort/filter.",
        "Integrated React with Redux and designed RESTful APIs using Node.js.",
      ],
      skills: "React JS, Redux, Node JS, Express, MongoDB, AWS, ZoomSDK",
    }],
  },
  {
    company: "IDC Technology",
    position: "Senior Software Engineer",
    duration: "Oct 2020 – Oct 2021",
    current: false,
    clients: ["Credit Suisse"],
    details: [{
      title: "Project: Goals Driven Wealth Management",
      bullets: [
        "Built modular React components — forms, dropdowns, accordions, tables with search/sort/filter.",
        "Integrated React with Redux for seamless data flow and CRUD operations.",
      ],
      skills: "React JS, Redux, Node JS, Express, MongoDB, Jest, Azure",
    }],
  },
  {
    company: "MITR Learning Media",
    position: "Senior Software Engineer",
    duration: "Jan 2017 – Jun 2020",
    current: false,
    clients: ["Curriculum Associates"],
    details: [{
      title: "Project: I-Fabric, I-Ready 🏆 2x Spot Award",
      bullets: [
        "Led React component development for eLearning modules, renderers, and widgets.",
        "Implemented E2E testing using Selenium, BrowserStack, and Nightwatch.",
        "Contributed to open-source createjs-accessibility repository.",
      ],
      skills: "React JS, Redux, Node JS, Selenium, CreateJS, PWA",
    }],
  },
  {
    company: "Hurix Digital",
    position: "HTML5 Programmer",
    duration: "Dec 2015 – Dec 2016",
    current: false,
    clients: ["GEMS", "HMH"],
    details: [{
      title: "Project: GEMS, HMH NGSS CDLO 🏆 Team of Month",
      bullets: [
        "Implemented TweenMax animations and D3.js chart components.",
        "Designed interactive quiz templates — drag-and-drop, fill-in-blank, matching pairs.",
      ],
      skills: "HTML5, CSS3, JavaScript, D3.js, CreateJS, TweenMax",
    }],
  },
  {
    company: "Tata Interactive System",
    position: "Software Engineer",
    duration: "Oct 2012 – Jan 2014",
    current: false,
    clients: ["Excelsior University", "WNYSU"],
    details: [{
      title: "Project: WBT Courses",
      bullets: [
        "Converted Flash/PSD to HTML5 for improved performance.",
        "Created interactive templates with MCQs, timelines, and audio/video integration.",
      ],
      skills: "HTML5, CSS3, JavaScript",
    }],
  },
];

const skillGroups = [
  { title: "Frontend", tags: ["React JS", "TypeScript", "JavaScript", "HTML5", "CSS3", "SASS", "Next JS"], highlight: ["React JS", "TypeScript"] },
  { title: "State Management", tags: ["Redux", "Redux-Toolkit", "Redux-Saga", "Context API", "React Hooks"], highlight: ["Redux"] },
  { title: "Automation Testing", tags: ["Playwright", "Selenium", "Cypress", "Puppeteer"], highlight: ["Playwright"] },
  { title: "Unit Testing", tags: ["Jest", "React Testing Library", "Enzyme", "Storybook"], highlight: ["Jest"] },
  { title: "Snapshot Testing", tags: ["Visual Regression", "Snapshot Framework", "CI/CD"], highlight: ["Visual Regression"] },
  { title: "Backend", tags: ["Node JS", "Express JS", "MongoDB", "REST APIs", "JWT"], highlight: ["Node JS"] },
  { title: "AI Tools", tags: ["Cursor", "Claude (Anthropic)", "GitHub Copilot"], highlight: ["Cursor", "Claude (Anthropic)"] },
  { title: "Tools & Infra", tags: ["Figma", "Git", "GitHub", "Webpack", "Vite", "Postman", "AWS", "Azure"], highlight: [] },
];

const skillRatings = [
  { skill: "React JS", level: 95 },
  { skill: "TypeScript", level: 88 },
  { skill: "JavaScript", level: 92 },
  { skill: "Redux", level: 88 },
  { skill: "HTML5 / CSS3", level: 95 },
  { skill: "Node JS", level: 78 },
  { skill: "Playwright", level: 85 },
  { skill: "Jest / RTL", level: 82 },
  { skill: "MongoDB", level: 72 },
  { skill: "Next JS", level: 75 },
  { skill: "Snapshot Testing", level: 80 },
  { skill: "AI Tools (Cursor/Claude)", level: 85 },
];

const achievements = [
  { icon: "🏆", title: "2x Spot Award", sub: "MITR Learning Media — for completing tasks on time" },
  { icon: "🌟", title: "Team of the Month", sub: "Hurix Digital — for outstanding team contribution" },
  { icon: "💻", title: "Open Source Contributor", sub: "createjs-accessibility & createjs-accessibility-tester" },
  { icon: "♿", title: "WCAG Compliance Specialist", sub: "Delivered accessible apps for Microsoft (NYC OTI My City)" },
  { icon: "🤖", title: "AI-Augmented Developer", sub: "Adopted Cursor & Claude to boost team productivity" },
];

function AccordionItem({ title, bullets, skills, dark }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-b last:border-0 ${dark ? "border-gray-700" : "border-gray-100"}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between py-2 text-left text-xs font-medium transition-colors ${dark ? "text-slate-300 hover:text-white" : "text-slate-700 hover:text-slate-900"}`}
      >
        <span>{title}</span>
        {open
          ? <ChevronUp size={14} className={`flex-shrink-0 ${dark ? "text-slate-500" : "text-slate-400"}`} />
          : <ChevronDown size={14} className={`flex-shrink-0 ${dark ? "text-slate-500" : "text-slate-400"}`} />}
      </button>
      {open && (
        <div className="pb-3">
          <ul className="space-y-1 ml-3 mb-2">
            {bullets.map((b, i) => (
              <li key={i} className={`text-xs flex gap-2 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                <span className={`mt-0.5 flex-shrink-0 ${dark ? "text-gray-600" : "text-gray-300"}`}>•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          {skills && (
            <p className={`text-xs mt-1 ml-3 ${dark ? "text-gray-400" : "text-gray-500"}`}>
              <span className={`font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Skills: </span>{skills}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function Resume() {
  const [dark, setDark] = useState(false);

  const bg = dark ? "bg-gray-950" : "bg-gray-50";
  const cardBg = dark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200";
  const heading = dark ? "text-white" : "text-slate-800";
  const sub = dark ? "text-gray-400" : "text-gray-500";
  const badgeVariant = dark ? "outline" : "outline";
  const tagBg = dark ? "bg-gray-800 text-gray-300" : "bg-slate-100 text-slate-600";
  const skillCardBg = dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const hlBadge = dark ? "bg-indigo-600 hover:bg-indigo-500 text-white border-0" : "bg-slate-800 hover:bg-slate-700 text-white border-0";
  const sepColor = dark ? "bg-gray-700" : "bg-gray-200";
  const tabsBg = dark ? "bg-gray-800" : "";
  const tabActive = dark ? "data-[state=active]:bg-gray-900 data-[state=active]:text-white" : "";
  const tabText = dark ? "text-gray-400" : "";

  return (
    <div className={`min-h-screen ${bg} p-4 md:p-8 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto space-y-4">

        {/* THEME TOGGLE */}
        <div className="flex justify-end">
          <button
            onClick={() => setDark(!dark)}
            className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-colors ${dark ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            {dark ? <Sun size={13} /> : <Moon size={13} />}
            {dark ? "Light mode" : "Dark mode"}
          </button>
        </div>

        {/* HERO */}
        <div className={`rounded-2xl border shadow-sm p-5 transition-colors ${cardBg}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold flex-shrink-0 ${dark ? "bg-indigo-600" : "bg-slate-800"}`}>
              SJ
            </div>
            <div className="flex-1">
              <h1 className={`text-xl font-semibold ${heading}`}>Sudhir A. Jedhe</h1>
              <p className={`text-sm mt-0.5 ${sub}`}>
                Senior React JS Developer · Project Lead · MERN Stack · Playwright Automation
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {["📞 8551873835", "📧 jedhesudhir@gmail.com", "📍 India"].map((c, i) => (
                  <span key={i} className={`text-xs border rounded-lg px-2.5 py-1 ${dark ? "border-gray-700 text-gray-400 bg-gray-800" : "border-gray-200 text-gray-500 bg-gray-50"}`}>{c}</span>
                ))}
                <a href="https://www.linkedin.com/in/sudhirjedhe/" target="_blank" rel="noreferrer">
                  <span className={`text-xs border rounded-lg px-2.5 py-1 cursor-pointer transition-colors ${dark ? "border-gray-700 text-blue-400 bg-gray-800 hover:bg-gray-700" : "border-gray-200 text-blue-600 bg-gray-50 hover:bg-gray-100"}`}>🔗 LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <div key={i} className={`rounded-xl border shadow-sm p-4 text-center transition-colors ${cardBg}`}>
              <div className={`text-2xl font-semibold ${dark ? "text-indigo-400" : "text-slate-800"}`}>{s.num}</div>
              <div className={`text-xs mt-1 ${sub}`}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <Tabs defaultValue="summary">
          <TabsList className={`w-full grid grid-cols-4 ${tabsBg}`}>
            {["summary", "experience", "skills", "awards"].map(t => (
              <TabsTrigger key={t} value={t} className={`capitalize ${tabActive} ${tabText}`}>{t}</TabsTrigger>
            ))}
          </TabsList>

          {/* SUMMARY */}
          <TabsContent value="summary">
            <div className={`rounded-2xl border shadow-sm p-5 text-sm leading-relaxed transition-colors ${cardBg} ${sub}`}>
              Senior React JS Developer and Project Lead with{" "}
              <span className={`font-medium ${heading}`}>10+ years of experience</span> building scalable web applications across fintech, banking, insurance, government, and e-learning domains. Proficient in{" "}
              <span className={`font-medium ${heading}`}>React JS, Redux, TypeScript, Node.js, and MERN Stack</span>. Hands-on expertise in{" "}
              <span className={`font-medium ${heading}`}>Playwright E2E test automation</span>, Page Object Models, and reusable{" "}
              <span className={`font-medium ${heading}`}>snapshot testing framework libraries</span>. Experienced in leveraging{" "}
              <span className={`font-medium ${heading}`}>AI tools (Cursor, Claude)</span> to accelerate development. Delivered WCAG-compliant UIs for global clients including{" "}
              <span className={`font-medium ${heading}`}>Intuit, Microsoft, HSBC, Prudential, Credit Suisse, and Woolworths</span>.
            </div>
          </TabsContent>

          {/* EXPERIENCE */}
          <TabsContent value="experience" className="space-y-3">
            {experiences.map((exp, i) => (
              <div key={i} className={`rounded-2xl border shadow-sm p-4 transition-colors ${cardBg}`}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-semibold ${heading}`}>{exp.company}</span>
                      {exp.current && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-normal">Current</span>
                      )}
                    </div>
                    <div className={`text-xs mt-0.5 ${sub}`}>{exp.position}</div>
                  </div>
                  <span className={`text-xs border rounded-lg px-2.5 py-1 self-start font-normal ${dark ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"}`}>{exp.duration}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {exp.clients.map((c, j) => (
                    <span key={j} className={`text-xs px-2 py-0.5 rounded-md ${tagBg}`}>{c}</span>
                  ))}
                </div>
                <div className={`h-px w-full mb-2 ${sepColor}`} />
                {exp.details.map((d, j) => (
                  <AccordionItem key={j} title={d.title} bullets={d.bullets} skills={d.skills} dark={dark} />
                ))}
              </div>
            ))}
          </TabsContent>

          {/* SKILLS */}
          <TabsContent value="skills" className="space-y-4">

            {/* RATINGS */}
            <div className={`rounded-2xl border shadow-sm p-5 transition-colors ${cardBg}`}>
              <p className={`text-xs font-medium uppercase tracking-wide mb-4 ${dark ? "text-gray-500" : "text-gray-400"}`}>Skill Proficiency</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {skillRatings.map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs font-medium ${heading}`}>{s.skill}</span>
                      <span className={`text-xs ${dark ? "text-indigo-400" : "text-slate-600"}`}>{s.level}%</span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full ${dark ? "bg-gray-700" : "bg-gray-200"}`}>
                      <div
                        className={`h-1.5 rounded-full transition-all duration-700 ${dark ? "bg-indigo-500" : "bg-slate-700"}`}
                        style={{ width: `${s.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TAGS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {skillGroups.map((g, i) => (
                <div key={i} className={`rounded-xl border shadow-sm p-4 transition-colors ${skillCardBg}`}>
                  <p className={`text-xs font-medium uppercase tracking-wide mb-3 ${dark ? "text-gray-500" : "text-gray-400"}`}>{g.title}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {g.tags.map((t, j) => (
                      <span
                        key={j}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-normal ${
                          g.highlight.includes(t)
                            ? hlBadge
                            : dark
                              ? "bg-gray-700 text-gray-300 border-gray-600"
                              : "bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* AWARDS */}
          <TabsContent value="awards">
            <div className={`rounded-2xl border shadow-sm p-4 transition-colors ${cardBg}`}>
              {achievements.map((a, i) => (
                <div key={i}>
                  <div className="flex items-start gap-3 py-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${dark ? "bg-yellow-900/30" : "bg-amber-50"}`}>
                      {a.icon}
                    </div>
                    <div>
                      <div className={`text-sm font-medium ${heading}`}>{a.title}</div>
                      <div className={`text-xs mt-0.5 ${sub}`}>{a.sub}</div>
                    </div>
                  </div>
                  {i < achievements.length - 1 && <div className={`h-px w-full ${sepColor}`} />}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
