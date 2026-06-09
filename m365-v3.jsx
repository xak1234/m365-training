import { useState, useEffect, useCallback, useRef } from "react";

const TENANT = { name: "Contoso Ltd", domain: "contoso.onmicrosoft.com", id: "c0nt0s0-4a2b-8c3d-9e1f-00001" };
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const genId = () => "TKT-" + String(Math.floor(10000 + Math.random() * 90000));
const ago = (ms) => { const m = Math.floor(ms / 60000); if (m < 1) return "just now"; if (m < 60) return m + "m"; return Math.floor(m / 60) + "h"; };

// ════════════════════════════════════════════════════════════════════
// DATA
// ════════════════════════════════════════════════════════════════════
const USERS = [
  { id:"u01",name:"Sarah Chen",email:"s.chen@contoso.com",dept:"Engineering",title:"Senior Developer",loc:"Seattle",lic:"M365 E5",active:true,mfa:true,mfaMethod:"Authenticator App",login:"2026-03-10T08:22Z",riskLevel:"None",groups:["Engineering-All","Project-Alpha"],roles:[],mb:"active",teams:true,sp:["Engineering Hub"],od:"12.4 GB",av:"SC",devices:["DESKTOP-SC01"],complianceState:"Compliant",lastPwChange:"2026-02-01" },
  { id:"u02",name:"Marcus Williams",email:"m.williams@contoso.com",dept:"Marketing",title:"Marketing Manager",loc:"New York",lic:"M365 E3",active:true,mfa:true,mfaMethod:"SMS",login:"2026-03-10T09:05Z",riskLevel:"None",groups:["Marketing-All","Campaign-Q1"],roles:[],mb:"active",teams:true,sp:["Marketing Portal"],od:"8.7 GB",av:"MW",devices:["LAPTOP-MW02"],complianceState:"Compliant",lastPwChange:"2026-01-15" },
  { id:"u03",name:"Emily Rodriguez",email:"e.rodriguez@contoso.com",dept:"Sales",title:"Account Executive",loc:"New York",lic:"M365 E3",active:true,mfa:false,mfaMethod:"None",login:"2026-03-09T17:45Z",riskLevel:"Medium",groups:["Sales-All","CRM-Users"],roles:[],mb:"active",teams:true,sp:["Sales Dashboard"],od:"3.2 GB",av:"ER",devices:["LAPTOP-ER03"],complianceState:"NonCompliant",lastPwChange:"2025-11-20" },
  { id:"u04",name:"James O'Brien",email:"j.obrien@contoso.com",dept:"HR",title:"HR Coordinator",loc:"London",lic:"M365 E3",active:true,mfa:true,mfaMethod:"Authenticator App",login:"2026-03-10T07:30Z",riskLevel:"None",groups:["HR-All","Benefits-Admin"],roles:["User Administrator"],mb:"active",teams:true,sp:["HR Intranet"],od:"5.1 GB",av:"JO",devices:["DESKTOP-JO04"],complianceState:"Compliant",lastPwChange:"2026-02-20" },
  { id:"u05",name:"Aisha Patel",email:"a.patel@contoso.com",dept:"Finance",title:"Financial Analyst",loc:"London",lic:"M365 E5",active:true,mfa:true,mfaMethod:"FIDO2 Key",login:"2026-03-10T08:00Z",riskLevel:"None",groups:["Finance-All","Budget-Review"],roles:[],mb:"active",teams:true,sp:["Finance Reports"],od:"15.8 GB",av:"AP",devices:["LAPTOP-AP05"],complianceState:"Compliant",lastPwChange:"2026-03-01" },
  { id:"u06",name:"David Kim",email:"d.kim@contoso.com",dept:"IT",title:"System Admin",loc:"Seattle",lic:"M365 E5",active:true,mfa:true,mfaMethod:"Authenticator App + FIDO2",login:"2026-03-10T06:15Z",riskLevel:"None",groups:["IT-All","Global-Admins","Security-Team"],roles:["Global Administrator","Security Administrator"],mb:"active",teams:true,sp:["IT Wiki","Helpdesk"],od:"22.3 GB",av:"DK",devices:["DESKTOP-DK06","LAPTOP-DK06B"],complianceState:"Compliant",lastPwChange:"2026-03-05" },
  { id:"u07",name:"Lisa Tanaka",email:"l.tanaka@contoso.com",dept:"Legal",title:"Legal Counsel",loc:"Tokyo",lic:"M365 E5",active:true,mfa:true,mfaMethod:"Authenticator App",login:"2026-03-10T01:20Z",riskLevel:"None",groups:["Legal-All","Compliance"],roles:["Compliance Administrator"],mb:"active",teams:true,sp:["Legal Docs"],od:"9.6 GB",av:"LT",devices:["LAPTOP-LT07"],complianceState:"Compliant",lastPwChange:"2026-02-10" },
  { id:"u08",name:"Tom Baker",email:"t.baker@contoso.com",dept:"Operations",title:"Operations Lead",loc:"Sydney",lic:"M365 E3",active:false,mfa:false,mfaMethod:"None",login:"2026-02-15T10:00Z",riskLevel:"High",groups:["Ops-All"],roles:[],mb:"inactive",teams:false,sp:[],od:"1.2 GB",av:"TB",devices:[],complianceState:"NonCompliant",lastPwChange:"2025-09-01" },
  { id:"u09",name:"Rachel Foster",email:"r.foster@contoso.com",dept:"Marketing",title:"Content Writer",loc:"Berlin",lic:"M365 F1",active:true,mfa:false,mfaMethod:"None",login:"2026-03-08T14:30Z",riskLevel:"Low",groups:["Marketing-All"],roles:[],mb:"active",teams:true,sp:["Marketing Portal"],od:"0.4 GB",av:"RF",devices:["BYOD-RF09"],complianceState:"NonCompliant",lastPwChange:"2025-12-15" },
  { id:"u10",name:"Carlos Mendez",email:"c.mendez@contoso.com",dept:"Engineering",title:"DevOps Engineer",loc:"Seattle",lic:"M365 E5",active:true,mfa:true,mfaMethod:"Authenticator App",login:"2026-03-10T07:50Z",riskLevel:"None",groups:["Engineering-All","DevOps"],roles:["Application Administrator"],mb:"active",teams:true,sp:["Engineering Hub"],od:"18.9 GB",av:"CM",devices:["DESKTOP-CM10","LAPTOP-CM10B"],complianceState:"Compliant",lastPwChange:"2026-02-25" },
  { id:"u11",name:"Nina Volkov",email:"n.volkov@contoso.com",dept:"Sales",title:"Sales Director",loc:"Berlin",lic:"M365 E5",active:true,mfa:true,mfaMethod:"SMS",login:"2026-03-10T08:10Z",riskLevel:"None",groups:["Sales-All","Leadership"],roles:[],mb:"active",teams:true,sp:["Sales Dashboard"],od:"7.3 GB",av:"NV",devices:["LAPTOP-NV11"],complianceState:"Compliant",lastPwChange:"2026-01-28" },
  { id:"u12",name:"Kevin Okafor",email:"k.okafor@contoso.com",dept:"Finance",title:"Accounting Mgr",loc:"New York",lic:"M365 E3",active:true,mfa:true,mfaMethod:"Authenticator App",login:"2026-03-10T09:00Z",riskLevel:"None",groups:["Finance-All","Payroll-Admin"],roles:[],mb:"active",teams:true,sp:["Finance Reports"],od:"4.5 GB",av:"KO",devices:["DESKTOP-KO12"],complianceState:"Compliant",lastPwChange:"2026-02-18" },
];

const SHARED_MBX = [
  { id:"sm1",name:"info@contoso.com",members:["u02","u03","u11"],active:true,autoReply:false },
  { id:"sm2",name:"support@contoso.com",members:["u06","u10"],active:true,autoReply:true },
  { id:"sm3",name:"hr@contoso.com",members:["u04"],active:true,autoReply:false },
  { id:"sm4",name:"billing@contoso.com",members:["u05","u12"],active:true,autoReply:false },
  { id:"sm5",name:"legal@contoso.com",members:["u07"],active:true,autoReply:false },
];

const TEAMS_DATA = [
  { id:"t1",name:"General",team:"Engineering",members:["u01","u10","u06"],priv:false },
  { id:"t2",name:"Project Alpha",team:"Engineering",members:["u01","u10"],priv:true },
  { id:"t3",name:"Marketing Campaigns",team:"Marketing",members:["u02","u09"],priv:false },
  { id:"t4",name:"Sales Pipeline",team:"Sales",members:["u03","u11"],priv:false },
  { id:"t5",name:"All Hands",team:"Company",members:["u01","u02","u03","u04","u05","u06","u07","u10","u11","u12"],priv:false },
  { id:"t6",name:"IT Helpdesk",team:"IT",members:["u06"],priv:false },
  { id:"t7",name:"Leadership Sync",team:"Leadership",members:["u05","u11","u07"],priv:true },
];

const SP_DATA = [
  { id:"sp1",name:"Engineering Hub",url:"/sites/engineering",owners:["u01","u10"],members:["u06"],storage:"8.2 GB",quota:"25 GB" },
  { id:"sp2",name:"Marketing Portal",url:"/sites/marketing",owners:["u02"],members:["u09"],storage:"4.1 GB",quota:"25 GB" },
  { id:"sp3",name:"HR Intranet",url:"/sites/hr",owners:["u04"],members:[],storage:"2.3 GB",quota:"25 GB" },
  { id:"sp4",name:"Finance Reports",url:"/sites/finance",owners:["u05"],members:["u12"],storage:"18.7 GB",quota:"25 GB" },
  { id:"sp5",name:"Sales Dashboard",url:"/sites/sales",owners:["u11"],members:["u03"],storage:"6.9 GB",quota:"25 GB" },
  { id:"sp6",name:"Company Wiki",url:"/sites/wiki",owners:["u06"],members:[],storage:"1.1 GB",quota:"10 GB" },
];

const DIST_LISTS = [
  { id:"dl1",name:"engineering-all@contoso.com",members:["u01","u10"],owner:"u01" },
  { id:"dl2",name:"marketing-all@contoso.com",members:["u02","u09"],owner:"u02" },
  { id:"dl3",name:"sales-all@contoso.com",members:["u03","u11"],owner:"u11" },
  { id:"dl4",name:"finance-all@contoso.com",members:["u05","u12"],owner:"u05" },
  { id:"dl5",name:"all-company@contoso.com",members:USERS.map(u=>u.id),owner:"u06" },
];

