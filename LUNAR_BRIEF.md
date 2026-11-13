# Lunar — product brief

Factual brief for a brochure branded **Lunar**. Drawn from the Angular app (`asset-management-frontend-angular`) and the NestJS API (`assets-management-backend`) as of 6 October 2026. Nothing below is a measured customer outcome unless the code computes it.

The browser tab title is already `Lunar` (`src/index.html`). The sign-in mark and splash image are still the Rikiel logo (`assets/logo/rikielR.svg`). User-access and laptop-allocation PDFs are written around an organization named APCER (user types such as `ApcerUser`, a field named `APCERNetworkVPNAccess`). Treat APCER as the organization the forms were built for, and Lunar as the product name for this brochure.

---

## 1. What it is

Lunar is an internal IT operations app for a company that owns computers and related equipment across offices. IT administrators register hardware and software, assign it to employees, watch warranties, run physical stock checks, and handle IT support tickets. Employees who are not in IT can see the equipment assigned to them, raise tickets, and submit Windows access requests. The signed-in person’s role and module permissions decide which of those screens appear.

## 2. The problem it replaces

The code does not describe a previous tool or quote time spent on manual work. The records and PDFs show which paper-style steps the product now stores:

- **Equipment register.** Each item has a code, serial, purchase order, vendor, branch, and a status of in pool, assigned, down, or scrap. Before a system like this, that register lived outside the app. [INFERRED from the asset fields; the prior system is not named in code.]
- **Laptop handover checklist.** `POST /allocation-form` renders a PDF with hostname, serial, model, keyboard, mouse, headphone, extra monitor, Ahmedabad or Delhi, new versus replacement, courier versus office pickup, a long system checklist, a business-user signature, and an IT engineer name. The Angular app never calls this endpoint. The PDF is the digital copy of a handover sheet.
- **Windows access form.** A User Access Management (UAM) request captures people, email, share drives, VPN, mailbox handover, and signature blocks for the requester, head of department, IT head, and data-protection designee, plus IT dates for Active Directory deactivation and deletion. That is a multi-party approval form, stored as a record and a PDF.
- **IT intake channels.** A ticket records how the call arrived: Chat, Phone, Email, or Walk-in, and whether it is an Incident or a Request. The app keeps the request, assignee, status, and chat in one place.
- **Floor check.** An audit snapshots the assets in chosen departments of a branch. A Level 2 user assigned to that audit scans items from a mobile API. Unscanned items can be marked missing when the audit is closed.
- **Spec capture.** A logged-in Level 1 or Level 2 user can post a system-information payload (manufacturer, serial, OS, CPU, memory) to `/exe-agent`. Promoting that scan creates a laptop, PC, or server asset so those specs do not have to be typed. The desktop agent itself is not in these repositories.

## 3. Roles and personas

Three roles, stored as `level1`, `level2`, and `level3` (`src/common/Enums/index.ts`). The user form labels them:

| Role | Screen label | Who they are in the product |
| --- | --- | --- |
| `level1` | Level 1 — “Admin user with full access to all modules.” | IT administrator. Permission checks always pass. Sees **Dashboard** and **Report**. Can create users, delete assets, delete tickets, and reset passwords. |
| `level2` | Level 2 — “Super admin whose permissions can be customized per module.” | IT operator. Each module can be Full, Read / Write, Read, or N/A. Signup refuses to let Level 2 create Level 1 or Level 2 users. This is the role assigned to run a physical audit and to scan assets. Active Directory login, when used, maps listed admin usernames to Level 2. |
| `level3` | Level 3 — “User who is not part of the IT department.” | Employee. Signup grants UAM create/view/update, ticket create/view/update, and asset view. They see **Home**, their own tickets, UAM requests they created or are assigned, and their own profile. They do not get the admin dashboard. |

**Module permissions** (create, view, update, delete) exist for Asset, Ticket, User, UAM, Vendor, Branch, Department, and Audit. The UI collapses those into **Full**, **Read / Write**, **Read**, or **N/A**. An extra flag, `UAMNoCreate`, is what the API requires to assign a UAM number.

Level 1 is forced to every permission. Level 2 is configured per person. Level 3’s signup set is fixed on the server even if the form sends something else.

## 4. Features and where they live

Routes below are the Angular paths. Guards are in `src/app/app.routing.ts`.

### Dashboard — `/dashboard`

Level 1 only. One screen of fleet health: total assets, a status bar and donut (in pool, assigned, down, scrap), warranty and AMC counts, open ticket counts, a coverage table, assets by branch, the last 10 assets created, users by branch, and people whose accounts were created this calendar week with whether they already have equipment.

