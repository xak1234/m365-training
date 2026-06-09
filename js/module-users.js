// ============================================================
//  MODULE: User Management
//  M365 Training Center - User Management Module
//  Teaches M365 user lifecycle: creation, licensing, roles,
//  groups, and offboarding via the Admin Center.
// ============================================================

(function () {
  'use strict';

  window.M365App = window.M365App || {};
  window.M365App.registerModule = window.M365App.registerModule || function () {};

  // ----------------------------------------------------------
  //  LESSON CONTENT
  // ----------------------------------------------------------

  var lessons = [
    // ========================================================
    //  LESSON 1 - M365 Admin Center Overview
    // ========================================================
    {
      id: 'admin-center-overview',
      title: 'M365 Admin Center Overview',
      duration: '5 min read',
      difficulty: 'Beginner',
      content: '<h2>What Is the Microsoft 365 Admin Center?</h2>' +
        '<p>The <strong>Microsoft 365 Admin Center</strong> is the unified web portal where administrators manage every aspect of their organization\'s Microsoft 365 environment. You access it at <a href="https://admin.microsoft.com" target="_blank" rel="noopener">admin.microsoft.com</a>. From here you can create users, assign licenses, configure security policies, review service health, and much more&mdash;all from a single dashboard.</p>' +

        '<div class="callout callout-info">' +
          '<strong>Tip:</strong> Bookmark <code>admin.microsoft.com</code>. It is the single most important URL for any M365 administrator.' +
        '</div>' +

        '<h2>Navigating the Admin Center</h2>' +
        '<p>The left-hand navigation organizes the Admin Center into functional areas. Understanding this layout lets you find settings quickly and reduces the time you spend searching for options.</p>' +
        '<ul>' +
          '<li><strong>Home</strong> &ndash; Dashboard with quick actions, recommendations, and service health alerts.</li>' +
          '<li><strong>Users</strong> &ndash; Active users, guest users, contacts, and deleted users.</li>' +
          '<li><strong>Groups</strong> &ndash; Microsoft 365 Groups, distribution lists, security groups, and mail-enabled security groups.</li>' +
          '<li><strong>Billing</strong> &ndash; Subscriptions, licenses, purchase services, and payment methods.</li>' +
          '<li><strong>Settings</strong> &ndash; Org settings, domains, and security &amp; privacy configuration.</li>' +
          '<li><strong>Reports</strong> &ndash; Usage reports for email, OneDrive, SharePoint, Teams, and more.</li>' +
          '<li><strong>Health</strong> &ndash; Service health, message center, and Windows release health.</li>' +
          '<li><strong>Admin centers</strong> &ndash; Quick links to Exchange, SharePoint, Teams, Azure AD, and other specialized portals.</li>' +
        '</ul>' +

        '<h2>Admin Roles at a Glance</h2>' +
        '<p>Microsoft 365 uses <em>Role-Based Access Control (RBAC)</em> so that not every administrator needs full access. Below is a summary of the most common built-in roles:</p>' +
        '<table class="lesson-table">' +
          '<thead><tr><th>Role</th><th>Scope</th><th>Common Tasks</th></tr></thead>' +
          '<tbody>' +
            '<tr><td>Global Admin</td><td>Full access to all services</td><td>Everything&mdash;use sparingly</td></tr>' +
            '<tr><td>User Admin</td><td>User &amp; group management</td><td>Create users, reset passwords, manage groups</td></tr>' +
            '<tr><td>License Admin</td><td>License assignments</td><td>Assign and remove product licenses</td></tr>' +
            '<tr><td>Password Admin</td><td>Password resets</td><td>Reset passwords for non-admin users</td></tr>' +
            '<tr><td>Helpdesk Admin</td><td>Support tasks</td><td>Reset passwords, manage service requests</td></tr>' +
            '<tr><td>Exchange Admin</td><td>Exchange Online</td><td>Mailboxes, mail flow rules, anti-spam</td></tr>' +
            '<tr><td>SharePoint Admin</td><td>SharePoint Online</td><td>Site collections, sharing, storage</td></tr>' +
            '<tr><td>Teams Admin</td><td>Microsoft Teams</td><td>Teams policies, meeting settings, voice</td></tr>' +
          '</tbody>' +
        '</table>' +

        '<h2>Quick Tasks &amp; Recommendations</h2>' +
        '<p>The Home dashboard surfaces <strong>recommended actions</strong> based on your tenant\'s configuration. These may include enabling multi-factor authentication (MFA), setting up self-service password reset, or reviewing inactive users. Acting on these recommendations is one of the fastest ways to improve your organization\'s security posture.</p>' +

        '<div class="callout callout-warning">' +
          '<strong>Best Practice:</strong> Limit the number of Global Admins to <strong>two to four</strong>. Use more specific roles (User Admin, License Admin, etc.) for day-to-day tasks. This follows the <em>principle of least privilege</em> and reduces risk.' +
        '</div>' +

        '<p>In the next lesson you will learn how to create your first user account step by step.</p>'
    },

    // ========================================================
    //  LESSON 2 - Creating New User Accounts
    // ========================================================
    {
      id: 'creating-users',
      title: 'Creating New User Accounts',
      duration: '10 min read',
      difficulty: 'Beginner',
      content: '<h2>Adding a Single User</h2>' +
        '<p>Creating a new user in the Microsoft 365 Admin Center is straightforward. Navigate to <strong>Users &gt; Active Users &gt; Add a user</strong>. The wizard walks you through three main steps: identity, licensing, and optional settings.</p>' +

        '<h3>Step 1: Set Up the Basics</h3>' +
        '<p>Fill in the required identity fields:</p>' +
        '<ul>' +
          '<li><strong>First name</strong> and <strong>Last name</strong> &ndash; The user\'s real name.</li>' +
          '<li><strong>Display name</strong> &ndash; Automatically populated from first and last name; you can edit it.</li>' +
          '<li><strong>Username</strong> &ndash; This becomes the user\'s sign-in address, e.g., <code>jsmith@contoso.com</code>. Choose a domain from the drop-down if your organization has multiple verified domains.</li>' +
        '</ul>' +

        '<h3>Password Options</h3>' +
        '<p>You can auto-generate a password or create one manually. Important settings include:</p>' +
        '<ul>' +
          '<li><strong>Require this user to change their password when they first sign in</strong> &ndash; Best practice is to leave this <em>checked</em> so users set their own passwords.</li>' +
          '<li><strong>Send password in email</strong> &ndash; Optionally email the temporary password to the user or their manager.</li>' +
        '</ul>' +

        '<div class="callout callout-info">' +
          '<strong>Security Tip:</strong> Always require a password change on first sign-in. Combine this with Multi-Factor Authentication (MFA) for stronger security.' +
        '</div>' +

        '<h3>Step 2: Assign a License</h3>' +
        '<p>Select a location (required for license assignment) and then choose one or more product licenses such as <em>Microsoft 365 Business Basic</em>, <em>Business Standard</em>, or <em>Business Premium</em>. You can also create the user without a license and assign one later.</p>' +

        '<h3>Step 3: Optional Settings</h3>' +
        '<p>In this step you can configure profile information and admin roles:</p>' +
        '<ul>' +
          '<li><strong>Job title</strong>, <strong>Department</strong>, <strong>Office</strong> &ndash; Useful for organizational charts and filtering.</li>' +
          '<li><strong>Phone numbers</strong> &ndash; Mobile and office phone for MFA and contact purposes.</li>' +
          '<li><strong>Manager</strong> &ndash; Links the user to their reporting manager in the directory.</li>' +
          '<li><strong>Admin roles</strong> &ndash; Optionally assign an admin role during creation.</li>' +
        '</ul>' +

        '<h2>Bulk User Creation via CSV</h2>' +
        '<p>When onboarding many users at once, use <strong>bulk operations</strong>. The Admin Center provides a CSV template you can download, populate, and re-upload.</p>' +
        '<ol>' +
          '<li>Go to <strong>Users &gt; Active Users &gt; Add multiple users</strong>.</li>' +
          '<li>Download the CSV template.</li>' +
          '<li>Fill in each row: <code>User Name</code>, <code>First Name</code>, <code>Last Name</code>, <code>Display Name</code>, <code>Job Title</code>, <code>Department</code>, <code>Office Number</code>, <code>Office Phone</code>, <code>Mobile Phone</code>, <code>Fax</code>, <code>Address</code>, <code>City</code>, <code>State or Province</code>, <code>ZIP or Postal Code</code>, <code>Country or Region</code>.</li>' +
          '<li>Upload the CSV and assign licenses.</li>' +
          '<li>Temporary passwords will be generated and can be sent to an email address you specify.</li>' +
        '</ol>' +

        '<div class="callout callout-warning">' +
          '<strong>Important:</strong> The username in the CSV must follow the format <code>username@yourdomain.com</code>. Duplicate usernames will cause the import to fail for that row.' +
        '</div>' +

        '<p>Now that you can create users, the next lesson covers how to manage their licenses effectively.</p>'
    },

    // ========================================================
    //  LESSON 3 - Managing User Licenses
    // ========================================================
    {
      id: 'managing-licenses',
      title: 'Managing User Licenses',
      duration: '8 min read',
      difficulty: 'Intermediate',
      content: '<h2>Understanding M365 License Types</h2>' +
        '<p>Every Microsoft 365 service a user accesses requires a <strong>license</strong>. Licenses come bundled in plans, and each plan includes a specific set of apps and services. Choosing the right license is a balance between functionality and cost.</p>' +
        '<table class="lesson-table">' +
          '<thead><tr><th>Plan</th><th>Key Services Included</th><th>Best For</th></tr></thead>' +
          '<tbody>' +
            '<tr><td>Business Basic</td><td>Web versions of Office, Exchange, OneDrive, Teams, SharePoint</td><td>Frontline workers, light users</td></tr>' +
            '<tr><td>Business Standard</td><td>Desktop Office apps + everything in Basic</td><td>Most knowledge workers</td></tr>' +
            '<tr><td>Business Premium</td><td>Standard + Intune, Azure AD P1, Defender for Business</td><td>Security-conscious orgs, SMBs</td></tr>' +
            '<tr><td>Enterprise E3</td><td>Full Office suite, advanced compliance, eDiscovery</td><td>Large enterprises</td></tr>' +
            '<tr><td>Enterprise E5</td><td>E3 + advanced security, analytics, PSTN conferencing</td><td>Highly regulated industries</td></tr>' +
          '</tbody>' +
        '</table>' +

        '<h2>Assigning Licenses to Individual Users</h2>' +
        '<p>To assign or change a license:</p>' +
        '<ol>' +
          '<li>Navigate to <strong>Users &gt; Active Users</strong>.</li>' +
          '<li>Click the user\'s display name to open their detail panel.</li>' +
          '<li>Select <strong>Licenses and apps</strong>.</li>' +
          '<li>Check or uncheck the desired license. You can also expand a license to toggle individual service components (e.g., disable Sway while keeping everything else).</li>' +
          '<li>Click <strong>Save changes</strong>.</li>' +
        '</ol>' +

        '<div class="callout callout-info">' +
          '<strong>Note:</strong> A user must have a <strong>usage location</strong> set before you can assign a license. This is because Microsoft services availability varies by country/region.' +
        '</div>' +

        '<h2>Group-Based Licensing</h2>' +
        '<p>For larger organizations, assigning licenses individually is impractical. <strong>Group-based licensing</strong> (available with Azure AD Premium P1 or higher) lets you assign licenses to an Azure AD security group. Any user added to the group automatically receives the license; removing them from the group removes the license.</p>' +
        '<ul>' +
          '<li>Create or choose an Azure AD security group.</li>' +
          '<li>Go to <strong>Azure Active Directory &gt; Groups &gt; [Group Name] &gt; Licenses</strong>.</li>' +
          '<li>Click <strong>Assignments</strong> and select the desired license plan.</li>' +
          '<li>Save. All current and future members inherit the license automatically.</li>' +
        '</ul>' +

        '<h2>License Reporting &amp; Optimization</h2>' +
        '<p>Unused licenses cost money. Regularly review license usage:</p>' +
        '<ul>' +
          '<li><strong>Admin Center &gt; Billing &gt; Licenses</strong> shows how many licenses are assigned vs. available.</li>' +
          '<li>Look for users who haven\'t signed in for 30+ days&mdash;they may no longer need a license.</li>' +
          '<li>Consider downgrading users who only use web apps from <em>Business Standard</em> to <em>Business Basic</em>.</li>' +
        '</ul>' +

        '<div class="callout callout-warning">' +
          '<strong>Cost Tip:</strong> An unused <em>Business Premium</em> license at ~$22/user/month costs $264/year. Multiplied across 50 unused licenses, that is $13,200 wasted annually. Regular license audits pay for themselves.' +
        '</div>' +

        '<p>Next, let\'s explore how user roles and permissions control who can do what in your M365 environment.</p>'
    },

    // ========================================================
    //  LESSON 4 - User Roles & Permissions
    // ========================================================
    {
      id: 'roles-permissions',
      title: 'User Roles & Permissions',
      duration: '10 min read',
      difficulty: 'Intermediate',
      content: '<h2>Role-Based Access Control (RBAC)</h2>' +
        '<p>Microsoft 365 uses <strong>Role-Based Access Control</strong> to govern administrative permissions. Rather than giving every IT staff member full access, RBAC lets you assign specific, scoped roles so each admin can only manage the services they are responsible for. This is foundational to the <em>principle of least privilege</em>.</p>' +

        '<div class="callout callout-info">' +
          '<strong>Principle of Least Privilege:</strong> Grant users only the minimum level of access they need to perform their job. This limits the blast radius if an account is compromised.' +
        '</div>' +

        '<h2>Key Built-In Admin Roles</h2>' +
        '<p>Microsoft 365 provides over 60 built-in admin roles. The most commonly used are:</p>' +
        '<table class="lesson-table">' +
          '<thead><tr><th>Role</th><th>What It Can Do</th><th>When to Use</th></tr></thead>' +
          '<tbody>' +
            '<tr><td>Global Admin</td><td>Full access to all administrative features across all M365 services</td><td>Initial setup, emergency access. Limit to 2&ndash;4 accounts.</td></tr>' +
            '<tr><td>User Admin</td><td>Create/delete users, reset passwords, manage groups, manage user properties</td><td>Day-to-day user lifecycle management</td></tr>' +
            '<tr><td>Exchange Admin</td><td>Manage mailboxes, mail flow rules, anti-spam, and anti-phishing policies</td><td>Email administrators</td></tr>' +
            '<tr><td>SharePoint Admin</td><td>Manage site collections, sharing settings, storage quotas, hub sites</td><td>Intranet and document management teams</td></tr>' +
            '<tr><td>Teams Admin</td><td>Manage Teams policies, meeting configurations, calling, and messaging</td><td>Collaboration and communications team</td></tr>' +
            '<tr><td>Security Admin</td><td>Manage security policies, review security reports, manage threat protection</td><td>Security operations teams</td></tr>' +
            '<tr><td>Compliance Admin</td><td>Manage compliance settings, data loss prevention, retention policies</td><td>Compliance and legal teams</td></tr>' +
            '<tr><td>Billing Admin</td><td>Make purchases, manage subscriptions, manage support tickets, monitor health</td><td>Finance or procurement teams</td></tr>' +
          '</tbody>' +
        '</table>' +

        '<h2>Assigning Admin Roles</h2>' +
        '<p>To assign a role to a user:</p>' +
        '<ol>' +
          '<li>Go to <strong>Admin Center &gt; Users &gt; Active Users</strong>.</li>' +
          '<li>Click the user\'s name to open the detail pane.</li>' +
          '<li>Select <strong>Manage roles</strong>.</li>' +
          '<li>Choose <strong>Admin center access</strong>, then select one or more roles from the list.</li>' +
          '<li>Click <strong>Save changes</strong>.</li>' +
        '</ol>' +

        '<h2>Custom Roles in Azure AD</h2>' +
        '<p>When built-in roles don\'t match your needs exactly, you can create <strong>custom roles</strong> in Azure Active Directory (requires Azure AD Premium P1 or P2). Custom roles let you pick specific permissions from a permission catalog and bundle them into a role tailored to your organization.</p>' +
        '<ul>' +
          '<li>Navigate to <strong>Azure Active Directory &gt; Roles and administrators &gt; New custom role</strong>.</li>' +
          '<li>Give the role a name and description.</li>' +
          '<li>Select individual permissions (e.g., <code>microsoft.directory/users/password/update</code>).</li>' +
          '<li>Assign the custom role to users or groups.</li>' +
        '</ul>' +

        '<div class="callout callout-warning">' +
          '<strong>Security Warning:</strong> Never assign the Global Admin role to service accounts or shared accounts. Use dedicated, named accounts with MFA enabled for all admin roles.' +
        '</div>' +

        '<p>With roles understood, the next lesson focuses on managing groups&mdash;the backbone of collaboration and access control in M365.</p>'
    },

    // ========================================================
    //  LESSON 5 - Managing Groups
    // ========================================================
    {
      id: 'managing-groups',
      title: 'Managing Groups',
      duration: '8 min read',
      difficulty: 'Intermediate',
      content: '<h2>Types of Groups in Microsoft 365</h2>' +
        '<p>Groups are the primary mechanism for organizing users, controlling access, and enabling collaboration. Microsoft 365 offers four main types of groups, each serving a different purpose:</p>' +
        '<table class="lesson-table">' +
          '<thead><tr><th>Group Type</th><th>Purpose</th><th>Includes</th></tr></thead>' +
          '<tbody>' +
            '<tr><td>Microsoft 365 Group</td><td>Collaboration</td><td>Shared mailbox, calendar, SharePoint site, Planner, OneNote</td></tr>' +
            '<tr><td>Distribution List</td><td>Email distribution</td><td>Email alias that forwards to all members</td></tr>' +
            '<tr><td>Security Group</td><td>Access control</td><td>Used to assign permissions to resources (SharePoint, apps, etc.)</td></tr>' +
            '<tr><td>Mail-Enabled Security Group</td><td>Access control + email</td><td>Security group with an email address</td></tr>' +
          '</tbody>' +
        '</table>' +

        '<div class="callout callout-info">' +
          '<strong>Key Distinction:</strong> A <em>Microsoft 365 Group</em> is much more than a mailing list. Creating one automatically provisions a shared mailbox, a SharePoint site, a Planner board, and a OneNote notebook. It is the foundation for Microsoft Teams&mdash;every Team is backed by a M365 Group.' +
        '</div>' +

        '<h2>Creating a Group</h2>' +
        '<p>To create a new group in the Admin Center:</p>' +
        '<ol>' +
          '<li>Navigate to <strong>Groups &gt; Active groups &gt; Add a group</strong>.</li>' +
          '<li>Select the group type (Microsoft 365, Distribution, Security, or Mail-enabled Security).</li>' +
          '<li>Enter a <strong>name</strong>, <strong>description</strong>, and <strong>email address</strong> (for email-capable types).</li>' +
          '<li>Add <strong>owners</strong> (at least one is required) and <strong>members</strong>.</li>' +
          '<li>Configure privacy: <strong>Public</strong> (anyone can join) or <strong>Private</strong> (owner approval required).</li>' +
          '<li>Review and create the group.</li>' +
        '</ol>' +

        '<h2>Owners vs. Members</h2>' +
        '<p>Understanding the distinction between owners and members is critical for group governance:</p>' +
        '<ul>' +
          '<li><strong>Owners</strong> can add/remove members, change group settings, delete the group, and approve join requests for private groups.</li>' +
          '<li><strong>Members</strong> can access group resources (mailbox, SharePoint site, etc.) but cannot manage membership or settings.</li>' +
          '<li>Best practice: assign <strong>at least two owners</strong> so management responsibilities are shared and the group is not orphaned if one owner leaves.</li>' +
        '</ul>' +

        '<h2>Group Naming Policy</h2>' +
        '<p>As organizations grow, group names can become chaotic. A <strong>naming policy</strong> (configured in Azure AD) enforces consistency:</p>' +
        '<ul>' +
          '<li><strong>Prefix/suffix rules</strong> &ndash; Automatically prepend or append text (e.g., <code>GRP_</code> prefix or <code>_Marketing</code> suffix).</li>' +
          '<li><strong>Blocked words</strong> &ndash; Prevent specific words from being used in group names (e.g., profanity, reserved names).</li>' +
        '</ul>' +

        '<h2>Expiration Policy</h2>' +
        '<p>Microsoft 365 Groups can be set to expire automatically after a defined period (e.g., 180 or 365 days). Owners receive renewal notifications before expiration. If no one renews, the group and its resources are soft-deleted and can be recovered within 30 days.</p>' +

        '<div class="callout callout-warning">' +
          '<strong>Governance Tip:</strong> Enable expiration policies for project-based groups to prevent group sprawl. Permanent teams (like departments) should be exempted or set to a longer expiration.' +
        '</div>' +

        '<p>The final lesson covers user offboarding&mdash;the process of securely removing a user from your organization.</p>'
    },

    // ========================================================
    //  LESSON 6 - User Offboarding
    // ========================================================
    {
      id: 'user-offboarding',
      title: 'User Offboarding',
      duration: '12 min read',
      difficulty: 'Intermediate',
      content: '<h2>Why Offboarding Matters</h2>' +
        '<p>When an employee leaves your organization, their Microsoft 365 account must be handled carefully. Poor offboarding leads to security vulnerabilities (former employees retaining access), compliance risks (data loss), and wasted license costs. A structured offboarding checklist ensures nothing is missed.</p>' +

        '<h2>Offboarding Checklist</h2>' +
        '<p>Follow these steps in order for a secure and complete offboarding process:</p>' +

        '<h3>1. Block Sign-In (Immediate)</h3>' +
        '<p>The very first step is to <strong>block the user from signing in</strong>. Go to <strong>Users &gt; Active Users</strong>, select the user, then click <strong>Block sign-in</strong>. This prevents access to all M365 services immediately. It does <em>not</em> delete anything or remove licenses yet.</p>' +

        '<div class="callout callout-info">' +
          '<strong>Timing Tip:</strong> Block sign-in at the exact moment the employee is notified of their departure. Coordinate with HR to align timing.' +
        '</div>' +

        '<h3>2. Revoke Active Sessions</h3>' +
        '<p>Blocking sign-in prevents new logins, but existing sessions may remain active. Use <strong>Revoke sign-in sessions</strong> (found on the user\'s detail page) to invalidate all current tokens. The user will be signed out of all devices and apps within minutes.</p>' +

        '<h3>3. Reset Password</h3>' +
        '<p>Reset the user\'s password to a random, complex string. This is an additional safeguard ensuring the old password cannot be used anywhere, even after the sign-in block is in place.</p>' +

        '<h3>4. Configure Email Access</h3>' +
        '<p>Most organizations need to preserve access to the departing user\'s mailbox. The recommended approach is to <strong>convert the mailbox to a shared mailbox</strong>:</p>' +
        '<ul>' +
          '<li>Go to <strong>Users &gt; Active Users</strong> and select the user.</li>' +
          '<li>Under <strong>Mail</strong>, select <strong>Convert to shared mailbox</strong>.</li>' +
          '<li>Grant <strong>Full Access</strong> and/or <strong>Send As</strong> permissions to the user\'s manager or team.</li>' +
          '<li>A shared mailbox does <strong>not</strong> require a license (up to 50 GB), saving costs.</li>' +
        '</ul>' +

        '<h3>5. Transfer OneDrive Files</h3>' +
        '<p>Delegate access to the departing user\'s OneDrive to their manager:</p>' +
        '<ul>' +
          '<li>On the user\'s detail page, select <strong>OneDrive &gt; Create link to files</strong>.</li>' +
          '<li>This gives the manager access to download or transfer important documents.</li>' +
          '<li>OneDrive content is retained for 30 days after account deletion (configurable up to 10 years in SharePoint admin).</li>' +
        '</ul>' +

        '<h3>6. Remove from Groups and Teams</h3>' +
        '<p>Remove the user from all Microsoft 365 Groups, Teams, distribution lists, and security groups. This ensures they no longer appear in address books or team rosters and prevents mail delivery to their account.</p>' +

        '<h3>7. Remove Licenses</h3>' +
        '<p>After converting the mailbox and transferring files, <strong>remove all licenses</strong> from the user. This frees up licenses for other employees and stops billing immediately.</p>' +

        '<h3>8. Delete the Account</h3>' +
        '<p>Finally, delete the user account. Microsoft 365 performs a <strong>soft delete</strong>: the account and its data are retained in a recoverable state for <strong>30 days</strong>. During this window you can restore the account if needed. After 30 days, the deletion becomes permanent.</p>' +

        '<div class="callout callout-warning">' +
          '<strong>Recovery Window:</strong> You have exactly <strong>30 days</strong> to recover a deleted user account. After that, all associated data (mailbox, OneDrive, etc.) is permanently purged. Always confirm with HR and legal before the 30-day window expires.' +
        '</div>' +

        '<table class="lesson-table">' +
          '<thead><tr><th>Step</th><th>Action</th><th>Where</th></tr></thead>' +
          '<tbody>' +
            '<tr><td>1</td><td>Block sign-in</td><td>Active Users &gt; Block sign-in</td></tr>' +
            '<tr><td>2</td><td>Revoke sessions</td><td>User detail &gt; Revoke sessions</td></tr>' +
            '<tr><td>3</td><td>Reset password</td><td>User detail &gt; Reset password</td></tr>' +
            '<tr><td>4</td><td>Convert mailbox to shared</td><td>User detail &gt; Mail &gt; Convert</td></tr>' +
            '<tr><td>5</td><td>Transfer OneDrive</td><td>User detail &gt; OneDrive</td></tr>' +
            '<tr><td>6</td><td>Remove from groups</td><td>Groups &gt; each group</td></tr>' +
            '<tr><td>7</td><td>Remove licenses</td><td>User detail &gt; Licenses</td></tr>' +
            '<tr><td>8</td><td>Delete account</td><td>Active Users &gt; Delete user</td></tr>' +
          '</tbody>' +
        '</table>' +

        '<p>Congratulations! You have completed all six lessons in the User Management module. Head to the <strong>Simulation</strong> tab to practice these skills hands-on, then test your knowledge in the <strong>Quiz</strong>.</p>'
    }
  ];

  // ----------------------------------------------------------
  //  SIMULATION
  // ----------------------------------------------------------

  var simulation = {
    title: 'M365 Admin Center - Active Users',
    description: 'Practice managing users in a simulated M365 Admin Center. Add users, assign licenses and roles, view user details, and block sign-in.',
    tasks: [
      { instruction: 'Add a new user to the tenant', points: 30 },
      { instruction: 'View user details by clicking a row', points: 20 },
      { instruction: 'Block a user sign-in', points: 25 },
      { instruction: 'Delete a user account', points: 25 }
    ],
    render: function (container, callbacks) {
      // Initial user data
      var users = [
        { id: 1, firstName: 'John', lastName: 'Smith', email: 'john.smith@contoso.com', role: 'Global Admin', license: 'M365 Business Premium', status: 'Active' },
        { id: 2, firstName: 'Sarah', lastName: 'Johnson', email: 's.johnson@contoso.com', role: 'User', license: 'M365 Business Standard', status: 'Active' },
        { id: 3, firstName: 'Mike', lastName: 'Davis', email: 'm.davis@contoso.com', role: 'Exchange Admin', license: 'M365 Business Premium', status: 'Blocked' },
        { id: 4, firstName: 'Emma', lastName: 'Wilson', email: 'e.wilson@contoso.com', role: 'User', license: 'M365 Business Basic', status: 'Active' },
        { id: 5, firstName: 'Tom', lastName: 'Brown', email: 't.brown@contoso.com', role: 'User', license: '(none)', status: 'Active' },
        { id: 6, firstName: 'Lisa', lastName: 'Garcia', email: 'l.garcia@contoso.com', role: 'User', license: 'M365 Business Standard', status: 'Active' }
      ];
      var nextId = 7;

      // Sim state
      var selectedUser = null;
      var addFormStep = 0; // 0 = not open, 1/2/3 = steps
      var addFormData = {};
      var searchFilter = '';
      var statusFilter = 'all';

      container.innerHTML = '';

      // ---- Build wrapper ----
      var simWrap = document.createElement('div');
      simWrap.className = 'sim-admin-center';
      simWrap.style.cssText = 'background:#faf9f8;border:1px solid #edebe9;border-radius:8px;overflow:hidden;font-family:"Segoe UI",system-ui,sans-serif;font-size:14px;color:#323130;';

      // ---- Sim header bar ----
      var simHeader = document.createElement('div');
      simHeader.style.cssText = 'background:#0078d4;color:#fff;padding:10px 20px;display:flex;align-items:center;gap:12px;font-size:14px;';
      simHeader.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3.5" stroke="#fff" stroke-width="1.5" fill="none"/><path d="M3 18c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="#fff" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>' +
        '<strong>Active users</strong>' +
        '<span style="margin-left:auto;font-size:12px;opacity:0.85;">Simulated Admin Center</span>';
      simWrap.appendChild(simHeader);

      // ---- Instruction bar ----
      var instrBar = document.createElement('div');
      instrBar.style.cssText = 'background:#deecf9;padding:10px 20px;font-size:13px;color:#0078d4;border-bottom:1px solid #c8e1f8;';
      instrBar.textContent = 'Try it: Click "Add a user" to create a new account, or click any user row to view their details.';
      simWrap.appendChild(instrBar);

      // ---- Body area (toolbar + table + sidebar) ----
      var bodyArea = document.createElement('div');
      bodyArea.style.cssText = 'display:flex;min-height:420px;';

      var mainPanel = document.createElement('div');
      mainPanel.style.cssText = 'flex:1;display:flex;flex-direction:column;';

      var sidePanel = document.createElement('div');
      sidePanel.style.cssText = 'width:0;overflow:hidden;transition:width 0.2s;border-left:1px solid #edebe9;background:#fff;';

      bodyArea.appendChild(mainPanel);
      bodyArea.appendChild(sidePanel);
      simWrap.appendChild(bodyArea);
      container.appendChild(simWrap);

      // ---- Render functions ----

      function renderToolbar() {
        var tb = document.createElement('div');
        tb.style.cssText = 'display:flex;align-items:center;gap:10px;padding:12px 20px;border-bottom:1px solid #edebe9;background:#fff;flex-wrap:wrap;';

        // Add user button
        var addBtn = document.createElement('button');
        addBtn.textContent = '+ Add a user';
        addBtn.title = 'Create a new user account';
        addBtn.style.cssText = 'background:#0078d4;color:#fff;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;';
        addBtn.onmouseenter = function () { addBtn.style.background = '#106ebe'; };
        addBtn.onmouseleave = function () { addBtn.style.background = '#0078d4'; };
        addBtn.onclick = function () { openAddForm(); };

        // Search box
        var searchBox = document.createElement('input');
        searchBox.type = 'text';
        searchBox.placeholder = 'Search users...';
        searchBox.value = searchFilter;
        searchBox.style.cssText = 'border:1px solid #8a8886;border-radius:4px;padding:7px 12px;font-size:13px;width:200px;outline:none;';
        searchBox.onfocus = function () { searchBox.style.borderColor = '#0078d4'; };
        searchBox.onblur = function () { searchBox.style.borderColor = '#8a8886'; };
        searchBox.oninput = function () { searchFilter = searchBox.value.toLowerCase(); renderAll(); };

        // Filter dropdown
        var filterSelect = document.createElement('select');
        filterSelect.title = 'Filter by status';
        filterSelect.style.cssText = 'border:1px solid #8a8886;border-radius:4px;padding:7px 10px;font-size:13px;outline:none;cursor:pointer;';
        filterSelect.innerHTML = '<option value="all">All users</option><option value="Active">Active</option><option value="Blocked">Blocked</option>';
        filterSelect.value = statusFilter;
        filterSelect.onchange = function () { statusFilter = filterSelect.value; renderAll(); };

        // User count
        var countLabel = document.createElement('span');
        countLabel.style.cssText = 'margin-left:auto;font-size:12px;color:#605e5c;';
        countLabel.textContent = users.length + ' users total';

        tb.appendChild(addBtn);
        tb.appendChild(searchBox);
        tb.appendChild(filterSelect);
        tb.appendChild(countLabel);
        return tb;
      }

      function renderTable() {
        var wrapper = document.createElement('div');
        wrapper.style.cssText = 'flex:1;overflow-y:auto;';

        var table = document.createElement('table');
        table.style.cssText = 'width:100%;border-collapse:collapse;';

        // Header
        var thead = document.createElement('thead');
        thead.innerHTML = '<tr style="background:#faf9f8;border-bottom:2px solid #edebe9;text-align:left;">' +
          '<th style="padding:10px 20px;font-weight:600;font-size:13px;color:#605e5c;">Display name</th>' +
          '<th style="padding:10px 12px;font-weight:600;font-size:13px;color:#605e5c;">Email</th>' +
          '<th style="padding:10px 12px;font-weight:600;font-size:13px;color:#605e5c;">Role</th>' +
          '<th style="padding:10px 12px;font-weight:600;font-size:13px;color:#605e5c;">License</th>' +
          '<th style="padding:10px 12px;font-weight:600;font-size:13px;color:#605e5c;">Status</th>' +
          '</tr>';
        table.appendChild(thead);

        var tbody = document.createElement('tbody');

        var filtered = users.filter(function (u) {
          var matchSearch = !searchFilter ||
            (u.firstName + ' ' + u.lastName).toLowerCase().indexOf(searchFilter) !== -1 ||
            u.email.toLowerCase().indexOf(searchFilter) !== -1;
          var matchStatus = statusFilter === 'all' || u.status === statusFilter;
          return matchSearch && matchStatus;
        });

        if (filtered.length === 0) {
          var emptyRow = document.createElement('tr');
          emptyRow.innerHTML = '<td colspan="5" style="padding:40px 20px;text-align:center;color:#605e5c;font-style:italic;">No users match the current search or filter.</td>';
          tbody.appendChild(emptyRow);
        }

        filtered.forEach(function (u) {
          var tr = document.createElement('tr');
          tr.style.cssText = 'border-bottom:1px solid #edebe9;cursor:pointer;transition:background 0.1s;';
          if (selectedUser && selectedUser.id === u.id) {
            tr.style.background = '#deecf9';
          }
          tr.onmouseenter = function () { if (!selectedUser || selectedUser.id !== u.id) tr.style.background = '#f3f2f1'; };
          tr.onmouseleave = function () { if (!selectedUser || selectedUser.id !== u.id) tr.style.background = ''; };
          tr.onclick = function () { openUserPanel(u); };

          var statusColor = u.status === 'Active' ? '#107c10' : '#d13438';
          var statusBg = u.status === 'Active' ? '#dff6dd' : '#fde7e9';

          tr.innerHTML =
            '<td style="padding:10px 20px;font-weight:600;">' + u.firstName + ' ' + u.lastName + '</td>' +
            '<td style="padding:10px 12px;color:#605e5c;">' + u.email + '</td>' +
            '<td style="padding:10px 12px;">' + u.role + '</td>' +
            '<td style="padding:10px 12px;color:' + (u.license === '(none)' ? '#d13438' : '#605e5c') + ';">' + u.license + '</td>' +
            '<td style="padding:10px 12px;"><span style="display:inline-block;padding:2px 10px;border-radius:12px;font-size:12px;font-weight:600;background:' + statusBg + ';color:' + statusColor + ';">' + u.status + '</span></td>';

          tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        wrapper.appendChild(table);
        return wrapper;
      }

      function openUserPanel(user) {
        selectedUser = user;
        sidePanel.style.width = '320px';
        renderSidePanel();
        renderMainPanel();
      }

      function closeUserPanel() {
        selectedUser = null;
        sidePanel.style.width = '0';
        sidePanel.innerHTML = '';
        renderMainPanel();
      }

      function renderSidePanel() {
        if (!selectedUser) return;
        var u = selectedUser;
        sidePanel.innerHTML = '';

        var sp = document.createElement('div');
        sp.style.cssText = 'padding:20px;';

        // Close button
        var closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.title = 'Close panel';
        closeBtn.style.cssText = 'float:right;background:none;border:none;font-size:20px;cursor:pointer;color:#605e5c;line-height:1;padding:0 4px;';
        closeBtn.onclick = closeUserPanel;
        sp.appendChild(closeBtn);

        // Avatar circle
        var avatar = document.createElement('div');
        var initials = (u.firstName.charAt(0) + u.lastName.charAt(0)).toUpperCase();
        avatar.style.cssText = 'width:64px;height:64px;border-radius:50%;background:#0078d4;color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:600;margin:0 auto 12px;';
        avatar.textContent = initials;
        sp.appendChild(avatar);

        // Name
        var nameEl = document.createElement('h3');
        nameEl.style.cssText = 'text-align:center;margin:0 0 4px;font-size:18px;';
        nameEl.textContent = u.firstName + ' ' + u.lastName;
        sp.appendChild(nameEl);

        // Email
        var emailEl = document.createElement('p');
        emailEl.style.cssText = 'text-align:center;color:#605e5c;margin:0 0 16px;font-size:13px;';
        emailEl.textContent = u.email;
        sp.appendChild(emailEl);

        // Detail rows
        var details = [
          { label: 'Role', value: u.role },
          { label: 'License', value: u.license },
          { label: 'Status', value: u.status }
        ];
        details.forEach(function (d) {
          var row = document.createElement('div');
          row.style.cssText = 'display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #edebe9;font-size:13px;';
          row.innerHTML = '<span style="color:#605e5c;">' + d.label + '</span><span style="font-weight:600;">' + d.value + '</span>';
          sp.appendChild(row);
        });

        // Action buttons
        var actions = document.createElement('div');
        actions.style.cssText = 'margin-top:20px;display:flex;flex-direction:column;gap:8px;';

        function makeActionBtn(label, color, bg, hoverBg, onclick) {
          var btn = document.createElement('button');
          btn.textContent = label;
          btn.style.cssText = 'border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;background:' + bg + ';color:' + color + ';text-align:center;';
          btn.onmouseenter = function () { btn.style.background = hoverBg; };
          btn.onmouseleave = function () { btn.style.background = bg; };
          btn.onclick = onclick;
          return btn;
        }

        // Edit button (simple demo)
        actions.appendChild(makeActionBtn('Edit user', '#0078d4', '#deecf9', '#c8e1f8', function () {
          showToast('Edit panel would open here. This is a simplified simulation.');
        }));

        // Reset password
        actions.appendChild(makeActionBtn('Reset password', '#0078d4', '#deecf9', '#c8e1f8', function () {
          showToast('Password reset! A temporary password has been generated for ' + u.firstName + ' ' + u.lastName + '.');
        }));

        // Block/Unblock sign-in
        var blockLabel = u.status === 'Active' ? 'Block sign-in' : 'Unblock sign-in';
        var blockColor = u.status === 'Active' ? '#d13438' : '#107c10';
        var blockBg = u.status === 'Active' ? '#fde7e9' : '#dff6dd';
        var blockHover = u.status === 'Active' ? '#f1c1c3' : '#c5eac5';
        actions.appendChild(makeActionBtn(blockLabel, blockColor, blockBg, blockHover, function () {
          u.status = u.status === 'Active' ? 'Blocked' : 'Active';
          showToast(u.firstName + ' ' + u.lastName + ' is now ' + u.status + '.');
          renderSidePanel();
          renderMainPanel();
        }));

        // Delete user
        actions.appendChild(makeActionBtn('Delete user', '#d13438', '#fde7e9', '#f1c1c3', function () {
          users = users.filter(function (x) { return x.id !== u.id; });
          showToast(u.firstName + ' ' + u.lastName + ' has been deleted. The account can be recovered within 30 days.');
          closeUserPanel();
        }));

        sp.appendChild(actions);
        sidePanel.appendChild(sp);
      }

      // ---- Add User Form (overlay) ----
      var formOverlay = null;

      function openAddForm() {
        addFormStep = 1;
        addFormData = { firstName: '', lastName: '', username: '', license: '', role: 'User' };
        renderAddForm();
      }

      function closeAddForm() {
        addFormStep = 0;
        if (formOverlay && formOverlay.parentNode) {
          formOverlay.parentNode.removeChild(formOverlay);
        }
        formOverlay = null;
      }

      function renderAddForm() {
        if (formOverlay && formOverlay.parentNode) {
          formOverlay.parentNode.removeChild(formOverlay);
        }

        formOverlay = document.createElement('div');
        formOverlay.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:100;';

        var modal = document.createElement('div');
        modal.style.cssText = 'background:#fff;border-radius:8px;width:440px;max-width:95%;box-shadow:0 8px 32px rgba(0,0,0,0.2);overflow:hidden;';

        // Modal header
        var mh = document.createElement('div');
        mh.style.cssText = 'background:#0078d4;color:#fff;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;';
        mh.innerHTML = '<strong>Add a user &mdash; Step ' + addFormStep + ' of 3</strong>';
        var closeX = document.createElement('button');
        closeX.innerHTML = '&times;';
        closeX.style.cssText = 'background:none;border:none;color:#fff;font-size:20px;cursor:pointer;';
        closeX.onclick = closeAddForm;
        mh.appendChild(closeX);
        modal.appendChild(mh);

        // Step indicator bar
        var stepBar = document.createElement('div');
        stepBar.style.cssText = 'display:flex;height:4px;';
        for (var s = 1; s <= 3; s++) {
          var seg = document.createElement('div');
          seg.style.cssText = 'flex:1;background:' + (s <= addFormStep ? '#0078d4' : '#edebe9') + ';';
          stepBar.appendChild(seg);
        }
        modal.appendChild(stepBar);

        var body = document.createElement('div');
        body.style.cssText = 'padding:20px;';

        if (addFormStep === 1) {
          // Step 1: Basic info
          body.innerHTML =
            '<h4 style="margin:0 0 4px;font-size:16px;">Set up the basics</h4>' +
            '<p style="color:#605e5c;font-size:13px;margin:0 0 16px;">Enter the user\'s name and sign-in address.</p>';

          function makeField(label, id, placeholder, value) {
            var group = document.createElement('div');
            group.style.cssText = 'margin-bottom:14px;';
            var lbl = document.createElement('label');
            lbl.textContent = label;
            lbl.htmlFor = id;
            lbl.style.cssText = 'display:block;font-size:13px;font-weight:600;margin-bottom:4px;';
            var inp = document.createElement('input');
            inp.type = 'text';
            inp.id = id;
            inp.placeholder = placeholder;
            inp.value = value || '';
            inp.style.cssText = 'width:100%;box-sizing:border-box;border:1px solid #8a8886;border-radius:4px;padding:8px 12px;font-size:14px;outline:none;';
            inp.onfocus = function () { inp.style.borderColor = '#0078d4'; };
            inp.onblur = function () { inp.style.borderColor = '#8a8886'; };
            group.appendChild(lbl);
            group.appendChild(inp);
            return group;
          }

          body.appendChild(makeField('First name *', 'sim-fn', 'e.g., Alex', addFormData.firstName));
          body.appendChild(makeField('Last name *', 'sim-ln', 'e.g., Wilber', addFormData.lastName));
          body.appendChild(makeField('Username *', 'sim-un', 'e.g., alexw', addFormData.username));

          var domainHint = document.createElement('p');
          domainHint.style.cssText = 'font-size:12px;color:#605e5c;margin:-8px 0 0;';
          domainHint.textContent = 'The sign-in address will be username@contoso.com';
          body.appendChild(domainHint);

        } else if (addFormStep === 2) {
          // Step 2: License
          body.innerHTML =
            '<h4 style="margin:0 0 4px;font-size:16px;">Product licenses</h4>' +
            '<p style="color:#605e5c;font-size:13px;margin:0 0 16px;">Choose a license to assign to this user.</p>';

          var licenses = [
            { value: 'M365 Business Basic', desc: 'Web and mobile apps, Exchange, OneDrive, Teams' },
            { value: 'M365 Business Standard', desc: 'Desktop Office apps + everything in Basic' },
            { value: 'M365 Business Premium', desc: 'Standard + Intune, Azure AD P1, Defender' }
          ];

          licenses.forEach(function (lic) {
            var opt = document.createElement('label');
            opt.style.cssText = 'display:flex;align-items:flex-start;gap:10px;padding:12px;border:1px solid #edebe9;border-radius:6px;margin-bottom:8px;cursor:pointer;transition:border-color 0.15s;';
            if (addFormData.license === lic.value) {
              opt.style.borderColor = '#0078d4';
              opt.style.background = '#eff6fc';
            }
            opt.onmouseenter = function () { if (addFormData.license !== lic.value) opt.style.borderColor = '#8a8886'; };
            opt.onmouseleave = function () { if (addFormData.license !== lic.value) opt.style.borderColor = '#edebe9'; };

            var radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'sim-license';
            radio.value = lic.value;
            radio.checked = addFormData.license === lic.value;
            radio.style.cssText = 'margin-top:2px;';
            radio.onchange = function () {
              addFormData.license = lic.value;
              renderAddForm();
            };

            var txt = document.createElement('div');
            txt.innerHTML = '<div style="font-weight:600;font-size:14px;">' + lic.value + '</div><div style="font-size:12px;color:#605e5c;margin-top:2px;">' + lic.desc + '</div>';

            opt.appendChild(radio);
            opt.appendChild(txt);
            body.appendChild(opt);
          });

        } else if (addFormStep === 3) {
          // Step 3: Role + Confirm
          body.innerHTML =
            '<h4 style="margin:0 0 4px;font-size:16px;">Role &amp; Review</h4>' +
            '<p style="color:#605e5c;font-size:13px;margin:0 0 16px;">Assign an admin role (optional) and confirm the details.</p>';

          // Role select
          var roleGroup = document.createElement('div');
          roleGroup.style.cssText = 'margin-bottom:16px;';
          var roleLbl = document.createElement('label');
          roleLbl.textContent = 'Admin role';
          roleLbl.style.cssText = 'display:block;font-size:13px;font-weight:600;margin-bottom:4px;';
          var roleSelect = document.createElement('select');
          roleSelect.style.cssText = 'width:100%;border:1px solid #8a8886;border-radius:4px;padding:8px 10px;font-size:14px;outline:none;';
          var roles = ['User (no admin access)', 'Global Admin', 'User Admin', 'Exchange Admin', 'SharePoint Admin', 'Teams Admin', 'Billing Admin'];
          roles.forEach(function (r) {
            var o = document.createElement('option');
            o.value = r === 'User (no admin access)' ? 'User' : r;
            o.textContent = r;
            if (addFormData.role === o.value) o.selected = true;
            roleSelect.appendChild(o);
          });
          roleSelect.onchange = function () { addFormData.role = roleSelect.value; };
          roleGroup.appendChild(roleLbl);
          roleGroup.appendChild(roleSelect);
          body.appendChild(roleGroup);

          // Summary
          var summary = document.createElement('div');
          summary.style.cssText = 'background:#faf9f8;border:1px solid #edebe9;border-radius:6px;padding:16px;';
          summary.innerHTML =
            '<h4 style="margin:0 0 10px;font-size:14px;">Review new user details</h4>' +
            '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #edebe9;font-size:13px;"><span style="color:#605e5c;">Name</span><span style="font-weight:600;">' + (addFormData.firstName || '(not set)') + ' ' + (addFormData.lastName || '') + '</span></div>' +
            '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #edebe9;font-size:13px;"><span style="color:#605e5c;">Email</span><span style="font-weight:600;">' + (addFormData.username ? addFormData.username + '@contoso.com' : '(not set)') + '</span></div>' +
            '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #edebe9;font-size:13px;"><span style="color:#605e5c;">License</span><span style="font-weight:600;">' + (addFormData.license || '(none)') + '</span></div>' +
            '<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;"><span style="color:#605e5c;">Role</span><span style="font-weight:600;">' + addFormData.role + '</span></div>';
          body.appendChild(summary);
        }

        modal.appendChild(body);

        // Footer with nav buttons
        var footer = document.createElement('div');
        footer.style.cssText = 'padding:12px 20px;border-top:1px solid #edebe9;display:flex;justify-content:space-between;background:#faf9f8;';

        if (addFormStep > 1) {
          var backBtn = document.createElement('button');
          backBtn.textContent = 'Back';
          backBtn.style.cssText = 'background:#fff;color:#323130;border:1px solid #8a8886;padding:8px 20px;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;';
          backBtn.onclick = function () {
            captureFormValues();
            addFormStep--;
            renderAddForm();
          };
          footer.appendChild(backBtn);
        } else {
          var cancelBtn = document.createElement('button');
          cancelBtn.textContent = 'Cancel';
          cancelBtn.style.cssText = 'background:#fff;color:#323130;border:1px solid #8a8886;padding:8px 20px;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;';
          cancelBtn.onclick = closeAddForm;
          footer.appendChild(cancelBtn);
        }

        if (addFormStep < 3) {
          var nextBtn = document.createElement('button');
          nextBtn.textContent = 'Next';
          nextBtn.style.cssText = 'background:#0078d4;color:#fff;border:none;padding:8px 20px;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;';
          nextBtn.onmouseenter = function () { nextBtn.style.background = '#106ebe'; };
          nextBtn.onmouseleave = function () { nextBtn.style.background = '#0078d4'; };
          nextBtn.onclick = function () {
            captureFormValues();
            if (addFormStep === 1 && (!addFormData.firstName.trim() || !addFormData.username.trim())) {
              showToast('Please fill in the required fields (First name and Username).');
              return;
            }
            addFormStep++;
            renderAddForm();
          };
          footer.appendChild(nextBtn);
        } else {
          var finishBtn = document.createElement('button');
          finishBtn.textContent = 'Finish adding user';
          finishBtn.style.cssText = 'background:#107c10;color:#fff;border:none;padding:8px 20px;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;';
          finishBtn.onmouseenter = function () { finishBtn.style.background = '#0e6b0e'; };
          finishBtn.onmouseleave = function () { finishBtn.style.background = '#107c10'; };
          finishBtn.onclick = function () {
            var newUser = {
              id: nextId++,
              firstName: addFormData.firstName.trim() || 'New',
              lastName: addFormData.lastName.trim() || 'User',
              email: (addFormData.username.trim() || 'newuser') + '@contoso.com',
              role: addFormData.role || 'User',
              license: addFormData.license || '(none)',
              status: 'Active'
            };
            users.push(newUser);
            closeAddForm();
            if (callbacks && callbacks.completeSim) { callbacks.completeSim(); }
            showToast('New user created! ' + newUser.firstName + ' ' + newUser.lastName + ' (' + newUser.email + ') has been added successfully.');
            renderAll();
          };
          footer.appendChild(finishBtn);
        }

        modal.appendChild(footer);
        formOverlay.appendChild(modal);

        // Append overlay relative to the sim container
        simWrap.style.position = 'relative';
        simWrap.appendChild(formOverlay);
      }

      function captureFormValues() {
        if (addFormStep === 1) {
          var fn = document.getElementById('sim-fn');
          var ln = document.getElementById('sim-ln');
          var un = document.getElementById('sim-un');
          if (fn) addFormData.firstName = fn.value;
          if (ln) addFormData.lastName = ln.value;
          if (un) addFormData.username = un.value;
        }
      }

      // ---- Toast notifications ----
      function showToast(message) {
        var toast = document.createElement('div');
        toast.style.cssText = 'position:absolute;bottom:16px;left:50%;transform:translateX(-50%);background:#323130;color:#fff;padding:12px 24px;border-radius:6px;font-size:13px;z-index:200;box-shadow:0 4px 16px rgba(0,0,0,0.25);max-width:90%;text-align:center;animation:simToastIn 0.3s ease;';
        toast.textContent = message;
        simWrap.appendChild(toast);
        setTimeout(function () {
          toast.style.opacity = '0';
          toast.style.transition = 'opacity 0.3s';
          setTimeout(function () {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
          }, 300);
        }, 3500);
      }

      // ---- Render all ----
      function renderMainPanel() {
        mainPanel.innerHTML = '';
        mainPanel.appendChild(renderToolbar());
        mainPanel.appendChild(renderTable());
      }

      function renderAll() {
        renderMainPanel();
        if (selectedUser) {
          // Check if user still exists
          var stillExists = users.some(function (u) { return u.id === selectedUser.id; });
          if (stillExists) {
            renderSidePanel();
          } else {
            closeUserPanel();
          }
        }
      }

      // Initial render
      renderAll();
    }
  };

  // ----------------------------------------------------------
  //  QUIZ
  // ----------------------------------------------------------

  var quiz = [
    {
      id: "users-q1",
      question: 'What URL do you use to access the M365 Admin Center?',
      options: [
        'portal.azure.com',
        'admin.microsoft.com',
        'office.com/admin',
        'microsoft365.com/admin'
      ],
      correct: 1,
      explanation: 'The Microsoft 365 Admin Center is accessed at admin.microsoft.com. This is the unified portal for all M365 administration tasks.'
    },
    {
      id: "users-q2",
      question: 'Which admin role has FULL access to all M365 services?',
      options: [
        'Exchange Admin',
        'User Admin',
        'Global Admin',
        'Billing Admin'
      ],
      correct: 2,
      explanation: 'Global Admin has unrestricted access to all features across every Microsoft 365 service. It should be limited to 2-4 accounts in any organization.'
    },
    {
      id: "users-q3",
      question: 'What happens to a user\'s data when their account is deleted in M365?',
      options: [
        'Immediately and permanently deleted',
        'Kept for 30 days then purged',
        'Kept indefinitely',
        'Moved to archive'
      ],
      correct: 1,
      explanation: 'Deleted user accounts enter a soft-delete state and are recoverable for 30 days. After 30 days the account and its data are permanently purged.'
    },
    {
      id: "users-q4",
      question: 'What is group-based licensing used for?',
      options: [
        'Creating security groups',
        'Automatically assigning licenses via group membership',
        'Billing management',
        'Creating Teams'
      ],
      correct: 1,
      explanation: 'Group-based licensing automatically assigns product licenses to all members of an Azure AD group, simplifying license management at scale.'
    },
    {
      id: "users-q5",
      question: 'Which of these is NOT a built-in M365 admin role?',
      options: [
        'Exchange Admin',
        'Database Admin',
        'Teams Admin',
        'SharePoint Admin'
      ],
      correct: 1,
      explanation: 'Database Admin is not a built-in Microsoft 365 role. Exchange Admin, Teams Admin, and SharePoint Admin are all standard built-in roles.'
    },
    {
      id: "users-q6",
      question: 'When offboarding a user, what should you do FIRST?',
      options: [
        'Delete their account',
        'Block their sign-in',
        'Remove their licenses',
        'Transfer their files'
      ],
      correct: 1,
      explanation: 'Blocking sign-in should be the very first step to immediately prevent the departing user from accessing any M365 services while you complete the rest of the offboarding process.'
    },
    {
      id: "users-q7",
      question: 'What is a Microsoft 365 Group?',
      options: [
        'A security group for file permissions',
        'A shared workspace with mailbox, calendar, and SharePoint site',
        'A distribution list for email',
        'A billing group'
      ],
      correct: 1,
      explanation: 'A Microsoft 365 Group is a collaboration workspace that automatically includes a shared mailbox, calendar, SharePoint site, Planner board, and OneNote notebook.'
    },
    {
      id: "users-q8",
      question: 'How many days do you have to recover a deleted user?',
      options: [
        '7 days',
        '14 days',
        '30 days',
        '90 days'
      ],
      correct: 2,
      explanation: 'Microsoft 365 retains deleted user accounts in a soft-delete state for exactly 30 days, during which they can be fully restored with all their data.'
    },
    {
      id: "users-q9",
      question: 'What does "principle of least privilege" mean?',
      options: [
        'Give users all permissions upfront',
        'Give users only the minimum permissions needed',
        'Use group policies',
        'Restrict all external access'
      ],
      correct: 1,
      explanation: 'The principle of least privilege means granting users only the minimum level of access required to perform their job, reducing security risk if an account is compromised.'
    },
    {
      id: "users-q10",
      question: 'Which license type includes Teams, Exchange, SharePoint, and advanced security?',
      options: [
        'M365 Business Basic',
        'M365 Business Standard',
        'M365 Business Premium',
        'M365 F1'
      ],
      correct: 2,
      explanation: 'M365 Business Premium includes all standard productivity services (Teams, Exchange, SharePoint) plus advanced security features like Intune, Azure AD P1, and Defender for Business.'
    }
  ];

  // ----------------------------------------------------------
  //  REGISTER MODULE
  // ----------------------------------------------------------

  window.M365App.registerModule({
    id: 'users',
    title: 'User Management',
    subtitle: 'Learn to manage M365 users, licenses, and identities',
    color: '#0078d4',
    icon: 'person',
    lessons: lessons,
    simulation: simulation,
    quiz: quiz
  });

})();
