import { useState, useReducer, useCallback } from "react";
import { Plus, Trash2, Download, Eye, EyeOff, ChevronDown, ChevronUp, Settings, User, Briefcase, Code, Award, Mail, Grip } from "lucide-react";

// ── INITIAL CONFIG ────────────────────────────────────────────────────────────
const SKILL_CATALOG = {
  Frontend:    ["React JS","TypeScript","JavaScript","HTML5","CSS3","SASS","Next JS"],
  "State Mgmt":["Redux","Redux-Toolkit","Context API","React Hooks"],
  Automation:  ["Playwright","Selenium","Cypress","Puppeteer"],
  Testing:     ["Jest","React Testing Library","Enzyme","Storybook"],
  Backend:     ["Node JS","Express JS","MongoDB","REST APIs","JWT"],
};

const SECTION_CONFIG = [
  { id:"header",     label:"Header",     icon:"👤", enabled:true,  required:true  },
  { id:"summary",    label:"Summary",    icon:"📝", enabled:true,  required:false },
  { id:"skills",     label:"Skills",     icon:"💡", enabled:true,  required:false },
  { id:"experience", label:"Experience", icon:"💼", enabled:true,  required:false },
  { id:"education",  label:"Education",  icon:"🎓", enabled:true,  required:false },
  { id:"awards",     label:"Awards",     icon:"🏆", enabled:true,  required:false },
];

const TEMPLATES = [
  { id:"modern",   label:"Modern",   accent:"#6366f1", bg:"#f8fafc" },
  { id:"dark",     label:"Dark Pro", accent:"#10b981", bg:"#0f172a" },
  { id:"minimal",  label:"Minimal",  accent:"#374151", bg:"#ffffff" },
  { id:"creative", label:"Creative", accent:"#ec4899", bg:"#fdf4ff" },
];

const initState = {
  template: "modern",
  sections: SECTION_CONFIG,
  previewMode: false,
  activePanel: "header",
  data: {
    header: { name:"Sudhir A. Jedhe", title:"Senior React JS Developer | Project Lead | MERN Stack | Playwright Automation", email:"jedhesudhir@gmail.com", phone:"8551873835", location:"India", linkedin:"linkedin.com/in/sudhirjedhe" },
    summary: "Senior React JS Developer and Project Lead with 10+ years of experience building scalable web applications across fintech, banking, insurance, government, and e-learning domains. Expert in React JS, Redux, TypeScript, MERN Stack, Playwright automation, and AI-augmented development.",
    skills: {
      Frontend:    ["React JS","TypeScript","JavaScript","HTML5","CSS3","SASS","Next JS"],
      "State Mgmt":["Redux","Redux-Toolkit","Context API","React Hooks"],
      Automation:  ["Playwright","Selenium","Cypress","Puppeteer"],
      Testing:     ["Jest","React Testing Library","Enzyme","Storybook"],
      Backend:     ["Node JS","Express JS","MongoDB","REST APIs","JWT"],
    },
    experience: [
      { id:1, company:"Persistent Systems", position:"Project Lead", duration:"Jan 2025 – Till Date", current:true, description:"Led cross-functional teams for Microsoft (NYC OTI My City) and Intuit (TurboTax & QBO ICC Credit Card). Built Playwright automation, snapshot testing framework, and WCAG-compliant UIs.", skills:["React JS","Playwright","TypeScript","CI/CD"] },
      { id:2, company:"HSBC Technology India", position:"Consultant Specialist", duration:"Feb 2023 – Dec 2023", current:false, description:"Developed CCAT platform for mutual fund custody operations. Built global UI library, integrated Redux, designed RESTful APIs.", skills:["React JS","Redux","Node JS","MongoDB"] },
      { id:3, company:"Capgemini", position:"Consultant Specialist", duration:"Oct 2021 – Jan 2023", current:false, description:"Built OPOE insurance portal for Prudential. Developed global UI library and RESTful APIs.", skills:["React JS","Redux","Node JS","AWS"] },
    ],
    education: [
      { id:1, degree:"BE Computer Engineering", institution:"University of Pune", year:"2012" },
    ],
    awards: [
      { id:1, title:"2x Spot Award", org:"MITR Learning Media", desc:"For completing tasks on time" },
      { id:2, title:"Team of the Month", org:"Hurix Digital", desc:"Outstanding team contribution" },
      { id:3, title:"Open Source Contributor", org:"createjs-accessibility", desc:"Accessibility library contributions" },
    ],
  },
};