**Benefit:** An administrator sees allocation, coverage risk, and new joiners without opening each module.

### Home — `/home`

Everyone who is not Level 1. A welcome line, cards for the modules that person may open (with totals and a create button when they can create), a banner if one of their assets has warranty or AMC expired or ending within 30 days, and a grid of “My allocated assets.”

**Benefit:** An employee or IT operator lands on the work they are allowed to do, and on the equipment in their name.

### Assets — `/asset`, `/asset/create`, `/asset/edit/:id`, `/asset/:id`, `/asset/scanned`

Anyone with an asset permission. The list is search and filter, with print-QR and a manage sheet (assign, return to pool, move to down, move to scrap). Create/edit is a form; laptops, PCs, and servers store nested hardware specs. The detail page shows identity, specs, a QR code, and a timeline. **Scanned** (`/asset/scanned`) is in the Asset submenu for Level 1 and lists hardware payloads waiting to be turned into assets.

**Benefit:** IT knows what exists, who holds it, and what happened to it. A printed QR ties a physical item to its record (the code encodes the database id).

### Tickets — `/ticket`, `/ticket/create`, `/ticket/:id`

Anyone with a ticket permission. Create captures subject, description, category, subcategory, priority, nature, call medium, and an optional asset. Detail lets Level 1 assign the ticket and lets people with update permission change status. A chat thread sits on the same page. Level 3 sees only tickets they requested.

**Benefit:** A support request stays attached to a person, an optional asset, and a conversation, instead of living only in email or a phone log.

### User Access Management — `/uam`, `/uam/create`, `/uam/:id`

Anyone with a UAM permission. The form is a Windows access request: request type (create, modify, delete, deactivate), people, network services, share drives, mailbox treatment, and approval blocks. The detail page draws a status sequence: Created → UAM number → Line manager → IT → Closed (or Rejected).

**Benefit:** The access request and its approval trail are one record, and the API can render that record as a PDF.

**Limit:** The Angular app loads, creates, updates, and deletes UAM records. It does not call the API steps that assign the UAM number, record line-manager approval, close, or reject. Those transitions exist on the API. The on-screen sequence is a display of the stored status.

### Users — `/user`, `/user/create`, `/user/edit/:id`, `/user/:id`

Anyone with a user permission. Directory of employees with name, email, mobile, branch, department, manager, role, and module permissions. Level 1 can reset another person’s password from the list. The detail page shows the person and assets allocated to them.

**Benefit:** IT maintains who can sign in and which modules they may touch, and can see what equipment a person holds.

### Branches — `/branch`, `/branch/create`, `/branch/:id`

Offices: name, three address lines, city, state, country, branch code, FQDN, active flag. Assets and users point at a branch. Audits are scoped to one branch.

**Benefit:** Equipment and people can be counted per office.

### Departments — `/department`, `/department/create`, `/department/:id`

Name and active flag. Users belong to a department. An audit selects one or more departments inside a branch.

**Benefit:** Stock checks and the directory can be cut by team.

### Vendors — `/vendor`, `/vendor/create`, `/vendor/:id`

Supplier name, email, phone, contact person, address, city, service number, active flag. An asset can store a vendor id and a purchase-order number. Warranty entries can also name a vendor.

**Benefit:** Purchase and support contacts sit next to the assets they sold.

### Audit — `/audit`, `/audit/create`, `/audit/dashboard`, `/audit/:id`, `/audit/:id/report`

Anyone with an audit permission (web API also requires Level 1 or Level 2). Create names the audit, picks a branch and departments, and assigns a Level 2 user. Opening it snapshots matching assets. The dashboard shows total, completed, in progress, and missing counts, plus department history. Detail can complete the audit. The report lists scanned and missing items. Scanning is `POST /mobile/audit/:id/scan` and is limited to the assigned Level 2 user. There is no scanner screen in the Angular app.

**Benefit:** A branch stock-take produces a found-versus-missing list instead of a paper tally.

### Reports — `/report`

Level 1 only in the app. Three CSV downloads (assets, tickets, users) and two figures: warranties ending and AMC contracts ending, using the dashboard’s 30-day window. Asset, ticket, and user lists also expose a download when the person may view that module. The API allows Level 2 with the matching view permission; the `/report` page itself does not.

**Benefit:** A spreadsheet extract of the register, the ticket queue, or the directory, capped at 5,000 rows.