const MAIL_RULES = [
  { id:"mr1",name:"External Disclaimer - Sales",cond:"Sent externally from Sales",act:"Append disclaimer footer",on:true,pri:1 },
  { id:"mr2",name:"Auto-forward Legal",cond:"Emails to legal@contoso.com",act:"Copy to l.tanaka@contoso.com",on:true,pri:2 },
  { id:"mr3",name:"Block Large Attachments",cond:"Attachment > 25MB",act:"Reject with NDR",on:true,pri:3 },
  { id:"mr4",name:"Marketing Signature",cond:"Sent externally from Marketing",act:"Append marketing footer",on:false,pri:4 },
  { id:"mr5",name:"Encrypt Financials",cond:"Subject contains 'CONFIDENTIAL'",act:"Apply OME encryption",on:true,pri:5 },
];

// ENTRA ID DATA
const ENTRA_GROUPS = [
  { id:"g1",name:"Engineering-All",type:"Security",membership:"Assigned",members:["u01","u10"],dynamic:false },
  { id:"g2",name:"Marketing-All",type:"M365",membership:"Assigned",members:["u02","u09"],dynamic:false },
  { id:"g3",name:"Sales-All",type:"Security",membership:"Dynamic",members:["u03","u11"],dynamic:true,rule:"user.department -eq 'Sales'" },
  { id:"g4",name:"Finance-All",type:"Security",membership:"Assigned",members:["u05","u12"],dynamic:false },
  { id:"g5",name:"HR-All",type:"M365",membership:"Assigned",members:["u04"],dynamic:false },
  { id:"g6",name:"IT-All",type:"Security",membership:"Assigned",members:["u06"],dynamic:false },
  { id:"g7",name:"Global-Admins",type:"Security",membership:"Assigned",members:["u06"],dynamic:false },
  { id:"g8",name:"Leadership",type:"M365",membership:"Assigned",members:["u05","u07","u11"],dynamic:false },
  { id:"g9",name:"All-Licensed-Users",type:"Security",membership:"Dynamic",members:USERS.filter(u=>u.active).map(u=>u.id),dynamic:true,rule:"user.assignedPlans -any (assignedPlan.servicePlanId -ne null)" },
  { id:"g10",name:"MFA-Enforced",type:"Security",membership:"Dynamic",members:USERS.filter(u=>u.mfa).map(u=>u.id),dynamic:true,rule:"user.strongAuthenticationMethods -any (x -ne null)" },
];

const ENTRA_APPS = [
  { id:"a1",name:"Contoso CRM",type:"Enterprise",publisher:"Contoso",sso:"SAML",users:["u03","u11"],status:"Enabled",consent:"Admin" },
  { id:"a2",name:"Slack Integration",type:"Enterprise",publisher:"Slack Technologies",sso:"OIDC",users:["u01","u02","u06","u10"],status:"Enabled",consent:"User" },
  { id:"a3",name:"Adobe Creative Cloud",type:"Enterprise",publisher:"Adobe",sso:"SAML",users:["u02","u09"],status:"Enabled",consent:"Admin" },
  { id:"a4",name:"Salesforce",type:"Enterprise",publisher:"Salesforce",sso:"SAML",users:["u03","u11","u02"],status:"Enabled",consent:"Admin" },
  { id:"a5",name:"GitHub Enterprise",type:"Enterprise",publisher:"GitHub",sso:"OIDC",users:["u01","u10","u06"],status:"Enabled",consent:"Admin" },
  { id:"a6",name:"Suspicious App XYZ",type:"Enterprise",publisher:"Unknown",sso:"OAuth",users:["u09"],status:"Enabled",consent:"User" },
  { id:"a7",name:"Contoso Internal API",type:"App Registration",publisher:"Contoso",sso:"OAuth 2.0",users:[],status:"Enabled",consent:"Admin" },
];

const COND_ACCESS = [
  { id:"ca1",name:"Require MFA for Admins",state:"On",conditions:"Users: Global Admins, Security Admins",grant:"Require MFA",sessions:"N/A",excludes:"Emergency access accounts" },
  { id:"ca2",name:"Block Legacy Auth",state:"On",conditions:"All users, Legacy auth clients",grant:"Block access",sessions:"N/A",excludes:"Service accounts" },
  { id:"ca3",name:"Require Compliant Device",state:"On",conditions:"All users, All cloud apps",grant:"Require compliant device",sessions:"Sign-in frequency: 12h",excludes:"Guest accounts" },
  { id:"ca4",name:"Block High-Risk Sign-ins",state:"On",conditions:"All users, High risk level",grant:"Block access",sessions:"N/A",excludes:"None" },
  { id:"ca5",name:"Require MFA for External",state:"Report-only",conditions:"All users, Outside corporate network",grant:"Require MFA",sessions:"Persistent browser: disabled",excludes:"VPN IPs" },
  { id:"ca6",name:"App Protection - Mobile",state:"On",conditions:"All users, Mobile platforms",grant:"Require approved app",sessions:"N/A",excludes:"IT department" },
];

const SIGN_IN_LOGS = [
  { id:"sl1",user:"u03",time:"2026-03-10T09:12Z",app:"Outlook",status:"Failure",reason:"MFA required but not registered",ip:"203.45.67.89",location:"New York",risk:"Medium",device:"LAPTOP-ER03" },
  { id:"sl2",user:"u08",time:"2026-03-10T03:45Z",app:"SharePoint",status:"Failure",reason:"Account disabled",ip:"118.22.33.44",location:"Unknown",risk:"High",device:"Unknown" },
  { id:"sl3",user:"u09",time:"2026-03-09T22:10Z",app:"Teams",status:"Success",reason:"",ip:"85.120.45.67",location:"Berlin",risk:"Low",device:"BYOD-RF09" },
  { id:"sl4",user:"u06",time:"2026-03-10T06:15Z",app:"Azure Portal",status:"Success",reason:"",ip:"10.0.1.50",location:"Seattle (Corporate)",risk:"None",device:"DESKTOP-DK06" },
  { id:"sl5",user:"u01",time:"2026-03-10T08:22Z",app:"VS Code",status:"Success",reason:"",ip:"10.0.1.55",location:"Seattle (Corporate)",risk:"None",device:"DESKTOP-SC01" },
  { id:"sl6",user:"u03",time:"2026-03-09T14:30Z",app:"Salesforce (SSO)",status:"Success",reason:"",ip:"74.125.68.100",location:"New York",risk:"None",device:"LAPTOP-ER03" },
  { id:"sl7",user:"u08",time:"2026-03-09T11:00Z",app:"Exchange Online",status:"Failure",reason:"Account disabled",ip:"202.55.66.77",location:"Sydney",risk:"High",device:"Unknown" },
  { id:"sl8",user:"u09",time:"2026-03-08T18:45Z",app:"Suspicious App XYZ",status:"Success",reason:"User consented to app",ip:"85.120.45.67",location:"Berlin",risk:"Medium",device:"BYOD-RF09" },
];

// SECURITY DATA
const SEC_ALERTS = [
  { id:"sa1",title:"Impossible travel detected",user:"u08",severity:"High",status:"Active",time:"2026-03-10T03:50Z",source:"Identity Protection",desc:"Sign-in from Sydney and Unknown location within 10 minutes" },
  { id:"sa2",title:"Suspicious OAuth app consent",user:"u09",severity:"Medium",status:"Active",time:"2026-03-08T18:50Z",source:"Cloud App Security",desc:"User consented to unknown app 'Suspicious App XYZ' requesting mail.read permissions" },
  { id:"sa3",title:"MFA fatigue attack suspected",user:"u03",severity:"High",status:"Active",time:"2026-03-10T09:15Z",source:"Identity Protection",desc:"Multiple MFA push requests detected in short window, user has no MFA registered" },
  { id:"sa4",title:"Bulk file download",user:"u05",severity:"Low",status:"Resolved",time:"2026-03-09T16:00Z",source:"Defender for Cloud Apps",desc:"User downloaded 150+ files from Finance Reports in 30 min" },
  { id:"sa5",title:"Forwarding rule to external",user:"u08",severity:"High",status:"Active",time:"2026-03-09T11:05Z",source:"Exchange Online Protection",desc:"Mailbox rule forwarding all emails to external address detected on disabled account" },
];

const DLP_POLICIES = [
  { id:"dp1",name:"Credit Card Number Detection",status:"On",scope:"Exchange, SharePoint, OneDrive",action:"Block + Notify admin",matches:12,lastMatch:"2026-03-09" },
  { id:"dp2",name:"SSN/PII Protection",status:"On",scope:"Exchange, SharePoint, Teams",action:"Block external sharing",matches:3,lastMatch:"2026-03-07" },
  { id:"dp3",name:"Financial Data",status:"On",scope:"SharePoint, OneDrive",action:"Encrypt + Audit",matches:28,lastMatch:"2026-03-10" },
  { id:"dp4",name:"Health Records (HIPAA)",status:"Test",scope:"All locations",action:"Audit only",matches:0,lastMatch:"Never" },
  { id:"dp5",name:"Source Code Protection",status:"On",scope:"OneDrive, SharePoint",action:"Block external",matches:5,lastMatch:"2026-03-08" },
];

const COMPLIANCE_LABELS = [
  { id:"cl1",name:"Public",color:"#22c55e",desc:"No restrictions",applied:340 },
  { id:"cl2",name:"Internal",color:"#3b82f6",desc:"Internal use only",applied:1250 },
  { id:"cl3",name:"Confidential",color:"#f59e0b",desc:"Restricted to authorized users",applied:420 },
  { id:"cl4",name:"Highly Confidential",color:"#ef4444",desc:"Executive/Legal access only",applied:85 },
];

const DEFENDER_STATUS = [
  { service:"Defender for Office 365",status:"Active",lastScan:"2026-03-10T08:00Z",threats:2 },
  { service:"Defender for Endpoint",status:"Active",lastScan:"2026-03-10T07:30Z",threats:0 },
  { service:"Defender for Identity",status:"Active",lastScan:"2026-03-10T09:00Z",threats:3 },
  { service:"Defender for Cloud Apps",status:"Active",lastScan:"2026-03-10T06:00Z",threats:1 },
];

const QUARANTINE = [
  { id:"q1",sender:"promo@sketchy-deals.com",to:"u02",subject:"You've won $1M!!!",reason:"Phishing",time:"2026-03-10T08:30Z",released:false },
  { id:"q2",sender:"invoice@fake-vendor.com",to:"u12",subject:"Urgent Invoice Payment",reason:"Malware attachment",time:"2026-03-10T07:15Z",released:false },
  { id:"q3",sender:"newsletter@marketing-tool.com",to:"u09",subject:"Weekly digest",reason:"Bulk mail",time:"2026-03-09T22:00Z",released:false },
  { id:"q4",sender:"partner@legit-company.com",to:"u05",subject:"Q1 Report Attached",reason:"False positive - DLP",time:"2026-03-10T09:00Z",released:false },
];

