import { useState } from "react";
import { User, Briefcase, FileText, LogOut, Plus, Trash2, Eye, CheckCircle, Clock, Bell, Search, BarChart2, Users, Shield, ToggleLeft, ToggleRight, Star, MapPin, DollarSign, Calendar, Send } from "lucide-react";

// ── DATA ─────────────────────────────────────────────────────────────────────
const USERS = {
  admin:    { _id:"1", name:"Admin User",   email:"admin@portal.com", role:"admin",     avatar:"AU" },
  employer: { _id:"2", name:"TechCorp HR",  email:"hr@techcorp.com",  role:"employer",  avatar:"TC", company:"TechCorp" },
  jobseeker:{ _id:"3", name:"Sudhir Jedhe", email:"sudhir@gmail.com", role:"jobseeker", avatar:"SJ" },
};

const INIT_JOBS = [
  { _id:"j1", title:"Senior React Developer",    company:"TechCorp",   location:"Pune",      type:"full-time", salary:{min:15,max:25}, skills:["React JS","TypeScript","Redux"],   experience:"5+ yrs", isActive:true,  postedBy:"2", applicants:12, deadline:"2025-07-01" },
  { _id:"j2", title:"Node.js Backend Engineer",  company:"TechCorp",   location:"Remote",    type:"remote",    salary:{min:12,max:20}, skills:["Node JS","Express","MongoDB"],     experience:"3+ yrs", isActive:true,  postedBy:"2", applicants:8,  deadline:"2025-07-15" },
  { _id:"j3", title:"Playwright QA Engineer",    company:"InnoSoft",   location:"Bangalore", type:"full-time", salary:{min:10,max:18}, skills:["Playwright","Jest","TypeScript"],  experience:"2+ yrs", isActive:false, postedBy:"4", applicants:5,  deadline:"2025-06-30" },
  { _id:"j4", title:"Full Stack MERN Developer", company:"StartupXYZ", location:"Mumbai",    type:"contract",  salary:{min:8, max:15}, skills:["React JS","Node JS","MongoDB"],    experience:"2+ yrs", isActive:true,  postedBy:"4", applicants:20, deadline:"2025-07-20" },
];

const INIT_USERS = [
  { _id:"2", name:"TechCorp HR",  email:"hr@techcorp.com",  role:"employer",  isActive:true,  company:"TechCorp", joinDate:"2025-01-10" },
  { _id:"3", name:"Sudhir Jedhe", email:"sudhir@gmail.com", role:"jobseeker", isActive:true,  joinDate:"2025-02-15" },
  { _id:"4", name:"InnoSoft HR",  email:"hr@innosoft.com",  role:"employer",  isActive:false, company:"InnoSoft",  joinDate:"2025-03-01" },
  { _id:"5", name:"Priya Sharma", email:"priya@gmail.com",  role:"jobseeker", isActive:true,  joinDate:"2025-04-20" },
];

const INIT_APPS = [
  { _id:"a1", job:{title:"Senior React Developer",    company:"TechCorp"},   status:"pending",     appliedAt:"2025-06-10", applicant:{name:"Sudhir Jedhe", avatar:"SJ"} },
  { _id:"a2", job:{title:"Node.js Backend Engineer",  company:"TechCorp"},   status:"shortlisted", appliedAt:"2025-06-08", applicant:{name:"Priya Sharma",  avatar:"PS"} },
  { _id:"a3", job:{title:"Full Stack MERN Developer", company:"StartupXYZ"}, status:"reviewed",    appliedAt:"2025-06-12", applicant:{name:"Ravi Kumar",    avatar:"RK"} },
];

const RESUME_DATA = {
  name:"Sudhir A. Jedhe", title:"Senior React JS Developer | Project Lead | MERN Stack | Playwright Automation",
  email:"jedhesudhir@gmail.com", phone:"8551873835", location:"India", linkedin:"linkedin.com/in/sudhirjedhe",
  summary:"Senior React JS Developer and Project Lead with 10+ years of experience building scalable, high-performance web applications across fintech, banking, insurance, government, and e-learning domains. Expert in React JS, Redux, TypeScript, MERN Stack, Playwright automation, and AI-augmented development (Cursor, Claude).",
  skills:{
    "⚛️ Frontend":   ["React JS","TypeScript","JavaScript","HTML5","CSS3","SASS","Next JS"],
    "🔄 State Mgmt": ["Redux","Redux-Toolkit","Context API","React Hooks"],
    "🎭 Automation": ["Playwright","Selenium","Cypress","Puppeteer"],
    "🧪 Testing":    ["Jest","React Testing Library","Enzyme","Storybook"],
    "⚙️ Backend":    ["Node JS","Express JS","MongoDB","REST APIs","JWT"],
  },
  experience:[
    { id:1, company:"Persistent Systems",   position:"Project Lead",           duration:"Jan 2025 – Till Date", current:true,  description:"Led teams for Microsoft (NYC OTI My City — WCAG govt app) and Intuit (TurboTax & QBO ICC Credit Card — Playwright E2E automation, snapshot testing, CI/CD)." },
    { id:2, company:"Tachyon Tech",          position:"Senior Software Engineer",duration:"Jul 2024 – Nov 2024",  current:false, description:"Built React components for Woolworths product pages. Unit tests with Jest & RTL. Applied Sass for responsive design." },
    { id:3, company:"HSBC Technology India", position:"Consultant Specialist",   duration:"Feb 2023 – Dec 2023",  current:false, description:"CCAT platform for mutual fund custody. Global UI library, Redux state management, RESTful APIs with Node.js & MongoDB." },
    { id:4, company:"Capgemini",             position:"Consultant Specialist",   duration:"Oct 2021 – Jan 2023",  current:false, description:"OPOE insurance portal for Prudential. Global UI library with form elements and RESTful APIs using Node.js & Express." },
  ],
  education:[{ id:1, degree:"BE Computer Engineering", institution:"University of Pune", year:"2012" }],
  awards:[
    { id:1, title:"2x Spot Award",        org:"MITR Learning Media",    desc:"Completing tasks on time" },
    { id:2, title:"Team of the Month",    org:"Hurix Digital",           desc:"Outstanding team contribution" },
    { id:3, title:"Open Source Contributor", org:"createjs-accessibility", desc:"Accessibility library" },
  ],
};

const RESUME_TEMPLATES = [
  { id:"modern",   label:"Modern",   accent:"#4f46e5", headerBg:"linear-gradient(135deg,#1e3a8a,#4f46e5)", dark:false },
  { id:"dark",     label:"Dark Pro", accent:"#10b981", headerBg:"linear-gradient(135deg,#0f172a,#064e3b)", dark:true  },
  { id:"minimal",  label:"Minimal",  accent:"#374151", headerBg:"#f8fafc",                                 dark:false },
  { id:"creative", label:"Creative", accent:"#ec4899", headerBg:"linear-gradient(135deg,#fdf4ff,#fce7f3)", dark:false },
];

