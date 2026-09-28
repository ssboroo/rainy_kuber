import React,{useEffect,useState} from "react";
import {createRoot} from "react-dom/client";
import {Activity,ChevronRight,CircleCheck,Cloud,FileCheck2,Languages,LayoutDashboard,LogOut,Search,Server,Settings,Shield,ShieldAlert,Sparkles,Users,WandSparkles} from "lucide-react";
import {Area,AreaChart,ResponsiveContainer,Tooltip,XAxis} from "recharts";
import {api,clearToken,hasToken,setToken} from "./api";
import {Lang,t} from "./i18n";
import "./styles.css";

type Page="overview"|"clusters"|"findings"|"scans"|"compliance"|"reports"|"assistant"|"team"|"settings";

function App(){
 const [lang,setLang]=useState<Lang>((localStorage.getItem("rk_lang") as Lang)||"en");
 const [authed,setAuthed]=useState(hasToken());
 const [page,setPage]=useState<Page>("overview");
 const tr=t[lang];
 const toggle=()=>{const n:Lang=lang==="en"?"mn":"en";setLang(n);localStorage.setItem("rk_lang",n)};
 if(!authed)return <Auth lang={lang} toggle={toggle} done={()=>setAuthed(true)}/>;
 return <div className="shell"><Sidebar page={page} setPage={setPage} tr={tr}/><main className="content">
  <header className="topbar"><div><div className="eyebrow">{tr.securityPosture}</div><h1>{page==="overview"?tr.hello:(tr as any)[page]}</h1><p>{page==="overview"?tr.helloSub:"RAINY KUBER • Kubernetes Security & Compliance"}</p></div><div className="topActions"><div className="searchBox"><Search size={17}/><input placeholder={tr.search}/></div><button className="langButton" onClick={toggle}><Languages size={16}/>{tr.language}</button><button className="iconButton" title={tr.logout} onClick={()=>{clearToken();setAuthed(false)}}><LogOut size={17}/></button></div></header>
  <PageView page={page} setPage={setPage} lang={lang} tr={tr}/>
 </main></div>
}

function Auth({lang,toggle,done}:any){
 const tr=t[lang as Lang]; const [register,setRegister]=useState(false); const [error,setError]=useState("");
 const [form,setForm]=useState({email:"",password:"",name:"",organization:""});
 const set=(k:string,v:string)=>setForm({...form,[k]:v});
 async function submit(e:any){e.preventDefault();setError("");try{const path=register?"/auth/register":"/auth/login";const body=register?form:{email:form.email,password:form.password};const r=await api(path,{method:"POST",body:JSON.stringify(body)});setToken(r.access_token);done()}catch(e:any){setError(e.message)}}
 return <div className="loginShell"><div className="loginCard"><div className="loginBrand"><div className="brandMark"><Shield/></div><div><b>RAINY KUBER</b><span>Cloud Security</span></div></div><div className="loginHero"><span>KUBERNETES SECURITY • EN / MN</span><h1>{register?tr.register:tr.login}</h1><p>Secure clusters. Understand risk. Fix faster.</p></div><form onSubmit={submit}>
  {register&&<><label>{tr.yourName}<input value={form.name} onChange={e=>set("name",e.target.value)}/></label><label>{tr.organization}<input required value={form.organization} onChange={e=>set("organization",e.target.value)}/></label></>}
  <label>{tr.email}<input type="email" required value={form.email} onChange={e=>set("email",e.target.value)}/></label><label>{tr.password}<input type="password" minLength={10} required value={form.password} onChange={e=>set("password",e.target.value)}/></label>{error&&<div className="error">{error}</div>}<button className="primaryWide">{register?tr.createAccount:tr.signIn}</button>
 </form><button className="textButton" onClick={()=>setRegister(!register)}>{register?tr.backToLogin:tr.register}</button><button className="textButton" onClick={toggle}><Languages size={15}/>{tr.language}</button></div></div>
}

