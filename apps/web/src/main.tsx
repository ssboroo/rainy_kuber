import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, Bell, ChevronRight, CircleCheck, Cloud, FileCheck2, LayoutDashboard,
  Search, Server, Settings, Shield, ShieldAlert, Sparkles, Users, WandSparkles
} from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import './styles.css';

const trend = [
  { day: '22', score: 68 }, { day: '23', score: 70 }, { day: '24', score: 71 },
  { day: '25', score: 69 }, { day: '26', score: 72 }, { day: '27', score: 74 },
  { day: '28', score: 73 }
];

const findings = [
  { severity: 'CRITICAL', title: 'Privileged container detected', resource: 'deployment/payment-api', ns: 'production', confidence: 'High', scanners: 3 },
  { severity: 'HIGH', title: 'Wildcard ClusterRole permissions', resource: 'clusterrole/platform-admin', ns: 'global', confidence: 'High', scanners: 1 },
  { severity: 'HIGH', title: 'Container running as root', resource: 'deployment/web', ns: 'production', confidence: 'High', scanners: 2 },
  { severity: 'MEDIUM', title: 'Image pull policy is not pinned', resource: 'deployment/worker', ns: 'staging', confidence: 'Medium', scanners: 2 },
];

const nav = [
  ['Overview', LayoutDashboard], ['Clusters', Server], ['Findings', ShieldAlert], ['Scans', Activity],
  ['Compliance', FileCheck2], ['Reports', FileCheck2], ['AI Assistant', WandSparkles], ['Team', Users], ['Settings', Settings]
] as const;

function App() {
  const [active, setActive] = useState('Overview');
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandMark"><Shield size={23} /></div>
          <div><div className="brandName">RAINY KUBER</div><div className="brandSub">Cloud Security</div></div>
        </div>

        <div className="workspace">
          <div className="workspaceLogo">R</div>
          <div><b>RAINY Workspace</b><span>Production</span></div>
          <ChevronRight size={16} />
        </div>

        <nav>
          <div className="navLabel">WORKSPACE</div>
          {nav.map(([label, Icon]) => (
            <button key={label} className={active === label ? 'navItem active' : 'navItem'} onClick={() => setActive(label)}>
              <Icon size={18} /><span>{label}</span>
              {label === 'Findings' && <em>4</em>}
              {label === 'AI Assistant' && <i>AI</i>}
            </button>
          ))}
        </nav>

        <div className="sideBottom">
          <div className="planCard">
            <div className="planIcon"><Sparkles size={18} /></div>
            <div><b>Pro workspace</b><span>2 of 10 clusters connected</span></div>
            <div className="progress"><span /></div>
          </div>
          <div className="profile">
            <div className="avatar">SB</div>
            <div><b>Security Admin</b><span>admin@rainy.mn</span></div>
          </div>
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <div className="eyebrow">SECURITY POSTURE</div>
            <h1>{active === 'Overview' ? 'Good evening, Security team' : active}</h1>
            <p>{active === 'Overview' ? 'Your Kubernetes environment is stable, with a few high-priority items to review.' : 'RAINY KUBER workspace module.'}</p>
          </div>
          <div className="topActions">
            <div className="searchBox"><Search size={18} /><input placeholder="Search findings, clusters..." /></div>
            <button className="iconButton"><Bell size={19} /><span className="dot" /></button>
            <button className="primaryButton"><Cloud size={18} /> Add cluster</button>
          </div>
        </header>

        {active === 'Overview' ? <Overview /> : <Placeholder title={active} />}
      </main>
    </div>
  );
}

function Overview() {
  return <>
    <section className="summaryGrid">
      <div className="scoreCard surface">
        <div className="sectionLabel">OVERALL SECURITY SCORE</div>
        <div className="scoreWrap">
          <div className="scoreRing">
            <svg viewBox="0 0 120 120">
              <circle className="track" cx="60" cy="60" r="48" />
              <circle className="value" cx="60" cy="60" r="48" pathLength="100" />
            </svg>
            <div className="scoreCenter"><strong>73</strong><span>/100</span></div>
          </div>
          <div className="scoreCopy">
            <span className="statusPill"><span /> Needs attention</span>
            <h3>Security posture is improving</h3>
            <p>Score increased by <b>5 points</b> during the last 7 days.</p>
          </div>
        </div>
      </div>

      <div className="trendCard surface">
        <div className="cardTitleRow">
          <div><div className="sectionLabel">7-DAY TREND</div><h3>Posture score</h3></div>
          <div className="trendGain">+5.2%</div>
        </div>
        <ResponsiveContainer width="100%" height={168}>
          <AreaChart data={trend}>
            <defs>
              <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2f7df6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#2f7df6" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill:'#94a3b8', fontSize:11 }} />
            <Tooltip />
            <Area type="monotone" dataKey="score" stroke="#2f7df6" strokeWidth={3} fill="url(#scoreFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>

    <section className="metricGrid">
      <Metric icon={<Server />} tone="blue" label="Connected clusters" value="2" meta="All healthy" />
      <Metric icon={<ShieldAlert />} tone="red" label="Critical findings" value="2" meta="Requires action" />
      <Metric icon={<Activity />} tone="amber" label="High findings" value="11" meta="3 new this week" />
      <Metric icon={<CircleCheck />} tone="green" label="Resolved" value="127" meta="+18 this month" />
    </section>

    <section className="lowerGrid">
      <div className="findingsCard surface">
        <div className="panelHead">
          <div><div className="sectionLabel">PRIORITY QUEUE</div><h2>Top findings</h2><p>Highest-risk issues across your connected clusters.</p></div>
          <button className="secondaryButton">View all findings <ChevronRight size={16}/></button>
        </div>
        <div className="findingList">
          {findings.map(f => <div className="findingRow" key={f.title}>
            <div className={'severityMark '+f.severity.toLowerCase()} />
            <div className="findingMain">
              <div className="findingTop"><span className={'severityTag '+f.severity.toLowerCase()}>{f.severity}</span><b>{f.title}</b></div>
              <div className="findingMeta"><code>{f.resource}</code><span>•</span><span>{f.ns}</span></div>
            </div>
            <div className="scannerCount"><span>{f.scanners}</span><small>scanners</small></div>
            <div className="confidence"><span className="confidenceDot"/>{f.confidence} confidence</div>
            <button className="openButton"><ChevronRight size={18}/></button>
          </div>)}
        </div>
      </div>

      <div className="assistantCard">
        <div className="assistantIcon"><WandSparkles size={22}/></div>
        <div className="aiBadge">RAINY AI</div>
        <h2>Security Copilot</h2>
        <p>Ask what changed, why a finding matters, or generate a safer Kubernetes configuration.</p>
        <div className="suggestion">“What are my top 3 risks today?”</div>
        <div className="suggestion">“Generate a fix for payment-api”</div>
        <button>Open AI Assistant <ChevronRight size={16}/></button>
      </div>
    </section>
  </>;
}

function Metric({icon,tone,label,value,meta}:any){
  return <div className="metric surface"><div className={'metricIcon '+tone}>{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{meta}</small></div></div>;
}

function Placeholder({title}:{title:string}){
  return <div className="placeholder surface"><div className="placeholderIcon"><Shield size={30}/></div><h2>{title}</h2><p>This module is ready for the next implementation phase.</p></div>;
}

createRoot(document.getElementById('root')!).render(<App />);