### Sign-in — `/sign-in`

Email and password against MongoDB. Session is a JWT kept in `localStorage` (24 hours). The page links to `/sign-up`, and there is no sign-up route; accounts are created by an administrator. There is no self-service forgot-password flow.

### Present in the API, absent from the Angular navigation

| Capability | API | What it does |
| --- | --- | --- |
| Laptop allocation PDF | `POST /allocation-form` (Level 1 or 2) | Renders the handover checklist PDF. No Angular caller. |
| Visitors | `/visitor-management-system` | Create a visit, check in, check out, and a monthly dashboard (visit count, daily average, average hours). No Angular screens. |
| Clients | `/client` | Client name, mobile, email, and branch sites with GSTIN and contacts. Angular has a service and types, and no client screens. |
| Product presets | `/product-presets`, including `suggetions` | Named products (make, code, type, warranty). No Angular screens. |
| Active Directory | `POST /active-directory/login`, `GET /active-directory/users` | Directory login and user lookup. The Angular sign-in form does not use it. `ActiveDirectoryModule` is commented out of `app.module.ts` and is still imported by the ticketing module, so the routes are registered through that import. |
| Autocomplete | `GET /auto-complete/asset/:id`, `GET /auto-complete/ticket/category` | Distinct previous values (asset name, processor, operating system; ticket categories) to fill forms. |

**Settings** is in the sidebar code and `checkSetting()` always returns false, so the item never shows. There is no `/setting` route.

## 5. Workflows

### Asset life: intake → assignment → tracking → retirement

1. **Intake.** Level 1 or 2 with `AssetCreate` opens `/asset/create` and posts `POST /asset`. The API requires an asset code and a type. The form also treats name, category, and branch as required. Default status is **In pool**. A transaction row is written. Laptops, PCs, and servers are rejected if the serial or hostname is already stored.
2. **Optional scan intake.** A Level 1 or 2 session posts hardware facts to `POST /exe-agent`. On `/asset/scanned`, Move to pool calls `PUT /exe-agent/move-to-in-pull` with type `laptop`, `pc`, or `server`. The scan is deleted and an asset is created on the current user’s branch. That path does not set an asset code or name and does not write the usual “created” transaction. [The status still defaults to in pool.]
3. **UPS and batteries.** If the type is UPS and the body includes a `battery` array, the API creates the UPS and child battery assets linked by `parentAssetId`. The create form in Angular has no battery-entry UI, so this path is API-driven today.
4. **Assign.** From the asset sheet, assign calls `PUT /asset/:id/user/:userId/assign`. Status becomes **Assigned**, the user gains the asset id, and a transaction records who received it.
5. **Track.** `/asset/:id` builds a timeline from those transactions plus tickets that point at the asset: created, assigned to a named person, returned to pool, moved to repair (status Down), other status changes (including Scrap), and “Ticket created.” The API also totals time in pool and time in repair.
6. **Repair.** Status **Down** is labeled “In repair” on the dashboard and “Moved to Repair” on the timeline.
7. **Return.** Remove-from-user, or a status update to in pool, clears the holder and writes an in-pool transaction.
8. **Retire.** Status **Scrap** is labeled “Retired” on the dashboard. Scrap is excluded from warranty-expiry counts. Deleting an asset is Level 1 only (`DELETE /asset/:id`).

Setting status to Assigned through the generic status endpoint does nothing. Assignment only happens through the assign endpoint.

### Physical audit

1. Create at `/audit/create`: name, branch, departments, assigned Level 2 user. Status **Open**. Matching assets are snapshotted.
2. The assignee lists their audits on `GET /mobile/audit` and scans with `POST /mobile/audit/:id/scan`, passing an asset id or an asset code. The first scan moves the audit to **In progress**.
3. Complete from the web list or detail. The Angular client sends `forceComplete: true`, which marks every unscanned snapshot row missing, then sets status **Completed** and `isClosed`.
4. `/audit/:id/report` shows what was scanned and what is missing. `/audit/dashboard` summarizes counts and department history.

The web app has no scan button. Scanning is the mobile API.

### Ticket

1. Create at `/ticket/create`. A Level 3 requester is forced to themselves.
2. Level 1 assigns from `/ticket/:id`. Status can move through Open, Assigned, In Progress, Hold, Vendor Dependency, and Closed. Closing stores `ticketClosedAt` and a closing note.
3. People with ticket update permission post chat messages. Level 3 can read and post only on their own ticket.
4. Delete is Level 1 only.

### Windows access request (API)

