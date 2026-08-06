import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Sun, Moon, Menu, X, ExternalLink, Mail, Phone, Linkedin, MapPin, Award, Code, Briefcase, User, Star } from "lucide-react";

const NAV = ["About", "Experience", "Skills", "Awards", "Contact"];

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
    color: "indigo",
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
      },
      {
        title: "Client: Microsoft — NYC OTI My City",
        bullets: [
          "Developed UI web pages using ReactJS, Context API, Redux, and React Hooks.",
          "Created responsive UI with wireframes, mockups using Figma and Material UI.",
          "Delivered WCAG-compliant product following Accessibility standards.",
        ],
        skills: "HTML5, CSS3, TypeScript, React JS, Jest, RTL, Material UI, Figma",
      },
      {
        title: "Client: Intuit — TurboTax & QBO ICC Credit Card",
        bullets: [
          "Designed Playwright E2E automation scenarios for TurboTax.",
          "Developed reusable Page Object Models (POM) for scalable test architecture.",
          "Automated ICC Credit Card flows — Onboarding, Transactions, Profile, Teams.",
          "Built reusable snapshot testing framework library for visual regression.",
          "Integrated snapshot library into CI/CD pipeline.",
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
    color: "emerald",
    details: [{
      title: "Project: Woolies",
      bullets: ["Built React components for product details, cart, pricing.", "Implemented unit tests with Jest and RTL.", "Applied Sass and media queries for responsive design."],
      skills: "TypeScript, React JS, Jest, Storybook, Sass, Node JS, Next JS",
    }],
  },
  {
    company: "HSBC Technology India",
    position: "Consultant Specialist",
    duration: "Feb 2023 – Dec 2023",
    current: false,
    clients: ["HSBC"],
    color: "red",
    details: [{
      title: "Project: CCAT (Client Custody Asset)",
      bullets: ["Designed UI components for auth and Meta Manager.", "Integrated React with Redux for state management.", "Designed RESTful APIs and MongoDB schemas."],
      skills: "TypeScript, React JS, Redux, Node JS, Express, MongoDB, Jest",
    }],
  },
  {
    company: "Capgemini",
    position: "Consultant Specialist",
    duration: "Oct 2021 – Jan 2023",
    current: false,
    clients: ["Prudential Insurance"],
    color: "blue",
    details: [{
      title: "Project: OPOE – Prudential Insurance",
      bullets: ["Built global UI library with form elements and tables.", "Integrated React with Redux and designed RESTful APIs."],
      skills: "React JS, Redux, Node JS, Express, MongoDB, AWS, ZoomSDK",
    }],
  },
  {
    company: "IDC Technology",
    position: "Senior Software Engineer",
    duration: "Oct 2020 – Oct 2021",
    current: false,
    clients: ["Credit Suisse"],
    color: "amber",
    details: [{
      title: "Project: Goals Driven Wealth Management",
      bullets: ["Built modular React components — forms, dropdowns, accordions, tables.", "Integrated React with Redux for seamless data flow."],
      skills: "React JS, Redux, Node JS, Express, MongoDB, Jest, Azure",
    }],
  },
  {
    company: "MITR Learning Media",
    position: "Senior Software Engineer",
    duration: "Jan 2017 – Jun 2020",
    current: false,
    clients: ["Curriculum Associates"],
    color: "purple",
    details: [{
      title: "Project: I-Fabric, I-Ready 🏆 2x Spot Award",
      bullets: ["Led React component development for eLearning modules.", "Implemented E2E testing using Selenium and BrowserStack.", "Contributed to open-source createjs-accessibility repository."],
      skills: "React JS, Redux, Node JS, Selenium, CreateJS, PWA",
    }],
  },
  {
    company: "Hurix Digital",
    position: "HTML5 Programmer",
    duration: "Dec 2015 – Dec 2016",
    current: false,
    clients: ["GEMS", "HMH"],
    color: "pink",
    details: [{
      title: "Project: GEMS, HMH NGSS CDLO 🏆 Team of Month",
      bullets: ["Implemented TweenMax animations and D3.js charts.", "Designed interactive quiz templates."],
      skills: "HTML5, CSS3, JavaScript, D3.js, CreateJS, TweenMax",
    }],
  },
  {
    company: "Tata Interactive System",
    position: "Software Engineer",
    duration: "Oct 2012 – Jan 2014",
    current: false,
    clients: ["Excelsior University", "WNYSU"],
    color: "teal",
    details: [{
      title: "Project: WBT Courses",
      bullets: ["Converted Flash/PSD to HTML5.", "Created interactive templates with MCQs and timelines."],
      skills: "HTML5, CSS3, JavaScript",
    }],
  },
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
  { skill: "AI Tools", level: 85 },
];

