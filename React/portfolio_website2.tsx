import { useState, useEffect, useRef } from "react";
import { Sun, Moon, Menu, X, ChevronDown, ChevronUp, ExternalLink, Mail, Phone, Linkedin, Code, Briefcase, User, Award, Palette } from "lucide-react";

// ── DATA ────────────────────────────────────────────────────────────────────
const NAV = ["About","Experience","Skills","Awards","Contact"];

const stats = [
  { num:"10+", label:"Years Exp" },
  { num:"8",   label:"Companies" },
  { num:"10+", label:"Clients" },
  { num:"3+",  label:"Awards" },
];

const experiences = [
  { company:"Persistent Systems", position:"Project Lead", duration:"Jan 2025 – Till Date", current:true, clients:["Microsoft","Intuit"], color:"#6366f1",
    details:[
      { title:"Project Lead Responsibilities", bullets:["Led cross-functional team with code reviews and best practices.","Conducted sprint planning, mid-sprint reviews, retrospectives & demos.","Prepared weekly status reports — progress, risks, blockers, milestones.","Technical decision-making, architecture design, technology selection.","Used Cursor & Claude (Anthropic) for code generation & documentation."], skills:"" },
      { title:"Client: Microsoft — NYC OTI My City", bullets:["Developed UI pages with ReactJS, Context API, Redux, React Hooks.","Created responsive designs using Figma, Material UI, styled components.","Delivered WCAG-compliant product following Accessibility standards."], skills:"HTML5, CSS3, TypeScript, React JS, Jest, RTL, Material UI, Figma" },
      { title:"Client: Intuit — TurboTax & QBO ICC Credit Card", bullets:["Designed Playwright E2E test scenarios for TurboTax workflows.","Built reusable Page Object Models (POM) for scalable architecture.","Automated ICC Credit Card flows — Onboarding, Transactions, Teams.","Built snapshot testing framework library for visual regression.","Integrated snapshot library into CI/CD pipeline."], skills:"Playwright, TypeScript, React JS, POM, Snapshot Testing, CI/CD" },
    ],
  },
  { company:"Tachyon Tech", position:"Senior Software Engineer", duration:"Jul 2024 – Nov 2024", current:false, clients:["Woolworths"], color:"#10b981",
    details:[{ title:"Project: Woolies", bullets:["Built React components for product details, cart, pricing.","Implemented unit tests with Jest and RTL.","Applied Sass & media queries for responsive design."], skills:"TypeScript, React JS, Jest, Storybook, Sass, Node JS, Next JS" }],
  },
  { company:"HSBC Technology India", position:"Consultant Specialist", duration:"Feb 2023 – Dec 2023", current:false, clients:["HSBC"], color:"#ef4444",
    details:[{ title:"Project: CCAT (Client Custody Asset)", bullets:["Designed auth components and global UI library.","Integrated React with Redux for CRUD operations.","Designed RESTful APIs and MongoDB schemas."], skills:"TypeScript, React JS, Redux, Node JS, Express, MongoDB, Jest" }],
  },
  { company:"Capgemini", position:"Consultant Specialist", duration:"Oct 2021 – Jan 2023", current:false, clients:["Prudential Insurance"], color:"#3b82f6",
    details:[{ title:"Project: OPOE – Prudential Insurance", bullets:["Built global UI library with form elements and tables.","Integrated React+Redux; designed RESTful APIs with Node.js."], skills:"React JS, Redux, Node JS, Express, MongoDB, AWS, ZoomSDK" }],
  },
  { company:"IDC Technology", position:"Senior Software Engineer", duration:"Oct 2020 – Oct 2021", current:false, clients:["Credit Suisse"], color:"#f59e0b",
    details:[{ title:"Goals Driven Wealth Management", bullets:["Built modular React components — forms, accordions, tables.","Integrated React with Redux for seamless data flow."], skills:"React JS, Redux, Node JS, Express, MongoDB, Jest, Azure" }],
  },
  { company:"MITR Learning Media", position:"Senior Software Engineer", duration:"Jan 2017 – Jun 2020", current:false, clients:["Curriculum Associates"], color:"#a855f7",
    details:[{ title:"I-Fabric, I-Ready 🏆 2x Spot Award", bullets:["Led React component development for eLearning modules.","E2E testing with Selenium, BrowserStack, Nightwatch.","Contributed to open-source createjs-accessibility."], skills:"React JS, Redux, Node JS, Selenium, CreateJS, PWA" }],
  },
  { company:"Hurix Digital", position:"HTML5 Programmer", duration:"Dec 2015 – Dec 2016", current:false, clients:["GEMS","HMH"], color:"#ec4899",
    details:[{ title:"GEMS, HMH NGSS CDLO 🏆 Team of Month", bullets:["TweenMax animations and D3.js chart components.","Interactive quiz templates — drag-drop, fill-blank, matching."], skills:"HTML5, CSS3, JavaScript, D3.js, CreateJS, TweenMax" }],
  },
  { company:"Tata Interactive System", position:"Software Engineer", duration:"Oct 2012 – Jan 2014", current:false, clients:["Excelsior University","WNYSU"], color:"#14b8a6",
    details:[{ title:"WBT Courses", bullets:["Converted Flash/PSD to HTML5.","Created interactive MCQs, timelines, audio/video templates."], skills:"HTML5, CSS3, JavaScript" }],
  },
];