1. **Created** — `POST` the UAM record (the Angular form does this).
2. **UAM number assigned**, then **assigned to line manager** — `PUT …/assign-uam-number/:id`. If there is no manager, the API routes it toward IT. Requires `UAMNoCreate`.
3. **Approved by line manager**, then **assigned to IT** — `PUT …/approval-from-line-manager/:id`.
4. **Closed** or **Rejected** — `PUT …/close-uam/:id` or `PUT …/reject-uam/:id`, with a note.
5. On those later steps the API renders `public/user-access-management/uam.pdf`. The email that would attach that PDF is commented out, so no message is sent.

Level 3 sees requests they created or that are assigned to them. Level 2’s list is requests already with IT. Level 1 sees all.

### New joiner (visibility, not a workflow engine)

The dashboard “new joinees” table is users whose account `createdAt` falls in the current calendar week, with a flag for whether any asset is allocated to them. There is no automatic provisioning job.

## 6. Integrations

| Integration | Where | What it enables |
| --- | --- | --- |
| **MongoDB** | `MONGODB_URI` via Mongoose | Every record: users, assets, tickets, UAM, audits, branches, and the rest. |
| **JWT (Passport, HS256, 24h)** | `JWT_SECRET` from the environment. Boot fails if the variable is missing, blank, or the literal `JWT_SECRET`. | Signed-in sessions for the web app and the mobile audit API. |
| **Active Directory** (`activedirectory2`, `passport-activedirectory`) | Routes under `/active-directory`, plus `POST /login` on the AD controller. Not on the Angular sign-in form. | Username/password login against AD, and Level 1/2 lookup of AD users who have an email. Listed admin usernames become Level 2; others become Level 3. |
| **Gmail SMTP** (Nodemailer) | `NODEMAILER_EMAIL`, `NODEMAILER_PASSWORD`, `smtp.gmail.com:587` | Intended for UAM status mail with the PDF attached. `sendEmail` is implemented and the UAM call site is commented out, so mail is not sent. If the env vars are empty, send is a no-op anyway. |
| **Puppeteer + EJS** | Allocation form and UAM PDF services | Printable laptop handover checklist and Windows access form. |
| **Hardware inventory agent** | `POST /exe-agent` with the same user JWT (Level 1 or 2). Agent binary is not in these repos. | Accepts a system-information style body and can promote it into a laptop, PC, or server. |
| **QR** | Browser library `qrcode` | Prints and shows a code of the asset’s database id. Audit scan lookup is by asset id or asset code, so a QR of the id is a different identifier from the human asset code. |

**Not found:** Microsoft Graph, Azure AD as a cloud identity provider, Microsoft 365 APIs, SSO protocols beyond the on-prem Active Directory login above, SMS, payments, Redis, or a live SQL database. Ticket category `O365` is a label on a support ticket, not a connection to Microsoft 365. `MSSQL_*` environment keys exist; TypeORM is not connected.

## 7. Data the app tracks

### Asset identity (all types)

Asset code, name, type, category (`hardware` or `software`), subcategory, serial (`sr_no`), location, branch, vendor, PO number, purchase date, who added it, optional client, optional parent asset (used for UPS batteries), allocation status, allocated user, warranty/AMC entries.

**Statuses:** `IN_POOL` (In pool / ready to assign), `ASSIGNED`, `DOWN` (in repair), `SCRAP` (retired).

**Types in the live enum (22):** laptop, PC, server, printer, monitor, mobile, UPS, battery, laptop bag, headphone, dongle, keyboard, mouse, VC device, smart TV, access point, router, firewall, switches, projector, software, other. The schema also has furniture and online UPS shapes; online UPS is commented out of the type enum, and furniture is not in the enum.

**Compute specs** (laptop, PC, server): manufacturer, model, serial, OS, hostname, memory, disks, battery, baseboard, CPU.

**Other type-specific fields:** printer model and color; monitor and smart TV brand and resolution; mobile brand, RAM, ROM, OS; software name, key, and version; UPS brand, make, kW, product code, online/offline; battery brand, serial, life; most peripherals are brand-only.

**Coverage:** each warranty row is type Warranty or AMC, on-site or off-site, start, end, and optional vendor, PO, name, and description. “Expiring” means `endAt` is still inside the next 30 days unless a caller passes another `expiringIn`. The dashboard also counts coverage already past `endAt`.

### People

First name, last name, email, password (hashed; omitted from CSV export), role, active flag, mobile, branch, department, manager, permission list, allocated asset ids, password-change timestamps.