const INTUNE_DEVICES = [
  { id:"d1",name:"DESKTOP-SC01",user:"u01",os:"Windows 11 Pro",compliance:"Compliant",enrolled:"2025-06-15",lastSync:"2026-03-10T08:20Z",encryption:"BitLocker On" },
  { id:"d2",name:"LAPTOP-MW02",user:"u02",os:"Windows 11 Pro",compliance:"Compliant",enrolled:"2025-07-20",lastSync:"2026-03-10T09:00Z",encryption:"BitLocker On" },
  { id:"d3",name:"LAPTOP-ER03",user:"u03",os:"Windows 10 Pro",compliance:"NonCompliant",enrolled:"2025-04-10",lastSync:"2026-03-09T17:40Z",encryption:"BitLocker Off" },
  { id:"d4",name:"BYOD-RF09",user:"u09",os:"Android 14",compliance:"NonCompliant",enrolled:"2025-11-01",lastSync:"2026-03-08T14:25Z",encryption:"N/A" },
  { id:"d5",name:"DESKTOP-DK06",user:"u06",os:"Windows 11 Enterprise",compliance:"Compliant",enrolled:"2025-03-01",lastSync:"2026-03-10T06:10Z",encryption:"BitLocker On" },
  { id:"d6",name:"LAPTOP-DK06B",user:"u06",os:"macOS Ventura",compliance:"Compliant",enrolled:"2025-08-15",lastSync:"2026-03-10T06:12Z",encryption:"FileVault On" },
  { id:"d7",name:"LAPTOP-AP05",user:"u05",os:"Windows 11 Pro",compliance:"Compliant",enrolled:"2025-05-22",lastSync:"2026-03-10T07:58Z",encryption:"BitLocker On" },
];

const NEWNAMES = ["Alex Turner","Maya Johansson","Ravi Sharma","Sophie Laurent","Omar Hassan","Priya Krishnan","Lucas Fischer","Jade Wong","Dmitri Volkov","Isabella Costa"];

// ════════════════════════════════════════════════════════════════════
// TICKET TEMPLATES (expanded)
// ════════════════════════════════════════════════════════════════════
const TEMPLATES = [
  { cat:"Teams",pri:"High",title:"{user} cannot join Teams meetings",desc:"{user} gets error CAA20002 joining any meeting. Desktop and browser both fail.",hint:"Check license has Teams enabled. Clear cache. Re-assign license.",steps:["Check user license","Verify Teams plan enabled","Clear Teams cache","Re-assign license","Confirm fix"],sla:120 },
  { cat:"Teams",pri:"Medium",title:"{user} can't see private channel '{channel}'",desc:"{user} told to join '{channel}' but it doesn't show. Already in team.",hint:"Private channels need explicit invite.",steps:["Open Teams Admin","Find private channel","Add user to members","Verify access"],sla:480 },
  { cat:"Teams",pri:"Low",title:"Teams status stuck 'Away' for {user}",desc:"{user} status shows Away permanently when active.",hint:"Reset presence via PowerShell or sign out all devices.",steps:["Open PowerShell","Reset-UserPresence","Sign out all devices","Verify status"],sla:1440 },
  { cat:"Teams",pri:"High",title:"{user} needs to join {team} team",desc:"Manager approved {user} to join '{team}' team.",hint:"Add user as member in Teams Admin.",steps:["Open Teams Admin","Find team","Add member","Verify"],sla:120 },
  { cat:"SharePoint",pri:"High",title:"{user} access denied on '{site}'",desc:"{user} gets Access Denied on '{site}'. Needs it for project.",hint:"Add user to site Members or Visitors group.",steps:["Open SP Admin","Navigate to permissions","Add user to group","Test access"],sla:120 },
  { cat:"SharePoint",pri:"Medium",title:"SP sync failing for {user}",desc:"{user} gets 'Can't sync this library' on '{site}'.",hint:"Reset sync, check paths, update client.",steps:["Check path lengths","Verify disk space","Reset sync client","Re-sync"],sla:480 },
  { cat:"SharePoint",pri:"Critical",title:"'{site}' storage quota exceeded",desc:"'{site}' at 25GB/25GB. Users can't upload.",hint:"Increase quota or clean versions/recycle bin.",steps:["Open SP Admin","Review storage","Increase quota","Set alerts"],sla:30 },
  { cat:"Exchange",pri:"High",title:"{user} can't access '{mailbox}' shared mailbox",desc:"{user} can't see '{mailbox}' in Outlook. Needs access.",hint:"Grant Full Access + Send As. ~60min propagation.",steps:["Open Exchange Admin","Find shared mailbox","Grant Full Access","Grant Send As","Wait propagation","Verify"],sla:120 },
  { cat:"Exchange",pri:"Critical",title:"{user} mailbox full — can't send/receive",desc:"{user} at 50GB/50GB. Error: mailbox full.",hint:"Enable Archive or increase quota. Set retention.",steps:["Open Exchange Admin","Enable Archive Mailbox","Set retention policy","Increase quota","Notify user"],sla:30 },
  { cat:"Exchange",pri:"Medium",title:"Transport rule broken for {dept}",desc:"External disclaimer from {dept} not appearing.",hint:"Check rule conditions, enabled state, priority.",steps:["Open Exchange Admin","Review transport rule","Fix conditions","Check priority","Test"],sla:480 },
  { cat:"Exchange",pri:"High",title:"Mail forwarding for {user} on leave",desc:"{user} on leave. Forward all mail to manager.",hint:"Set forwarding in EAC. Deliver to both.",steps:["Open Exchange Admin","Select mailbox","Set forwarding","Enable deliver to both","Set removal date"],sla:120 },
  { cat:"Exchange",pri:"Medium",title:"{user} not receiving external emails",desc:"{user} external mail not arriving. Internal works. 2 days.",hint:"Message trace, check spam, transport rules, MX.",steps:["Run Message Trace","Check quarantine","Review transport rules","Check blocked senders","Verify MX records"],sla:480 },
  { cat:"Entra ID",pri:"Critical",title:"{user} locked out of account",desc:"{user} locked out after failed attempts. Identity verified.",hint:"Unblock in Entra ID. Reset password. Check MFA.",steps:["Open Entra ID","Unblock sign-in","Reset password","Send temp creds","Verify sign-in"],sla:30 },
  { cat:"Entra ID",pri:"High",title:"Onboard new employee: {newuser}",desc:"New hire in {dept}. Create account, license, groups, mailbox, Teams.",hint:"Full onboarding workflow.",steps:["Create user in Entra ID","Assign M365 license","Add to dept groups","Verify mailbox","Enable Teams","Send welcome email"],sla:120 },
  { cat:"Entra ID",pri:"Medium",title:"{user} needs MFA reset",desc:"{user} got new phone. Can't do MFA. Identity verified.",hint:"Reset MFA, issue Temporary Access Pass.",steps:["Open Entra MFA settings","Delete MFA methods","Issue Temp Access Pass","User re-registers"],sla:480 },
  { cat:"Entra ID",pri:"High",title:"Offboard: {user} leaving company",desc:"{user} leaving immediately. Full offboarding needed.",hint:"Block, revoke, convert mailbox, transfer OneDrive.",steps:["Block sign-in","Revoke sessions","Reset password","Convert mailbox to shared","Set mail forwarding","Transfer OneDrive","Remove from groups","Remove licenses"],sla:120 },
  { cat:"Entra ID",pri:"Low",title:"{user} license downgrade E5→E3",desc:"Manager approved downgrade to save costs.",hint:"Review E5 features in use before removing.",steps:["Review E5 usage","Document changes","Remove E5","Assign E3","Verify services"],sla:1440 },
  { cat:"Entra ID",pri:"High",title:"Conditional Access blocking {user} remotely",desc:"{user} can't sign in from home. 'Cannot access this right now'.",hint:"Review CA policies. May need Intune enrollment.",steps:["Review CA policies","Identify blocking rule","Help enroll device","Add exception if needed","Verify access"],sla:120 },
  { cat:"Entra ID",pri:"Medium",title:"Add {user} to admin role",desc:"{user} needs Exchange Administrator role for migration project. VP approved.",hint:"Assign role in Entra ID. Use PIM for time-limited if available.",steps:["Open Entra Roles","Find Exchange Admin role","Add user assignment","Set time limit via PIM","Verify permissions"],sla:480 },
  { cat:"Security",pri:"Critical",title:"Suspicious sign-in for {user}",desc:"High-risk sign-in from {loc}. User denies it.",hint:"Block, revoke, reset pw, check forwarding rules.",steps:["Block sign-in","Revoke sessions","Review sign-in logs","Check forwarding rules","Reset password","Re-enable MFA","Unblock after securing"],sla:30 },
  { cat:"Security",pri:"High",title:"Phishing email reported by {user}",desc:"{user} received convincing phishing email. May have clicked link. Need investigation.",hint:"Check if creds compromised. Quarantine similar messages. Alert users.",steps:["Review reported email","Check user sign-in logs","Search for similar messages","Quarantine matches","Reset user password if clicked","Send phishing alert to org"],sla:120 },
  { cat:"Security",pri:"High",title:"DLP policy triggered — {user} sharing PII",desc:"{user} attempted to share file containing SSNs externally via {service}.",hint:"Block sharing, review file, notify compliance, retrain user.",steps:["Review DLP alert details","Block external share","Review file contents","Notify compliance team","Schedule user training","Update DLP policy if needed"],sla:120 },
  { cat:"Security",pri:"Medium",title:"Suspicious app consent by {user}",desc:"{user} granted permissions to unrecognized app '{app}'. App requests mail.read scope.",hint:"Review app permissions. Revoke if suspicious. Check for data exfil.",steps:["Review app in Entra ID","Check app permissions","Revoke user consent","Block app tenant-wide","Check user mailbox for exfil","Notify user"],sla:480 },
  { cat:"OneDrive",pri:"Medium",title:"{user} OneDrive sync broken",desc:"{user} has red X on files. {od} data. Restart didn't help.",hint:"Check names/paths, disk space, reset client.",steps:["Check file names","Verify disk space","Run /reset","Re-authenticate"],sla:480 },
  { cat:"OneDrive",pri:"High",title:"{user} deleted critical OneDrive files",desc:"Project folder deleted ~2 hours ago. Urgent recovery.",hint:"Recycle Bin (93 days), second-stage, or Restore.",steps:["Check Recycle Bin","Check second-stage","Use Restore feature","Verify recovery"],sla:120 },
  { cat:"Outlook",pri:"High",title:"{user} Outlook keeps crashing on launch",desc:"{user} Outlook crashes immediately on open. Tried safe mode, didn't help. Need Outlook access urgently.",hint:"Repair Office install, check add-ins, rebuild profile.",steps:["Try Outlook safe mode","Disable add-ins","Run Office repair","Rebuild Outlook profile","Verify launch"],sla:120 },
  { cat:"Outlook",pri:"Medium",title:"{user} Outlook search not returning results",desc:"{user} can't find any emails via search. Index may be corrupted.",hint:"Rebuild search index, check Outlook indexing settings.",steps:["Check indexing status","Rebuild search index","Verify Outlook search settings","Test search"],sla:480 },
  { cat:"Outlook",pri:"Medium",title:"{user} calendar sharing not working",desc:"{user} shared calendar with colleague but they can't see it. Permissions set to 'Can view all details'.",hint:"Check sharing permissions, re-share, verify recipient mailbox.",steps:["Verify sharing permissions","Remove and re-share","Check recipient can accept","Verify calendar visible"],sla:480 },
  { cat:"Outlook",pri:"High",title:"{user} OOO auto-reply not sending",desc:"{user} set Out of Office but external senders don't receive it. Internal works.",hint:"Check if external replies enabled, verify transport rules not blocking.",steps:["Check OOO settings","Enable external replies","Check transport rules","Test with external address","Verify"],sla:120 },
  { cat:"Intune",pri:"High",title:"{user} device marked non-compliant",desc:"{user}'s device {device} flagged non-compliant. Blocking access via CA policy.",hint:"Check compliance policy violations. May need BitLocker, OS update, or enrollment fix.",steps:["Check compliance status","Identify violations","Guide user through fixes","Force device sync","Verify compliance"],sla:120 },
  { cat:"Intune",pri:"Medium",title:"{user} can't enroll personal device",desc:"{user} trying to enroll BYOD for work access. Enrollment wizard errors out.",hint:"Check enrollment restrictions, device limit, OS requirements.",steps:["Check enrollment restrictions","Verify device limit","Check OS compatibility","Guide through enrollment","Verify access"],sla:480 },
];