const skillRatings = [
  { skill:"React JS", level:95 }, { skill:"TypeScript", level:88 }, { skill:"JavaScript", level:92 },
  { skill:"Redux", level:88 }, { skill:"HTML5 / CSS3", level:95 }, { skill:"Node JS", level:78 },
  { skill:"Playwright", level:85 }, { skill:"Jest / RTL", level:82 }, { skill:"MongoDB", level:72 },
  { skill:"Next JS", level:75 }, { skill:"Snapshot Testing", level:80 }, { skill:"AI Tools", level:85 },
];

const skillGroups = [
  { title:"Frontend", icon:"⚛️", tags:["React JS","TypeScript","JavaScript","HTML5","CSS3","SASS","Next JS"] },
  { title:"State Mgmt", icon:"🔄", tags:["Redux","Redux-Toolkit","Context API","React Hooks"] },
  { title:"Automation", icon:"🎭", tags:["Playwright","Selenium","Cypress","Puppeteer"] },
  { title:"Testing", icon:"🧪", tags:["Jest","React Testing Library","Enzyme","Storybook"] },
  { title:"Backend", icon:"⚙️", tags:["Node JS","Express JS","MongoDB","REST APIs","JWT"] },
  { title:"AI Tools", icon:"🤖", tags:["Cursor","Claude (Anthropic)","GitHub Copilot"] },
  { title:"Tools", icon:"🛠️", tags:["Figma","Git","GitHub","Webpack","Vite","Postman","AWS","Azure"] },
];

const achievements = [
  { icon:"🏆", title:"2x Spot Award", sub:"MITR Learning Media", color:"#f59e0b" },
  { icon:"🌟", title:"Team of the Month", sub:"Hurix Digital", color:"#6366f1" },
  { icon:"💻", title:"Open Source Contributor", sub:"createjs-accessibility", color:"#10b981" },
  { icon:"♿", title:"WCAG Specialist", sub:"Microsoft NYC OTI My City", color:"#3b82f6" },
  { icon:"🤖", title:"AI-Augmented Dev", sub:"Cursor & Claude adoption", color:"#a855f7" },
];

const TEMPLATES = [
  { id:"minimal",  label:"Minimal",  icon:"◻" },
  { id:"neon",     label:"Neon",     icon:"◈" },
  { id:"glass",    label:"Glass",    icon:"◎" },
];

// ── ACCORDION ────────────────────────────────────────────────────────────────
function Acc({ title, bullets, skills, t }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom:`1px solid ${t.sep}` }}>
      <button onClick={()=>setOpen(!open)} style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", background:"none", border:"none", cursor:"pointer" }}>
        <span style={{ fontSize:12, fontWeight:600, color:t.accent }}>{title}</span>
        {open ? <ChevronUp size={13} color={t.muted}/> : <ChevronDown size={13} color={t.muted}/>}
      </button>
      {open && (
        <div style={{ paddingBottom:12 }}>
          <ul style={{ margin:"4px 0 8px 14px", padding:0 }}>
            {bullets.map((b,i)=><li key={i} style={{ fontSize:12, color:t.muted, lineHeight:1.7, marginBottom:2, listStyle:"disc" }}>{b}</li>)}
          </ul>
          {skills && <p style={{ fontSize:11.5, color:t.muted, marginLeft:14 }}><strong style={{ color:t.txt }}>Skills: </strong>{skills}</p>}
        </div>
      )}
    </div>
  );
}