function Sidebar({page,setPage,tr}:any){const nav:any[]=[["overview",LayoutDashboard],["clusters",Server],["findings",ShieldAlert],["scans",Activity],["compliance",FileCheck2],["reports",FileCheck2],["assistant",WandSparkles],["team",Users],["settings",Settings]];return <aside className="sidebar"><div className="brand"><div className="brandMark"><Shield size={22}/></div><div><div className="brandName">RAINY KUBER</div><div className="brandSub">Cloud Security</div></div></div><div className="workspace"><div className="workspaceLogo">R</div><div><b>RAINY Workspace</b><span>Production</span></div><ChevronRight size={15}/></div><nav><div className="navLabel">WORKSPACE</div>{nav.map(([id,Icon])=><button key={id} onClick={()=>setPage(id)} className={"navItem "+(page===id?"active":"")}><Icon size={17}/><span>{tr[id]}</span>{id==="assistant"&&<i>AI</i>}</button>)}</nav><div className="sideBottom"><div className="planCard"><div className="planIcon"><Sparkles size={17}/></div><div><b>Pro workspace</b><span>Security platform</span></div><div className="progress"><span/></div></div></div></aside>}

function useLoad(path:string,deps:any[]=[]){const [data,setData]=useState<any>(null);const [error,setError]=useState("");const load=()=>api(path).then(setData).catch(e=>setError(e.message));useEffect(()=>{load()},deps);return {data,error,reload:load}}

function PageView({page,setPage,lang,tr}:any){
 if(page==="overview")return <Overview lang={lang} tr={tr} setPage={setPage}/>;
 if(page==="clusters")return <Clusters tr={tr}/>;
 if(page==="findings")return <Findings lang={lang} tr={tr}/>;
 if(page==="scans")return <Scans tr={tr}/>;
 if(page==="reports")return <Reports lang={lang} tr={tr}/>;
 if(page==="assistant")return <Assistant lang={lang} tr={tr}/>;
 if(page==="compliance")return <Compliance lang={lang}/>;
 if(page==="team")return <Team/>;
 if(page==="settings")return <SettingsPage/>;
 return <div className="emptyState surface"><Shield size={34}/><h2>{tr[page]}</h2><p>RAINY KUBER</p></div>
}

function Overview({lang,tr,setPage}:any){
 const {data}=useLoad("/overview");const {data:fs}=useLoad("/findings?lang="+lang,[lang]);
 if(!data)return <Loading tr={tr}/>;
 const trend=(data.trend?.length?data.trend:[{score:data.security_score}]).map((x:any,i:number)=>({day:i+1,score:x.score}));
 return <><section className="summaryGrid"><div className="scoreCard surface"><div className="sectionLabel">{tr.overall}</div><div className="scoreWrap"><div className="scoreRing"><svg viewBox="0 0 120 120"><circle className="track" cx="60" cy="60" r="48"/><circle className="value" cx="60" cy="60" r="48" pathLength="100" style={{strokeDasharray:data.security_score+" 100"}}/></svg><div className="scoreCenter"><strong>{data.security_score}</strong><span>/100</span></div></div><div className="scoreCopy"><span className="statusPill"><span/>{tr.needs}</span><h3>{tr.improving}</h3><p>RAINY KUBER continuously compares posture across scans.</p></div></div></div><div className="trendCard surface"><div className="cardTitleRow"><div><div className="sectionLabel">{tr.trend}</div><h3>{tr.posture}</h3></div></div><ResponsiveContainer width="100%" height={168}><AreaChart data={trend}><defs><linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2f7df6" stopOpacity={.2}/><stop offset="100%" stopColor="#2f7df6" stopOpacity={.01}/></linearGradient></defs><XAxis dataKey="day" axisLine={false} tickLine={false}/><Tooltip/><Area type="monotone" dataKey="score" stroke="#2f7df6" strokeWidth={3} fill="url(#scoreFill)"/></AreaChart></ResponsiveContainer></div></section>
 <section className="metricGrid"><Metric icon={<Server/>} tone="blue" label={tr.connected} value={data.clusters}/><Metric icon={<ShieldAlert/>} tone="red" label={tr.critical} value={data.counts.critical}/><Metric icon={<Activity/>} tone="amber" label={tr.high} value={data.counts.high}/><Metric icon={<CircleCheck/>} tone="green" label={tr.resolved} value={data.resolved}/></section>
 <section className="lowerGrid"><div className="findingsCard surface"><div className="panelHead"><div><div className="sectionLabel">{tr.priority}</div><h2>{tr.topFindings}</h2><p>{tr.topSub}</p></div><button className="secondaryButton" onClick={()=>setPage("findings")}>{tr.viewAll}<ChevronRight size={15}/></button></div>{(fs||[]).slice(0,4).map((f:any)=><FindingRow key={f.id} f={f}/>)}</div><div className="assistantCard"><div className="assistantIcon"><WandSparkles/></div><div className="aiBadge">RAINY AI</div><h2>{tr.securityCopilot}</h2><p>{tr.copilotSub}</p><button onClick={()=>setPage("assistant")}>{tr.openAI}<ChevronRight size={15}/></button></div></section></>
}

