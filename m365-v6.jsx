import { useState, useEffect, useCallback, useRef, useMemo } from "react";

const pick = a => a[Math.floor(Math.random() * a.length)];
const gid = () => "TKT-" + String(Math.floor(10000 + Math.random() * 90000));
const ago = ms => { const m = Math.floor(ms / 60000); if (m < 1) return "now"; if (m < 60) return m + "m"; const h = Math.floor(m / 60); if (h < 24) return h + "h"; return Math.floor(h / 24) + "d"; };
const pct = (a, b) => b === 0 ? 0 : Math.min(100, Math.round(a / b * 100));
const fT = d => new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
const td = () => new Date().toISOString().slice(0,10);
const TN = { name:"Contoso Corp", domain:"contoso.onmicrosoft.com", vanity:"contoso.com", id:"a1b2c3d4-e5f6", region:"UK South" };

// ═══════ COLORS ═══════
const X = { bg:"#090b11",p:"#0f1219",p2:"#141822",pb:"#1c2233",ph:"#171d2b",a:"#3b82f6",ok:"#10b981",wn:"#f59e0b",er:"#ef4444",cr:"#dc2626",t1:"#e2e8f0",t2:"#94a3b8",t3:"#64748b",t4:"#475569","AAD":"#8b5cf6",Teams:"#7c3aed",SP:"#0ea5e9",Exch:"#f97316",Sec:"#ef4444",OL:"#2563eb",Intune:"#10b981",Power:"#f59e0b",Purview:"#6366f1" };
const pC = p => ({ Critical:X.cr, High:X.er, Medium:X.wn, Low:X.ok }[p] || X.t3);