function makeTicket(users) {
  const tpl = pick(TEMPLATES);
  const u = pick(users.filter(x => x.active));
  const reps = {
    "{user}": u.name, "{dept}": u.dept, "{loc}": pick(["Moscow","Lagos","São Paulo","Pyongyang"]),
    "{od}": u.od, "{newuser}": pick(NEWNAMES), "{channel}": pick(TEAMS_DATA).name,
    "{team}": pick(TEAMS_DATA).team, "{site}": pick(SP_DATA).name, "{mailbox}": pick(SHARED_MBX).name,
    "{service}": pick(["SharePoint","OneDrive","Teams"]), "{app}": pick(ENTRA_APPS).name,
    "{device}": pick(INTUNE_DEVICES).name
  };
  let t = tpl.title, d = tpl.desc;
  for (const [k, v] of Object.entries(reps)) { t = t.replaceAll(k, v); d = d.replaceAll(k, v); }
  return { id: genId(), title: t, desc: d, cat: tpl.cat, pri: tpl.pri, hint: tpl.hint, steps: tpl.steps, reporter: u.name, reporterEmail: u.email, status: "Open", created: Date.now(), sla: tpl.sla, notes: [], slaBreach: false };
}

// ════════════════════════════════════════════════════════════════════
// COLORS & HELPERS
// ════════════════════════════════════════════════════════════════════
const C = {
  bg:"#0b0d13",p:"#111420",pb:"#1c2030",ph:"#161a28",a:"#3b82f6",ok:"#22c55e",warn:"#eab308",
  err:"#ef4444",crit:"#dc2626",t1:"#e2e8f0",t2:"#94a3b8",t3:"#64748b",
  Teams:"#818cf8",SharePoint:"#38bdf8",Exchange:"#fb923c","Entra ID":"#a78bfa",
  OneDrive:"#22d3ee",Security:"#f87171",Outlook:"#60a5fa",Intune:"#34d399",Account:"#a78bfa"
};
const priC = p => ({ Critical: C.crit, High: C.err, Medium: C.warn, Low: C.ok }[p] || C.t3);
const catC = c => C[c] || C.a;
const catI = c => ({ Teams:"💬",SharePoint:"📄",Exchange:"📧","Entra ID":"🔐",OneDrive:"☁️",Security:"🛡️",Outlook:"📨",Intune:"📱",Account:"👤" }[c] || "📋");

