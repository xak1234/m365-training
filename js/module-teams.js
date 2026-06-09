/* ============================================================
   MODULE: MS Teams Administration
   Microsoft Teams Admin Center training module
   ============================================================ */
(function () {
  'use strict';

  window.M365App = window.M365App || {};
  window.M365App.registerModule = window.M365App.registerModule || function () {};

  /* ----------------------------------------------------------
     LESSON CONTENT
     ---------------------------------------------------------- */

  var lessons = [
    /* ---- Lesson 1 ---- */
    {
      id: 'teams-admin-center-overview',
      title: 'Teams Admin Center Overview',
      duration: '5 min read',
      difficulty: 'Beginner',
      content: `
        <h2>Teams Admin Center Overview</h2>

        <div class="callout callout--info">
          <strong>Key URL:</strong> The Teams Admin Center is located at
          <code>admin.teams.microsoft.com</code>. Bookmark this address &mdash;
          you will use it daily as a Teams administrator.
        </div>

        <h3>Accessing the Teams Admin Center</h3>
        <p>
          The Microsoft Teams Admin Center is the primary web portal for managing
          every aspect of Microsoft Teams in your organization. To access it, navigate
          to <code>https://admin.teams.microsoft.com</code> and sign in with an account
          that holds at least the <strong>Teams Administrator</strong> role in Azure Active
          Directory. Global Administrators also have full access. If your organization
          uses Conditional Access, make sure the admin portal URL is included in your
          trusted locations policy so administrators are not inadvertently blocked.
        </p>

        <h3>Dashboard Navigation</h3>
        <p>
          When you first land in the Teams Admin Center, you are presented with the
          <strong>Dashboard</strong>. The left-hand navigation pane organizes the portal
          into several major sections:
        </p>
        <ul>
          <li><strong>Dashboard</strong> &mdash; High-level overview with key metrics and service health.</li>
          <li><strong>Teams</strong> &mdash; Create and manage teams, templates, and team policies.</li>
          <li><strong>Users</strong> &mdash; View per-user settings, assigned policies, and call quality data.</li>
          <li><strong>Meetings</strong> &mdash; Configure meeting policies, bridge settings, and live events.</li>
          <li><strong>Messaging</strong> &mdash; Control chat, messaging policies, and content moderation.</li>
          <li><strong>Voice</strong> &mdash; Set up calling plans, auto attendants, and call queues.</li>
          <li><strong>Locations</strong> &mdash; Define office locations for emergency calling (E911).</li>
          <li><strong>Analytics &amp; reports</strong> &mdash; Usage reports, call quality dashboard, and PSTN usage.</li>
        </ul>

        <h3>Key Dashboard Metrics</h3>
        <p>
          The Dashboard surface displays real-time cards for <strong>active users</strong>,
          <strong>total calls</strong>, and <strong>meetings organized</strong> over the last
          28 days. These metrics give you an at-a-glance understanding of adoption trends.
          If you see a sudden drop in active users, it may signal a licensing issue or a
          service disruption that warrants investigation.
        </p>

        <h3>Relationship with Microsoft 365 Admin Center</h3>
        <p>
          The M365 Admin Center (<code>admin.microsoft.com</code>) is the umbrella portal
          for all Microsoft 365 workloads. The Teams Admin Center is a <em>specialized</em>
          portal focused exclusively on Teams. You can navigate between the two using the
          "Show all" link in the M365 Admin Center left nav, which lists the Teams Admin
          Center under <strong>Admin centers</strong>. Licensing and user creation are
          typically handled in the M365 Admin Center, while Teams-specific configuration
          such as policies, channels, and voice routing is performed in the Teams Admin
          Center.
        </p>

        <h3>Service Health Monitoring</h3>
        <p>
          The Dashboard also surfaces a <strong>Service health</strong> widget that
          mirrors the information from the Microsoft 365 Service Health Dashboard. Any
          active incidents or advisories affecting Microsoft Teams are displayed here.
          You can click through to get detailed information about the incident timeline,
          user impact, and estimated resolution time. It is good practice to check this
          widget at the start of every workday and to configure email notifications for
          service incidents under <em>Settings &gt; Notifications</em> in the M365
          Admin Center.
        </p>

        <blockquote>
          <strong>Pro Tip:</strong> Use the search bar at the top of the Teams Admin Center
          to quickly find settings. For example, typing "lobby" will jump you directly to
          the meeting policy setting that controls lobby bypass behavior.
        </blockquote>
      `
    },

    /* ---- Lesson 2 ---- */
    {
      id: 'creating-managing-teams',
      title: 'Creating and Managing Teams',
      duration: '10 min read',
      difficulty: 'Beginner',
      content: `
        <h2>Creating and Managing Teams</h2>

        <h3>Understanding the Teams Structure</h3>
        <p>
          Microsoft Teams uses a hierarchical structure: <strong>Teams</strong> sit at the
          top level, each team contains one or more <strong>Channels</strong>, and channels
          contain <strong>Tabs</strong>, <strong>Connectors</strong>, and conversation threads.
          Every team is backed by a Microsoft 365 Group, which means creating a team also
          provisions a SharePoint site, an Exchange Online shared mailbox, a OneNote notebook,
          and a Planner board. Understanding this relationship is essential for governance
          because deleting a team also removes all associated resources.
        </p>

        <h3>Creating a Team</h3>
        <p>There are three primary methods for creating a team:</p>
        <ol>
          <li>
            <strong>From scratch</strong> &mdash; Start with a blank team. You choose the name,
            description, privacy setting, and add members manually. Best for new projects
            with no existing collaboration infrastructure.
          </li>
          <li>
            <strong>From a template</strong> &mdash; Microsoft provides built-in templates
            (e.g., "Manage a Project", "Manage an Event") that pre-configure channels, tabs,
            and apps. You can also create custom organization templates in the Teams Admin
            Center under <em>Teams &gt; Team templates</em>.
          </li>
          <li>
            <strong>From an existing Microsoft 365 Group</strong> &mdash; If a group already
            exists (for example, an Outlook distribution group or a SharePoint team site),
            you can "Teams-enable" it. The group&rsquo;s membership carries over automatically.
          </li>
        </ol>

        <h3>Team Types</h3>
        <table>
          <thead>
            <tr><th>Type</th><th>Visibility</th><th>Max Members</th><th>Use Case</th></tr>
          </thead>
          <tbody>
            <tr><td>Private</td><td>Hidden; join by invitation only</td><td>25,000</td><td>Project teams, sensitive work</td></tr>
            <tr><td>Public</td><td>Visible to everyone; anyone can join</td><td>25,000</td><td>Communities of interest, open discussions</td></tr>
            <tr><td>Org-wide</td><td>All employees auto-joined</td><td>10,000</td><td>Company announcements, all-hands</td></tr>
          </tbody>
        </table>

        <div class="callout callout--warning">
          <strong>Org-wide Limit:</strong> Only organizations with fewer than
          <strong>10,000 users</strong> can create Org-wide teams. You are limited to a
          maximum of 5 Org-wide teams per tenant.
        </div>

        <h3>Managing Team Owners</h3>
        <p>
          Every team must have at least <strong>one owner</strong>, but Microsoft recommends
          at least <strong>two owners</strong> per team to ensure continuity. Owners can add
          and remove members, change team settings, manage channels, and delete the team.
          If the last owner leaves an organization, the team becomes orphaned. Use the
          Teams Admin Center&rsquo;s <em>Teams &gt; Manage teams</em> page to audit owner
          counts and assign new owners to orphaned teams.
        </p>

        <h3>Archiving vs. Deleting Teams</h3>
        <p>
          When a project concludes, you have two choices:
        </p>
        <ul>
          <li>
            <strong>Archive</strong> &mdash; The team becomes <em>read-only</em>. All messages,
            files, and wiki content are preserved, but no new posts or edits are allowed. Users
            can still search and browse. This is the recommended approach for retaining
            institutional knowledge.
          </li>
          <li>
            <strong>Delete</strong> &mdash; The team and its associated M365 Group are
            permanently removed (soft-deleted for 30 days, then hard-deleted). All
            conversations, files, and the connected SharePoint site are destroyed.
          </li>
        </ul>

        <h3>Team Expiration Policy</h3>
        <p>
          In Azure AD, you can configure a <strong>Group Expiration Policy</strong> that
          applies to M365 Groups (and therefore Teams). When a team reaches its expiration
          date, the owners receive a renewal notification. If no one renews within the grace
          period, the group is soft-deleted. Common expiration intervals are 180 days or
          365 days, depending on organizational policy.
        </p>
      `
    },

    /* ---- Lesson 3 ---- */
    {
      id: 'channels-and-tabs',
      title: 'Channels and Tabs',
      duration: '8 min read',
      difficulty: 'Intermediate',
      content: `
        <h2>Channels and Tabs</h2>

        <h3>Channel Types</h3>
        <p>
          Microsoft Teams supports three types of channels, each serving a different
          collaboration need:
        </p>
        <table>
          <thead>
            <tr><th>Type</th><th>Membership</th><th>Storage</th><th>Key Detail</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Standard</strong></td>
              <td>All team members automatically</td>
              <td>Team SharePoint site</td>
              <td>Visible to everyone in the team</td>
            </tr>
            <tr>
              <td><strong>Private</strong></td>
              <td>Selected team members only</td>
              <td>Separate SharePoint site collection</td>
              <td>Conversations and files are hidden from non-members</td>
            </tr>
            <tr>
              <td><strong>Shared</strong></td>
              <td>People inside or outside the team/org</td>
              <td>Separate SharePoint site collection</td>
              <td>Enables cross-team and cross-org collaboration</td>
            </tr>
          </tbody>
        </table>

        <div class="callout callout--info">
          <strong>Shared Channels</strong> are the only channel type that allows
          collaboration with users <em>outside your organization</em> without requiring
          those users to switch tenants. This is powered by Azure AD B2B direct connect.
        </div>

        <h3>Creating Channels</h3>
        <p>
          To create a channel, navigate to the team, click the ellipsis menu (<code>...</code>),
          and select <strong>Add channel</strong>. You will be prompted for:
        </p>
        <ul>
          <li><strong>Channel name</strong> &mdash; Keep it descriptive (e.g., "Q1 Marketing Campaign").</li>
          <li><strong>Description</strong> &mdash; A brief explanation of the channel&rsquo;s purpose.</li>
          <li><strong>Privacy</strong> &mdash; Standard (accessible to all team members) or Private.</li>
          <li><strong>Automatically show in everyone&rsquo;s channel list</strong> &mdash; When enabled, the channel appears in every team member&rsquo;s sidebar without requiring them to manually show it.</li>
        </ul>

        <h3>Tab Apps</h3>
        <p>
          Tabs allow you to embed applications directly into a channel. Click the
          <strong>+</strong> icon at the top of a channel to add a tab. Common tab apps include:
        </p>
        <ul>
          <li><strong>SharePoint</strong> &mdash; Embed a document library or page.</li>
          <li><strong>OneNote</strong> &mdash; Shared notebook for the channel.</li>
          <li><strong>Planner</strong> &mdash; Kanban-style task management board.</li>
          <li><strong>Website</strong> &mdash; Embed any URL as an iframe within the channel.</li>
          <li><strong>Power BI</strong> &mdash; Embed dashboards and reports.</li>
        </ul>

        <h3>Channel Moderation</h3>
        <p>
          Team owners can enable <strong>channel moderation</strong> on any standard channel.
          When moderation is turned on, only moderators can start new posts. Members can reply
          to existing posts unless that is also restricted. This is ideal for announcement
          channels where you want controlled, one-way communication. To configure moderation,
          go to the channel settings and toggle <em>Channel moderation</em> to <strong>On</strong>,
          then add designated moderators.
        </p>

        <h3>The General Channel</h3>
        <p>
          Every team includes a <strong>General</strong> channel that is created automatically
          and <em>cannot be deleted or renamed</em>. It serves as the default landing channel
          for the team. While you cannot remove it, you can configure its moderation settings
          and adjust notification preferences. Best practice: use the General channel for
          important announcements and create dedicated channels for topic-based discussions.
        </p>

        <h3>Notifications and @Mentions</h3>
        <p>
          Users can configure notification preferences per channel: <strong>All activity</strong>,
          <strong>Mentions and replies</strong>, or <strong>Off</strong>. The <code>@channel</code>
          mention notifies everyone who has the channel shown, while <code>@team</code> notifies
          all team members. Admins can control whether <code>@channel</code> and <code>@team</code>
          mentions are allowed via team settings to prevent notification overload in large teams.
        </p>
      `
    },

    /* ---- Lesson 4 ---- */
    {
      id: 'teams-policies',
      title: 'Teams Policies',
      duration: '12 min read',
      difficulty: 'Intermediate',
      content: `
        <h2>Teams Policies</h2>

        <p>
          Policies are the primary mechanism for controlling what users can and cannot do
          in Microsoft Teams. The Teams Admin Center provides several policy categories, each
          governing a specific area of functionality. Policies can be assigned at three levels:
          <strong>tenant-wide (Global/Org-wide default)</strong>, <strong>per-group</strong>,
          or <strong>per-user</strong>. Per-user assignments take the highest precedence,
          followed by group, then the global default.
        </p>

        <h3>Meeting Policies</h3>
        <p>
          Meeting policies control the behavior of meetings created by users. Key settings include:
        </p>
        <ul>
          <li><strong>Who can start instant meetings</strong> &mdash; Everyone or only organizers.</li>
          <li><strong>Allow cloud recording</strong> &mdash; When enabled, meeting organizers can record to OneDrive/SharePoint. Recordings are automatically deleted after a configurable retention period (default 120 days).</li>
          <li><strong>Allow transcription</strong> &mdash; Live transcription using speech-to-text during the meeting.</li>
          <li><strong>Lobby bypass</strong> &mdash; Determines who can skip the lobby and join directly. Options: Everyone, People in my organization, People in my organization and guests, Only organizer and co-organizers.</li>
          <li><strong>Allow IP video</strong> &mdash; Toggle whether participants can share video.</li>
          <li><strong>Screen sharing mode</strong> &mdash; Entire screen, single application, or disabled.</li>
        </ul>

        <h3>Messaging Policies</h3>
        <p>Messaging policies govern chat and channel messaging behavior:</p>
        <ul>
          <li><strong>Allow private chat</strong> &mdash; Users can send 1:1 and group chat messages.</li>
          <li><strong>Giphy content rating</strong> &mdash; Strict, Moderate, or No restriction on GIF content.</li>
          <li><strong>Allow memes and stickers</strong> &mdash; Enable or disable meme/sticker insertion.</li>
          <li><strong>Message editing</strong> &mdash; Whether users can edit sent messages.</li>
          <li><strong>Message deletion</strong> &mdash; Whether users can delete sent messages. Owners can always delete.</li>
          <li><strong>Read receipts</strong> &mdash; User controlled, on for everyone, or off for everyone.</li>
        </ul>

        <h3>App Permission Policies</h3>
        <p>
          App permission policies determine which Teams apps users can install and use.
          You can configure three categories independently:
        </p>
        <ul>
          <li><strong>Microsoft apps</strong> &mdash; Allow all, allow specific, or block specific.</li>
          <li><strong>Third-party apps</strong> &mdash; Allow all, allow specific, or block all.</li>
          <li><strong>Custom apps</strong> &mdash; Allow all or block all org-built apps.</li>
        </ul>

        <div class="callout callout--warning">
          <strong>Security Tip:</strong> For regulated industries, start by blocking all
          third-party apps, then create an allow-list of approved apps. This prevents
          unapproved data flows to external services.
        </div>

        <h3>Calling Policies</h3>
        <p>Calling policies manage Teams phone system features:</p>
        <ul>
          <li><strong>Make private calls</strong> &mdash; Allow 1:1 VOIP and PSTN calls.</li>
          <li><strong>Call forwarding</strong> &mdash; Enable forwarding to voicemail, other users, or external numbers.</li>
          <li><strong>Call groups</strong> &mdash; Allow simultaneous ring to a group of delegates.</li>
          <li><strong>Voicemail</strong> &mdash; Configure voicemail routing and transcription.</li>
        </ul>

        <h3>Assigning Policies</h3>
        <p>
          Navigate to <em>Users</em> in the Teams Admin Center, select a user, and click
          <strong>Policies</strong> to assign individual policies. For bulk assignment, use
          <strong>Group policy assignment</strong> under each policy category to assign a
          policy to a security group or M365 group. The Global (Org-wide default) policy
          applies to any user who does not have a direct or group assignment. Plan your
          policy structure carefully; excessive per-user overrides become difficult to manage
          at scale.
        </p>
      `
    },

    /* ---- Lesson 5 ---- */
    {
      id: 'guest-access',
      title: 'Guest Access',
      duration: '10 min read',
      difficulty: 'Intermediate',
      content: `
        <h2>Guest Access</h2>

        <h3>What Is Guest Access?</h3>
        <p>
          Guest access in Microsoft Teams allows you to invite people outside your
          organization to participate in teams and channels. Guests are added via
          <strong>Azure AD B2B</strong> (Business-to-Business) collaboration. When you
          add a guest, they receive an email invitation and are represented as a guest
          user object in your Azure Active Directory. Guests authenticate with their
          own identity (Microsoft account, work account, or Google account) and do not
          consume a license from your tenant.
        </p>

        <h3>Enabling Guest Access</h3>
        <p>
          Guest access is configured in the Teams Admin Center under
          <strong>Org-wide settings &gt; Guest access</strong>. The master toggle
          <em>"Allow guest access in Teams"</em> must be set to <strong>On</strong>.
          Below this toggle you can fine-tune what guests are allowed to do:
        </p>
        <ul>
          <li><strong>Make private calls</strong> &mdash; Usually disabled for guests.</li>
          <li><strong>Allow IP video</strong> &mdash; Guests can share video in meetings.</li>
          <li><strong>Screen sharing mode</strong> &mdash; Entire screen or single application.</li>
          <li><strong>Allow Meet Now</strong> &mdash; Guests can start instant meetings.</li>
          <li><strong>Edit/Delete sent messages</strong> &mdash; Control whether guests can modify messages.</li>
          <li><strong>Use Giphy, Memes, Stickers</strong> &mdash; Content controls for guest messaging.</li>
        </ul>

        <h3>Guest Capabilities vs. Limitations</h3>
        <table>
          <thead>
            <tr><th>Capability</th><th>Guest Can?</th></tr>
          </thead>
          <tbody>
            <tr><td>Join teams and channels</td><td>Yes</td></tr>
            <tr><td>Chat and post messages</td><td>Yes</td></tr>
            <tr><td>Share files</td><td>Yes</td></tr>
            <tr><td>Join meetings</td><td>Yes</td></tr>
            <tr><td>Make PSTN (phone) calls</td><td>No</td></tr>
            <tr><td>Access other teams they are not added to</td><td>No</td></tr>
            <tr><td>Create teams</td><td>No</td></tr>
            <tr><td>Use some third-party apps</td><td>Limited</td></tr>
            <tr><td>Access organizational directory</td><td>No</td></tr>
          </tbody>
        </table>

        <h3>External Access vs. Guest Access</h3>
        <div class="callout callout--info">
          <strong>Key Distinction:</strong> These are often confused but serve very
          different purposes.
        </div>
        <ul>
          <li>
            <strong>External Access (Federation)</strong> &mdash; Allows your users to chat
            and call with users in <em>other Teams/Skype organizations</em>. No guest object
            is created in your Azure AD. Users communicate from their own tenant. External
            users cannot access your teams, channels, or files.
          </li>
          <li>
            <strong>Guest Access (B2B)</strong> &mdash; Adds a specific external user as a
            guest in your Azure AD. That guest can access specific teams, channels, files,
            and conversations. They appear in your directory as a guest user.
          </li>
        </ul>

        <h3>Managing Guest Invitations</h3>
        <p>
          You can control who is allowed to invite guests in two places. In the Teams Admin
          Center under <em>Org-wide settings &gt; Guest access</em>, the master toggle
          governs whether guest access is available at all. In <strong>Azure AD &gt;
          External Identities &gt; External collaboration settings</strong>, you can
          configure whether all members, only admins, or specific roles can invite guests.
          Individual team owners can also control guest access per-team if the tenant-wide
          setting allows it.
        </p>

        <h3>Azure AD B2B Settings</h3>
        <p>
          The Azure AD B2B framework underlies Teams guest access. In the Azure portal
          under <em>Azure Active Directory &gt; External Identities</em>, you can configure
          allow/deny lists for specific domains, enable email one-time passcode authentication
          for guests who do not have a Microsoft or Google account, and set up cross-tenant
          access policies for fine-grained control over which external organizations can
          collaborate with yours.
        </p>
      `
    },

    /* ---- Lesson 6 ---- */
    {
      id: 'teams-apps-management',
      title: 'Teams Apps Management',
      duration: '8 min read',
      difficulty: 'Advanced',
      content: `
        <h2>Teams Apps Management</h2>

        <h3>The Teams App Ecosystem</h3>
        <p>
          Microsoft Teams supports a rich ecosystem of apps that extend its functionality.
          Apps can appear as personal apps, tabs in channels, messaging extensions,
          connectors, and bots. The Teams Admin Center provides centralized control over
          which apps are available to your organization and how they are surfaced to users.
          There are three categories of apps: <strong>Microsoft apps</strong> (built by
          Microsoft), <strong>third-party apps</strong> (published in the Teams Store by
          partners), and <strong>custom apps</strong> (built by your organization).
        </p>

        <h3>App Permission Policies</h3>
        <p>
          App permission policies determine which apps users can install. Navigate to
          <em>Teams apps &gt; Permission policies</em> in the Admin Center. For each
          category (Microsoft, third-party, custom), you can choose:
        </p>
        <ul>
          <li><strong>Allow all apps</strong> &mdash; Every app in that category is available.</li>
          <li><strong>Allow specific apps and block all others</strong> &mdash; Allowlist approach; only approved apps are available.</li>
          <li><strong>Block specific apps and allow all others</strong> &mdash; Blocklist approach; everything is available except explicitly blocked apps.</li>
          <li><strong>Block all apps</strong> &mdash; No apps in that category are available (third-party and custom only).</li>
        </ul>

        <div class="callout callout--warning">
          <strong>Best Practice:</strong> For organizations with compliance requirements,
          use the allowlist approach for third-party apps. Conduct a security review
          of each app&rsquo;s permissions before adding it to the approved list.
        </div>

        <h3>App Setup Policies</h3>
        <p>
          App setup policies control which apps are <strong>pinned</strong> to users&rsquo;
          Teams navigation bar (the left rail). This is a powerful way to drive adoption of
          specific line-of-business applications. Under <em>Teams apps &gt; Setup policies</em>,
          you can:
        </p>
        <ul>
          <li>Add pinned apps and arrange their order in the left rail.</li>
          <li>Allow or block users from uploading custom apps (sideloading).</li>
          <li>Allow or block users from pinning their own apps.</li>
        </ul>
        <p>
          The Global (Org-wide default) setup policy pins commonly used apps like Activity,
          Chat, Teams, Calendar, and Calling. Create custom setup policies for different
          departments (e.g., pin the Sales CRM app for the sales team).
        </p>

        <h3>Org-wide App Settings</h3>
        <p>
          Under <em>Teams apps &gt; Manage apps</em>, the <strong>Org-wide app settings</strong>
          button opens a panel where you can:
        </p>
        <ul>
          <li>Toggle <strong>third-party apps</strong> on or off for the entire organization.</li>
          <li>Toggle <strong>custom apps</strong> on or off for the entire organization.</li>
          <li>Control whether users can install apps that require <strong>resource-specific consent</strong> (RSC) permissions.</li>
        </ul>

        <h3>Publishing Custom Apps</h3>
        <p>
          Your developers can build custom Teams apps using the Teams Toolkit, Power Apps,
          or direct manifest creation. To publish a custom app to your org&rsquo;s catalog:
        </p>
        <ol>
          <li>Navigate to <em>Teams apps &gt; Manage apps</em>.</li>
          <li>Click <strong>Upload new app</strong>.</li>
          <li>Upload the <code>.zip</code> app package containing the manifest and icons.</li>
          <li>The app enters <strong>Submitted</strong> status and must be approved by an admin.</li>
          <li>Once approved, it appears in the <strong>Built for your org</strong> section of the Teams Store.</li>
        </ol>

        <h3>Security Considerations</h3>
        <p>
          Before approving any third-party app, review its <strong>permissions</strong>
          carefully. Apps may request access to user profile data, mail, files, or calendar.
          Check the publisher&rsquo;s verification status (a blue checkmark indicates
          Microsoft has verified the publisher). Use the <strong>App details</strong> page
          in the Admin Center to review permissions, data handling practices, and terms of
          use. Regularly audit installed apps and remove any that are no longer needed or
          that have had their permissions expanded in an update.
        </p>

        <blockquote>
          <strong>Admin Tip:</strong> Enable the <em>Teams app usage report</em> under
          Analytics to identify which apps are actively used and which are installed
          but unused. This helps you make informed decisions about which apps to keep
          in your approved catalog.
        </blockquote>
      `
    }
  ];

  /* ----------------------------------------------------------
     SIMULATION
     ---------------------------------------------------------- */

  var simulation = {
    title: 'Teams Admin Center Simulation',
    description: 'Practice managing teams, channels, members, and meeting policies in a simulated Teams Admin Center.',
    tasks: [
      { instruction: "Create a new team", points: 30 },
      { instruction: "View team details and members", points: 20 },
      { instruction: "Configure meeting policies", points: 25 },
      { instruction: "Manage messaging policies", points: 25 }
    ],
    render: function (container, callbacks) {
      container.innerHTML = '';

      /* --- State --- */
      var teamsData = [
        { name: 'Contoso All-Hands', type: 'Org-wide', members: 245, status: 'Active' },
        { name: 'Marketing Team', type: 'Private', members: 12, status: 'Active' },
        { name: 'IT Department', type: 'Private', members: 8, status: 'Active' },
        { name: 'Sales Squad', type: 'Public', members: 34, status: 'Active' },
        { name: 'Archived Project 2023', type: 'Private', members: 5, status: 'Archived' }
      ];

      var teamChannels = {
        'Contoso All-Hands': ['General', 'Announcements', 'Kudos'],
        'Marketing Team': ['General', 'Campaigns', 'Creative Assets'],
        'IT Department': ['General', 'Helpdesk', 'Infrastructure'],
        'Sales Squad': ['General', 'Leads', 'Demos'],
        'Archived Project 2023': ['General', 'Deliverables']
      };

      var teamMembers = {
        'Contoso All-Hands': [
          { name: 'Alex Johnson', role: 'Owner', email: 'alex@contoso.com' },
          { name: 'Maria Garcia', role: 'Owner', email: 'maria@contoso.com' },
          { name: 'James Wilson', role: 'Member', email: 'james@contoso.com' }
        ],
        'Marketing Team': [
          { name: 'Sarah Chen', role: 'Owner', email: 'sarah@contoso.com' },
          { name: 'David Kim', role: 'Owner', email: 'david@contoso.com' },
          { name: 'Emily Taylor', role: 'Member', email: 'emily@contoso.com' }
        ],
        'IT Department': [
          { name: 'Alex Johnson', role: 'Owner', email: 'alex@contoso.com' },
          { name: 'Chris Brown', role: 'Owner', email: 'chris@contoso.com' },
          { name: 'Pat Morgan', role: 'Member', email: 'pat@contoso.com' }
        ],
        'Sales Squad': [
          { name: 'Lisa Park', role: 'Owner', email: 'lisa@contoso.com' },
          { name: 'Tom Rivera', role: 'Member', email: 'tom@contoso.com' },
          { name: 'Nina Adams', role: 'Member', email: 'nina@contoso.com' }
        ],
        'Archived Project 2023': [
          { name: 'Alex Johnson', role: 'Owner', email: 'alex@contoso.com' },
          { name: 'Rachel Lee', role: 'Member', email: 'rachel@contoso.com' }
        ]
      };

      var currentNav = 'teams';
      var selectedTeam = null;

      /* --- Root layout --- */
      var sim = document.createElement('div');
      sim.className = 'sim-container';

      /* -- Header -- */
      var header = document.createElement('div');
      header.className = 'sim-header';
      header.innerHTML = '<span class="sim-header-title" style="color:#6264a7;font-weight:700;">Teams Admin Center</span>' +
        '<span style="margin-left:auto;font-size:12px;color:var(--color-text-secondary);">admin.teams.microsoft.com</span>';
      sim.appendChild(header);

      /* -- Body (sidebar + content) -- */
      var body = document.createElement('div');
      body.className = 'sim-body';

      /* Sidebar */
      var sidebar = document.createElement('div');
      sidebar.className = 'admin-panel-sidebar';
      sidebar.style.background = '#292828';

      var navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 2L2 8.5V17a1 1 0 001 1h4.5a1 1 0 001-1v-4h3v4a1 1 0 001 1H17a1 1 0 001-1V8.5L10 2z" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>' },
        { id: 'teams', label: 'Teams', icon: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>' },
        { id: 'users', label: 'Users', icon: '<svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3.5" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M3 18c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>' },
        { id: 'meetings', label: 'Meetings', icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M4.5 1v3M11.5 1v3M1.5 6.5h13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>' },
        { id: 'messaging', label: 'Messaging', icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3h12v8H5l-3 3V3z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" fill="none"/></svg>' },
        { id: 'apps', label: 'Apps', icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.2" fill="none"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.2" fill="none"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.2" fill="none"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>' }
      ];

      navItems.forEach(function (item) {
        var navEl = document.createElement('div');
        navEl.className = 'admin-panel-sidebar-item' + (item.id === currentNav ? ' active' : '');
        navEl.setAttribute('data-nav-id', item.id);
        navEl.innerHTML = item.icon + '<span>' + item.label + '</span>';
        navEl.addEventListener('click', function () {
          currentNav = item.id;
          selectedTeam = null;
          updateSidebarActive();
          renderContent();
        });
        sidebar.appendChild(navEl);
      });

      body.appendChild(sidebar);

      /* Content area */
      var content = document.createElement('div');
      content.className = 'admin-panel-content';
      body.appendChild(content);
      sim.appendChild(body);

      /* Feedback bar */
      var feedbackBar = document.createElement('div');
      feedbackBar.style.display = 'none';
      sim.appendChild(feedbackBar);

      container.appendChild(sim);

      /* --- Helpers --- */
      function updateSidebarActive() {
        var items = sidebar.querySelectorAll('.admin-panel-sidebar-item');
        items.forEach(function (el) {
          el.classList.toggle('active', el.getAttribute('data-nav-id') === currentNav);
        });
      }

      function showFeedback(message, type) {
        feedbackBar.className = 'sim-feedback sim-feedback--' + (type || 'info');
        feedbackBar.innerHTML = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 110 14A7 7 0 018 1zm0 3a.75.75 0 00-.75.75v4.5a.75.75 0 001.5 0v-4.5A.75.75 0 008 4zm0 8a.75.75 0 100-1.5.75.75 0 000 1.5z"/></svg>' +
          '<span>' + message + '</span>';
        feedbackBar.style.display = '';
        setTimeout(function () { feedbackBar.style.display = 'none'; }, 3500);
      }

      function createTooltip(element, text) {
        element.style.position = 'relative';
        element.style.cursor = 'help';
        element.title = text;
      }

      /* --- Content Renderers --- */
      function renderContent() {
        switch (currentNav) {
          case 'dashboard': renderDashboard(); break;
          case 'teams': selectedTeam ? renderTeamDetail() : renderTeamsList(); break;
          case 'users': renderUsers(); break;
          case 'meetings': renderMeetings(); break;
          case 'messaging': renderMessaging(); break;
          case 'apps': renderApps(); break;
        }
      }

      /* Dashboard */
      function renderDashboard() {
        content.innerHTML =
          '<h2>Dashboard</h2>' +
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px;margin-top:16px;">' +
            '<div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:16px;text-align:center;">' +
              '<div style="font-size:28px;font-weight:700;color:#6264a7;">304</div>' +
              '<div style="font-size:12px;color:var(--color-text-secondary);margin-top:4px;">Active Users</div>' +
            '</div>' +
            '<div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:16px;text-align:center;">' +
              '<div style="font-size:28px;font-weight:700;color:#6264a7;">1,247</div>' +
              '<div style="font-size:12px;color:var(--color-text-secondary);margin-top:4px;">Total Calls (28d)</div>' +
            '</div>' +
            '<div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:16px;text-align:center;">' +
              '<div style="font-size:28px;font-weight:700;color:#6264a7;">856</div>' +
              '<div style="font-size:12px;color:var(--color-text-secondary);margin-top:4px;">Meetings (28d)</div>' +
            '</div>' +
            '<div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:16px;text-align:center;">' +
              '<div style="font-size:28px;font-weight:700;color:#107c10;">Healthy</div>' +
              '<div style="font-size:12px;color:var(--color-text-secondary);margin-top:4px;">Service Health</div>' +
            '</div>' +
          '</div>' +
          '<div style="margin-top:24px;padding:16px;background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;">' +
            '<h3 style="font-size:14px;margin-bottom:8px;">Recent Activity</h3>' +
            '<ul style="list-style:disc;padding-left:20px;font-size:13px;color:var(--color-text-secondary);line-height:1.8;">' +
              '<li>New team "Sales Squad" created by Lisa Park &mdash; 2 hours ago</li>' +
              '<li>Guest user john@partner.com added to Marketing Team &mdash; 5 hours ago</li>' +
              '<li>"Archived Project 2023" was archived by Alex Johnson &mdash; 1 day ago</li>' +
              '<li>Meeting policy "ExecutiveMeetings" updated &mdash; 2 days ago</li>' +
            '</ul>' +
          '</div>';
      }

      /* Teams list */
      function renderTeamsList() {
        var html = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">' +
          '<h2>Manage Teams</h2>' +
          '<button class="btn btn-primary" id="sim-add-team" style="padding:6px 16px;font-size:13px;background:#6264a7;border:none;color:#fff;border-radius:4px;cursor:pointer;">+ Add Team</button>' +
          '</div>';

        html += '<table class="sim-data-table"><thead><tr>' +
          '<th>Team Name</th><th>Type</th><th>Members</th><th>Status</th>' +
          '</tr></thead><tbody>';

        teamsData.forEach(function (team, idx) {
          var badgeClass = team.status === 'Active' ? 'status-badge--active' : 'status-badge--blocked';
          html += '<tr class="sim-team-row" data-team-idx="' + idx + '" style="cursor:pointer;">' +
            '<td style="font-weight:600;color:#6264a7;">' + team.name + '</td>' +
            '<td>' + team.type + '</td>' +
            '<td>' + team.members + '</td>' +
            '<td><span class="status-badge ' + badgeClass + '">' + team.status + '</span></td>' +
            '</tr>';
        });
        html += '</tbody></table>';

        content.innerHTML = html;

        /* Add team button */
        var addBtn = content.querySelector('#sim-add-team');
        if (addBtn) {
          addBtn.addEventListener('click', function () { renderAddTeamModal(); });
        }

        /* Row clicks */
        var rows = content.querySelectorAll('.sim-team-row');
        rows.forEach(function (row) {
          row.addEventListener('click', function () {
            var idx = parseInt(row.getAttribute('data-team-idx'), 10);
            selectedTeam = teamsData[idx];
            renderTeamDetail();
          });
        });
      }

      /* Add team modal */
      function renderAddTeamModal() {
        var overlay = document.createElement('div');
        overlay.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:100;';

        var modal = document.createElement('div');
        modal.style.cssText = 'background:#fff;border-radius:8px;padding:24px;width:380px;max-width:90%;box-shadow:0 8px 28px rgba(0,0,0,0.2);';

        modal.innerHTML =
          '<h3 style="margin-bottom:16px;font-size:18px;">Create a New Team</h3>' +
          '<div class="sim-input-group">' +
            '<label for="sim-team-name">Team name</label>' +
            '<input type="text" id="sim-team-name" class="sim-input" placeholder="Enter team name">' +
          '</div>' +
          '<div class="sim-input-group">' +
            '<label for="sim-team-privacy">Privacy</label>' +
            '<select id="sim-team-privacy" class="sim-select">' +
              '<option value="Private">Private</option>' +
              '<option value="Public">Public</option>' +
              '<option value="Org-wide">Org-wide</option>' +
            '</select>' +
          '</div>' +
          '<div class="sim-input-group">' +
            '<label for="sim-team-desc">Description</label>' +
            '<textarea id="sim-team-desc" class="sim-input" style="height:60px;resize:vertical;" placeholder="Describe this team"></textarea>' +
          '</div>' +
          '<div class="sim-input-group">' +
            '<label for="sim-team-owner">Owner</label>' +
            '<input type="text" id="sim-team-owner" class="sim-input" placeholder="e.g., admin@contoso.com" value="admin@contoso.com">' +
          '</div>' +
          '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px;">' +
            '<button class="btn btn-outline" id="sim-modal-cancel" style="padding:6px 16px;font-size:13px;border:1px solid var(--color-border);border-radius:4px;cursor:pointer;background:transparent;">Cancel</button>' +
            '<button class="btn btn-primary" id="sim-modal-create" style="padding:6px 16px;font-size:13px;background:#6264a7;border:none;color:#fff;border-radius:4px;cursor:pointer;">Create Team</button>' +
          '</div>';

        overlay.appendChild(modal);

        /* Position overlay relative to sim container */
        sim.style.position = 'relative';
        sim.appendChild(overlay);

        /* Cancel */
        modal.querySelector('#sim-modal-cancel').addEventListener('click', function () {
          sim.removeChild(overlay);
        });
        overlay.addEventListener('click', function (e) {
          if (e.target === overlay) sim.removeChild(overlay);
        });

        /* Create */
        modal.querySelector('#sim-modal-create').addEventListener('click', function () {
          var nameInput = modal.querySelector('#sim-team-name');
          var name = nameInput.value.trim();
          if (!name) {
            nameInput.style.borderColor = 'var(--color-error)';
            nameInput.placeholder = 'Team name is required';
            return;
          }
          var privacy = modal.querySelector('#sim-team-privacy').value;
          var newTeam = { name: name, type: privacy, members: 1, status: 'Active' };
          teamsData.push(newTeam);
          teamChannels[name] = ['General'];
          teamMembers[name] = [
            { name: 'Admin User', role: 'Owner', email: modal.querySelector('#sim-team-owner').value || 'admin@contoso.com' }
          ];
          sim.removeChild(overlay);
          renderTeamsList();
          showFeedback('Team "' + name + '" created successfully.', 'success');
          if (callbacks && callbacks.completeSim) { callbacks.completeSim(); };
        });
      }

      /* Team detail */
      function renderTeamDetail() {
        if (!selectedTeam) { renderTeamsList(); return; }

        var team = selectedTeam;
        var channels = teamChannels[team.name] || ['General'];
        var members = teamMembers[team.name] || [];

        var html = '<div style="margin-bottom:16px;">' +
          '<button id="sim-back-teams" style="background:none;border:none;cursor:pointer;color:#6264a7;font-size:13px;display:flex;align-items:center;gap:4px;">' +
            '<svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M12.5 15l-5-5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            'Back to Teams' +
          '</button>' +
          '</div>';

        html += '<div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:20px;margin-bottom:16px;">' +
          '<h2 style="color:#6264a7;margin-bottom:4px;">' + team.name + '</h2>' +
          '<div style="display:flex;gap:16px;font-size:13px;color:var(--color-text-secondary);">' +
            '<span>Type: <strong>' + team.type + '</strong></span>' +
            '<span>Members: <strong>' + team.members + '</strong></span>' +
            '<span>Status: <strong>' + team.status + '</strong></span>' +
          '</div>' +
          '</div>';

        /* Tab bar */
        html += '<div style="display:flex;gap:0;border-bottom:2px solid var(--color-border);margin-bottom:16px;">';
        ['Members', 'Channels', 'Settings'].forEach(function (tab, i) {
          html += '<button class="sim-detail-tab" data-detail-tab="' + tab.toLowerCase() + '" style="' +
            'padding:8px 20px;font-size:13px;font-weight:600;border:none;background:none;cursor:pointer;' +
            'border-bottom:2px solid ' + (i === 0 ? '#6264a7' : 'transparent') + ';' +
            'margin-bottom:-2px;color:' + (i === 0 ? '#6264a7' : 'var(--color-text-secondary)') + ';">' + tab + '</button>';
        });
        html += '</div>';

        /* Tab content containers */
        html += '<div id="sim-detail-members">';
        html += '<table class="sim-data-table"><thead><tr><th>Name</th><th>Role</th><th>Email</th></tr></thead><tbody>';
        members.forEach(function (m) {
          html += '<tr><td>' + m.name + '</td><td><span class="status-badge ' +
            (m.role === 'Owner' ? 'status-badge--active' : 'status-badge--pending') + '">' + m.role + '</span></td>' +
            '<td>' + m.email + '</td></tr>';
        });
        html += '</tbody></table></div>';

        html += '<div id="sim-detail-channels" style="display:none;">';
        html += '<table class="sim-data-table"><thead><tr><th>Channel Name</th><th>Type</th></tr></thead><tbody>';
        channels.forEach(function (ch) {
          html += '<tr><td>' + ch + '</td><td>' + (ch === 'General' ? 'Default' : 'Standard') + '</td></tr>';
        });
        html += '</tbody></table></div>';

        html += '<div id="sim-detail-settings" style="display:none;">';
        html += '<div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:16px;">';

        var settings = [
          { id: 'allow-channels', label: 'Allow members to create and update channels', tip: 'When enabled, any member can add standard channels.', checked: true },
          { id: 'allow-delete-channels', label: 'Allow members to delete channels', tip: 'When enabled, members can remove channels they created.', checked: false },
          { id: 'allow-mentions-team', label: 'Allow @team mentions', tip: 'When enabled, users can @mention the entire team.', checked: true },
          { id: 'allow-mentions-channel', label: 'Allow @channel mentions', tip: 'When enabled, users can @mention a channel to notify all who follow it.', checked: true },
          { id: 'allow-emoji', label: 'Allow emoji, GIFs, and stickers', tip: 'Controls whether fun content is allowed in conversations.', checked: true },
          { id: 'allow-guest-create', label: 'Allow guests to create and update channels', tip: 'When enabled, guest users can add and edit channels.', checked: false }
        ];

        settings.forEach(function (s) {
          html += '<label class="sim-checkbox-label" style="margin-bottom:12px;" title="' + s.tip + '">' +
            '<input type="checkbox" ' + (s.checked ? 'checked' : '') + ' data-setting="' + s.id + '">' +
            '<span>' + s.label + '</span>' +
            '</label>';
        });

        html += '</div></div>';

        content.innerHTML = html;

        /* Back button */
        content.querySelector('#sim-back-teams').addEventListener('click', function () {
          selectedTeam = null;
          renderTeamsList();
        });

        /* Detail tabs */
        var detailTabs = content.querySelectorAll('.sim-detail-tab');
        detailTabs.forEach(function (tab) {
          tab.addEventListener('click', function () {
            var targetTab = tab.getAttribute('data-detail-tab');
            detailTabs.forEach(function (t) {
              var isActive = t.getAttribute('data-detail-tab') === targetTab;
              t.style.borderBottomColor = isActive ? '#6264a7' : 'transparent';
              t.style.color = isActive ? '#6264a7' : 'var(--color-text-secondary)';
            });
            ['members', 'channels', 'settings'].forEach(function (section) {
              var el = content.querySelector('#sim-detail-' + section);
              if (el) el.style.display = section === targetTab ? '' : 'none';
            });
          });
        });

        /* Setting toggle tooltips */
        var checkboxes = content.querySelectorAll('[data-setting]');
        checkboxes.forEach(function (cb) {
          cb.addEventListener('change', function () {
            var label = cb.closest('.sim-checkbox-label');
            var settingName = label ? label.querySelector('span').textContent : 'Setting';
            showFeedback(settingName + ': ' + (cb.checked ? 'Enabled' : 'Disabled'), 'info');
          });
        });
      }

      /* Users view */
      function renderUsers() {
        var allMembers = [];
        var seen = {};
        Object.keys(teamMembers).forEach(function (teamName) {
          teamMembers[teamName].forEach(function (m) {
            if (!seen[m.email]) {
              seen[m.email] = true;
              allMembers.push(m);
            }
          });
        });

        var html = '<h2>Users</h2>' +
          '<p style="font-size:13px;color:var(--color-text-secondary);margin:8px 0 16px;">View users and their assigned policies.</p>';

        html += '<table class="sim-data-table"><thead><tr><th>Display Name</th><th>Email</th><th>Policies</th></tr></thead><tbody>';
        allMembers.forEach(function (m) {
          html += '<tr><td>' + m.name + '</td><td>' + m.email + '</td>' +
            '<td><span class="status-badge status-badge--active">Global (Default)</span></td></tr>';
        });
        html += '</tbody></table>';
        content.innerHTML = html;
      }

      /* Meetings view */
      function renderMeetings() {
        var html = '<h2>Meeting Policies</h2>' +
          '<p style="font-size:13px;color:var(--color-text-secondary);margin:8px 0 16px;">Configure meeting behavior for your organization.</p>';

        html += '<div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:20px;">' +
          '<h3 style="font-size:15px;margin-bottom:4px;">Global (Org-wide default)</h3>' +
          '<p style="font-size:12px;color:var(--color-text-secondary);margin-bottom:16px;">This policy applies to all users unless overridden by a more specific assignment.</p>';

        var meetingSettings = [
          { id: 'cloud-recording', label: 'Allow cloud recording', tip: 'When enabled, meeting organizers can record meetings to OneDrive/SharePoint. Recordings auto-expire after the configured retention period.', checked: true },
          { id: 'transcription', label: 'Allow transcription', tip: 'Enables live speech-to-text transcription during meetings for attendees.', checked: true },
          { id: 'ip-video', label: 'Allow IP video', tip: 'When enabled, participants can turn on their cameras during meetings.', checked: true },
          { id: 'screen-share', label: 'Allow screen sharing', tip: 'Controls whether participants can share their screen during meetings.', checked: true }
        ];

        meetingSettings.forEach(function (s) {
          html += '<label class="sim-checkbox-label" style="margin-bottom:12px;" title="' + s.tip + '">' +
            '<input type="checkbox" ' + (s.checked ? 'checked' : '') + ' data-meeting-setting="' + s.id + '">' +
            '<span>' + s.label + '</span>' +
            '</label>';
        });

        html += '<div class="sim-input-group" style="margin-top:16px;">' +
          '<label for="sim-lobby" style="font-size:13px;font-weight:600;">Who can bypass the lobby?</label>' +
          '<div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:6px;">Controls which participants skip the lobby and join the meeting directly.</div>' +
          '<select id="sim-lobby" class="sim-select">' +
            '<option value="everyone">Everyone</option>' +
            '<option value="org" selected>People in my organization</option>' +
            '<option value="organizer">Only organizer and co-organizers</option>' +
          '</select>' +
          '</div>';

        html += '</div>';
        content.innerHTML = html;

        /* Meeting setting toggles */
        var meetCheckboxes = content.querySelectorAll('[data-meeting-setting]');
        meetCheckboxes.forEach(function (cb) {
          cb.addEventListener('change', function () {
            var lbl = cb.closest('.sim-checkbox-label');
            var settingText = lbl ? lbl.querySelector('span').textContent : 'Setting';
            showFeedback(settingText + ': ' + (cb.checked ? 'Enabled' : 'Disabled'), 'info');
          });
        });

        var lobbySelect = content.querySelector('#sim-lobby');
        if (lobbySelect) {
          createTooltip(lobbySelect, 'Controls which participants skip the lobby and join directly.');
          lobbySelect.addEventListener('change', function () {
            var labels = { everyone: 'Everyone', org: 'People in my organization', organizer: 'Only organizer and co-organizers' };
            showFeedback('Lobby bypass set to: ' + (labels[lobbySelect.value] || lobbySelect.value), 'success');
          });
        }
      }

      /* Messaging view */
      function renderMessaging() {
        var html = '<h2>Messaging Policies</h2>' +
          '<p style="font-size:13px;color:var(--color-text-secondary);margin:8px 0 16px;">Control messaging features for chats and channels.</p>';

        html += '<div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:20px;">' +
          '<h3 style="font-size:15px;margin-bottom:4px;">Global (Org-wide default)</h3>' +
          '<p style="font-size:12px;color:var(--color-text-secondary);margin-bottom:16px;">These settings apply to all users by default.</p>';

        var msgSettings = [
          { id: 'private-chat', label: 'Allow private chat', tip: 'Users can send 1:1 and group chat messages.', checked: true },
          { id: 'edit-messages', label: 'Allow message editing', tip: 'Users can edit messages after sending them.', checked: true },
          { id: 'delete-messages', label: 'Allow message deletion', tip: 'Users can delete their own sent messages.', checked: true },
          { id: 'giphy', label: 'Use Giphys in conversations', tip: 'Users can search for and insert animated GIFs in messages.', checked: true },
          { id: 'memes', label: 'Use memes in conversations', tip: 'Users can insert memes using the meme generator.', checked: true },
          { id: 'stickers', label: 'Use stickers in conversations', tip: 'Users can send stickers in chats and channels.', checked: true },
          { id: 'read-receipts', label: 'Read receipts', tip: 'When enabled, users see when their messages have been read.', checked: true }
        ];

        msgSettings.forEach(function (s) {
          html += '<label class="sim-checkbox-label" style="margin-bottom:12px;" title="' + s.tip + '">' +
            '<input type="checkbox" ' + (s.checked ? 'checked' : '') + ' data-msg-setting="' + s.id + '">' +
            '<span>' + s.label + '</span>' +
            '</label>';
        });

        html += '<div class="sim-input-group" style="margin-top:16px;">' +
          '<label for="sim-giphy-rating" style="font-size:13px;font-weight:600;">Giphy content rating</label>' +
          '<div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:6px;">Controls the maturity level of GIFs available to users.</div>' +
          '<select id="sim-giphy-rating" class="sim-select">' +
            '<option value="strict">Strict</option>' +
            '<option value="moderate" selected>Moderate</option>' +
            '<option value="unrestricted">No restriction</option>' +
          '</select>' +
          '</div>';

        html += '</div>';
        content.innerHTML = html;

        var msgCheckboxes = content.querySelectorAll('[data-msg-setting]');
        msgCheckboxes.forEach(function (cb) {
          cb.addEventListener('change', function () {
            var lbl = cb.closest('.sim-checkbox-label');
            var settingText = lbl ? lbl.querySelector('span').textContent : 'Setting';
            showFeedback(settingText + ': ' + (cb.checked ? 'Enabled' : 'Disabled'), 'info');
          });
        });
      }

      /* Apps view */
      function renderApps() {
        var html = '<h2>Apps Management</h2>' +
          '<p style="font-size:13px;color:var(--color-text-secondary);margin:8px 0 16px;">Manage app availability and permissions.</p>';

        html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:20px;">' +
          '<div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:16px;">' +
            '<div style="font-size:24px;font-weight:700;color:#6264a7;">47</div>' +
            '<div style="font-size:12px;color:var(--color-text-secondary);">Microsoft Apps</div>' +
          '</div>' +
          '<div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:16px;">' +
            '<div style="font-size:24px;font-weight:700;color:#6264a7;">12</div>' +
            '<div style="font-size:12px;color:var(--color-text-secondary);">Third-party Apps</div>' +
          '</div>' +
          '<div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:16px;">' +
            '<div style="font-size:24px;font-weight:700;color:#6264a7;">3</div>' +
            '<div style="font-size:12px;color:var(--color-text-secondary);">Custom Apps</div>' +
          '</div>' +
          '</div>';

        html += '<div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:20px;">' +
          '<h3 style="font-size:15px;margin-bottom:12px;">Org-wide App Settings</h3>';

        var appSettings = [
          { id: 'third-party', label: 'Allow third-party apps', tip: 'Master toggle for all third-party app availability.', checked: true },
          { id: 'custom-apps', label: 'Allow custom apps', tip: 'Master toggle for all custom/org-built app availability.', checked: true },
          { id: 'user-pin', label: 'Allow users to pin their own apps', tip: 'When enabled, users can pin additional apps to their sidebar.', checked: true }
        ];

        appSettings.forEach(function (s) {
          html += '<label class="sim-checkbox-label" style="margin-bottom:12px;" title="' + s.tip + '">' +
            '<input type="checkbox" ' + (s.checked ? 'checked' : '') + ' data-app-setting="' + s.id + '">' +
            '<span>' + s.label + '</span>' +
            '</label>';
        });

        html += '</div>';

        html += '<div style="margin-top:16px;">' +
          '<h3 style="font-size:15px;margin-bottom:8px;">Installed Apps</h3>' +
          '<table class="sim-data-table"><thead><tr><th>App Name</th><th>Publisher</th><th>Category</th><th>Status</th></tr></thead><tbody>' +
          '<tr><td>Planner</td><td>Microsoft</td><td>Productivity</td><td><span class="status-badge status-badge--active">Allowed</span></td></tr>' +
          '<tr><td>OneNote</td><td>Microsoft</td><td>Productivity</td><td><span class="status-badge status-badge--active">Allowed</span></td></tr>' +
          '<tr><td>Power BI</td><td>Microsoft</td><td>Analytics</td><td><span class="status-badge status-badge--active">Allowed</span></td></tr>' +
          '<tr><td>Trello</td><td>Atlassian</td><td>Project Management</td><td><span class="status-badge status-badge--active">Allowed</span></td></tr>' +
          '<tr><td>Polly</td><td>Polly Inc.</td><td>Surveys</td><td><span class="status-badge status-badge--active">Allowed</span></td></tr>' +
          '<tr><td>Contoso HR Bot</td><td>Contoso (Custom)</td><td>HR</td><td><span class="status-badge status-badge--pending">Review</span></td></tr>' +
          '</tbody></table></div>';

        content.innerHTML = html;

        var appCheckboxes = content.querySelectorAll('[data-app-setting]');
        appCheckboxes.forEach(function (cb) {
          cb.addEventListener('change', function () {
            var lbl = cb.closest('.sim-checkbox-label');
            var settingText = lbl ? lbl.querySelector('span').textContent : 'Setting';
            showFeedback(settingText + ': ' + (cb.checked ? 'Enabled' : 'Disabled'), cb.checked ? 'info' : 'error');
          });
        });
      }

      /* --- Initial render --- */
      renderContent();
    }
  };

  /* ----------------------------------------------------------
     QUIZ
     ---------------------------------------------------------- */

  var quiz = [
    {
      id: "teams-q1",
      question: 'What is the URL for the Teams Admin Center?',
      options: [
        'admin.microsoft.com/teams',
        'teams.microsoft.com/admin',
        'admin.teams.microsoft.com',
        'portal.azure.com/teams'
      ],
      correct: 2,
      explanation: 'The Teams Admin Center is accessed at admin.teams.microsoft.com. This is a dedicated portal separate from the main M365 Admin Center.'
    },
    {
      id: "teams-q2",
      question: 'What is the maximum number of members in an Org-wide team?',
      options: [
        '1,000',
        '5,000',
        '10,000',
        '25,000'
      ],
      correct: 2,
      explanation: 'Org-wide teams are limited to organizations with fewer than 10,000 users. All employees are automatically added as members.'
    },
    {
      id: "teams-q3",
      question: 'What is the difference between External Access and Guest Access?',
      options: [
        'There is no difference between the two',
        'External access is federation with other orgs; guest access adds specific B2B users',
        'Guest access is for employees; external access is for outside guests',
        'External access is more restrictive than guest access'
      ],
      correct: 1,
      explanation: 'External Access (federation) enables communication between Teams/Skype organizations without creating guest objects. Guest Access uses Azure AD B2B to add specific users to your directory with access to teams, channels, and files.'
    },
    {
      id: "teams-q4",
      question: 'Which channel type allows sharing with users OUTSIDE your organization?',
      options: [
        'Standard channel',
        'Private channel',
        'Shared channel',
        'Guest channel'
      ],
      correct: 2,
      explanation: 'Shared channels support cross-organization collaboration via Azure AD B2B direct connect. External users can participate without switching tenants.'
    },
    {
      id: "teams-q5",
      question: 'Where do you configure who can bypass the meeting lobby?',
      options: [
        'Meeting policies',
        'App permission policies',
        'Messaging policies',
        'Calling policies'
      ],
      correct: 0,
      explanation: 'Lobby bypass is a setting within Meeting policies. You can set it to Everyone, People in my organization, or Only organizer and co-organizers.'
    },
    {
      id: "teams-q6",
      question: 'How many team owners are recommended as a best practice?',
      options: [
        '1',
        'At least 2',
        'At least 5',
        '10'
      ],
      correct: 1,
      explanation: 'Microsoft recommends at least 2 owners per team to ensure continuity. If the sole owner leaves the organization, the team becomes orphaned and requires admin intervention.'
    },
    {
      id: "teams-q7",
      question: 'What happens when you archive a team?',
      options: [
        'All data is deleted permanently',
        'Team becomes read-only; all data is preserved',
        'Team is automatically deleted after 30 days',
        'All members are removed from the team'
      ],
      correct: 1,
      explanation: 'Archiving a team makes it read-only. All messages, files, and content are preserved and searchable, but no new posts or edits can be made. This is ideal for completed projects.'
    },
    {
      id: "teams-q8",
      question: 'Which policy controls whether users can send GIFs in chat?',
      options: [
        'Meeting policy',
        'Messaging policy',
        'App permission policy',
        'Calling policy'
      ],
      correct: 1,
      explanation: 'Messaging policies control chat and channel messaging behavior, including Giphy/GIF availability, content ratings, memes, stickers, and message editing/deletion.'
    },
    {
      id: "teams-q9",
      question: 'Can guests in Teams make PSTN (phone) calls?',
      options: [
        'Yes, guests have full calling capability',
        'No, guests cannot make PSTN calls',
        'Only with an assigned phone license',
        'Only to internal users within the organization'
      ],
      correct: 1,
      explanation: 'Guests in Teams cannot make PSTN calls. They are limited to VoIP calls, chat, file sharing, and meeting participation within the teams they have been added to.'
    },
    {
      id: "teams-q10",
      question: 'What is an App Setup Policy used for?',
      options: [
        'Blocking third-party apps from the store',
        'Pinning specific apps to the Teams navigation bar',
        'Approving app permission requests',
        'Managing automatic app updates'
      ],
      correct: 1,
      explanation: 'App Setup Policies control which apps are pinned to the Teams left rail (navigation bar) and their order. This is useful for ensuring all users in a department have quick access to key line-of-business apps.'
    }
  ];

  /* ----------------------------------------------------------
     REGISTER MODULE
     ---------------------------------------------------------- */

  window.M365App.registerModule({
    id: 'teams',
    title: 'MS Teams Administration',
    subtitle: 'Configure and manage your Teams environment',
    color: '#6264a7',
    icon: 'teams',
    lessons: lessons,
    simulation: simulation,
    quiz: quiz
  });

})();