const skillGroups = [
  { title: "Frontend", tags: ["React JS", "TypeScript", "JavaScript", "HTML5", "CSS3", "SASS", "Next JS"] },
  { title: "State Management", tags: ["Redux", "Redux-Toolkit", "Context API", "React Hooks"] },
  { title: "Automation", tags: ["Playwright", "Selenium", "Cypress", "Puppeteer"] },
  { title: "Testing", tags: ["Jest", "React Testing Library", "Enzyme", "Storybook"] },
  { title: "Backend", tags: ["Node JS", "Express JS", "MongoDB", "REST APIs", "JWT"] },
  { title: "AI Tools", tags: ["Cursor", "Claude (Anthropic)", "GitHub Copilot"] },
  { title: "Tools", tags: ["Figma", "Git", "GitHub", "Webpack", "Vite", "Postman", "AWS", "Azure"] },
];

const achievements = [
  { icon: "🏆", title: "2x Spot Award", sub: "MITR Learning Media" },
  { icon: "🌟", title: "Team of the Month", sub: "Hurix Digital" },
  { icon: "💻", title: "Open Source Contributor", sub: "createjs-accessibility" },
  { icon: "♿", title: "WCAG Specialist", sub: "Microsoft NYC OTI My City" },
  { icon: "🤖", title: "AI-Augmented Developer", sub: "Cursor & Claude adoption" },
];

const colorMap = {
  indigo: { dot: "#6366f1", light: "#eef2ff", text: "#4338ca" },
  emerald: { dot: "#10b981", light: "#ecfdf5", text: "#047857" },
  red: { dot: "#ef4444", light: "#fef2f2", text: "#b91c1c" },
  blue: { dot: "#3b82f6", light: "#eff6ff", text: "#1d4ed8" },
  amber: { dot: "#f59e0b", light: "#fffbeb", text: "#b45309" },
  purple: { dot: "#a855f7", light: "#faf5ff", text: "#7e22ce" },
  pink: { dot: "#ec4899", light: "#fdf2f8", text: "#be185d" },
  teal: { dot: "#14b8a6", light: "#f0fdfa", text: "#0f766e" },
};