function Metric({icon,tone,label,value}:any){return <div className="metric surface"><div className={"metricIcon "+tone}>{icon}</div><div><span>{label}</span><strong>{value}</strong><small>RAINY KUBER</small></div></div>}
function FindingRow({f}:any){return <div className="findingRow"><div className={"severityMark "+f.severity.toLowerCase()}/><div><div className="findingTop"><span className={"severityTag "+f.severity.toLowerCase()}>{f.severity}</span><b>{f.title}</b></div><div className="findingMeta"><code>{f.resource}</code><span>•</span><span>{f.namespace}</span></div></div><div className="scannerCount"><span>{f.found_by?.length||0}</span><small>scanners</small></div><div className="confidence"><span className="confidenceDot"/>{f.confidence}</div><span/></div>}

function Clusters({tr}:any){const {data,reload}=useLoad("/clusters");const [show,setShow]=useState(false);const [name,setName]=useState("");const [env,setEnv]=useState("production");const [token,setAgentToken]=useState("");async function create(){const r=await api("/clusters",{method:"POST",body:JSON.stringify({name,environment:env})});setAgentToken(r.agent_token);setShow(false);setName("");reload()}return <><div className="pageAction"><button className="primaryButton" onClick={()=>setShow(true)}><Cloud size={17}/>{tr.addCluster}</button></div>{token&&<div className="tokenCard surface"><b>{tr.agentToken}</b><code>{token}</code><p>{tr.tokenWarning}</p></div>}<div className="dataGrid">{(data||[]).map((c:any)=><div className="clusterCard surface" key={c.id}><div className="clusterIcon"><Server/></div><div className="clusterHead"><h3>{c.name}</h3><span className={"health "+c.status}>{c.status}</span></div><p>{c.environment}</p><div className="scoreMini"><strong>{c.score}</strong><span>/100</span></div><small>{c.last_seen_at?new Date(c.last_seen_at).toLocaleString():"Waiting for agent"}</small></div>)}</div>{show&&<Modal title={tr.addCluster} close={()=>setShow(false)}><label>{tr.name}<input value={name} onChange={e=>setName(e.target.value)}/></label><label>{tr.environment}<select value={env} onChange={e=>setEnv(e.target.value)}><option>production</option><option>staging</option><option>development</option></select></label><button className="primaryWide" disabled={!name} onClick={create}>{tr.create}</button></Modal>}</>}

function Findings({lang,tr}:any){const {data,reload}=useLoad("/findings?lang="+lang,[lang]);async function update(id:string,status:string){await api("/findings/"+id+"/status",{method:"PATCH",body:JSON.stringify({status})});reload()}return <div className="surface findingsPage">{(data||[]).map((f:any)=><div className="findingFull" key={f.id}><FindingRow f={f}/><div className="remediation"><b>{f.control} • {f.status}</b><p>{f.remediation||"—"}</p><div className="rowActions"><button onClick={()=>update(f.id,"ACKNOWLEDGED")}>{tr.ack}</button><button onClick={()=>update(f.id,"FIXED")}>{tr.markFixed}</button></div></div></div>)}</div>}

function Scans({tr}:any){const {data}=useLoad("/scans");return <div className="surface tableCard"><h2>{tr.scanHistory}</h2><table><thead><tr><th>ID</th><th>{tr.score}</th><th>Critical</th><th>High</th><th>{tr.status}</th><th>Date</th></tr></thead><tbody>{(data||[]).map((s:any)=><tr key={s.id}><td><code>{s.id.slice(0,8)}</code></td><td><b>{s.score}</b></td><td>{s.counts?.critical||0}</td><td>{s.counts?.high||0}</td><td>{s.status}</td><td>{new Date(s.created_at).toLocaleString()}</td></tr>)}</tbody></table></div>}