const ROLE_THEME = {
  admin:    { primary:"#7c3aed", light:"#ede9fe", dark:"#1e1b4b", label:"Admin" },
  employer: { primary:"#0369a1", light:"#e0f2fe", dark:"#0c2a41", label:"Employer" },
  jobseeker:{ primary:"#047857", light:"#d1fae5", dark:"#064e3b", label:"Job Seeker" },
};

// ── ATOMS ─────────────────────────────────────────────────────────────────────
const StatusBadge = ({ s }) => {
  const map = { pending:["#fef3c7","#92400e","⏳"], reviewed:["#dbeafe","#1e40af","👁"], shortlisted:["#d1fae5","#065f46","⭐"], rejected:["#fee2e2","#991b1b","✗"], hired:["#f0fdf4","#14532d","✅"], active:["#d1fae5","#065f46","●"], inactive:["#fee2e2","#991b1b","○"] };
  const [bg,col,ico] = map[s]||["#f3f4f6","#374151","•"];
  return <span style={{fontSize:10,padding:"2px 8px",borderRadius:99,background:bg,color:col,fontWeight:700}}>{ico} {s}</span>;
};

const TypeTag = ({ t }) => {
  const map = {"full-time":["#dbeafe","#1e40af"],remote:["#d1fae5","#065f46"],contract:["#fef3c7","#92400e"],"part-time":["#f3e8ff","#6b21a8"]};
  const [bg,col] = map[t]||["#f3f4f6","#374151"];
  return <span style={{fontSize:10,padding:"2px 8px",borderRadius:99,background:bg,color:col,fontWeight:600}}>{t}</span>;
};

const Stat = ({ icon, label, value, color, sub }) => (
  <div style={{background:"#fff",borderRadius:14,padding:"16px 14px",border:"1px solid #e5e7eb",flex:1,minWidth:110}}>
    <div style={{width:34,height:34,borderRadius:10,background:color+"20",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8}}>{icon}</div>
    <div style={{fontSize:22,fontWeight:800,color:"#111827"}}>{value}</div>
    <div style={{fontSize:11,color:"#6b7280",marginTop:1}}>{label}</div>
    {sub&&<div style={{fontSize:10,color:color,marginTop:2,fontWeight:600}}>{sub}</div>}
  </div>
);

const Inp = ({ label, value, onChange, placeholder, type="text", textarea }) => (
  <div>
    <div style={{fontSize:9,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>{label}</div>
    {textarea
      ? <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:"7px 9px",borderRadius:7,border:"1px solid #d1d5db",fontSize:11,outline:"none",height:70,resize:"vertical",boxSizing:"border-box"}}/>
      : <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:"7px 9px",borderRadius:7,border:"1px solid #d1d5db",fontSize:11,outline:"none",boxSizing:"border-box"}}/>
    }
  </div>
);

function TabBar({ tabs, active, onTab, theme }) {
  return (
    <div style={{display:"flex",gap:4,borderBottom:"1px solid #e5e7eb",marginBottom:20}}>
      {tabs.map(([id,label,icon])=>(
        <button key={id} onClick={()=>onTab(id)} style={{display:"flex",alignItems:"center",gap:5,padding:"9px 14px",border:"none",background:"transparent",cursor:"pointer",fontSize:12,fontWeight:active===id?700:400,color:active===id?theme.primary:"#6b7280",borderBottom:active===id?`2px solid ${theme.primary}`:"2px solid transparent",marginBottom:-1}}>
          {icon}{label}
        </button>
      ))}
    </div>
  );
}