// ── REDUCER ───────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch(action.type) {
    case "SET_TEMPLATE": return { ...state, template: action.payload };
    case "TOGGLE_PREVIEW": return { ...state, previewMode: !state.previewMode };
    case "SET_PANEL": return { ...state, activePanel: action.payload };
    case "TOGGLE_SECTION": return { ...state, sections: state.sections.map(s => s.id===action.payload && !s.required ? {...s, enabled:!s.enabled} : s) };
    case "UPDATE_HEADER": return { ...state, data: { ...state.data, header: { ...state.data.header, [action.key]: action.value } } };
    case "UPDATE_SUMMARY": return { ...state, data: { ...state.data, summary: action.payload } };
    case "TOGGLE_SKILL": {
      const cat = action.category; const skill = action.skill;
      const curr = state.data.skills[cat] || [];
      const upd = curr.includes(skill) ? curr.filter(s=>s!==skill) : [...curr, skill];
      return { ...state, data: { ...state.data, skills: { ...state.data.skills, [cat]: upd } } };
    }
    case "ADD_EXP": return { ...state, data: { ...state.data, experience: [...state.data.experience, { id:Date.now(), company:"", position:"", duration:"", current:false, description:"", skills:[] }] } };
    case "UPDATE_EXP": return { ...state, data: { ...state.data, experience: state.data.experience.map(e => e.id===action.id ? {...e, [action.key]:action.value} : e) } };
    case "REMOVE_EXP": return { ...state, data: { ...state.data, experience: state.data.experience.filter(e=>e.id!==action.id) } };
    case "ADD_AWARD": return { ...state, data: { ...state.data, awards: [...state.data.awards, { id:Date.now(), title:"", org:"", desc:"" }] } };
    case "UPDATE_AWARD": return { ...state, data: { ...state.data, awards: state.data.awards.map(a => a.id===action.id ? {...a, [action.key]:action.value} : a) } };
    case "REMOVE_AWARD": return { ...state, data: { ...state.data, awards: state.data.awards.filter(a=>a.id!==action.id) } };
    case "ADD_EDU": return { ...state, data: { ...state.data, education: [...state.data.education, { id:Date.now(), degree:"", institution:"", year:"" }] } };
    case "UPDATE_EDU": return { ...state, data: { ...state.data, education: state.data.education.map(e => e.id===action.id ? {...e, [action.key]:action.value} : e) } };
    case "REMOVE_EDU": return { ...state, data: { ...state.data, education: state.data.education.filter(e=>e.id!==action.id) } };
    default: return state;
  }
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
const inp = (extra={}) => ({ padding:"7px 10px", borderRadius:7, border:"1px solid #d1d5db", fontSize:12, width:"100%", outline:"none", background:"#fff", color:"#111", ...extra });
const Label = ({c}) => <label style={{ fontSize:11, fontWeight:600, color:"#6b7280", textTransform:"uppercase", letterSpacing:.5, display:"block", marginBottom:4 }}>{c}</label>;

// ── PANELS ────────────────────────────────────────────────────────────────────
function HeaderPanel({ data, dispatch }) {
  const fields = [["name","Full Name"],["title","Job Title"],["email","Email"],["phone","Phone"],["location","Location"],["linkedin","LinkedIn"]];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {fields.map(([k,l])=>(
        <div key={k}>
          <Label c={l}/>
          <input style={inp()} value={data[k]} onChange={e=>dispatch({type:"UPDATE_HEADER",key:k,value:e.target.value})}/>
        </div>
      ))}
    </div>
  );
}

function SummaryPanel({ data, dispatch }) {
  return (
    <div>
      <Label c="Professional Summary"/>
      <textarea style={{ ...inp(), height:140, resize:"vertical", lineHeight:1.6 }} value={data} onChange={e=>dispatch({type:"UPDATE_SUMMARY",payload:e.target.value})}/>
      <p style={{ fontSize:11, color:"#9ca3af", marginTop:4 }}>{data.length} characters</p>
    </div>
  );
}