function Reports({lang,tr}:any){const {data}=useLoad("/reports/summary?lang="+lang,[lang]);function download(){const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="rainy-kuber-report-"+lang+".json";a.click()}return <div className="report surface"><div className="reportHero"><div><div className="sectionLabel">RAINY KUBER</div><h2>{data?.title||tr.report}</h2><p>Audit-ready bilingual security summary.</p></div><button className="primaryButton" onClick={download}>{tr.downloadJson}</button></div>{data&&<><div className="reportScore"><strong>{data.overview.security_score}</strong><span>/100 Security Score</span></div><div className="reportCounts"><div>Critical <b>{data.overview.counts.critical}</b></div><div>High <b>{data.overview.counts.high}</b></div><div>Medium <b>{data.overview.counts.medium}</b></div><div>Low <b>{data.overview.counts.low}</b></div></div></>}</div>}

function Assistant({lang,tr}:any){const [q,setQ]=useState("");const [answer,setAnswer]=useState("");const [busy,setBusy]=useState(false);async function ask(){setBusy(true);try{const r=await api("/assistant",{method:"POST",body:JSON.stringify({question:q,lang})});setAnswer(r.answer)}finally{setBusy(false)}}return <div className="assistantPage surface"><div className="assistantBig"><WandSparkles size={30}/></div><h2>RAINY AI Security Copilot</h2><p>{tr.copilotSub}</p><textarea value={q} onChange={e=>setQ(e.target.value)} placeholder={tr.ask}/><button className="primaryButton" disabled={!q||busy} onClick={ask}>{busy?tr.loading:tr.send}</button>{answer&&<div className="answer">{answer}</div>}</div>}
function Compliance({lang}:any){const {data}=useLoad("/compliance");if(!data)return <div className="loading">Loading...</div>;return <div className="surface report"><div className="sectionLabel">COMPLIANCE EVIDENCE</div><h2>{lang==="mn"?"Нийцлийн нотолгооны бэлэн байдал":"Compliance evidence readiness"}</h2><p>{lang==="mn"?data.note_mn:data.note_en}</p><div className="frameworkGrid">{data.frameworks.map((x:any)=><div className="frameworkCard" key={x.name}><b>{x.name}</b><span>{x.status}</span></div>)}</div><div className="controlList"><b>{lang==="mn"?"Нээлттэй control":"Open controls"}: {data.open_controls.length}</b><div>{data.open_controls.map((x:string)=><code key={x}>{x}</code>)}</div></div></div>}
function Team(){const {data}=useLoad("/team");return <div className="surface tableCard"><h2>Team</h2><table><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>{(data||[]).map((m:any)=><tr key={m.id}><td>{m.name||"—"}</td><td>{m.email}</td><td>{m.role}</td></tr>)}</tbody></table></div>}
function SettingsPage(){const {data}=useLoad("/organization");const {data:audit}=useLoad("/audit");return <div className="settingsGrid"><div className="surface report"><div className="sectionLabel">ORGANIZATION</div><h2>{data?.name||"Workspace"}</h2><p>{data?.slug}</p><div className="planBadge">{data?.plan||"free"}</div></div><div className="surface tableCard"><h2>Audit log</h2><table><thead><tr><th>Action</th><th>Target</th><th>Date</th></tr></thead><tbody>{(audit||[]).slice(0,20).map((r:any)=><tr key={r.id}><td>{r.action}</td><td><code>{r.target?.slice(0,16)}</code></td><td>{new Date(r.created_at).toLocaleString()}</td></tr>)}</tbody></table></div></div>}
function Loading({tr}:any){return <div className="loading">{tr.loading}</div>}
function Modal({title,close,children}:any){return <div className="modalBack" onMouseDown={close}><div className="modal" onMouseDown={e=>e.stopPropagation()}><div className="modalHead"><h3>{title}</h3><button onClick={close}>×</button></div>{children}</div></div>}

createRoot(document.getElementById("root")!).render(<App/>);