### Tickets

Requester, assignee, call medium, nature (Incident or Request), category, subcategory, status, priority (Low, Medium, High, Critical), subject, description, closing note, closed time, optional asset, and a history of who attended the call. Categories include hardware laptop/desktop, hardware server, software, O365, printer, network, peripheral, and forms, with a long subcategory list (Wi-Fi, Outlook, SharePoint, password reset, and others).

### UAM

UAM number, request type (Create, Modify, Delete, Deactivate), priority (low, medium, high), Windows payload (the application type exists in the enum and is not what the form submits), status from the action enum, assignee, “with IT” flag, and a transaction log.

### Audit

Name, branch, departments, status (Open, In progress, Completed, Closed), creator, assignee, start/complete/close times, counts of total, scanned, and missing, and a closed flag. Each snapshotted asset row records whether it was scanned.

### Organization

Branch (address, code, FQDN), department (name), vendor (contact details), client (API only), visitor (host, name, contact, vehicle, purpose, company, schedule, check-in and check-out), product preset (API only).

## 8. Automation and “smart” behavior

There is no AI, machine learning, scheduled job, or cron in this codebase.

What the server does compute on its own:

- **Warranty window.** Flags and dashboard rows for Warranty and AMC ending within 30 days, plus already expired coverage, excluding scrap.
- **Timeline durations.** Days, hours, and minutes between asset status events, plus total time in pool and total repair time.
- **Audit progress.** First scan flips Open to In progress and refreshes scanned and missing counts. Force-complete marks unscanned rows missing.
- **Uniqueness.** Laptop, PC, and server serial and hostname must be unique.
- **UPS children.** Creating a UPS with a battery array inserts the child assets.
- **New joinees.** Users created this calendar week, with an allocated-or-not flag.
- **Autocomplete.** Previous asset names, processors, operating systems, and ticket categories offered as form suggestions. This is a distinct-value lookup, not a recommendation model.
- **PDF rendering** on UAM transitions and on the allocation-form endpoint.
- **Email composition** for UAM, with the send call commented out.

## 9. Reporting, dashboards, and exports

| Surface | Who | Contents |
| --- | --- | --- |
| `/dashboard` | Level 1 in the app. `GET /dashboard` also allows Level 2. | Fleet total and status mix, warranty/AMC, ticket counts for Open, In Progress, Hold, and Vendor Dependency, coverage table (up to 8 items), branch allocation matrix, last 10 assets, user donut by branch, this week’s new accounts. |
| `/home` | Not Level 1 | Module totals the person can open, personal warranty/AMC banner, their allocated assets. |
| `/audit/dashboard` | Audit permission | Total, completed, in progress, missing, and department audit history. |
| `/audit/:id/report` | Audit permission | Scanned versus missing for one audit. |
| `/report` | Level 1 | CSV for assets, tickets, and users; warranty-ending and AMC-ending figures. |
| List download buttons | Level 1, and Level 2 with view permission on that module | Same three CSVs. Vendor export is not wired. |
| Visitor dashboard | API only, any logged-in role | Month visit count, daily average, average visit hours. |

CSV files stop at **5,000** rows and append a comment line when the full set is larger. Ticket “number” in the CSV is the document id. Passwords are not included.

`GET /dashboard` also returns ticket counts for Assigned and Closed, per-IT-user workload, total UAM and UAM by branch, and registered-asset figures. The Angular dashboard does not render those.

## 10. Security and access control

- **Sign-in** is email and password checked with bcrypt. JWT lasts 24 hours. The secret comes from the environment.
- **Level 1** bypasses permission checks and is the only role that can open Dashboard and Report in the app, delete assets, delete tickets, and call `POST /auth/sign-up`.
- **Password reset** (`PUT /auth/reset-password`) is an administrator action for Level 1 and Level 2, not a self-service email reset. The user-list button is how the app exposes it.
- **Missing role or permission metadata denies the request.** `RolesGuard` and `PermissionGuard` return false when the route has no decorator.
- **Level 3 scope:** own tickets, own or assigned UAM on the list query, own profile. Asset detail for someone else’s equipment is blocked for that role.
- **Audit scan** is Level 2 and only if that user is the audit’s assignee. A closed audit rejects scans.
- **Exe-agent and allocation PDF** require a Level 1 or 2 JWT. There is no separate agent API key.
- **Helmet** is on. **CORS** allows origins in `CORS_ORIGIN`, or `http://localhost:4200` and `http://127.0.0.1:4200` when that variable is unset.
- **No rate limit** on login was found.
- A **default Level 1 user** is created at startup if that email is missing (`DefaultUserService`). Credentials come from the environment or a built-in fallback. Do not print them in the brochure.
- **Active Directory** login endpoints are public by design (they are the login). AD user listing requires Level 1 or 2. Whether those routes are reachable depends on the ticketing module’s import, because the AD module is commented out of `app.module.ts`.
- **Known gaps to keep out of marketing copy:** ticket chat is allowed for anyone with ticket view/update who knows the id (Level 3 is then checked against ownership). Web audit routes use JWT plus audit permissions; confirm each method’s decorator before claiming field-level lockdown. `PUT /users/:id` can change `role`. UAM list scoping for Level 3 has been a place where a known id widened the query; treat “employees only see their own requests” as the intended rule and [UNSURE] as a guarantee on every list filter.