// ════════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════════
export default function App() {
  const [tickets, setTickets] = useState([]);
  const [closed, setClosed] = useState([]);
  const [sel, setSel] = useState(null);
  const [page, setPage] = useState("dash");
  const [adminTab, setAdminTab] = useState("entra");
  const [entraTab, setEntraTab] = useState("users");
  const [tktFilter, setTktFilter] = useState("all");
  const [done, setDone] = useState({});
  const [note, setNote] = useState("");
  const [log, setLog] = useState([]);
  const [toast, setToast] = useState(null);
  const [score, setScore] = useState({ res: 0, slaOk: 0, slaBad: 0, pts: 0 });
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  const tRef = useRef(tickets);
  tRef.current = tickets;

  const notify = useCallback((msg, type = "info") => { setToast({ msg, type, k: Date.now() }); setTimeout(() => setToast(null), 3500); }, []);
  const addLog = (m) => setLog(p => [{ m, t: Date.now() }, ...p].slice(0, 50));

  useEffect(() => { const init = []; for (let i = 0; i < 5; i++) init.push(makeTicket(USERS)); setTickets(init); }, []);

  useEffect(() => {
    if (paused) return;
    const iv = setInterval(() => {
      if (tRef.current.filter(t => t.status !== "Resolved").length < 14) {
        const nt = makeTicket(USERS);
        setTickets(p => [nt, ...p]);
        notify("🎫 New: " + nt.title.slice(0, 50), "warn");
      }
    }, (25000 + Math.random() * 30000) / speed);
    return () => clearInterval(iv);
  }, [paused, speed, notify]);

  useEffect(() => {
    const iv = setInterval(() => {
      setTickets(p => p.map(t => {
        if (t.status === "Resolved") return t;
        if ((Date.now() - t.created) / 60000 > t.sla && !t.slaBreach) return { ...t, slaBreach: true };
        return t;
      }));
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  const doStep = (tid, si) => { setDone(p => ({ ...p, [tid]: { ...(p[tid] || {}), [si]: true } })); setTickets(p => p.map(t => t.id === tid && t.status === "Open" ? { ...t, status: "In Progress" } : t)); addLog("Step " + (si + 1) + " on " + tid); };

  const resolve = (tid) => {
    const t = tickets.find(x => x.id === tid); if (!t) return;
    const ok = (Date.now() - t.created) / 60000 <= t.sla;
    setTickets(p => p.map(x => x.id === tid ? { ...x, status: "Resolved" } : x));
    setScore(p => ({ res: p.res + 1, slaOk: p.slaOk + (ok ? 1 : 0), slaBad: p.slaBad + (ok ? 0 : 1), pts: p.pts + ({ Critical: 50, High: 30, Medium: 20, Low: 10 }[t.pri] || 10) * (ok ? 1.5 : 1) }));
    addLog("✅ Resolved " + tid); notify("✅ " + tid + " resolved!" + (ok ? " +SLA bonus!" : ""), "ok");
    setSel(null); setPage("tickets");
  };

  const closeT = (tid) => { const t = tickets.find(x => x.id === tid); if (!t || t.status !== "Resolved") return; setClosed(p => [{ ...t, status: "Closed" }, ...p]); setTickets(p => p.filter(x => x.id !== tid)); addLog("📁 Closed " + tid); };

  const addNote = (tid) => { if (!note.trim()) return; setTickets(p => p.map(t => t.id === tid ? { ...t, notes: [...t.notes, { text: note, t: Date.now() }] } : t)); setNote(""); };

  const openN = tickets.filter(t => t.status === "Open").length;
  const ipN = tickets.filter(t => t.status === "In Progress").length;
  const critN = tickets.filter(t => t.pri === "Critical" && t.status !== "Resolved").length;

  const filtered = tickets.filter(t => {
    if (tktFilter === "all") return true;
    if (tktFilter === "open") return t.status === "Open";
    if (tktFilter === "ip") return t.status === "In Progress";
    if (tktFilter === "res") return t.status === "Resolved";
    return t.cat === tktFilter;
  }).sort((a, b) => ({ Open: 0, "In Progress": 1, Resolved: 2 }[a.status] - { Open: 0, "In Progress": 1, Resolved: 2 }[b.status]) || ({ Critical: 0, High: 1, Medium: 2, Low: 3 }[a.pri] - { Critical: 0, High: 1, Medium: 2, Low: 3 }[b.pri]));

  // ── Shared style helpers ──
  const badge = (c) => ({ display: "inline-block", padding: "2px 7px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: c + "20", color: c, whiteSpace: "nowrap" });
  const btn = (c = C.a) => ({ padding: "6px 13px", background: c, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 });
  const btnO = (c = C.a) => ({ padding: "5px 12px", background: "transparent", color: c, border: "1px solid " + c + "44", borderRadius: 6, cursor: "pointer", fontSize: 12 });
  const navB = (a) => ({ padding: "7px 14px", background: a ? C.a + "18" : "transparent", color: a ? C.a : C.t2, border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: a ? 600 : 400 });
  const crd = { background: C.p, border: "1px solid " + C.pb, borderRadius: 10, padding: 14, marginBottom: 10 };
  const inp = { padding: "7px 10px", background: C.bg, border: "1px solid " + C.pb, borderRadius: 6, color: C.t1, fontSize: 13, width: "100%", outline: "none", boxSizing: "border-box" };
  const tbl = { width: "100%", borderCollapse: "collapse", fontSize: 12 };
  const th = { padding: "9px 10px", color: C.t3, fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: ".5px", borderBottom: "1px solid " + C.pb, textAlign: "left" };
  const td = { padding: "8px 10px", borderBottom: "1px solid " + C.pb + "88" };
  const secH = (t) => ({ fontSize: 15, fontWeight: 700, margin: "18px 0 10px", display: "flex", alignItems: "center", gap: 8 });
  const gridTwo = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 };
  const uAvatar = (u, sz = 24) => {
    const user = typeof u === "string" ? USERS.find(x => x.id === u) : u;
    if (!user) return null;
    return (<div style={{ width: sz, height: sz, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#38bdf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: sz * 0.35, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{user.av}</div>);
  };

  // ════════════════════════════════════════════════════════════════════
  // DASHBOARD
  // ════════════════════════════════════════════════════════════════════
  const Dashboard = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div><h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>IT Admin Dashboard</h2><p style={{ margin: "3px 0 0", color: C.t2, fontSize: 12 }}>{TENANT.name} — {TENANT.domain}</p></div>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: C.t3 }}>Speed:</span>
          {[1, 2, 3].map(s => <button key={s} onClick={() => setSpeed(s)} style={btn(speed === s ? C.a : C.pb)}>{s}x</button>)}
          <button onClick={() => setPaused(!paused)} style={btn(paused ? C.ok : C.warn)}>{paused ? "▶ Resume" : "⏸ Pause"}</button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        {[{ l: "Open", v: openN, c: C.warn, i: "📬" }, { l: "In Progress", v: ipN, c: C.a, i: "🔧" }, { l: "Critical", v: critN, c: C.err, i: "🚨" }, { l: "Resolved", v: score.res, c: C.ok, i: "✅" }, { l: "Score", v: Math.floor(score.pts), c: "#818cf8", i: "⭐" }].map(s => (
          <div key={s.l} style={{ ...crd, flex: 1, borderTop: "3px solid " + s.c }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 11, color: C.t2 }}>{s.l}</span><span>{s.i}</span></div>
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 2 }}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <div style={{ ...crd, flex: 1 }}><h4 style={{ margin: "0 0 8px", fontSize: 11, color: C.t3, textTransform: "uppercase", letterSpacing: 1 }}>SLA Performance</h4>
          <div style={{ display: "flex", gap: 20 }}>
            <div><span style={{ fontSize: 22, fontWeight: 700, color: C.ok }}>{score.slaOk}</span><span style={{ color: C.t2, fontSize: 11, marginLeft: 3 }}>Met</span></div>
            <div><span style={{ fontSize: 22, fontWeight: 700, color: C.err }}>{score.slaBad}</span><span style={{ color: C.t2, fontSize: 11, marginLeft: 3 }}>Breached</span></div>
            <div><span style={{ fontSize: 22, fontWeight: 700, color: C.a }}>{score.res > 0 ? Math.round(score.slaOk / score.res * 100) : 0}%</span><span style={{ color: C.t2, fontSize: 11, marginLeft: 3 }}>Rate</span></div>
          </div>
        </div>
        <div style={{ ...crd, flex: 1 }}><h4 style={{ margin: "0 0 8px", fontSize: 11, color: C.t3, textTransform: "uppercase", letterSpacing: 1 }}>Active by Category</h4>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["Teams", "SharePoint", "Exchange", "Entra ID", "OneDrive", "Security", "Outlook", "Intune"].map(c => { const n = tickets.filter(t => t.cat === c && t.status !== "Resolved").length; return n ? <div key={c} style={{ display: "flex", alignItems: "center", gap: 3, padding: "3px 7px", borderRadius: 4, background: catC(c) + "18" }}><span style={{ fontSize: 12 }}>{catI(c)}</span><span style={{ fontSize: 11, color: catC(c), fontWeight: 600 }}>{n}</span></div> : null; })}
          </div>
        </div>
        <div style={{ ...crd, flex: 1 }}><h4 style={{ margin: "0 0 8px", fontSize: 11, color: C.t3, textTransform: "uppercase", letterSpacing: 1 }}>Security Alerts</h4>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.err }}>{SEC_ALERTS.filter(a => a.status === "Active").length}</div>
          <div style={{ fontSize: 11, color: C.t2, marginTop: 2 }}>active alerts requiring attention</div>
        </div>
      </div>
      <div style={crd}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><h4 style={{ margin: 0, fontSize: 14 }}>Latest Tickets</h4><button onClick={() => setPage("tickets")} style={btnO()}>View All →</button></div>
        {tickets.filter(t => t.status !== "Resolved").slice(0, 6).map(t => (
          <div key={t.id} onClick={() => { setSel(t.id); setPage("detail"); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 6, cursor: "pointer", borderBottom: "1px solid " + C.pb }}>
            <span style={{ fontSize: 14 }}>{catI(t.cat)}</span>
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</div><div style={{ fontSize: 10, color: C.t3 }}>{t.id} · {t.reporter} · {ago(Date.now() - t.created)}</div></div>
            <span style={badge(priC(t.pri))}>{t.pri}</span><span style={badge(t.status === "In Progress" ? C.a : C.warn)}>{t.status}</span>
            {t.slaBreach && <span style={badge(C.err)}>SLA!</span>}
          </div>
        ))}
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════
  // TICKETS LIST
  // ════════════════════════════════════════════════════════════════════
  const Tickets = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 6 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>🎫 Ticket Queue</h2>
        <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {[{ k: "all", l: "All" }, { k: "open", l: "Open" }, { k: "ip", l: "In Prog" }, { k: "res", l: "Resolved" }, { k: "Teams", l: "💬" }, { k: "SharePoint", l: "📄" }, { k: "Exchange", l: "📧" }, { k: "Entra ID", l: "🔐" }, { k: "Security", l: "🛡️" }, { k: "Outlook", l: "📨" }, { k: "OneDrive", l: "☁️" }, { k: "Intune", l: "📱" }].map(f => (
            <button key={f.k} onClick={() => setTktFilter(f.k)} style={navB(tktFilter === f.k)} title={f.k}>{f.l}</button>
          ))}
        </div>
      </div>
      {filtered.length === 0 && <div style={{ textAlign: "center", padding: 30, color: C.t3 }}>No tickets 🎉</div>}
      {filtered.map(t => (
        <div key={t.id} onClick={() => { setSel(t.id); setPage("detail"); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 6, cursor: "pointer", borderBottom: "1px solid " + C.pb, background: sel === t.id ? C.a + "10" : "transparent" }}>
          <span style={{ fontSize: 16 }}>{catI(t.cat)}</span>
          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</div><div style={{ fontSize: 10, color: C.t3 }}>{t.id} · {t.reporter} · {t.cat} · {ago(Date.now() - t.created)}</div></div>
          <span style={badge(priC(t.pri))}>{t.pri}</span><span style={badge(t.status === "Resolved" ? C.ok : t.status === "In Progress" ? C.a : C.warn)}>{t.status}</span>
          {t.slaBreach && <span style={badge(C.err)}>SLA!</span>}
          {t.status === "Resolved" && <button onClick={e => { e.stopPropagation(); closeT(t.id); }} style={btn(C.ok)}>Close</button>}
        </div>
      ))}
    </div>
  );

  // ════════════════════════════════════════════════════════════════════
  // TICKET DETAIL
  // ════════════════════════════════════════════════════════════════════
  const Detail = () => {
    const t = tickets.find(x => x.id === sel);
    if (!t) return <div style={{ padding: 30, color: C.t3 }}>Not found <button onClick={() => setPage("tickets")} style={btnO()}>Back</button></div>;
    const comp = done[t.id] || {};
    const allDone = t.steps.every((_, i) => comp[i]);
    const el = (Date.now() - t.created) / 60000;
    return (
      <div>
        <button onClick={() => setPage("tickets")} style={{ ...btnO(), marginBottom: 12 }}>← Back</button>
        <div style={{ ...crd, borderLeft: "4px solid " + catC(t.cat) }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 18 }}>{catI(t.cat)}</span><span style={{ fontSize: 11, color: C.t3 }}>{t.id}</span>
            <span style={badge(priC(t.pri))}>{t.pri}</span><span style={badge(t.status === "Resolved" ? C.ok : t.status === "In Progress" ? C.a : C.warn)}>{t.status}</span>
            {t.slaBreach ? <span style={badge(C.err)}>⚠ SLA BREACH</span> : <span style={badge(C.ok)}>SLA: {Math.max(0, Math.floor(t.sla - el))}m</span>}
          </div>
          <h3 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 700 }}>{t.title}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12, fontSize: 12 }}>
            <div><span style={{ color: C.t3 }}>Reporter:</span><br /><strong>{t.reporter}</strong><br /><span style={{ color: C.t3, fontSize: 11 }}>{t.reporterEmail}</span></div>
            <div><span style={{ color: C.t3 }}>Category:</span><br /><strong>{t.cat}</strong></div>
            <div><span style={{ color: C.t3 }}>Assigned:</span><br /><strong>You (IT Admin)</strong></div>
          </div>
          <div style={{ padding: 10, background: C.bg, borderRadius: 6, fontSize: 13, lineHeight: 1.5 }}><div style={{ color: C.t3, fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Description</div>{t.desc}</div>
        </div>
        <div style={{ ...crd, marginTop: 0 }}>
          <h4 style={{ margin: "0 0 3px", fontSize: 13 }}>🔧 Resolution Steps</h4>
          <p style={{ margin: "0 0 10px", fontSize: 12, color: C.a, fontStyle: "italic" }}>💡 {t.hint}</p>
          {t.steps.map((step, i) => { const d = !!comp[i]; const can = i === 0 || comp[i - 1]; return (
            <div key={i} onClick={() => { if (!d && can && t.status !== "Resolved") doStep(t.id, i); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: d ? C.ok + "10" : C.bg, borderRadius: 5, marginBottom: 3, cursor: d ? "default" : "pointer", border: "1px solid " + (d ? C.ok + "33" : C.pb), opacity: can || d ? 1 : 0.35 }}>
              <div style={{ width: 18, height: 18, borderRadius: 4, border: "2px solid " + (d ? C.ok : C.t3), background: d ? C.ok : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{d ? "✓" : ""}</div>
              <span style={{ flex: 1, fontSize: 12, textDecoration: d ? "line-through" : "none", color: d ? C.t3 : C.t1 }}>{step}</span>
              {!d && can && t.status !== "Resolved" && <span style={{ fontSize: 10, color: C.a }}>Click</span>}
            </div>
          ); })}
          {allDone && t.status !== "Resolved" && <button onClick={() => resolve(t.id)} style={{ ...btn(C.ok), width: "100%", marginTop: 10, padding: "9px 0", fontSize: 13 }}>✅ Mark Resolved</button>}
          {t.status === "Resolved" && <div style={{ textAlign: "center", padding: 10, background: C.ok + "12", borderRadius: 6, marginTop: 6, color: C.ok, fontWeight: 600 }}>Resolved — <button onClick={() => closeT(t.id)} style={btn(C.ok)}>Close</button></div>}
        </div>
        <div style={{ ...crd, marginTop: 0 }}>
          <h4 style={{ margin: "0 0 6px", fontSize: 13 }}>📝 Notes</h4>
          {t.notes.map((n, i) => <div key={i} style={{ padding: "4px 8px", background: C.bg, borderRadius: 4, marginBottom: 3, fontSize: 11 }}><span style={{ color: C.t3 }}>{new Date(n.t).toLocaleTimeString()}</span> — {n.text}</div>)}
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}><input value={note} onChange={e => setNote(e.target.value)} onKeyDown={e => e.key === "Enter" && addNote(t.id)} placeholder="Add note..." style={inp} /><button onClick={() => addNote(t.id)} style={btn()}>Add</button></div>
        </div>
      </div>
    );
  };

  // ════════════════════════════════════════════════════════════════════
  // ADMIN PANELS
  // ════════════════════════════════════════════════════════════════════

  const AdminEntra = () => (
    <div>
      <div style={{ display: "flex", gap: 2, marginBottom: 14, flexWrap: "wrap" }}>
        {[{k:"users",l:"👤 Users"},{k:"groups",l:"👥 Groups"},{k:"roles",l:"🎖️ Roles"},{k:"apps",l:"📦 Apps"},{k:"ca",l:"🔒 Conditional Access"},{k:"logs",l:"📊 Sign-in Logs"}].map(v => (
          <button key={v.k} onClick={() => setEntraTab(v.k)} style={navB(entraTab === v.k)}>{v.l}</button>
        ))}
      </div>

      {entraTab === "users" && <div style={{ ...crd, padding: 0, overflowX: "auto" }}>
        <table style={tbl}><thead><tr style={{ background: C.bg }}>
          {["User","Dept","Location","License","Status","MFA","MFA Method","Risk","Compliance","Last Sign-in","Password Age"].map(h => <th key={h} style={th}>{h}</th>)}
        </tr></thead><tbody>{USERS.map(u => (
          <tr key={u.id}><td style={td}><div style={{display:"flex",alignItems:"center",gap:6}}>{uAvatar(u)}<div><div style={{fontWeight:600}}>{u.name}</div><div style={{fontSize:10,color:C.t3}}>{u.email}</div></div></div></td>
          <td style={td}>{u.dept}</td><td style={{...td,color:C.t3}}>{u.loc}</td><td style={td}><span style={badge(C.a)}>{u.lic}</span></td>
          <td style={td}><span style={badge(u.active?C.ok:C.err)}>{u.active?"Active":"Disabled"}</span></td>
          <td style={td}><span style={badge(u.mfa?C.ok:C.err)}>{u.mfa?"On":"Off"}</span></td>
          <td style={{...td,color:C.t2,fontSize:11}}>{u.mfaMethod}</td>
          <td style={td}><span style={badge(u.riskLevel==="None"?C.ok:u.riskLevel==="Low"?C.warn:u.riskLevel==="Medium"?C.warn:C.err)}>{u.riskLevel}</span></td>
          <td style={td}><span style={badge(u.complianceState==="Compliant"?C.ok:C.err)}>{u.complianceState}</span></td>
          <td style={{...td,fontSize:11,color:C.t3}}>{new Date(u.login).toLocaleDateString()}</td>
          <td style={{...td,fontSize:11}}>{u.lastPwChange}</td>
          </tr>
        ))}</tbody></table>
      </div>}

      {entraTab === "groups" && <div style={gridTwo}>
        {ENTRA_GROUPS.map(g => (
          <div key={g.id} style={crd}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <div><div style={{fontWeight:700}}>{g.name}</div><div style={{fontSize:11,color:C.t3}}>{g.type} Group · {g.membership}</div></div>
            <span style={badge(g.dynamic?C.warn:C.a)}>{g.dynamic?"Dynamic":"Assigned"}</span>
          </div>
          {g.dynamic && <div style={{fontSize:11,color:C.t3,padding:"4px 8px",background:C.bg,borderRadius:4,marginBottom:6,fontFamily:"monospace"}}>{g.rule}</div>}
          <div style={{fontSize:11,color:C.t2}}>{g.members.length} members</div>
          <div style={{display:"flex",gap:2,flexWrap:"wrap",marginTop:4}}>{g.members.slice(0,6).map(mid => {const mu=USERS.find(u=>u.id===mid);return mu?<div key={mid} style={{display:"flex",alignItems:"center",gap:3,padding:"1px 6px",background:C.pb,borderRadius:10,fontSize:10}}>{uAvatar(mu,14)}{mu.name.split(" ")[0]}</div>:null;})}{g.members.length>6&&<span style={{fontSize:10,color:C.t3}}>+{g.members.length-6} more</span>}</div>
          </div>
        ))}
      </div>}

      {entraTab === "roles" && <div style={{...crd,padding:0,overflowX:"auto"}}>
        <table style={tbl}><thead><tr style={{background:C.bg}}>
          {["User","Assigned Roles","Department","MFA Status"].map(h=><th key={h} style={th}>{h}</th>)}
        </tr></thead><tbody>{USERS.filter(u=>u.roles.length>0).map(u=>(
          <tr key={u.id}><td style={td}><div style={{display:"flex",alignItems:"center",gap:6}}>{uAvatar(u)}<div><div style={{fontWeight:600}}>{u.name}</div><div style={{fontSize:10,color:C.t3}}>{u.email}</div></div></div></td>
          <td style={td}><div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{u.roles.map(r=><span key={r} style={badge(C["Entra ID"])}>{r}</span>)}</div></td>
          <td style={td}>{u.dept}</td><td style={td}><span style={badge(u.mfa?C.ok:C.err)}>{u.mfa?"MFA On":"⚠ No MFA"}</span></td>
          </tr>
        ))}</tbody></table>
        <div style={{padding:10,fontSize:11,color:C.t3}}>💡 {USERS.filter(u=>u.roles.length>0&&!u.mfa).length>0?"⚠ WARNING: Users with admin roles but no MFA detected!":"All admin accounts have MFA enabled ✓"}</div>
      </div>}

      {entraTab === "apps" && <div style={{...crd,padding:0,overflowX:"auto"}}>
        <table style={tbl}><thead><tr style={{background:C.bg}}>
          {["App Name","Type","Publisher","SSO","Users","Consent","Status"].map(h=><th key={h} style={th}>{h}</th>)}
        </tr></thead><tbody>{ENTRA_APPS.map(a=>(
          <tr key={a.id} style={a.name.includes("Suspicious")?{background:C.err+"08"}:{}}>
          <td style={td}><span style={{fontWeight:600}}>{a.name}</span>{a.name.includes("Suspicious")&&<span style={{...badge(C.err),marginLeft:4,fontSize:9}}>⚠ REVIEW</span>}</td>
          <td style={td}><span style={badge(C.a)}>{a.type}</span></td><td style={{...td,color:C.t2}}>{a.publisher}</td>
          <td style={td}><span style={badge(C.ok)}>{a.sso}</span></td><td style={td}>{a.users.length} users</td>
          <td style={td}><span style={badge(a.consent==="Admin"?C.ok:C.warn)}>{a.consent}</span></td>
          <td style={td}><span style={badge(C.ok)}>{a.status}</span></td>
          </tr>
        ))}</tbody></table>
      </div>}

      {entraTab === "ca" && <div>
        {COND_ACCESS.map(ca=>(
          <div key={ca.id} style={{...crd,borderLeft:"3px solid "+(ca.state==="On"?C.ok:ca.state==="Report-only"?C.warn:C.err)}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{fontWeight:700,fontSize:14}}>{ca.name}</div>
              <span style={badge(ca.state==="On"?C.ok:ca.state==="Report-only"?C.warn:C.err)}>{ca.state}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,fontSize:12}}>
              <div><span style={{color:C.t3,fontSize:10,textTransform:"uppercase"}}>Conditions</span><div style={{color:C.t2,marginTop:2}}>{ca.conditions}</div></div>
              <div><span style={{color:C.t3,fontSize:10,textTransform:"uppercase"}}>Grant Controls</span><div style={{color:C.t2,marginTop:2}}>{ca.grant}</div></div>
              <div><span style={{color:C.t3,fontSize:10,textTransform:"uppercase"}}>Excludes</span><div style={{color:C.t2,marginTop:2}}>{ca.excludes}</div></div>
            </div>
          </div>
        ))}
      </div>}

      {entraTab === "logs" && <div style={{...crd,padding:0,overflowX:"auto"}}>
        <table style={tbl}><thead><tr style={{background:C.bg}}>
          {["Time","User","Application","Status","Reason","IP","Location","Risk","Device"].map(h=><th key={h} style={th}>{h}</th>)}
        </tr></thead><tbody>{SIGN_IN_LOGS.map(l=>{const u=USERS.find(x=>x.id===l.user);return(
          <tr key={l.id} style={l.risk==="High"?{background:C.err+"08"}:l.risk==="Medium"?{background:C.warn+"06"}:{}}>
          <td style={{...td,fontSize:11,whiteSpace:"nowrap"}}>{new Date(l.time).toLocaleString()}</td>
          <td style={td}><div style={{display:"flex",alignItems:"center",gap:4}}>{u&&uAvatar(u,18)}<span style={{fontSize:12}}>{u?.name||l.user}</span></div></td>
          <td style={td}>{l.app}</td>
          <td style={td}><span style={badge(l.status==="Success"?C.ok:C.err)}>{l.status}</span></td>
          <td style={{...td,color:C.t2,fontSize:11,maxWidth:150,overflow:"hidden",textOverflow:"ellipsis"}}>{l.reason||"—"}</td>
          <td style={{...td,fontSize:11,fontFamily:"monospace",color:C.t3}}>{l.ip}</td>
          <td style={{...td,fontSize:11,color:C.t2}}>{l.location}</td>
          <td style={td}><span style={badge(l.risk==="None"?C.ok:l.risk==="Low"?C.warn:l.risk==="Medium"?C.warn:C.err)}>{l.risk}</span></td>
          <td style={{...td,fontSize:11,color:C.t3}}>{l.device}</td>
          </tr>
        );})}</tbody></table>
      </div>}
    </div>
  );

  const AdminSecurity = () => (
    <div>
      <h3 style={secH()}>🛡️ Security Overview</h3>
      <div style={{display:"flex",gap:10,marginBottom:16}}>
        {DEFENDER_STATUS.map(d=>(
          <div key={d.service} style={{...crd,flex:1,borderTop:"3px solid "+(d.threats>0?C.err:C.ok)}}>
            <div style={{fontSize:12,color:C.t2,marginBottom:4}}>{d.service}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={badge(C.ok)}>{d.status}</span>
              {d.threats>0&&<span style={badge(C.err)}>{d.threats} threats</span>}
            </div>
          </div>
        ))}
      </div>

      <h3 style={secH()}>🚨 Security Alerts</h3>
      {SEC_ALERTS.map(a=>{const u=USERS.find(x=>x.id===a.user);return(
        <div key={a.id} style={{...crd,borderLeft:"3px solid "+({High:C.err,Medium:C.warn,Low:C.ok}[a.severity]||C.t3)}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <div style={{fontWeight:700}}>{a.title}</div>
            <div style={{display:"flex",gap:4}}><span style={badge({High:C.err,Medium:C.warn,Low:C.ok}[a.severity])}>{a.severity}</span><span style={badge(a.status==="Active"?C.err:C.ok)}>{a.status}</span></div>
          </div>
          <div style={{fontSize:12,color:C.t2,marginBottom:4}}>{a.desc}</div>
          <div style={{fontSize:11,color:C.t3}}>User: {u?.name||a.user} · Source: {a.source} · {new Date(a.time).toLocaleString()}</div>
        </div>
      );})}

      <h3 style={secH()}>📧 Email Quarantine</h3>
      <div style={{...crd,padding:0,overflowX:"auto"}}>
        <table style={tbl}><thead><tr style={{background:C.bg}}>
          {["Time","From","To","Subject","Reason","Status"].map(h=><th key={h} style={th}>{h}</th>)}
        </tr></thead><tbody>{QUARANTINE.map(q=>{const u=USERS.find(x=>x.id===q.to);return(
          <tr key={q.id}><td style={{...td,fontSize:11}}>{new Date(q.time).toLocaleString()}</td><td style={{...td,fontSize:11}}>{q.sender}</td>
          <td style={td}>{u?.name||q.to}</td><td style={{...td,fontWeight:600}}>{q.subject}</td>
          <td style={td}><span style={badge(q.reason.includes("Phish")?C.err:q.reason.includes("Malware")?C.crit:C.warn)}>{q.reason}</span></td>
          <td style={td}><span style={badge(q.released?C.ok:C.warn)}>{q.released?"Released":"Quarantined"}</span></td></tr>
        );})}</tbody></table>
      </div>

      <h3 style={secH()}>🔏 DLP Policies</h3>
      <div style={{...crd,padding:0,overflowX:"auto"}}>
        <table style={tbl}><thead><tr style={{background:C.bg}}>
          {["Policy","Status","Scope","Action","Matches","Last Match"].map(h=><th key={h} style={th}>{h}</th>)}
        </tr></thead><tbody>{DLP_POLICIES.map(d=>(
          <tr key={d.id}><td style={{...td,fontWeight:600}}>{d.name}</td><td style={td}><span style={badge(d.status==="On"?C.ok:C.warn)}>{d.status}</span></td>
          <td style={{...td,color:C.t2,fontSize:11}}>{d.scope}</td><td style={{...td,color:C.t2,fontSize:11}}>{d.action}</td>
          <td style={td}><span style={{fontWeight:700,color:d.matches>10?C.warn:C.t1}}>{d.matches}</span></td>
          <td style={{...td,color:C.t3,fontSize:11}}>{d.lastMatch}</td></tr>
        ))}</tbody></table>
      </div>

      <h3 style={secH()}>🏷️ Sensitivity Labels</h3>
      <div style={{display:"flex",gap:10}}>
        {COMPLIANCE_LABELS.map(l=>(
          <div key={l.id} style={{...crd,flex:1,borderTop:"3px solid "+l.color}}>
            <div style={{fontWeight:700,fontSize:14}}>{l.name}</div>
            <div style={{fontSize:11,color:C.t2,marginBottom:4}}>{l.desc}</div>
            <div style={{fontSize:20,fontWeight:700}}>{l.applied}</div>
            <div style={{fontSize:10,color:C.t3}}>items labeled</div>
          </div>
        ))}
      </div>
    </div>
  );

  const AdminExchange = () => (
    <div>
      <h3 style={secH()}>📬 Shared Mailboxes</h3>
      <div style={gridTwo}>
        {SHARED_MBX.map(mb=>(
          <div key={mb.id} style={crd}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <div style={{fontWeight:700}}>{mb.name}</div><span style={badge(mb.active?C.ok:C.err)}>{mb.active?"Active":"Inactive"}</span>
          </div>
          <div style={{fontSize:11,color:C.t2}}>Members: {mb.members.map(mid=>USERS.find(u=>u.id===mid)?.name).filter(Boolean).join(", ")}</div>
          <div style={{marginTop:6,display:"flex",gap:4}}><span style={badge(C.a)}>Full Access</span><span style={badge(C.a)}>Send As</span>{mb.autoReply&&<span style={badge(C.warn)}>Auto-reply On</span>}</div>
          </div>
        ))}
      </div>
      <h3 style={secH()}>📋 Distribution Lists</h3>
      <div style={{...crd,padding:0}}><table style={tbl}><thead><tr style={{background:C.bg}}>
        {["Address","Members","Owner"].map(h=><th key={h} style={th}>{h}</th>)}
      </tr></thead><tbody>{DIST_LISTS.map(dl=>{const ow=USERS.find(u=>u.id===dl.owner);return(
        <tr key={dl.id}><td style={{...td,fontWeight:600}}>{dl.name}</td><td style={td}>{dl.members.length}</td><td style={td}>{ow?.name||"—"}</td></tr>
      );})}</tbody></table></div>
      <h3 style={secH()}>⚙️ Transport Rules</h3>
      <div style={{...crd,padding:0}}><table style={tbl}><thead><tr style={{background:C.bg}}>
        {["Rule","Condition","Action","Priority","Status"].map(h=><th key={h} style={th}>{h}</th>)}
      </tr></thead><tbody>{MAIL_RULES.map(r=>(
        <tr key={r.id}><td style={{...td,fontWeight:600}}>{r.name}</td><td style={{...td,color:C.t2,fontSize:11}}>{r.cond}</td>
        <td style={{...td,color:C.t2,fontSize:11}}>{r.act}</td><td style={td}>{r.pri}</td>
        <td style={td}><span style={badge(r.on?C.ok:C.warn)}>{r.on?"On":"Off"}</span></td></tr>
      ))}</tbody></table></div>
      <h3 style={secH()}>📊 Mailbox Quotas</h3>
      <div style={{...crd,padding:0}}><table style={tbl}><thead><tr style={{background:C.bg}}>
        {["User","Status","License","Archive","Usage"].map(h=><th key={h} style={th}>{h}</th>)}
      </tr></thead><tbody>{USERS.map(u=>{const pct=Math.min(100,Math.round(parseFloat(u.od)*2.1/(u.lic.includes("E5")?100:50)*100));return(
        <tr key={u.id}><td style={td}><div style={{display:"flex",alignItems:"center",gap:4}}>{uAvatar(u,18)}<span>{u.name}</span></div></td>
        <td style={td}><span style={badge(u.mb==="active"?C.ok:C.err)}>{u.mb}</span></td><td style={td}><span style={badge(C.a)}>{u.lic}</span></td>
        <td style={td}><span style={badge(u.lic.includes("E5")?C.ok:C.t3)}>{u.lic.includes("E5")?"On":"Off"}</span></td>
        <td style={{...td,minWidth:120}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{flex:1,height:5,background:C.bg,borderRadius:3,overflow:"hidden"}}><div style={{width:pct+"%",height:"100%",background:pct>80?C.err:pct>60?C.warn:C.ok,borderRadius:3}}/></div><span style={{fontSize:10,color:pct>80?C.err:C.t2,fontWeight:600}}>{pct}%</span></div></td></tr>
      );})}</tbody></table></div>
    </div>
  );

  const AdminTeams = () => (
    <div>
      <h3 style={secH()}>💬 Teams & Channels</h3>
      <div style={gridTwo}>{TEAMS_DATA.map(ch=>(
        <div key={ch.id} style={crd}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
          <div><span style={{fontWeight:700}}>{ch.name}</span><span style={{fontSize:11,color:C.t3,marginLeft:6}}>({ch.team})</span></div>
          <span style={badge(ch.priv?C.warn:C.ok)}>{ch.priv?"🔒 Private":"🌐 Public"}</span>
        </div>
        <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{ch.members.map(mid=>{const mu=USERS.find(u=>u.id===mid);return mu?<div key={mid} style={{display:"flex",alignItems:"center",gap:3,padding:"1px 6px",background:C.pb,borderRadius:10,fontSize:10}}>{uAvatar(mu,14)}{mu.name.split(" ")[0]}</div>:null;})}</div>
        </div>
      ))}</div>
    </div>
  );

  const AdminSP = () => (
    <div>
      <h3 style={secH()}>📄 SharePoint Sites</h3>
      <div style={gridTwo}>{SP_DATA.map(s=>{const pct=Math.round(parseFloat(s.storage)/parseFloat(s.quota)*100);return(
        <div key={s.id} style={crd}><div style={{fontWeight:700,marginBottom:2}}>{s.name}</div>
          <div style={{fontSize:11,color:C.t3,marginBottom:6}}>{s.url}</div>
          <div style={{fontSize:12,marginBottom:4}}><span style={{color:C.t3}}>Owners:</span> {s.owners.map(id=>USERS.find(u=>u.id===id)?.name).join(", ")}</div>
          <div style={{fontSize:12,marginBottom:6}}><span style={{color:C.t3}}>Members:</span> {s.members.length>0?s.members.map(id=>USERS.find(u=>u.id===id)?.name).join(", "):"None"}</div>
          <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{flex:1,height:5,background:C.bg,borderRadius:3,overflow:"hidden"}}><div style={{width:pct+"%",height:"100%",background:pct>80?C.err:pct>60?C.warn:C.ok,borderRadius:3}}/></div><span style={{fontSize:10,color:C.t2}}>{s.storage} / {s.quota}</span></div>
        </div>
      );})}</div>
    </div>
  );

  const AdminOutlook = () => (
    <div>
      <h3 style={secH()}>📨 Outlook / Exchange Online Configuration</h3>
      <div style={gridTwo}>
        <div style={crd}><div style={{fontWeight:700,marginBottom:6}}>📧 Anti-Spam Settings</div>
          {[{l:"Inbound spam filter",v:"On"},{l:"Bulk email threshold",v:"6 (moderate)"},{l:"Spam action",v:"Move to Junk"},{l:"High-confidence spam",v:"Quarantine"},{l:"Phishing",v:"Quarantine"},{l:"High-confidence phish",v:"Block"}].map(r=>(
            <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid "+C.pb+"66",fontSize:12}}><span style={{color:C.t2}}>{r.l}</span><span style={{fontWeight:600}}>{r.v}</span></div>
          ))}
        </div>
        <div style={crd}><div style={{fontWeight:700,marginBottom:6}}>🛡️ Anti-Malware Settings</div>
          {[{l:"Common attachment filter",v:"On"},{l:"Zero-hour auto purge",v:"On"},{l:"Admin notifications",v:"d.kim@contoso.com"},{l:"Quarantine policy",v:"AdminOnlyAccessPolicy"},{l:"Safe Attachments",v:"Enabled (E5)"},{l:"Safe Links",v:"Enabled (E5)"}].map(r=>(
            <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid "+C.pb+"66",fontSize:12}}><span style={{color:C.t2}}>{r.l}</span><span style={{fontWeight:600}}>{r.v}</span></div>
          ))}
        </div>
      </div>
      <div style={gridTwo}>
        <div style={crd}><div style={{fontWeight:700,marginBottom:6}}>🔐 DKIM / SPF / DMARC</div>
          {[{l:"SPF Record",v:"v=spf1 include:spf.protection.outlook.com -all",s:true},{l:"DKIM Signing",v:"Enabled for contoso.com",s:true},{l:"DMARC Policy",v:"v=DMARC1; p=quarantine; rua=dmarc@contoso.com",s:true}].map(r=>(
            <div key={r.l} style={{padding:"6px 0",borderBottom:"1px solid "+C.pb+"66"}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12}}><span style={{color:C.t2}}>{r.l}</span><span style={badge(r.s?C.ok:C.err)}>{r.s?"Valid":"Missing"}</span></div><div style={{fontSize:10,color:C.t3,fontFamily:"monospace",marginTop:2}}>{r.v}</div></div>
          ))}
        </div>
        <div style={crd}><div style={{fontWeight:700,marginBottom:6}}>⚙️ Outlook Web App Policies</div>
          {[{l:"OWA access",v:"Enabled"},{l:"ActiveSync",v:"Enabled"},{l:"POP3",v:"Disabled"},{l:"IMAP",v:"Disabled"},{l:"MAPI",v:"Enabled"},{l:"Offline OWA",v:"Enabled"}].map(r=>(
            <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid "+C.pb+"66",fontSize:12}}><span style={{color:C.t2}}>{r.l}</span><span style={badge(r.v==="Enabled"?C.ok:C.warn)}>{r.v}</span></div>
          ))}
        </div>
      </div>
      <h3 style={secH()}>📧 Quarantine ({QUARANTINE.length} items)</h3>
      <div style={{...crd,padding:0}}><table style={tbl}><thead><tr style={{background:C.bg}}>
        {["Time","From","To","Subject","Reason","Status"].map(h=><th key={h} style={th}>{h}</th>)}
      </tr></thead><tbody>{QUARANTINE.map(q=>{const u=USERS.find(x=>x.id===q.to);return(
        <tr key={q.id}><td style={{...td,fontSize:11}}>{new Date(q.time).toLocaleString()}</td><td style={{...td,fontSize:11}}>{q.sender}</td>
        <td style={td}>{u?.name||q.to}</td><td style={{...td,fontWeight:600}}>{q.subject}</td>
        <td style={td}><span style={badge(q.reason.includes("Phish")?C.err:q.reason.includes("Malware")?C.crit:C.warn)}>{q.reason}</span></td>
        <td style={td}><span style={badge(C.warn)}>Quarantined</span></td></tr>
      );})}</tbody></table></div>
    </div>
  );

  const AdminIntune = () => (
    <div>
      <h3 style={secH()}>📱 Intune Device Management</h3>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        <div style={{...crd,flex:1,borderTop:"3px solid "+C.ok}}><div style={{fontSize:11,color:C.t2}}>Compliant</div><div style={{fontSize:24,fontWeight:700,color:C.ok}}>{INTUNE_DEVICES.filter(d=>d.compliance==="Compliant").length}</div></div>
        <div style={{...crd,flex:1,borderTop:"3px solid "+C.err}}><div style={{fontSize:11,color:C.t2}}>Non-Compliant</div><div style={{fontSize:24,fontWeight:700,color:C.err}}>{INTUNE_DEVICES.filter(d=>d.compliance==="NonCompliant").length}</div></div>
        <div style={{...crd,flex:1,borderTop:"3px solid "+C.a}}><div style={{fontSize:11,color:C.t2}}>Total Devices</div><div style={{fontSize:24,fontWeight:700}}>{INTUNE_DEVICES.length}</div></div>
      </div>
      <div style={{...crd,padding:0,overflowX:"auto"}}><table style={tbl}><thead><tr style={{background:C.bg}}>
        {["Device","User","OS","Compliance","Enrolled","Last Sync","Encryption"].map(h=><th key={h} style={th}>{h}</th>)}
      </tr></thead><tbody>{INTUNE_DEVICES.map(d=>{const u=USERS.find(x=>x.id===d.user);return(
        <tr key={d.id} style={d.compliance==="NonCompliant"?{background:C.err+"06"}:{}}>
        <td style={{...td,fontWeight:600}}>{d.name}</td>
        <td style={td}><div style={{display:"flex",alignItems:"center",gap:4}}>{u&&uAvatar(u,16)}<span>{u?.name||d.user}</span></div></td>
        <td style={{...td,color:C.t2}}>{d.os}</td>
        <td style={td}><span style={badge(d.compliance==="Compliant"?C.ok:C.err)}>{d.compliance}</span></td>
        <td style={{...td,fontSize:11,color:C.t3}}>{d.enrolled}</td>
        <td style={{...td,fontSize:11,color:C.t3}}>{new Date(d.lastSync).toLocaleString()}</td>
        <td style={td}><span style={badge(d.encryption.includes("On")?C.ok:C.warn)}>{d.encryption}</span></td>
        </tr>
      );})}</tbody></table></div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════
  // ADMIN CENTER (combined)
  // ════════════════════════════════════════════════════════════════════
  const AdminCenter = () => (
    <div>
      <h2 style={{ margin: "0 0 14px", fontSize: 18, fontWeight: 700 }}>🏢 M365 Admin Center — {TENANT.name}</h2>
      <div style={{ display: "flex", gap: 2, marginBottom: 14, flexWrap: "wrap" }}>
        {[{k:"entra",l:"🔐 Entra ID"},{k:"security",l:"🛡️ Security"},{k:"exchange",l:"📧 Exchange"},{k:"outlook",l:"📨 Outlook"},{k:"teams",l:"💬 Teams"},{k:"sp",l:"📄 SharePoint"},{k:"intune",l:"📱 Intune"}].map(t=>(
          <button key={t.k} onClick={()=>setAdminTab(t.k)} style={navB(adminTab===t.k)}>{t.l}</button>
        ))}
      </div>
      {adminTab==="entra"&&<AdminEntra/>}
      {adminTab==="security"&&<AdminSecurity/>}
      {adminTab==="exchange"&&<AdminExchange/>}
      {adminTab==="outlook"&&<AdminOutlook/>}
      {adminTab==="teams"&&<AdminTeams/>}
      {adminTab==="sp"&&<AdminSP/>}
      {adminTab==="intune"&&<AdminIntune/>}
    </div>
  );

  // ════════════════════════════════════════════════════════════════════
  // ROOT RENDER
  // ════════════════════════════════════════════════════════════════════
  return (
    <div style={{ fontFamily: "'Segoe UI',-apple-system,sans-serif", background: C.bg, color: C.t1, minHeight: "100vh", display: "flex", flexDirection: "column", fontSize: 13 }}>
      <style>{`*{box-sizing:border-box;margin:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:${C.bg}}::-webkit-scrollbar-thumb{background:${C.pb};border-radius:3px}@keyframes slideIn{from{transform:translateX(50px);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}tr:hover{background:${C.ph}!important}button:hover{filter:brightness(1.12)}`}</style>

      <div style={{ background: "#090b10", borderBottom: "1px solid " + C.pb, padding: "0 16px", display: "flex", alignItems: "center", height: 48, gap: 12, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#fff" }}>M</div>
          <div><div style={{ fontWeight: 700, fontSize: 13 }}>M365 Admin Simulator</div><div style={{ fontSize: 9, color: C.t3 }}>Training Environment</div></div>
        </div>
        <div style={{ display: "flex", gap: 2, marginLeft: 24 }}>
          <button onClick={() => setPage("dash")} style={navB(page === "dash")}>📊 Dashboard</button>
          <button onClick={() => setPage("tickets")} style={navB(page === "tickets" || page === "detail")}>🎫 Tickets{openN > 0 && <span style={{ marginLeft: 3, padding: "0 5px", borderRadius: 8, background: C.err, color: "#fff", fontSize: 10 }}>{openN}</span>}</button>
          <button onClick={() => setPage("admin")} style={navB(page === "admin")}>🏢 Admin Center</button>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          {critN > 0 && <div style={{ padding: "3px 8px", borderRadius: 5, background: C.err + "20", color: C.err, fontSize: 11, fontWeight: 600, animation: "pulse 1.5s infinite" }}>🚨 {critN} Critical</div>}
          <div style={{ fontSize: 11, color: C.t2 }}>⭐ {Math.floor(score.pts)}</div>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          {page === "dash" && <Dashboard />}
          {page === "tickets" && <Tickets />}
          {page === "detail" && <Detail />}
          {page === "admin" && <AdminCenter />}
        </div>
        <div style={{ width: 220, borderLeft: "1px solid " + C.pb, background: C.p, overflow: "auto", flexShrink: 0, padding: 12, fontSize: 11 }}>
          <h4 style={{ margin: "0 0 8px", fontSize: 11, color: C.t3, textTransform: "uppercase", letterSpacing: 1 }}>📋 Activity</h4>
          {log.length === 0 && <div style={{ color: C.t3 }}>Start resolving!</div>}
          {log.map((l, i) => <div key={i} style={{ padding: "4px 0", borderBottom: "1px solid " + C.pb + "66" }}><div style={{ color: C.t1 }}>{l.m}</div><div style={{ color: C.t3 }}>{ago(Date.now() - l.t)}</div></div>)}
          <h4 style={{ margin: "14px 0 6px", fontSize: 11, color: C.t3, textTransform: "uppercase", letterSpacing: 1 }}>📁 Closed ({closed.length})</h4>
          {closed.slice(0, 8).map(t => <div key={t.id} style={{ padding: "2px 0", color: C.t3 }}>{t.id} — {t.title.slice(0, 24)}...</div>)}
        </div>
      </div>

      {toast && <div style={{ position: "fixed", bottom: 20, right: 20, padding: "10px 18px", borderRadius: 8, background: toast.type === "ok" ? C.ok : toast.type === "warn" ? C.warn : C.a, color: "#fff", fontWeight: 600, fontSize: 12, zIndex: 9999, boxShadow: "0 8px 32px rgba(0,0,0,.5)", animation: "slideIn .3s ease" }}>{toast.msg}</div>}
    </div>
  );
}
