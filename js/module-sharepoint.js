/* ============================================================
   MODULE: SharePoint Administration
   Registers with window.M365App.registerModule()
   ============================================================ */
(function () {
  'use strict';

  /* ----------------------------------------------------------
     LESSON CONTENT (6 lessons, 400-600 words HTML each)
     ---------------------------------------------------------- */

  var lessons = [
    /* --------------------------------------------------------
       LESSON 1: SharePoint Admin Center Overview
       -------------------------------------------------------- */
    {
      id: 'sp-admin-center',
      title: 'SharePoint Admin Center Overview',
      duration: '5 min read',
      difficulty: 'Beginner',
      content: '<h3>Accessing the SharePoint Admin Center</h3>' +
        '<p>The <strong>SharePoint Admin Center</strong> is the centralized management portal for all SharePoint Online activities in your Microsoft 365 tenant. You access it by navigating to <code>[tenant]-admin.sharepoint.com</code>, where <em>[tenant]</em> is your organization\'s unique Microsoft 365 tenant name. For example, if your organization is "Contoso", the URL would be <code>contoso-admin.sharepoint.com</code>.</p>' +
        '<p>You can also reach the SharePoint Admin Center from the <strong>Microsoft 365 Admin Center</strong> by expanding <em>Admin centers</em> in the left navigation and selecting <strong>SharePoint</strong>. Only users assigned the <strong>SharePoint Administrator</strong> or <strong>Global Administrator</strong> role can access this portal.</p>' +

        '<h3>Navigation Overview</h3>' +
        '<p>The SharePoint Admin Center uses a modern, left-hand navigation panel organized into key management areas:</p>' +
        '<ul>' +
          '<li><strong>Home</strong> &mdash; A dashboard showing service health, recent activity, and quick-access cards for common tasks like creating sites and managing sharing settings.</li>' +
          '<li><strong>Sites</strong> &mdash; Contains <em>Active sites</em> (all current site collections) and <em>Deleted sites</em> (sites in the recycle bin that can be restored within 93 days).</li>' +
          '<li><strong>Policies</strong> &mdash; Configure sharing, access control, and device access policies that govern how content is shared inside and outside the organization.</li>' +
          '<li><strong>Settings</strong> &mdash; Tenant-wide settings including default storage limits, site creation permissions, notifications, and the classic settings page.</li>' +
          '<li><strong>Migration</strong> &mdash; Tools and guidance for migrating content from on-premises SharePoint, file shares, or other cloud platforms into SharePoint Online using the SharePoint Migration Tool (SPMT) or Migration Manager.</li>' +
        '</ul>' +

        '<h3>SharePoint Online vs. On-Premises</h3>' +
        '<p>SharePoint Online is the cloud-based version of SharePoint, hosted entirely in Microsoft 365. Unlike SharePoint Server (on-premises), SharePoint Online is automatically updated by Microsoft, removing the burden of patching and hardware management. However, some advanced customizations available on-premises (such as custom farm solutions) are not supported in SharePoint Online. The cloud version emphasizes modern experiences, integration with other M365 services, and a "no-code" approach using Power Platform and SharePoint Framework (SPFx).</p>' +

        '<h3>Site Collections and Storage Quotas</h3>' +
        '<p>Every SharePoint Online tenant receives a base storage allocation of <strong>1 TB plus 10 GB per licensed user</strong>. Storage is pooled across the entire tenant and allocated to individual site collections. Administrators can set per-site storage limits from the <em>Active sites</em> page or allow automatic storage management. Monitoring storage usage is critical: when a site approaches its quota, users receive warnings, and uploads may be blocked if the limit is exceeded.</p>' +

        '<h3>Service Health and Activity Reports</h3>' +
        '<p>The Home dashboard surfaces <strong>service health</strong> information pulled from the Microsoft 365 Service Health Dashboard, alerting administrators to outages or degraded performance. The <strong>Usage reports</strong> section (also available via the M365 Admin Center) provides insights into site activity, storage trends, file activity, and page views. These reports help administrators understand adoption patterns and identify underused or overloaded sites that may need attention.</p>' +

        '<div class="callout callout-info" style="background:#e8faf0;border-left:4px solid #038387;padding:12px 16px;border-radius:4px;margin-top:16px;">' +
          '<strong>Tip:</strong> Bookmark your SharePoint Admin Center URL for quick access. You can also pin it to your browser\'s favorites bar alongside the M365 Admin Center and Azure AD portal for efficient multi-portal administration.' +
        '</div>'
    },

    /* --------------------------------------------------------
       LESSON 2: Creating and Managing Sites
       -------------------------------------------------------- */
    {
      id: 'sp-creating-sites',
      title: 'Creating and Managing Sites',
      duration: '10 min read',
      difficulty: 'Beginner',
      content: '<h3>SharePoint Site Types</h3>' +
        '<p>SharePoint Online offers several site types, each designed for different collaboration scenarios:</p>' +
        '<ul>' +
          '<li><strong>Team sites (Group-connected)</strong> &mdash; Designed for internal team collaboration. When you create a modern team site, it automatically provisions a <strong>Microsoft 365 Group</strong>, which includes a shared mailbox, calendar, Planner board, and a Teams team (if Teams is connected). Team sites use a left-hand navigation and emphasize document libraries and lists.</li>' +
          '<li><strong>Communication sites</strong> &mdash; Designed for broadcasting information to a broad audience. Think company intranets, news portals, and project showcases. Communication sites are <em>not</em> connected to a Microsoft 365 Group and feature a top navigation bar with visually rich page layouts optimized for publishing.</li>' +
          '<li><strong>Hub sites</strong> &mdash; Not a distinct site template but a <em>designation</em> applied to an existing site. Hub sites aggregate content and navigation across multiple associated sites, creating a logical grouping. For example, a "Marketing Hub" might connect the Marketing Team site, Events Communication site, and Brand Guidelines site under one shared navigation and search scope.</li>' +
        '</ul>' +

        '<h3>Creating Sites from the Admin Center</h3>' +
        '<p>To create a new site, navigate to <strong>SharePoint Admin Center &gt; Active sites &gt; + Create</strong>. The wizard presents two primary options:</p>' +
        '<ol>' +
          '<li><strong>Team site</strong> &mdash; You provide a site name (which determines the URL and email alias), set privacy (Public or Private), assign owners, select a language, and optionally add a description. The URL follows the pattern <code>https://[tenant].sharepoint.com/sites/[sitename]</code>.</li>' +
          '<li><strong>Communication site</strong> &mdash; You choose from design templates (Topic, Showcase, or Blank), provide a site name, owner, and language. Communication sites are always accessible based on explicit permissions rather than group membership.</li>' +
        '</ol>' +

        '<h3>Site URL Structure</h3>' +
        '<p>By default, all new sites are created under the <code>/sites/</code> managed path: <code>https://[tenant].sharepoint.com/sites/[sitename]</code>. The root site (<code>https://[tenant].sharepoint.com</code>) is a special communication site that serves as the default landing page. You cannot delete the root site, but you can swap it with another site using the <code>Invoke-SPOSiteSwap</code> PowerShell cmdlet.</p>' +

        '<h3>Classic vs. Modern Experience</h3>' +
        '<p>Microsoft is steadily retiring the <strong>classic experience</strong> in favor of <strong>modern sites</strong>. Modern sites offer responsive design, improved performance, built-in accessibility, and integration with Microsoft 365 services. Classic sites still exist in many tenants, especially those migrated from on-premises. Administrators can control the default experience at the tenant level under <em>Settings &gt; Classic settings &gt; SharePoint Lists and Libraries experience</em>.</p>' +

        '<h3>Storage Quota Management</h3>' +
        '<p>Each site collection can have a storage limit configured individually or managed automatically by the system. To set a manual quota, select a site in <em>Active sites</em>, open its properties, and adjust the <strong>Storage limit</strong> value. Automatic management distributes the tenant pool dynamically, alerting admins when sites approach capacity. Best practice is to monitor the <strong>Storage used</strong> column regularly and archive or clean up sites that consume excessive space.</p>' +

        '<div class="callout callout-info" style="background:#e8faf0;border-left:4px solid #038387;padding:12px 16px;border-radius:4px;margin-top:16px;">' +
          '<strong>Tip:</strong> Use a consistent naming convention for site URLs (e.g., <code>/sites/dept-marketing</code>, <code>/sites/proj-alpha</code>) to keep your tenant organized and make sites easy to find in the admin center.' +
        '</div>'
    },

    /* --------------------------------------------------------
       LESSON 3: Permissions and Sharing
       -------------------------------------------------------- */
    {
      id: 'sp-permissions',
      title: 'Permissions and Sharing',
      duration: '12 min read',
      difficulty: 'Intermediate',
      content: '<h3>SharePoint Permission Levels</h3>' +
        '<p>SharePoint uses a role-based permission model. Each <strong>permission level</strong> is a named collection of individual permissions (e.g., "Add Items", "Edit Items", "Delete Items"). The built-in permission levels are:</p>' +
        '<ul>' +
          '<li><strong>Full Control</strong> &mdash; Complete administrative access including managing permissions, site settings, and all content. Assigned to Site Collection Administrators and site Owners.</li>' +
          '<li><strong>Design</strong> &mdash; Can view, add, update, delete, approve, and customize pages and document libraries. Useful for site designers who manage the look and feel.</li>' +
          '<li><strong>Edit</strong> &mdash; Can add, edit, and delete lists and documents. Similar to Contribute but also allows managing lists.</li>' +
          '<li><strong>Contribute</strong> &mdash; Can view, add, update, and delete list items and documents. Cannot create or modify lists or libraries themselves.</li>' +
          '<li><strong>Read</strong> &mdash; View-only access to pages, list items, and documents. Can also download documents.</li>' +
          '<li><strong>View Only</strong> &mdash; Can view pages and documents in the browser but <em>cannot</em> download them. Useful for sensitive content that should not leave the browser.</li>' +
        '</ul>' +

        '<h3>Default SharePoint Groups</h3>' +
        '<p>Every SharePoint site comes with three default groups that correspond to common roles:</p>' +
        '<ul>' +
          '<li><strong>[Site Name] Owners</strong> &mdash; Full Control. Manage site settings, permissions, and content. Keep this group small (2&ndash;3 people).</li>' +
          '<li><strong>[Site Name] Members</strong> &mdash; Edit permission. The primary collaborators who create and manage content daily.</li>' +
          '<li><strong>[Site Name] Visitors</strong> &mdash; Read permission. View content but cannot modify anything.</li>' +
        '</ul>' +
        '<p>For Group-connected team sites, the Microsoft 365 Group <strong>Owners</strong> map to Site Owners, and Group <strong>Members</strong> map to Site Members. This linkage means adding someone to the M365 Group also grants them SharePoint access.</p>' +

        '<h3>Breaking Permission Inheritance</h3>' +
        '<p>By default, SharePoint items, lists, folders, and subsites <strong>inherit permissions</strong> from their parent. When you <em>break inheritance</em>, you create a unique set of permissions for that specific object. This is powerful but should be used sparingly because it:</p>' +
        '<ul>' +
          '<li>Makes permission management significantly more complex</li>' +
          '<li>Can lead to "permission sprawl" that is difficult to audit</li>' +
          '<li>May cause confusion when users have inconsistent access across related content</li>' +
        '</ul>' +
        '<p>Best practice: Manage permissions at the <strong>site level</strong> using groups whenever possible. Break inheritance only when absolutely necessary (e.g., a confidential HR document in an otherwise public library).</p>' +

        '<h3>Sharing Content</h3>' +
        '<p>SharePoint provides multiple sharing mechanisms:</p>' +
        '<ul>' +
          '<li><strong>Internal sharing</strong> &mdash; Share with people inside your organization by adding them to groups or sending direct sharing links. Use "People in your organization" links for broad internal access.</li>' +
          '<li><strong>External sharing</strong> &mdash; Share with guests outside your organization (covered in detail in Lesson 4). Requires tenant-level external sharing to be enabled.</li>' +
        '</ul>' +
        '<p><strong>OneDrive sharing vs. SharePoint sharing:</strong> OneDrive for Business is technically a personal SharePoint site collection. Sharing settings for OneDrive are configured separately in the SharePoint Admin Center under <em>Policies &gt; Sharing</em>. OneDrive sharing can be more or less restrictive than SharePoint sharing, but it cannot exceed the tenant-level setting.</p>' +

        '<div class="callout callout-info" style="background:#fff4ce;border-left:4px solid #ff8c00;padding:12px 16px;border-radius:4px;margin-top:16px;">' +
          '<strong>Warning:</strong> Breaking permission inheritance is one of the most common causes of permission-related support tickets. Always document why inheritance was broken and review unique permissions periodically.' +
        '</div>'
    },

    /* --------------------------------------------------------
       LESSON 4: External Sharing Settings
       -------------------------------------------------------- */
    {
      id: 'sp-external-sharing',
      title: 'External Sharing Settings',
      duration: '10 min read',
      difficulty: 'Intermediate',
      content: '<h3>Tenant-Level Sharing Settings</h3>' +
        '<p>External sharing in SharePoint Online is controlled at <strong>two levels</strong>: the <em>tenant level</em> (organization-wide) and the <em>site level</em> (per site collection). The tenant-level setting is the <strong>most permissive boundary</strong> &mdash; no individual site can be configured to share more broadly than what the tenant allows.</p>' +
        '<p>To configure tenant-level sharing, navigate to <strong>SharePoint Admin Center &gt; Policies &gt; Sharing</strong>. You will see a slider with four levels:</p>' +

        '<h3>The Four Sharing Levels</h3>' +
        '<ol>' +
          '<li><strong>Anyone</strong> (Most Permissive) &mdash; Users can share files and folders using links that do not require sign-in. These are sometimes called "anonymous links." Anyone with the link can access the content without authenticating. This level carries the highest risk and should be paired with expiration policies and password protection.</li>' +
          '<li><strong>New and existing guests</strong> &mdash; Users can invite people outside the organization by entering their email address. The recipient must authenticate (sign in with a Microsoft account, work account, or a one-time passcode). New guest accounts are created in Azure AD automatically.</li>' +
          '<li><strong>Existing guests only</strong> &mdash; Sharing is limited to guest accounts that <em>already exist</em> in your Azure AD directory. Users cannot invite new external people; the admin must create guest accounts first.</li>' +
          '<li><strong>Only people in your organization</strong> (Most Restrictive) &mdash; External sharing is completely disabled. Content can only be shared with internal users.</li>' +
        '</ol>' +

        '<h3>Site-Level Sharing Overrides</h3>' +
        '<p>Each site collection can have its own sharing level, but it can only be <strong>equal to or more restrictive</strong> than the tenant setting. For example, if the tenant is set to "New and existing guests," an individual site can be set to "Existing guests only" or "Only people in your organization," but <em>not</em> to "Anyone."</p>' +
        '<p>To configure site-level sharing: select a site in <em>Active sites</em>, click <strong>Sharing</strong> in the toolbar (or open the site details panel), and adjust the slider for that specific site.</p>' +

        '<h3>Anonymous Links: Controls and Guardrails</h3>' +
        '<p>If "Anyone" links are enabled, administrators should configure these protective measures:</p>' +
        '<ul>' +
          '<li><strong>Link expiration</strong> &mdash; Set a maximum number of days before "Anyone" links expire (e.g., 30 days). After expiration, the link stops working and must be re-shared.</li>' +
          '<li><strong>Password protection</strong> &mdash; Require a password on "Anyone" links to add a layer of security beyond just possessing the URL.</li>' +
          '<li><strong>Permissions</strong> &mdash; Restrict "Anyone" links to <em>View only</em> (prevent editing) to limit the blast radius of accidental exposure.</li>' +
        '</ul>' +

        '<h3>Sharing Audit Logs</h3>' +
        '<p>Every sharing action in SharePoint is logged in the <strong>Microsoft Purview Compliance Portal</strong> (formerly the Security &amp; Compliance Center). Administrators can search audit logs for events like "SharingSet", "AnonymousLinkCreated", "SharingInvitationCreated", and "SharingRevoked" to track who shared what, with whom, and when. Regular audit log reviews are essential for compliance and data governance.</p>' +

        '<h3>Conditional Access Integration</h3>' +
        '<p>For advanced scenarios, SharePoint sharing can be combined with <strong>Azure AD Conditional Access policies</strong>. For example, you can require multi-factor authentication for guest users, block access from unmanaged devices, or restrict downloads from non-compliant machines. These policies add security layers on top of the sharing settings.</p>' +

        '<div class="callout callout-info" style="background:#e8faf0;border-left:4px solid #038387;padding:12px 16px;border-radius:4px;margin-top:16px;">' +
          '<strong>Tip:</strong> Start with a more restrictive tenant-level sharing setting and relax it only for specific sites that genuinely need external collaboration. This "least privilege" approach minimizes accidental data exposure.' +
        '</div>'
    },

    /* --------------------------------------------------------
       LESSON 5: Libraries, Lists, and Content Types
       -------------------------------------------------------- */
    {
      id: 'sp-libraries-lists',
      title: 'Libraries, Lists, and Content Types',
      duration: '10 min read',
      difficulty: 'Intermediate',
      content: '<h3>Document Libraries vs. Lists</h3>' +
        '<p>SharePoint stores content in two primary containers:</p>' +
        '<ul>' +
          '<li><strong>Document Libraries</strong> &mdash; Designed for storing, organizing, and managing files (documents, images, videos). Every SharePoint site includes a default "Documents" library. Libraries support features like check-out/check-in, versioning, co-authoring, and metadata columns. Think of a library as a supercharged file share with built-in governance.</li>' +
          '<li><strong>Lists</strong> &mdash; Structured data containers similar to lightweight databases or spreadsheets. Lists are composed of rows (items) and columns (fields). Common uses include task trackers, issue logs, event calendars, contacts, and custom business applications. Microsoft Lists (the standalone app) is built on the same SharePoint list infrastructure.</li>' +
        '</ul>' +

        '<h3>Columns and Metadata</h3>' +
        '<p>Both libraries and lists use <strong>columns</strong> to capture metadata about each item. SharePoint provides several column types:</p>' +
        '<ul>' +
          '<li><strong>Single line of text / Multiple lines of text</strong> &mdash; Free-form text fields for names, descriptions, and notes.</li>' +
          '<li><strong>Choice</strong> &mdash; A dropdown or radio-button selection from predefined values (e.g., "Status: Draft, In Review, Published").</li>' +
          '<li><strong>Person or Group</strong> &mdash; A people picker that resolves against Azure AD. Useful for assigning owners, reviewers, or responsible parties.</li>' +
          '<li><strong>Date and Time</strong> &mdash; Date picker with optional time component. Supports calculated date formulas.</li>' +
          '<li><strong>Lookup</strong> &mdash; References a column in another list, creating a relationship between lists (similar to a foreign key in databases).</li>' +
          '<li><strong>Number / Currency</strong> &mdash; Numeric values with formatting and min/max validation.</li>' +
          '<li><strong>Yes/No</strong> &mdash; A simple boolean checkbox field.</li>' +
        '</ul>' +

        '<h3>Content Types</h3>' +
        '<p>A <strong>content type</strong> is a reusable collection of columns, workflows, and settings that defines the structure and behavior of a category of content. For example, a "Project Proposal" content type might include columns for Project Name, Budget, Start Date, and Sponsor, along with an approval workflow and a specific document template (.dotx).</p>' +
        '<p>Content types can be defined at the <strong>site level</strong> (available within one site) or in the <strong>Content Type Hub</strong> (published across the entire tenant). This ensures consistency: every library that uses the "Project Proposal" content type will have the same columns and behaviors, regardless of which site it lives in.</p>' +

        '<h3>Versioning</h3>' +
        '<p>SharePoint supports two types of versioning:</p>' +
        '<ul>' +
          '<li><strong>Major versions</strong> (1.0, 2.0, 3.0) &mdash; Each save creates a new whole-number version. Enabled by default in document libraries.</li>' +
          '<li><strong>Minor versions</strong> (1.1, 1.2, 2.1) &mdash; Draft versions that are only visible to users with Edit permission. Useful for content approval workflows where drafts should not be visible to readers until published.</li>' +
        '</ul>' +
        '<p>Administrators can set <strong>version limits</strong> (e.g., keep only the last 500 major versions) to manage storage consumption. Unlimited versioning can cause storage bloat over time.</p>' +

        '<h3>Check-Out / Check-In</h3>' +
        '<p><strong>Check-out</strong> locks a document so only one user can edit it at a time, preventing conflicting changes. After editing, the user <strong>checks in</strong> the document, optionally providing a comment describing the changes. While co-authoring has largely replaced check-out for Office documents, check-out is still valuable for non-Office files (PDFs, CAD drawings) where simultaneous editing is not supported.</p>' +

        '<div class="callout callout-info" style="background:#e8faf0;border-left:4px solid #038387;padding:12px 16px;border-radius:4px;margin-top:16px;">' +
          '<strong>Tip:</strong> Use content types from the Content Type Hub to enforce consistent metadata across your entire organization. This dramatically improves search relevance and compliance reporting.' +
        '</div>'
    },

    /* --------------------------------------------------------
       LESSON 6: Governance and Compliance
       -------------------------------------------------------- */
    {
      id: 'sp-governance',
      title: 'Governance and Compliance',
      duration: '12 min read',
      difficulty: 'Advanced',
      content: '<h3>Hub Sites for Organization and Branding</h3>' +
        '<p><strong>Hub sites</strong> are the backbone of SharePoint governance at scale. A hub site acts as a central connection point for related sites, providing:</p>' +
        '<ul>' +
          '<li><strong>Shared navigation</strong> &mdash; Associated sites inherit a common top navigation bar, making it easy for users to move between related sites.</li>' +
          '<li><strong>Unified search scope</strong> &mdash; Searching from a hub site returns results from all associated sites, enabling cross-site content discovery.</li>' +
          '<li><strong>Consistent branding</strong> &mdash; Themes, logos, and header configurations propagate from the hub to its associated sites.</li>' +
          '<li><strong>News aggregation</strong> &mdash; The hub site can display news posts published on any associated site, creating a unified news feed.</li>' +
        '</ul>' +
        '<p>To register a hub site, go to <strong>Active sites</strong>, select a site, and click <strong>Hub &gt; Register as hub site</strong>. Sites can then be <em>associated</em> with the hub from their own site settings or from the admin center.</p>' +

        '<h3>Site Lifecycle Management</h3>' +
        '<p>Over time, organizations accumulate hundreds or thousands of SharePoint sites. Without lifecycle management, inactive sites consume storage, confuse users, and create compliance risks. Key practices include:</p>' +
        '<ul>' +
          '<li><strong>Activity reports</strong> &mdash; Review site activity in the admin center to identify sites with no activity in the last 90+ days.</li>' +
          '<li><strong>Storage alerts</strong> &mdash; Configure alerts for sites approaching their storage quota to prevent disruptions.</li>' +
          '<li><strong>Site closure and deletion policies</strong> &mdash; Implement a process for archiving or deleting inactive sites. Deleted sites go to the site collection recycle bin and can be restored within 93 days.</li>' +
          '<li><strong>Microsoft 365 Group expiration policies</strong> &mdash; For Group-connected team sites, Azure AD Group expiration policies can automatically prompt owners to renew or allow groups (and their associated sites) to expire.</li>' +
        '</ul>' +

        '<h3>Data Loss Prevention (DLP) Policies</h3>' +
        '<p><strong>DLP policies</strong> in Microsoft Purview can scan SharePoint content for sensitive information such as credit card numbers, Social Security numbers, health records, and other regulated data. When a policy detects sensitive content, it can:</p>' +
        '<ul>' +
          '<li>Display a <strong>policy tip</strong> warning the user</li>' +
          '<li><strong>Block sharing</strong> of the document externally</li>' +
          '<li>Send an <strong>incident report</strong> to compliance administrators</li>' +
          '<li>Require the user to provide a <strong>business justification</strong> before overriding the policy</li>' +
        '</ul>' +

        '<h3>Sensitivity Labels and Information Protection</h3>' +
        '<p><strong>Sensitivity labels</strong> from Microsoft Purview Information Protection can be applied to SharePoint sites and individual documents. At the <em>site level</em>, a sensitivity label controls the site\'s privacy (Public/Private), external sharing behavior, and access from unmanaged devices. At the <em>document level</em>, labels can encrypt content, add watermarks, and restrict actions like copy/paste or printing.</p>' +

        '<h3>Audit Log Searches</h3>' +
        '<p>The <strong>Microsoft Purview Compliance Portal</strong> provides comprehensive audit logging for SharePoint activity. Administrators can search for events such as file access, modifications, deletions, sharing changes, permission changes, and site settings modifications. Audit logs are retained for 90 days (standard) or up to 10 years with advanced licensing (E5 or Audit Add-on). Regular audit reviews are a cornerstone of compliance programs.</p>' +

        '<h3>Microsoft Purview Integration</h3>' +
        '<p>SharePoint integrates deeply with the broader <strong>Microsoft Purview</strong> suite for governance:</p>' +
        '<ul>' +
          '<li><strong>Retention labels and policies</strong> &mdash; Automatically retain or delete SharePoint content based on age, sensitivity, or content type.</li>' +
          '<li><strong>Records management</strong> &mdash; Declare SharePoint documents as records that cannot be modified or deleted until the retention period expires.</li>' +
          '<li><strong>eDiscovery</strong> &mdash; Search, hold, and export SharePoint content for legal investigations.</li>' +
          '<li><strong>Data lifecycle management</strong> &mdash; Automate the entire content lifecycle from creation to disposition.</li>' +
        '</ul>' +

        '<div class="callout callout-info" style="background:#e8faf0;border-left:4px solid #038387;padding:12px 16px;border-radius:4px;margin-top:16px;">' +
          '<strong>Tip:</strong> Governance is not a one-time setup &mdash; schedule quarterly reviews of your sharing policies, site activity, storage usage, and DLP reports to maintain a healthy and compliant SharePoint environment.' +
        '</div>'
    }
  ];


  /* ----------------------------------------------------------
     SIMULATION: SharePoint Admin Center - Active Sites
     ---------------------------------------------------------- */

  var simulation = {
    title: 'SharePoint Admin Center: Active Sites',
    description: 'Explore the SharePoint Admin Center interface. Create new sites, view site details and permissions, and configure external sharing policies.',
    tasks: [
      { instruction: "Create a new SharePoint site", points: 30 },
      { instruction: "View site details and permissions", points: 20 },
      { instruction: "Navigate the admin sidebar", points: 25 },
      { instruction: "Configure sharing policies", points: 25 }
    ],
    render: function (container, callbacks) {
      // ---- State ----
      var currentNav = 'active-sites';
      var wizardOpen = false;
      var wizardStep = 1;
      var detailOpen = false;
      var detailSite = null;
      var detailTab = 'info';

      var sites = [
        { name: 'Contoso Intranet', type: 'Communication', url: '/sites/intranet', storageUsed: 12, storageTotal: 25, members: 156, privacy: 'Public' },
        { name: 'IT Team Site', type: 'Team', url: '/sites/IT', storageUsed: 4.2, storageTotal: 25, members: 8, privacy: 'Private' },
        { name: 'HR Policies', type: 'Communication', url: '/sites/HR', storageUsed: 2.1, storageTotal: 25, members: 67, privacy: 'Public' },
        { name: 'Project Alpha', type: 'Team', url: '/sites/projectalpha', storageUsed: 8.5, storageTotal: 25, members: 15, privacy: 'Private' },
        { name: 'Marketing Hub', type: 'Hub', url: '/sites/marketing', storageUsed: 18, storageTotal: 25, members: 89, privacy: 'Public' }
      ];

      var wizardData = { type: '', name: '', url: '', description: '', language: 'English', privacy: 'Public', timezone: '(UTC-05:00) Eastern Time', owners: '' };

      var tenantSharingLevel = 2; // 0=Anyone,1=New+existing guests,2=Existing guests,3=Only org
      var sharingLabels = ['Anyone', 'New and existing guests', 'Existing guests only', 'Only people in your organization'];
      var sharingDescriptions = [
        'Users can share files and folders using links that don\'t require sign-in. People with existing guest accounts can also be invited.',
        'Users can invite new guest users by email. Guest users must sign in or provide a verification code.',
        'Only guest users already in your organization\'s directory can access shared content.',
        'No external sharing is allowed. Content can only be shared with people inside your organization.'
      ];

      var siteSharingOverrides = {
        '/sites/intranet': 3,
        '/sites/IT': 3,
        '/sites/HR': 3,
        '/sites/projectalpha': 2,
        '/sites/marketing': 2
      };

      // ---- Color constants ----
      var TEAL = '#038387';
      var TEAL_LIGHT = '#e8faf0';
      var TEAL_DARK = '#025c5e';

      // ---- Helper: create element ----
      function el(tag, attrs, children) {
        var node = document.createElement(tag);
        if (attrs) {
          Object.keys(attrs).forEach(function (key) {
            if (key === 'style' && typeof attrs[key] === 'object') {
              Object.keys(attrs[key]).forEach(function (prop) { node.style[prop] = attrs[key][prop]; });
            } else if (key === 'className') {
              node.className = attrs[key];
            } else if (key.indexOf('on') === 0) {
              node.addEventListener(key.slice(2).toLowerCase(), attrs[key]);
            } else {
              node.setAttribute(key, attrs[key]);
            }
          });
        }
        if (children !== undefined && children !== null) {
          if (Array.isArray(children)) {
            children.forEach(function (c) { if (c) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
          } else if (typeof children === 'string') {
            node.innerHTML = children;
          } else {
            node.appendChild(children);
          }
        }
        return node;
      }

      // ---- Render engine ----
      function render() {
        container.innerHTML = '';
        container.style.cssText = 'display:flex;height:600px;border:1px solid #edebe9;border-radius:8px;overflow:hidden;background:#f3f2f1;font-family:Segoe UI,system-ui,sans-serif;font-size:14px;color:#323130;';

        // Left Nav
        var nav = el('div', { style: { width: '220px', minWidth: '220px', background: '#fff', borderRight: '1px solid #edebe9', display: 'flex', flexDirection: 'column', padding: '0' } });

        // Nav header
        var navHeader = el('div', { style: { padding: '16px 20px', borderBottom: '1px solid #edebe9' } });
        navHeader.appendChild(el('div', { style: { fontSize: '13px', color: '#605e5c', marginBottom: '2px' } }, 'SharePoint'));
        navHeader.appendChild(el('div', { style: { fontSize: '16px', fontWeight: '600', color: TEAL } }, 'admin center'));
        nav.appendChild(navHeader);

        var navItems = [
          { id: 'home', label: 'Home', icon: '\u2302' },
          { id: 'active-sites', label: 'Active sites', icon: '\u25A3' },
          { id: 'deleted-sites', label: 'Deleted sites', icon: '\u2716' },
          { id: 'policies', label: 'Policies', icon: '\u2637' },
          { id: 'settings', label: 'Settings', icon: '\u2699' },
          { id: 'migration', label: 'Migration', icon: '\u21C4' }
        ];

        var navList = el('div', { style: { padding: '8px 0', flex: '1' } });
        navItems.forEach(function (item) {
          var isActive = item.id === currentNav;
          var navBtn = el('button', {
            style: {
              display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 20px',
              background: isActive ? TEAL_LIGHT : 'transparent', color: isActive ? TEAL_DARK : '#323130',
              border: 'none', cursor: 'pointer', fontSize: '14px', textAlign: 'left',
              borderLeft: isActive ? '3px solid ' + TEAL : '3px solid transparent', fontWeight: isActive ? '600' : '400'
            },
            onClick: function () {
              if (item.id === 'active-sites' || item.id === 'policies') {
                currentNav = item.id;
                wizardOpen = false;
                detailOpen = false;
                render();
              }
            }
          });
          navBtn.appendChild(el('span', { style: { fontSize: '16px', width: '20px', textAlign: 'center' } }, item.icon));
          navBtn.appendChild(el('span', null, item.label));
          navBtn.addEventListener('mouseenter', function () { if (!isActive) navBtn.style.background = '#f3f2f1'; });
          navBtn.addEventListener('mouseleave', function () { if (!isActive) navBtn.style.background = 'transparent'; });
          navList.appendChild(navBtn);
        });
        nav.appendChild(navList);

        // Main content area
        var main = el('div', { style: { flex: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden' } });

        if (currentNav === 'active-sites') {
          renderActiveSites(main);
        } else if (currentNav === 'policies') {
          renderPolicies(main);
        }

        container.appendChild(nav);
        container.appendChild(main);

        // Wizard overlay
        if (wizardOpen) {
          renderWizardOverlay(container);
        }

        // Detail panel
        if (detailOpen && detailSite) {
          renderDetailPanel(container);
        }
      }

      // ---- Active Sites View ----
      function renderActiveSites(main) {
        // Toolbar
        var toolbar = el('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px', background: '#fff', borderBottom: '1px solid #edebe9' } });
        toolbar.appendChild(el('h2', { style: { fontSize: '20px', fontWeight: '600', margin: '0', flex: '1' } }, 'Active sites'));

        var createBtn = el('button', {
          style: {
            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
            background: TEAL, color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer',
            fontSize: '14px', fontWeight: '600'
          },
          onClick: function () {
            wizardOpen = true;
            wizardStep = 1;
            wizardData = { type: '', name: '', url: '', description: '', language: 'English', privacy: 'Public', timezone: '(UTC-05:00) Eastern Time', owners: '' };
            render();
          }
        }, '+ Create');
        createBtn.addEventListener('mouseenter', function () { createBtn.style.background = TEAL_DARK; });
        createBtn.addEventListener('mouseleave', function () { createBtn.style.background = TEAL; });
        toolbar.appendChild(createBtn);
        main.appendChild(toolbar);

        // Info bar
        var infoBar = el('div', { style: { padding: '10px 24px', background: TEAL_LIGHT, borderBottom: '1px solid #edebe9', fontSize: '13px', color: TEAL_DARK } });
        infoBar.innerHTML = '<strong>' + sites.length + ' sites</strong> &middot; Total storage used: ' +
          sites.reduce(function (a, s) { return a + s.storageUsed; }, 0).toFixed(1) +
          ' GB of ' + (sites.length * 25) + ' GB allocated';
        main.appendChild(infoBar);

        // Table
        var tableWrap = el('div', { style: { flex: '1', overflow: 'auto', padding: '0' } });
        var table = el('table', { style: { width: '100%', borderCollapse: 'collapse', background: '#fff' } });

        // Header
        var thead = el('thead');
        var headerRow = el('tr', { style: { borderBottom: '2px solid #edebe9', background: '#faf9f8' } });
        ['Site name', 'Type', 'URL', 'Storage', 'Members', 'Privacy'].forEach(function (h) {
          headerRow.appendChild(el('th', { style: { padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#605e5c', textTransform: 'uppercase', letterSpacing: '0.5px' } }, h));
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Body
        var tbody = el('tbody');
        sites.forEach(function (site) {
          var row = el('tr', {
            style: { borderBottom: '1px solid #edebe9', cursor: 'pointer', transition: 'background 0.15s' },
            onClick: function () {
              detailOpen = true;
              detailSite = site;
              detailTab = 'info';
              render();
            }
          });
          row.addEventListener('mouseenter', function () { row.style.background = '#f3f2f1'; });
          row.addEventListener('mouseleave', function () { row.style.background = '#fff'; });

          // Site name
          row.appendChild(el('td', { style: { padding: '12px 14px', fontWeight: '600', color: TEAL } }, site.name));

          // Type badge
          var typeColors = { 'Communication': '#0078d4', 'Team': '#5b5fc7', 'Hub': '#038387' };
          var typeBadge = el('td', { style: { padding: '12px 14px' } });
          typeBadge.appendChild(el('span', { style: {
            display: 'inline-block', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600',
            background: typeColors[site.type] ? typeColors[site.type] + '18' : '#f3f2f1',
            color: typeColors[site.type] || '#323130'
          } }, site.type));
          row.appendChild(typeBadge);

          // URL
          row.appendChild(el('td', { style: { padding: '12px 14px', fontFamily: 'Consolas,monospace', fontSize: '13px', color: '#605e5c' } }, site.url));

          // Storage bar
          var storageCell = el('td', { style: { padding: '12px 14px' } });
          var storagePercent = Math.round((site.storageUsed / site.storageTotal) * 100);
          var storageBarColor = storagePercent > 80 ? '#d13438' : storagePercent > 60 ? '#ff8c00' : TEAL;
          storageCell.appendChild(el('div', { style: { fontSize: '12px', marginBottom: '4px', color: '#605e5c' } }, site.storageUsed + ' GB / ' + site.storageTotal + ' GB'));
          var barOuter = el('div', { style: { width: '100px', height: '6px', background: '#edebe9', borderRadius: '3px', overflow: 'hidden' } });
          barOuter.appendChild(el('div', { style: { width: storagePercent + '%', height: '100%', background: storageBarColor, borderRadius: '3px', transition: 'width 0.3s' } }));
          storageCell.appendChild(barOuter);
          row.appendChild(storageCell);

          // Members
          row.appendChild(el('td', { style: { padding: '12px 14px', color: '#605e5c' } }, site.members + ' members'));

          // Privacy
          var privacyIcon = site.privacy === 'Private' ? '\uD83D\uDD12' : '\uD83C\uDF10';
          row.appendChild(el('td', { style: { padding: '12px 14px' } }, privacyIcon + ' ' + site.privacy));

          tbody.appendChild(row);
        });
        table.appendChild(tbody);
        tableWrap.appendChild(table);
        main.appendChild(tableWrap);
      }

      // ---- Policies View ----
      function renderPolicies(main) {
        var toolbar = el('div', { style: { display: 'flex', alignItems: 'center', padding: '16px 24px', background: '#fff', borderBottom: '1px solid #edebe9' } });
        toolbar.appendChild(el('h2', { style: { fontSize: '20px', fontWeight: '600', margin: '0' } }, 'External Sharing Policies'));
        main.appendChild(toolbar);

        var content = el('div', { style: { flex: '1', overflow: 'auto', padding: '24px' } });

        // Tenant-level sharing
        var tenantCard = el('div', { style: { background: '#fff', borderRadius: '8px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } });
        tenantCard.appendChild(el('h3', { style: { fontSize: '16px', fontWeight: '600', marginBottom: '16px' } }, 'Tenant-Level Sharing'));
        tenantCard.appendChild(el('p', { style: { fontSize: '13px', color: '#605e5c', marginBottom: '16px' } }, 'This setting defines the most permissive sharing level for all SharePoint sites in your organization.'));

        // Slider
        var sliderWrap = el('div', { style: { marginBottom: '16px' } });
        var sliderTrack = el('div', { style: { position: 'relative', height: '40px', display: 'flex', alignItems: 'center' } });
        var trackLine = el('div', { style: { position: 'absolute', left: '0', right: '0', top: '50%', transform: 'translateY(-50%)', height: '4px', background: '#edebe9', borderRadius: '2px' } });
        sliderTrack.appendChild(trackLine);

        for (var si = 0; si < 4; si++) {
          (function (idx) {
            var dot = el('button', {
              style: {
                position: 'absolute', left: (idx * 33.33) + '%', top: '50%', transform: 'translate(-50%,-50%)',
                width: idx === tenantSharingLevel ? '20px' : '14px', height: idx === tenantSharingLevel ? '20px' : '14px',
                borderRadius: '50%', border: idx === tenantSharingLevel ? '3px solid ' + TEAL : '2px solid #8a8886',
                background: idx === tenantSharingLevel ? TEAL : '#fff', cursor: 'pointer', zIndex: '1', transition: 'all 0.2s'
              },
              title: sharingLabels[idx],
              onClick: function () {
                tenantSharingLevel = idx;
                // Adjust site overrides that are more permissive
                Object.keys(siteSharingOverrides).forEach(function (url) {
                  if (siteSharingOverrides[url] < idx) {
                    siteSharingOverrides[url] = idx;
                  }
                });
                render();
              }
            });
            sliderTrack.appendChild(dot);
          })(si);
        }
        sliderWrap.appendChild(sliderTrack);

        // Labels
        var labelRow = el('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#605e5c', marginTop: '4px' } });
        labelRow.appendChild(el('span', { style: { textAlign: 'left', flex: '1' } }, 'Most permissive'));
        labelRow.appendChild(el('span', { style: { textAlign: 'right', flex: '1' } }, 'Least permissive'));
        sliderWrap.appendChild(labelRow);

        tenantCard.appendChild(sliderWrap);

        // Current level display
        var levelDisplay = el('div', { style: { padding: '12px 16px', background: TEAL_LIGHT, borderRadius: '6px', borderLeft: '4px solid ' + TEAL } });
        levelDisplay.appendChild(el('div', { style: { fontWeight: '600', marginBottom: '4px', color: TEAL_DARK } }, sharingLabels[tenantSharingLevel]));
        levelDisplay.appendChild(el('div', { style: { fontSize: '13px', color: '#605e5c' } }, sharingDescriptions[tenantSharingLevel]));
        tenantCard.appendChild(levelDisplay);

        content.appendChild(tenantCard);

        // Site-level overrides
        var sitesCard = el('div', { style: { background: '#fff', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } });
        sitesCard.appendChild(el('h3', { style: { fontSize: '16px', fontWeight: '600', marginBottom: '8px' } }, 'Site-Level Sharing Overrides'));
        sitesCard.appendChild(el('p', { style: { fontSize: '13px', color: '#605e5c', marginBottom: '16px' } }, 'Individual sites can be set to a more restrictive sharing level than the tenant setting, but never more permissive.'));

        var siteTable = el('table', { style: { width: '100%', borderCollapse: 'collapse' } });
        var stHead = el('thead');
        var stHRow = el('tr', { style: { borderBottom: '2px solid #edebe9', background: '#faf9f8' } });
        ['Site', 'URL', 'Sharing Level', 'Restriction'].forEach(function (h) {
          stHRow.appendChild(el('th', { style: { padding: '8px 12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#605e5c', textTransform: 'uppercase' } }, h));
        });
        stHead.appendChild(stHRow);
        siteTable.appendChild(stHead);

        var stBody = el('tbody');
        sites.forEach(function (site) {
          var siteLevel = siteSharingOverrides[site.url] !== undefined ? siteSharingOverrides[site.url] : tenantSharingLevel;
          var row = el('tr', { style: { borderBottom: '1px solid #edebe9' } });
          row.appendChild(el('td', { style: { padding: '10px 12px', fontWeight: '600' } }, site.name));
          row.appendChild(el('td', { style: { padding: '10px 12px', fontFamily: 'Consolas,monospace', fontSize: '13px', color: '#605e5c' } }, site.url));

          // Sharing level dropdown
          var selectCell = el('td', { style: { padding: '10px 12px' } });
          var select = el('select', {
            style: { padding: '6px 10px', borderRadius: '4px', border: '1px solid #8a8886', fontSize: '13px', cursor: 'pointer', background: '#fff' }
          });
          for (var i = tenantSharingLevel; i < 4; i++) {
            var opt = el('option', { value: String(i) }, sharingLabels[i]);
            if (i === siteLevel) opt.selected = true;
            select.appendChild(opt);
          }
          (function (siteUrl) {
            select.addEventListener('change', function () {
              siteSharingOverrides[siteUrl] = parseInt(this.value, 10);
              render();
            });
          })(site.url);
          selectCell.appendChild(select);
          row.appendChild(selectCell);

          // Visual indicator
          var indicatorCell = el('td', { style: { padding: '10px 12px' } });
          var restrictionColors = ['#d13438', '#ff8c00', '#038387', '#107c10'];
          var restrictionLabels = ['Open', 'Moderate', 'Restricted', 'Internal Only'];
          var indicatorDot = el('span', { style: {
            display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', marginRight: '8px',
            background: restrictionColors[siteLevel]
          } });
          indicatorCell.appendChild(indicatorDot);
          indicatorCell.appendChild(el('span', { style: { fontSize: '13px', color: restrictionColors[siteLevel], fontWeight: '600' } }, restrictionLabels[siteLevel]));
          row.appendChild(indicatorCell);

          stBody.appendChild(row);
        });
        siteTable.appendChild(stBody);
        sitesCard.appendChild(siteTable);

        content.appendChild(sitesCard);
        main.appendChild(content);
      }

      // ---- Create Site Wizard ----
      function renderWizardOverlay(parent) {
        var overlay = el('div', {
          style: {
            position: 'absolute', top: '0', left: '0', right: '0', bottom: '0',
            background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '200'
          },
          onClick: function (e) { if (e.target === overlay) { wizardOpen = false; render(); } }
        });

        var dialog = el('div', {
          style: {
            background: '#fff', borderRadius: '8px', width: '520px', maxHeight: '90%', overflow: 'auto',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)', padding: '0'
          }
        });
        dialog.addEventListener('click', function (e) { e.stopPropagation(); });

        // Dialog header
        var header = el('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #edebe9' } });
        header.appendChild(el('h3', { style: { fontSize: '18px', fontWeight: '600', margin: '0' } }, 'Create a site'));

        // Step indicator
        var steps = el('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } });
        for (var s = 1; s <= 3; s++) {
          var stepDot = el('div', { style: {
            width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: '600',
            background: s === wizardStep ? TEAL : s < wizardStep ? '#107c10' : '#edebe9',
            color: s <= wizardStep ? '#fff' : '#605e5c'
          } }, s < wizardStep ? '\u2713' : String(s));
          steps.appendChild(stepDot);
          if (s < 3) steps.appendChild(el('div', { style: { width: '20px', height: '2px', background: s < wizardStep ? '#107c10' : '#edebe9' } }));
        }
        header.appendChild(steps);

        var closeBtn = el('button', {
          style: { width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '18px', color: '#605e5c' },
          onClick: function () { wizardOpen = false; render(); }
        }, '\u00D7');
        closeBtn.addEventListener('mouseenter', function () { closeBtn.style.background = '#f3f2f1'; });
        closeBtn.addEventListener('mouseleave', function () { closeBtn.style.background = 'transparent'; });
        header.appendChild(closeBtn);
        dialog.appendChild(header);

        // Body
        var body = el('div', { style: { padding: '24px' } });

        if (wizardStep === 1) {
          body.appendChild(el('p', { style: { marginBottom: '20px', color: '#605e5c' } }, 'Choose the type of site you want to create:'));

          var cardRow = el('div', { style: { display: 'flex', gap: '16px' } });

          // Team site card
          var teamCard = el('button', {
            style: {
              flex: '1', padding: '24px 16px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer',
              border: wizardData.type === 'Team' ? '2px solid ' + TEAL : '2px solid #edebe9',
              background: wizardData.type === 'Team' ? TEAL_LIGHT : '#fff', transition: 'all 0.2s'
            },
            onClick: function () { wizardData.type = 'Team'; render(); }
          });
          teamCard.addEventListener('mouseenter', function () { if (wizardData.type !== 'Team') teamCard.style.borderColor = '#8a8886'; });
          teamCard.addEventListener('mouseleave', function () { if (wizardData.type !== 'Team') teamCard.style.borderColor = '#edebe9'; });
          teamCard.appendChild(el('div', { style: { fontSize: '36px', marginBottom: '8px' } }, '\uD83D\uDC65'));
          teamCard.appendChild(el('div', { style: { fontWeight: '600', fontSize: '15px', marginBottom: '6px' } }, 'Team site'));
          teamCard.appendChild(el('div', { style: { fontSize: '12px', color: '#605e5c' } }, 'Collaborate with your team. Includes M365 Group, shared mailbox, and calendar.'));
          cardRow.appendChild(teamCard);

          // Communication site card
          var commCard = el('button', {
            style: {
              flex: '1', padding: '24px 16px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer',
              border: wizardData.type === 'Communication' ? '2px solid ' + TEAL : '2px solid #edebe9',
              background: wizardData.type === 'Communication' ? TEAL_LIGHT : '#fff', transition: 'all 0.2s'
            },
            onClick: function () { wizardData.type = 'Communication'; render(); }
          });
          commCard.addEventListener('mouseenter', function () { if (wizardData.type !== 'Communication') commCard.style.borderColor = '#8a8886'; });
          commCard.addEventListener('mouseleave', function () { if (wizardData.type !== 'Communication') commCard.style.borderColor = '#edebe9'; });
          commCard.appendChild(el('div', { style: { fontSize: '36px', marginBottom: '8px' } }, '\uD83D\uDCE2'));
          commCard.appendChild(el('div', { style: { fontWeight: '600', fontSize: '15px', marginBottom: '6px' } }, 'Communication site'));
          commCard.appendChild(el('div', { style: { fontSize: '12px', color: '#605e5c' } }, 'Share news and information with a broad audience. Great for intranets and portals.'));
          cardRow.appendChild(commCard);

          body.appendChild(cardRow);

        } else if (wizardStep === 2) {
          body.appendChild(el('p', { style: { marginBottom: '20px', color: '#605e5c' } }, 'Enter the details for your new ' + wizardData.type.toLowerCase() + ' site:'));

          // Site name
          var nameLabel = el('label', { style: { display: 'block', fontWeight: '600', marginBottom: '4px', fontSize: '13px' } }, 'Site name *');
          body.appendChild(nameLabel);
          var nameInput = el('input', {
            type: 'text', placeholder: 'e.g., Engineering Team',
            style: { width: '100%', padding: '8px 12px', border: '1px solid #8a8886', borderRadius: '4px', fontSize: '14px', marginBottom: '6px', boxSizing: 'border-box' }
          });
          nameInput.value = wizardData.name;
          nameInput.addEventListener('input', function () {
            wizardData.name = this.value;
            wizardData.url = '/sites/' + this.value.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            urlPreview.textContent = 'https://contoso.sharepoint.com' + wizardData.url;
          });
          body.appendChild(nameInput);

          // URL preview
          var urlPreview = el('div', { style: { fontSize: '12px', color: '#605e5c', marginBottom: '16px', fontFamily: 'Consolas,monospace' } },
            wizardData.name ? 'https://contoso.sharepoint.com' + wizardData.url : 'https://contoso.sharepoint.com/sites/...');
          body.appendChild(urlPreview);

          // Description
          body.appendChild(el('label', { style: { display: 'block', fontWeight: '600', marginBottom: '4px', fontSize: '13px' } }, 'Description'));
          var descInput = el('textarea', {
            placeholder: 'Describe the purpose of this site...',
            style: { width: '100%', padding: '8px 12px', border: '1px solid #8a8886', borderRadius: '4px', fontSize: '14px', marginBottom: '16px', height: '60px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }
          });
          descInput.value = wizardData.description;
          descInput.addEventListener('input', function () { wizardData.description = this.value; });
          body.appendChild(descInput);

          // Language
          body.appendChild(el('label', { style: { display: 'block', fontWeight: '600', marginBottom: '4px', fontSize: '13px' } }, 'Language'));
          var langSelect = el('select', { style: { width: '100%', padding: '8px 12px', border: '1px solid #8a8886', borderRadius: '4px', fontSize: '14px', marginBottom: '16px', boxSizing: 'border-box' } });
          ['English', 'Spanish', 'French', 'German', 'Japanese', 'Portuguese'].forEach(function (lang) {
            var opt = el('option', { value: lang }, lang);
            if (lang === wizardData.language) opt.selected = true;
            langSelect.appendChild(opt);
          });
          langSelect.addEventListener('change', function () { wizardData.language = this.value; });
          body.appendChild(langSelect);

        } else if (wizardStep === 3) {
          body.appendChild(el('p', { style: { marginBottom: '20px', color: '#605e5c' } }, 'Configure privacy and ownership settings:'));

          // Privacy
          body.appendChild(el('label', { style: { display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '13px' } }, 'Privacy'));
          var privacyRow = el('div', { style: { display: 'flex', gap: '12px', marginBottom: '20px' } });

          ['Public', 'Private'].forEach(function (p) {
            var pBtn = el('button', {
              style: {
                flex: '1', padding: '12px', borderRadius: '6px', textAlign: 'center', cursor: 'pointer',
                border: wizardData.privacy === p ? '2px solid ' + TEAL : '2px solid #edebe9',
                background: wizardData.privacy === p ? TEAL_LIGHT : '#fff', fontSize: '14px', fontWeight: '600'
              },
              onClick: function () { wizardData.privacy = p; render(); }
            });
            pBtn.appendChild(el('div', { style: { fontSize: '20px', marginBottom: '4px' } }, p === 'Public' ? '\uD83C\uDF10' : '\uD83D\uDD12'));
            pBtn.appendChild(el('div', null, p));
            pBtn.appendChild(el('div', { style: { fontSize: '12px', fontWeight: '400', color: '#605e5c', marginTop: '4px' } },
              p === 'Public' ? 'Anyone in the organization can access' : 'Only members can access'));
            privacyRow.appendChild(pBtn);
          });
          body.appendChild(privacyRow);

          // Time zone
          body.appendChild(el('label', { style: { display: 'block', fontWeight: '600', marginBottom: '4px', fontSize: '13px' } }, 'Time zone'));
          var tzSelect = el('select', { style: { width: '100%', padding: '8px 12px', border: '1px solid #8a8886', borderRadius: '4px', fontSize: '14px', marginBottom: '16px', boxSizing: 'border-box' } });
          ['(UTC-08:00) Pacific Time', '(UTC-07:00) Mountain Time', '(UTC-06:00) Central Time', '(UTC-05:00) Eastern Time', '(UTC+00:00) UTC', '(UTC+01:00) Central European Time'].forEach(function (tz) {
            var opt = el('option', { value: tz }, tz);
            if (tz === wizardData.timezone) opt.selected = true;
            tzSelect.appendChild(opt);
          });
          tzSelect.addEventListener('change', function () { wizardData.timezone = this.value; });
          body.appendChild(tzSelect);

          // Owners
          body.appendChild(el('label', { style: { display: 'block', fontWeight: '600', marginBottom: '4px', fontSize: '13px' } }, 'Site owners'));
          var ownersInput = el('input', {
            type: 'text', placeholder: 'e.g., admin@contoso.com',
            style: { width: '100%', padding: '8px 12px', border: '1px solid #8a8886', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }
          });
          ownersInput.value = wizardData.owners;
          ownersInput.addEventListener('input', function () { wizardData.owners = this.value; });
          body.appendChild(ownersInput);

          // Summary
          if (wizardData.name) {
            var summary = el('div', { style: { marginTop: '20px', padding: '14px 16px', background: '#faf9f8', borderRadius: '6px', border: '1px solid #edebe9' } });
            summary.appendChild(el('div', { style: { fontWeight: '600', marginBottom: '8px', fontSize: '13px' } }, 'Summary'));
            summary.innerHTML += '<div style="font-size:13px;color:#605e5c;line-height:1.6">' +
              '<strong>Name:</strong> ' + wizardData.name + '<br>' +
              '<strong>Type:</strong> ' + wizardData.type + '<br>' +
              '<strong>URL:</strong> https://contoso.sharepoint.com' + wizardData.url + '<br>' +
              '<strong>Privacy:</strong> ' + wizardData.privacy + '<br>' +
              '<strong>Time Zone:</strong> ' + wizardData.timezone +
              '</div>';
            body.appendChild(summary);
          }
        }

        dialog.appendChild(body);

        // Footer
        var footer = el('div', { style: { display: 'flex', justifyContent: 'space-between', padding: '16px 24px', borderTop: '1px solid #edebe9' } });
        var cancelBtn = el('button', {
          style: { padding: '8px 20px', borderRadius: '4px', border: '1px solid #8a8886', background: '#fff', fontSize: '14px', cursor: 'pointer' },
          onClick: function () { wizardOpen = false; render(); }
        }, 'Cancel');
        footer.appendChild(cancelBtn);

        var btnRow = el('div', { style: { display: 'flex', gap: '8px' } });
        if (wizardStep > 1) {
          var prevBtn = el('button', {
            style: { padding: '8px 20px', borderRadius: '4px', border: '1px solid #8a8886', background: '#fff', fontSize: '14px', cursor: 'pointer' },
            onClick: function () { wizardStep--; render(); }
          }, 'Back');
          btnRow.appendChild(prevBtn);
        }

        if (wizardStep < 3) {
          var canNext = (wizardStep === 1 && wizardData.type) || (wizardStep === 2 && wizardData.name);
          var nextBtn = el('button', {
            style: {
              padding: '8px 20px', borderRadius: '4px', border: 'none', fontSize: '14px', cursor: canNext ? 'pointer' : 'default',
              background: canNext ? TEAL : '#edebe9', color: canNext ? '#fff' : '#a19f9d', fontWeight: '600'
            },
            onClick: function () { if (canNext) { wizardStep++; render(); } }
          }, 'Next');
          btnRow.appendChild(nextBtn);
        } else {
          var canFinish = wizardData.name && wizardData.type;
          var finishBtn = el('button', {
            style: {
              padding: '8px 20px', borderRadius: '4px', border: 'none', fontSize: '14px', cursor: canFinish ? 'pointer' : 'default',
              background: canFinish ? '#107c10' : '#edebe9', color: canFinish ? '#fff' : '#a19f9d', fontWeight: '600'
            },
            onClick: function () {
              if (!canFinish) return;
              // Add site
              sites.push({
                name: wizardData.name,
                type: wizardData.type,
                url: wizardData.url,
                storageUsed: 0,
                storageTotal: 25,
                members: 1,
                privacy: wizardData.privacy
              });
              siteSharingOverrides[wizardData.url] = tenantSharingLevel;
              wizardOpen = false;

              // Show success then re-render
              render();
              // Add a brief success banner
              var successBanner = el('div', {
                style: {
                  position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)',
                  background: '#107c10', color: '#fff', padding: '12px 24px', borderRadius: '6px',
                  fontWeight: '600', fontSize: '14px', zIndex: '300', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }
              });
              successBanner.appendChild(el('span', null, '\u2713'));
              successBanner.appendChild(el('span', null, 'Site "' + wizardData.name + '" created successfully!'));
              container.style.position = 'relative';
              container.appendChild(successBanner);
              setTimeout(function () { if (successBanner.parentNode) successBanner.parentNode.removeChild(successBanner); }, 3000);
              if (callbacks && callbacks.completeSim) { callbacks.completeSim(); }
            }
          }, 'Create site');
          btnRow.appendChild(finishBtn);
        }

        footer.appendChild(btnRow);
        dialog.appendChild(footer);
        overlay.appendChild(dialog);
        parent.appendChild(overlay);
      }

      // ---- Detail Panel ----
      function renderDetailPanel(parent) {
        var overlay = el('div', {
          style: {
            position: 'absolute', top: '0', left: '0', right: '0', bottom: '0',
            background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'flex-end', zIndex: '200'
          },
          onClick: function (e) { if (e.target === overlay) { detailOpen = false; render(); } }
        });

        var panel = el('div', {
          style: {
            width: '420px', background: '#fff', height: '100%', overflowY: 'auto',
            boxShadow: '-4px 0 16px rgba(0,0,0,0.1)', padding: '0'
          }
        });
        panel.addEventListener('click', function (e) { e.stopPropagation(); });

        // Panel header
        var pHeader = el('div', { style: { padding: '20px 24px', borderBottom: '1px solid #edebe9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } });
        pHeader.appendChild(el('h3', { style: { fontSize: '18px', fontWeight: '600', margin: '0', color: TEAL } }, detailSite.name));
        var closeDetail = el('button', {
          style: { width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '18px', color: '#605e5c' },
          onClick: function () { detailOpen = false; render(); }
        }, '\u00D7');
        pHeader.appendChild(closeDetail);
        panel.appendChild(pHeader);

        // Tabs
        var tabBar = el('div', { style: { display: 'flex', borderBottom: '1px solid #edebe9' } });
        ['info', 'permissions', 'sharing'].forEach(function (tab) {
          var tabBtn = el('button', {
            style: {
              flex: '1', padding: '12px', fontSize: '13px', fontWeight: '600', textAlign: 'center', cursor: 'pointer',
              color: detailTab === tab ? TEAL : '#605e5c',
              borderBottom: detailTab === tab ? '2px solid ' + TEAL : '2px solid transparent',
              background: 'transparent', textTransform: 'capitalize'
            },
            onClick: function () { detailTab = tab; render(); }
          }, tab === 'info' ? 'Site Info' : tab === 'permissions' ? 'Permissions' : 'Sharing');
          tabBar.appendChild(tabBtn);
        });
        panel.appendChild(tabBar);

        var pBody = el('div', { style: { padding: '20px 24px' } });

        if (detailTab === 'info') {
          // URL
          pBody.appendChild(el('div', { style: { marginBottom: '16px' } }, [
            el('div', { style: { fontSize: '12px', fontWeight: '600', color: '#605e5c', marginBottom: '4px', textTransform: 'uppercase' } }, 'URL'),
            el('div', { style: { fontFamily: 'Consolas,monospace', fontSize: '13px', color: TEAL } }, 'https://contoso.sharepoint.com' + detailSite.url)
          ]));

          // Type
          pBody.appendChild(el('div', { style: { marginBottom: '16px' } }, [
            el('div', { style: { fontSize: '12px', fontWeight: '600', color: '#605e5c', marginBottom: '4px', textTransform: 'uppercase' } }, 'Site Type'),
            el('div', { style: { fontSize: '14px' } }, detailSite.type + ' site')
          ]));

          // Storage
          var storagePercent = Math.round((detailSite.storageUsed / detailSite.storageTotal) * 100);
          var storageBarColor = storagePercent > 80 ? '#d13438' : storagePercent > 60 ? '#ff8c00' : TEAL;
          pBody.appendChild(el('div', { style: { marginBottom: '16px' } }, [
            el('div', { style: { fontSize: '12px', fontWeight: '600', color: '#605e5c', marginBottom: '4px', textTransform: 'uppercase' } }, 'Storage'),
            el('div', { style: { fontSize: '14px', marginBottom: '6px' } }, detailSite.storageUsed + ' GB of ' + detailSite.storageTotal + ' GB used (' + storagePercent + '%)')
          ]));
          var sBar = el('div', { style: { width: '100%', height: '8px', background: '#edebe9', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' } });
          sBar.appendChild(el('div', { style: { width: storagePercent + '%', height: '100%', background: storageBarColor, borderRadius: '4px' } }));
          pBody.appendChild(sBar);

          // Created date
          pBody.appendChild(el('div', { style: { marginBottom: '16px' } }, [
            el('div', { style: { fontSize: '12px', fontWeight: '600', color: '#605e5c', marginBottom: '4px', textTransform: 'uppercase' } }, 'Created'),
            el('div', { style: { fontSize: '14px' } }, 'January 15, 2024')
          ]));

          // Primary admin
          pBody.appendChild(el('div', { style: { marginBottom: '16px' } }, [
            el('div', { style: { fontSize: '12px', fontWeight: '600', color: '#605e5c', marginBottom: '4px', textTransform: 'uppercase' } }, 'Primary Admin'),
            el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
              el('div', { style: { width: '28px', height: '28px', borderRadius: '50%', background: TEAL, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600' } }, 'AB'),
              el('div', null, [
                el('div', { style: { fontSize: '14px', fontWeight: '600' } }, 'Alex Brown'),
                el('div', { style: { fontSize: '12px', color: '#605e5c' } }, 'alex.brown@contoso.com')
              ])
            ])
          ]));

          // Privacy
          pBody.appendChild(el('div', { style: { marginBottom: '0' } }, [
            el('div', { style: { fontSize: '12px', fontWeight: '600', color: '#605e5c', marginBottom: '4px', textTransform: 'uppercase' } }, 'Privacy'),
            el('div', { style: { fontSize: '14px' } }, (detailSite.privacy === 'Private' ? '\uD83D\uDD12 ' : '\uD83C\uDF10 ') + detailSite.privacy)
          ]));

        } else if (detailTab === 'permissions') {
          // Mock user groups
          var groups = [
            { name: 'Owners', level: 'Full Control', members: [
              { initials: 'AB', name: 'Alex Brown', email: 'alex.brown@contoso.com' },
              { initials: 'JD', name: 'Jane Doe', email: 'jane.doe@contoso.com' }
            ]},
            { name: 'Members', level: 'Edit', members: [
              { initials: 'MS', name: 'Mike Smith', email: 'mike.smith@contoso.com' },
              { initials: 'LW', name: 'Lisa Wang', email: 'lisa.wang@contoso.com' },
              { initials: 'RJ', name: 'Raj Patel', email: 'raj.patel@contoso.com' }
            ]},
            { name: 'Visitors', level: 'Read', members: [
              { initials: 'SC', name: 'Sarah Chen', email: 'sarah.chen@contoso.com' },
              { initials: 'TK', name: 'Tom Kim', email: 'tom.kim@contoso.com' }
            ]}
          ];

          groups.forEach(function (group) {
            var groupSection = el('div', { style: { marginBottom: '20px' } });
            var groupHeader = el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } });
            groupHeader.appendChild(el('div', null, [
              el('span', { style: { fontWeight: '600', fontSize: '14px' } }, detailSite.name + ' ' + group.name),
              el('span', { style: { fontSize: '12px', color: '#605e5c', marginLeft: '8px' } }, '(' + group.level + ')')
            ]));
            groupSection.appendChild(groupHeader);

            group.members.forEach(function (member) {
              var memberRow = el('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid #f3f2f1' } });
              var colors = ['#0078d4', '#5b5fc7', '#038387', '#d13438', '#8764b8', '#ff8c00'];
              var colorIdx = (member.initials.charCodeAt(0) + member.initials.charCodeAt(1)) % colors.length;
              memberRow.appendChild(el('div', { style: { width: '32px', height: '32px', borderRadius: '50%', background: colors[colorIdx], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600', flexShrink: '0' } }, member.initials));
              memberRow.appendChild(el('div', { style: { flex: '1', minWidth: '0' } }, [
                el('div', { style: { fontSize: '14px', fontWeight: '500' } }, member.name),
                el('div', { style: { fontSize: '12px', color: '#605e5c' } }, member.email)
              ]));
              groupSection.appendChild(memberRow);
            });

            pBody.appendChild(groupSection);
          });

          // Add members button
          var addBtn = el('button', {
            style: {
              display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
              border: '1px solid ' + TEAL, color: TEAL, borderRadius: '4px', fontSize: '13px',
              fontWeight: '600', cursor: 'pointer', background: 'transparent'
            }
          }, '+ Add members');
          addBtn.addEventListener('mouseenter', function () { addBtn.style.background = TEAL_LIGHT; });
          addBtn.addEventListener('mouseleave', function () { addBtn.style.background = 'transparent'; });
          addBtn.addEventListener('click', function () {
            var msg = el('div', { style: { padding: '12px', background: TEAL_LIGHT, borderRadius: '6px', border: '1px solid ' + TEAL, marginTop: '12px', fontSize: '13px', color: TEAL_DARK } },
              'In the real SharePoint Admin Center, this would open a people picker to add members to the selected group.');
            pBody.appendChild(msg);
            setTimeout(function () { if (msg.parentNode) msg.parentNode.removeChild(msg); }, 3000);
          });
          pBody.appendChild(addBtn);

        } else if (detailTab === 'sharing') {
          var siteLevel = siteSharingOverrides[detailSite.url] !== undefined ? siteSharingOverrides[detailSite.url] : tenantSharingLevel;

          pBody.appendChild(el('p', { style: { fontSize: '13px', color: '#605e5c', marginBottom: '16px' } },
            'Control how content in this site can be shared. The site-level setting cannot be more permissive than the tenant-level setting.'));

          // Tenant level info
          pBody.appendChild(el('div', { style: { padding: '10px 14px', background: '#faf9f8', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', border: '1px solid #edebe9' } }, [
            el('div', { style: { fontWeight: '600', marginBottom: '2px' } }, 'Tenant-level setting:'),
            el('div', { style: { color: '#605e5c' } }, sharingLabels[tenantSharingLevel])
          ]));

          // Site sharing dropdown
          pBody.appendChild(el('label', { style: { display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '13px' } }, 'Sharing level for this site'));

          var siteSelect = el('select', {
            style: { width: '100%', padding: '8px 12px', border: '1px solid #8a8886', borderRadius: '4px', fontSize: '14px', marginBottom: '16px', boxSizing: 'border-box' }
          });
          for (var i = tenantSharingLevel; i < 4; i++) {
            var opt = el('option', { value: String(i) }, sharingLabels[i]);
            if (i === siteLevel) opt.selected = true;
            siteSelect.appendChild(opt);
          }
          siteSelect.addEventListener('change', function () {
            siteSharingOverrides[detailSite.url] = parseInt(this.value, 10);
            render();
          });
          pBody.appendChild(siteSelect);

          // Explanation
          var explanation = el('div', { style: { padding: '14px 16px', background: TEAL_LIGHT, borderRadius: '6px', borderLeft: '4px solid ' + TEAL } });
          explanation.appendChild(el('div', { style: { fontWeight: '600', marginBottom: '4px', color: TEAL_DARK, fontSize: '13px' } }, sharingLabels[siteLevel]));
          explanation.appendChild(el('div', { style: { fontSize: '13px', color: '#605e5c' } }, sharingDescriptions[siteLevel]));
          pBody.appendChild(explanation);

          // Sharing levels explanation
          pBody.appendChild(el('h4', { style: { fontSize: '14px', fontWeight: '600', marginTop: '24px', marginBottom: '12px' } }, 'All Sharing Levels Explained'));
          sharingLabels.forEach(function (label, idx) {
            var isCurrentSite = idx === siteLevel;
            var isDisabled = idx < tenantSharingLevel;
            var levelCard = el('div', { style: {
              padding: '10px 14px', marginBottom: '8px', borderRadius: '6px', fontSize: '13px',
              border: isCurrentSite ? '2px solid ' + TEAL : '1px solid #edebe9',
              background: isCurrentSite ? TEAL_LIGHT : isDisabled ? '#faf9f8' : '#fff',
              opacity: isDisabled ? '0.5' : '1'
            } });
            levelCard.appendChild(el('div', { style: { fontWeight: '600', marginBottom: '2px' } }, [
              el('span', null, label),
              isCurrentSite ? el('span', { style: { marginLeft: '8px', fontSize: '11px', color: TEAL, background: TEAL + '20', padding: '1px 6px', borderRadius: '4px' } }, 'CURRENT') : null,
              isDisabled ? el('span', { style: { marginLeft: '8px', fontSize: '11px', color: '#d13438' } }, '(blocked by tenant)') : null
            ].filter(Boolean)));
            levelCard.appendChild(el('div', { style: { color: '#605e5c' } }, sharingDescriptions[idx]));
            pBody.appendChild(levelCard);
          });
        }

        panel.appendChild(pBody);
        overlay.appendChild(panel);
        parent.appendChild(overlay);
      }

      // ---- Initial render ----
      container.style.position = 'relative';
      render();
    }
  };


  /* ----------------------------------------------------------
     QUIZ (10 questions)
     ---------------------------------------------------------- */

  var quiz = [
    {
      id: "sp-q1",
      question: 'What is the URL format for the SharePoint Admin Center?',
      options: [
        'admin.sharepoint.com',
        '[tenant].sharepoint.com/admin',
        '[tenant]-admin.sharepoint.com',
        'portal.azure.com/sharepoint'
      ],
      correct: 2,
      explanation: 'The SharePoint Admin Center uses the format [tenant]-admin.sharepoint.com, where [tenant] is your organization\'s Microsoft 365 tenant name. For example: contoso-admin.sharepoint.com.'
    },
    {
      id: "sp-q2",
      question: 'Which SharePoint site type is best for a company intranet/news site?',
      options: [
        'Team site',
        'Communication site',
        'Hub site',
        'Classic site'
      ],
      correct: 1,
      explanation: 'Communication sites are designed for broadcasting information to a broad audience and are ideal for company intranets, news portals, and project showcases. They feature visually rich page layouts optimized for publishing.'
    },
    {
      id: "sp-q3",
      question: 'What are the three default SharePoint permission groups?',
      options: [
        'Admins, Users, Guests',
        'Owners, Members, Visitors',
        'Full Control, Edit, Read',
        'Global, Local, External'
      ],
      correct: 1,
      explanation: 'Every SharePoint site includes three default groups: Owners (Full Control), Members (Edit), and Visitors (Read). These groups align with common collaboration roles.'
    },
    {
      id: "sp-q4",
      question: 'What does "breaking permission inheritance" mean?',
      options: [
        'Deleting all permissions',
        'Setting unique permissions on a site/list/item separate from its parent',
        'Blocking all external access',
        'Removing admin rights'
      ],
      correct: 1,
      explanation: 'Breaking permission inheritance means assigning unique permissions to a specific item, list, or site that differ from its parent. This should be used sparingly as it increases management complexity.'
    },
    {
      id: "sp-q5",
      question: 'What is the MOST permissive SharePoint sharing setting?',
      options: [
        'Only people in your org',
        'Existing guests',
        'New and existing guests',
        'Anyone (anonymous links)'
      ],
      correct: 3,
      explanation: 'The "Anyone" setting is the most permissive, allowing files and folders to be shared using links that do not require authentication. Anyone with the link can access the content.'
    },
    {
      id: "sp-q6",
      question: 'A site-level sharing setting can be MORE permissive than the tenant setting. True or False?',
      options: [
        'True',
        'False',
        'Only for hub sites',
        'Only for communication sites'
      ],
      correct: 1,
      explanation: 'False. A site-level sharing setting can only be equal to or more restrictive than the tenant-level setting. The tenant setting defines the most permissive boundary for all sites.'
    },
    {
      id: "sp-q7",
      question: 'What is a Hub site in SharePoint?',
      options: [
        'A type of document library',
        'A site that aggregates and connects related sites',
        'A SharePoint admin account',
        'An external sharing portal'
      ],
      correct: 1,
      explanation: 'A Hub site is a designation applied to an existing SharePoint site that allows it to aggregate content, navigation, and search across multiple associated sites, creating a logical grouping.'
    },
    {
      id: "sp-q8",
      question: 'What does versioning in SharePoint allow you to do?',
      options: [
        'Delete old files automatically',
        'Restore previous versions of a document',
        'Share files externally',
        'Compress storage'
      ],
      correct: 1,
      explanation: 'Versioning allows you to track changes and restore previous versions of documents. SharePoint supports both major versions (1.0, 2.0) and minor/draft versions (1.1, 1.2).'
    },
    {
      id: "sp-q9",
      question: 'Where do you find SharePoint audit logs for compliance review?',
      options: [
        'SharePoint Admin Center > Reports',
        'Microsoft Purview Compliance Portal',
        'Teams Admin Center',
        'M365 Admin Center > Reports'
      ],
      correct: 1,
      explanation: 'SharePoint audit logs are found in the Microsoft Purview Compliance Portal (formerly the Security & Compliance Center). Administrators can search for file access, sharing changes, permission modifications, and other events.'
    },
    {
      id: "sp-q10",
      question: 'What is a Content Type in SharePoint?',
      options: [
        'A type of file format',
        'A reusable set of columns and settings that can be applied to lists and libraries',
        'A permission level',
        'A site template'
      ],
      correct: 1,
      explanation: 'A Content Type is a reusable collection of columns, workflows, and settings that defines the structure and behavior of a category of content. Content types ensure consistency across lists and libraries throughout the organization.'
    }
  ];


  /* ----------------------------------------------------------
     REGISTER MODULE
     ---------------------------------------------------------- */

  window.M365App = window.M365App || {};
  window.M365App.registerModule = window.M365App.registerModule || function () {};

  window.M365App.registerModule({
    id: 'sharepoint',
    title: 'SharePoint Administration',
    subtitle: 'Manage SharePoint sites, permissions, and governance',
    color: '#038387',
    icon: 'sharepoint',
    lessons: lessons,
    simulation: simulation,
    quiz: quiz
  });

})();