// ═══════ STYLE HELPERS ═══════
const bg2 = c => ({ display:"inline-block",padding:"2px 6px",borderRadius:4,fontSize:10,fontWeight:600,background:c+"20",color:c,whiteSpace:"nowrap" });
const bt = (c=X.a) => ({ padding:"5px 11px",background:c,color:"#fff",border:"none",borderRadius:5,cursor:"pointer",fontSize:11,fontWeight:600 });
const bo = (c=X.a) => ({ padding:"4px 10px",background:"transparent",color:c,border:"1px solid "+c+"44",borderRadius:5,cursor:"pointer",fontSize:11 });
const nb = a => ({ padding:"5px 11px",background:a?X.a+"18":"transparent",color:a?X.a:X.t3,border:"none",borderRadius:5,cursor:"pointer",fontSize:11,fontWeight:a?600:400 });
const cd = { background:X.p,border:"1px solid "+X.pb,borderRadius:8,padding:11,marginBottom:7 };
const ip = { padding:"5px 9px",background:X.bg,border:"1px solid "+X.pb,borderRadius:5,color:X.t1,fontSize:12,width:"100%",outline:"none",boxSizing:"border-box" };
const sel = { ...ip, appearance:"none",cursor:"pointer" };
const th = { padding:"7px 7px",color:X.t3,fontWeight:600,fontSize:9,textTransform:"uppercase",letterSpacing:".4px",borderBottom:"1px solid "+X.pb,textAlign:"left" };
const td2 = { padding:"6px 7px",borderBottom:"1px solid "+X.pb+"88",fontSize:11 };
const g2 = { display:"grid",gridTemplateColumns:"1fr 1fr",gap:7 };
const hd = t => <div style={{fontWeight:700,fontSize:13,margin:"12px 0 7px",display:"flex",alignItems:"center",gap:5}}>{t}</div>;
const kv = (k,v,c) => <div style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"1px solid "+X.pb+"44",fontSize:11}}><span style={{color:X.t2}}>{k}</span><span style={c?bg2(c):{fontWeight:600}}>{v}</span></div>;
const bar = (v,mx,c=X.ok) => <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{flex:1,height:4,background:X.bg,borderRadius:2,overflow:"hidden"}}><div style={{width:pct(v,mx)+"%",height:"100%",background:pct(v,mx)>85?X.er:pct(v,mx)>65?X.wn:c,borderRadius:2}}/></div><span style={{fontSize:9,color:X.t3,whiteSpace:"nowrap"}}>{Math.round(v)}/{mx}</span></div>;
const av = (u,sz=20) => <div style={{width:sz,height:sz,borderRadius:"50%",background:`hsl(${(u.n||"").charCodeAt(0)*37%360},55%,42%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:sz*.36,fontWeight:700,color:"#fff",flexShrink:0}}>{(u.n||"??").split(" ").map(w=>w[0]).join("").slice(0,2)}</div>;

// ═══════ INITIAL TENANT DATA (becomes mutable state) ═══════
const SEED_USERS = [
  {id:"u01",n:"Sarah Chen",e:"s.chen@contoso.com",dp:"Engineering",ti:"Senior Developer",lo:"Seattle",li:"E5",ac:true,mfa:true,mm:"Authenticator",ri:"None",mb:50,mbU:18,co:"Compliant",pw:td(),src:"Cloud",sspr:true,blocked:false,sharedMbx:false,fwd:"",archiveOn:false,oofExt:true,sessions:1},
  {id:"u02",n:"Marcus Williams",e:"m.williams@contoso.com",dp:"Marketing",ti:"Marketing Director",lo:"New York",li:"E5",ac:true,mfa:true,mm:"SMS",ri:"None",mb:50,mbU:33,co:"Compliant",pw:"2026-01-15",src:"Synced",sspr:true,blocked:false,sharedMbx:false,fwd:"",archiveOn:false,oofExt:true,sessions:2},
  {id:"u03",n:"Emily Rodriguez",e:"e.rodriguez@contoso.com",dp:"Sales",ti:"Account Executive",lo:"New York",li:"E3",ac:true,mfa:false,mm:"None",ri:"Medium",mb:50,mbU:41,co:"NonCompliant",pw:"2025-11-20",src:"Synced",sspr:false,blocked:false,sharedMbx:false,fwd:"",archiveOn:false,oofExt:false,sessions:3},
  {id:"u04",n:"James O'Brien",e:"j.obrien@contoso.com",dp:"HR",ti:"HR Manager",lo:"London",li:"E3",ac:true,mfa:true,mm:"Authenticator",ri:"None",mb:50,mbU:15,co:"Compliant",pw:"2026-02-20",src:"Synced",sspr:true,blocked:false,sharedMbx:false,fwd:"",archiveOn:false,oofExt:true,sessions:1},
  {id:"u05",n:"Aisha Patel",e:"a.patel@contoso.com",dp:"Finance",ti:"CFO",lo:"London",li:"E5",ac:true,mfa:true,mm:"FIDO2",ri:"None",mb:100,mbU:48,co:"Compliant",pw:"2026-03-01",src:"Cloud",sspr:true,blocked:false,sharedMbx:false,fwd:"",archiveOn:true,oofExt:true,sessions:1},
  {id:"u06",n:"David Kim",e:"d.kim@contoso.com",dp:"IT",ti:"IT Director",lo:"Seattle",li:"E5",ac:true,mfa:true,mm:"Authenticator+FIDO2",ri:"None",mb:100,mbU:22,co:"Compliant",pw:"2026-03-05",src:"Cloud",sspr:true,blocked:false,sharedMbx:false,fwd:"",archiveOn:true,oofExt:true,sessions:2},
  {id:"u07",n:"Lisa Tanaka",e:"l.tanaka@contoso.com",dp:"Legal",ti:"General Counsel",lo:"Tokyo",li:"E5",ac:true,mfa:true,mm:"Authenticator",ri:"None",mb:100,mbU:36,co:"Compliant",pw:"2026-02-10",src:"Cloud",sspr:true,blocked:false,sharedMbx:false,fwd:"",archiveOn:false,oofExt:true,sessions:1},
  {id:"u08",n:"Tom Baker",e:"t.baker@contoso.com",dp:"Operations",ti:"Operations Lead",lo:"Sydney",li:"E3",ac:false,mfa:false,mm:"None",ri:"High",mb:50,mbU:1,co:"NonCompliant",pw:"2025-09-01",src:"Synced",sspr:false,blocked:true,sharedMbx:false,fwd:"",archiveOn:false,oofExt:false,sessions:5},
  {id:"u09",n:"Rachel Foster",e:"r.foster@contoso.com",dp:"Marketing",ti:"Content Writer",lo:"Berlin",li:"F3",ac:true,mfa:false,mm:"None",ri:"Low",mb:2,mbU:1.8,co:"NonCompliant",pw:"2025-12-15",src:"Cloud",sspr:false,blocked:false,sharedMbx:false,fwd:"",archiveOn:false,oofExt:false,sessions:2},
  {id:"u10",n:"Carlos Mendez",e:"c.mendez@contoso.com",dp:"Engineering",ti:"DevOps Lead",lo:"Seattle",li:"E5",ac:true,mfa:true,mm:"Authenticator",ri:"None",mb:50,mbU:29,co:"Compliant",pw:"2026-02-25",src:"Cloud",sspr:true,blocked:false,sharedMbx:false,fwd:"",archiveOn:false,oofExt:true,sessions:1},
  {id:"u11",n:"Nina Volkov",e:"n.volkov@contoso.com",dp:"Sales",ti:"VP Sales",lo:"Berlin",li:"E5",ac:true,mfa:true,mm:"SMS",ri:"None",mb:100,mbU:42,co:"Compliant",pw:"2026-01-28",src:"Synced",sspr:true,blocked:false,sharedMbx:false,fwd:"",archiveOn:false,oofExt:true,sessions:1},
  {id:"u12",n:"Kevin Okafor",e:"k.okafor@contoso.com",dp:"Finance",ti:"Accounting Mgr",lo:"New York",li:"E3",ac:true,mfa:true,mm:"Authenticator",ri:"None",mb:50,mbU:49,co:"Compliant",pw:"2026-02-18",src:"Synced",sspr:true,blocked:false,sharedMbx:false,fwd:"",archiveOn:false,oofExt:true,sessions:1},
];

const SEED_TEAMS = [
  {id:"tm1",n:"Engineering",ch:["General","Code Review","Deployments","Standup"],mem:["u01","u10"],prv:false,owner:"u10"},
  {id:"tm2",n:"Marketing",ch:["General","Campaigns","Analytics","Content"],mem:["u02","u09"],prv:false,owner:"u02"},
  {id:"tm3",n:"Sales",ch:["General","Pipeline","Deals","Reports"],mem:["u03","u11"],prv:false,owner:"u11"},
  {id:"tm4",n:"All Company",ch:["General","Announcements","Social","IT Help"],mem:["u01","u02","u03","u04","u05","u06","u07","u10","u11","u12"],prv:false,owner:"u06"},
  {id:"tm5",n:"IT Helpdesk",ch:["General","Tickets","Escalations"],mem:["u06"],prv:false,owner:"u06"},
  {id:"tm6",n:"Leadership",ch:["General","Strategy","Board Prep"],mem:["u02","u05","u06","u07","u11"],prv:true,owner:"u05"},
  {id:"tm7",n:"Finance",ch:["General","Reporting","Audit"],mem:["u05","u12"],prv:true,owner:"u05"},
  {id:"tm8",n:"HR",ch:["General","Recruiting","Onboarding"],mem:["u04"],prv:false,owner:"u04"},
];

const SEED_SP = [
  {id:"sp1",n:"Engineering Hub",sz:8.2,qt:25,mem:["u01","u10"],visitors:["u06"]},
  {id:"sp2",n:"Marketing Portal",sz:4.1,qt:25,mem:["u02","u09"],visitors:[]},
  {id:"sp3",n:"HR Intranet",sz:2.3,qt:25,mem:["u04"],visitors:["u06"]},
  {id:"sp4",n:"Finance Reports",sz:18.7,qt:25,mem:["u05","u12"],visitors:["u07"]},
  {id:"sp5",n:"Sales Dashboard",sz:6.9,qt:25,mem:["u03","u11"],visitors:[]},
  {id:"sp6",n:"Company Intranet",sz:11.4,qt:50,mem:["u01","u02","u03","u04","u05","u06","u07"],visitors:[]},
  {id:"sp7",n:"Legal Vault",sz:24.1,qt:25,mem:["u07"],visitors:[]},
];

const SEED_CA = [
  {id:"ca1",n:"Require MFA - Admins",st:"On",c:"Admin roles",g:"Require MFA"},
  {id:"ca2",n:"Block Legacy Auth",st:"On",c:"All users, legacy clients",g:"Block"},
  {id:"ca3",n:"Require Compliant Device",st:"On",c:"All users, cloud apps",g:"Compliant OR MFA"},
  {id:"ca4",n:"Block High-Risk Sign-ins",st:"On",c:"High risk sign-ins",g:"Block"},
  {id:"ca5",n:"MFA External Networks",st:"Report-only",c:"Outside trusted IPs",g:"Require MFA"},
  {id:"ca6",n:"Block Countries",st:"On",c:"RU, KP, IR",g:"Block"},
];

const SEED_DLP = [
  {id:"dlp1",n:"Credit Card Detection",st:"Enforcing",ma:12},
  {id:"dlp2",n:"PII/SSN Protection",st:"Enforcing",ma:3},
  {id:"dlp3",n:"Financial Data",st:"Enforcing",ma:28},
  {id:"dlp4",n:"Source Code Leak",st:"Test",ma:5},
  {id:"dlp5",n:"GDPR Personal Data",st:"Enforcing",ma:19},
];

const LICS = [{n:"Microsoft 365 E5",t:25,c:"$57"},{n:"Microsoft 365 E3",t:40,c:"$36"},{n:"Microsoft 365 F3",t:20,c:"$8"},{n:"Entra ID P2",t:25,c:"$9"}];
const ROOMS = [{id:"rm1",n:"London Board Room",loc:"London F12",cap:20,autoAccept:true,allowConflicts:false},{id:"rm2",n:"Seattle Huddle A",loc:"Seattle F3",cap:6,autoAccept:true,allowConflicts:true},{id:"rm3",n:"NY Conference 1",loc:"New York F8",cap:12,autoAccept:false,allowConflicts:false}];
const SHARED_MBX = [{id:"sm1",n:"info@contoso.com",mem:["u01","u02","u06"],sz:4.2,sendAs:["u06"]},{id:"sm2",n:"support@contoso.com",mem:["u06"],sz:12.8,sendAs:["u06"]},{id:"sm3",n:"hr@contoso.com",mem:["u04"],sz:8.1,sendAs:["u04"]},{id:"sm4",n:"billing@contoso.com",mem:["u05","u12"],sz:15.3,sendAs:["u05"]}];

// ═══════ TICKET TEMPLATES WITH VALIDATION ═══════
// Each ticket has `checks`: functions that verify real state changes
// `su` = subject user name used in ticket text
const DEPTS = ["Engineering","Marketing","Sales","HR","Finance","IT","Legal","Operations"];
const NAMES = ["Lucas Fischer","Jade Wong","Dmitri Volkov","Isabella Costa","Hiroshi Yamamoto","Elena Petrov","Fatima Al-Rashid","Samuel Adeyemi","Olivia Barnes","Noah Kessler"];
const LOCS = ["Moscow","Lagos","Pyongyang","Unknown (Tor)","São Paulo","Mumbai"];

function mkTickets(users, teams, spSites, sharedMbx, rooms) {
  const active = users.filter(u => u.ac && !u.blocked);
  const noMfa = users.filter(u => u.ac && !u.mfa);
  const risky = users.filter(u => u.ri !== "None" && u.ac);
  const templates = [];

  // ── ONBOARDING: Create a new user ──
  const nn = pick(NAMES); const ndp = pick(DEPTS);
  templates.push({
    c:"AAD",p:"High",
    ti:`Onboard new hire: ${nn} in ${ndp}`,
    de:`New employee ${nn} starting Monday in ${ndp}. Create cloud account, assign E3 license, verify they appear in the user list.`,
    h:"Go to Admin → AAD → Users → Create User. Fill in name, email, dept, set license to E3.",
    checks: us => us.some(u => u.n === nn && u.dp === ndp && u.ac),
    checkLabel: `User "${nn}" exists in ${ndp} with active account`,
    sla: 120,
  });

  // ── BLOCK + RESET: Compromised account ──
  if (risky.length > 0) {
    const ru = pick(risky);
    templates.push({
      c:"Sec",p:"Critical",
      ti:`Suspicious sign-in: ${ru.n} from ${pick(LOCS)}`,
      de:`High-risk sign-in detected. Block sign-in, revoke sessions, reset password for ${ru.n}.`,
      h:"Go to Admin → AAD → Users → find user → Block Sign-in, Revoke Sessions, Reset Password.",
      checks: us => { const u = us.find(x=>x.id===ru.id); return u && u.blocked && u.sessions === 0 && u.pw === td(); },
      checkLabel: `${ru.n}: blocked + sessions revoked + password reset`,
      sla: 30,
    });
  }

  // ── MFA RESET ──
  if (active.length > 0) {
    const mu = pick(active.filter(u=>u.mfa) || active);
    templates.push({
      c:"AAD",p:"Medium",
      ti:`${mu.n} MFA reset — new device`,
      de:`${mu.n} replaced phone. Can't sign in. Reset MFA methods so they can re-register.`,
      h:"Go to Admin → AAD → Users → find user → Reset MFA. This clears their methods.",
      checks: us => { const u = us.find(x=>x.id===mu.id); return u && !u.mfa && u.mm === "None"; },
      checkLabel: `${mu.n}: MFA cleared (method = None)`,
      sla: 120,
    });
  }

  // ── LICENSE CHANGE ──
  if (active.length > 0) {
    const lu = pick(active.filter(u=>u.li==="E5") || active);
    templates.push({
      c:"AAD",p:"Low",
      ti:`${lu.n} license downgrade E5 → E3`,
      de:`Manager approved downgrade for ${lu.n}. Change license from E5 to E3.`,
      h:"Go to Admin → AAD → Users → find user → Change License dropdown to E3.",
      checks: us => { const u = us.find(x=>x.id===lu.id); return u && u.li === "E3"; },
      checkLabel: `${lu.n}: license changed to E3`,
      sla: 480,
    });
  }

  // ── OFFBOARD: Disable + convert mailbox ──
  if (active.length > 1) {
    const ou = pick(active.filter(u => !["u06","u05"].includes(u.id)));
    if (ou) templates.push({
      c:"AAD",p:"High",
      ti:`Offboard: ${ou.n} — immediate termination`,
      de:`${ou.n} terminated. Block sign-in, revoke sessions, convert mailbox to shared.`,
      h:"Block sign-in, revoke sessions, then toggle 'Shared Mailbox' on the user.",
      checks: us => { const u = us.find(x=>x.id===ou.id); return u && u.blocked && u.sessions===0 && u.sharedMbx; },
      checkLabel: `${ou.n}: blocked + sessions=0 + shared mailbox`,
      sla: 60,
    });
  }

  // ── MAILBOX FULL ──
  const fullMbx = users.filter(u => u.ac && u.mbU/u.mb > 0.9);
  if (fullMbx.length > 0) {
    const fu = pick(fullMbx);
    templates.push({
      c:"Exch",p:"Critical",
      ti:`${fu.n} mailbox full — NDRs bouncing`,
      de:`${fu.n} at ${fu.mbU}/${fu.mb}GB. Enable Online Archive to fix.`,
      h:"Go to Admin → AAD → Users → find user → toggle Archive On.",
      checks: us => { const u = us.find(x=>x.id===fu.id); return u && u.archiveOn; },
      checkLabel: `${fu.n}: archive enabled`,
      sla: 30,
    });
  }

  // ── SP ACCESS DENIED ──
  if (active.length > 0 && spSites.length > 0) {
    const su = pick(active); const ss = pick(spSites.filter(s => !s.mem.includes(su.id)));
    if (ss) templates.push({
      c:"SP",p:"High",
      ti:`${su.n} Access Denied on ${ss.n}`,
      de:`${su.n} gets 403 on ${ss.n}. Add them as a member.`,
      h:"Go to Admin → SharePoint → find site → Add Member.",
      checks: (_,__,sp) => { const s = sp.find(x=>x.id===ss.id); return s && s.mem.includes(su.id); },
      checkLabel: `${su.n} added to ${ss.n} members`,
      sla: 120,
    });
  }

  // ── TEAMS: Add member ──
  if (active.length > 0 && teams.length > 0) {
    const tu = pick(active); const tt = pick(teams.filter(t => !t.mem.includes(tu.id)));
    if (tt) templates.push({
      c:"Teams",p:"Medium",
      ti:`Add ${tu.n} to ${tt.n} team`,
      de:`${tu.n} needs access to the ${tt.n} team. Add them as a member.`,
      h:"Go to Admin → Teams → find team → Add Member.",
      checks: (_,tm) => { const t = tm.find(x=>x.id===tt.id); return t && t.mem.includes(tu.id); },
      checkLabel: `${tu.n} added to ${tt.n}`,
      sla: 120,
    });
  }

  // ── SHARED MAILBOX ACCESS ──
  if (active.length > 0 && sharedMbx.length > 0) {
    const su2 = pick(active); const sm = pick(sharedMbx.filter(s => !s.mem.includes(su2.id)));
    if (sm) templates.push({
      c:"Exch",p:"High",
      ti:`${su2.n} can't access ${sm.n}`,
      de:`${su2.n} reports shared mailbox ${sm.n} not showing. Grant Full Access.`,
      h:"Go to Admin → Exchange → Shared Mailboxes → find mailbox → Add Member.",
      checks: (_,__,___,mbx) => { const m = mbx.find(x=>x.id===sm.id); return m && m.mem.includes(su2.id); },
      checkLabel: `${su2.n} granted access to ${sm.n}`,
      sla: 120,
    });
  }

  // ── ROOM DOUBLE BOOKING ──
  const badRoom = rooms.find(r => r.allowConflicts);
  if (badRoom) templates.push({
    c:"Exch",p:"High",
    ti:`Meeting room ${badRoom.n} double-booking`,
    de:`${badRoom.n} accepted overlapping bookings. Disable AllowConflicts.`,
    h:"Go to Admin → Exchange → Rooms → find room → set Allow Conflicts to Off.",
    checks: (_,__,___,____,rm) => { const r = rm.find(x=>x.id===badRoom.id); return r && !r.allowConflicts; },
    checkLabel: `${badRoom.n}: allowConflicts = false`,
    sla: 120,
  });

  // ── ENABLE MFA on user with none ──
  if (noMfa.length > 0) {
    const mu2 = pick(noMfa);
    templates.push({
      c:"Sec",p:"High",
      ti:`Enable MFA for ${mu2.n}`,
      de:`${mu2.n} has no MFA registered. Security audit requires MFA for all active users. Enable Authenticator.`,
      h:"Go to Admin → AAD → Users → find user → Enable MFA.",
      checks: us => { const u = us.find(x=>x.id===mu2.id); return u && u.mfa; },
      checkLabel: `${mu2.n}: MFA enabled`,
      sla: 240,
    });
  }

  // ── SP QUOTA ──
  const fullSP = spSites.filter(s => s.sz/s.qt > 0.85);
  if (fullSP.length > 0) {
    const fs = pick(fullSP);
    templates.push({
      c:"SP",p:"Critical",
      ti:`${fs.n} storage quota near limit`,
      de:`${fs.n} at ${fs.sz}/${fs.qt}GB. Increase quota to 50GB.`,
      h:"Go to Admin → SharePoint → find site → Increase Quota.",
      checks: (_,__,sp) => { const s = sp.find(x=>x.id===fs.id); return s && s.qt >= 50; },
      checkLabel: `${fs.n}: quota >= 50GB`,
      sla: 60,
    });
  }

  return templates;
}