function AccordionItem({ title, bullets, skills, dark }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${dark ? "#374151" : "#f3f4f6"}` }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: dark ? "#c7d2fe" : "#4338ca" }}>{title}</span>
        {open ? <ChevronUp size={13} color={dark ? "#6b7280" : "#9ca3af"} /> : <ChevronDown size={13} color={dark ? "#6b7280" : "#9ca3af"} />}
      </button>
      {open && (
        <div style={{ paddingBottom: 12 }}>
          <ul style={{ margin: "0 0 8px 14px", padding: 0 }}>
            {bullets.map((b, i) => (
              <li key={i} style={{ fontSize: 12, color: dark ? "#9ca3af" : "#6b7280", lineHeight: 1.7, marginBottom: 2, listStyle: "disc" }}>{b}</li>
            ))}
          </ul>
          {skills && <p style={{ fontSize: 11.5, color: dark ? "#9ca3af" : "#6b7280", marginLeft: 14 }}><strong style={{ color: dark ? "#e5e7eb" : "#374151" }}>Skills: </strong>{skills}</p>}
        </div>
      )}
    </div>
  );
}

function SkillBar({ skill, level, dark, animate }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: dark ? "#e5e7eb" : "#1f2937" }}>{skill}</span>
        <span style={{ fontSize: 11, color: dark ? "#818cf8" : "#4338ca" }}>{level}%</span>
      </div>
      <div style={{ background: dark ? "#374151" : "#e5e7eb", borderRadius: 99, height: 6, overflow: "hidden" }}>
        <div style={{ height: 6, borderRadius: 99, background: dark ? "linear-gradient(90deg,#6366f1,#818cf8)" : "linear-gradient(90deg,#1e3a8a,#4338ca)", width: animate ? `${level}%` : "0%", transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("About");
  const [animateSkills, setAnimateSkills] = useState(false);
  const skillsRef = useRef(null);
  const sectionRefs = { About: useRef(null), Experience: useRef(null), Skills: useRef(null), Awards: useRef(null), Contact: useRef(null) };

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { setActive(e.target.dataset.section); if (e.target.dataset.section === "Skills") setAnimateSkills(true); } });
    }, { threshold: 0.3 });
    Object.values(sectionRefs).forEach(r => r.current && obs.observe(r.current));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (sec) => { sectionRefs[sec]?.current?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  const bg = dark ? "#030712" : "#f8fafc";
  const card = dark ? "#111827" : "#ffffff";
  const border = dark ? "#1f2937" : "#e5e7eb";
  const txt = dark ? "#f9fafb" : "#111827";
  const muted = dark ? "#9ca3af" : "#6b7280";
  const accent = dark ? "#818cf8" : "#1e3a8a";

  return (
    <div style={{ background: bg, minHeight: "100vh", fontFamily: "system-ui, sans-serif", color: txt, transition: "all .3s" }}>

      {/* NAVBAR */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: dark ? "rgba(3,7,18,0.92)" : "rgba(255,255,255,0.92)", borderBottom: `1px solid ${border}`, backdropFilter: "blur(12px)", padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: accent, letterSpacing: 1 }}>SJ</span>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 2 }} className="nav-links">
              {NAV.map(n => (
                <button key={n} onClick={() => scrollTo(n)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: active === n ? (dark ? "#1e1b4b" : "#eff6ff") : "transparent", color: active === n ? accent : muted, fontSize: 13, fontWeight: active === n ? 600 : 400, cursor: "pointer", transition: "all .2s" }}>{n}</button>
              ))}
            </div>
            <button onClick={() => setDark(!dark)} style={{ marginLeft: 8, padding: "6px 10px", borderRadius: 8, border: `1px solid ${border}`, background: "transparent", cursor: "pointer", color: muted, display: "flex", alignItems: "center", gap: 4 }}>
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ marginLeft: 4, padding: "6px 8px", border: `1px solid ${border}`, borderRadius: 8, background: "transparent", cursor: "pointer", color: muted, display: "flex" }}>
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div style={{ background: card, borderTop: `1px solid ${border}`, padding: "12px 24px" }}>
            {NAV.map(n => (
              <button key={n} onClick={() => scrollTo(n)} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 0", border: "none", background: "transparent", color: active === n ? accent : txt, fontSize: 14, fontWeight: active === n ? 600 : 400, cursor: "pointer", borderBottom: `1px solid ${border}` }}>{n}</button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section data-section="About" ref={sectionRefs.About} style={{ background: dark ? "linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%)" : "linear-gradient(135deg,#1e3a8a 0%,#312e81 100%)", padding: "80px 24px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ width: 90, height: 90, borderRadius: "50%", background: dark ? "#4338ca" : "#3730a3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 700, color: "#fff", margin: "0 auto 20px", border: "3px solid rgba(255,255,255,0.2)" }}>SJ</div>
          <h1 style={{ fontSize: "clamp(24px,5vw,42px)", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>Sudhir A. Jedhe</h1>
          <p style={{ fontSize: "clamp(13px,2vw,16px)", color: "#a5b4fc", marginBottom: 24 }}>Senior React JS Developer · Project Lead · MERN Stack · Playwright Automation</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 32 }}>
            {["📞 8551873835", "📧 jedhesudhir@gmail.com", "📍 India"].map((c, i) => (
              <span key={i} style={{ fontSize: 12, padding: "5px 14px", borderRadius: 99, background: "rgba(255,255,255,0.1)", color: "#c7d2fe", border: "1px solid rgba(255,255,255,0.15)" }}>{c}</span>
            ))}
            <a href="https://www.linkedin.com/in/sudhirjedhe/" target="_blank" rel="noreferrer" style={{ fontSize: 12, padding: "5px 14px", borderRadius: 99, background: "rgba(255,255,255,0.15)", color: "#bfdbfe", border: "1px solid rgba(255,255,255,0.2)", textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}><Linkedin size={12} /> LinkedIn</a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, maxWidth: 500, margin: "0 auto" }}>
            {stats.map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 8px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#a5b4fc" }}>{s.num}</div>
                <div style={{ fontSize: 10, color: "#818cf8", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section style={{ padding: "60px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: txt, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><User size={20} color={accent} /> About Me</h2>
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 24 }}>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: muted }}>
            Senior React JS Developer and Project Lead with <strong style={{ color: txt }}>10+ years of experience</strong> building scalable, high-performance web applications across fintech, banking, insurance, government, and e-learning domains. Proficient in <strong style={{ color: txt }}>React JS, Redux, TypeScript, Node.js, and MERN Stack</strong>. Hands-on expertise in <strong style={{ color: txt }}>Playwright E2E test automation</strong>, Page Object Models, and reusable <strong style={{ color: txt }}>snapshot testing framework libraries</strong>. Experienced in leveraging <strong style={{ color: txt }}>AI tools (Cursor, Claude)</strong> to accelerate development. Delivered WCAG-compliant, production-ready UIs for global clients including <strong style={{ color: txt }}>Intuit, Microsoft, HSBC, Prudential, Credit Suisse, and Woolworths</strong>.
          </p>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section data-section="Experience" ref={sectionRefs.Experience} style={{ padding: "0 24px 60px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: txt, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}><Briefcase size={20} color={accent} /> Experience</h2>
        <div style={{ position: "relative", paddingLeft: 28 }}>
          <div style={{ position: "absolute", left: 10, top: 0, bottom: 0, width: 2, background: dark ? "#1f2937" : "#e5e7eb", borderRadius: 2 }} />
          {experiences.map((exp, i) => {
            const c = colorMap[exp.color];
            return (
              <div key={i} style={{ position: "relative", marginBottom: 20 }}>
                <div style={{ position: "absolute", left: -22, top: 20, width: 14, height: 14, borderRadius: "50%", background: c.dot, border: `2px solid ${dark ? "#030712" : "#f8fafc"}`, zIndex: 1 }} />
                <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 20, marginLeft: 8 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: txt }}>{exp.company}</span>
                        {exp.current && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "#dcfce7", color: "#15803d", fontWeight: 600 }}>Current</span>}
                      </div>
                      <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>{exp.position}</div>
                    </div>
                    <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 8, background: dark ? "#1f2937" : "#f3f4f6", color: muted, border: `1px solid ${border}` }}>{exp.duration}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                    {exp.clients.map((cl, j) => (
                      <span key={j} style={{ fontSize: 11, padding: "2px 10px", borderRadius: 6, background: c.light, color: c.text }}>{cl}</span>
                    ))}
                  </div>
                  <div style={{ borderTop: `1px solid ${border}`, paddingTop: 8 }}>
                    {exp.details.map((d, j) => <AccordionItem key={j} title={d.title} bullets={d.bullets} skills={d.skills} dark={dark} />)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SKILLS */}
      <section data-section="Skills" ref={sectionRefs.Skills} style={{ padding: "0 24px 60px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: txt, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}><Code size={20} color={accent} /> Skills</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: muted, marginBottom: 20 }}>Proficiency</p>
            {skillRatings.map((s, i) => <SkillBar key={i} skill={s.skill} level={s.level} dark={dark} animate={animateSkills} />)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, alignContent: "start" }}>
            {skillGroups.map((g, i) => (
              <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 16, gridColumn: i === 6 ? "1 / -1" : "auto" }}>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: accent, marginBottom: 10 }}>{g.title}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {g.tags.map((t, j) => (
                    <span key={j} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: dark ? "#1f2937" : "#f1f5f9", color: dark ? "#d1d5db" : "#374151", border: `1px solid ${border}` }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AWARDS */}
      <section data-section="Awards" ref={sectionRefs.Awards} style={{ padding: "0 24px 60px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: txt, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}><Award size={20} color={accent} /> Achievements</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
          {achievements.map((a, i) => (
            <div key={i} style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{a.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: txt, marginBottom: 4 }}>{a.title}</div>
              <div style={{ fontSize: 12, color: muted }}>{a.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section data-section="Contact" ref={sectionRefs.Contact} style={{ padding: "0 24px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: txt, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}><Mail size={20} color={accent} /> Contact</h2>
        <div style={{ background: dark ? "linear-gradient(135deg,#1e1b4b,#0f172a)" : "linear-gradient(135deg,#1e3a8a,#312e81)", borderRadius: 20, padding: "40px 32px", textAlign: "center" }}>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Let's work together</h3>
          <p style={{ fontSize: 14, color: "#a5b4fc", marginBottom: 32 }}>Open to exciting React JS opportunities</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
            <a href="tel:8551873835" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 10, background: "rgba(255,255,255,0.1)", color: "#e0e7ff", textDecoration: "none", fontSize: 13, border: "1px solid rgba(255,255,255,0.15)" }}><Phone size={14} /> 8551873835</a>
            <a href="mailto:jedhesudhir@gmail.com" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 10, background: "rgba(255,255,255,0.1)", color: "#e0e7ff", textDecoration: "none", fontSize: 13, border: "1px solid rgba(255,255,255,0.15)" }}><Mail size={14} /> jedhesudhir@gmail.com</a>
            <a href="https://www.linkedin.com/in/sudhirjedhe/" target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 10, background: "rgba(255,255,255,0.15)", color: "#bfdbfe", textDecoration: "none", fontSize: 13, border: "1px solid rgba(255,255,255,0.2)" }}><Linkedin size={14} /> LinkedIn <ExternalLink size={11} /></a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${border}`, padding: "20px 24px", textAlign: "center", fontSize: 12, color: muted }}>
        Built with React · © 2025 Sudhir A. Jedhe
      </footer>
    </div>
  );
}
