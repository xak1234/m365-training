/* ============================================================
   M365 TRAINING CENTER - PowerShell Console Simulation
   Realistic M365 PowerShell with cmdlet parsing, output
   formatting, and command history.
   ============================================================ */
(function () {
  'use strict';
  window.M365Console = window.M365Console || {};
  var T = window.M365Tenant;

  // ----------------------------------------------------------
  //  CONSOLE STATE
  // ----------------------------------------------------------
  var history = [];
  var historyIdx = -1;
  var connected = { msol: false, exo: false, teams: false, spo: false };
  var prompt = 'PS C:\\Users\\Admin> ';
  var outputLines = [];

  function getPrompt() {
    return prompt;
  }

  // ----------------------------------------------------------
  //  HELPERS
  // ----------------------------------------------------------
  function padRight(s, n) { s = String(s || ''); while (s.length < n) s += ' '; return s; }
  function padLeft(s, n) { s = String(s || ''); while (s.length < n) s = ' ' + s; return s; }
  function fmtDate(d) { if (!d) return ''; var dt = new Date(d); return dt.toLocaleDateString('en-GB') + ' ' + dt.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}); }
  function tableOutput(headers, rows) {
    var widths = headers.map(function(h,i) {
      var max = h.length;
      rows.forEach(function(r){ if(r[i] && String(r[i]).length > max) max = String(r[i]).length; });
      return Math.min(max, 40);
    });
    var sep = widths.map(function(w){ return Array(w+1).join('-'); }).join('  ');
    var hdr = headers.map(function(h,i){ return padRight(h, widths[i]); }).join('  ');
    var lines = ['\n' + hdr, sep];
    rows.forEach(function(r){
      lines.push(r.map(function(c,i){ return padRight(String(c||''), widths[i]); }).join('  '));
    });
    lines.push('');
    return lines.join('\n');
  }

  function parseParams(args) {
    var params = {}; var current = null;
    args.forEach(function(a) {
      if (a.charAt(0) === '-') { current = a.substring(1).toLowerCase(); params[current] = true; }
      else if (current) { params[current] = a.replace(/^["']|["']$/g,''); current = null; }
    });
    return params;
  }

  function splitArgs(input) {
    var args = []; var current = ''; var inQuote = false; var quoteChar = '';
    for (var i = 0; i < input.length; i++) {
      var c = input[i];
      if (inQuote) { if (c === quoteChar) inQuote = false; else current += c; }
      else if (c === '"' || c === "'") { inQuote = true; quoteChar = c; }
      else if (c === ' ' || c === '\t') { if (current) { args.push(current); current = ''; } }
      else { current += c; }
    }
    if (current) args.push(current);
    return args;
  }

  // ----------------------------------------------------------
  //  COMMAND PROCESSOR
  // ----------------------------------------------------------
  function processCommand(input) {
    input = input.trim();
    if (!input) return '';
    history.push(input);
    historyIdx = history.length;
    T.addAuditEntry({ user: 'admin@contoso.com', action: 'PowerShell: ' + input, target: 'Console', result: 'Success', ip: '127.0.0.1' });

    var parts = splitArgs(input);
    var cmd = parts[0].toLowerCase();
    var args = parts.slice(1);
    var params = parseParams(args);

    // Pipe handling (simplified)
    if (input.indexOf('|') > -1) {
      var pipeParts = input.split('|').map(function(s){return s.trim();});
      var baseResult = processCommand(pipeParts[0]);
      for (var p = 1; p < pipeParts.length; p++) {
        var pipeCmd = pipeParts[p].trim().toLowerCase();
        if (pipeCmd.indexOf('select-object') === 0 || pipeCmd.indexOf('select') === 0) {
          return baseResult; // simplified: just return base
        } else if (pipeCmd.indexOf('where-object') === 0 || pipeCmd.indexOf('where') === 0) {
          return baseResult;
        } else if (pipeCmd.indexOf('format-table') === 0 || pipeCmd.indexOf('ft') === 0) {
          return baseResult;
        } else if (pipeCmd.indexOf('format-list') === 0 || pipeCmd.indexOf('fl') === 0) {
          return baseResult;
        } else if (pipeCmd.indexOf('measure-object') === 0 || pipeCmd.indexOf('measure') === 0) {
          return '\nCount    : ' + (baseResult.split('\n').length - 4) + '\nAverage  : \nSum      : \nMaximum  : \nMinimum  : \nProperty :\n';
        } else if (pipeCmd.indexOf('sort-object') === 0 || pipeCmd.indexOf('sort') === 0) {
          return baseResult;
        } else if (pipeCmd.indexOf('export-csv') === 0) {
          return 'Data exported to CSV file successfully.\n';
        }
      }
      return baseResult;
    }

    // ---- Connection commands ----
    if (cmd === 'connect-msolservice' || cmd === 'connect-msol') {
      connected.msol = true;
      return 'Connecting to Microsoft Online Services...\nConnected to tenant: ' + T.tenant.name + ' (' + T.tenant.tenantId + ')\n';
    }
    if (cmd === 'connect-exchangeonline' || cmd === 'connect-exo') {
      connected.exo = true;
      return 'Connecting to Exchange Online...\nConnected to Exchange Online (' + T.tenant.domain + ')\nHINT: Type Get-Mailbox to list mailboxes.\n';
    }
    if (cmd === 'connect-microsoftteams') {
      connected.teams = true;
      return 'Connecting to Microsoft Teams...\nAccount: admin@' + T.tenant.domain + '\nEnvironment: AzureCloud\nTenantId: ' + T.tenant.tenantId + '\n';
    }
    if (cmd === 'connect-sposervice') {
      connected.spo = true;
      return 'Connecting to SharePoint Online...\nConnected to: https://' + T.tenant.domain.split('.')[0] + '-admin.sharepoint.com\n';
    }
    if (cmd === 'connect-azuread' || cmd === 'connect-mgraph') {
      connected.msol = true;
      return 'Welcome to Microsoft Graph PowerShell!\nConnected to tenant: ' + T.tenant.name + '\nScopes: User.ReadWrite.All, Group.ReadWrite.All, Directory.ReadWrite.All\n';
    }
    if (cmd === 'disconnect-msolservice' || cmd === 'disconnect-exchangeonline' || cmd === 'disconnect-microsoftteams' || cmd === 'disconnect-sposervice') {
      return 'Disconnected successfully.\n';
    }

    // ---- User commands (MSOnline / AzureAD style) ----
    if (cmd === 'get-msoluser' || cmd === 'get-azureaduser' || cmd === 'get-mguser') {
      if (params.userprincipalname || params.objectid || params.searchstring) {
        var q = params.userprincipalname || params.objectid || params.searchstring;
        var u = T.getUser(q) || T.findUser(q)[0];
        if (!u) return 'Get-MsolUser : User not found: ' + q + '\nAt line:1 char:1\n+ Get-MsolUser -UserPrincipalName ' + q + '\n+ ~~~~~~~~~~~~\n    + CategoryInfo          : ObjectNotFound\n    + FullyQualifiedErrorId : Microsoft.Online.Administration.Automation.UserNotFoundException\n';
        return '\nUserPrincipalName  : ' + u.upn +
          '\nObjectId           : ' + u.objectId +
          '\nDisplayName        : ' + u.displayName +
          '\nFirstName          : ' + u.firstName +
          '\nLastName           : ' + u.lastName +
          '\nDepartment         : ' + u.department +
          '\nJobTitle           : ' + u.jobTitle +
          '\nOffice             : ' + u.office +
          '\nPhoneNumber        : ' + u.phone +
          '\nLicense            : ' + u.license +
          '\nRoles              : ' + u.roles.join(', ') +
          '\nBlockCredential    : ' + (u.status === 'Blocked') +
          '\nMFAState           : ' + u.mfaStatus +
          '\nLastPasswordChange : ' + fmtDate(u.passwordLastSet) +
          '\nWhenCreated        : ' + fmtDate(u.created) +
          '\nLastSignIn         : ' + (u.lastSignIn ? fmtDate(u.lastSignIn) : 'Never') +
          '\nMailboxSize        : ' + u.mailboxSize +
          '\nOneDriveUsage      : ' + u.oneDriveUsage +
          '\n';
      }
      // List all users
      var rows = T.users.map(function(u){ return [u.displayName, u.upn, u.license, u.status === 'Blocked' ? 'True' : 'False']; });
      return tableOutput(['DisplayName','UserPrincipalName','Licenses','BlockCredential'], rows);
    }

    if (cmd === 'new-msoluser' || cmd === 'new-azureaduser' || cmd === 'new-mguser') {
      var fn = params.firstname || params.givenname || 'New';
      var ln = params.lastname || params.surname || 'User';
      var upn = params.userprincipalname || (fn.toLowerCase() + '.' + ln.toLowerCase() + '@contoso.com');
      var dp = params.displayname || (fn + ' ' + ln);
      var nu = { firstName: fn, lastName: ln, displayName: dp, email: upn, upn: upn,
        department: params.department || 'IT', jobTitle: params.title || 'Employee', office: params.office || 'London HQ',
        license: '(none)', roles: ['User'], status: 'Active', mfaStatus: 'Disabled',
        phone: '', created: new Date().toISOString(), lastSignIn: null,
        passwordLastSet: new Date().toISOString(), mailboxSize: '0 MB', oneDriveUsage: '0 GB',
        objectId: 'usr-' + Math.random().toString(36).substr(2,8) };
      T.addUser(nu);
      T.addAuditEntry({ user: 'admin@contoso.com', action: 'New-MsolUser', target: upn, result: 'Success', ip: '127.0.0.1' });
      return '\nUser created successfully.\n\nUserPrincipalName : ' + upn + '\nDisplayName       : ' + dp + '\nObjectId          : ' + nu.objectId +
        '\nPassword          : Xk9$mP2!vL7n (temporary)\n\nIMPORTANT: User must change password at first sign-in.\n';
    }

    if (cmd === 'set-msoluser' || cmd === 'set-azureaduser' || cmd === 'set-mguser') {
      var upn2 = params.userprincipalname || params.objectid;
      if (!upn2) return 'Set-MsolUser : -UserPrincipalName parameter is required.\n';
      var u2 = T.getUser(upn2);
      if (!u2) return 'Set-MsolUser : User not found: ' + upn2 + '\n';
      if (params.blockcredential !== undefined) {
        u2.status = (params.blockcredential === 'true' || params.blockcredential === '$true') ? 'Blocked' : 'Active';
      }
      if (params.department) u2.department = params.department;
      if (params.title) u2.jobTitle = params.title;
      if (params.displayname) u2.displayName = params.displayname;
      if (params.office) u2.office = params.office;
      return 'User ' + u2.upn + ' updated successfully.\n';
    }

    if (cmd === 'remove-msoluser' || cmd === 'remove-azureaduser') {
      var upn3 = params.userprincipalname || params.objectid;
      if (!upn3) return 'Remove-MsolUser : -UserPrincipalName parameter is required.\n';
      if (T.removeUser(upn3)) {
        return 'User ' + upn3 + ' has been moved to the Deleted Users container.\nYou have 30 days to restore this user before permanent deletion.\n';
      }
      return 'Remove-MsolUser : User not found: ' + upn3 + '\n';
    }

    if (cmd === 'set-msoluserpassword' || cmd === 'set-msoluserlicense') {
      var upn4 = params.userprincipalname;
      if (!upn4) return cmd + ' : -UserPrincipalName parameter is required.\n';
      var u4 = T.getUser(upn4);
      if (!u4) return cmd + ' : User not found: ' + upn4 + '\n';
      if (cmd.indexOf('password') > -1) {
        u4.passwordLastSet = new Date().toISOString();
        return 'Password for ' + u4.displayName + ' has been reset.\nTemporary password: Rk4$nQ8!wM3j\nUser must change password at next sign-in.\n';
      }
      if (params.addlicenses) { u4.license = params.addlicenses.replace(/contoso:/gi,''); }
      return 'License updated for ' + u4.displayName + '.\n';
    }

    if (cmd === 'get-msolaccountsku' || cmd === 'get-mgsubscribedsku') {
      var rows2 = Object.keys(T.licenses).map(function(k) {
        var l = T.licenses[k]; return [k, l.total, l.assigned, l.total - l.assigned];
      });
      return tableOutput(['AccountSkuId','ActiveUnits','ConsumedUnits','Available'], rows2);
    }

    // ---- Group commands ----
    if (cmd === 'get-msolgroup' || cmd === 'get-azureadgroup' || cmd === 'get-mggroup') {
      if (params.searchstring || params.displayname) {
        var q2 = (params.searchstring || params.displayname).toLowerCase();
        var found = T.groups.filter(function(g){ return g.name.toLowerCase().indexOf(q2) > -1; });
        if (found.length === 0) return 'No groups found matching: ' + q2 + '\n';
        var gr = found[0];
        return '\nDisplayName   : ' + gr.name + '\nObjectId      : ' + gr.id + '\nGroupType     : ' + gr.type +
          '\nEmail         : ' + (gr.email || 'N/A') + '\nMemberCount   : ' + gr.members +
          '\nDescription   : ' + gr.description + '\nDynamic       : ' + gr.dynamic + '\n';
      }
      var rows3 = T.groups.map(function(g){ return [g.name, g.type, g.email || '', g.members]; });
      return tableOutput(['DisplayName','GroupType','Email','Members'], rows3);
    }

    // ---- Exchange commands ----
    if (cmd === 'get-mailbox') {
      if (params.identity) {
        var mu = T.getUser(params.identity);
        if (mu) return '\nName               : ' + mu.displayName + '\nAlias              : ' + mu.firstName.toLowerCase() + '.' + mu.lastName.toLowerCase() +
          '\nPrimarySmtpAddress : ' + mu.email + '\nRecipientType      : UserMailbox\nMailboxSize        : ' + mu.mailboxSize +
          '\nIssueWarningQuota  : 49 GB\nProhibitSendQuota  : 49.5 GB\nDatabase           : EURP265DG033-db048\nRetentionPolicy    : Default MRM Policy\n';
        var sm = T.sharedMailboxes.find(function(m){return m.email===params.identity;});
        if (sm) return '\nName               : ' + sm.displayName + '\nPrimarySmtpAddress : ' + sm.email + '\nRecipientType      : ' + sm.type + 'Mailbox\nMailboxSize        : ' + sm.size + '\n';
        return 'Get-Mailbox : ' + params.identity + ' not found.\n';
      }
      var allMb = T.users.filter(function(u){return u.license !== '(none)';}).map(function(u){ return [u.displayName, u.email, 'UserMailbox', u.mailboxSize]; });
      T.sharedMailboxes.forEach(function(m){ allMb.push([m.displayName, m.email, m.type+'Mailbox', m.size]); });
      return tableOutput(['Name','PrimarySmtpAddress','RecipientType','TotalItemSize'], allMb);
    }

    if (cmd === 'get-mailboxstatistics') {
      var mid = params.identity;
      if (!mid) return 'Get-MailboxStatistics : -Identity parameter is required.\n';
      var mu2 = T.getUser(mid);
      if (!mu2) return 'Mailbox not found: ' + mid + '\n';
      var items = Math.floor(Math.random()*5000)+500;
      return '\nDisplayName        : ' + mu2.displayName + '\nItemCount          : ' + items + '\nTotalItemSize      : ' + mu2.mailboxSize +
        '\nDeletedItemCount   : ' + Math.floor(items*0.1) + '\nLastLogonTime      : ' + fmtDate(mu2.lastSignIn) +
        '\nLastLoggedOnUserAccount : ' + mu2.upn + '\n';
    }

    if (cmd === 'get-transportrule' || cmd === 'get-malwarefilterrule') {
      return tableOutput(['Name','State','Priority','Mode'],
        [['Block External Auto-Forwards','Enabled','0','Enforce'],
         ['Append Disclaimer','Enabled','1','Enforce'],
         ['Encrypt Sensitive Emails','Enabled','2','Enforce']]);
    }

    // ---- Teams commands ----
    if (cmd === 'get-team') {
      if (params.displayname) {
        var tm = T.teams.find(function(t){return t.name.toLowerCase()===params.displayname.toLowerCase();});
        if (!tm) return 'Get-Team : Team not found.\n';
        return '\nDisplayName  : ' + tm.name + '\nGroupId      : ' + tm.id + '\nVisibility   : ' + tm.visibility +
          '\nMemberCount  : ' + tm.members + '\nOwner        : ' + tm.owner + '\nChannels     : ' + tm.channels.join(', ') +
          '\nCreated      : ' + fmtDate(tm.created) + '\n';
      }
      var rows4 = T.teams.map(function(t){ return [t.name, t.id, t.visibility, t.members]; });
      return tableOutput(['DisplayName','GroupId','Visibility','MemberCount'], rows4);
    }
    if (cmd === 'get-teamchannel') {
      var gid = params.groupid;
      var tm2 = T.teams.find(function(t){return t.id === gid;});
      if (!tm2) return 'Get-TeamChannel : Team not found. Use -GroupId parameter.\n';
      var rows5 = tm2.channels.map(function(c,i){ return [c, i===0?'Standard':'Standard', tm2.id + '-ch' + i]; });
      return tableOutput(['DisplayName','MembershipType','Id'], rows5);
    }

    // ---- SharePoint commands ----
    if (cmd === 'get-sposite') {
      if (params.identity) {
        var sp = T.sharePointSites.find(function(s){return s.url===params.identity||s.title.toLowerCase()===params.identity.toLowerCase();});
        if (!sp) return 'Get-SPOSite : Site not found.\n';
        return '\nUrl          : ' + sp.url + '\nTitle        : ' + sp.title + '\nTemplate     : ' + sp.type +
          '\nStorageUsage : ' + sp.storage + '\nOwner        : ' + sp.owner + '\nStatus       : ' + sp.status +
          '\nSharingCapability : ExternalUserAndGuestSharing\nConditionalAccess : AllowFullAccess\n';
      }
      var rows6 = T.sharePointSites.map(function(s){ return [s.title, s.url, s.type, s.storage, s.status]; });
      return tableOutput(['Title','Url','Template','Storage','Status'], rows6);
    }

    // ---- Conditional Access ----
    if (cmd === 'get-azureadmsconditionalaccesspolicy' || cmd === 'get-mgidentityconditionalaccesspolicy') {
      var rows7 = T.conditionalAccess.map(function(p){ return [p.name, p.state, p.target, p.grant]; });
      return tableOutput(['DisplayName','State','IncludeUsers','GrantControls'], rows7);
    }

    // ---- Service Health ----
    if (cmd === 'get-mgserviceannouncementhealthoverview' || cmd === 'get-servicehealth') {
      var rows8 = T.serviceHealth.map(function(s){ return [s.service, s.status, fmtDate(s.lastIncident)]; });
      return tableOutput(['Service','Status','LastIncident'], rows8);
    }

    // ---- Audit / Reports ----
    if (cmd === 'search-unifiedauditlog' || cmd === 'get-auditlog') {
      var rows9 = T.auditLog.slice(0,15).map(function(a){ return [fmtDate(a.timestamp), a.user, a.action, a.target.substring(0,30), a.result]; });
      return tableOutput(['Timestamp','User','Operation','Target','Result'], rows9);
    }

    // ---- General PowerShell commands ----
    if (cmd === 'get-command') {
      return tableOutput(['CommandType','Name','ModuleName'],
        [['Cmdlet','Get-MsolUser','MSOnline'],['Cmdlet','New-MsolUser','MSOnline'],['Cmdlet','Set-MsolUser','MSOnline'],
         ['Cmdlet','Remove-MsolUser','MSOnline'],['Cmdlet','Get-MsolAccountSku','MSOnline'],['Cmdlet','Get-MsolGroup','MSOnline'],
         ['Cmdlet','Get-Mailbox','ExchangeOnlineManagement'],['Cmdlet','Get-MailboxStatistics','ExchangeOnlineManagement'],
         ['Cmdlet','Get-Team','MicrosoftTeams'],['Cmdlet','Get-TeamChannel','MicrosoftTeams'],
         ['Cmdlet','Get-SPOSite','SharePointOnline'],['Cmdlet','Get-AzureADMSConditionalAccessPolicy','AzureAD'],
         ['Cmdlet','Connect-MsolService','MSOnline'],['Cmdlet','Connect-ExchangeOnline','ExchangeOnlineManagement'],
         ['Cmdlet','Connect-MicrosoftTeams','MicrosoftTeams'],['Cmdlet','Connect-SPOService','SharePointOnline']]);
    }
    if (cmd === 'whoami') return 'contoso\\admin\n';
    if (cmd === 'hostname') return 'ADMIN-PC01\n';
    if (cmd === 'cls' || cmd === 'clear' || cmd === 'clear-host') return '\x0C';
    if (cmd === 'exit' || cmd === 'quit') return 'Use the X button or navigate away to close the console.\n';
    if (cmd === 'get-date') return new Date().toString() + '\n';
    if (cmd === 'get-host') return '\nName             : ConsoleHost\nVersion          : 7.4.1\nUI               : System.Management.Automation.Internal.Host\nCurrentCulture   : en-GB\nCurrentUICulture : en-GB\n';
    if (cmd === '$psversiontable') return '\nName                           Value\n----                           -----\nPSVersion                      7.4.1\nPSEdition                      Core\nOS                             Microsoft Windows 10.0.26100\nPlatform                       Win32NT\nPSCompatibleVersions           {1.0, 2.0, 3.0, 4.0, 5.0, 5.1, 6.0, 7.0, 7.4}\nPSRemotingProtocolVersion      2.3\n';

    if (cmd === 'get-help' || cmd === 'help' || cmd === '?') {
      return '\n=== M365 PowerShell Training Console ===\n\n' +
        'CONNECTION COMMANDS:\n' +
        '  Connect-MsolService          Connect to Azure AD / M365\n' +
        '  Connect-ExchangeOnline       Connect to Exchange Online\n' +
        '  Connect-MicrosoftTeams       Connect to Teams\n' +
        '  Connect-SPOService           Connect to SharePoint Online\n\n' +
        'USER MANAGEMENT:\n' +
        '  Get-MsolUser                 List all users or get specific user\n' +
        '  New-MsolUser                 Create a new user\n' +
        '  Set-MsolUser                 Modify user properties\n' +
        '  Remove-MsolUser              Delete a user\n' +
        '  Set-MsolUserPassword         Reset user password\n' +
        '  Set-MsolUserLicense          Assign/remove licenses\n' +
        '  Get-MsolAccountSku           View license inventory\n\n' +
        'GROUPS:\n' +
        '  Get-MsolGroup                List/search groups\n\n' +
        'EXCHANGE ONLINE:\n' +
        '  Get-Mailbox                  List mailboxes\n' +
        '  Get-MailboxStatistics        Mailbox size and item count\n' +
        '  Get-TransportRule            View mail flow rules\n\n' +
        'TEAMS:\n' +
        '  Get-Team                     List Teams\n' +
        '  Get-TeamChannel              List channels in a Team\n\n' +
        'SHAREPOINT:\n' +
        '  Get-SPOSite                  List SharePoint sites\n\n' +
        'SECURITY & COMPLIANCE:\n' +
        '  Get-AzureADMSConditionalAccessPolicy  View CA policies\n' +
        '  Search-UnifiedAuditLog       View audit logs\n' +
        '  Get-ServiceHealth            Check M365 service health\n\n' +
        'UTILITY:\n' +
        '  Get-Command                  List available commands\n' +
        '  Get-Help <cmdlet>            Show help for a command\n' +
        '  cls / clear                  Clear the console\n' +
        '  whoami / hostname            System info\n\n' +
        'EXAMPLES:\n' +
        '  Get-MsolUser -UserPrincipalName j.smith@contoso.com\n' +
        '  New-MsolUser -FirstName "Jane" -LastName "Doe" -UserPrincipalName jane.doe@contoso.com\n' +
        '  Set-MsolUser -UserPrincipalName j.smith@contoso.com -BlockCredential $true\n' +
        '  Get-MsolUser | Measure-Object\n' +
        '  Get-Mailbox -Identity j.smith@contoso.com\n' +
        '  Get-Team -DisplayName "IT Operations"\n\n';
    }

    // ---- Unknown command ----
    return cmd + ' : The term \'' + parts[0] + '\' is not recognized as the name of a cmdlet,\nfunction, script file, or operable program. Check the spelling of the name, or\nif a path was included, verify that the path is correct and try again.\n\nType "help" for a list of available commands.\n';
  }

  // ----------------------------------------------------------
  //  CONSOLE UI RENDERER
  // ----------------------------------------------------------
  function renderConsole(container) {
    container.innerHTML = '';

    var wrap = document.createElement('div');
    wrap.style.cssText = 'background:#012456;border-radius:8px;overflow:hidden;font-family:"Cascadia Code","Consolas","Courier New",monospace;font-size:13px;color:#cccccc;display:flex;flex-direction:column;height:520px;';

    // Title bar
    var titleBar = document.createElement('div');
    titleBar.style.cssText = 'background:#1e1e1e;padding:6px 12px;display:flex;align-items:center;gap:8px;font-size:12px;color:#ccc;border-bottom:1px solid #333;user-select:none;';
    titleBar.innerHTML = '<span style="color:#569cd6;">&#9632;</span> <span>Windows PowerShell</span>' +
      '<span style="margin-left:auto;font-size:11px;color:#888;">M365 Training Console &mdash; Contoso Ltd</span>' +
      '<span style="display:flex;gap:8px;margin-left:12px;">' +
      '<span style="width:12px;height:12px;border-radius:50%;background:#f44;display:inline-block;"></span>' +
      '<span style="width:12px;height:12px;border-radius:50%;background:#fa0;display:inline-block;"></span>' +
      '<span style="width:12px;height:12px;border-radius:50%;background:#0c0;display:inline-block;"></span></span>';
    wrap.appendChild(titleBar);

    // Output area
    var outputArea = document.createElement('div');
    outputArea.id = 'ps-output';
    outputArea.style.cssText = 'flex:1;overflow-y:auto;padding:12px 16px;white-space:pre-wrap;word-wrap:break-word;line-height:1.5;';
    // Welcome message
    outputArea.textContent = 'Windows PowerShell\nCopyright (C) Microsoft Corporation. All rights reserved.\n\n' +
      'Install the latest PowerShell for new features and improvements! https://aka.ms/PSWindows\n\n' +
      '=== M365 Training Console ===\nTenant: ' + T.tenant.name + ' (' + T.tenant.domain + ')\nType "help" for available commands.\nType "Connect-MsolService" to connect to Microsoft 365.\n\n';
    wrap.appendChild(outputArea);

    // Input area
    var inputRow = document.createElement('div');
    inputRow.style.cssText = 'display:flex;align-items:center;padding:4px 16px 8px;background:#012456;border-top:1px solid #1a3a5c;';

    var promptEl = document.createElement('span');
    promptEl.style.cssText = 'color:#569cd6;white-space:nowrap;margin-right:4px;';
    promptEl.textContent = getPrompt();

    var inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.id = 'ps-input';
    inputEl.autocomplete = 'off';
    inputEl.spellcheck = false;
    inputEl.style.cssText = 'flex:1;background:transparent;border:none;outline:none;color:#cccccc;font-family:inherit;font-size:inherit;caret-color:#569cd6;';
    inputEl.placeholder = 'Type a command...';

    inputEl.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        var val = inputEl.value;
        // Echo the command
        outputArea.textContent += getPrompt() + val + '\n';
        if (val.trim()) {
          var result = processCommand(val);
          if (result === '\x0C') {
            outputArea.textContent = '';
          } else {
            outputArea.textContent += result;
          }
        }
        inputEl.value = '';
        outputArea.scrollTop = outputArea.scrollHeight;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIdx > 0) { historyIdx--; inputEl.value = history[historyIdx]; }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIdx < history.length - 1) { historyIdx++; inputEl.value = history[historyIdx]; }
        else { historyIdx = history.length; inputEl.value = ''; }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        // Simple tab completion
        var partial = inputEl.value.toLowerCase();
        var cmds = ['Get-MsolUser','New-MsolUser','Set-MsolUser','Remove-MsolUser','Set-MsolUserPassword','Set-MsolUserLicense',
          'Get-MsolAccountSku','Get-MsolGroup','Connect-MsolService','Connect-ExchangeOnline','Connect-MicrosoftTeams',
          'Connect-SPOService','Get-Mailbox','Get-MailboxStatistics','Get-TransportRule','Get-Team','Get-TeamChannel',
          'Get-SPOSite','Get-AzureADMSConditionalAccessPolicy','Search-UnifiedAuditLog','Get-ServiceHealth',
          'Get-Command','Get-Help','Get-Date','Clear-Host','Get-Host'];
        var match = cmds.filter(function(c){ return c.toLowerCase().indexOf(partial) === 0; });
        if (match.length === 1) inputEl.value = match[0];
        else if (match.length > 1) {
          outputArea.textContent += getPrompt() + partial + '\n' + match.join('  ') + '\n';
          outputArea.scrollTop = outputArea.scrollHeight;
        }
      }
    });

    inputRow.appendChild(promptEl);
    inputRow.appendChild(inputEl);
    wrap.appendChild(inputRow);
    container.appendChild(wrap);

    // Focus input when clicking anywhere in console
    wrap.addEventListener('click', function() { inputEl.focus(); });
    setTimeout(function() { inputEl.focus(); }, 100);
  }

  // ----------------------------------------------------------
  //  PUBLIC API
  // ----------------------------------------------------------
  window.M365Console = {
    renderConsole: renderConsole,
    processCommand: processCommand,
    getHistory: function() { return history.slice(); }
  };

  // ----------------------------------------------------------
  //  REGISTER AS MODULE IN TRAINING CENTER
  // ----------------------------------------------------------
  if (window.M365App && window.M365App.registerModule) {
    window.M365App.registerModule({
      id: 'console',
      title: 'PowerShell Console',
      subtitle: 'Practice M365 administration using PowerShell commands',
      color: '#012456',
      icon: 'terminal',
      lessons: [
        { id: 'ps-intro', title: 'Introduction to M365 PowerShell', duration: '5 min read', difficulty: 'Intermediate',
          content: '<h2>Why PowerShell for M365?</h2>' +
            '<p>While the M365 Admin Center provides a graphical interface, PowerShell gives administrators the ability to automate repetitive tasks, perform bulk operations, and access settings not available in the GUI.</p>' +
            '<h2>Key M365 PowerShell Modules</h2>' +
            '<ul><li><strong>MSOnline</strong> &ndash; Legacy Azure AD and M365 user/group management</li>' +
            '<li><strong>AzureAD / Microsoft.Graph</strong> &ndash; Modern identity management</li>' +
            '<li><strong>ExchangeOnlineManagement</strong> &ndash; Exchange Online administration</li>' +
            '<li><strong>MicrosoftTeams</strong> &ndash; Teams management</li>' +
            '<li><strong>SharePointOnlinePowerShell</strong> &ndash; SharePoint administration</li></ul>' +
            '<h2>Getting Started</h2>' +
            '<p>Head to the <strong>Simulation</strong> tab to try the interactive PowerShell console. Start by connecting:</p>' +
            '<pre><code>Connect-MsolService\nGet-MsolUser</code></pre>' +
            '<p>Type <code>help</code> in the console for a full list of available commands.</p>'
        }
      ],
      simulation: {
        title: 'M365 PowerShell Console',
        description: 'Practice real M365 PowerShell commands in an interactive terminal.',
        tasks: [
          { instruction: 'Connect to Microsoft 365 using Connect-MsolService', points: 10 },
          { instruction: 'List all users with Get-MsolUser', points: 15 },
          { instruction: 'Look up a specific user by UPN', points: 15 },
          { instruction: 'Create a new user with New-MsolUser', points: 20 },
          { instruction: 'Check license inventory with Get-MsolAccountSku', points: 15 },
          { instruction: 'View audit logs with Search-UnifiedAuditLog', points: 15 },
          { instruction: 'Check service health with Get-ServiceHealth', points: 10 }
        ],
        render: function(container) { renderConsole(container); }
      },
      quiz: [
        { id:'ps-q1', question:'Which cmdlet connects to Azure AD for user management?', options:['Connect-MsolService','Connect-ExchangeOnline','Connect-AzureAD','All of the above'], correct:0, explanation:'Connect-MsolService connects to the MSOnline module for Azure AD user and group management.' },
        { id:'ps-q2', question:'Which cmdlet lists all M365 license SKUs?', options:['Get-MsolUser','Get-MsolAccountSku','Get-MsolGroup','Get-License'], correct:1, explanation:'Get-MsolAccountSku returns all subscribed license SKUs with total and consumed counts.' },
        { id:'ps-q3', question:'How do you block a user sign-in via PowerShell?', options:['Remove-MsolUser','Set-MsolUser -BlockCredential $true','Disable-MsolUser','Set-MsolUser -Enabled $false'], correct:1, explanation:'Set-MsolUser with -BlockCredential $true immediately prevents the user from signing in.' },
        { id:'ps-q4', question:'Which module manages Exchange Online mailboxes?', options:['MSOnline','MicrosoftTeams','ExchangeOnlineManagement','SharePointOnline'], correct:2, explanation:'The ExchangeOnlineManagement module provides cmdlets like Get-Mailbox and Get-MailboxStatistics.' },
        { id:'ps-q5', question:'What does Get-MsolUser | Measure-Object return?', options:['User details','A count of all users','License information','Group memberships'], correct:1, explanation:'Piping Get-MsolUser to Measure-Object returns the count of user objects in the tenant.' }
      ]
    });
  }

})();
