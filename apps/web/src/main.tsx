import React from 'react';
import { createRoot } from 'react-dom/client';
import { Shield, Server, TriangleAlert, Activity, Search, Bell, Sparkles } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import './styles.css';

const trend = [68,70,71,69,72,74,73].map((score,i)=>({day:i+1,score}));
const findings = [
  ['CRITICAL','Privileged container','deployment/payment-api','production'],
  ['HIGH','Wildcard ClusterRole permissions','clusterrole/platform-admin','global'],
  ['MEDIUM','Container running as root','deployment/web','production'],
];

function App(){
  return <div className="app">
    <aside>
      <div className="brand"><div className="logo"><Shield size={20}/></div><div><b>RAINY KUBER</b><small>Security Cloud</small></div></div>
      {['Overview','Clusters','Findings','Scans','Compliance','Reports','AI Assistant','Team','Settings'].map((x,i)=><div className={'nav '+(i===0?'active':'')} key={x}>{x}</div>)}
      <div className="plan"><Sparkles size={18}/><b>Pro workspace</b><small>2 of 10 clusters</small></div>
    </aside>
    <main>
      <header><div><h1>Security Overview</h1><p>Production posture across all Kubernetes clusters</p></div><div className="actions"><button><Search size={18}/></button><button><Bell size={18}/></button><button className="primary">+ Add cluster</button></div></header>
      <section className="hero">
        <div className="score"><span>Security Score</span><strong>73</strong><small>/100</small><em>Needs attention</em></div>
        <div className="chart"><div><b>7-day posture trend</b><small>+5 points overall</small></div><ResponsiveContainer width="100%" height={150}><LineChart data={trend}><Tooltip/><Line type="monotone" dataKey="score" stroke="currentColor" strokeWidth={3} dot={false}/></LineChart></ResponsiveContainer></div>
      </section>
      <section className="metrics">
        <Card icon={<Server/>} title="Clusters" value="2" sub="2 connected"/>
        <Card icon={<TriangleAlert/>} title="Critical" value="2" sub="Immediate action" danger/>
        <Card icon={<Activity/>} title="High" value="11" sub="3 new this week" warn/>
        <Card icon={<Shield/>} title="Resolved" value="127" sub="Last 30 days"/>
      </section>
      <section className="panel">
        <div className="panelHead"><div><h2>Top findings</h2><p>Highest-risk issues requiring attention</p></div><button>View all</button></div>
        <div className="table">
          {findings.map((f)=><div className="row" key={f[1]}><span className={'badge '+f[0].toLowerCase()}>{f[0]}</span><div className="finding"><b>{f[1]}</b><small>{f[2]}</small></div><span>{f[3]}</span><span className="confidence">HIGH confidence</span><button>Open →</button></div>)}
        </div>
      </section>
    </main>
  </div>
}

function Card({icon,title,value,sub,danger,warn}:any){return <div className={'card '+(danger?'danger ':'')+(warn?'warn':'')}><div className="cardIcon">{icon}</div><span>{title}</span><strong>{value}</strong><small>{sub}</small></div>}

createRoot(document.getElementById('root')!).render(<App/>);
