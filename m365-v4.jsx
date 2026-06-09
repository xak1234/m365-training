import { useState, useEffect, useCallback, useRef, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════
// CORE UTILS
// ═══════════════════════════════════════════════════════════════
const pick = a => a[Math.floor(Math.random() * a.length)];
const pickN = (a, n) => { const s = [...a].sort(() => Math.random() - .5); return s.slice(0, n); };
const gid = () => "TKT-" + String(Math.floor(10000 + Math.random() * 90000));
const ago = ms => { const m = Math.floor(ms / 60000); if (m < 1) return "now"; if (m < 60) return m + "m"; const h = Math.floor(m / 60); if (h < 24) return h + "h"; return Math.floor(h / 24) + "d"; };
const pct = (a, b) => Math.min(100, Math.round(a / b * 100));
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const fmtDate = d => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
const fmtTime = d => new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

const TENANT = { name: "Contoso Corporation", domain: "contoso.onmicrosoft.com", vanity: "contoso.com", id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", region: "Europe (UK South)", created: "2022-03-15" };

// ═══════════════════════════════════════════════════════════════
// USERS (16)
// ═══════════════════════════════════════════════════════════════
const U = [
  { id:"u01",n:"Sarah Chen",e:"s.chen@contoso.com",dp:"Engineering",ti:"Senior Developer",lo:"Seattle",li:"M365 E5",ac:true,mfa:true,mm:"Authenticator",ri:"None",ro:[""],mb:"50GB",mbU:18.2,tm:true,od:12.4,dv:["DESKTOP-SC01"],co:"Compliant",pw:"2026-02-01",av:"SC",ph:"+1-206-555-0101" },
  { id:"u02",n:"Marcus Williams",e:"m.williams@contoso.com",dp:"Marketing",ti:"Marketing Director",lo:"New York",li:"M365 E5",ac:true,mfa:true,mm:"SMS",ri:"None",ro:[""],mb:"50GB",mbU:32.7,tm:true,od:8.7,dv:["LAPTOP-MW02"],co:"Compliant",pw:"2026-01-15",av:"MW",ph:"+1-212-555-0102" },
  { id:"u03",n:"Emily Rodriguez",e:"e.rodriguez@contoso.com",dp:"Sales",ti:"Account Executive",lo:"New York",li:"M365 E3",ac:true,mfa:false,mm:"None",ri:"Medium",ro:[""],mb:"50GB",mbU:41.3,tm:true,od:3.2,dv:["LAPTOP-ER03"],co:"NonCompliant",pw:"2025-11-20",av:"ER",ph:"+1-212-555-0103" },
  { id:"u04",n:"James O'Brien",e:"j.obrien@contoso.com",dp:"HR",ti:"HR Manager",lo:"London",li:"M365 E3",ac:true,mfa:true,mm:"Authenticator",ri:"None",ro:["User Admin"],mb:"50GB",mbU:14.6,tm:true,od:5.1,dv:["DESKTOP-JO04"],co:"Compliant",pw:"2026-02-20",av:"JO",ph:"+44-20-7946-0104" },
  { id:"u05",n:"Aisha Patel",e:"a.patel@contoso.com",dp:"Finance",ti:"CFO",lo:"London",li:"M365 E5",ac:true,mfa:true,mm:"FIDO2",ri:"None",ro:[""],mb:"100GB",mbU:48.1,tm:true,od:15.8,dv:["LAPTOP-AP05","IPHONE-AP05"],co:"Compliant",pw:"2026-03-01",av:"AP",ph:"+44-20-7946-0105" },
  { id:"u06",n:"David Kim",e:"d.kim@contoso.com",dp:"IT",ti:"IT Director",lo:"Seattle",li:"M365 E5",ac:true,mfa:true,mm:"Authenticator+FIDO2",ri:"None",ro:["Global Admin","Security Admin","Exchange Admin"],mb:"100GB",mbU:22.3,tm:true,od:22.3,dv:["DESKTOP-DK06","LAPTOP-DK06B","IPHONE-DK06"],co:"Compliant",pw:"2026-03-05",av:"DK",ph:"+1-206-555-0106" },
  { id:"u07",n:"Lisa Tanaka",e:"l.tanaka@contoso.com",dp:"Legal",ti:"General Counsel",lo:"Tokyo",li:"M365 E5",ac:true,mfa:true,mm:"Authenticator",ri:"None",ro:["Compliance Admin"],mb:"100GB",mbU:36.4,tm:true,od:9.6,dv:["LAPTOP-LT07"],co:"Compliant",pw:"2026-02-10",av:"LT",ph:"+81-3-1234-0107" },
  { id:"u08",n:"Tom Baker",e:"t.baker@contoso.com",dp:"Operations",ti:"Operations Lead",lo:"Sydney",li:"M365 E3",ac:false,mfa:false,mm:"None",ri:"High",ro:[""],mb:"50GB",mbU:1.2,tm:false,od:1.2,dv:[],co:"NonCompliant",pw:"2025-09-01",av:"TB",ph:"+61-2-9876-0108" },
  { id:"u09",n:"Rachel Foster",e:"r.foster@contoso.com",dp:"Marketing",ti:"Content Writer",lo:"Berlin",li:"M365 F3",ac:true,mfa:false,mm:"None",ri:"Low",ro:[""],mb:"2GB",mbU:1.8,tm:true,od:0.4,dv:["BYOD-RF09"],co:"NonCompliant",pw:"2025-12-15",av:"RF",ph:"+49-30-1234-0109" },
  { id:"u10",n:"Carlos Mendez",e:"c.mendez@contoso.com",dp:"Engineering",ti:"DevOps Lead",lo:"Seattle",li:"M365 E5",ac:true,mfa:true,mm:"Authenticator",ri:"None",ro:["App Admin"],mb:"50GB",mbU:28.9,tm:true,od:18.9,dv:["DESKTOP-CM10","LAPTOP-CM10B"],co:"Compliant",pw:"2026-02-25",av:"CM",ph:"+1-206-555-0110" },
  { id:"u11",n:"Nina Volkov",e:"n.volkov@contoso.com",dp:"Sales",ti:"VP of Sales",lo:"Berlin",li:"M365 E5",ac:true,mfa:true,mm:"SMS",ri:"None",ro:[""],mb:"100GB",mbU:42.1,tm:true,od:7.3,dv:["LAPTOP-NV11","IPHONE-NV11"],co:"Compliant",pw:"2026-01-28",av:"NV",ph:"+49-30-1234-0111" },
  { id:"u12",n:"Kevin Okafor",e:"k.okafor@contoso.com",dp:"Finance",ti:"Accounting Manager",lo:"New York",li:"M365 E3",ac:true,mfa:true,mm:"Authenticator",ri:"None",ro:[""],mb:"50GB",mbU:19.4,tm:true,od:4.5,dv:["DESKTOP-KO12"],co:"Compliant",pw:"2026-02-18",av:"KO",ph:"+1-212-555-0112" },
  { id:"u13",n:"Priya Sharma",e:"p.sharma@contoso.com",dp:"Engineering",ti:"QA Engineer",lo:"London",li:"M365 E3",ac:true,mfa:true,mm:"Authenticator",ri:"None",ro:[""],mb:"50GB",mbU:8.3,tm:true,od:6.7,dv:["LAPTOP-PS13"],co:"Compliant",pw:"2026-03-02",av:"PS",ph:"+44-20-7946-0113" },
  { id:"u14",n:"Alex Turner",e:"a.turner@contoso.com",dp:"IT",ti:"Helpdesk Analyst",lo:"London",li:"M365 E3",ac:true,mfa:true,mm:"Authenticator",ri:"None",ro:["Helpdesk Admin"],mb:"50GB",mbU:5.1,tm:true,od:2.1,dv:["DESKTOP-AT14"],co:"Compliant",pw:"2026-03-04",av:"AT",ph:"+44-20-7946-0114" },
  { id:"u15",n:"Maya Johansson",e:"m.johansson@contoso.com",dp:"HR",ti:"Recruiter",lo:"Berlin",li:"M365 E3",ac:true,mfa:true,mm:"Authenticator",ri:"None",ro:[""],mb:"50GB",mbU:11.2,tm:true,od:3.8,dv:["LAPTOP-MJ15"],co:"Compliant",pw:"2026-02-28",av:"MJ",ph:"+49-30-1234-0115" },
  { id:"u16",n:"Omar Hassan",e:"o.hassan@contoso.com",dp:"Operations",ti:"Logistics Coordinator",lo:"London",li:"M365 F3",ac:true,mfa:false,mm:"None",ri:"Low",ro:[""],mb:"2GB",mbU:1.9,tm:true,od:0.2,dv:["SHARED-OH16"],co:"NonCompliant",pw:"2025-10-10",av:"OH",ph:"+44-20-7946-0116" },
];

// ═══════════════════════════════════════════════════════════════
// TENANT DATA
// ═══════════════════════════════════════════════════════════════
const LICENSES = [
  { name:"Microsoft 365 E5", total:25, used:8, cost:"$57/user/mo" },
  { name:"Microsoft 365 E3", total:40, used:7, cost:"$36/user/mo" },
  { name:"Microsoft 365 F3", total:20, used:2, cost:"$8/user/mo" },
  { name:"Power BI Pro", total:10, used:4, cost:"$10/user/mo" },
  { name:"Visio Plan 2", total:5, used:2, cost:"$15/user/mo" },
  { name:"Project Plan 3", total:5, used:1, cost:"$30/user/mo" },
  { name:"Teams Phone Standard", total:10, used:6, cost:"$8/user/mo" },
  { name:"Defender for Endpoint P2", total:25, used:15, cost:"$5.20/user/mo" },
];

const SERVICE_HEALTH = [
  { svc:"Exchange Online", icon:"📧", status:"Operational", incidents:0, advisory:1 },
  { svc:"SharePoint Online", icon:"📄", status:"Operational", incidents:0, advisory:0 },
  { svc:"Microsoft Teams", icon:"💬", status:"Service degradation", incidents:1, advisory:0 },
  { svc:"Microsoft Entra", icon:"🔐", status:"Operational", incidents:0, advisory:0 },
  { svc:"OneDrive for Business", icon:"☁️", status:"Operational", incidents:0, advisory:1 },
  { svc:"Microsoft Intune", icon:"📱", status:"Operational", incidents:0, advisory:0 },
  { svc:"Microsoft Defender", icon:"🛡️", status:"Operational", incidents:0, advisory:0 },
  { svc:"Power Platform", icon:"⚡", status:"Operational", incidents:0, advisory:0 },
  { svc:"Microsoft Purview", icon:"🔏", status:"Operational", incidents:0, advisory:1 },
  { svc:"Outlook Mobile", icon:"📨", status:"Operational", incidents:0, advisory:0 },
  { svc:"Microsoft Forms", icon:"📝", status:"Operational", incidents:0, advisory:0 },
  { svc:"Microsoft Bookings", icon:"📅", status:"Operational", incidents:0, advisory:0 },
];

const INCIDENTS = [
  { id:"TM842156", svc:"Microsoft Teams", title:"Some users unable to join meetings via Teams desktop client", status:"Investigating", start:"2026-03-10T07:30Z", impact:"Users in Europe may experience intermittent failures joining scheduled meetings", updates:["07:30 - Investigating reports","08:15 - Root cause identified: certificate renewal issue","09:00 - Fix being deployed to EU region"] },
  { id:"EX841990", svc:"Exchange Online", title:"Advisory: Delayed email delivery for messages with large attachments", status:"Advisory", start:"2026-03-09T14:00Z", impact:"Messages over 15MB may experience up to 30-minute delay", updates:["14:00 - Monitoring increased queue depth","16:00 - Queue processing normally, monitoring"] },
  { id:"OD842001", svc:"OneDrive for Business", title:"Advisory: Sync client showing incorrect storage quota", status:"Advisory", start:"2026-03-09T18:00Z", impact:"Cosmetic issue only — actual storage not affected", updates:["18:00 - Identified display issue in sync client v24.015"] },
  { id:"PV842100", svc:"Microsoft Purview", title:"Advisory: DLP policy match reports delayed up to 2 hours", status:"Advisory", start:"2026-03-10T05:00Z", impact:"DLP enforcement is working — reporting dashboard delayed", updates:["05:00 - Investigating report lag","07:00 - Backend processing queue elevated"] },
];

const SHARED_MBX = [
  { id:"sm1",n:"info@contoso.com",mem:["u02","u03","u11"],ac:true,ar:false,sz:4.2 },
  { id:"sm2",n:"support@contoso.com",mem:["u06","u10","u14"],ac:true,ar:true,sz:12.8 },
  { id:"sm3",n:"hr@contoso.com",mem:["u04","u15"],ac:true,ar:false,sz:8.1 },
  { id:"sm4",n:"billing@contoso.com",mem:["u05","u12"],ac:true,ar:false,sz:15.3 },
  { id:"sm5",n:"legal@contoso.com",mem:["u07"],ac:true,ar:false,sz:22.7 },
  { id:"sm6",n:"reception@contoso.com",mem:["u16"],ac:true,ar:true,sz:1.4 },
];

const ROOMS = [
  { id:"r1",n:"London Board Room",e:"boardroom.lon@contoso.com",loc:"London, Floor 12",cap:20,equip:["Teams Room","Whiteboard","Video conf"],booking:"Available" },
  { id:"r2",n:"Seattle Huddle A",e:"huddlea.sea@contoso.com",loc:"Seattle, Floor 3",cap:6,equip:["Teams Room","Display"],booking:"Booked until 15:00" },
  { id:"r3",n:"NY Conference Room 1",e:"conf1.nyc@contoso.com",loc:"New York, Floor 8",cap:12,equip:["Teams Room","Whiteboard","Phone"],booking:"Available" },
  { id:"r4",n:"Berlin Focus Room",e:"focus.ber@contoso.com",loc:"Berlin, Floor 2",cap:4,equip:["Display"],booking:"Booked until 12:00" },
  { id:"r5",n:"Tokyo Meeting Room",e:"meeting.tyo@contoso.com",loc:"Tokyo, Floor 5",cap:8,equip:["Teams Room","Video conf"],booking:"Available" },
];

const TEAMS_D = [
  { id:"t1",n:"Engineering",ch:["General","Project Alpha","Code Reviews","DevOps"],mem:["u01","u10","u06","u13"],pri:1 },
  { id:"t2",n:"Marketing",ch:["General","Campaigns Q1","Brand Assets","Social Media"],mem:["u02","u09"],pri:0 },
  { id:"t3",n:"Sales",ch:["General","Pipeline","Enterprise Deals","Competitors"],mem:["u03","u11"],pri:1 },
  { id:"t4",n:"All Company",ch:["General","Announcements","Social","Kudos"],mem:U.filter(u=>u.ac).map(u=>u.id),pri:0 },
  { id:"t5",n:"IT Helpdesk",ch:["General","Tickets","Knowledge Base"],mem:["u06","u14"],pri:0 },
  { id:"t6",n:"Leadership",ch:["General","Strategy","Board Prep"],mem:["u05","u07","u11","u02","u06"],pri:1 },
  { id:"t7",n:"Finance",ch:["General","Budget","Audit"],mem:["u05","u12"],pri:1 },
  { id:"t8",n:"HR",ch:["General","Recruitment","Onboarding"],mem:["u04","u15"],pri:0 },
];

const SP_D = [
  { id:"sp1",n:"Engineering Hub",u:"/sites/engineering",ow:["u01","u10"],sz:8.2,qt:25 },
  { id:"sp2",n:"Marketing Portal",u:"/sites/marketing",ow:["u02"],sz:4.1,qt:25 },
  { id:"sp3",n:"HR Intranet",u:"/sites/hr",ow:["u04"],sz:2.3,qt:25 },
  { id:"sp4",n:"Finance Reports",u:"/sites/finance",ow:["u05"],sz:18.7,qt:25 },
  { id:"sp5",n:"Sales Dashboard",u:"/sites/sales",ow:["u11"],sz:6.9,qt:25 },
  { id:"sp6",n:"Company Intranet",u:"/sites/intranet",ow:["u06","u02"],sz:11.4,qt:50 },
  { id:"sp7",n:"Legal Vault",u:"/sites/legal",ow:["u07"],sz:24.1,qt:25 },
  { id:"sp8",n:"IT Knowledge Base",u:"/sites/itkb",ow:["u06","u14"],sz:3.7,qt:10 },
];

const CA_POLICIES = [
  { id:"ca1",n:"Require MFA - All Admins",st:"On",cond:"Admin roles",grant:"Require MFA",ex:"Break-glass accounts" },
  { id:"ca2",n:"Block Legacy Authentication",st:"On",cond:"All users, legacy auth clients",grant:"Block",ex:"Service accounts (svc-*)" },
  { id:"ca3",n:"Require Compliant Device",st:"On",cond:"All users, all cloud apps",grant:"Compliant device OR MFA",ex:"Guest accounts" },
  { id:"ca4",n:"Block High-Risk Sign-ins",st:"On",cond:"High risk sign-in",grant:"Block",ex:"None" },
  { id:"ca5",n:"MFA for External Networks",st:"Report-only",cond:"Outside trusted IPs",grant:"Require MFA",ex:"VPN range 10.0.0.0/8" },
  { id:"ca6",n:"App Protection - Mobile",st:"On",cond:"iOS/Android, O365 apps",grant:"Require app protection policy",ex:"IT dept" },
  { id:"ca7",n:"Session Timeout - Sensitive Apps",st:"On",cond:"SharePoint, Exchange",grant:"Sign-in frequency: 4h",ex:"Managed devices" },
  { id:"ca8",n:"Block Countries",st:"On",cond:"Sign-in from: RU, KP, IR, CN",grant:"Block",ex:"Named user exceptions" },
];

const SEC_ALERTS = [
  { id:"sa1",ti:"Impossible travel activity",sv:"High",st:"New",usr:"u08",src:"Identity Protection",t:"2026-03-10T03:50Z",desc:"Sign-in from Sydney then unknown IP in Russia within 8 minutes" },
  { id:"sa2",ti:"Suspicious OAuth app consent",sv:"Medium",st:"New",usr:"u09",src:"Defender for Cloud Apps",t:"2026-03-08T18:50Z",desc:"User consented to 'DataSync Pro' requesting Mail.ReadWrite, Files.ReadWrite.All" },
  { id:"sa3",ti:"Brute force attack detected",sv:"High",st:"InProgress",usr:"u03",src:"Identity Protection",t:"2026-03-10T09:15Z",desc:"47 failed sign-in attempts from 12 different IPs targeting this account" },
  { id:"sa4",ti:"Mailbox forwarding to external",sv:"High",st:"New",usr:"u08",src:"Exchange Online Protection",t:"2026-03-09T11:05Z",desc:"Inbox rule created forwarding all mail to ext.drop@protonmail.com" },
  { id:"sa5",ti:"Mass file download from SharePoint",sv:"Medium",st:"Resolved",usr:"u05",src:"Defender for Cloud Apps",t:"2026-03-09T16:00Z",desc:"Downloaded 312 files from Finance Reports in 22 minutes" },
  { id:"sa6",ti:"Credential harvesting page visited",sv:"High",st:"New",usr:"u16",src:"Defender for Office 365",t:"2026-03-10T08:45Z",desc:"User clicked link to credential harvesting page mimicking M365 login" },
  { id:"sa7",ti:"Unusual admin activity",sv:"Medium",st:"New",usr:"u06",src:"Defender for Cloud Apps",t:"2026-03-10T04:15Z",desc:"Global admin signed in at unusual hour and modified 3 CA policies" },
];

const DLP_D = [
  { n:"Credit Card Detection",st:"Enforcing",sc:"Exchange, SP, OD, Teams",act:"Block + notify",ma:12 },
  { n:"PII / SSN Protection",st:"Enforcing",sc:"Exchange, SP, Teams",act:"Block external",ma:3 },
  { n:"Financial Data",st:"Enforcing",sc:"SP, OD",act:"Encrypt + audit",ma:28 },
  { n:"Source Code Leak",st:"Enforcing",sc:"OD, SP, Teams",act:"Block external + notify",ma:5 },
  { n:"Health Records (HIPAA)",st:"Simulation",sc:"All locations",act:"Audit only",ma:0 },
  { n:"GDPR Personal Data",st:"Enforcing",sc:"Exchange, SP, OD, Teams",act:"Block + encrypt",ma:19 },
];

const INTUNE_D = [
  { n:"DESKTOP-SC01",usr:"u01",os:"Win 11 Pro 23H2",co:"Compliant",en:"BitLocker On",ls:"2026-03-10T08:20Z" },
  { n:"LAPTOP-MW02",usr:"u02",os:"Win 11 Pro 23H2",co:"Compliant",en:"BitLocker On",ls:"2026-03-10T09:00Z" },
  { n:"LAPTOP-ER03",usr:"u03",os:"Win 10 Pro 22H2",co:"NonCompliant",en:"BitLocker Off",ls:"2026-03-09T17:40Z" },
  { n:"BYOD-RF09",usr:"u09",os:"Android 14",co:"NonCompliant",en:"N/A",ls:"2026-03-08T14:25Z" },
  { n:"DESKTOP-DK06",usr:"u06",os:"Win 11 Ent 23H2",co:"Compliant",en:"BitLocker On",ls:"2026-03-10T06:10Z" },
  { n:"LAPTOP-DK06B",usr:"u06",os:"macOS 14.3",co:"Compliant",en:"FileVault On",ls:"2026-03-10T06:12Z" },
  { n:"IPHONE-AP05",usr:"u05",os:"iOS 17.4",co:"Compliant",en:"Encrypted",ls:"2026-03-10T07:50Z" },
  { n:"LAPTOP-PS13",usr:"u13",os:"Win 11 Pro 23H2",co:"Compliant",en:"BitLocker On",ls:"2026-03-10T07:00Z" },
  { n:"SHARED-OH16",usr:"u16",os:"Win 10 Pro 21H2",co:"NonCompliant",en:"BitLocker Off",ls:"2026-03-07T09:00Z" },
  { n:"DESKTOP-AT14",usr:"u14",os:"Win 11 Pro 23H2",co:"Compliant",en:"BitLocker On",ls:"2026-03-10T08:55Z" },
  { n:"IPHONE-DK06",usr:"u06",os:"iOS 17.4",co:"Compliant",en:"Encrypted",ls:"2026-03-10T06:15Z" },
];

const POWER_AUTO = [
  { n:"New Employee Onboarding",owner:"u04",status:"On",runs:48,fails:2,trigger:"When item added to HR list" },
  { n:"Invoice Approval Workflow",owner:"u12",status:"On",runs:156,fails:8,trigger:"When email arrives in billing@" },
  { n:"Daily Sales Report",owner:"u11",status:"On",runs:89,fails:0,trigger:"Recurrence: Daily 8AM" },
  { n:"IT Ticket Escalation",owner:"u06",status:"Suspended",runs:23,fails:12,trigger:"When ticket priority = Critical" },
  { n:"Document Retention Alert",owner:"u07",status:"On",runs:12,fails:0,trigger:"When file nearing retention" },
];

// ═══════════════════════════════════════════════════════════════
// TICKET TEMPLATES (50+)
// ═══════════════════════════════════════════════════════════════
const TPL = [
  // TEAMS
  { c:"Teams",p:"High",t:"{u} error CAA20002 joining meetings",d:"{u} gets 'CAA20002: Token broker could not be reached' on desktop and browser. {dp} colleagues unaffected. Tried clearing credentials.",h:"Check Teams license, clear token cache at %localappdata%/Microsoft/Teams, re-assign license. If persistent, check CA policies for device compliance.",s:["Verify user license in Admin Center","Check Conditional Access sign-in logs","Clear Teams token cache","Re-assign Teams license","Test meeting join"],sl:120 },
  { c:"Teams",p:"Medium",t:"{u} can't see private channel",d:"{u} needs access to private channel in {tm} team. They're a team member but channel doesn't appear.",h:"Private channels require explicit member addition even for team members.",s:["Open Teams Admin Center","Locate private channel","Add user as channel member","Verify channel visible"],sl:480 },
  { c:"Teams",p:"High",t:"{u} Teams calls dropping after 30 seconds",d:"{u} reports all Teams calls (audio and video) disconnect after ~30 seconds. Chat and meetings work. Started today.",h:"Often caused by media relay issues, VPN split-tunneling, or firewall blocking UDP 3478-3481. Check network for Teams media optimization.",s:["Check user's network trace","Verify UDP ports 3478-3481 open","Check VPN split-tunnel config","Review Teams call quality dashboard","Test from different network"],sl:120 },
  { c:"Teams",p:"Low",t:"{u} presence stuck on 'Away'",d:"{u} shows Away permanently even when active. Tried sign-out and reinstall.",h:"Reset presence via PowerShell Set-UserPresence or Graph API.",s:["Run Set-UserPresence reset","Clear all Teams sessions","Have user sign in fresh","Verify status"],sl:1440 },
  { c:"Teams",p:"Medium",t:"Teams Room device offline in {room}",d:"The Teams Room device in {room} shows offline in TAC. Users can't start meetings from the room.",h:"Check device network, restart device, verify license. May need re-provisioning.",s:["Check device in TAC","Verify network connectivity","Remote restart device","Check room mailbox license","Test meeting from room"],sl:480 },
  // SHAREPOINT
  { c:"SharePoint",p:"High",t:"{u} 'Access Denied' on {sp}",d:"{u} gets HTTP 403 Access Denied accessing {sp}. Needs access for current project deadline tomorrow.",h:"Check site permissions. Add to Members or Visitors group. Consider AD group membership.",s:["Check SP site permissions","Verify user's group membership","Add user to appropriate group","Clear browser cache","Test access"],sl:120 },
  { c:"SharePoint",p:"Critical",t:"{sp} storage quota exceeded",d:"{sp} at quota limit. Users getting 'storage space exceeded' errors. Critical business docs can't be uploaded.",h:"Increase quota or clean up. Check version history, recycle bin, and large files.",s:["Review storage analytics","Clean recycle bin","Reduce version limits","Increase site quota","Verify uploads work"],sl:30 },
  { c:"SharePoint",p:"Medium",t:"SP search returning stale results for {dp}",d:"{dp} team reports SharePoint search shows deleted documents and misses recently uploaded files.",h:"Check search crawl schedule, re-index site collection, verify managed properties.",s:["Check crawl status in Search Admin","Request full re-crawl of site","Verify managed properties","Test search after re-crawl"],sl:480 },
  { c:"SharePoint",p:"High",t:"SP workflow broken on {sp}",d:"Power Automate flow triggered by {sp} document library stopped working. Approvals not routing. 15 items stuck.",h:"Check flow run history, verify connections not expired, check SP list threshold (5000 items).",s:["Check flow run history","Re-authorize SP connection","Check list view threshold","Resubmit stuck items","Monitor new submissions"],sl:120 },
  // EXCHANGE
  { c:"Exchange",p:"High",t:"{u} can't access shared mailbox {smb}",d:"{u} reports '{smb}' not showing in Outlook. Error: 'Cannot expand folder. You do not have permission.' Recently added to team.",h:"Grant Full Access (and Send As if needed) in EAC. Auto-mapping may take ~60min. For Outlook desktop, may need to manually add.",s:["Open Exchange Admin Center","Grant Full Access permissions","Enable Send As if requested","Wait 60min for propagation","Add manually if auto-map fails","Verify access"],sl:120 },
  { c:"Exchange",p:"Critical",t:"{u} mailbox full – NDRs bouncing",d:"{u} mailbox at quota (50GB). Sending returns NDR '554 5.2.2 mailbox full'. Receiving external mail also bouncing.",h:"Enable archive mailbox, increase quota, set retention policy, help user clean up.",s:["Enable Online Archive mailbox","Set archive policy to 2-year auto-move","Increase primary quota to 100GB","Help user move old items","Verify send/receive works"],sl:30 },
  { c:"Exchange",p:"Medium",t:"Transport rule disclaimer not applying for {dp}",d:"{dp} external emails missing required legal disclaimer. Transport rule was configured last week but no effect.",h:"Check rule priority, conditions (sender department attribute must match), and ensure rule is enabled.",s:["Review rule in EAC","Verify rule priority order","Check department attribute on users","Fix rule conditions","Send test email"],sl:480 },
  { c:"Exchange",p:"High",t:"{u} not receiving external emails",d:"{u} stopped getting external emails 3 days ago. Internal works. Senders get no NDR. External contacts complaining.",h:"Run message trace, check transport rules, junk/quarantine, connectors, MX records.",s:["Run Message Trace for 7 days","Check quarantine for false positives","Review transport rules","Verify MX records","Check mail flow connectors","Release any quarantined legit mail"],sl:120 },
  { c:"Exchange",p:"Medium",t:"Calendar delegation broken for {u}",d:"{u}'s EA set up calendar delegation but can't see private appointments or book on behalf. Was working last month.",h:"Check calendar folder permissions, delegate settings, verify Full Details access level.",s:["Check calendar permissions in Outlook","Verify delegate access level","Remove and re-add delegate","Set 'Delegate can see private items'","Test booking on behalf"],sl:480 },
  { c:"Exchange",p:"High",t:"Meeting room {room} double-booking",d:"{room} accepted two overlapping meeting requests. Resource scheduling policy may be misconfigured.",h:"Check resource booking policy: AutoAccept, AllowConflicts, BookingWindowInDays, MaximumDurationInMinutes.",s:["Check resource mailbox properties","Verify AutomateProcessing = AutoAccept","Set AllowConflicts = $false","Review booking window settings","Cancel duplicate booking"],sl:120 },
  { c:"Exchange",p:"Medium",t:"Create resource mailbox for new {room}",d:"Facilities set up a new meeting room {room}. Need resource mailbox with Teams Room integration.",h:"Create room mailbox, set booking policies, assign Teams Room license if applicable.",s:["Create room mailbox in EAC","Configure booking policies","Add room to room list","Assign Teams Room license","Test room booking"],sl:480 },
  // ENTRA ID
  { c:"Entra ID",p:"Critical",t:"{u} locked out – 'AADSTS50053'",d:"{u} gets 'AADSTS50053: Account locked due to too many sign-in attempts with incorrect password'. Identity verified via manager callback.",h:"Unblock in Entra ID, check for brute-force, reset password, verify MFA.",s:["Check sign-in logs for suspicious IPs","Unblock account in Entra ID","Force password reset","Issue Temporary Access Pass","Verify MFA registration","Monitor for continued attempts"],sl:30 },
  { c:"Entra ID",p:"High",t:"Onboard new hire: {nn} in {dp}",d:"New employee starting Monday in {dp}. Full provisioning: account, license, groups, mailbox, Teams, OneDrive, dept SP site access.",h:"Create user, assign license, add to groups, verify mailbox provisioning, send welcome pack.",s:["Create user in Entra ID","Set department and manager","Assign M365 E3 license","Add to department security group","Add to department Teams","Grant SP site access","Send welcome credentials"],sl:120 },
  { c:"Entra ID",p:"High",t:"Offboard: {u} leaving immediately",d:"{u} termination effective today. Full offboarding: block access, preserve data, convert mailbox, transfer OneDrive, remove from groups.",h:"Block sign-in, revoke tokens, reset password, convert to shared mailbox, set forwarding, transfer OD to manager, retain for compliance.",s:["Block sign-in immediately","Revoke all active sessions (revoke-mgUserSignInSessions)","Reset password","Remove from all groups","Convert mailbox to shared","Configure mail forwarding to manager","Initiate OneDrive transfer to manager","Remove licenses","Place litigation hold if required"],sl:120 },
  { c:"Entra ID",p:"Medium",t:"{u} MFA reset – new phone",d:"{u} replaced phone and can't complete MFA. 'More information required' loop. Identity confirmed with passport + manager.",h:"Delete MFA methods, issue Temporary Access Pass (TAP), have user re-register.",s:["Open Entra ID → User → Authentication methods","Delete all registered methods","Generate Temporary Access Pass (1-hour, single-use)","Communicate TAP to user securely","User signs in and re-registers MFA","Verify new MFA method works"],sl:480 },
  { c:"Entra ID",p:"High",t:"CA policy blocking {u} from home",d:"{u} gets 'AADSTS53003: Access blocked by Conditional Access' working remotely. Unmanaged personal device.",h:"Check which CA policy blocked (sign-in logs → CA tab). May need Intune enrollment or exception.",s:["Review sign-in log CA evaluation","Identify blocking policy","Check device compliance status","Help user enroll device in Intune","Verify access after enrollment"],sl:120 },
  { c:"Entra ID",p:"Medium",t:"Entra Connect sync error for {u}",d:"{u} attributes not syncing from on-prem AD. Entra Connect health shows 'Export error: invalid-attribute-value' on this object.",h:"Check attribute value conflicts, immutableId, UPN clashes, proxy address conflicts.",s:["Check Entra Connect Health for sync error","Identify conflicting attribute","Fix attribute in on-prem AD","Force delta sync (Start-ADSyncSyncCycle -PolicyType Delta)","Verify user synced correctly"],sl:480 },
  { c:"Entra ID",p:"Low",t:"{u} license change E5 → E3",d:"Manager approved downgrade for {u}. Verify no E5-only features in use before changing.",h:"Audit: Phone System, Power BI Pro, eDiscovery, auto-expanding archive. Document before changing.",s:["Audit E5 feature usage","Check Phone System assignment","Review Power BI reports owned","Document changes for user","Remove E5 license","Assign E3 license","Verify all services work"],sl:1440 },
  { c:"Entra ID",p:"High",t:"Guest user {nn} needs restricted SP access",d:"External contractor {nn} needs guest access to {sp} site only. Must not access other tenant resources.",h:"Create guest user, use CA policy to restrict, grant site-only access.",s:["Send guest invitation","Configure guest CA restriction","Add guest to SP site visitors","Verify no broader access","Set access review schedule"],sl:120 },
  // SECURITY
  { c:"Security",p:"Critical",t:"Suspicious sign-in: {u} from {loc}",d:"Entra Identity Protection: High-risk sign-in for {u} from {loc}. User confirms they are in {ulo}. Sign-in used correct password.",h:"Assume compromised. Block, revoke, reset, check for persistence (forwarding rules, OAuth apps, inbox rules).",s:["Block sign-in immediately","Revoke all sessions","Review full sign-in history","Check mailbox forwarding rules","Check inbox rules for auto-forward","Review OAuth app consents","Reset password","Re-register MFA","Unblock and monitor"],sl:30 },
  { c:"Security",p:"High",t:"Phishing email reported by {u}",d:"{u} reported suspicious email via Report Message add-in. Email impersonates CEO requesting wire transfer. Sender: ceo-contoso@protonmail.com.",h:"Investigate, quarantine similar messages, check if anyone clicked/replied, alert org.",s:["Review email in Threat Explorer","Check email headers and URLs","Search for similar emails in tenant","Quarantine all matches","Check if any user clicked links","Review affected users' sign-in logs","Send org-wide phishing alert"],sl:120 },
  { c:"Security",p:"High",t:"DLP: {u} sharing PII externally via {svc}",d:"DLP policy triggered: {u} attempted to share file containing 12 SSN matches to external recipient via {svc}.",h:"Block was applied. Investigate intent, review file, notify compliance, retrain user.",s:["Review DLP incident details","Verify block was successful","Review file contents","Check if any data was exfiltrated","Notify compliance officer","Schedule user security training","Update DLP policy if needed"],sl:120 },
  { c:"Security",p:"Medium",t:"Suspicious OAuth app consent: {u}",d:"{u} granted 'DataSync Pro' (unverified publisher) permissions: Mail.ReadWrite, Files.ReadWrite.All, Contacts.Read.",h:"Revoke consent, block app tenant-wide, check for data exfiltration.",s:["Review app permissions in Entra ID","Revoke user consent","Block app tenant-wide","Audit user's recent mail activity","Check for data exfiltration","Notify user"],sl:480 },
  { c:"Security",p:"Critical",t:"Ransomware indicators on {u} OneDrive",d:"Defender detected mass file encryption pattern on {u}'s OneDrive. 847 files renamed to .locked extension in 4 minutes.",h:"Isolate device, revoke access, restore from OneDrive version history, investigate source.",s:["Block user sign-in","Isolate device via Intune","Revoke all sessions","Use OneDrive file restore to pre-incident","Run Defender full scan on device","Check for lateral movement","Restore access after clean"],sl:30 },
  // OUTLOOK
  { c:"Outlook",p:"High",t:"{u} Outlook crashes on launch (0xc0000005)",d:"{u} Outlook crashes immediately with error 0xc0000005 (access violation). Safe mode also crashes. Need email access urgently.",h:"Corrupted profile or add-in. Try: repair Office, new Outlook profile, disable COM add-ins.",s:["Try Outlook.exe /safe","Disable COM add-ins","Run Office Quick Repair","Create new Outlook profile","Run SaRS (Support and Recovery Assistant)","Verify launch"],sl:120 },
  { c:"Outlook",p:"Medium",t:"{u} search returns no results",d:"{u} Outlook search shows 'No results found' for all queries. Status bar shows 'Search Index: Updating...' permanently.",h:"Rebuild search index. Check indexing options, Outlook PST/OST integrity.",s:["Check indexing status in Control Panel","Rebuild search index","Verify OST file integrity","Reset Outlook search settings","Test search after rebuild"],sl:480 },
  { c:"Outlook",p:"Medium",t:"{u} OOO auto-reply not sending to external",d:"{u} Out of Office works internally but external senders don't receive it. Verified external replies are enabled.",h:"Check transport rules blocking OOF to external, remote domain settings, OOF format.",s:["Check OOF settings via PowerShell","Verify remote domain AllowedOOFType","Check transport rules for OOF blocks","Verify external OOF message is set","Test with external address"],sl:480 },
  { c:"Outlook",p:"High",t:"Outlook delegation: {u}'s EA can't book meetings",d:"{u}'s executive assistant can't send meeting requests on behalf of {u}. Gets 'You do not have permission to send on behalf'.",h:"Verify Send on Behalf permission, delegate settings, Outlook profile configuration.",s:["Check Send on Behalf in EAC","Verify delegate settings in Outlook","Remove and re-add delegate","Restart Outlook","Test meeting request on behalf"],sl:120 },
  { c:"Outlook",p:"Low",t:"{u} Outlook rules not processing",d:"{u} has 47 inbox rules but recent rules not firing. Old rules work. No error message.",h:"Client-side rule limit (64KB). Too many rules or rules too complex. Convert to server-side or reduce.",s:["Check rule size limit","Identify client-only rules","Convert to server-side rules","Delete unused rules","Test rule processing"],sl:1440 },
  // ONEDRIVE
  { c:"OneDrive",p:"High",t:"{u} deleted critical project folder from OneDrive",d:"{u} accidentally deleted the entire '{dp} Project' folder (~2GB, 340 files) from OneDrive. Deleted ~1 hour ago.",h:"Check OneDrive recycle bin (93-day retention), second-stage recycle bin, or use Files Restore.",s:["Check user's OneDrive Recycle Bin","If not there, check second-stage admin recycle bin","Use OneDrive Files Restore to rollback","Verify all files recovered","Advise on OneDrive version history"],sl:120 },
  { c:"OneDrive",p:"Medium",t:"{u} OneDrive sync error 0x8004de40",d:"{u} gets error 0x8004de40 'There was a problem connecting to OneDrive'. Sync completely stopped. {od}GB of data.",h:"TLS 1.2 issue, proxy/firewall, or auth token. Check network, re-auth, reset OneDrive client.",s:["Verify TLS 1.2 enabled on device","Check proxy/firewall for *.sharepoint.com","Re-authenticate OneDrive client","Run 'onedrive /reset'","Verify sync resumes"],sl:480 },
  // INTUNE
  { c:"Intune",p:"High",t:"{u} device non-compliant — blocking access",d:"{u}'s {dv} marked non-compliant in Intune. CA policy now blocking all M365 access. User can't work.",h:"Check compliance policy violations. Common: missing BitLocker, outdated OS, no antivirus.",s:["Check device compliance status in Intune","Identify specific violations","Guide user through remediation","Force device sync","Verify compliance state changes","Confirm M365 access restored"],sl:120 },
  { c:"Intune",p:"Medium",t:"{u} can't enroll personal device",d:"{u} trying to enroll personal {dvt} for BYOD. Enrollment wizard shows 'Device enrollment is not available'. Error 0x801c0003.",h:"Check enrollment restrictions, device limit, platform restrictions, Intune license assignment.",s:["Verify user has Intune license","Check device enrollment limit (15)","Review platform restrictions","Check enrollment type restrictions","Guide user through enrollment","Verify enrollment succeeds"],sl:480 },
  { c:"Intune",p:"High",t:"App deployment failing on 12 devices",d:"Mandatory app '{app}' failing to install on 12 devices with error 0x87D1041C. Deployment targeted to {dp} group.",h:"Check app packaging, detection rules, requirement rules. May need to repackage as Win32 app.",s:["Check app deployment status in Intune","Review error code 0x87D1041C (content download failed)","Verify CDN connectivity from affected devices","Check app package integrity","Repackage and redeploy if needed","Monitor deployment"],sl:120 },
  // POWER PLATFORM
  { c:"Power Platform",p:"High",t:"Power Automate flow failing: Invoice Approval",d:"Invoice Approval flow failing with 'InvalidConnection' error since this morning. 23 invoices stuck in queue.",h:"OAuth token expired for SP/Exchange connection. Owner needs to re-authenticate connection.",s:["Identify failed flow in Power Automate admin","Check connection authorization status","Have flow owner re-authorize connections","Resubmit failed runs","Monitor for 1 hour","Verify all stuck invoices processed"],sl:120 },
  { c:"Power Platform",p:"Medium",t:"{u} Power BI report not refreshing",d:"{u}'s Power BI dataset refresh failing daily with 'Credential error'. Connected to {sp} site and SQL database.",h:"Re-enter data source credentials, check gateway status, verify SP permissions.",s:["Check dataset refresh history","Verify data source credentials","Check On-Premises Data Gateway","Re-enter SP credentials","Schedule test refresh","Verify refresh succeeds"],sl:480 },
  { c:"Power Platform",p:"Medium",t:"{u} needs Power Automate premium connector",d:"{u} building flow that requires HTTP webhook (premium). Currently has standard license only. Manager approved.",h:"Assign Power Automate Premium license or use per-flow plan. Check if E5 includes it.",s:["Review user's current license","Check if E5 includes needed connector","Assign premium license if needed","Verify connector available","Test flow with premium connector"],sl:480 },
  // PURVIEW / COMPLIANCE
  { c:"Purview",p:"High",t:"eDiscovery hold needed for legal case",d:"Legal team requires litigation hold on {u}'s mailbox and OneDrive. Active legal proceeding — preservation mandatory.",h:"Create eDiscovery case, add custodian, place hold on mailbox + OneDrive. Verify hold applied.",s:["Create eDiscovery case in Purview","Add user as custodian","Place mailbox on hold","Place OneDrive on hold","Verify hold status shows 'On'","Notify legal team of completion"],sl:120 },
  { c:"Purview",p:"Medium",t:"Retention policy deleting files too early on {sp}",d:"Files on {sp} being auto-deleted after 1 year. Policy should be 3 years. {dp} lost quarterly reports.",h:"Review retention policies and labels. Check label priority. Restore from recycle bin.",s:["Review retention policies in Purview","Check policy settings for site","Fix retention period to 3 years","Restore deleted files from recycle bin","Verify policy change applied","Monitor for 48 hours"],sl:480 },
  { c:"Purview",p:"Low",t:"Sensitivity label not auto-applying to {dp} docs",d:"Auto-labeling policy for {dp} financial documents not applying 'Confidential' label. Policy was enabled last week.",h:"Check auto-labeling conditions, content types, simulation results before enforcing.",s:["Review auto-labeling policy","Check simulation results","Verify trainable classifier accuracy","Adjust conditions if needed","Enable enforcement","Verify labels applying"],sl:1440 },
];

const APPS = ["Microsoft Teams Rooms","Contoso CRM","Salesforce SSO","Adobe CC","GitHub Enterprise","Power BI Gateway","SAP Concur"];
const DVTYPES = ["iPhone","Android phone","Windows laptop","MacBook"];
const LOCS = ["Moscow","Lagos","São Paulo","Pyongyang","Unknown (Tor exit node)","Amsterdam","Mumbai"];
const NNAMES = ["Alex Turner","Maya Johansson","Ravi Sharma","Sophie Laurent","Omar Hassan","Priya Krishnan","Lucas Fischer","Jade Wong","Dmitri Volkov","Isabella Costa","Hiroshi Yamamoto","Elena Petrov","Samuel Adeyemi","Claire Dubois","Raj Patel","Fatima Al-Rashid"];

function mkTkt() {
  const t = pick(TPL);
  const u = pick(U.filter(x => x.ac));
  const r = {
    "{u}": u.n, "{dp}": u.dp, "{ulo}": u.lo, "{loc}": pick(LOCS), "{od}": u.od,
    "{nn}": pick(NNAMES), "{tm}": pick(TEAMS_D).n, "{sp}": pick(SP_D).n,
    "{smb}": pick(SHARED_MBX).n, "{svc}": pick(["SharePoint", "OneDrive", "Teams"]),
    "{app}": pick(APPS), "{dv}": u.dv[0] || "UNKNOWN-DEVICE", "{dvt}": pick(DVTYPES),
    "{room}": pick(ROOMS).n,
  };
  let ti = t.t, de = t.d;
  for (const [k, v] of Object.entries(r)) { ti = ti.replaceAll(k, v); de = de.replaceAll(k, v); }
  return { id: gid(), ti, de, c: t.c, p: t.p, h: t.h, st: t.s, rp: u.n, re: u.e, status: "Open", cr: Date.now(), sla: t.sl, notes: [], breach: false };
}

// ═══════════════════════════════════════════════════════════════
// COLORS
// ═══════════════════════════════════════════════════════════════
const X = {
  bg:"#090b11",p:"#0f1219",p2:"#141822",pb:"#1c2233",ph:"#171d2b",
  a:"#3b82f6",ok:"#10b981",wn:"#f59e0b",er:"#ef4444",cr:"#dc2626",
  t1:"#e2e8f0",t2:"#94a3b8",t3:"#64748b",t4:"#475569",
  Teams:"#7c3aed",SharePoint:"#0ea5e9",Exchange:"#f97316","Entra ID":"#8b5cf6",
  OneDrive:"#06b6d4",Security:"#ef4444",Outlook:"#2563eb",Intune:"#10b981",
  "Power Platform":"#f59e0b",Purview:"#6366f1"
};
const pC = p => ({ Critical: X.cr, High: X.er, Medium: X.wn, Low: X.ok }[p] || X.t3);
const cC = c => X[c] || X.a;
const cI = c => ({ Teams:"💬",SharePoint:"📄",Exchange:"📧","Entra ID":"🔐",OneDrive:"☁️",Security:"🛡️",Outlook:"📨",Intune:"📱","Power Platform":"⚡",Purview:"🔏" }[c] || "📋");

// ═══════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [tk, setTk] = useState([]);
  const [cl, setCl] = useState([]);
  const [sel, setSel] = useState(null);
  const [pg, setPg] = useState("dash");
  const [at, setAt] = useState("health");
  const [et, setEt] = useState("users");
  const [tf, setTf] = useState("all");
  const [dn, setDn] = useState({});
  const [nt, setNt] = useState("");
  const [lg, setLg] = useState([]);
  const [ts, setTs] = useState(null);
  const [sc, setSc] = useState({ r: 0, ok: 0, bad: 0, pt: 0 });
  const [sp, setSp] = useState(1);
  const [pa, setPa] = useState(false);
  const tr = useRef(tk); tr.current = tk;

  const nfy = useCallback((m, t = "i") => { setTs({ m, t, k: Date.now() }); setTimeout(() => setTs(null), 3500); }, []);
  const aL = m => setLg(p => [{ m, t: Date.now() }, ...p].slice(0, 60));

  useEffect(() => { const i = []; for (let j = 0; j < 5; j++) i.push(mkTkt()); setTk(i); }, []);
  useEffect(() => { if (pa) return; const iv = setInterval(() => { if (tr.current.filter(t => t.status !== "Resolved").length < 16) { const n = mkTkt(); setTk(p => [n, ...p]); nfy("🎫 " + n.ti.slice(0, 55), "w"); } }, (22000 + Math.random() * 28000) / sp); return () => clearInterval(iv); }, [pa, sp, nfy]);
  useEffect(() => { const iv = setInterval(() => { setTk(p => p.map(t => { if (t.status === "Resolved") return t; if ((Date.now() - t.cr) / 60000 > t.sla && !t.breach) return { ...t, breach: true }; return t; })); }, 4000); return () => clearInterval(iv); }, []);

  const doS = (id, i) => { setDn(p => ({ ...p, [id]: { ...(p[id] || {}), [i]: true } })); setTk(p => p.map(t => t.id === id && t.status === "Open" ? { ...t, status: "In Progress" } : t)); aL("Step " + (i + 1) + " on " + id); };
  const res = id => { const t = tk.find(x => x.id === id); if (!t) return; const o = (Date.now() - t.cr) / 60000 <= t.sla; setTk(p => p.map(x => x.id === id ? { ...x, status: "Resolved" } : x)); setSc(p => ({ r: p.r + 1, ok: p.ok + (o ? 1 : 0), bad: p.bad + (o ? 0 : 1), pt: p.pt + ({ Critical: 50, High: 30, Medium: 20, Low: 10 }[t.p] || 10) * (o ? 1.5 : 1) })); aL("✅ " + id + (o ? " (SLA ✓)" : " (SLA ✗)")); nfy("✅ " + id + " resolved!" + (o ? " +bonus" : ""), "s"); setSel(null); setPg("tk"); };
  const clT = id => { const t = tk.find(x => x.id === id); if (!t || t.status !== "Resolved") return; setCl(p => [{ ...t, status: "Closed" }, ...p]); setTk(p => p.filter(x => x.id !== id)); aL("📁 " + id); };
  const aN = id => { if (!nt.trim()) return; setTk(p => p.map(t => t.id === id ? { ...t, notes: [...t.notes, { x: nt, t: Date.now() }] } : t)); setNt(""); };

  const oN = tk.filter(t => t.status === "Open").length;
  const iN = tk.filter(t => t.status === "In Progress").length;
  const cN = tk.filter(t => t.p === "Critical" && t.status !== "Resolved").length;
  const bN = tk.filter(t => t.breach && t.status !== "Resolved").length;

  const ftk = useMemo(() => tk.filter(t => { if (tf === "all") return true; if (tf === "open") return t.status === "Open"; if (tf === "ip") return t.status === "In Progress"; if (tf === "res") return t.status === "Resolved"; return t.c === tf; }).sort((a, b) => ({ Open: 0, "In Progress": 1, Resolved: 2 }[a.status] - { Open: 0, "In Progress": 1, Resolved: 2 }[b.status]) || ({ Critical: 0, High: 1, Medium: 2, Low: 3 }[a.p] - { Critical: 0, High: 1, Medium: 2, Low: 3 }[b.p])), [tk, tf]);

  // STYLE HELPERS
  const bg = (c, o = "20") => ({ display: "inline-block", padding: "2px 7px", borderRadius: 4, fontSize: 10, fontWeight: 600, background: c + o, color: c, whiteSpace: "nowrap", lineHeight: "18px" });
  const bt = (c = X.a) => ({ padding: "6px 12px", background: c, color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 11, fontWeight: 600 });
  const bo = (c = X.a) => ({ padding: "5px 11px", background: "transparent", color: c, border: "1px solid " + c + "44", borderRadius: 5, cursor: "pointer", fontSize: 11 });
  const nb = a => ({ padding: "6px 12px", background: a ? X.a + "18" : "transparent", color: a ? X.a : X.t3, border: "none", borderRadius: 5, cursor: "pointer", fontSize: 11, fontWeight: a ? 600 : 400 });
  const cd = { background: X.p, border: "1px solid " + X.pb, borderRadius: 8, padding: 12, marginBottom: 8 };
  const ip = { padding: "6px 10px", background: X.bg, border: "1px solid " + X.pb, borderRadius: 5, color: X.t1, fontSize: 12, width: "100%", outline: "none", boxSizing: "border-box" };
  const th2 = { padding: "8px 8px", color: X.t3, fontWeight: 600, fontSize: 9, textTransform: "uppercase", letterSpacing: ".5px", borderBottom: "1px solid " + X.pb, textAlign: "left" };
  const td2 = { padding: "7px 8px", borderBottom: "1px solid " + X.pb + "88", fontSize: 12 };
  const av = (u, sz = 22) => { const usr = typeof u === "string" ? U.find(x => x.id === u) : u; if (!usr) return null; return <div style={{ width: sz, height: sz, borderRadius: "50%", background: `hsl(${usr.id.charCodeAt(2) * 37 % 360},60%,45%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: sz * .36, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{usr.av}</div>; };
  const bar = (v, mx, c) => <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ flex: 1, height: 4, background: X.bg, borderRadius: 2, overflow: "hidden" }}><div style={{ width: pct(v, mx) + "%", height: "100%", background: pct(v, mx) > 85 ? X.er : pct(v, mx) > 65 ? X.wn : c || X.ok, borderRadius: 2 }} /></div><span style={{ fontSize: 9, color: X.t3, whiteSpace: "nowrap" }}>{Math.round(v)}/{mx}</span></div>;
  const g2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 };
  const sh = t => <h4 style={{ margin: "14px 0 8px", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>{t}</h4>;

  // ═══════════════════════════════════════════════════════════
  // DASHBOARD
  // ═══════════════════════════════════════════════════════════
  const Dash = () => {
    const cats = ["Teams","SharePoint","Exchange","Entra ID","Security","Outlook","OneDrive","Intune","Power Platform","Purview"];
    return (<div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div><h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Microsoft 365 Admin Center</h2><div style={{ fontSize: 11, color: X.t3, marginTop: 2 }}>{TENANT.name} · {TENANT.vanity} · {TENANT.region}</div></div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 10, color: X.t3 }}>Sim:</span>
          {[1, 2, 3].map(s => <button key={s} onClick={() => setSp(s)} style={bt(sp === s ? X.a : X.pb)}>{s}x</button>)}
          <button onClick={() => setPa(!pa)} style={bt(pa ? X.ok : X.wn)}>{pa ? "▶" : "⏸"}</button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 6, marginBottom: 12 }}>
        {[{ l: "Open", v: oN, c: X.wn, i: "📬" }, { l: "In Progress", v: iN, c: X.a, i: "🔧" }, { l: "Critical", v: cN, c: X.er, i: "🚨" }, { l: "SLA Breach", v: bN, c: X.cr, i: "⏰" }, { l: "Resolved", v: sc.r, c: X.ok, i: "✅" }, { l: "Score", v: Math.floor(sc.pt), c: "#8b5cf6", i: "⭐" }].map(s => (
          <div key={s.l} style={{ ...cd, borderTop: "3px solid " + s.c, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: X.t3 }}>{s.i} {s.l}</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* SERVICE HEALTH */}
      <div style={cd}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ fontWeight: 700, fontSize: 13 }}>🏥 Service Health</span><span style={{ fontSize: 10, color: X.t3 }}>Last updated: {fmtTime(Date.now())}</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4 }}>
          {SERVICE_HEALTH.map(s => (
            <div key={s.svc} style={{ padding: "6px 8px", background: X.p2, borderRadius: 6, border: "1px solid " + (s.incidents > 0 ? X.er + "44" : X.pb) }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 600 }}>{s.icon} {s.svc}</span>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.incidents > 0 ? X.er : s.advisory > 0 ? X.wn : X.ok }} />
              </div>
              <div style={{ fontSize: 10, color: s.incidents > 0 ? X.er : X.t3, marginTop: 2 }}>{s.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ACTIVE INCIDENTS */}
      {INCIDENTS.filter(i => i.status !== "Resolved").length > 0 && <div style={cd}>
        <span style={{ fontWeight: 700, fontSize: 13 }}>⚠️ Active Incidents & Advisories</span>
        {INCIDENTS.filter(i => i.status !== "Resolved").map(i => (
          <div key={i.id} style={{ marginTop: 8, padding: 8, background: X.p2, borderRadius: 6, borderLeft: "3px solid " + (i.status === "Investigating" ? X.er : X.wn) }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ fontWeight: 600 }}>{i.title}</span>
              <span style={bg(i.status === "Investigating" ? X.er : X.wn)}>{i.id} · {i.status}</span>
            </div>
            <div style={{ fontSize: 10, color: X.t3, margin: "3px 0" }}>{i.svc} · Started {fmtTime(i.start)}</div>
            <div style={{ fontSize: 11, color: X.t2 }}>{i.impact}</div>
          </div>
        ))}
      </div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {/* SLA + Category */}
        <div style={cd}>
          <span style={{ fontWeight: 700, fontSize: 12 }}>📊 SLA Performance</span>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <div><div style={{ fontSize: 20, fontWeight: 700, color: X.ok }}>{sc.ok}</div><div style={{ fontSize: 10, color: X.t3 }}>Met</div></div>
            <div><div style={{ fontSize: 20, fontWeight: 700, color: X.er }}>{sc.bad}</div><div style={{ fontSize: 10, color: X.t3 }}>Breached</div></div>
            <div><div style={{ fontSize: 20, fontWeight: 700, color: X.a }}>{sc.r > 0 ? Math.round(sc.ok / sc.r * 100) : 0}%</div><div style={{ fontSize: 10, color: X.t3 }}>Rate</div></div>
          </div>
        </div>
        <div style={cd}>
          <span style={{ fontWeight: 700, fontSize: 12 }}>🏷️ Active by Service</span>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
            {cats.map(c => { const n = tk.filter(t => t.c === c && t.status !== "Resolved").length; return n ? <div key={c} style={{ padding: "2px 6px", borderRadius: 4, background: cC(c) + "15", display: "flex", alignItems: "center", gap: 3 }}><span style={{ fontSize: 10 }}>{cI(c)}</span><span style={{ fontSize: 10, color: cC(c), fontWeight: 600 }}>{n}</span></div> : null; })}
          </div>
        </div>
        {/* License overview */}
        <div style={cd}>
          <span style={{ fontWeight: 700, fontSize: 12 }}>📋 License Summary</span>
          <div style={{ marginTop: 6 }}>{LICENSES.slice(0, 4).map(l => (
            <div key={l.name} style={{ marginBottom: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 2 }}><span style={{ color: X.t2 }}>{l.name}</span><span style={{ color: X.t3 }}>{l.cost}</span></div>
              {bar(l.used, l.total, X.a)}
            </div>
          ))}</div>
        </div>
        {/* Security summary */}
        <div style={cd}>
          <span style={{ fontWeight: 700, fontSize: 12 }}>🛡️ Security Summary</span>
          <div style={{ marginTop: 6, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            <div style={{ padding: 6, background: X.p2, borderRadius: 4, textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 700, color: X.er }}>{SEC_ALERTS.filter(a => a.st !== "Resolved").length}</div><div style={{ fontSize: 9, color: X.t3 }}>Active Alerts</div></div>
            <div style={{ padding: 6, background: X.p2, borderRadius: 4, textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 700, color: X.wn }}>{U.filter(u => !u.mfa && u.ac).length}</div><div style={{ fontSize: 9, color: X.t3 }}>No MFA</div></div>
            <div style={{ padding: 6, background: X.p2, borderRadius: 4, textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 700, color: X.er }}>{INTUNE_D.filter(d => d.co === "NonCompliant").length}</div><div style={{ fontSize: 9, color: X.t3 }}>NonCompliant</div></div>
            <div style={{ padding: 6, background: X.p2, borderRadius: 4, textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 700, color: X.wn }}>{U.filter(u => u.ri !== "None").length}</div><div style={{ fontSize: 9, color: X.t3 }}>Risky Users</div></div>
          </div>
        </div>
      </div>

      {/* RECENT TICKETS */}
      <div style={cd}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontWeight: 700, fontSize: 13 }}>🎫 Latest Tickets</span><button onClick={() => setPg("tk")} style={bo()}>View All →</button></div>
        {tk.filter(t => t.status !== "Resolved").slice(0, 7).map(t => (
          <div key={t.id} onClick={() => { setSel(t.id); setPg("dt"); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", borderRadius: 5, cursor: "pointer", borderBottom: "1px solid " + X.pb + "66" }}>
            <span style={{ fontSize: 13 }}>{cI(t.c)}</span>
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.ti}</div><div style={{ fontSize: 9, color: X.t3 }}>{t.id} · {t.rp} · {ago(Date.now() - t.cr)}</div></div>
            <span style={bg(pC(t.p))}>{t.p}</span><span style={bg(t.status === "In Progress" ? X.a : X.wn)}>{t.status}</span>
            {t.breach && <span style={bg(X.er)}>SLA!</span>}
          </div>
        ))}
      </div>
    </div>);
  };

  // ═══════════════════════════════════════════════════════════
  // TICKETS
  // ═══════════════════════════════════════════════════════════
  const TkList = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 4 }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>🎫 Ticket Queue ({tk.filter(t => t.status !== "Resolved").length} active)</h2>
        <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {[{ k: "all", l: "All" }, { k: "open", l: "Open" }, { k: "ip", l: "In Prog" }, { k: "res", l: "Done" }, ...["Teams", "SharePoint", "Exchange", "Entra ID", "Security", "Outlook", "OneDrive", "Intune", "Power Platform", "Purview"].map(c => ({ k: c, l: cI(c) }))].map(f => (
            <button key={f.k} onClick={() => setTf(f.k)} style={nb(tf === f.k)} title={f.k}>{f.l}</button>
          ))}
        </div>
      </div>
      {ftk.length === 0 && <div style={{ textAlign: "center", padding: 24, color: X.t3 }}>No tickets 🎉</div>}
      {ftk.map(t => (
        <div key={t.id} onClick={() => { setSel(t.id); setPg("dt"); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 10px", borderRadius: 5, cursor: "pointer", borderBottom: "1px solid " + X.pb + "66", background: sel === t.id ? X.a + "0c" : "transparent" }}>
          <span style={{ fontSize: 14 }}>{cI(t.c)}</span>
          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.ti}</div><div style={{ fontSize: 9, color: X.t3 }}>{t.id} · {t.rp} · {t.c} · {ago(Date.now() - t.cr)}</div></div>
          <span style={bg(pC(t.p))}>{t.p}</span><span style={bg(t.status === "Resolved" ? X.ok : t.status === "In Progress" ? X.a : X.wn)}>{t.status}</span>
          {t.breach && <span style={bg(X.er)}>SLA!</span>}
          {t.status === "Resolved" && <button onClick={e => { e.stopPropagation(); clT(t.id); }} style={bt(X.ok)}>Close</button>}
        </div>
      ))}
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  // TICKET DETAIL
  // ═══════════════════════════════════════════════════════════
  const TkDet = () => {
    const t = tk.find(x => x.id === sel);
    if (!t) return <div style={{ padding: 24, color: X.t3 }}>Not found <button onClick={() => setPg("tk")} style={bo()}>Back</button></div>;
    const cp = dn[t.id] || {};
    const ad = t.st.every((_, i) => cp[i]);
    const el = (Date.now() - t.cr) / 60000;
    return (<div>
      <button onClick={() => setPg("tk")} style={{ ...bo(), marginBottom: 10 }}>← Queue</button>
      <div style={{ ...cd, borderLeft: "4px solid " + cC(t.c) }}>
        <div style={{ display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap", marginBottom: 6 }}>
          <span style={{ fontSize: 16 }}>{cI(t.c)}</span><span style={{ fontSize: 10, color: X.t3, fontFamily: "monospace" }}>{t.id}</span>
          <span style={bg(pC(t.p))}>{t.p}</span><span style={bg(t.status === "Resolved" ? X.ok : t.status === "In Progress" ? X.a : X.wn)}>{t.status}</span>
          {t.breach ? <span style={bg(X.er)}>⚠ SLA BREACHED</span> : <span style={bg(X.ok)}>SLA: {Math.max(0, Math.floor(t.sla - el))}m</span>}
        </div>
        <h3 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700 }}>{t.ti}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10, fontSize: 11 }}>
          <div><span style={{ color: X.t3 }}>Reporter</span><br /><strong>{t.rp}</strong><br /><span style={{ color: X.t4, fontSize: 10 }}>{t.re}</span></div>
          <div><span style={{ color: X.t3 }}>Service</span><br /><strong>{t.c}</strong></div>
          <div><span style={{ color: X.t3 }}>Assigned</span><br /><strong>You (IT Admin)</strong></div>
        </div>
        <div style={{ padding: 8, background: X.bg, borderRadius: 5, fontSize: 12, lineHeight: 1.5 }}><div style={{ color: X.t3, fontSize: 9, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Description</div>{t.de}</div>
      </div>
      <div style={{ ...cd, marginTop: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 2 }}>🔧 Resolution Steps</div>
        <div style={{ fontSize: 11, color: X.a, marginBottom: 8, padding: "4px 8px", background: X.a + "0a", borderRadius: 4, borderLeft: "3px solid " + X.a }}>💡 {t.h}</div>
        {t.st.map((s, i) => { const d = !!cp[i]; const cn = i === 0 || cp[i - 1]; return (
          <div key={i} onClick={() => { if (!d && cn && t.status !== "Resolved") doS(t.id, i); }} style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 8px", background: d ? X.ok + "0c" : X.bg, borderRadius: 4, marginBottom: 2, cursor: d ? "default" : cn ? "pointer" : "default", border: "1px solid " + (d ? X.ok + "30" : X.pb), opacity: cn || d ? 1 : .3 }}>
            <div style={{ width: 16, height: 16, borderRadius: 3, border: "2px solid " + (d ? X.ok : X.t4), background: d ? X.ok : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{d ? "✓" : ""}</div>
            <span style={{ flex: 1, fontSize: 11, textDecoration: d ? "line-through" : "none", color: d ? X.t3 : X.t1 }}>{s}</span>
            {!d && cn && t.status !== "Resolved" && <span style={{ fontSize: 9, color: X.a }}>▶</span>}
          </div>
        ); })}
        {ad && t.status !== "Resolved" && <button onClick={() => res(t.id)} style={{ ...bt(X.ok), width: "100%", marginTop: 8, padding: "8px 0", fontSize: 12 }}>✅ Mark Resolved</button>}
        {t.status === "Resolved" && <div style={{ textAlign: "center", padding: 8, background: X.ok + "10", borderRadius: 5, marginTop: 6, color: X.ok, fontWeight: 600, fontSize: 12 }}>Resolved — <button onClick={() => clT(t.id)} style={bt(X.ok)}>Close Ticket</button></div>}
      </div>
      <div style={{ ...cd, marginTop: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 4 }}>📝 Notes</div>
        {t.notes.map((n, i) => <div key={i} style={{ padding: "3px 6px", background: X.bg, borderRadius: 3, marginBottom: 2, fontSize: 10 }}><span style={{ color: X.t3 }}>{fmtTime(n.t)}</span> {n.x}</div>)}
        <div style={{ display: "flex", gap: 5, marginTop: 4 }}><input value={nt} onChange={e => setNt(e.target.value)} onKeyDown={e => e.key === "Enter" && aN(t.id)} placeholder="Add note..." style={ip} /><button onClick={() => aN(t.id)} style={bt()}>Add</button></div>
      </div>
    </div>);
  };

  // ═══════════════════════════════════════════════════════════
  // ADMIN CENTER
  // ═══════════════════════════════════════════════════════════
  const Admin = () => (<div>
    <h2 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 700 }}>🏢 Admin Center — {TENANT.name}</h2>
    <div style={{ display: "flex", gap: 2, marginBottom: 12, flexWrap: "wrap" }}>
      {[{k:"health",l:"🏥 Health"},{k:"entra",l:"🔐 Entra ID"},{k:"sec",l:"🛡️ Security"},{k:"exch",l:"📧 Exchange"},{k:"outlook",l:"📨 Outlook"},{k:"teams",l:"💬 Teams"},{k:"sp",l:"📄 SharePoint"},{k:"intune",l:"📱 Intune"},{k:"power",l:"⚡ Power Platform"},{k:"purview",l:"🔏 Purview"},{k:"lic",l:"📋 Licenses"}].map(t => (
        <button key={t.k} onClick={() => setAt(t.k)} style={nb(at === t.k)}>{t.l}</button>
      ))}
    </div>

    {at === "health" && <div>
      {sh("🏥 Service Health")}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
        {SERVICE_HEALTH.map(s => <div key={s.svc} style={{ ...cd, borderLeft: "3px solid " + (s.incidents > 0 ? X.er : s.advisory > 0 ? X.wn : X.ok) }}><div style={{ fontWeight: 600, fontSize: 12 }}>{s.icon} {s.svc}</div><div style={{ fontSize: 11, color: s.incidents > 0 ? X.er : X.t2, marginTop: 2 }}>{s.status}</div>{s.incidents > 0 && <span style={bg(X.er)}>{s.incidents} incident</span>}{s.advisory > 0 && <span style={bg(X.wn)}>{s.advisory} advisory</span>}</div>)}
      </div>
      {sh("📢 Active Incidents")}
      {INCIDENTS.map(i => <div key={i.id} style={{ ...cd, borderLeft: "3px solid " + (i.status === "Investigating" ? X.er : X.wn) }}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 600, fontSize: 12 }}>{i.title}</span><span style={bg(i.status === "Investigating" ? X.er : X.wn)}>{i.id}</span></div><div style={{ fontSize: 10, color: X.t3, margin: "2px 0" }}>{i.svc} · {fmtDate(i.start)} {fmtTime(i.start)}</div><div style={{ fontSize: 11, color: X.t2, marginBottom: 4 }}>{i.impact}</div>{i.updates.map((u, j) => <div key={j} style={{ fontSize: 10, color: X.t3, padding: "1px 0" }}>• {u}</div>)}</div>)}
    </div>}

    {at === "entra" && <div>
      <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>
        {[{k:"users",l:"Users"},{k:"groups",l:"Groups"},{k:"roles",l:"Roles"},{k:"ca",l:"Conditional Access"},{k:"apps",l:"Enterprise Apps"},{k:"logs",l:"Sign-in Logs"}].map(v => <button key={v.k} onClick={() => setEt(v.k)} style={nb(et === v.k)}>{v.l}</button>)}
      </div>
      {et === "users" && <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}><thead><tr style={{ background: X.bg }}>{["User","Dept","Location","License","Status","MFA","Risk","Device Compliance","Password Changed"].map(h => <th key={h} style={th2}>{h}</th>)}</tr></thead><tbody>{U.map(u => <tr key={u.id}><td style={td2}><div style={{ display: "flex", alignItems: "center", gap: 5 }}>{av(u)}<div><div style={{ fontWeight: 600 }}>{u.n}</div><div style={{ fontSize: 9, color: X.t4 }}>{u.e}</div></div></div></td><td style={td2}>{u.dp}</td><td style={{ ...td2, color: X.t3 }}>{u.lo}</td><td style={td2}><span style={bg(X.a)}>{u.li}</span></td><td style={td2}><span style={bg(u.ac ? X.ok : X.er)}>{u.ac ? "Active" : "Disabled"}</span></td><td style={td2}><span style={bg(u.mfa ? X.ok : X.er)}>{u.mfa ? u.mm : "Off"}</span></td><td style={td2}><span style={bg(u.ri === "None" ? X.ok : u.ri === "Low" ? X.wn : X.er)}>{u.ri}</span></td><td style={td2}><span style={bg(u.co === "Compliant" ? X.ok : X.er)}>{u.co}</span></td><td style={{ ...td2, fontSize: 10, color: X.t3 }}>{u.pw}</td></tr>)}</tbody></table></div>}
      {et === "ca" && CA_POLICIES.map(c => <div key={c.id} style={{ ...cd, borderLeft: "3px solid " + (c.st === "On" ? X.ok : c.st === "Report-only" ? X.wn : X.er) }}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 600, fontSize: 12 }}>{c.n}</span><span style={bg(c.st === "On" ? X.ok : X.wn)}>{c.st}</span></div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 6, fontSize: 11 }}><div><div style={{ color: X.t3, fontSize: 9, textTransform: "uppercase" }}>Conditions</div><div style={{ color: X.t2, marginTop: 1 }}>{c.cond}</div></div><div><div style={{ color: X.t3, fontSize: 9, textTransform: "uppercase" }}>Grant</div><div style={{ color: X.t2, marginTop: 1 }}>{c.grant}</div></div><div><div style={{ color: X.t3, fontSize: 9, textTransform: "uppercase" }}>Excludes</div><div style={{ color: X.t2, marginTop: 1 }}>{c.ex}</div></div></div></div>)}
      {et === "groups" && <div style={g2}>{[{ n: "Engineering-All", ty: "Security", mb: 4, dy: false }, { n: "Marketing-All", ty: "M365", mb: 2, dy: false }, { n: "All-Licensed-Users", ty: "Security", mb: U.filter(u => u.ac).length, dy: true, rule: "user.accountEnabled -eq true" }, { n: "MFA-Enforced", ty: "Security", mb: U.filter(u => u.mfa).length, dy: true, rule: "user.strongAuth -ne null" }, { n: "Global-Admins", ty: "Role-assignable", mb: 1, dy: false }, { n: "Leadership", ty: "M365", mb: 5, dy: false }, { n: "Sales-All", ty: "Security", mb: 2, dy: true, rule: "user.department -eq 'Sales'" }, { n: "Finance-All", ty: "Security", mb: 2, dy: false }].map(g => <div key={g.n} style={cd}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 600, fontSize: 12 }}>{g.n}</span><span style={bg(g.dy ? X.wn : X.a)}>{g.dy ? "Dynamic" : g.ty}</span></div>{g.dy && g.rule && <div style={{ fontSize: 9, color: X.t3, fontFamily: "monospace", marginTop: 2 }}>{g.rule}</div>}<div style={{ fontSize: 10, color: X.t2, marginTop: 3 }}>{g.mb} members</div></div>)}</div>}
      {et === "roles" && <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}><thead><tr style={{ background: X.bg }}>{["User","Roles","MFA"].map(h => <th key={h} style={th2}>{h}</th>)}</tr></thead><tbody>{U.filter(u => u.ro.some(r => r)).map(u => <tr key={u.id}><td style={td2}><div style={{ display: "flex", alignItems: "center", gap: 4 }}>{av(u)}<span>{u.n}</span></div></td><td style={td2}>{u.ro.filter(r => r).map(r => <span key={r} style={{ ...bg(X["Entra ID"]), marginRight: 3 }}>{r}</span>)}</td><td style={td2}><span style={bg(u.mfa ? X.ok : X.er)}>{u.mfa ? "✓" : "⚠ OFF"}</span></td></tr>)}</tbody></table></div>}
      {et === "apps" && <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}><thead><tr style={{ background: X.bg }}>{["Application","Publisher","SSO","Users","Status"].map(h => <th key={h} style={th2}>{h}</th>)}</tr></thead><tbody>{[{ n: "Contoso CRM", p: "Contoso", sso: "SAML", u: 3, s: "✓" }, { n: "Salesforce", p: "Salesforce", sso: "SAML", u: 3, s: "✓" }, { n: "Adobe CC", p: "Adobe", sso: "SAML", u: 2, s: "✓" }, { n: "GitHub Enterprise", p: "GitHub", sso: "OIDC", u: 3, s: "✓" }, { n: "DataSync Pro", p: "Unknown ⚠", sso: "OAuth", u: 1, s: "⚠ Review", risk: true }, { n: "SAP Concur", p: "SAP", sso: "SAML", u: 5, s: "✓" }].map(a => <tr key={a.n} style={a.risk ? { background: X.er + "08" } : {}}><td style={{ ...td2, fontWeight: 600 }}>{a.n}{a.risk && <span style={{ ...bg(X.er), marginLeft: 3 }}>REVIEW</span>}</td><td style={td2}>{a.p}</td><td style={td2}><span style={bg(X.ok)}>{a.sso}</span></td><td style={td2}>{a.u}</td><td style={td2}><span style={bg(a.risk ? X.er : X.ok)}>{a.s}</span></td></tr>)}</tbody></table></div>}
      {et === "logs" && <div style={{ overflowX: "auto", fontSize: 10 }}><table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr style={{ background: X.bg }}>{["Time","User","App","Status","Reason","IP","Location","Risk"].map(h => <th key={h} style={th2}>{h}</th>)}</tr></thead><tbody>{[{ t: "09:12", u: "u03", a: "Outlook", s: "Fail", r: "MFA required", ip: "203.45.67.89", l: "New York", ri: "Medium" }, { t: "03:45", u: "u08", a: "SharePoint", s: "Fail", r: "Account disabled", ip: "118.22.33.44", l: "Unknown", ri: "High" }, { t: "22:10", u: "u09", a: "Teams", s: "OK", r: "", ip: "85.120.45.67", l: "Berlin", ri: "Low" }, { t: "08:45", u: "u16", a: "OWA", s: "OK", r: "Phishing link clicked", ip: "51.15.0.1", l: "London", ri: "High" }, { t: "06:15", u: "u06", a: "Azure Portal", s: "OK", r: "", ip: "10.0.1.50", l: "Seattle (Corp)", ri: "None" }, { t: "08:22", u: "u01", a: "VS Code", s: "OK", r: "", ip: "10.0.1.55", l: "Seattle (Corp)", ri: "None" }].map((l, i) => { const usr = U.find(x => x.id === l.u); return <tr key={i} style={l.ri === "High" ? { background: X.er + "08" } : {}}><td style={td2}>{l.t}</td><td style={td2}>{usr?.n}</td><td style={td2}>{l.a}</td><td style={td2}><span style={bg(l.s === "OK" ? X.ok : X.er)}>{l.s}</span></td><td style={{ ...td2, color: X.t3 }}>{l.r || "—"}</td><td style={{ ...td2, fontFamily: "monospace", color: X.t4 }}>{l.ip}</td><td style={td2}>{l.l}</td><td style={td2}><span style={bg(l.ri === "None" ? X.ok : l.ri === "Low" ? X.wn : X.er)}>{l.ri}</span></td></tr>; })}</tbody></table></div>}
    </div>}

    {at === "sec" && <div>
      {sh("🚨 Security Alerts")}
      {SEC_ALERTS.map(a => { const u = U.find(x => x.id === a.usr); return <div key={a.id} style={{ ...cd, borderLeft: "3px solid " + ({ High: X.er, Medium: X.wn, Low: X.ok }[a.sv]) }}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 600, fontSize: 12 }}>{a.ti}</span><div style={{ display: "flex", gap: 3 }}><span style={bg({ High: X.er, Medium: X.wn, Low: X.ok }[a.sv])}>{a.sv}</span><span style={bg(a.st === "New" ? X.er : a.st === "InProgress" ? X.wn : X.ok)}>{a.st}</span></div></div><div style={{ fontSize: 11, color: X.t2, marginTop: 3 }}>{a.desc}</div><div style={{ fontSize: 10, color: X.t3, marginTop: 2 }}>User: {u?.n} · {a.src} · {fmtTime(a.t)}</div></div>; })}
      {sh("🔏 DLP Policies")}
      {DLP_D.map(d => <div key={d.n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid " + X.pb + "66", fontSize: 11 }}><span style={{ fontWeight: 600 }}>{d.n}</span><div style={{ display: "flex", gap: 4, alignItems: "center" }}><span style={{ color: X.t3, fontSize: 10 }}>{d.sc}</span><span style={bg(d.st === "Enforcing" ? X.ok : X.wn)}>{d.st}</span><span style={bg(d.ma > 10 ? X.wn : X.ok)}>{d.ma} matches</span></div></div>)}
    </div>}

    {at === "exch" && <div>
      {sh("📬 Shared Mailboxes")}
      <div style={g2}>{SHARED_MBX.map(m => <div key={m.id} style={cd}><div style={{ fontWeight: 600, fontSize: 12, marginBottom: 4 }}>{m.n}</div><div style={{ fontSize: 10, color: X.t2 }}>Members: {m.mem.map(id => U.find(u => u.id === id)?.n).filter(Boolean).join(", ")}</div><div style={{ marginTop: 4 }}>{bar(m.sz, 50, X.Exchange)}</div>{m.ar && <span style={{ ...bg(X.wn), marginTop: 4, display: "inline-block" }}>Auto-reply On</span>}</div>)}</div>
      {sh("🏢 Meeting Rooms")}
      <div style={g2}>{ROOMS.map(r => <div key={r.id} style={cd}><div style={{ fontWeight: 600, fontSize: 12 }}>{r.n}</div><div style={{ fontSize: 10, color: X.t3 }}>{r.loc} · Capacity: {r.cap}</div><div style={{ fontSize: 10, color: X.t2, marginTop: 2 }}>Equipment: {r.equip.join(", ")}</div><span style={bg(r.booking === "Available" ? X.ok : X.wn)}>{r.booking}</span></div>)}</div>
      {sh("⚙️ Transport Rules")}
      {MAIL_RULES.map(r => <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid " + X.pb + "66", fontSize: 11 }}><div><span style={{ fontWeight: 600 }}>{r.name}</span><div style={{ fontSize: 10, color: X.t3 }}>{r.cond} → {r.act}</div></div><div style={{ display: "flex", gap: 3 }}><span style={bg(X.t3)}>P{r.pri}</span><span style={bg(r.on ? X.ok : X.wn)}>{r.on ? "On" : "Off"}</span></div></div>)}
      {sh("📊 Mailbox Quotas")}
      {U.filter(u => u.ac).map(u => { const q = u.li.includes("E5") ? 100 : u.li.includes("F") ? 2 : 50; return <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", borderBottom: "1px solid " + X.pb + "44" }}><div style={{ width: 120, display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>{av(u, 16)}{u.n.split(" ")[0]}</div><div style={{ flex: 1 }}>{bar(u.mbU, q, X.Exchange)}</div></div>; })}
    </div>}

    {at === "outlook" && <div>
      {sh("📨 Outlook & Mail Security")}
      <div style={g2}>
        <div style={cd}><div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6 }}>Anti-Spam</div>{[["Inbound filter", "On"], ["Bulk threshold", "6"], ["Spam action", "Junk"], ["High-confidence spam", "Quarantine"], ["Phishing", "Quarantine"]].map(([l, v]) => <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid " + X.pb + "44", fontSize: 11 }}><span style={{ color: X.t2 }}>{l}</span><span style={{ fontWeight: 600 }}>{v}</span></div>)}</div>
        <div style={cd}><div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6 }}>Anti-Malware</div>{[["Attachment filter", "On"], ["ZAP", "On"], ["Safe Attachments (E5)", "On"], ["Safe Links (E5)", "On"], ["Admin notify", "d.kim@contoso.com"]].map(([l, v]) => <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid " + X.pb + "44", fontSize: 11 }}><span style={{ color: X.t2 }}>{l}</span><span style={{ fontWeight: 600 }}>{v}</span></div>)}</div>
        <div style={cd}><div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6 }}>Email Authentication</div>{[["SPF", "v=spf1 include:spf.protection.outlook.com -all", true], ["DKIM", "Enabled for contoso.com", true], ["DMARC", "p=quarantine; rua=dmarc@contoso.com", true]].map(([l, v, ok]) => <div key={l} style={{ padding: "4px 0", borderBottom: "1px solid " + X.pb + "44" }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}><span style={{ color: X.t2 }}>{l}</span><span style={bg(ok ? X.ok : X.er)}>{ok ? "Valid" : "Missing"}</span></div><div style={{ fontSize: 9, color: X.t4, fontFamily: "monospace" }}>{v}</div></div>)}</div>
        <div style={cd}><div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6 }}>Client Access</div>{[["OWA", "Enabled"], ["ActiveSync", "Enabled"], ["POP3", "Disabled"], ["IMAP", "Disabled"], ["MAPI", "Enabled"], ["Offline OWA", "Enabled"]].map(([l, v]) => <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid " + X.pb + "44", fontSize: 11 }}><span style={{ color: X.t2 }}>{l}</span><span style={bg(v === "Enabled" ? X.ok : X.wn)}>{v}</span></div>)}</div>
      </div>
    </div>}

    {at === "teams" && <div>
      {sh("💬 Teams")}
      <div style={g2}>{TEAMS_D.map(t => <div key={t.id} style={cd}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 600, fontSize: 12 }}>{t.n}</span>{t.pri > 0 && <span style={bg(X.wn)}>🔒 Private channels</span>}</div><div style={{ fontSize: 10, color: X.t3, marginBottom: 4 }}>Channels: {t.ch.join(", ")}</div><div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>{t.mem.slice(0, 6).map(id => { const u = U.find(x => x.id === id); return u ? <div key={id} style={{ display: "flex", alignItems: "center", gap: 2, padding: "1px 5px", background: X.pb, borderRadius: 10, fontSize: 9 }}>{av(u, 12)}{u.n.split(" ")[0]}</div> : null; })}{t.mem.length > 6 && <span style={{ fontSize: 9, color: X.t3 }}>+{t.mem.length - 6}</span>}</div></div>)}</div>
    </div>}

    {at === "sp" && <div>
      {sh("📄 SharePoint Sites")}
      <div style={g2}>{SP_D.map(s => <div key={s.id} style={cd}><div style={{ fontWeight: 600, fontSize: 12 }}>{s.n}</div><div style={{ fontSize: 10, color: X.t3, marginBottom: 4 }}>{s.u}</div><div style={{ fontSize: 10, color: X.t2, marginBottom: 4 }}>Owners: {s.ow.map(id => U.find(u => u.id === id)?.n).join(", ")}</div>{bar(s.sz, s.qt, X.SharePoint)}</div>)}</div>
    </div>}

    {at === "intune" && <div>
      {sh("📱 Intune Devices")}
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {[{ l: "Compliant", v: INTUNE_D.filter(d => d.co === "Compliant").length, c: X.ok }, { l: "Non-Compliant", v: INTUNE_D.filter(d => d.co !== "Compliant").length, c: X.er }, { l: "Total", v: INTUNE_D.length, c: X.a }].map(s => <div key={s.l} style={{ ...cd, flex: 1, borderTop: "3px solid " + s.c, textAlign: "center" }}><div style={{ fontSize: 10, color: X.t3 }}>{s.l}</div><div style={{ fontSize: 20, fontWeight: 700 }}>{s.v}</div></div>)}
      </div>
      <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}><thead><tr style={{ background: X.bg }}>{["Device","User","OS","Compliance","Encryption","Last Sync"].map(h => <th key={h} style={th2}>{h}</th>)}</tr></thead><tbody>{INTUNE_D.map(d => { const u = U.find(x => x.id === d.usr); return <tr key={d.n} style={d.co !== "Compliant" ? { background: X.er + "06" } : {}}><td style={{ ...td2, fontWeight: 600 }}>{d.n}</td><td style={td2}>{u?.n}</td><td style={td2}>{d.os}</td><td style={td2}><span style={bg(d.co === "Compliant" ? X.ok : X.er)}>{d.co}</span></td><td style={td2}><span style={bg(d.en.includes("On") || d.en === "Encrypted" ? X.ok : X.wn)}>{d.en}</span></td><td style={{ ...td2, fontSize: 10, color: X.t3 }}>{fmtTime(d.ls)}</td></tr>; })}</tbody></table></div>
    </div>}

    {at === "power" && <div>
      {sh("⚡ Power Automate Flows")}
      {POWER_AUTO.map(f => { const u = U.find(x => x.id === f.owner); return <div key={f.n} style={{ ...cd, borderLeft: "3px solid " + (f.status === "On" ? X.ok : X.er) }}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 600, fontSize: 12 }}>{f.n}</span><span style={bg(f.status === "On" ? X.ok : X.er)}>{f.status}</span></div><div style={{ fontSize: 10, color: X.t3, marginTop: 2 }}>Owner: {u?.n} · Trigger: {f.trigger}</div><div style={{ display: "flex", gap: 6, marginTop: 3, fontSize: 10 }}><span style={{ color: X.t2 }}>Runs: {f.runs}</span><span style={{ color: f.fails > 5 ? X.er : X.t2 }}>Failures: {f.fails}</span></div></div>; })}
    </div>}

    {at === "purview" && <div>
      {sh("🔏 Microsoft Purview")}
      <div style={g2}>
        <div style={cd}><div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6 }}>Sensitivity Labels</div>{[{ n: "Public", c: X.ok, ct: 340 }, { n: "Internal", c: X.a, ct: 1250 }, { n: "Confidential", c: X.wn, ct: 420 }, { n: "Highly Confidential", c: X.er, ct: 85 }].map(l => <div key={l.n} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid " + X.pb + "44", fontSize: 11 }}><span style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: l.c }} />{l.n}</span><span style={{ color: X.t2 }}>{l.ct} items</span></div>)}</div>
        <div style={cd}><div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6 }}>Retention Policies</div>{[["Default 7-year", "Exchange, SP, OD", "On"], ["Finance 10-year", "Finance SP site", "On"], ["Legal Hold", "Legal mailboxes", "On"], ["Marketing 1-year", "Marketing SP", "On"]].map(([n, s, st]) => <div key={n} style={{ padding: "3px 0", borderBottom: "1px solid " + X.pb + "44", fontSize: 11 }}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 600 }}>{n}</span><span style={bg(X.ok)}>{st}</span></div><div style={{ fontSize: 10, color: X.t3 }}>{s}</div></div>)}</div>
      </div>
      <div style={cd}><div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6 }}>eDiscovery Cases</div>{[["Case-2026-001", "Active", "Litigation — vendor dispute", "u07", 2], ["Case-2025-014", "Closed", "Internal investigation", "u07", 0]].map(([n, st, d, o, h]) => <div key={n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: "1px solid " + X.pb + "44", fontSize: 11 }}><div><span style={{ fontWeight: 600 }}>{n}</span><div style={{ fontSize: 10, color: X.t3 }}>{d} · Owner: {U.find(u => u.id === o)?.n}</div></div><div style={{ display: "flex", gap: 3 }}><span style={bg(st === "Active" ? X.wn : X.ok)}>{st}</span>{h > 0 && <span style={bg(X.er)}>{h} holds</span>}</div></div>)}</div>
    </div>}

    {at === "lic" && <div>
      {sh("📋 License Management")}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {LICENSES.map(l => <div key={l.name} style={cd}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontWeight: 600, fontSize: 12 }}>{l.name}</span><span style={{ fontSize: 10, color: X.t3 }}>{l.cost}</span></div>{bar(l.used, l.total, X.a)}<div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 10, color: X.t3 }}><span>{l.total - l.used} available</span><span>{pct(l.used, l.total)}% utilized</span></div></div>)}
      </div>
      <div style={{ marginTop: 10, padding: 8, background: X.wn + "10", borderRadius: 5, border: "1px solid " + X.wn + "30", fontSize: 11 }}>
        ⚠ <strong>Cost optimization:</strong> {LICENSES.filter(l => pct(l.used, l.total) < 40).length} license pools below 40% utilization. Consider reducing allocation.
      </div>
    </div>}
  </div>);

  // ═══════════════════════════════════════════════════════════
  // ROOT
  // ═══════════════════════════════════════════════════════════
  return (
    <div style={{ fontFamily: "'Segoe UI',-apple-system,sans-serif", background: X.bg, color: X.t1, minHeight: "100vh", display: "flex", flexDirection: "column", fontSize: 12 }}>
      <style>{`*{box-sizing:border-box;margin:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${X.pb};border-radius:2px}@keyframes si{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes pu{0%,100%{opacity:1}50%{opacity:.4}}tr:hover{background:${X.ph}!important}button:hover{filter:brightness(1.15)}`}</style>
      <div style={{ background: "#070910", borderBottom: "1px solid " + X.pb, padding: "0 14px", display: "flex", alignItems: "center", height: 44, gap: 10, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 26, height: 26, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: "#fff" }}>M</div>
          <div><div style={{ fontWeight: 700, fontSize: 12 }}>M365 Admin Simulator</div><div style={{ fontSize: 8, color: X.t4 }}>Training Environment · {TENANT.vanity}</div></div>
        </div>
        <div style={{ display: "flex", gap: 1, marginLeft: 20 }}>
          <button onClick={() => setPg("dash")} style={nb(pg === "dash")}>📊 Dashboard</button>
          <button onClick={() => setPg("tk")} style={nb(pg === "tk" || pg === "dt")}>🎫 Tickets{oN > 0 && <span style={{ marginLeft: 3, padding: "0 5px", borderRadius: 8, background: X.er, color: "#fff", fontSize: 9 }}>{oN}</span>}</button>
          <button onClick={() => setPg("admin")} style={nb(pg === "admin")}>🏢 Admin</button>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          {cN > 0 && <div style={{ padding: "2px 7px", borderRadius: 4, background: X.er + "20", color: X.er, fontSize: 10, fontWeight: 600, animation: "pu 1.5s infinite" }}>🚨 {cN}</div>}
          {bN > 0 && <div style={{ padding: "2px 7px", borderRadius: 4, background: X.wn + "20", color: X.wn, fontSize: 10, fontWeight: 600 }}>⏰ {bN} SLA</div>}
          <span style={{ fontSize: 10, color: X.t2 }}>⭐ {Math.floor(sc.pt)}</span>
        </div>
      </div>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div style={{ flex: 1, overflow: "auto", padding: 14 }}>
          {pg === "dash" && <Dash />}
          {pg === "tk" && <TkList />}
          {pg === "dt" && <TkDet />}
          {pg === "admin" && <Admin />}
        </div>
        <div style={{ width: 190, borderLeft: "1px solid " + X.pb, background: X.p, overflow: "auto", flexShrink: 0, padding: 10, fontSize: 10 }}>
          <div style={{ fontWeight: 700, color: X.t3, fontSize: 9, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Activity</div>
          {lg.length === 0 && <div style={{ color: X.t4 }}>Start resolving!</div>}
          {lg.slice(0, 20).map((l, i) => <div key={i} style={{ padding: "3px 0", borderBottom: "1px solid " + X.pb + "44" }}><div style={{ color: X.t1 }}>{l.m}</div><div style={{ color: X.t4, fontSize: 9 }}>{ago(Date.now() - l.t)}</div></div>)}
          <div style={{ fontWeight: 700, color: X.t3, fontSize: 9, textTransform: "uppercase", letterSpacing: 1, margin: "10px 0 4px" }}>Closed ({cl.length})</div>
          {cl.slice(0, 8).map(t => <div key={t.id} style={{ padding: "2px 0", color: X.t4, fontSize: 9 }}>{t.id}</div>)}
        </div>
      </div>
      {ts && <div style={{ position: "fixed", bottom: 16, right: 16, padding: "8px 16px", borderRadius: 6, background: ts.t === "s" ? X.ok : ts.t === "w" ? X.wn : X.a, color: "#fff", fontWeight: 600, fontSize: 11, zIndex: 9999, boxShadow: "0 6px 24px rgba(0,0,0,.5)", animation: "si .3s ease" }}>{ts.m}</div>}
    </div>
  );
}