## 11. Tech stack

- **Web app:** Angular 14, Angular Material 13, Tailwind 3, ApexCharts (`ng-apexcharts`), RxJS 6, `qrcode`, built with the Angular CLI.
- **API:** NestJS 9 on Node 18–24, Passport JWT, class-validator, Express.
- **Data:** MongoDB via Mongoose 7, with pagination and autopopulate plugins.
- **Documents and mail:** Puppeteer 20, EJS, Nodemailer (Gmail SMTP).
- **Directory:** `activedirectory2` (optional path; not used by the Angular sign-in form).
- **Tests:** Jest on the API (auth, guards, users, chat, UAM pagination). Karma/Jasmine on the Angular app, mostly generated specs. An API e2e Jest config exists.

## 12. Numbers you can cite

The product does not store a customer asset volume, a time-saved figure, or a count of steps removed. Do not invent those.

Figures that are in the code:

| Figure | Meaning |
| --- | --- |
| 3 roles | Level 1, Level 2, Level 3 |
| 8 modules with create/view/update/delete | Asset, Ticket, User, UAM, Vendor, Branch, Department, Audit, plus the extra UAM-number permission |
| 22 asset types | Live `AssetTypes` enum |
| 4 asset statuses | In pool, Assigned, Down, Scrap |
| 6 ticket statuses | Open, Assigned, In Progress, Hold, Vendor Dependency, Closed |
| 4 ticket priorities | Low through Critical |
| 7 UAM actions | Created through Closed or Rejected, shown as 5 steps on the form |
| 30 days | Default warranty and AMC horizon |
| 10 | Default page size, and the dashboard’s “last created” asset count |
| 5,000 | Maximum rows in one CSV, with a truncation note after that |
| 24 hours | JWT lifetime |
| 4 audit statuses | Open, In progress, Completed, Closed |

A local demo seed (`scripts/seed-satyamev.ts`) is illustrated data for screenshots, not a product limit: 5 branches, 7 departments, 6 vendors, about 28 people, 29 laptops, 12 PCs, 10 monitors, 12 tickets, 6 UAM records, and 3 audits. Offices in that seed are Ahmedabad, Mumbai, Pune, Bangalore, and Hyderabad. The allocation-form sample locations in code comments are Ahmedabad and Delhi.

## 13. Five screens to photograph

Use a populated Level 1 session for 1, 2, and 5, and a Level 2 or Level 3 session for 3. Replace the Rikiel mark before shooting sign-in; it is a weak brochure frame until the logo matches Lunar.

1. **`/dashboard`** — Fleet total, status bar, assigned donut, warranty and AMC, ticket counts, coverage table, branch matrix, recent assets, user chart, new joiners. This is the widest view of the product.
2. **`/asset/:id`** — Open a laptop that has specs, a warranty, an assignee, and history. The page shows status, hardware facts, the QR code, and the colored timeline (assigned, pool, repair, scrap, tickets). The timeline is on this page, not a separate route.
3. **`/home`** — Sign in as someone who is not Level 1 and who can open several modules. The card grid, the warranty banner, and “My allocated assets” show the non-admin experience.
4. **`/ticket/:id`** — An open ticket with priority, requester, status control, and at least one chat message. Assign is visible for Level 1.
5. **`/audit/dashboard`** — Four large counts (total, completed, in progress, missing) and the department history table. If that board is sparse, use **`/audit/:id/report`** for a single audit’s scanned and missing lists, or **`/uam/:id`** for the Windows request and its status steps.

Secondary options if a primary screen is empty: `/asset` (inventory table and QR print), `/uam` (request queue), `/branch` (office cards).