function SkillsPanel({ data, dispatch }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {Object.entries(SKILL_CATALOG).map(([cat, skills])=>(
        <div key={cat}>
          <Label c={cat}/>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {skills.map(s=>{
              const sel = (data[cat]||[]).includes(s);
              return (
                <button key={s} onClick={()=>dispatch({type:"TOGGLE_SKILL",category:cat,skill:s})}
                  style={{ fontSize:11, padding:"4px 10px", borderRadius:99, border:`1px solid ${sel?"#6366f1":"#d1d5db"}`, background:sel?"#eef2ff":"#f9fafb", color:sel?"#4338ca":"#374151", cursor:"pointer", fontWeight:sel?600:400, transition:"all .15s" }}>
                  {sel?"✓ ":""}{s}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExperiencePanel({ data, dispatch }) {
  const [open, setOpen] = useState(data[0]?.id||null);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {data.map(exp=>(
        <div key={exp.id} style={{ border:"1px solid #e5e7eb", borderRadius:10, overflow:"hidden" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 12px", background:"#f9fafb", cursor:"pointer" }} onClick={()=>setOpen(open===exp.id?null:exp.id)}>
            <span style={{ fontSize:12, fontWeight:600, color:"#374151" }}>{exp.company||"New Experience"}</span>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              <button onClick={e=>{e.stopPropagation();dispatch({type:"REMOVE_EXP",id:exp.id})}} style={{ background:"none", border:"none", cursor:"pointer", color:"#ef4444", padding:2 }}><Trash2 size={13}/></button>
              {open===exp.id?<ChevronUp size={14} color="#9ca3af"/>:<ChevronDown size={14} color="#9ca3af"/>}
            </div>
          </div>
          {open===exp.id && (
            <div style={{ padding:12, display:"flex", flexDirection:"column", gap:8 }}>
              {[["company","Company"],["position","Position"],["duration","Duration"]].map(([k,l])=>(
                <div key={k}><Label c={l}/><input style={inp()} value={exp[k]} onChange={e=>dispatch({type:"UPDATE_EXP",id:exp.id,key:k,value:e.target.value})}/></div>
              ))}
              <div>
                <Label c="Description"/>
                <textarea style={{ ...inp(), height:80, resize:"vertical" }} value={exp.description} onChange={e=>dispatch({type:"UPDATE_EXP",id:exp.id,key:"description",value:e.target.value})}/>
              </div>
              <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#374151", cursor:"pointer" }}>
                <input type="checkbox" checked={exp.current} onChange={e=>dispatch({type:"UPDATE_EXP",id:exp.id,key:"current",value:e.target.checked})}/> Currently working here
              </label>
            </div>
          )}
        </div>
      ))}
      <button onClick={()=>dispatch({type:"ADD_EXP"})} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 12px", border:"1px dashed #d1d5db", borderRadius:8, background:"none", cursor:"pointer", color:"#6366f1", fontSize:12, fontWeight:600 }}>
        <Plus size={13}/> Add Experience
      </button>
    </div>
  );
}

function AwardsPanel({ data, dispatch }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {data.map(function(a) { return (
        <div key={a.id} style={{ border:"1px solid #e5e7eb", borderRadius:10, padding:12 }}>
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:6 }}>
            <button onClick={()=>dispatch({type:"REMOVE_AWARD",id:a.id})} style={{ background:"none", border:"none", cursor:"pointer", color:"#ef4444" }}><Trash2 size={13}/></button>
          </div>
          {[["title","Award Title"],["org","Organization"],["desc","Description"]].map(([k,l])=>(
            <div key={k} style={{ marginBottom:6 }}><Label c={l}/><input style={inp()} value={a[k]} onChange={e=>dispatch({type:"UPDATE_AWARD",id:a.id,key:k,value:e.target.value})}/></div>
          ))}
        </div>
      ); })}
      <button onClick={()=>dispatch({type:"ADD_AWARD"})} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 12px", border:"1px dashed #d1d5db", borderRadius:8, background:"none", cursor:"pointer", color:"#6366f1", fontSize:12, fontWeight:600 }}>
        <Plus size={13}/> Add Award
      </button>
    </div>
  );
}

function EducationPanel({ data, dispatch }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {data.map(e=>(
        <div key={e.id} style={{ border:"1px solid #e5e7eb", borderRadius:10, padding:12 }}>
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:6 }}>
            <button onClick={()=>dispatch({type:"REMOVE_EDU",id:e.id})} style={{ background:"none", border:"none", cursor:"pointer", color:"#ef4444" }}><Trash2 size={13}/></button>
          </div>
          {[["degree","Degree"],["institution","Institution"],["year","Year"]].map(([k,l])=>(
            <div key={k} style={{ marginBottom:6 }}><Label c={l}/><input style={inp()} value={e[k]} onChange={ed=>dispatch({type:"UPDATE_EDU",id:e.id,key:k,value:ed.target.value})}/></div>
          ))}
        </div>
      ))}
      <button onClick={()=>dispatch({type:"ADD_EDU"})} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 12px", border:"1px dashed #d1d5db", borderRadius:8, background:"none", cursor:"pointer", color:"#6366f1", fontSize:12, fontWeight:600 }}>
        <Plus size={13}/> Add Education
      </button>
    </div>
  );
}

// ── RESUME PREVIEW ────────────────────────────────────────────────────────────
function ResumePreview({ state }) {
  const { data, template, sections } = state;
  const tmpl = TEMPLATES.find(t=>t.id===template)||TEMPLATES[0];
  const isDark = template==="dark";
  const isCreative = template==="creative";
  const bg = isDark?"#0f172a":tmpl.bg;
  const txt = isDark?"#f1f5f9":"#1f2937";
  const muted = isDark?"#94a3b8":"#6b7280";
  const cardBg = isDark?"#1e293b":"#ffffff";
  const border = isDark?"#334155":"#e5e7eb";
  const acc = tmpl.accent;
  const enabled = (id) => sections.find(s=>s.id===id)?.enabled;

  return (
    <div style={{ background:bg, minHeight:"100%", padding:24, fontFamily:"Georgia, serif", color:txt, fontSize:12 }}>

      {/* HEADER */}
      {enabled("header") && (
        <div style={{ borderBottom:`3px solid ${acc}`, paddingBottom:16, marginBottom:18 }}>
          <h1 style={{ fontSize:22, fontWeight:700, color: isDark?"#fff":acc, margin:"0 0 4px", fontFamily:"Arial,sans-serif" }}>{data.header.name}</h1>
          <p style={{ fontSize:12, color:muted, margin:"0 0 10px", fontFamily:"Arial,sans-serif" }}>{data.header.title}</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:12 }}>
            {[["📞",data.header.phone],["📧",data.header.email],["📍",data.header.location],["🔗",data.header.linkedin]].map(([icon,val],i)=>
              val && <span key={i} style={{ fontSize:11, color:muted }}>  {icon} {val}</span>
            )}
          </div>
        </div>
      )}

      {/* SUMMARY */}
      {enabled("summary") && data.summary && (
        <Section title="Profile Summary" acc={acc} isDark={isDark} border={border}>
          <p style={{ fontSize:12, lineHeight:1.8, color:muted }}>{data.summary}</p>
        </Section>
      )}

      {/* SKILLS */}
      {enabled("skills") && (
        <Section title="Technical Skills" acc={acc} isDark={isDark} border={border}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:10 }}>
            {Object.entries(data.skills).map(([cat,tags])=> tags.length>0 && (
              <div key={cat}>
                <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", color:acc, marginBottom:5, letterSpacing:.5 }}>{cat}</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                  {tags.map(t=><span key={t} style={{ fontSize:10, padding:"2px 7px", borderRadius:99, background: isDark?"#1e293b":isCreative?"#fdf4ff":"#f3f4f6", color: isDark?"#c7d2fe":isCreative?"#9d174d":acc, border:`1px solid ${border}` }}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* EXPERIENCE */}
      {enabled("experience") && data.experience.length>0 && (
        <Section title="Experience" acc={acc} isDark={isDark} border={border}>
          {data.experience.map((exp,i)=>(
            <div key={exp.id} style={{ marginBottom:i<data.experience.length-1?14:0, paddingLeft:12, borderLeft:`2px solid ${acc}30` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:4 }}>
                <div>
                  <span style={{ fontSize:13, fontWeight:700, color: isDark?"#e2e8f0":txt }}>{exp.company}</span>
                  {exp.current && <span style={{ fontSize:9, marginLeft:6, padding:"1px 6px", borderRadius:99, background:"#dcfce7", color:"#15803d" }}>Current</span>}
                  <p style={{ fontSize:11, color:acc, margin:"1px 0" }}>{exp.position}</p>
                </div>
                <span style={{ fontSize:10, color:muted }}>{exp.duration}</span>
              </div>
              {exp.description && <p style={{ fontSize:11, color:muted, lineHeight:1.7, marginTop:4 }}>{exp.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* EDUCATION */}
      {enabled("education") && data.education.length>0 && (
        <Section title="Education" acc={acc} isDark={isDark} border={border}>
          {data.education.map(e=>(
            <div key={e.id} style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:4, marginBottom:6 }}>
              <div>
                <p style={{ fontSize:12, fontWeight:700, color: isDark?"#e2e8f0":txt, margin:0 }}>{e.degree}</p>
                <p style={{ fontSize:11, color:muted, margin:0 }}>{e.institution}</p>
              </div>
              <span style={{ fontSize:10, color:muted }}>{e.year}</span>
            </div>
          ))}
        </Section>
      )}

      {/* AWARDS */}
      {enabled("awards") && data.awards.length>0 && (
        <Section title="Achievements" acc={acc} isDark={isDark} border={border}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:8 }}>
            {data.awards.map(a=>(
              <div key={a.id} style={{ padding:"8px 10px", borderRadius:8, border:`1px solid ${border}`, background: isDark?"#1e293b":"#f9fafb" }}>
                <p style={{ fontSize:11, fontWeight:700, color: isDark?"#e2e8f0":txt, margin:"0 0 2px" }}>{a.title}</p>
                <p style={{ fontSize:10, color:acc, margin:"0 0 2px" }}>{a.org}</p>
                <p style={{ fontSize:10, color:muted, margin:0 }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, acc, isDark, border, children }) {
  return (
    <div style={{ marginBottom:18 }}>
      <h2 style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1.2, color:acc, margin:"0 0 10px", fontFamily:"Arial,sans-serif", borderBottom:`1px solid ${border}`, paddingBottom:4 }}>{title}</h2>
      {children}
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [state, dispatch] = useReducer(reducer, initState);
  const { previewMode, activePanel, sections, template, data } = state;
  const tmpl = TEMPLATES.find(t=>t.id===template)||TEMPLATES[0];

  const PANELS = [
    { id:"header",     label:"Header",     icon:<User size={14}/> },
    { id:"summary",    label:"Summary",    icon:<Mail size={14}/> },
    { id:"skills",     label:"Skills",     icon:<Code size={14}/> },
    { id:"experience", label:"Experience", icon:<Briefcase size={14}/> },
    { id:"education",  label:"Education",  icon:<Award size={14}/> },
    { id:"awards",     label:"Awards",     icon:<Award size={14}/> },
    { id:"config",     label:"Config",     icon:<Settings size={14}/> },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", background:"#f1f5f9", fontFamily:"Arial,sans-serif" }}>

      {/* TOP BAR */}
      <div style={{ background:"#1e293b", padding:"0 16px", height:48, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:tmpl.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:"#fff" }}>R</div>
          <span style={{ fontSize:14, fontWeight:700, color:"#f8fafc" }}>Resume Builder</span>
          <span style={{ fontSize:10, padding:"2px 8px", borderRadius:99, background:"rgba(99,102,241,0.3)", color:"#a5b4fc", marginLeft:4 }}>Redux Powered</span>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {/* Template switcher */}
          <div style={{ display:"flex", gap:4 }}>
            {TEMPLATES.map(t=>(
              <button key={t.id} onClick={()=>dispatch({type:"SET_TEMPLATE",payload:t.id})} title={t.label}
                style={{ width:22, height:22, borderRadius:"50%", background:t.accent, border: template===t.id?"2px solid #fff":"2px solid transparent", cursor:"pointer", transition:"all .15s" }}/>
            ))}
          </div>
          <button onClick={()=>dispatch({type:"TOGGLE_PREVIEW"})} style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:7, border:"1px solid #334155", background: previewMode?"#6366f1":"transparent", color: previewMode?"#fff":"#94a3b8", cursor:"pointer", fontSize:12 }}>
            {previewMode?<EyeOff size={13}/>:<Eye size={13}/>} {previewMode?"Edit":"Preview"}
          </button>
          <button onClick={()=>window.print()} style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:7, border:"none", background:"#6366f1", color:"#fff", cursor:"pointer", fontSize:12 }}>
            <Download size={13}/> Export PDF
          </button>
        </div>
      </div>

      {/* BODY */}
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {/* SIDEBAR */}
        {!previewMode && (
          <div style={{ width:48, background:"#1e293b", display:"flex", flexDirection:"column", alignItems:"center", paddingTop:10, gap:4, flexShrink:0, borderRight:"1px solid #334155" }}>
            {PANELS.map(p=>(
              <button key={p.id} onClick={()=>dispatch({type:"SET_PANEL",payload:p.id})} title={p.label}
                style={{ width:36, height:36, borderRadius:9, border:"none", background: activePanel===p.id?"#6366f1":"transparent", color: activePanel===p.id?"#fff":"#64748b", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>
                {p.icon}
              </button>
            ))}
          </div>
        )}

        {/* EDITOR PANEL */}
        {!previewMode && (
          <div style={{ width:280, background:"#ffffff", borderRight:"1px solid #e5e7eb", display:"flex", flexDirection:"column", flexShrink:0, overflow:"hidden" }}>
            <div style={{ padding:"12px 14px", borderBottom:"1px solid #f1f5f9", background:"#f8fafc" }}>
              <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:.8, color:"#6b7280", margin:0 }}>{PANELS.find(p=>p.id===activePanel)?.label}</p>
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:14 }}>
              {activePanel==="header"     && <HeaderPanel data={data.header} dispatch={dispatch}/>}
              {activePanel==="summary"    && <SummaryPanel data={data.summary} dispatch={dispatch}/>}
              {activePanel==="skills"     && <SkillsPanel data={data.skills} dispatch={dispatch}/>}
              {activePanel==="experience" && <ExperiencePanel data={data.experience} dispatch={dispatch}/>}
              {activePanel==="education"  && <EducationPanel data={data.education} dispatch={dispatch}/>}
              {activePanel==="awards"     && <AwardsPanel data={data.awards} dispatch={dispatch}/>}
              {activePanel==="config"     && (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <Label c="Toggle Sections"/>
                  {sections.map(s=>(
                    <label key={s.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 10px", borderRadius:8, border:"1px solid #e5e7eb", cursor: s.required?"default":"pointer" }}>
                      <span style={{ fontSize:12, color:"#374151" }}>{s.icon} {s.label}</span>
                      <div onClick={()=>dispatch({type:"TOGGLE_SECTION",payload:s.id})}
                        style={{ width:36, height:20, borderRadius:99, background: s.enabled?"#6366f1":"#d1d5db", position:"relative", cursor: s.required?"not-allowed":"pointer", transition:"all .2s", opacity: s.required?.6:1 }}>
                        <div style={{ width:14, height:14, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left: s.enabled?18:3, transition:"all .2s" }}/>
                      </div>
                    </label>
                  ))}
                  <div style={{ marginTop:8 }}>
                    <Label c="Template"/>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                      {TEMPLATES.map(t=>(
                        <button key={t.id} onClick={()=>dispatch({type:"SET_TEMPLATE",payload:t.id})}
                          style={{ padding:"7px 8px", borderRadius:8, border: template===t.id?`2px solid ${t.accent}`:"1px solid #e5e7eb", background: template===t.id?t.accent+"18":"#f9fafb", color: template===t.id?t.accent:"#374151", cursor:"pointer", fontSize:11, fontWeight: template===t.id?700:400 }}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RESUME PREVIEW */}
        <div style={{ flex:1, overflow:"auto", background:"#e2e8f0", padding:20 }}>
          <div style={{ maxWidth:760, margin:"0 auto", background:"#fff", borderRadius:8, boxShadow:"0 4px 24px rgba(0,0,0,0.12)", overflow:"hidden", minHeight:900 }}>
            <ResumePreview state={state}/>
          </div>
        </div>
      </div>
    </div>
  );
}