// ── SKILL BAR ────────────────────────────────────────────────────────────────
function Bar({ skill, level, t, animate }) {
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
        <span style={{ fontSize:12, color:t.txt }}>{skill}</span>
        <span style={{ fontSize:11, color:t.accent }}>{level}%</span>
      </div>
      <div style={{ background:t.sep, borderRadius:99, height:6, overflow:"hidden" }}>
        <div style={{ height:6, borderRadius:99, background:t.bar, width:animate?`${level}%`:"0%", transition:"width 1s ease" }}/>
      </div>
    </div>
  );
}

// ── THEME TOKENS ─────────────────────────────────────────────────────────────
function getTokens(tmpl, dark) {
  if (tmpl==="minimal") return {
    pageBg: dark?"#0f172a":"#f8fafc",
    navBg:  dark?"rgba(15,23,42,0.95)":"rgba(255,255,255,0.95)",
    card:   dark?"#1e293b":"#ffffff",
    border: dark?"#334155":"#e2e8f0",
    sep:    dark?"#334155":"#f1f5f9",
    txt:    dark?"#f1f5f9":"#0f172a",
    muted:  dark?"#94a3b8":"#64748b",
    accent: dark?"#818cf8":"#4f46e5",
    heroBg: dark?"linear-gradient(135deg,#0f172a,#1e1b4b)":"linear-gradient(135deg,#1e3a8a,#312e81)",
    heroTxt:"#e0e7ff",
    heroSub:"#a5b4fc",
    bar:    dark?"linear-gradient(90deg,#6366f1,#a5b4fc)":"linear-gradient(90deg,#1e3a8a,#6366f1)",
    tagBg:  dark?"#1e293b":"#f1f5f9",
    tagTxt: dark?"#cbd5e1":"#334155",
    cardShadow: dark?"0 2px 12px rgba(0,0,0,0.4)":"0 2px 12px rgba(0,0,0,0.06)",
  };
  if (tmpl==="neon") return {
    pageBg: "#050811",
    navBg:  "rgba(5,8,17,0.95)",
    card:   "#0d1117",
    border: "#1a2a1a",
    sep:    "#0d1a0d",
    txt:    "#e2ffe2",
    muted:  "#4ade80",
    accent: "#00ff88",
    heroBg: "linear-gradient(135deg,#050811,#0d2818)",
    heroTxt:"#00ff88",
    heroSub:"#4ade80",
    bar:    "linear-gradient(90deg,#00ff88,#00ffcc)",
    tagBg:  "#0a1a0a",
    tagTxt: "#4ade80",
    cardShadow:"0 0 20px rgba(0,255,136,0.08)",
    neon: true,
  };
  if (tmpl==="glass") return {
    pageBg: dark?"linear-gradient(135deg,#0f0c29,#302b63,#24243e)":"linear-gradient(135deg,#667eea,#764ba2)",
    navBg:  "rgba(255,255,255,0.08)",
    card:   "rgba(255,255,255,0.08)",
    border: "rgba(255,255,255,0.15)",
    sep:    "rgba(255,255,255,0.1)",
    txt:    "#ffffff",
    muted:  "rgba(255,255,255,0.65)",
    accent: "#c4b5fd",
    heroBg: "transparent",
    heroTxt:"#ffffff",
    heroSub:"rgba(255,255,255,0.7)",
    bar:    "linear-gradient(90deg,#c4b5fd,#f0abfc)",
    tagBg:  "rgba(255,255,255,0.1)",
    tagTxt: "#e9d5ff",
    cardShadow:"0 8px 32px rgba(0,0,0,0.2)",
    glass: true,
  };
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [dark, setDark] = useState(true);
  const [tmpl, setTmpl] = useState("minimal");
  const [menu, setMenu] = useState(false);
  const [tmplOpen, setTmplOpen] = useState(false);
  const [active, setActive] = useState("About");
  const [animSkills, setAnimSkills] = useState(false);
  const [cursor, setCursor] = useState({ x:0, y:0 });
  const refs = { About:useRef(), Experience:useRef(), Skills:useRef(), Awards:useRef(), Contact:useRef() };
  const t = getTokens(tmpl, dark);

  useEffect(()=>{
    const obs = new IntersectionObserver(es=>{ es.forEach(e=>{ if(e.isIntersecting){ setActive(e.target.dataset.s); if(e.target.dataset.s==="Skills") setAnimSkills(true); } }); },{ threshold:0.2 });
    Object.values(refs).forEach(r=>r.current&&obs.observe(r.current));
    return ()=>obs.disconnect();
  },[]);

  useEffect(()=>{
    if(tmpl!=="neon") return;
    const h = e=>setCursor({x:e.clientX,y:e.clientY});
    window.addEventListener("mousemove",h);
    return ()=>window.removeEventListener("mousemove",h);
  },[tmpl]);

  const scrollTo = s=>{ refs[s]?.current?.scrollIntoView({behavior:"smooth"}); setMenu(false); };

  const cardStyle = (extra={})=>({
    background: t.card,
    border: `1px solid ${t.border}`,
    borderRadius: 16,
    boxShadow: t.cardShadow,
    backdropFilter: t.glass?"blur(16px)":undefined,
    WebkitBackdropFilter: t.glass?"blur(16px)":undefined,
    ...extra,
  });

  return (
    <div style={{ background: t.pageBg, minHeight:"100vh", fontFamily:"system-ui,sans-serif", color:t.txt, transition:"all .3s", position:"relative", overflow:"hidden" }}>

      {/* NEON CURSOR GLOW */}
      {t.neon && <div style={{ position:"fixed", pointerEvents:"none", zIndex:0, width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(0,255,136,0.06),transparent 70%)", left:cursor.x-200, top:cursor.y-200, transition:"left .1s,top .1s" }}/>}

      {/* GLASS BG BLOBS */}
      {t.glass && <>
        <div style={{ position:"fixed", top:-100, left:-100, width:400, height:400, borderRadius:"50%", background:"rgba(167,139,250,0.3)", filter:"blur(60px)", pointerEvents:"none" }}/>
        <div style={{ position:"fixed", bottom:-100, right:-100, width:400, height:400, borderRadius:"50%", background:"rgba(244,114,182,0.2)", filter:"blur(60px)", pointerEvents:"none" }}/>
      </>}

      {/* NAVBAR */}
      <nav style={{ position:"sticky", top:0, zIndex:100, background:t.navBg, borderBottom:`1px solid ${t.border}`, backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", padding:"0 20px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:54 }}>
          <span style={{ fontWeight:800, fontSize:18, color:t.accent, letterSpacing:2, textShadow:t.neon?"0 0 12px #00ff88":undefined }}>SJ</span>

          {/* Desktop nav */}
          <div style={{ display:"flex", gap:2, alignItems:"center" }}>
            <div style={{ display:"flex", gap:2 }}>
              {NAV.map(n=>(
                <button key={n} onClick={()=>scrollTo(n)} style={{ padding:"5px 12px", borderRadius:8, border:"none", background: active===n?(t.neon?"rgba(0,255,136,0.1)":t.glass?"rgba(255,255,255,0.15)":"rgba(99,102,241,0.1)"):"transparent", color: active===n?t.accent:t.muted, fontSize:13, fontWeight: active===n?700:400, cursor:"pointer", transition:"all .2s", boxShadow: active===n&&t.neon?"0 0 8px rgba(0,255,136,0.3)":undefined }}>
                  {n}
                </button>
              ))}
            </div>

            {/* Template switcher */}
            <div style={{ position:"relative", marginLeft:8 }}>
              <button onClick={()=>setTmplOpen(!tmplOpen)} style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 10px", borderRadius:8, border:`1px solid ${t.border}`, background:"transparent", cursor:"pointer", color:t.muted, fontSize:12 }}>
                <Palette size={13}/> {TEMPLATES.find(x=>x.id===tmpl)?.label}
              </button>
              {tmplOpen && (
                <div style={{ position:"absolute", right:0, top:"calc(100% + 6px)", background:t.card, border:`1px solid ${t.border}`, borderRadius:10, overflow:"hidden", minWidth:120, zIndex:200, boxShadow:"0 8px 24px rgba(0,0,0,0.2)", backdropFilter:t.glass?"blur(16px)":undefined }}>
                  {TEMPLATES.map(tp=>(
                    <button key={tp.id} onClick={()=>{ setTmpl(tp.id); setTmplOpen(false); }} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"9px 14px", border:"none", background: tmpl===tp.id?(t.neon?"rgba(0,255,136,0.1)":"rgba(99,102,241,0.1)"):"transparent", color: tmpl===tp.id?t.accent:t.txt, fontSize:13, cursor:"pointer", textAlign:"left" }}>
                      <span>{tp.icon}</span> {tp.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark toggle (only for non-neon templates) */}
            {tmpl!=="neon" && (
              <button onClick={()=>setDark(!dark)} style={{ marginLeft:4, padding:"5px 8px", borderRadius:8, border:`1px solid ${t.border}`, background:"transparent", cursor:"pointer", color:t.muted, display:"flex", alignItems:"center" }}>
                {dark?<Sun size={14}/>:<Moon size={14}/>}
              </button>
            )}

            <button onClick={()=>setMenu(!menu)} style={{ marginLeft:4, padding:"5px 7px", border:`1px solid ${t.border}`, borderRadius:8, background:"transparent", cursor:"pointer", color:t.muted, display:"flex" }}>
              {menu?<X size={15}/>:<Menu size={15}/>}
            </button>
          </div>
        </div>

        {menu && (
          <div style={{ background:t.card, borderTop:`1px solid ${t.border}`, padding:"8px 20px", backdropFilter:t.glass?"blur(16px)":undefined }}>
            {NAV.map(n=>(
              <button key={n} onClick={()=>scrollTo(n)} style={{ display:"block", width:"100%", textAlign:"left", padding:"10px 0", border:"none", background:"transparent", color: active===n?t.accent:t.txt, fontSize:14, fontWeight: active===n?600:400, cursor:"pointer", borderBottom:`1px solid ${t.sep}` }}>{n}</button>
            ))}
          </div>
        )}
      </nav>

      <div style={{ position:"relative", zIndex:1 }}>

        {/* HERO */}
        <section data-s="About" ref={refs.About} style={{ background:t.heroBg, padding:"70px 24px 56px", textAlign:"center" }}>
          <div style={{ maxWidth:700, margin:"0 auto" }}>
            <div style={{ width:90, height:90, borderRadius:"50%", background: t.neon?"rgba(0,255,136,0.15)":t.glass?"rgba(255,255,255,0.15)":"rgba(99,102,241,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, fontWeight:800, color:t.accent, margin:"0 auto 20px", border:`2px solid ${t.border}`, boxShadow:t.neon?"0 0 24px rgba(0,255,136,0.3)":undefined }}>SJ</div>
            <h1 style={{ fontSize:"clamp(22px,5vw,40px)", fontWeight:800, color:t.heroTxt, margin:"0 0 8px", textShadow:t.neon?"0 0 20px rgba(0,255,136,0.4)":undefined }}>Sudhir A. Jedhe</h1>
            <p style={{ fontSize:"clamp(12px,2vw,15px)", color:t.heroSub, marginBottom:24 }}>Senior React JS Developer · Project Lead · MERN Stack · Playwright</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginBottom:30 }}>
              {["📞 8551873835","📧 jedhesudhir@gmail.com","📍 India"].map((c,i)=>(
                <span key={i} style={{ fontSize:12, padding:"5px 14px", borderRadius:99, background: t.glass||t.neon?"rgba(255,255,255,0.08)":undefined, backdropFilter:t.glass?"blur(8px)":undefined, color:t.heroSub, border:`1px solid ${t.border}` }}>{c}</span>
              ))}
              <a href="https://www.linkedin.com/in/sudhirjedhe/" target="_blank" rel="noreferrer" style={{ fontSize:12, padding:"5px 14px", borderRadius:99, background:t.glass||t.neon?"rgba(255,255,255,0.12)":undefined, color:t.accent, border:`1px solid ${t.border}`, textDecoration:"none", display:"flex", alignItems:"center", gap:5, boxShadow:t.neon?"0 0 8px rgba(0,255,136,0.2)":undefined }}>
                <Linkedin size={12}/> LinkedIn
              </a>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, maxWidth:480, margin:"0 auto" }}>
              {stats.map((s,i)=>(
                <div key={i} style={{ ...cardStyle({ padding:"14px 8px", textAlign:"center", backdropFilter: t.glass?"blur(8px)":undefined }), boxShadow:t.neon?`0 0 16px rgba(0,255,136,0.1)`:undefined }}>
                  <div style={{ fontSize:20, fontWeight:800, color:t.accent }}>{s.num}</div>
                  <div style={{ fontSize:10, color:t.muted, marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section style={{ padding:"50px 24px 0", maxWidth:1100, margin:"0 auto" }}>
          <SectionTitle icon={<User size={18} color={t.accent}/>} title="About Me" t={t}/>
          <div style={cardStyle({ padding:24 })}>
            <p style={{ fontSize:14, lineHeight:1.9, color:t.muted }}>
              Senior React JS Developer and Project Lead with <strong style={{ color:t.txt }}>10+ years</strong> building scalable web apps across fintech, banking, insurance, government, and e-learning. Expert in <strong style={{ color:t.txt }}>React JS, Redux, TypeScript, MERN Stack</strong>, with deep expertise in <strong style={{ color:t.txt }}>Playwright automation</strong>, snapshot testing, and <strong style={{ color:t.txt }}>AI-augmented development (Cursor, Claude)</strong>. Delivered WCAG-compliant UIs for <strong style={{ color:t.txt }}>Intuit, Microsoft, HSBC, Prudential, Credit Suisse & Woolworths</strong>.
            </p>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section data-s="Experience" ref={refs.Experience} style={{ padding:"50px 24px 0", maxWidth:1100, margin:"0 auto" }}>
          <SectionTitle icon={<Briefcase size={18} color={t.accent}/>} title="Experience" t={t}/>
          <div style={{ position:"relative", paddingLeft:28 }}>
            <div style={{ position:"absolute", left:10, top:8, bottom:8, width:2, background:t.border, borderRadius:2 }}/>
            {experiences.map((exp,i)=>(
              <div key={i} style={{ position:"relative", marginBottom:16 }}>
                <div style={{ position:"absolute", left:-22, top:22, width:14, height:14, borderRadius:"50%", background:exp.color, border:`2px solid ${t.pageBg||"#050811"}`, zIndex:1, boxShadow:t.neon?`0 0 12px ${exp.color}`:undefined }}/>
                <div style={cardStyle({ padding:20, marginLeft:8 })}>
                  <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", gap:8, marginBottom:8 }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                        <span style={{ fontSize:14, fontWeight:700, color:t.txt }}>{exp.company}</span>
                        {exp.current && <span style={{ fontSize:10, padding:"2px 8px", borderRadius:99, background:"rgba(16,185,129,0.15)", color:"#10b981", fontWeight:700 }}>● Current</span>}
                      </div>
                      <div style={{ fontSize:12, color:t.muted, marginTop:2 }}>{exp.position}</div>
                    </div>
                    <span style={{ fontSize:11, padding:"3px 10px", borderRadius:8, background:t.tagBg, color:t.muted, border:`1px solid ${t.border}` }}>{exp.duration}</span>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
                    {exp.clients.map((c,j)=>(
                      <span key={j} style={{ fontSize:11, padding:"2px 10px", borderRadius:6, background: t.neon||t.glass?"rgba(255,255,255,0.06)":undefined, color:exp.color, border:`1px solid ${exp.color}30` }}>{c}</span>
                    ))}
                  </div>
                  <div style={{ borderTop:`1px solid ${t.sep}`, paddingTop:6 }}>
                    {exp.details.map((d,j)=><Acc key={j} title={d.title} bullets={d.bullets} skills={d.skills} t={t}/>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SKILLS */}
        <section data-s="Skills" ref={refs.Skills} style={{ padding:"50px 24px 0", maxWidth:1100, margin:"0 auto" }}>
          <SectionTitle icon={<Code size={18} color={t.accent}/>} title="Skills" t={t}/>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
            <div style={cardStyle({ padding:24 })}>
              <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:t.muted, marginBottom:18 }}>Proficiency</p>
              {skillRatings.map((s,i)=><Bar key={i} skill={s.skill} level={s.level} t={t} animate={animSkills}/>)}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, alignContent:"start" }}>
              {skillGroups.map((g,i)=>(
                <div key={i} style={cardStyle({ padding:14, gridColumn: i===6?"1 / -1":"auto" })}>
                  <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:t.accent, marginBottom:8 }}>{g.icon} {g.title}</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                    {g.tags.map((tg,j)=>(
                      <span key={j} style={{ fontSize:11, padding:"3px 9px", borderRadius:99, background:t.tagBg, color:t.tagTxt, border:`1px solid ${t.border}` }}>{tg}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AWARDS */}
        <section data-s="Awards" ref={refs.Awards} style={{ padding:"50px 24px 0", maxWidth:1100, margin:"0 auto" }}>
          <SectionTitle icon={<Award size={18} color={t.accent}/>} title="Achievements" t={t}/>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14 }}>
            {achievements.map((a,i)=>(
              <div key={i} style={cardStyle({ padding:22, textAlign:"center", transition:"transform .2s", cursor:"default" })}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-4px)"}
                onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                <div style={{ fontSize:34, marginBottom:10, filter:t.neon?`drop-shadow(0 0 8px ${a.color})`:undefined }}>{a.icon}</div>
                <div style={{ fontSize:13, fontWeight:700, color:t.txt, marginBottom:4 }}>{a.title}</div>
                <div style={{ fontSize:11, color:t.muted }}>{a.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section data-s="Contact" ref={refs.Contact} style={{ padding:"50px 24px 70px", maxWidth:1100, margin:"0 auto" }}>
          <SectionTitle icon={<Mail size={18} color={t.accent}/>} title="Contact" t={t}/>
          <div style={{ ...cardStyle({ padding:"44px 32px", textAlign:"center" }), background: t.neon?"rgba(0,255,136,0.04)": t.glass?"rgba(255,255,255,0.06)":"linear-gradient(135deg,rgba(99,102,241,0.12),rgba(168,85,247,0.08))", border:`1px solid ${t.border}` }}>
            <h3 style={{ fontSize:22, fontWeight:700, color:t.txt, marginBottom:8, textShadow:t.neon?"0 0 16px rgba(0,255,136,0.3)":undefined }}>Let's work together</h3>
            <p style={{ fontSize:14, color:t.muted, marginBottom:28 }}>Open to exciting React JS opportunities</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:12, justifyContent:"center" }}>
              {[
                { icon:<Phone size={14}/>, label:"8551873835", href:"tel:8551873835" },
                { icon:<Mail size={14}/>, label:"jedhesudhir@gmail.com", href:"mailto:jedhesudhir@gmail.com" },
                { icon:<Linkedin size={14}/>, label:"LinkedIn", href:"https://www.linkedin.com/in/sudhirjedhe/", ext:true },
              ].map((c,i)=>(
                <a key={i} href={c.href} target={c.ext?"_blank":undefined} rel="noreferrer" style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 20px", borderRadius:10, background:t.tagBg, color:t.accent, textDecoration:"none", fontSize:13, border:`1px solid ${t.border}`, transition:"all .2s", boxShadow:t.neon?"0 0 10px rgba(0,255,136,0.1)":undefined }}
                  onMouseEnter={e=>{ e.currentTarget.style.background=t.accent; e.currentTarget.style.color="#000"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background=t.tagBg; e.currentTarget.style.color=t.accent; }}>
                  {c.icon} {c.label} {c.ext&&<ExternalLink size={11}/>}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop:`1px solid ${t.border}`, padding:"18px 24px", textAlign:"center", fontSize:12, color:t.muted }}>
          Built with React · © 2025 Sudhir A. Jedhe
        </footer>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title, t }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
      {icon}
      <h2 style={{ fontSize:20, fontWeight:700, color:t.txt, margin:0 }}>{title}</h2>
      <div style={{ flex:1, height:1, background:t.border, marginLeft:8 }}/>
    </div>
  );
}