// ── RESUME PREVIEW MODAL ──────────────────────────────────────────────────────
function ResumePreviewModal({ data, tmplId, onClose }) {
  const t = RESUME_TEMPLATES.find(x=>x.id===tmplId)||RESUME_TEMPLATES[0];
  const isDark = t.dark;
  const bg     = isDark?"#0f172a":"#fff";
  const txt    = isDark?"#f1f5f9":"#1f2937";
  const muted  = isDark?"#94a3b8":"#6b7280";
  const border = isDark?"#1e293b":"#e5e7eb";
  const acc    = t.accent;
  const cardBg = isDark?"#1e293b":"#f9fafb";

  const Sec = ({title,children}) => (
    <div style={{marginBottom:18}}>
      <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,color:acc,borderBottom:`1px solid ${border}`,paddingBottom:4,marginBottom:10}}>{title}</div>
      {children}
    </div>
  );

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:300,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:16,overflowY:"auto"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:740,marginBottom:24}}>
        {/* Toolbar */}
        <div style={{background:"#1e293b",borderRadius:"14px 14px 0 0",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:13,fontWeight:700,color:"#f8fafc"}}>Resume Preview</span>
            <span style={{fontSize:10,padding:"2px 8px",borderRadius:99,background:"rgba(99,102,241,0.3)",color:"#a5b4fc"}}>{RESUME_TEMPLATES.find(x=>x.id===tmplId)?.label}</span>
          </div>
          <div style={{display:"flex",gap:6}}>
            <button onClick={()=>window.print()} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 11px",borderRadius:7,border:"none",background:"#10b981",color:"#fff",cursor:"pointer",fontSize:11,fontWeight:600}}>🖨️ Print / PDF</button>
            <button onClick={onClose} style={{padding:"5px 11px",borderRadius:7,border:"1px solid #334155",background:"transparent",color:"#94a3b8",cursor:"pointer",fontSize:12}}>✕ Close</button>
          </div>
        </div>

        {/* Resume Sheet */}
        <div style={{background:bg,padding:28,fontFamily:"Georgia,serif",color:txt,fontSize:12,lineHeight:1.7,boxShadow:"0 20px 60px rgba(0,0,0,0.4)",borderRadius:"0 0 14px 14px"}}>
          {/* Header */}
          <div style={{background:t.headerBg,borderRadius:12,padding:"20px 22px",marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
              <div style={{width:56,height:56,borderRadius:"50%",background:acc,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:"#fff",border:"3px solid rgba(255,255,255,0.3)",flexShrink:0}}>SJ</div>
              <div style={{flex:1}}>
                <div style={{fontSize:20,fontWeight:800,color:t.id==="minimal"?"#111827":"#fff",fontFamily:"Arial,sans-serif",marginBottom:2}}>{data.name}</div>
                <div style={{fontSize:10,color:t.id==="minimal"?muted:"rgba(255,255,255,0.8)",marginBottom:8,fontFamily:"Arial,sans-serif"}}>{data.title}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
                  {[[data.phone,"📞"],[data.email,"📧"],[data.location,"📍"],[data.linkedin,"🔗"]].map(([v,i],idx)=>v&&(
                    <span key={idx} style={{fontSize:9,color:t.id==="minimal"?muted:"rgba(255,255,255,0.75)"}}>{i} {v}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Sec title="Profile Summary">
            <p style={{fontSize:11,lineHeight:1.8,color:muted,margin:0}}>{data.summary}</p>
          </Sec>

          <Sec title="Technical Skills">
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8}}>
              {Object.entries(data.skills).map(([cat,tags])=>(
                <div key={cat} style={{background:cardBg,borderRadius:8,padding:"9px 11px",border:`1px solid ${border}`}}>
                  <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,color:acc,marginBottom:5}}>{cat}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                    {tags.map(s=><span key={s} style={{fontSize:9,padding:"1px 6px",borderRadius:99,background:isDark?"#0f172a":acc+"15",color:isDark?"#a5b4fc":acc,border:`1px solid ${acc}30`}}>{s}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </Sec>

          <Sec title="Professional Experience">
            {data.experience.map((exp,i)=>(
              <div key={exp.id} style={{marginBottom:i<data.experience.length-1?14:0,paddingLeft:12,borderLeft:`2px solid ${acc}40`,position:"relative"}}>
                <div style={{position:"absolute",left:-5,top:6,width:8,height:8,borderRadius:"50%",background:acc}}/>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4,marginBottom:1}}>
                  <div>
                    <span style={{fontSize:13,fontWeight:700,color:isDark?"#e2e8f0":txt,fontFamily:"Arial,sans-serif"}}>{exp.company}</span>
                    {exp.current&&<span style={{fontSize:9,marginLeft:7,padding:"1px 7px",borderRadius:99,background:"#dcfce7",color:"#15803d",fontWeight:700}}>Current</span>}
                    <div style={{fontSize:11,color:acc,marginTop:1,fontFamily:"Arial,sans-serif"}}>{exp.position}</div>
                  </div>
                  <span style={{fontSize:9,color:muted,background:cardBg,padding:"2px 8px",borderRadius:6,border:`1px solid ${border}`,height:"fit-content"}}>{exp.duration}</span>
                </div>
                <p style={{fontSize:11,color:muted,lineHeight:1.7,margin:"3px 0 0"}}>{exp.description}</p>
              </div>
            ))}
          </Sec>

          <Sec title="Education">
            {data.education.map(e=>(
              <div key={e.id} style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4}}>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:isDark?"#e2e8f0":txt,fontFamily:"Arial,sans-serif"}}>{e.degree}</div>
                  <div style={{fontSize:11,color:muted}}>{e.institution}</div>
                </div>
                <span style={{fontSize:10,color:muted,background:cardBg,padding:"2px 8px",borderRadius:6,border:`1px solid ${border}`}}>{e.year}</span>
              </div>
            ))}
          </Sec>

          <Sec title="Achievements">
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:8}}>
              {data.awards.map(a=>(
                <div key={a.id} style={{background:cardBg,borderRadius:8,padding:"9px 11px",border:`1px solid ${border}`}}>
                  <div style={{fontSize:11,fontWeight:700,color:isDark?"#e2e8f0":txt}}>{a.title}</div>
                  <div style={{fontSize:10,color:acc,margin:"2px 0"}}>{a.org}</div>
                  <div style={{fontSize:10,color:muted}}>{a.desc}</div>
                </div>
              ))}
            </div>
          </Sec>
        </div>
      </div>
    </div>
  );
}

