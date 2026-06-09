/* ============================================================
   M365 TRAINING CENTER - Simulated Tenant Data
   Realistic M365 tenant: users, groups, licenses, mailboxes,
   Teams, SharePoint sites, service health, audit logs
   ============================================================ */
(function () {
  'use strict';
  window.M365Tenant = window.M365Tenant || {};

  // ----------------------------------------------------------
  //  TENANT INFO
  // ----------------------------------------------------------
  var tenant = {
    name: 'Contoso Ltd',
    domain: 'contoso.com',
    altDomains: ['contoso.onmicrosoft.com', 'contoso.co.uk'],
    tenantId: 'a3b1c4d2-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    created: '2021-03-15T00:00:00Z',
    country: 'United Kingdom',
    adminUrl: 'https://admin.microsoft.com'
  };

  // ----------------------------------------------------------
  //  LICENSE POOLS
  // ----------------------------------------------------------
  var licenses = {
    'M365 Business Premium': { total: 50, assigned: 38, sku: 'SPB', price: 16.60, services: ['Exchange Online','SharePoint Online','Teams','OneDrive','Intune','Azure AD P1','Defender for Business'] },
    'M365 Business Standard': { total: 30, assigned: 24, sku: 'O365_BUSINESS_PREMIUM', price: 9.60, services: ['Exchange Online','SharePoint Online','Teams','OneDrive','Desktop Apps'] },
    'M365 Business Basic': { total: 20, assigned: 15, sku: 'O365_BUSINESS_ESSENTIALS', price: 4.50, services: ['Exchange Online','SharePoint Online','Teams','OneDrive'] },
    'Enterprise Mobility + Security E3': { total: 10, assigned: 8, sku: 'EMS', price: 7.30, services: ['Azure AD P1','Intune','Azure Information Protection'] },
    'Exchange Online (Plan 1)': { total: 10, assigned: 5, sku: 'EXCHANGESTANDARD', price: 3.00, services: ['Exchange Online'] },
    'Microsoft Teams Exploratory': { total: 100, assigned: 3, sku: 'TEAMS_EXPLORATORY', price: 0, services: ['Teams'] }
  };

  // ----------------------------------------------------------
  //  DEPARTMENTS & LOCATIONS
  // ----------------------------------------------------------
  var departments = ['IT','Sales','Marketing','HR','Finance','Engineering','Operations','Legal','Executive','Support'];
  var offices = ['London HQ','Manchester','Edinburgh','Remote - UK','Remote - EU'];
  var jobTitles = {
    IT: ['IT Manager','Systems Administrator','Network Engineer','Help Desk Analyst','Security Analyst','Cloud Architect'],
    Sales: ['Sales Director','Account Executive','Sales Representative','Business Development Manager'],
    Marketing: ['Marketing Manager','Content Strategist','Digital Marketing Specialist','Brand Manager'],
    HR: ['HR Director','HR Business Partner','Recruitment Specialist','Learning & Development Coordinator'],
    Finance: ['Finance Director','Financial Analyst','Accounts Payable Clerk','Payroll Administrator'],
    Engineering: ['Engineering Manager','Software Developer','QA Engineer','DevOps Engineer','Data Engineer'],
    Operations: ['Operations Manager','Project Coordinator','Facilities Manager','Procurement Specialist'],
    Legal: ['General Counsel','Legal Advisor','Compliance Officer','Contract Manager'],
    Executive: ['CEO','COO','CTO','CFO','CISO'],
    Support: ['Customer Support Lead','Support Agent','Technical Support Specialist']
  };

  // ----------------------------------------------------------
  //  USER DATABASE (50 realistic users)
  // ----------------------------------------------------------
  var firstNames = ['James','Emma','Oliver','Charlotte','William','Amelia','George','Isla','Harry','Emily','Jack','Sophia','Jacob','Mia','Thomas','Isabella','Charlie','Olivia','Oscar','Ava','Henry','Grace','Leo','Lily','Arthur','Freya','Noah','Chloe','Freddie','Ella','Alfie','Hannah','Theo','Lucy','Archie','Ruby','Joshua','Evie','Alexander','Phoebe','Max','Alice','Daniel','Jessica','Edward','Rosie','Lucas','Florence','Ethan','Poppy'];
  var lastNames = ['Smith','Jones','Williams','Taylor','Brown','Davies','Wilson','Evans','Thomas','Roberts','Johnson','Walker','Wright','Robinson','Thompson','White','Edwards','Hughes','Green','Hall','Lewis','Harris','Clarke','Patel','Jackson','Wood','Turner','Martin','Cooper','Hill','Ward','Morris','Moore','Clark','Lee','King','Baker','Harrison','Morgan','Allen','Young','Watson','Scott','Bennett','Gray','James','Kelly','Cook','Murray','Marshall'];

  function generateUsers() {
    var result = [];
    var usedEmails = {};
    for (var i = 0; i < 50; i++) {
      var fn = firstNames[i];
      var ln = lastNames[i];
      var dept = departments[i % departments.length];
      var titles = jobTitles[dept];
      var title = titles[i % titles.length];
      var office = offices[i % offices.length];
      var email = fn.toLowerCase().charAt(0) + '.' + ln.toLowerCase() + '@contoso.com';
      if (usedEmails[email]) email = fn.toLowerCase() + '.' + ln.toLowerCase() + '@contoso.com';
      usedEmails[email] = true;
      var licKeys = Object.keys(licenses);
      var lic = i < 38 ? 'M365 Business Premium' : (i < 45 ? 'M365 Business Standard' : (i < 48 ? 'M365 Business Basic' : '(none)'));
      var roles = ['User'];
      if (i === 0) roles = ['Global Admin'];
      else if (i === 1) roles = ['User Admin'];
      else if (i === 2) roles = ['Exchange Admin'];
      else if (i === 3) roles = ['SharePoint Admin'];
      else if (i === 4) roles = ['Teams Admin'];
      else if (i === 5) roles = ['Helpdesk Admin'];
      else if (i === 6) roles = ['License Admin'];
      else if (i === 7) roles = ['Security Admin'];
      var status = (i === 42 || i === 47) ? 'Blocked' : 'Active';
      var mfa = (i < 40) ? 'Enabled' : 'Disabled';
      var created = new Date(2021, 3 + Math.floor(i/5), 1 + (i % 28));
      var lastSignIn = (status === 'Blocked') ? null : new Date(2026, 2, 10 - (i % 14), 8 + (i % 12), i % 60);
      var pwdLastSet = new Date(2026, 1, 1 + (i % 28));
      result.push({
        id: i + 1,
        objectId: 'usr-' + ('00000000-0000-0000-0000-' + ('000000000' + (i+1)).slice(-12)),
        firstName: fn, lastName: ln, displayName: fn + ' ' + ln,
        email: email, upn: email,
        department: dept, jobTitle: title, office: office,
        license: lic, roles: roles, status: status,
        mfaStatus: mfa, phone: '+44 7' + (700 + i) + ' ' + (100000 + i * 1111),
        created: created.toISOString(), lastSignIn: lastSignIn ? lastSignIn.toISOString() : null,
        passwordLastSet: pwdLastSet.toISOString(),
        mailboxSize: Math.round(500 + Math.random() * 4500) + ' MB',
        oneDriveUsage: Math.round(Math.random() * 50 * 10) / 10 + ' GB'
      });
    }
    return result;
  }
  var users = generateUsers();

  // ----------------------------------------------------------
  //  GROUPS
  // ----------------------------------------------------------
  var groups = [
    { id: 'grp-001', name: 'All Staff', type: 'Microsoft 365', email: 'allstaff@contoso.com', members: 50, owners: ['j.smith@contoso.com'], dynamic: false, description: 'All company employees' },
    { id: 'grp-002', name: 'IT Department', type: 'Security', email: null, members: 8, owners: ['j.smith@contoso.com'], dynamic: false, description: 'IT team security group' },
    { id: 'grp-003', name: 'Sales Team', type: 'Microsoft 365', email: 'sales@contoso.com', members: 12, owners: ['e.wilson@contoso.com'], dynamic: false, description: 'Sales department collaboration' },
    { id: 'grp-004', name: 'Marketing', type: 'Microsoft 365', email: 'marketing@contoso.com', members: 8, owners: ['s.johnson@contoso.com'], dynamic: false, description: 'Marketing team workspace' },
    { id: 'grp-005', name: 'Engineering', type: 'Microsoft 365', email: 'engineering@contoso.com', members: 10, owners: ['g.thomas@contoso.com'], dynamic: false, description: 'Engineering team' },
    { id: 'grp-006', name: 'Executive Team', type: 'Security', email: null, members: 5, owners: ['j.smith@contoso.com'], dynamic: false, description: 'C-suite and VPs' },
    { id: 'grp-007', name: 'UK Employees', type: 'Distribution', email: 'uk-all@contoso.com', members: 42, owners: ['j.smith@contoso.com'], dynamic: false, description: 'All UK-based employees' },
    { id: 'grp-008', name: 'Remote Workers', type: 'Security', email: null, members: 15, owners: ['o.williams@contoso.com'], dynamic: true, description: 'Dynamic group: all remote workers' },
    { id: 'grp-009', name: 'M365 Premium Users', type: 'Security', email: null, members: 38, owners: ['j.smith@contoso.com'], dynamic: true, description: 'Dynamic group for license assignment' },
    { id: 'grp-010', name: 'Project Phoenix', type: 'Microsoft 365', email: 'phoenix@contoso.com', members: 14, owners: ['h.clark@contoso.com'], dynamic: false, description: 'Cross-functional project team' }
  ];

  // ----------------------------------------------------------
  //  TEAMS
  // ----------------------------------------------------------
  var teams = [
    { id: 'team-001', name: 'IT Operations', visibility: 'Private', members: 8, channels: ['General','Incidents','Change Requests','Monitoring','Knowledge Base'], owner: 'j.smith@contoso.com', created: '2021-04-01T00:00:00Z' },
    { id: 'team-002', name: 'Sales', visibility: 'Private', members: 12, channels: ['General','Leads','Pipeline','Win Room','Competitor Intel'], owner: 'e.wilson@contoso.com', created: '2021-04-15T00:00:00Z' },
    { id: 'team-003', name: 'Marketing', visibility: 'Private', members: 8, channels: ['General','Campaigns','Content Calendar','Social Media','Analytics'], owner: 's.johnson@contoso.com', created: '2021-05-01T00:00:00Z' },
    { id: 'team-004', name: 'All Company', visibility: 'Public', members: 50, channels: ['General','Announcements','Social','Watercooler'], owner: 'j.smith@contoso.com', created: '2021-03-20T00:00:00Z' },
    { id: 'team-005', name: 'Engineering', visibility: 'Private', members: 10, channels: ['General','Backend','Frontend','DevOps','Code Reviews','Architecture'], owner: 'g.thomas@contoso.com', created: '2021-06-01T00:00:00Z' },
    { id: 'team-006', name: 'Project Phoenix', visibility: 'Private', members: 14, channels: ['General','Design','Development','Testing','Launch Planning'], owner: 'h.clark@contoso.com', created: '2025-09-15T00:00:00Z' },
    { id: 'team-007', name: 'HR & People', visibility: 'Private', members: 6, channels: ['General','Recruitment','Policies','Onboarding'], owner: 'i.isla@contoso.com', created: '2021-04-10T00:00:00Z' },
    { id: 'team-008', name: 'Finance', visibility: 'Private', members: 5, channels: ['General','Budgets','Reporting','Expenses'], owner: 'e.emily@contoso.com', created: '2021-04-20T00:00:00Z' }
  ];

  // ----------------------------------------------------------
  //  SHAREPOINT SITES
  // ----------------------------------------------------------
  var sharePointSites = [
    { url: 'https://contoso.sharepoint.com', title: 'Contoso Home', type: 'Communication', storage: '2.1 GB', owner: 'j.smith@contoso.com', status: 'Active' },
    { url: 'https://contoso.sharepoint.com/sites/IT', title: 'IT Hub', type: 'Team', storage: '8.4 GB', owner: 'j.smith@contoso.com', status: 'Active' },
    { url: 'https://contoso.sharepoint.com/sites/Sales', title: 'Sales Portal', type: 'Team', storage: '5.2 GB', owner: 'e.wilson@contoso.com', status: 'Active' },
    { url: 'https://contoso.sharepoint.com/sites/Marketing', title: 'Marketing Hub', type: 'Team', storage: '12.7 GB', owner: 's.johnson@contoso.com', status: 'Active' },
    { url: 'https://contoso.sharepoint.com/sites/HR', title: 'HR Portal', type: 'Communication', storage: '1.8 GB', owner: 'i.isla@contoso.com', status: 'Active' },
    { url: 'https://contoso.sharepoint.com/sites/Engineering', title: 'Engineering Wiki', type: 'Team', storage: '15.3 GB', owner: 'g.thomas@contoso.com', status: 'Active' },
    { url: 'https://contoso.sharepoint.com/sites/Phoenix', title: 'Project Phoenix', type: 'Team', storage: '3.9 GB', owner: 'h.clark@contoso.com', status: 'Active' },
    { url: 'https://contoso.sharepoint.com/sites/OldIntranet', title: 'Legacy Intranet', type: 'Communication', storage: '22.1 GB', owner: 'j.smith@contoso.com', status: 'Archived' }
  ];

  // ----------------------------------------------------------
  //  SERVICE HEALTH
  // ----------------------------------------------------------
  var serviceHealth = [
    { service: 'Exchange Online', status: 'Operational', icon: 'mail', lastIncident: '2026-02-28T14:00:00Z', description: 'All Exchange Online services are functioning normally.' },
    { service: 'SharePoint Online', status: 'Operational', icon: 'sharepoint', lastIncident: '2026-03-01T09:00:00Z', description: 'All SharePoint services are functioning normally.' },
    { service: 'Microsoft Teams', status: 'Service Degradation', icon: 'teams', lastIncident: '2026-03-10T06:30:00Z', description: 'Some users may experience delays when loading chat history. Investigation in progress.' },
    { service: 'Azure Active Directory', status: 'Operational', icon: 'shield', lastIncident: '2026-02-15T11:00:00Z', description: 'All identity services are functioning normally.' },
    { service: 'OneDrive for Business', status: 'Operational', icon: 'cloud', lastIncident: '2026-02-20T16:00:00Z', description: 'All OneDrive services are functioning normally.' },
    { service: 'Microsoft Intune', status: 'Operational', icon: 'device', lastIncident: '2026-01-30T08:00:00Z', description: 'All Intune services are functioning normally.' },
    { service: 'Microsoft Defender', status: 'Operational', icon: 'shield', lastIncident: '2026-02-10T10:00:00Z', description: 'All Defender services are functioning normally.' },
    { service: 'Power Platform', status: 'Advisory', icon: 'lightning', lastIncident: '2026-03-09T22:00:00Z', description: 'Planned maintenance window scheduled for March 12. No impact expected.' }
  ];

  // ----------------------------------------------------------
  //  AUDIT LOG (recent activity)
  // ----------------------------------------------------------
  var auditLog = [
    { timestamp: '2026-03-10T09:45:12Z', user: 'j.smith@contoso.com', action: 'UserLoggedIn', target: 'admin.microsoft.com', result: 'Success', ip: '86.134.22.105' },
    { timestamp: '2026-03-10T09:42:00Z', user: 'j.smith@contoso.com', action: 'Set-MsolUserPassword', target: 't.brown@contoso.com', result: 'Success', ip: '86.134.22.105' },
    { timestamp: '2026-03-10T09:30:55Z', user: 's.johnson@contoso.com', action: 'FileAccessed', target: '/sites/Marketing/Shared Documents/Q1 Report.docx', result: 'Success', ip: '82.45.112.8' },
    { timestamp: '2026-03-10T09:15:30Z', user: 'j.smith@contoso.com', action: 'Add-MsolGroupMember', target: 'grp-003 (Sales Team)', result: 'Success', ip: '86.134.22.105' },
    { timestamp: '2026-03-10T08:55:00Z', user: 'o.williams@contoso.com', action: 'New-Team', target: 'Q2 Planning', result: 'Success', ip: '185.76.33.21' },
    { timestamp: '2026-03-10T08:30:22Z', user: 'j.smith@contoso.com', action: 'Set-MsolUser', target: 'a.robinson@contoso.com (blocked)', result: 'Success', ip: '86.134.22.105' },
    { timestamp: '2026-03-09T17:45:00Z', user: 'e.wilson@contoso.com', action: 'UserLoggedIn', target: 'outlook.office365.com', result: 'Success', ip: '92.11.44.67' },
    { timestamp: '2026-03-09T16:20:00Z', user: 'j.smith@contoso.com', action: 'New-MsolUser', target: 'p.poppy@contoso.com', result: 'Success', ip: '86.134.22.105' },
    { timestamp: '2026-03-09T15:00:00Z', user: 'm.davis@contoso.com', action: 'UserLoginFailed', target: 'portal.azure.com', result: 'Failure - Account blocked', ip: '41.215.88.3' },
    { timestamp: '2026-03-09T14:30:00Z', user: 'j.smith@contoso.com', action: 'Set-SPOSite', target: '/sites/OldIntranet (archived)', result: 'Success', ip: '86.134.22.105' }
  ];

  // ----------------------------------------------------------
  //  CONDITIONAL ACCESS POLICIES
  // ----------------------------------------------------------
  var conditionalAccess = [
    { id: 'ca-001', name: 'Require MFA for Admins', state: 'Enabled', target: 'Admin Roles', conditions: 'All cloud apps', grant: 'Require MFA' },
    { id: 'ca-002', name: 'Block Legacy Authentication', state: 'Enabled', target: 'All Users', conditions: 'Exchange ActiveSync, Other clients', grant: 'Block access' },
    { id: 'ca-003', name: 'Require Compliant Device', state: 'Report-only', target: 'All Users', conditions: 'Office 365 apps', grant: 'Require compliant device' },
    { id: 'ca-004', name: 'Block Sign-in from Risky Locations', state: 'Enabled', target: 'All Users', conditions: 'Named locations: High-risk countries', grant: 'Block access' },
    { id: 'ca-005', name: 'Require MFA for External Access', state: 'Enabled', target: 'Guest Users', conditions: 'All cloud apps', grant: 'Require MFA' }
  ];

  // ----------------------------------------------------------
  //  EXCHANGE MAILBOXES
  // ----------------------------------------------------------
  var sharedMailboxes = [
    { email: 'info@contoso.com', displayName: 'Company Info', type: 'Shared', size: '1.2 GB', members: ['s.johnson@contoso.com','e.wilson@contoso.com'] },
    { email: 'support@contoso.com', displayName: 'IT Support', type: 'Shared', size: '3.8 GB', members: ['j.smith@contoso.com','o.williams@contoso.com','h.clark@contoso.com'] },
    { email: 'accounts@contoso.com', displayName: 'Accounts', type: 'Shared', size: '0.9 GB', members: ['e.emily@contoso.com','l.garcia@contoso.com'] },
    { email: 'noreply@contoso.com', displayName: 'No Reply', type: 'Shared', size: '0.1 GB', members: ['j.smith@contoso.com'] },
    { email: 'boardroom@contoso.com', displayName: 'Boardroom', type: 'Room', size: '0.01 GB', members: [] },
    { email: 'meetingroom1@contoso.com', displayName: 'Meeting Room 1 - London', type: 'Room', size: '0.01 GB', members: [] },
    { email: 'meetingroom2@contoso.com', displayName: 'Meeting Room 2 - Manchester', type: 'Room', size: '0.01 GB', members: [] }
  ];

  // ----------------------------------------------------------
  //  PUBLIC API
  // ----------------------------------------------------------
  window.M365Tenant = {
    tenant: tenant,
    licenses: licenses,
    users: users,
    groups: groups,
    teams: teams,
    sharePointSites: sharePointSites,
    serviceHealth: serviceHealth,
    auditLog: auditLog,
    conditionalAccess: conditionalAccess,
    sharedMailboxes: sharedMailboxes,
    // Mutation methods
    addUser: function(u) { u.id = users.length + 1; users.push(u); return u; },
    removeUser: function(email) { var i = users.findIndex(function(u){return u.email===email;}); if(i>-1){users.splice(i,1);return true;} return false; },
    findUser: function(q) { q = q.toLowerCase(); return users.filter(function(u){return u.email.toLowerCase().indexOf(q)>-1||u.displayName.toLowerCase().indexOf(q)>-1||u.upn.toLowerCase().indexOf(q)>-1;}); },
    getUser: function(email) { return users.find(function(u){return u.email.toLowerCase()===email.toLowerCase()||u.upn.toLowerCase()===email.toLowerCase();}); },
    addAuditEntry: function(entry) { entry.timestamp = new Date().toISOString(); auditLog.unshift(entry); if(auditLog.length>50) auditLog.pop(); }
  };

})();
