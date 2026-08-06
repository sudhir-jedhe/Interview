import { useState, useReducer, useEffect, useCallback } from "react";
import { Plus, Trash2, Download, Eye, EyeOff, Save, RefreshCw, Server, CheckCircle, AlertCircle, Loader, Settings, User, Briefcase, Code, Award, Mail } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// 🟢 SIMULATED NODE.JS / EXPRESS REST API (in-memory)
// In a real app this would be: Express + MongoDB running on localhost:5000
// ─────────────────────────────────────────────────────────────────────────────
const DB = { resumes: {} };
let idCounter = 1;

const simulateDelay = (ms = 400) => new Promise(r => setTimeout(r, ms));

const expressRouter = {
  // GET /api/resumes
  async getAll() {
    await simulateDelay(300);
    return { status: 200, data: Object.values(DB.resumes) };
  },
  // GET /api/resumes/:id
  async getById(id) {
    await simulateDelay(250);
    const resume = DB.resumes[id];
    if (!resume) return { status: 404, data: { message: "Resume not found" } };
    return { status: 200, data: resume };
  },
  // POST /api/resumes
  async create(body) {
    await simulateDelay(400);
    const id = `resume_${idCounter++}`;
    const resume = { ...body, _id: id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    DB.resumes[id] = resume;
    return { status: 201, data: resume };
  },
  // PUT /api/resumes/:id
  async update(id, body) {
    await simulateDelay(350);
    if (!DB.resumes[id]) return { status: 404, data: { message: "Resume not found" } };
    DB.resumes[id] = { ...DB.resumes[id], ...body, updatedAt: new Date().toISOString() };
    return { status: 200, data: DB.resumes[id] };
  },
  // DELETE /api/resumes/:id
  async delete(id) {
    await simulateDelay(300);
    if (!DB.resumes[id]) return { status: 404, data: { message: "Resume not found" } };
    delete DB.resumes[id];
    return { status: 200, data: { message: "Resume deleted successfully" } };
  },
};

// API client (mirrors fetch calls to a real Express server)
const API = {
  async get(path) {
    const id = path.split("/")[3];
    return id ? expressRouter.getById(id) : expressRouter.getAll();
  },
  async post(path, body) { return expressRouter.create(body); },
  async put(path, body) { return expressRouter.update(path.split("/")[3], body); },
  async delete(path) { return expressRouter.delete(path.split("/")[3]); },
};

// ─────────────────────────────────────────────────────────────────────────────
// SKILL CATALOG
// ─────────────────────────────────────────────────────────────────────────────
const SKILL_CATALOG = {
  "⚛️ Frontend":    ["React JS","TypeScript","JavaScript","HTML5","CSS3","SASS","Next JS"],
  "🔄 State Mgmt":  ["Redux","Redux-Toolkit","Context API","React Hooks"],
  "🎭 Automation":  ["Playwright","Selenium","Cypress","Puppeteer"],
  "🧪 Testing":     ["Jest","React Testing Library","Enzyme","Storybook"],
  "⚙️ Backend":     ["Node JS","Express JS","MongoDB","REST APIs","JWT"],
};

const SECTION_CONFIG = [
  { id:"header",     label:"Header",     enabled:true,  required:true  },
  { id:"summary",    label:"Summary",    enabled:true,  required:false },
  { id:"skills",     label:"Skills",     enabled:true,  required:false },
  { id:"experience", label:"Experience", enabled:true,  required:false },
  { id:"education",  label:"Education",  enabled:true,  required:false },
  { id:"awards",     label:"Awards",     enabled:true,  required:false },
];

const TEMPLATES = [
  { id:"modern",  label:"Modern",  accent:"#6366f1" },
  { id:"dark",    label:"Dark",    accent:"#10b981" },
  { id:"minimal", label:"Minimal", accent:"#374151" },
  { id:"bold",    label:"Bold",    accent:"#ec4899" },
];

const initData = {
  title: "My Resume",
  template: "modern",
  sections: SECTION_CONFIG,
  header: { name:"Sudhir A. Jedhe", title:"Senior React JS Developer | Project Lead | MERN Stack", email:"jedhesudhir@gmail.com", phone:"8551873835", location:"India", linkedin:"linkedin.com/in/sudhirjedhe" },
  summary: "Senior React JS Developer and Project Lead with 10+ years of experience building scalable web applications across fintech, banking, insurance, government, and e-learning domains.",
  skills: {
    "⚛️ Frontend":   ["React JS","TypeScript","JavaScript","HTML5","CSS3"],
    "🔄 State Mgmt": ["Redux","Redux-Toolkit","React Hooks"],
    "🎭 Automation": ["Playwright","Selenium"],
    "🧪 Testing":    ["Jest","React Testing Library"],
    "⚙️ Backend":    ["Node JS","Express JS","MongoDB","REST APIs"],
  },
  experience: [
    { id:1, company:"Persistent Systems", position:"Project Lead", duration:"Jan 2025 – Till Date", current:true, description:"Led teams for Microsoft (NYC OTI My City) and Intuit (TurboTax & QBO). Built Playwright automation and snapshot testing framework." },
    { id:2, company:"HSBC Technology India", position:"Consultant Specialist", duration:"Feb 2023 – Dec 2023", current:false, description:"Built CCAT platform. Developed global UI library, Redux integration, RESTful APIs with Node.js." },
  ],
  education: [{ id:1, degree:"BE Computer Engineering", institution:"University of Pune", year:"2012" }],
  awards: [
    { id:1, title:"2x Spot Award", org:"MITR Learning Media", desc:"Completing tasks on time" },
    { id:2, title:"Team of the Month", org:"Hurix Digital", desc:"Outstanding contribution" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// REDUX REDUCER
// ─────────────────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case "SET_TEMPLATE":    return { ...state, template: action.payload };
    case "SET_TITLE":       return { ...state, title: action.payload };
    case "TOGGLE_SECTION":  return { ...state, sections: state.sections.map(s => s.id === action.payload && !s.required ? { ...s, enabled: !s.enabled } : s) };
    case "UPDATE_HEADER":   return { ...state, header: { ...state.header, [action.key]: action.value } };
    case "UPDATE_SUMMARY":  return { ...state, summary: action.payload };
    case "TOGGLE_SKILL": {
      const cat = action.category, skill = action.skill;
      const curr = state.skills[cat] || [];
      return { ...state, skills: { ...state.skills, [cat]: curr.includes(skill) ? curr.filter(s => s !== skill) : [...curr, skill] } };
    }
    case "ADD_EXP":    return { ...state, experience: [...state.experience, { id: Date.now(), company:"", position:"", duration:"", current:false, description:"" }] };
    case "UPDATE_EXP": return { ...state, experience: state.experience.map(e => e.id === action.id ? { ...e, [action.key]: action.value } : e) };
    case "REMOVE_EXP": return { ...state, experience: state.experience.filter(e => e.id !== action.id) };
    case "ADD_AWARD":    return { ...state, awards: [...state.awards, { id: Date.now(), title:"", org:"", desc:"" }] };
    case "UPDATE_AWARD": return { ...state, awards: state.awards.map(a => a.id === action.id ? { ...a, [action.key]: action.value } : a) };
    case "REMOVE_AWARD": return { ...state, awards: state.awards.filter(a => a.id !== action.id) };
    case "LOAD_RESUME":  return { ...action.payload, _id: action.payload._id };
    case "SET_ID":       return { ...state, _id: action.payload };
    default: return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SMALL UI HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const inp = (extra = {}) => ({ padding:"7px 10px", borderRadius:7, border:"1px solid #d1d5db", fontSize:12, width:"100%", outline:"none", background:"#fff", color:"#111827", boxSizing:"border-box", ...extra });
const Label = ({ c }) => <label style={{ fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:.5, display:"block", marginBottom:4 }}>{c}</label>;

// ─────────────────────────────────────────────────────────────────────────────
// API LOG COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function ApiLog({ logs }) {
  const methodColor = { GET:"#10b981", POST:"#6366f1", PUT:"#f59e0b", DELETE:"#ef4444" };
  return (
    <div style={{ background:"#0f172a", borderRadius:10, padding:12, fontFamily:"monospace", fontSize:11, maxHeight:180, overflowY:"auto" }}>
      <div style={{ color:"#64748b", marginBottom:8, fontSize:10, fontWeight:700, letterSpacing:1 }}>▶ EXPRESS SERVER LOG</div>
      {logs.length === 0 && <div style={{ color:"#475569" }}>Waiting for requests...</div>}
      {logs.map((log, i) => (
        <div key={i} style={{ marginBottom:5, display:"flex", gap:8, alignItems:"flex-start", borderBottom:"1px solid #1e293b", paddingBottom:5 }}>
          <span style={{ color: methodColor[log.method] || "#94a3b8", fontWeight:700, minWidth:50 }}>{log.method}</span>
          <span style={{ color:"#94a3b8" }}>{log.path}</span>
          <span style={{ color: log.status < 300 ? "#10b981" : "#ef4444", marginLeft:"auto" }}>{log.status}</span>
          <span style={{ color:"#475569", fontSize:10 }}>{log.time}ms</span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SAVED RESUMES LIST
// ─────────────────────────────────────────────────────────────────────────────
function SavedList({ resumes, onLoad, onDelete, loading }) {
  if (resumes.length === 0) return <div style={{ fontSize:12, color:"#9ca3af", padding:"12px 0" }}>No saved resumes yet.</div>;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      {resumes.map(r => (
        <div key={r._id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 10px", borderRadius:8, border:"1px solid #e5e7eb", background:"#f9fafb" }}>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:"#374151" }}>{r.title || "Untitled"}</div>
            <div style={{ fontSize:10, color:"#9ca3af" }}>ID: {r._id} · {new Date(r.updatedAt).toLocaleTimeString()}</div>
          </div>
          <div style={{ display:"flex", gap:5 }}>
            <button onClick={() => onLoad(r._id)} disabled={loading} style={{ fontSize:11, padding:"4px 9px", borderRadius:6, border:"1px solid #6366f1", background:"#eef2ff", color:"#4338ca", cursor:"pointer" }}>Load</button>
            <button onClick={() => onDelete(r._id)} disabled={loading} style={{ fontSize:11, padding:"4px 9px", borderRadius:6, border:"1px solid #fee2e2", background:"#fee2e2", color:"#b91c1c", cursor:"pointer" }}><Trash2 size={11}/></button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESUME PREVIEW
// ─────────────────────────────────────────────────────────────────────────────
function ResumePreview({ state }) {
  const tmpl = TEMPLATES.find(t => t.id === state.template) || TEMPLATES[0];
  const isDark = state.template === "dark";
  const bg = isDark ? "#0f172a" : "#ffffff";
  const txt = isDark ? "#f1f5f9" : "#1f2937";
  const muted = isDark ? "#94a3b8" : "#6b7280";
  const border = isDark ? "#334155" : "#e5e7eb";
  const acc = tmpl.accent;
  const enabled = id => state.sections.find(s => s.id === id)?.enabled;

  const Sec = ({ title, children }) => (
    <div style={{ marginBottom:16 }}>
      <h2 style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1.2, color:acc, margin:"0 0 8px", borderBottom:`1px solid ${border}`, paddingBottom:4 }}>{title}</h2>
      {children}
    </div>
  );

  return (
    <div style={{ background:bg, padding:24, fontFamily:"Georgia, serif", color:txt, fontSize:12, minHeight:"100%" }}>
      {enabled("header") && (
        <div style={{ borderBottom:`3px solid ${acc}`, paddingBottom:14, marginBottom:16 }}>
          <h1 style={{ fontSize:20, fontWeight:700, color: isDark ? "#fff" : acc, margin:"0 0 3px", fontFamily:"Arial" }}>{state.header.name}</h1>
          <p style={{ fontSize:11, color:muted, margin:"0 0 8px", fontFamily:"Arial" }}>{state.header.title}</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
            {[["📞",state.header.phone],["📧",state.header.email],["📍",state.header.location],["🔗",state.header.linkedin]].map(([icon,val],i) =>
              val && <span key={i} style={{ fontSize:10, color:muted }}>{icon} {val}</span>
            )}
          </div>
        </div>
      )}
      {enabled("summary") && state.summary && (
        <Sec title="Summary"><p style={{ fontSize:11, lineHeight:1.8, color:muted, margin:0 }}>{state.summary}</p></Sec>
      )}
      {enabled("skills") && (
        <Sec title="Skills">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:8 }}>
            {Object.entries(state.skills).map(([cat, tags]) => tags.length > 0 && (
              <div key={cat}>
                <p style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", color:acc, marginBottom:4, letterSpacing:.5 }}>{cat}</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
                  {tags.map(t => <span key={t} style={{ fontSize:9, padding:"2px 6px", borderRadius:99, background: isDark?"#1e293b":"#f3f4f6", color: isDark?"#c7d2fe":acc, border:`1px solid ${border}` }}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </Sec>
      )}
      {enabled("experience") && state.experience.length > 0 && (
        <Sec title="Experience">
          {state.experience.map((exp, i) => (
            <div key={exp.id} style={{ marginBottom: i < state.experience.length-1 ? 12 : 0, paddingLeft:10, borderLeft:`2px solid ${acc}40` }}>
              <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:4 }}>
                <div>
                  <span style={{ fontSize:12, fontWeight:700, color: isDark?"#e2e8f0":txt }}>{exp.company}</span>
                  {exp.current && <span style={{ fontSize:9, marginLeft:6, padding:"1px 6px", borderRadius:99, background:"#dcfce7", color:"#15803d" }}>Current</span>}
                  <p style={{ fontSize:10, color:acc, margin:"1px 0" }}>{exp.position}</p>
                </div>
                <span style={{ fontSize:10, color:muted }}>{exp.duration}</span>
              </div>
              {exp.description && <p style={{ fontSize:10, color:muted, lineHeight:1.7, marginTop:3 }}>{exp.description}</p>}
            </div>
          ))}
        </Sec>
      )}
      {enabled("education") && state.education.length > 0 && (
        <Sec title="Education">
          {state.education.map(e => (
            <div key={e.id} style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:4, marginBottom:4 }}>
              <div>
                <p style={{ fontSize:11, fontWeight:700, color: isDark?"#e2e8f0":txt, margin:0 }}>{e.degree}</p>
                <p style={{ fontSize:10, color:muted, margin:0 }}>{e.institution}</p>
              </div>
              <span style={{ fontSize:10, color:muted }}>{e.year}</span>
            </div>
          ))}
        </Sec>
      )}
      {enabled("awards") && state.awards.length > 0 && (
        <Sec title="Achievements">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:8 }}>
            {state.awards.map(a => (
              <div key={a.id} style={{ padding:"7px 9px", borderRadius:7, border:`1px solid ${border}`, background: isDark?"#1e293b":"#f9fafb" }}>
                <p style={{ fontSize:11, fontWeight:700, color: isDark?"#e2e8f0":txt, margin:"0 0 1px" }}>{a.title}</p>
                <p style={{ fontSize:9, color:acc, margin:"0 0 1px" }}>{a.org}</p>
                <p style={{ fontSize:9, color:muted, margin:0 }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </Sec>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [state, dispatch] = useReducer(reducer, initData);
  const [panel, setPanel] = useState("header");
  const [preview, setPreview] = useState(false);
  const [logs, setLogs] = useState([]);
  const [apiStatus, setApiStatus] = useState(null); // null | "loading" | "success" | "error"
  const [apiMsg, setApiMsg] = useState("");
  const [savedResumes, setSavedResumes] = useState([]);
  const [showApi, setShowApi] = useState(true);
  const [expOpen, setExpOpen] = useState(null);

  const logRequest = useCallback((method, path, status, time) => {
    setLogs(prev => [{ method, path, status, time }, ...prev.slice(0, 19)]);
  }, []);

  const callApi = useCallback(async (method, path, body = null) => {
    const start = Date.now();
    setApiStatus("loading");
    try {
      const res = await API[method.toLowerCase()](path, body);
      logRequest(method, path, res.status, Date.now() - start);
      setApiStatus(res.status < 300 ? "success" : "error");
      setApiMsg(res.status < 300 ? "✓ " + method + " " + path : "✗ " + res.data.message);
      setTimeout(() => setApiStatus(null), 2500);
      return res;
    } catch(e) {
      setApiStatus("error"); setApiMsg("Network error");
      setTimeout(() => setApiStatus(null), 2500);
      return null;
    }
  }, [logRequest]);

  // Save resume
  const handleSave = async () => {
    const body = { ...state, _id: undefined };
    if (state._id) {
      await callApi("PUT", `/api/resumes/${state._id}`, body);
    } else {
      const res = await callApi("POST", `/api/resumes`, body);
      if (res?.data?._id) dispatch({ type:"SET_ID", payload: res.data._id });
    }
  };

  // Load all
  const handleLoadAll = async () => {
    const res = await callApi("GET", "/api/resumes");
    if (res?.data) setSavedResumes(res.data);
  };

  // Load one
  const handleLoad = async (id) => {
    const res = await callApi("GET", `/api/resumes/${id}`);
    if (res?.data) dispatch({ type:"LOAD_RESUME", payload: res.data });
  };

  // Delete
  const handleDelete = async (id) => {
    await callApi("DELETE", `/api/resumes/${id}`);
    setSavedResumes(prev => prev.filter(r => r._id !== id));
  };

  const tmpl = TEMPLATES.find(t => t.id === state.template) || TEMPLATES[0];

  const PANELS = [
    { id:"header", label:"Header", icon:<User size={13}/> },
    { id:"summary", label:"Summary", icon:<Mail size={13}/> },
    { id:"skills", label:"Skills", icon:<Code size={13}/> },
    { id:"experience", label:"Experience", icon:<Briefcase size={13}/> },
    { id:"awards", label:"Awards", icon:<Award size={13}/> },
    { id:"api", label:"API", icon:<Server size={13}/> },
    { id:"config", label:"Config", icon:<Settings size={13}/> },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", fontFamily:"Arial,sans-serif", background:"#f1f5f9", overflow:"hidden" }}>

      {/* TOP BAR */}
      <div style={{ background:"#1e293b", padding:"0 16px", height:48, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:tmpl.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:"#fff" }}>R</div>
          <span style={{ fontSize:14, fontWeight:700, color:"#f8fafc" }}>Resume Builder</span>
          <span style={{ fontSize:10, padding:"2px 7px", borderRadius:99, background:"rgba(16,185,129,0.2)", color:"#6ee7b7" }}>Node.js + Express</span>
          <span style={{ fontSize:10, padding:"2px 7px", borderRadius:99, background:"rgba(99,102,241,0.2)", color:"#a5b4fc" }}>Redux</span>
          {state._id && <span style={{ fontSize:10, color:"#64748b" }}>ID: {state._id}</span>}
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          {/* API status */}
          {apiStatus === "loading" && <Loader size={14} color="#f59e0b" style={{ animation:"spin 1s linear infinite" }}/>}
          {apiStatus === "success" && <span style={{ fontSize:11, color:"#10b981", display:"flex", alignItems:"center", gap:3 }}><CheckCircle size={12}/>{apiMsg}</span>}
          {apiStatus === "error"   && <span style={{ fontSize:11, color:"#ef4444", display:"flex", alignItems:"center", gap:3 }}><AlertCircle size={12}/>{apiMsg}</span>}
          {/* Template dots */}
          <div style={{ display:"flex", gap:4 }}>
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => dispatch({ type:"SET_TEMPLATE", payload:t.id })} title={t.label}
                style={{ width:18, height:18, borderRadius:"50%", background:t.accent, border: state.template===t.id?"2px solid #fff":"2px solid transparent", cursor:"pointer" }}/>
            ))}
          </div>
          <button onClick={handleSave} style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 10px", borderRadius:7, border:"none", background:"#10b981", color:"#fff", cursor:"pointer", fontSize:12 }}>
            <Save size={12}/> {state._id ? "PUT /update" : "POST /save"}
          </button>
          <button onClick={() => setPreview(!preview)} style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 10px", borderRadius:7, border:"1px solid #334155", background: preview?"#6366f1":"transparent", color: preview?"#fff":"#94a3b8", cursor:"pointer", fontSize:12 }}>
            {preview ? <EyeOff size={12}/> : <Eye size={12}/>} {preview ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      {/* BODY */}
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {/* ICON SIDEBAR */}
        {!preview && (
          <div style={{ width:46, background:"#1e293b", display:"flex", flexDirection:"column", alignItems:"center", paddingTop:8, gap:3, flexShrink:0 }}>
            {PANELS.map(p => (
              <button key={p.id} onClick={() => setPanel(p.id)} title={p.label}
                style={{ width:34, height:34, borderRadius:8, border:"none", background: panel===p.id?"#6366f1":"transparent", color: panel===p.id?"#fff":"#64748b", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>
                {p.icon}
              </button>
            ))}
          </div>
        )}

        {/* EDITOR */}
        {!preview && (
          <div style={{ width:270, background:"#fff", borderRight:"1px solid #e5e7eb", display:"flex", flexDirection:"column", flexShrink:0, overflow:"hidden" }}>
            <div style={{ padding:"10px 14px", borderBottom:"1px solid #f1f5f9", background:"#f8fafc" }}>
              <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:.8, color:"#6b7280", margin:0 }}>{PANELS.find(p => p.id===panel)?.label}</p>
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:14 }}>

              {/* HEADER PANEL */}
              {panel === "header" && (
                <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                  <div><Label c="Resume Title"/><input style={inp()} value={state.title} onChange={e => dispatch({ type:"SET_TITLE", payload:e.target.value })}/></div>
                  {[["name","Full Name"],["title","Job Title"],["email","Email"],["phone","Phone"],["location","Location"],["linkedin","LinkedIn"]].map(([k,l]) => (
                    <div key={k}><Label c={l}/><input style={inp()} value={state.header[k]} onChange={e => dispatch({ type:"UPDATE_HEADER", key:k, value:e.target.value })}/></div>
                  ))}
                </div>
              )}

              {/* SUMMARY PANEL */}
              {panel === "summary" && (
                <div>
                  <Label c="Professional Summary"/>
                  <textarea style={{ ...inp(), height:130, resize:"vertical", lineHeight:1.6 }} value={state.summary} onChange={e => dispatch({ type:"UPDATE_SUMMARY", payload:e.target.value })}/>
                  <p style={{ fontSize:10, color:"#9ca3af", marginTop:3 }}>{state.summary.length} chars</p>
                </div>
              )}

              {/* SKILLS PANEL */}
              {panel === "skills" && (
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {Object.entries(SKILL_CATALOG).map(([cat, skills]) => (
                    <div key={cat}>
                      <Label c={cat}/>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                        {skills.map(s => {
                          const sel = (state.skills[cat] || []).includes(s);
                          return (
                            <button key={s} onClick={() => dispatch({ type:"TOGGLE_SKILL", category:cat, skill:s })}
                              style={{ fontSize:10, padding:"3px 8px", borderRadius:99, border:`1px solid ${sel?"#6366f1":"#d1d5db"}`, background:sel?"#eef2ff":"#f9fafb", color:sel?"#4338ca":"#374151", cursor:"pointer", fontWeight:sel?700:400 }}>
                              {sel ? "✓ " : ""}{s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* EXPERIENCE PANEL */}
              {panel === "experience" && (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {state.experience.map(exp => (
                    <div key={exp.id} style={{ border:"1px solid #e5e7eb", borderRadius:9, overflow:"hidden" }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 11px", background:"#f9fafb", cursor:"pointer" }} onClick={() => setExpOpen(expOpen === exp.id ? null : exp.id)}>
                        <span style={{ fontSize:12, fontWeight:600, color:"#374151" }}>{exp.company || "New"}</span>
                        <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                          <button onClick={e => { e.stopPropagation(); dispatch({ type:"REMOVE_EXP", id:exp.id }); }} style={{ background:"none", border:"none", cursor:"pointer", color:"#ef4444", padding:1 }}><Trash2 size={12}/></button>
                        </div>
                      </div>
                      {expOpen === exp.id && (
                        <div style={{ padding:11, display:"flex", flexDirection:"column", gap:7 }}>
                          {[["company","Company"],["position","Position"],["duration","Duration"]].map(([k,l]) => (
                            <div key={k}><Label c={l}/><input style={inp()} value={exp[k]} onChange={e => dispatch({ type:"UPDATE_EXP", id:exp.id, key:k, value:e.target.value })}/></div>
                          ))}
                          <div><Label c="Description"/><textarea style={{ ...inp(), height:70, resize:"vertical" }} value={exp.description} onChange={e => dispatch({ type:"UPDATE_EXP", id:exp.id, key:"description", value:e.target.value })}/></div>
                          <label style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#374151", cursor:"pointer" }}>
                            <input type="checkbox" checked={exp.current} onChange={e => dispatch({ type:"UPDATE_EXP", id:exp.id, key:"current", value:e.target.checked })}/> Currently working here
                          </label>
                        </div>
                      )}
                    </div>
                  ))}
                  <button onClick={() => dispatch({ type:"ADD_EXP" })} style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 11px", border:"1px dashed #d1d5db", borderRadius:8, background:"none", cursor:"pointer", color:"#6366f1", fontSize:12, fontWeight:600 }}>
                    <Plus size={12}/> Add Experience
                  </button>
                </div>
              )}

              {/* AWARDS PANEL */}
              {panel === "awards" && (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {state.awards.map(a => (
                    <div key={a.id} style={{ border:"1px solid #e5e7eb", borderRadius:9, padding:11 }}>
                      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:5 }}>
                        <button onClick={() => dispatch({ type:"REMOVE_AWARD", id:a.id })} style={{ background:"none", border:"none", cursor:"pointer", color:"#ef4444" }}><Trash2 size={12}/></button>
                      </div>
                      {[["title","Award Title"],["org","Organization"],["desc","Description"]].map(([k,l]) => (
                        <div key={k} style={{ marginBottom:6 }}><Label c={l}/><input style={inp()} value={a[k]} onChange={e => dispatch({ type:"UPDATE_AWARD", id:a.id, key:k, value:e.target.value })}/></div>
                      ))}
                    </div>
                  ))}
                  <button onClick={() => dispatch({ type:"ADD_AWARD" })} style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 11px", border:"1px dashed #d1d5db", borderRadius:8, background:"none", cursor:"pointer", color:"#6366f1", fontSize:12, fontWeight:600 }}>
                    <Plus size={12}/> Add Award
                  </button>
                </div>
              )}

              {/* API PANEL */}
              {panel === "api" && (
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  <div style={{ background:"#0f172a", borderRadius:10, padding:12 }}>
                    <p style={{ fontSize:10, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:1, margin:"0 0 8px" }}>Express Routes</p>
                    {[
                      ["GET",    "/api/resumes",        "Get all resumes"],
                      ["GET",    "/api/resumes/:id",    "Get by ID"],
                      ["POST",   "/api/resumes",        "Create resume"],
                      ["PUT",    "/api/resumes/:id",    "Update resume"],
                      ["DELETE", "/api/resumes/:id",    "Delete resume"],
                    ].map(([m, path, desc]) => (
                      <div key={path+m} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
                        <span style={{ fontSize:9, padding:"1px 5px", borderRadius:4, background: m==="GET"?"#064e3b":m==="POST"?"#1e1b4b":m==="PUT"?"#78350f":"#450a0a", color: m==="GET"?"#6ee7b7":m==="POST"?"#a5b4fc":m==="PUT"?"#fde68a":"#fca5a5", fontWeight:700, minWidth:46, textAlign:"center" }}>{m}</span>
                        <span style={{ fontSize:10, color:"#94a3b8", fontFamily:"monospace" }}>{path}</span>
                        <span style={{ fontSize:9, color:"#475569", marginLeft:"auto" }}>{desc}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    <button onClick={handleSave} style={{ display:"flex", alignItems:"center", gap:5, padding:"8px 11px", borderRadius:8, border:"none", background:"#6366f1", color:"#fff", cursor:"pointer", fontSize:12, fontWeight:600 }}>
                      <Save size={12}/> {state._id ? "PUT – Update Resume" : "POST – Save Resume"}
                    </button>
                    <button onClick={handleLoadAll} style={{ display:"flex", alignItems:"center", gap:5, padding:"8px 11px", borderRadius:8, border:"1px solid #d1d5db", background:"#f9fafb", color:"#374151", cursor:"pointer", fontSize:12 }}>
                      <RefreshCw size={12}/> GET – Load All Resumes
                    </button>
                  </div>
                  <SavedList resumes={savedResumes} onLoad={handleLoad} onDelete={handleDelete} loading={apiStatus==="loading"}/>
                  <div>
                    <p style={{ fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>Server Log</p>
                    <ApiLog logs={logs}/>
                  </div>
                </div>
              )}

              {/* CONFIG PANEL */}
              {panel === "config" && (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <Label c="Sections"/>
                  {state.sections.map(s => (
                    <label key={s.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 10px", borderRadius:8, border:"1px solid #e5e7eb", cursor: s.required?"default":"pointer" }}>
                      <span style={{ fontSize:12, color:"#374151" }}>{s.label} {s.required && <span style={{ fontSize:9, color:"#9ca3af" }}>(required)</span>}</span>
                      <div onClick={() => dispatch({ type:"TOGGLE_SECTION", payload:s.id })}
                        style={{ width:34, height:18, borderRadius:99, background: s.enabled?"#6366f1":"#d1d5db", position:"relative", cursor: s.required?"not-allowed":"pointer", transition:"all .2s", opacity: s.required?.5:1 }}>
                        <div style={{ width:12, height:12, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left: s.enabled?18:3, transition:"all .2s" }}/>
                      </div>
                    </label>
                  ))}
                  <Label c="Template"/>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                    {TEMPLATES.map(t => (
                      <button key={t.id} onClick={() => dispatch({ type:"SET_TEMPLATE", payload:t.id })}
                        style={{ padding:"7px 8px", borderRadius:8, border: state.template===t.id?`2px solid ${t.accent}`:"1px solid #e5e7eb", background: state.template===t.id?t.accent+"18":"#f9fafb", color: state.template===t.id?t.accent:"#374151", cursor:"pointer", fontSize:11, fontWeight: state.template===t.id?700:400 }}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RESUME PREVIEW PANE */}
        <div style={{ flex:1, overflow:"auto", background:"#e2e8f0", padding:16 }}>
          <div style={{ maxWidth:740, margin:"0 auto", background:"#fff", borderRadius:8, boxShadow:"0 4px 24px rgba(0,0,0,0.12)", overflow:"hidden", minHeight:840 }}>
            <ResumePreview state={state}/>
          </div>
        </div>
      </div>
    </div>
  );
}