// ── RESUME TAB ────────────────────────────────────────────────────────────────
function ResumeTab({ user, theme }) {
  const [mode,setMode]           = useState("view");
  const [tmpl,setTmpl]           = useState("modern");
  const [showPreview,setShowPreview] = useState(false);
  const [data,setData]           = useState(RESUME_DATA);
  const [saved,setSaved]         = useState(false);

  const upd    = (k,v) => setData(p=>({...p,[k]:v}));
  const updExp = (id,k,v) => setData(p=>({...p,experience:p.experience.map(e=>e.id===id?{...e,[k]:v}:e)}));
  const addExp = () => setData(p=>({...p,experience:[...p.experience,{id:Date.now(),company:"",position:"",duration:"",current:false,description:""}]}));
  const remExp = (id) => setData(p=>({...p,experience:p.experience.filter(e=>e.id!==id)}));

  const handleSave = () => { setSaved(true); setTimeout(()=>setSaved(false),2000); setMode("view"); };

  const t = RESUME_TEMPLATES.find(x=>x.id===tmpl)||RESUME_TEMPLATES[0];

  return (
    <div style={{display:"flex",gap:18,flexWrap:"wrap",alignItems:"flex-start"}}>
      {showPreview && <ResumePreviewModal data={data} tmplId={tmpl} onClose={()=>setShowPreview(false)}/>}

      {/* LEFT: controls */}
      <div style={{width:210,flexShrink:0,display:"flex",flexDirection:"column",gap:12}}>
        <div style={{background:"#fff",borderRadius:14,border:"1px solid #e5e7eb",padding:14}}>
          <div style={{fontSize:12,fontWeight:700,color:"#111827",marginBottom:10}}>Resume Actions</div>
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            <button onClick={()=>setShowPreview(true)} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 12px",borderRadius:9,border:"none",background:theme.primary,color:"#fff",cursor:"pointer",fontSize:12,fontWeight:700}}>
              👁️ Full Preview
            </button>
            <button onClick={()=>setMode(mode==="edit"?"view":"edit")} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 12px",borderRadius:9,border:`1px solid ${theme.primary}`,background:theme.light,color:theme.primary,cursor:"pointer",fontSize:12,fontWeight:700}}>
              ✏️ {mode==="edit"?"Cancel Edit":"Edit Resume"}
            </button>
            {mode==="edit"&&(
              <button onClick={handleSave} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 12px",borderRadius:9,border:"none",background:"#10b981",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:700}}>
                {saved?"✓ Saved!":"💾 Save Changes"}
              </button>
            )}
            <button onClick={()=>window.print()} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 12px",borderRadius:9,border:"1px solid #e5e7eb",background:"#f9fafb",color:"#374151",cursor:"pointer",fontSize:12}}>
              🖨️ Download PDF
            </button>
          </div>
        </div>

        <div style={{background:"#fff",borderRadius:14,border:"1px solid #e5e7eb",padding:14}}>
          <div style={{fontSize:12,fontWeight:700,color:"#111827",marginBottom:10}}>Template</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {RESUME_TEMPLATES.map(tp=>(
              <button key={tp.id} onClick={()=>setTmpl(tp.id)} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:8,border:tmpl===tp.id?`2px solid ${tp.accent}`:"1px solid #e5e7eb",background:tmpl===tp.id?tp.accent+"12":"#f9fafb",color:tmpl===tp.id?tp.accent:"#374151",cursor:"pointer",fontSize:12,fontWeight:tmpl===tp.id?700:400}}>
                <div style={{width:12,height:12,borderRadius:"50%",background:tp.accent,flexShrink:0}}/>
                {tp.label}
                {tmpl===tp.id&&<span style={{marginLeft:"auto",fontSize:10}}>✓</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: view or edit */}
      <div style={{flex:1,minWidth:260}}>
        {mode==="view"&&(
          <div style={{background:"#fff",borderRadius:14,border:"1px solid #e5e7eb",overflow:"hidden"}}>
            {/* Mini header */}
            <div style={{background:t.headerBg,padding:"18px 20px"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:48,height:48,borderRadius:"50%",background:t.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:"#fff",border:"2px solid rgba(255,255,255,0.3)",flexShrink:0}}>SJ</div>
                <div>
                  <div style={{fontSize:15,fontWeight:800,color:t.id==="minimal"?"#111827":"#fff",fontFamily:"Arial,sans-serif"}}>{data.name}</div>
                  <div style={{fontSize:10,color:t.id==="minimal"?"#6b7280":"rgba(255,255,255,0.75)",marginTop:2,fontFamily:"Arial,sans-serif"}}>{data.title.split("|")[0].trim()}</div>
                  <div style={{display:"flex",gap:8,marginTop:5,flexWrap:"wrap"}}>
                    {[data.phone,data.email,data.location].map((v,i)=><span key={i} style={{fontSize:9,color:t.id==="minimal"?"#6b7280":"rgba(255,255,255,0.65)"}}>{v}</span>)}
                  </div>
                </div>
              </div>
            </div>

            <div style={{padding:"14px 18px"}}>
              {/* Summary */}
              <div style={{marginBottom:12}}>
                <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:t.accent,marginBottom:5}}>Summary</div>
                <p style={{fontSize:11,color:"#6b7280",lineHeight:1.7,margin:0}}>{data.summary.slice(0,180)}…</p>
              </div>
              {/* Skills */}
              <div style={{marginBottom:12}}>
                <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:t.accent,marginBottom:5}}>Skills</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {Object.values(data.skills).flat().slice(0,12).map(s=>(
                    <span key={s} style={{fontSize:9,padding:"1px 7px",borderRadius:99,background:t.accent+"15",color:t.accent,border:`1px solid ${t.accent}25`}}>{s}</span>
                  ))}
                  <span style={{fontSize:9,color:"#9ca3af"}}>+{Object.values(data.skills).flat().length-12} more</span>
                </div>
              </div>
              {/* Experience */}
              <div style={{marginBottom:14}}>
                <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:t.accent,marginBottom:5}}>Experience</div>
                {data.experience.slice(0,2).map(exp=>(
                  <div key={exp.id} style={{display:"flex",justifyContent:"space-between",marginBottom:7,paddingLeft:8,borderLeft:`2px solid ${t.accent}40`}}>
                    <div><div style={{fontSize:11,fontWeight:700,color:"#111827"}}>{exp.company}</div><div style={{fontSize:10,color:t.accent}}>{exp.position}</div></div>
                    <span style={{fontSize:9,color:"#9ca3af"}}>{exp.duration}</span>
                  </div>
                ))}
                {data.experience.length>2&&<div style={{fontSize:10,color:"#9ca3af"}}>+{data.experience.length-2} more positions</div>}
              </div>
              <button onClick={()=>setShowPreview(true)} style={{width:"100%",padding:"10px",borderRadius:9,border:`1px solid ${theme.primary}`,background:theme.light,color:theme.primary,cursor:"pointer",fontSize:12,fontWeight:700}}>
                👁️ View Full Resume
              </button>
            </div>
          </div>
        )}

        {mode==="edit"&&(
          <div style={{background:"#fff",borderRadius:14,border:"1px solid #e5e7eb",padding:18,display:"flex",flexDirection:"column",gap:12,maxHeight:560,overflowY:"auto"}}>
            <div style={{fontSize:14,fontWeight:700,color:"#111827"}}>Edit Resume</div>

            {/* Personal */}
            <div style={{background:"#f9fafb",borderRadius:10,padding:13,border:"1px solid #e5e7eb"}}>
              <div style={{fontSize:10,fontWeight:700,color:theme.primary,textTransform:"uppercase",letterSpacing:.5,marginBottom:10}}>Personal Info</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[["name","Full Name"],["title","Job Title"],["email","Email"],["phone","Phone"],["location","Location"],["linkedin","LinkedIn"]].map(([k,l])=>(
                  <div key={k} style={{gridColumn:k==="title"?"1 / -1":"auto"}}>
                    <Inp label={l} value={data[k]} onChange={v=>upd(k,v)} placeholder={l}/>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div style={{background:"#f9fafb",borderRadius:10,padding:13,border:"1px solid #e5e7eb"}}>
              <div style={{fontSize:10,fontWeight:700,color:theme.primary,textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>Summary</div>
              <Inp label="" value={data.summary} onChange={v=>upd("summary",v)} placeholder="Professional summary..." textarea/>
            </div>

            {/* Experience */}
            <div style={{background:"#f9fafb",borderRadius:10,padding:13,border:"1px solid #e5e7eb"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontSize:10,fontWeight:700,color:theme.primary,textTransform:"uppercase",letterSpacing:.5}}>Experience</div>
                <button onClick={addExp} style={{display:"flex",alignItems:"center",gap:3,padding:"3px 9px",borderRadius:6,border:`1px solid ${theme.primary}`,background:theme.light,color:theme.primary,cursor:"pointer",fontSize:10,fontWeight:700}}>
                  <Plus size={10}/> Add
                </button>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {data.experience.map(exp=>(
                  <div key={exp.id} style={{background:"#fff",borderRadius:8,padding:10,border:"1px solid #e5e7eb"}}>
                    <div style={{display:"flex",justifyContent:"flex-end",marginBottom:5}}>
                      <button onClick={()=>remExp(exp.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#ef4444",padding:1}}><Trash2 size={12}/></button>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                      {[["company","Company"],["position","Position"],["duration","Duration"]].map(([k,l])=>(
                        <Inp key={k} label={l} value={exp[k]} onChange={v=>updExp(exp.id,k,v)} placeholder={l}/>
                      ))}
                      <label style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#374151",cursor:"pointer",paddingTop:14}}>
                        <input type="checkbox" checked={exp.current} onChange={e=>updExp(exp.id,"current",e.target.checked)}/> Current
                      </label>
                    </div>
                    <div style={{marginTop:7}}>
                      <Inp label="Description" value={exp.description} onChange={v=>updExp(exp.id,"description",v)} placeholder="Describe your role..." textarea/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleSave} style={{padding:"11px",borderRadius:9,border:"none",background:theme.primary,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700}}>
              {saved?"✓ Saved!":"💾 Save Resume"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── NAVBAR ────────────────────────────────────────────────────────────────────
function Navbar({ user, theme, onLogout }) {
  return (
    <nav style={{background:"#fff",borderBottom:"1px solid #e5e7eb",padding:"0 20px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:30,height:30,borderRadius:8,background:theme.primary,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"#fff"}}>JP</div>
        <span style={{fontSize:14,fontWeight:700,color:"#111827"}}>JobPortal</span>
        <span style={{fontSize:10,padding:"2px 8px",borderRadius:99,background:theme.light,color:theme.primary,fontWeight:700}}>{theme.label}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <Bell size={17} color="#6b7280" style={{cursor:"pointer"}}/>
        <div style={{display:"flex",alignItems:"center",gap:7,padding:"4px 10px",borderRadius:99,border:"1px solid #e5e7eb"}}>
          <div style={{width:24,height:24,borderRadius:"50%",background:theme.primary,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#fff"}}>{user.avatar}</div>
          <span style={{fontSize:12,fontWeight:600,color:"#374151"}}>{user.name}</span>
        </div>
        <button onClick={onLogout} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:7,border:"1px solid #fee2e2",background:"#fff",color:"#ef4444",cursor:"pointer",fontSize:12}}>
          <LogOut size={12}/> Logout
        </button>
      </div>
    </nav>
  );
}

// ── ADMIN ─────────────────────────────────────────────────────────────────────
function AdminDashboard({ theme }) {
  const [tab,setTab]     = useState("overview");
  const [users,setUsers] = useState(INIT_USERS);
  const [jobs,setJobs]   = useState(INIT_JOBS);
  const [search,setSearch] = useState("");
  const fu = users.filter(u=>u.name.toLowerCase().includes(search.toLowerCase())||u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{padding:20,maxWidth:1100,margin:"0 auto"}}>
      <TabBar tabs={[["overview","Overview",<BarChart2 size={13}/>],["users","Users",<Users size={13}/>],["jobs","Jobs",<Briefcase size={13}/>]]} active={tab} onTab={setTab} theme={theme}/>

      {tab==="overview"&&(
        <div>
          <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
            <Stat icon={<Users size={16} color={theme.primary}/>}  label="Total Users"  value={INIT_USERS.length}                       color={theme.primary} sub="+2 this week"/>
            <Stat icon={<Briefcase size={16} color="#0369a1"/>}     label="Active Jobs"  value={INIT_JOBS.filter(j=>j.isActive).length}  color="#0369a1" sub="2 pending"/>
            <Stat icon={<FileText size={16} color="#047857"/>}      label="Applications" value={INIT_APPS.length}                        color="#047857" sub="1 new today"/>
            <Stat icon={<Shield size={16} color="#7c3aed"/>}        label="Admins"       value={1}                                       color="#7c3aed" sub="You"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16}}>
            <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #e5e7eb"}}>
              <div style={{fontSize:13,fontWeight:700,color:"#111827",marginBottom:14}}>Users by Role</div>
              {[["admin","#7c3aed",1],["employer","#0369a1",2],["jobseeker","#047857",3]].map(([r,c,n])=>(
                <div key={r} style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <div style={{width:9,height:9,borderRadius:"50%",background:c}}/>
                  <span style={{fontSize:12,color:"#374151",flex:1,textTransform:"capitalize"}}>{r}</span>
                  <div style={{flex:2,background:"#f3f4f6",borderRadius:99,height:5,overflow:"hidden"}}>
                    <div style={{width:`${(n/6)*100}%`,height:"100%",background:c,borderRadius:99}}/>
                  </div>
                  <span style={{fontSize:12,fontWeight:700,color:"#111827",minWidth:16}}>{n}</span>
                </div>
              ))}
            </div>
            <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #e5e7eb"}}>
              <div style={{fontSize:13,fontWeight:700,color:"#111827",marginBottom:14}}>Recent Activity</div>
              {[["👤","New employer registered","2h ago"],["💼","Job: React Developer posted","4h ago"],["📝","5 new applications","6h ago"],["⚠️","User account flagged","1d ago"]].map(([i,t,time],idx)=>(
                <div key={idx} style={{display:"flex",gap:9,marginBottom:11}}>
                  <span style={{fontSize:15}}>{i}</span>
                  <div><div style={{fontSize:12,color:"#374151"}}>{t}</div><div style={{fontSize:10,color:"#9ca3af"}}>{time}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab==="users"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
            <div style={{fontSize:15,fontWeight:700,color:"#111827"}}>Manage Users</div>
            <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 11px",borderRadius:8,border:"1px solid #e5e7eb",background:"#f9fafb"}}>
              <Search size={13} color="#9ca3af"/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{border:"none",background:"transparent",outline:"none",fontSize:12,width:160}}/>
            </div>
          </div>
          <div data-testid="users-table" style={{background:"#fff",borderRadius:14,border:"1px solid #e5e7eb",overflow:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:500}}>
              <thead>
                <tr style={{background:"#f9fafb",borderBottom:"1px solid #e5e7eb"}}>
                  {["User","Role","Status","Joined","Actions"].map(h=>(
                    <th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:.5}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fu.map((u,i)=>(
                  <tr key={u._id} style={{borderBottom:i<fu.length-1?"1px solid #f3f4f6":"none"}}>
                    <td style={{padding:"11px 12px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:30,height:30,borderRadius:"50%",background:u.role==="employer"?"#0369a1":"#047857",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff"}}>{u.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                        <div><div style={{fontSize:12,fontWeight:600,color:"#111827"}}>{u.name}</div><div style={{fontSize:10,color:"#9ca3af"}}>{u.email}</div></div>
                      </div>
                    </td>
                    <td style={{padding:"11px 12px"}}><span style={{fontSize:10,padding:"2px 8px",borderRadius:99,background:u.role==="employer"?"#e0f2fe":"#d1fae5",color:u.role==="employer"?"#0369a1":"#047857",fontWeight:700,textTransform:"capitalize"}}>{u.role}</span></td>
                    <td style={{padding:"11px 12px"}}><StatusBadge s={u.isActive?"active":"inactive"}/></td>
                    <td style={{padding:"11px 12px",fontSize:11,color:"#6b7280"}}>{u.joinDate}</td>
                    <td style={{padding:"11px 12px"}}>
                      <div style={{display:"flex",gap:5}}>
                        <button onClick={()=>setUsers(p=>p.map(x=>x._id===u._id?{...x,isActive:!x.isActive}:x))} style={{padding:"3px 8px",borderRadius:6,border:"1px solid #e5e7eb",background:"#f9fafb",cursor:"pointer",display:"flex",alignItems:"center",gap:3,fontSize:10,color:"#374151"}}>
                          {u.isActive?<ToggleRight size={12} color="#047857"/>:<ToggleLeft size={12} color="#9ca3af"/>}{u.isActive?"Deactivate":"Activate"}
                        </button>
                        <button onClick={()=>setUsers(p=>p.filter(x=>x._id!==u._id))} style={{padding:"3px 7px",borderRadius:6,border:"1px solid #fee2e2",background:"#fff5f5",cursor:"pointer",color:"#ef4444"}}><Trash2 size={11}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab==="jobs"&&(
        <div>
          <div style={{fontSize:15,fontWeight:700,color:"#111827",marginBottom:14}}>Manage All Jobs</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {jobs.map(job=>(
              <div key={job._id} style={{background:"#fff",borderRadius:12,border:"1px solid #e5e7eb",padding:"13px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                <div style={{flex:1,minWidth:180}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5,flexWrap:"wrap"}}>
                    <span style={{fontSize:13,fontWeight:700,color:"#111827"}}>{job.title}</span>
                    <StatusBadge s={job.isActive?"active":"inactive"}/><TypeTag t={job.type}/>
                  </div>
                  <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                    <span style={{fontSize:11,color:"#6b7280",display:"flex",alignItems:"center",gap:3}}><Briefcase size={10}/>{job.company}</span>
                    <span style={{fontSize:11,color:"#6b7280",display:"flex",alignItems:"center",gap:3}}><MapPin size={10}/>{job.location}</span>
                    <span style={{fontSize:11,color:"#6b7280",display:"flex",alignItems:"center",gap:3}}><Users size={10}/>{job.applicants} applicants</span>
                  </div>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <button style={{padding:"4px 10px",borderRadius:7,border:"1px solid #e5e7eb",background:"#f9fafb",cursor:"pointer",fontSize:11,color:"#374151",display:"flex",alignItems:"center",gap:3}}><Eye size={11}/>View</button>
                  <button onClick={()=>setJobs(p=>p.filter(x=>x._id!==job._id))} style={{padding:"4px 9px",borderRadius:7,border:"1px solid #fee2e2",background:"#fff5f5",cursor:"pointer",color:"#ef4444"}}><Trash2 size={11}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── EMPLOYER ──────────────────────────────────────────────────────────────────
function EmployerDashboard({ user, theme }) {
  const [tab,setTab]   = useState("jobs");
  const [jobs,setJobs] = useState(INIT_JOBS.filter(j=>j.postedBy==="2"));
  const [apps,setApps] = useState(INIT_APPS);
  const [f,setF]       = useState({title:"",description:"",location:"",type:"full-time",minSalary:"",maxSalary:"",skills:"",experience:""});

  const postJob = () => {
    if(!f.title||!f.location) return;
    setJobs(p=>[{_id:`j${Date.now()}`,...f,company:user.company,isActive:true,postedBy:"2",applicants:0,deadline:"2025-08-01",salary:{min:Number(f.minSalary)||0,max:Number(f.maxSalary)||0},skills:f.skills.split(",").map(s=>s.trim()).filter(Boolean)},...p]);
    setF({title:"",description:"",location:"",type:"full-time",minSalary:"",maxSalary:"",skills:"",experience:""});
    setTab("jobs");
  };

  return (
    <div style={{padding:20,maxWidth:1100,margin:"0 auto"}}>
      <TabBar tabs={[["jobs","My Jobs",<Briefcase size={13}/>],["applicants","Applicants",<Users size={13}/>],["post","Post Job",<Plus size={13}/>]]} active={tab} onTab={setTab} theme={theme}/>
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <Stat icon={<Briefcase size={16} color={theme.primary}/>} label="Jobs Posted"      value={jobs.length}                                        color={theme.primary}/>
        <Stat icon={<Users size={16} color="#047857"/>}           label="Total Applicants" value={jobs.reduce((s,j)=>s+(j.applicants||0),0)}          color="#047857" sub="Across all jobs"/>
        <Stat icon={<CheckCircle size={16} color="#7c3aed"/>}     label="Shortlisted"      value={apps.filter(a=>a.status==="shortlisted").length}     color="#7c3aed"/>
        <Stat icon={<Star size={16} color="#f59e0b"/>}            label="Active Jobs"      value={jobs.filter(j=>j.isActive).length}                  color="#f59e0b"/>
      </div>

      {tab==="jobs"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontSize:15,fontWeight:700,color:"#111827"}}>My Job Postings</div>
            <button onClick={()=>setTab("post")} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 13px",borderRadius:8,border:"none",background:theme.primary,color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600}}><Plus size={12}/>Post a Job</button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {jobs.map(job=>(
              <div key={job._id} style={{background:"#fff",borderRadius:12,border:"1px solid #e5e7eb",padding:"13px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5,flexWrap:"wrap"}}>
                      <span style={{fontSize:13,fontWeight:700,color:"#111827"}}>{job.title}</span>
                      <StatusBadge s={job.isActive?"active":"inactive"}/><TypeTag t={job.type}/>
                    </div>
                    <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:7}}>
                      <span style={{fontSize:11,color:"#6b7280",display:"flex",alignItems:"center",gap:3}}><MapPin size={10}/>{job.location}</span>
                      <span style={{fontSize:11,color:"#6b7280",display:"flex",alignItems:"center",gap:3}}><DollarSign size={10}/>₹{job.salary?.min}–{job.salary?.max} LPA</span>
                      <span style={{fontSize:11,color:"#6b7280",display:"flex",alignItems:"center",gap:3}}><Users size={10}/>{job.applicants} applicants</span>
                      <span style={{fontSize:11,color:"#6b7280",display:"flex",alignItems:"center",gap:3}}><Calendar size={10}/>Deadline: {job.deadline}</span>
                    </div>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                      {(job.skills||[]).map(s=><span key={s} style={{fontSize:9,padding:"2px 7px",borderRadius:99,background:theme.light,color:theme.primary}}>{s}</span>)}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"flex-start"}}>
                    <button onClick={()=>setTab("applicants")} style={{padding:"5px 10px",borderRadius:7,border:`1px solid ${theme.primary}30`,background:theme.light,cursor:"pointer",fontSize:11,color:theme.primary,fontWeight:600}}>👥 Applicants</button>
                    <button onClick={()=>setJobs(p=>p.filter(x=>x._id!==job._id))} style={{padding:"5px 8px",borderRadius:7,border:"1px solid #fee2e2",background:"#fff5f5",cursor:"pointer",color:"#ef4444"}}><Trash2 size={11}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="applicants"&&(
        <div>
          <div style={{fontSize:15,fontWeight:700,color:"#111827",marginBottom:14}}>Applicants</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {apps.map(app=>(
              <div key={app._id} style={{background:"#fff",borderRadius:12,border:"1px solid #e5e7eb",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:34,height:34,borderRadius:"50%",background:theme.primary,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff"}}>{app.applicant.avatar}</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:"#111827"}}>{app.applicant.name}</div>
                    <div style={{fontSize:11,color:"#9ca3af"}}>{app.job.title} · {app.appliedAt}</div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <StatusBadge s={app.status}/>
                  <select value={app.status} onChange={e=>setApps(p=>p.map(x=>x._id===app._id?{...x,status:e.target.value}:x))} style={{fontSize:11,padding:"4px 8px",borderRadius:7,border:"1px solid #e5e7eb",background:"#f9fafb",cursor:"pointer",outline:"none"}}>
                    {["pending","reviewed","shortlisted","rejected","hired"].map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="post"&&(
        <div style={{background:"#fff",borderRadius:14,border:"1px solid #e5e7eb",padding:20,maxWidth:580}}>
          <div style={{fontSize:15,fontWeight:700,color:"#111827",marginBottom:14}}>Post a New Job</div>
          <div style={{display:"flex",flexDirection:"column",gap:11}}>
            <Inp label="Job Title"   value={f.title}       onChange={v=>setF({...f,title:v})}       placeholder="e.g. Senior React Developer"/>
            <Inp label="Description" value={f.description} onChange={v=>setF({...f,description:v})} placeholder="Job description..." textarea/>
            <Inp label="Location"    value={f.location}    onChange={v=>setF({...f,location:v})}    placeholder="e.g. Pune, India"/>
            <Inp label="Experience"  value={f.experience}  onChange={v=>setF({...f,experience:v})}  placeholder="e.g. 3+ years"/>
            <Inp label="Skills (comma separated)" value={f.skills} onChange={v=>setF({...f,skills:v})} placeholder="React JS, TypeScript, Redux"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              <div>
                <div style={{fontSize:9,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>Type</div>
                <select value={f.type} onChange={e=>setF({...f,type:e.target.value})} style={{width:"100%",padding:"7px 9px",borderRadius:7,border:"1px solid #d1d5db",fontSize:11,outline:"none"}}>
                  {["full-time","part-time","contract","remote"].map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <Inp label="Min Salary (LPA)" value={f.minSalary} onChange={v=>setF({...f,minSalary:v})} placeholder="8"  type="number"/>
              <Inp label="Max Salary (LPA)" value={f.maxSalary} onChange={v=>setF({...f,maxSalary:v})} placeholder="20" type="number"/>
            </div>
            <div style={{display:"flex",gap:10,marginTop:2}}>
              <button onClick={postJob} style={{flex:1,padding:"10px",borderRadius:8,border:"none",background:theme.primary,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700}}>🚀 Publish Job</button>
              <button onClick={()=>setTab("jobs")} style={{padding:"10px 16px",borderRadius:8,border:"1px solid #e5e7eb",background:"#f9fafb",cursor:"pointer",fontSize:12,color:"#374151"}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── JOB SEEKER ────────────────────────────────────────────────────────────────
function JobSeekerDashboard({ user, theme }) {
  const [tab,setTab]       = useState("browse");
  const [myApps,setMyApps] = useState(INIT_APPS.slice(0,2));
  const [modal,setModal]   = useState(null);
  const [cl,setCl]         = useState("");
  const [search,setSearch] = useState("");
  const [filter,setFilter] = useState("all");

  const filtered = INIT_JOBS.filter(j=>j.isActive).filter(j=>{
    const ms = j.title.toLowerCase().includes(search.toLowerCase())||j.company.toLowerCase().includes(search.toLowerCase());
    const mf = filter==="all"||j.type===filter;
    return ms&&mf;
  });

  const applyJob = () => {
    setMyApps(p=>[{_id:`a${Date.now()}`,job:{title:modal.title,company:modal.company},status:"pending",appliedAt:new Date().toISOString().split("T")[0],applicant:{name:user.name,avatar:user.avatar}},...p]);
    setModal(null); setCl(""); setTab("applications");
  };

  return (
    <div style={{padding:20,maxWidth:1100,margin:"0 auto"}}>
      {modal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"#fff",borderRadius:16,padding:24,maxWidth:460,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}}>
            <div style={{fontSize:15,fontWeight:700,color:"#111827",marginBottom:3}}>Apply for {modal.title}</div>
            <div style={{fontSize:11,color:"#6b7280",marginBottom:14}}>{modal.company} · {modal.location}</div>
            <Inp label="Cover Letter" value={cl} onChange={setCl} placeholder="Why are you the perfect fit?" textarea/>
            <div style={{display:"flex",gap:10,marginTop:14}}>
              <button onClick={applyJob} style={{flex:1,padding:"10px",borderRadius:8,border:"none",background:theme.primary,color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                <Send size={13}/>Submit Application
              </button>
              <button onClick={()=>setModal(null)} style={{padding:"10px 14px",borderRadius:8,border:"1px solid #e5e7eb",background:"#f9fafb",cursor:"pointer",fontSize:12,color:"#374151"}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <TabBar tabs={[["browse","Browse Jobs",<Search size={13}/>],["applications","My Applications",<FileText size={13}/>],["resume","My Resume",<User size={13}/>]]} active={tab} onTab={setTab} theme={theme}/>
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <Stat icon={<FileText size={16} color={theme.primary}/>} label="Applications"  value={myApps.length}                               color={theme.primary}/>
        <Stat icon={<Clock size={16} color="#f59e0b"/>}          label="Pending"        value={myApps.filter(a=>a.status==="pending").length} color="#f59e0b"/>
        <Stat icon={<Star size={16} color="#7c3aed"/>}           label="Shortlisted"    value={myApps.filter(a=>a.status==="shortlisted").length} color="#7c3aed"/>
        <Stat icon={<Briefcase size={16} color="#0369a1"/>}      label="Jobs Available" value={INIT_JOBS.filter(j=>j.isActive).length}       color="#0369a1"/>
      </div>

      {tab==="browse"&&(
        <div>
          <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:7,padding:"7px 11px",borderRadius:8,border:"1px solid #e5e7eb",background:"#f9fafb",flex:1,minWidth:180}}>
              <Search size={13} color="#9ca3af"/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search jobs, companies..." style={{border:"none",background:"transparent",outline:"none",fontSize:12,width:"100%"}}/>
            </div>
            <select value={filter} onChange={e=>setFilter(e.target.value)} style={{padding:"7px 11px",borderRadius:8,border:"1px solid #e5e7eb",background:"#f9fafb",fontSize:12,outline:"none"}}>
              <option value="all">All Types</option>
              {["full-time","remote","contract","part-time"].map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div data-testid="job-list" style={{display:"flex",flexDirection:"column",gap:12}}>
            {filtered.map(job=>{
              const applied = myApps.some(a=>a.job.title===job.title);
              return (
                <div key={job._id} style={{background:"#fff",borderRadius:14,border:"1px solid #e5e7eb",padding:"15px 18px"}}
                  onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.07)"}
                  onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                  <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                    <div style={{flex:1,minWidth:180}}>
                      <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5,flexWrap:"wrap"}}>
                        <span style={{fontSize:14,fontWeight:700,color:"#111827"}}>{job.title}</span><TypeTag t={job.type}/>
                      </div>
                      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:7}}>
                        <span style={{fontSize:11,color:"#6b7280",display:"flex",alignItems:"center",gap:3}}><Briefcase size={10}/>{job.company}</span>
                        <span style={{fontSize:11,color:"#6b7280",display:"flex",alignItems:"center",gap:3}}><MapPin size={10}/>{job.location}</span>
                        <span style={{fontSize:11,color:"#6b7280",display:"flex",alignItems:"center",gap:3}}><DollarSign size={10}/>₹{job.salary?.min}–{job.salary?.max} LPA</span>
                        <span style={{fontSize:11,color:"#6b7280",display:"flex",alignItems:"center",gap:3}}><Star size={10}/>{job.experience}</span>
                      </div>
                      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                        {(job.skills||[]).map(s=><span key={s} style={{fontSize:9,padding:"2px 7px",borderRadius:99,background:theme.light,color:theme.primary}}>{s}</span>)}
                      </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                      <span style={{fontSize:10,color:"#9ca3af"}}>Deadline: {job.deadline}</span>
                      <button disabled={applied} onClick={()=>!applied&&setModal(job)}
                        style={{padding:"8px 16px",borderRadius:8,border:"none",background:applied?"#f3f4f6":theme.primary,color:applied?"#9ca3af":"#fff",cursor:applied?"default":"pointer",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:4}}>
                        {applied?<><CheckCircle size={12}/>Applied</>:<><Send size={12}/>Apply Now</>}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab==="applications"&&(
        <div>
          <div style={{fontSize:15,fontWeight:700,color:"#111827",marginBottom:14}}>My Applications</div>
          {myApps.length===0
            ? <div style={{textAlign:"center",padding:36,color:"#9ca3af",fontSize:13}}>No applications yet. <button onClick={()=>setTab("browse")} style={{color:theme.primary,background:"none",border:"none",cursor:"pointer",fontWeight:600,fontSize:13}}>Browse jobs →</button></div>
            : <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {myApps.map(app=>(
                  <div key={app._id} style={{background:"#fff",borderRadius:12,border:"1px solid #e5e7eb",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:"#111827"}}>{app.job.title}</div>
                      <div style={{fontSize:11,color:"#9ca3af"}}>{app.job.company} · Applied {app.appliedAt}</div>
                    </div>
                    <StatusBadge s={app.status}/>
                  </div>
                ))}
              </div>
          }
        </div>
      )}

      {tab==="resume"&&<ResumeTab user={user} theme={theme}/>}
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email,setEmail]       = useState("");
  const [password,setPassword] = useState("");
  const [error,setError]       = useState("");
  const [loading,setLoading]   = useState(false);

  const DEMO = [
    {email:"admin@portal.com", label:"🛡️ Admin",     color:"#7c3aed"},
    {email:"hr@techcorp.com",  label:"🏢 Employer",  color:"#0369a1"},
    {email:"sudhir@gmail.com", label:"👤 Job Seeker", color:"#047857"},
  ];

  const doLogin = async (em,pw) => {
    setLoading(true); setError("");
    await new Promise(r=>setTimeout(r,500));
    const user = Object.values(USERS).find(u=>u.email===em);
    if(!user||pw!=="pass1234"){ setError("Invalid credentials. Password: pass1234"); setLoading(false); return; }
    setLoading(false); onLogin(user);
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#1e3a8a,#312e81,#1e1b4b)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",borderRadius:20,padding:30,maxWidth:370,width:"100%",boxShadow:"0 24px 80px rgba(0,0,0,0.3)"}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,#6366f1,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,fontWeight:800,color:"#fff",margin:"0 auto 10px"}}>JP</div>
          <div style={{fontSize:19,fontWeight:800,color:"#111827"}}>Job Portal</div>
          <div style={{fontSize:11,color:"#6b7280",marginTop:3}}>MERN · JWT · RBAC</div>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:.5,marginBottom:7}}>Quick Demo Login</div>
          <div style={{display:"flex",gap:6}}>
            {DEMO.map(d=>(
              <button key={d.email} onClick={()=>doLogin(d.email,"pass1234")} style={{flex:1,padding:"7px 4px",borderRadius:8,border:`1px solid ${d.color}30`,background:`${d.color}10`,color:d.color,cursor:"pointer",fontSize:11,fontWeight:700}}>{d.label}</button>
            ))}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:13}}>
          <div style={{flex:1,height:1,background:"#e5e7eb"}}/><span style={{fontSize:10,color:"#9ca3af"}}>or</span><div style={{flex:1,height:1,background:"#e5e7eb"}}/>
        </div>
        {error&&<div data-testid="error-msg" style={{padding:"7px 11px",background:"#fee2e2",color:"#b91c1c",borderRadius:8,fontSize:12,marginBottom:10}}>{error}</div>}
        <div data-testid="login-form" style={{display:"flex",flexDirection:"column",gap:10}}>
          <Inp label="Email"    value={email}    onChange={setEmail}    placeholder="your@email.com"/>
          <Inp label="Password" value={password} onChange={setPassword} placeholder="pass1234" type="password"/>
          <button data-testid="login-btn" onClick={()=>doLogin(email,password)} disabled={loading}
            style={{padding:"11px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#6366f1,#a855f7)",color:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,marginTop:2}}>
            {loading?"Signing in…":"Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [user,setUser] = useState(null);
  const theme = user ? ROLE_THEME[user.role] : null;
  if(!user) return <LoginScreen onLogin={setUser}/>;
  return (
    <div style={{minHeight:"100vh",background:"#f8fafc"}}>
      <Navbar user={user} theme={theme} onLogout={()=>setUser(null)}/>
      <div style={{background:`linear-gradient(90deg,${theme.dark},${theme.primary})`,padding:"12px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <div>
          <div style={{fontSize:15,fontWeight:700,color:"#fff"}}>
            {user.role==="admin"?"🛡️ Admin Dashboard":user.role==="employer"?"🏢 Employer Dashboard":"👤 Job Seeker Dashboard"}
          </div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.65)",marginTop:2}}>Welcome back, {user.name}</div>
        </div>
        <span style={{fontSize:10,padding:"3px 11px",borderRadius:99,background:"rgba(255,255,255,0.15)",color:"#fff",fontWeight:700,border:"1px solid rgba(255,255,255,0.2)"}}>
          JWT Role: {user.role.toUpperCase()}
        </span>
      </div>
      {user.role==="admin"     && <AdminDashboard     user={user} theme={theme}/>}
      {user.role==="employer"  && <EmployerDashboard  user={user} theme={theme}/>}
      {user.role==="jobseeker" && <JobSeekerDashboard user={user} theme={theme}/>}
    </div>
  );
}