// ═══════ MAIN APP ═══════
export default function App() {
  // ── Mutable tenant state ──
  const [users, setUsers] = useState(SEED_USERS.map(u=>({...u})));
  const [teams, setTeams] = useState(SEED_TEAMS.map(t=>({...t,ch:[...t.ch],mem:[...t.mem]})));
  const [spSites, setSP] = useState(SEED_SP.map(s=>({...s,mem:[...s.mem],visitors:[...s.visitors]})));
  const [caP, setCA] = useState(SEED_CA.map(c=>({...c})));
  const [dlpP, setDLP] = useState(SEED_DLP.map(d=>({...d})));
  const [sMbx, setSMbx] = useState(SHARED_MBX.map(m=>({...m,mem:[...m.mem],sendAs:[...m.sendAs]})));
  const [roomList, setRooms] = useState(ROOMS.map(r=>({...r})));

  // ── Tickets ──
  const [tickets, setTickets] = useState([]);
  const [closed, setClosed] = useState([]);
  const [score, setScore] = useState({r:0,ok:0,bad:0,pt:0});

  // ── UI state ──
  const [pg, setPg] = useState("dash");
  const [selTk, setSelTk] = useState(null);
  const [at, setAt] = useState("users"); // admin tab
  const [toast, setToast] = useState(null);
  const [actLog, setLog] = useState([]);
  const [sp, setSp] = useState(1);
  const [pa, setPa] = useState(false);

  // ── Forms ──
  const [newUser, setNewUser] = useState({n:"",e:"",dp:"Engineering",ti:"",lo:"London",li:"E3"});
  const [addMem, setAddMem] = useState({});
  const [selUser, setSelUser] = useState(null);

  const usersRef = useRef(users); usersRef.current = users;
  const teamsRef = useRef(teams); teamsRef.current = teams;
  const spRef = useRef(spSites); spRef.current = spSites;
  const mbxRef = useRef(sMbx); mbxRef.current = sMbx;
  const roomsRef = useRef(roomList); roomsRef.current = roomList;
  const ticketsRef = useRef(tickets); ticketsRef.current = tickets;

  const nfy = useCallback((m, t="i") => { setToast({m,t,k:Date.now()}); setTimeout(()=>setToast(null), 3000); }, []);
  const log = m => setLog(p => [{m,t:Date.now()}, ...p].slice(0,80));

  // ═══════ ADMIN ACTIONS (modify real state) ═══════
  const modUser = (id, changes) => { setUsers(p => p.map(u => u.id===id ? {...u,...changes} : u)); log("✏️ "+id+": "+Object.keys(changes).join(",")); };
  const createUser = () => {
    if (!newUser.n || !newUser.e) return nfy("Name and email required","w");
    const id = "u"+String(users.length+10);
    const u = {id,n:newUser.n,e:newUser.e+"@contoso.com",dp:newUser.dp,ti:newUser.ti||"Employee",lo:newUser.lo,li:newUser.li,ac:true,mfa:false,mm:"None",ri:"None",mb:newUser.li==="F3"?2:50,mbU:0,co:"Compliant",pw:td(),src:"Cloud",sspr:false,blocked:false,sharedMbx:false,fwd:"",archiveOn:false,oofExt:false,sessions:0};
    setUsers(p=>[...p,u]); setNewUser({n:"",e:"",dp:"Engineering",ti:"",lo:"London",li:"E3"});
    nfy("✅ Created "+u.n,"s"); log("👤 Created "+u.n+" ("+u.dp+", "+u.li+")");
  };
  const blockUser = id => modUser(id, {blocked:true});
  const unblockUser = id => modUser(id, {blocked:false});
  const revokeSessions = id => modUser(id, {sessions:0});
  const resetPw = id => modUser(id, {pw:td()});
  const resetMfa = id => modUser(id, {mfa:false, mm:"None"});
  const enableMfa = id => modUser(id, {mfa:true, mm:"Authenticator"});
  const toggleArchive = id => setUsers(p=>p.map(u=>u.id===id?{...u,archiveOn:!u.archiveOn}:u));
  const toggleShared = id => setUsers(p=>p.map(u=>u.id===id?{...u,sharedMbx:!u.sharedMbx}:u));
  const changeLic = (id,li) => modUser(id, {li, mb:li==="E5"?100:li==="F3"?2:50});
  const changeRisk = (id,ri) => modUser(id, {ri});
  const setFwd = (id,fwd) => modUser(id, {fwd});
  const toggleOofExt = id => setUsers(p=>p.map(u=>u.id===id?{...u,oofExt:!u.oofExt}:u));

  // Teams actions
  const addTeamMember = (tid,uid) => setTeams(p=>p.map(t=>t.id===tid&&!t.mem.includes(uid)?{...t,mem:[...t.mem,uid]}:t));
  const rmTeamMember = (tid,uid) => setTeams(p=>p.map(t=>t.id===tid?{...t,mem:t.mem.filter(m=>m!==uid)}:t));
  const addTeamChannel = (tid,ch) => { if(!ch) return; setTeams(p=>p.map(t=>t.id===tid?{...t,ch:[...t.ch,ch]}:t)); };
  const createTeam = (n,owner) => { if(!n) return; setTeams(p=>[...p,{id:"tm"+Date.now(),n,ch:["General"],mem:[owner],prv:false,owner}]); nfy("✅ Team "+n+" created","s"); log("💬 Created team "+n); };

  // SP actions
  const addSPMem = (sid,uid) => setSP(p=>p.map(s=>s.id===sid&&!s.mem.includes(uid)?{...s,mem:[...s.mem,uid]}:s));
  const rmSPMem = (sid,uid) => setSP(p=>p.map(s=>s.id===sid?{...s,mem:s.mem.filter(m=>m!==uid)}:s));
  const setSPQuota = (sid,qt) => setSP(p=>p.map(s=>s.id===sid?{...s,qt}:s));

  // Exchange actions
  const addMbxMem = (mid,uid) => setSMbx(p=>p.map(m=>m.id===mid&&!m.mem.includes(uid)?{...m,mem:[...m.mem,uid]}:m));
  const rmMbxMem = (mid,uid) => setSMbx(p=>p.map(m=>m.id===mid?{...m,mem:m.mem.filter(x=>x!==uid)}:m));
  const toggleRoomConflict = rid => setRooms(p=>p.map(r=>r.id===rid?{...r,allowConflicts:!r.allowConflicts}:r));

  // CA / DLP actions
  const toggleCA = cid => setCA(p=>p.map(c=>c.id===cid?{...c,st:c.st==="On"?"Report-only":c.st==="Report-only"?"Off":"On"}:c));
  const toggleDLP = did => setDLP(p=>p.map(d=>d.id===did?{...d,st:d.st==="Enforcing"?"Test":d.st==="Test"?"Off":"Enforcing"}:d));

  // ═══════ TICKET SYSTEM ═══════
  // Generate initial tickets
  useEffect(() => {
    const tpls = mkTickets(usersRef.current, teamsRef.current, spRef.current, mbxRef.current, roomsRef.current);
    const init = tpls.slice(0,4).map(t => ({...t, id:gid(), status:"Open", cr:Date.now(), breach:false}));
    setTickets(init);
  }, []);

  // Spawn new tickets periodically
  useEffect(() => {
    if (pa) return;
    const iv = setInterval(() => {
      if (ticketsRef.current.filter(t=>t.status!=="Resolved").length < 12) {
        const tpls = mkTickets(usersRef.current, teamsRef.current, spRef.current, mbxRef.current, roomsRef.current);
        if (tpls.length > 0) {
          const t = {...pick(tpls), id:gid(), status:"Open", cr:Date.now(), breach:false};
          setTickets(p => [t, ...p]);
          nfy("🎫 "+t.ti.slice(0,45),"w");
        }
      }
    }, (25000 + Math.random()*25000)/sp);
    return () => clearInterval(iv);
  }, [pa, sp, nfy]);

  // SLA breach checker
  useEffect(() => {
    const iv = setInterval(() => {
      setTickets(p => p.map(t => {
        if (t.status === "Resolved") return t;
        if ((Date.now()-t.cr)/60000 > t.sla && !t.breach) return {...t, breach:true};
        return t;
      }));
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  // ── Auto-validate tickets against current state ──
  useEffect(() => {
    const iv = setInterval(() => {
      setTickets(prev => {
        let changed = false;
        const next = prev.map(t => {
          if (t.status === "Resolved") return t;
          let pass = false;
          try { pass = t.checks(usersRef.current, teamsRef.current, spRef.current, mbxRef.current, roomsRef.current); } catch(e){}
          if (pass && t.status !== "Validated") { changed = true; return {...t, status:"Validated"}; }
          return t;
        });
        return changed ? next : prev;
      });
    }, 1500);
    return () => clearInterval(iv);
  }, []);

  const resolveTicket = id => {
    const t = tickets.find(x=>x.id===id);
    if (!t || t.status !== "Validated") return nfy("Complete the required action first!","w");
    const inSla = (Date.now()-t.cr)/60000 <= t.sla;
    const pts = ({Critical:50,High:30,Medium:20,Low:10}[t.p]||10) * (inSla?1.5:1);
    setTickets(p => p.map(x => x.id===id ? {...x, status:"Resolved"} : x));
    setScore(p => ({r:p.r+1, ok:p.ok+(inSla?1:0), bad:p.bad+(inSla?0:1), pt:p.pt+pts}));
    nfy("✅ "+id+(inSla?" +SLA bonus":""),"s"); log("✅ Resolved "+id);
  };
  const closeTicket = id => {
    const t = tickets.find(x=>x.id===id);
    if (!t || t.status!=="Resolved") return;
    setClosed(p=>[{...t,status:"Closed"},...p]); setTickets(p=>p.filter(x=>x.id!==id)); log("📁 Closed "+id);
  };

  const oN = tickets.filter(t=>t.status==="Open"||t.status==="Validated").length;
  const cN = tickets.filter(t=>t.p==="Critical"&&t.status!=="Resolved").length;
  const bN = tickets.filter(t=>t.breach&&t.status!=="Resolved").length;

  // ═══════ USER DETAIL PANEL ═══════
  const UserDetail = ({u}) => {
    if (!u) return null;
    return <div style={{...cd,borderLeft:"4px solid "+X.a}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>{av(u,28)}<div><div style={{fontWeight:700,fontSize:14}}>{u.n}</div><div style={{fontSize:10,color:X.t3}}>{u.e} · {u.dp} · {u.ti}</div></div></div>
        <button onClick={()=>setSelUser(null)} style={bo()}>✕</button>
      </div>
      <div style={g2}>
        <div>
          {kv("Status",u.blocked?"Blocked":u.ac?"Active":"Disabled",u.blocked?X.er:u.ac?X.ok:X.t3)}
          {kv("License",u.li,X.a)}
          {kv("MFA",u.mfa?"On ("+u.mm+")":"Off",u.mfa?X.ok:X.er)}
          {kv("Risk",u.ri,u.ri==="None"?X.ok:u.ri==="High"?X.er:X.wn)}
          {kv("Compliance",u.co,u.co==="Compliant"?X.ok:X.er)}
          {kv("SSPR",u.sspr?"Yes":"No",u.sspr?X.ok:X.er)}
          {kv("Source",u.src)}
        </div>
        <div>
          {kv("Mailbox",u.mbU+"/"+u.mb+"GB")}
          {kv("Archive",u.archiveOn?"On":"Off",u.archiveOn?X.ok:X.t3)}
          {kv("Shared Mbx",u.sharedMbx?"Yes":"No")}
          {kv("Forwarding",u.fwd||"None")}
          {kv("OOF External",u.oofExt?"Yes":"No")}
          {kv("Sessions",String(u.sessions))}
          {kv("Password Changed",u.pw)}
        </div>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:8}}>
        {!u.blocked ? <button onClick={()=>{blockUser(u.id);nfy("Blocked "+u.n,"s")}} style={bt(X.er)}>🚫 Block</button>
                    : <button onClick={()=>{unblockUser(u.id);nfy("Unblocked "+u.n,"s")}} style={bt(X.ok)}>✅ Unblock</button>}
        <button onClick={()=>{revokeSessions(u.id);nfy("Sessions revoked","s")}} style={bt(X.wn)}>🔄 Revoke Sessions</button>
        <button onClick={()=>{resetPw(u.id);nfy("Password reset","s")}} style={bt(X.a)}>🔑 Reset Password</button>
        {u.mfa ? <button onClick={()=>{resetMfa(u.id);nfy("MFA cleared","s")}} style={bt("#f97316")}>🔓 Reset MFA</button>
               : <button onClick={()=>{enableMfa(u.id);nfy("MFA enabled","s")}} style={bt(X.ok)}>🔐 Enable MFA</button>}
        <button onClick={()=>{toggleArchive(u.id);nfy("Archive toggled","s")}} style={bo()}>📦 {u.archiveOn?"Disable":"Enable"} Archive</button>
        <button onClick={()=>{toggleShared(u.id);nfy("Shared mailbox toggled","s")}} style={bo()}>📧 {u.sharedMbx?"Unshare":"Share"} Mailbox</button>
        <button onClick={()=>{toggleOofExt(u.id)}} style={bo()}>✈️ OOF Ext {u.oofExt?"Off":"On"}</button>
        <select value={u.li} onChange={e=>{changeLic(u.id,e.target.value);nfy("License → "+e.target.value,"s")}} style={{...sel,width:80}}>
          <option value="E5">E5</option><option value="E3">E3</option><option value="F3">F3</option>
        </select>
        <select value={u.ri} onChange={e=>{changeRisk(u.id,e.target.value)}} style={{...sel,width:90}} title="Set risk level">
          <option value="None">Risk: None</option><option value="Low">Risk: Low</option><option value="Medium">Risk: Medium</option><option value="High">Risk: High</option>
        </select>
      </div>
    </div>;
  };

  // ═══════ ADMIN PANELS ═══════
  const AdminPanel = () => (<div>
    <h2 style={{margin:"0 0 8px",fontSize:15}}>🏢 Admin Center — Interactive</h2>
    <div style={{display:"flex",gap:2,marginBottom:10,flexWrap:"wrap"}}>{[
      {k:"users",l:"🔐 Users"},{k:"teams",l:"💬 Teams"},{k:"sp",l:"📄 SharePoint"},
      {k:"exch",l:"📧 Exchange"},{k:"ca",l:"🔒 Policies"},{k:"lic",l:"📋 Licenses"},
    ].map(t=><button key={t.k} onClick={()=>setAt(t.k)} style={nb(at===t.k)}>{t.l}</button>)}</div>

    {/* ═══ USERS ═══ */}
    {at==="users" && <div>
      {selUser && <UserDetail u={users.find(x=>x.id===selUser)} />}
      {/* Create User Form */}
      <div style={{...cd,borderLeft:"3px solid "+X.ok}}>
        <div style={{fontWeight:600,fontSize:12,marginBottom:6}}>➕ Create User</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4}}>
          <input placeholder="Full Name" value={newUser.n} onChange={e=>setNewUser(p=>({...p,n:e.target.value}))} style={ip} />
          <div style={{display:"flex",alignItems:"center"}}><input placeholder="email prefix" value={newUser.e} onChange={e=>setNewUser(p=>({...p,e:e.target.value}))} style={{...ip,borderRadius:"5px 0 0 5px"}} /><span style={{padding:"5px 6px",background:X.pb,borderRadius:"0 5px 5px 0",fontSize:10,color:X.t3,whiteSpace:"nowrap"}}>@contoso.com</span></div>
          <input placeholder="Job Title" value={newUser.ti} onChange={e=>setNewUser(p=>({...p,ti:e.target.value}))} style={ip} />
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr auto",gap:4,marginTop:4}}>
          <select value={newUser.dp} onChange={e=>setNewUser(p=>({...p,dp:e.target.value}))} style={sel}>{DEPTS.map(d=><option key={d} value={d}>{d}</option>)}</select>
          <select value={newUser.lo} onChange={e=>setNewUser(p=>({...p,lo:e.target.value}))} style={sel}>{["London","Seattle","New York","Berlin","Tokyo","Sydney"].map(l=><option key={l} value={l}>{l}</option>)}</select>
          <select value={newUser.li} onChange={e=>setNewUser(p=>({...p,li:e.target.value}))} style={sel}><option value="E5">E5</option><option value="E3">E3</option><option value="F3">F3</option></select>
          <div/>
          <button onClick={createUser} style={bt(X.ok)}>Create</button>
        </div>
      </div>
      {/* User List */}
      <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
        <thead><tr style={{background:X.bg}}>{["","User","Dept","License","Status","MFA","Risk","Mailbox","Actions"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
        <tbody>{users.map(u=><tr key={u.id} style={{cursor:"pointer"}} onClick={()=>setSelUser(u.id)}>
          <td style={td2}>{av(u,16)}</td>
          <td style={td2}><div style={{fontWeight:600}}>{u.n}</div><div style={{fontSize:8,color:X.t4}}>{u.e}</div></td>
          <td style={td2}>{u.dp}</td>
          <td style={td2}><span style={bg2(X.a)}>{u.li}</span></td>
          <td style={td2}><span style={bg2(u.blocked?X.er:u.ac?X.ok:X.t3)}>{u.blocked?"Blocked":u.ac?"Active":"Off"}</span></td>
          <td style={td2}><span style={bg2(u.mfa?X.ok:X.er)}>{u.mfa?"On":"Off"}</span></td>
          <td style={td2}><span style={bg2(u.ri==="None"?X.ok:u.ri==="High"?X.er:X.wn)}>{u.ri}</span></td>
          <td style={td2}>{bar(u.mbU,u.mb,X.Exch)}</td>
          <td style={td2}><button onClick={e=>{e.stopPropagation();setSelUser(u.id)}} style={bo(X.a)}>Manage</button></td>
        </tr>)}</tbody>
      </table></div>
    </div>}

    {/* ═══ TEAMS ═══ */}
    {at==="teams" && <div>
      {teams.map(t=><div key={t.id} style={{...cd,borderLeft:"3px solid "+X.Teams}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
          <div><span style={{fontWeight:700,fontSize:13}}>{t.n}</span>{t.prv&&<span style={bg2(X.wn)}> 🔒 Private</span>}</div>
          <span style={{fontSize:10,color:X.t3}}>Owner: {users.find(u=>u.id===t.owner)?.n || t.owner}</span>
        </div>
        <div style={{fontSize:10,color:X.t2,marginBottom:4}}>Channels: {t.ch.join(", ")}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:4}}>
          {t.mem.map(uid=>{const u=users.find(x=>x.id===uid); return u?<div key={uid} style={{display:"flex",alignItems:"center",gap:3,padding:"2px 6px",background:X.p2,borderRadius:4,fontSize:10}}>{av(u,14)}{u.n}<button onClick={()=>rmTeamMember(t.id,uid)} style={{background:"none",border:"none",color:X.er,cursor:"pointer",fontSize:10}}>✕</button></div>:null})}
        </div>
        <div style={{display:"flex",gap:3}}>
          <select value="" onChange={e=>{if(e.target.value){addTeamMember(t.id,e.target.value);nfy("Added to "+t.n,"s");log("➕ "+t.n+": added member")}}} style={{...sel,flex:1}}>
            <option value="">+ Add member...</option>
            {users.filter(u=>u.ac&&!t.mem.includes(u.id)).map(u=><option key={u.id} value={u.id}>{u.n}</option>)}
          </select>
          <input placeholder="New channel" onKeyDown={e=>{if(e.key==="Enter"&&e.target.value){addTeamChannel(t.id,e.target.value);e.target.value="";}}} style={{...ip,width:130}} />
        </div>
      </div>)}
      <div style={{...cd,borderTop:"3px solid "+X.ok}}>
        <div style={{fontWeight:600,fontSize:12,marginBottom:4}}>➕ Create Team</div>
        <div style={{display:"flex",gap:4}}>
          <input id="newTeamName" placeholder="Team name" style={{...ip,flex:1}} />
          <button onClick={()=>{const el=document.getElementById("newTeamName");if(el.value){createTeam(el.value,"u06");el.value="";}}} style={bt(X.ok)}>Create</button>
        </div>
      </div>
    </div>}

    {/* ═══ SHAREPOINT ═══ */}
    {at==="sp" && <div>
      {spSites.map(s=><div key={s.id} style={{...cd,borderLeft:"3px solid "+X.SP}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
          <span style={{fontWeight:700,fontSize:13}}>{s.n}</span>
          <div style={{display:"flex",gap:3,alignItems:"center"}}>
            <span style={{fontSize:10,color:X.t3}}>{s.sz}/{s.qt}GB</span>
            <button onClick={()=>{setSPQuota(s.id,s.qt+25);nfy("Quota increased","s");log("📄 "+s.n+": +25GB")}} style={bo(X.SP)}>+25GB</button>
          </div>
        </div>
        {bar(s.sz,s.qt,X.SP)}
        <div style={{marginTop:4,fontSize:10,color:X.t3}}>Members:</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:4}}>
          {s.mem.map(uid=>{const u=users.find(x=>x.id===uid); return u?<div key={uid} style={{display:"flex",alignItems:"center",gap:3,padding:"2px 6px",background:X.p2,borderRadius:4,fontSize:10}}>{av(u,14)}{u.n}<button onClick={()=>rmSPMem(s.id,uid)} style={{background:"none",border:"none",color:X.er,cursor:"pointer",fontSize:10}}>✕</button></div>:null})}
        </div>
        <select value="" onChange={e=>{if(e.target.value){addSPMem(s.id,e.target.value);nfy("Added to "+s.n,"s");log("📄 "+s.n+": added member")}}} style={{...sel,width:"100%"}}>
          <option value="">+ Add member...</option>
          {users.filter(u=>u.ac&&!s.mem.includes(u.id)).map(u=><option key={u.id} value={u.id}>{u.n}</option>)}
        </select>
      </div>)}
    </div>}

    {/* ═══ EXCHANGE ═══ */}
    {at==="exch" && <div>
      {hd("📬 Shared Mailboxes")}
      {sMbx.map(m=><div key={m.id} style={{...cd,borderLeft:"3px solid "+X.Exch}}>
        <div style={{fontWeight:700,fontSize:12,marginBottom:4}}>{m.n} <span style={{fontWeight:400,fontSize:10,color:X.t3}}>({m.sz}GB)</span></div>
        <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:4}}>
          {m.mem.map(uid=>{const u=users.find(x=>x.id===uid); return u?<div key={uid} style={{display:"flex",alignItems:"center",gap:3,padding:"2px 6px",background:X.p2,borderRadius:4,fontSize:10}}>{av(u,14)}{u.n}{m.sendAs.includes(uid)&&<span style={bg2(X.wn)}>SendAs</span>}<button onClick={()=>rmMbxMem(m.id,uid)} style={{background:"none",border:"none",color:X.er,cursor:"pointer",fontSize:10}}>✕</button></div>:null})}
        </div>
        <select value="" onChange={e=>{if(e.target.value){addMbxMem(m.id,e.target.value);nfy("Granted access","s");log("📧 "+m.n+": added "+e.target.value)}}} style={{...sel,width:"100%"}}>
          <option value="">+ Grant Full Access...</option>
          {users.filter(u=>u.ac&&!m.mem.includes(u.id)).map(u=><option key={u.id} value={u.id}>{u.n}</option>)}
        </select>
      </div>)}
      {hd("🏢 Meeting Rooms")}
      {roomList.map(r=><div key={r.id} style={{...cd,borderLeft:"3px solid "+(r.allowConflicts?X.er:X.ok)}}>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <div><span style={{fontWeight:700,fontSize:12}}>{r.n}</span><span style={{fontSize:10,color:X.t3,marginLeft:6}}>{r.loc} · Cap: {r.cap}</span></div>
          <div style={{display:"flex",gap:3}}>
            <span style={bg2(r.autoAccept?X.ok:X.t3)}>AutoAccept: {r.autoAccept?"On":"Off"}</span>
            <button onClick={()=>{toggleRoomConflict(r.id);nfy("Updated "+r.n,"s")}} style={bt(r.allowConflicts?X.er:X.ok)}>Conflicts: {r.allowConflicts?"ON ⚠":"Off ✓"}</button>
          </div>
        </div>
      </div>)}
    </div>}

    {/* ═══ POLICIES ═══ */}
    {at==="ca" && <div>
      {hd("🔒 Conditional Access")}
      {caP.map(c=><div key={c.id} style={{...cd,borderLeft:"3px solid "+(c.st==="On"?X.ok:c.st==="Off"?X.er:X.wn)}}>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <div><span style={{fontWeight:700,fontSize:12}}>{c.n}</span></div>
          <button onClick={()=>{toggleCA(c.id);nfy("Policy toggled","s")}} style={bt(c.st==="On"?X.ok:c.st==="Off"?X.er:X.wn)}>{c.st}</button>
        </div>
        <div style={{fontSize:10,marginTop:3}}>{kv("Conditions",c.c)}{kv("Grant",c.g)}</div>
      </div>)}
      {hd("🔏 DLP Policies")}
      {dlpP.map(d=><div key={d.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 8px",borderBottom:"1px solid "+X.pb+"55"}}>
        <span style={{fontWeight:600,fontSize:12}}>{d.n}</span>
        <div style={{display:"flex",gap:3,alignItems:"center"}}>
          <span style={bg2(d.ma>10?X.wn:X.ok)}>{d.ma} matches</span>
          <button onClick={()=>{toggleDLP(d.id)}} style={bt(d.st==="Enforcing"?X.ok:d.st==="Test"?X.wn:X.er)}>{d.st}</button>
        </div>
      </div>)}
    </div>}

    {/* ═══ LICENSES ═══ */}
    {at==="lic" && <div>
      {hd("📋 License Usage")}
      <div style={g2}>{LICS.map(l=>{const used=users.filter(u=>u.li===l.n.replace("Microsoft 365 ","")).length; return <div key={l.n} style={cd}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontWeight:600,fontSize:11}}>{l.n}</span><span style={{fontSize:9,color:X.t3}}>{l.c}/user/mo</span></div>
        {bar(used,l.t,X.a)}<div style={{fontSize:9,color:X.t3,marginTop:2}}>{l.t-used} available</div>
      </div>})}</div>
    </div>}
  </div>);

  // ═══════ DASHBOARD ═══════
  const Dash = () => (<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <div><h2 style={{margin:0,fontSize:17}}>M365 Admin Training Center <span style={{color:X.a}}>v6</span></h2><div style={{fontSize:10,color:X.t3,marginTop:1}}>{TN.name} · {TN.vanity} · Interactive Mode</div></div>
      <div style={{display:"flex",gap:3,alignItems:"center"}}><span style={{fontSize:9,color:X.t3}}>Speed:</span>{[1,2,3].map(s=><button key={s} onClick={()=>setSp(s)} style={bt(sp===s?X.a:X.pb)}>{s}x</button>)}<button onClick={()=>setPa(!pa)} style={bt(pa?X.ok:X.wn)}>{pa?"▶":"⏸"}</button></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:5,marginBottom:10}}>
      {[{l:"Open",v:oN,c:X.wn,i:"📬"},{l:"Critical",v:cN,c:X.er,i:"🚨"},{l:"SLA Breach",v:bN,c:X.cr,i:"⏰"},{l:"Users",v:users.length,c:X.a,i:"👥"},{l:"Resolved",v:score.r,c:X.ok,i:"✅"},{l:"Score",v:Math.floor(score.pt),c:"#8b5cf6",i:"⭐"}].map(s=>(
        <div key={s.l} style={{...cd,borderTop:"3px solid "+s.c,textAlign:"center"}}><div style={{fontSize:9,color:X.t3}}>{s.i} {s.l}</div><div style={{fontSize:20,fontWeight:700}}>{s.v}</div></div>
      ))}
    </div>
    <div style={g2}>
      <div style={cd}><span style={{fontWeight:600,fontSize:12}}>🔐 Identity Summary</span>
        <div style={{marginTop:4,fontSize:10}}>
          {kv("Active Users",users.filter(u=>u.ac).length.toString(),X.ok)}
          {kv("Blocked",users.filter(u=>u.blocked).length.toString(),users.filter(u=>u.blocked).length?X.er:X.ok)}
          {kv("No MFA",users.filter(u=>u.ac&&!u.mfa).length.toString(),users.filter(u=>u.ac&&!u.mfa).length?X.er:X.ok)}
          {kv("Risky Users",users.filter(u=>u.ri!=="None").length.toString(),X.wn)}
          {kv("Non-Compliant",users.filter(u=>u.co!=="Compliant").length.toString(),X.er)}
        </div>
      </div>
      <div style={cd}><span style={{fontWeight:600,fontSize:12}}>📊 Performance</span>
        <div style={{display:"flex",gap:14,margin:"6px 0"}}>
          <div><div style={{fontSize:18,fontWeight:700,color:X.ok}}>{score.ok}</div><div style={{fontSize:9,color:X.t3}}>SLA Met</div></div>
          <div><div style={{fontSize:18,fontWeight:700,color:X.er}}>{score.bad}</div><div style={{fontSize:9,color:X.t3}}>Breached</div></div>
          <div><div style={{fontSize:18,fontWeight:700,color:X.a}}>{score.r>0?Math.round(score.ok/score.r*100):0}%</div><div style={{fontSize:9,color:X.t3}}>Rate</div></div>
        </div>
        <div style={{fontSize:10}}>
          {kv("Teams",teams.length.toString())}
          {kv("SP Sites",spSites.length.toString())}
          {kv("Shared Mailboxes",sMbx.length.toString())}
          {kv("CA Policies Active",caP.filter(c=>c.st==="On").length+"/"+caP.length)}
        </div>
      </div>
    </div>
    {/* Recent tickets */}
    <div style={cd}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontWeight:600,fontSize:12}}>🎫 Active Tickets</span><button onClick={()=>setPg("tk")} style={bo()}>All →</button></div>
      {tickets.filter(t=>t.status!=="Resolved").slice(0,8).map(t=><div key={t.id} onClick={()=>{setSelTk(t.id);setPg("dt")}} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 7px",borderRadius:4,cursor:"pointer",borderBottom:"1px solid "+X.pb+"66"}}>
        <div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:10,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.ti}</div><div style={{fontSize:9,color:X.t4}}>{t.id} · {ago(Date.now()-t.cr)}</div></div>
        <span style={bg2(pC(t.p))}>{t.p}</span>
        <span style={bg2(t.status==="Validated"?X.ok:X.wn)}>{t.status}</span>
        {t.breach&&<span style={bg2(X.er)}>SLA!</span>}
      </div>)}
    </div>
  </div>);

  // ═══════ TICKET LIST ═══════
  const TkList = () => (<div>
    <h2 style={{margin:"0 0 8px",fontSize:15}}>🎫 Ticket Queue ({oN})</h2>
    <div style={{fontSize:10,color:X.t2,marginBottom:8,padding:"4px 8px",background:X.a+"0a",borderRadius:4,borderLeft:"3px solid "+X.a}}>💡 Tickets auto-validate when you perform the required action in the Admin panel. Green "Validated" = ready to resolve.</div>
    {tickets.filter(t=>t.status!=="Resolved").length===0&&<div style={{textAlign:"center",padding:20,color:X.t3}}>No open tickets 🎉</div>}
    {tickets.sort((a,b)=>({Open:0,Validated:0,"In Progress":1,Resolved:2}[a.status]-{Open:0,Validated:0,"In Progress":1,Resolved:2}[b.status])||({Critical:0,High:1,Medium:2,Low:3}[a.p]-{Critical:0,High:1,Medium:2,Low:3}[b.p])).map(t=><div key={t.id} onClick={()=>{setSelTk(t.id);setPg("dt")}} style={{display:"flex",alignItems:"center",gap:5,padding:"6px 8px",borderRadius:4,cursor:"pointer",borderBottom:"1px solid "+X.pb+"55"}}>
      <div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:10,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.ti}</div><div style={{fontSize:9,color:X.t4}}>{t.id} · {t.c} · {ago(Date.now()-t.cr)}</div></div>
      <span style={bg2(pC(t.p))}>{t.p}</span>
      <span style={bg2(t.status==="Validated"?X.ok:t.status==="Resolved"?X.ok:X.wn)}>{t.status}</span>
      {t.breach&&<span style={bg2(X.er)}>SLA!</span>}
      {t.status==="Validated"&&<button onClick={e=>{e.stopPropagation();resolveTicket(t.id)}} style={bt(X.ok)}>Resolve ✓</button>}
      {t.status==="Resolved"&&<button onClick={e=>{e.stopPropagation();closeTicket(t.id)}} style={bt(X.t3)}>Close</button>}
    </div>)}
  </div>);

  // ═══════ TICKET DETAIL ═══════
  const TkDetail = () => {
    const t = tickets.find(x=>x.id===selTk);
    if (!t) return <div><button onClick={()=>setPg("tk")} style={bo()}>← Back</button> <span style={{color:X.t3}}>Not found</span></div>;
    const el = (Date.now()-t.cr)/60000;
    return <div>
      <button onClick={()=>setPg("tk")} style={{...bo(),marginBottom:8}}>← Queue</button>
      <div style={{...cd,borderLeft:"4px solid "+pC(t.p)}}>
        <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap",marginBottom:5}}>
          <span style={{fontSize:9,color:X.t4,fontFamily:"monospace"}}>{t.id}</span>
          <span style={bg2(pC(t.p))}>{t.p}</span>
          <span style={bg2(t.status==="Validated"?X.ok:t.status==="Resolved"?X.ok:X.wn)}>{t.status}</span>
          <span style={{fontSize:10,color:X.t3}}>{t.c}</span>
          {t.breach?<span style={bg2(X.er)}>⚠ SLA BREACH</span>:<span style={bg2(X.ok)}>SLA: {Math.max(0,Math.floor(t.sla-el))}m</span>}
        </div>
        <h3 style={{margin:"0 0 7px",fontSize:14}}>{t.ti}</h3>
        <div style={{padding:7,background:X.bg,borderRadius:4,fontSize:11,lineHeight:1.5,marginBottom:6}}>
          <div style={{color:X.t3,fontSize:8,textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>Description</div>{t.de}
        </div>
        <div style={{padding:7,background:X.a+"0a",borderRadius:4,fontSize:11,borderLeft:"3px solid "+X.a,marginBottom:6}}>
          <div style={{color:X.a,fontSize:8,textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>How to resolve</div>{t.h}
        </div>
        {/* Validation status */}
        <div style={{padding:8,background:t.status==="Validated"?X.ok+"15":t.status==="Resolved"?X.ok+"20":X.wn+"10",borderRadius:6,border:"1px solid "+(t.status==="Validated"?X.ok+"40":t.status==="Resolved"?X.ok+"50":X.wn+"30")}}>
          <div style={{fontSize:10,fontWeight:700,color:t.status==="Validated"?X.ok:t.status==="Resolved"?X.ok:X.wn,marginBottom:2}}>{t.status==="Validated"?"✅ VALIDATED — Action completed!":t.status==="Resolved"?"✅ RESOLVED":"⏳ PENDING — Perform the action in Admin panel"}</div>
          <div style={{fontSize:10,color:X.t2}}>Check: {t.checkLabel}</div>
        </div>
        <div style={{display:"flex",gap:4,marginTop:8}}>
          {t.status==="Validated"&&<button onClick={()=>resolveTicket(t.id)} style={{...bt(X.ok),flex:1,padding:"8px 0",textAlign:"center"}}>✅ Resolve Ticket</button>}
          {t.status!=="Validated"&&t.status!=="Resolved"&&<button onClick={()=>{setPg("admin");setAt(t.c==="AAD"||t.c==="Sec"?"users":t.c==="Teams"?"teams":t.c==="SP"?"sp":t.c==="Exch"?"exch":"users")}} style={{...bt(X.a),flex:1,padding:"8px 0",textAlign:"center"}}>🏢 Go to Admin Panel →</button>}
          {t.status==="Resolved"&&<button onClick={()=>closeTicket(t.id)} style={{...bt(X.t3),flex:1,padding:"8px 0"}}>📁 Close</button>}
        </div>
      </div>
    </div>;
  };

  // ═══════ ROOT LAYOUT ═══════
  return (
    <div style={{fontFamily:"'Segoe UI',-apple-system,sans-serif",background:X.bg,color:X.t1,minHeight:"100vh",display:"flex",flexDirection:"column",fontSize:12}}>
      <style>{`*{box-sizing:border-box;margin:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${X.pb};border-radius:2px}@keyframes si{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes pu{0%,100%{opacity:1}50%{opacity:.4}}tr:hover{background:${X.ph}!important}button:hover{filter:brightness(1.15)}select:hover{border-color:${X.a}}`}</style>
      {/* Nav */}
      <div style={{background:"#070910",borderBottom:"1px solid "+X.pb,padding:"0 14px",display:"flex",alignItems:"center",height:42,gap:10,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:24,height:24,background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,color:"#fff"}}>M</div>
          <div><div style={{fontWeight:700,fontSize:12}}>M365 Admin Sim <span style={{color:X.ok}}>v6</span></div><div style={{fontSize:8,color:X.t4}}>{TN.vanity} · Interactive Training</div></div>
        </div>
        <div style={{display:"flex",gap:1,marginLeft:16}}>
          <button onClick={()=>setPg("dash")} style={nb(pg==="dash")}>📊 Dashboard</button>
          <button onClick={()=>setPg("tk")} style={nb(pg==="tk"||pg==="dt")}>🎫 Tickets{oN>0&&<span style={{marginLeft:2,padding:"0 4px",borderRadius:7,background:X.er,color:"#fff",fontSize:9}}>{oN}</span>}</button>
          <button onClick={()=>setPg("admin")} style={nb(pg==="admin")}>🏢 Admin</button>
        </div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}>
          {cN>0&&<div style={{padding:"2px 6px",borderRadius:4,background:X.er+"20",color:X.er,fontSize:9,fontWeight:600,animation:"pu 1.5s infinite"}}>🚨 {cN}</div>}
          {bN>0&&<div style={{padding:"2px 6px",borderRadius:4,background:X.wn+"20",color:X.wn,fontSize:9,fontWeight:600}}>⏰ {bN}</div>}
          <span style={{fontSize:10,color:X.t2}}>⭐ {Math.floor(score.pt)}</span>
        </div>
      </div>
      {/* Body */}
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        <div style={{flex:1,overflow:"auto",padding:12}}>
          {pg==="dash"&&<Dash/>}{pg==="tk"&&<TkList/>}{pg==="dt"&&<TkDetail/>}{pg==="admin"&&<AdminPanel/>}
        </div>
        {/* Activity sidebar */}
        <div style={{width:170,borderLeft:"1px solid "+X.pb,background:X.p,overflow:"auto",flexShrink:0,padding:8,fontSize:9}}>
          <div style={{fontWeight:700,color:X.t3,fontSize:8,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Activity Log</div>
          {actLog.length===0&&<div style={{color:X.t4}}>Perform actions to see log</div>}
          {actLog.slice(0,20).map((l,i)=><div key={i} style={{padding:"2px 0",borderBottom:"1px solid "+X.pb+"44"}}><div>{l.m}</div><div style={{color:X.t4,fontSize:8}}>{ago(Date.now()-l.t)}</div></div>)}
          <div style={{fontWeight:700,color:X.t3,fontSize:8,textTransform:"uppercase",margin:"8px 0 3px"}}>Closed ({closed.length})</div>
          {closed.slice(0,6).map(t=><div key={t.id} style={{color:X.t4,padding:"1px 0"}}>{t.id}</div>)}
        </div>
      </div>
      {/* Toast */}
      {toast&&<div style={{position:"fixed",bottom:14,right:14,padding:"7px 14px",borderRadius:5,background:toast.t==="s"?X.ok:toast.t==="w"?X.wn:X.a,color:"#fff",fontWeight:600,fontSize:11,zIndex:9999,boxShadow:"0 6px 24px rgba(0,0,0,.5)",animation:"si .3s ease"}}>{toast.m}</div>}
    </div>
  );
}
