# AI Project Knowledge Base

Last updated: 2026-10-06. Source: both open repos (Angular frontend + NestJS backend). This is an internal map, not client copy. Brochure source remains `brochure/`. A factual Lunar product brief is `LUNAR_BRIEF.md` (same date). Browser title is Lunar; the logo file is still Rikiel.

## Architecture understanding

- **Frontend:** Angular 14 SPA (`asset-management-frontend-angular`). Material + Tailwind. ApexCharts (`ng-apexcharts`) used on the admin dashboard user-distribution card. QR codes generated in the browser (`qrcode`).
- **Backend:** NestJS 9 (`assets-management-backend`), Node 18–24. REST controllers under `src/*`. JWT via Passport. MongoDB via Mongoose.
- **PDF:** Puppeteer renders HTML/EJS to PDF for User Access Management forms and the laptop allocation checklist.
- **Email:** Nodemailer over Gmail SMTP. UAM email send is implemented but the call site is commented out.
- **Branding:** `src/index.html` title is Lunar. The sign-in mark and splash still use `assets/logo/rikielR.svg`. UAM and allocation PDFs are written for APCER (client organization on the forms). Product brochure name is Lunar; APCER is the organization those PDFs address.
- **No multi-tenant layer, no websocket product feature, no offline mode, no payment gateway.**

## Feature inventory (plain English)

Modules in the web app sidebar:

| Module | Who sees it | What it does |
| --- | --- | --- |
| Dashboard | Level 1 only | Asset status KPIs, branch allocation table, recent assets, user donut, new joinees |
| Home | Everyone except Level 1 | Permission-aware module cards with counts, plus “My Allocated Assets” |
| Asset | Permission-gated | Register, search, assign, status changes, QR print, timeline. Level 1 also sees Scanned Asset |
| Ticket | Permission-gated | IT helpdesk tickets with chat |
| User | Permission-gated | Employee directory, roles, module permissions |
| U.A.M | Permission-gated | Windows access requests: create, manage, approve |
| Vendor | Permission-gated | Supplier records |
| Branch | Permission-gated | Office/site records |
| Department | Permission-gated | Department records |
| Audit | Permission-gated | Physical inventory audits, progress, missing assets, department history |
| Report | Level 1 sidebar | CSV downloads for assets, tickets, and users, plus warranty and AMC counts from `GET /dashboard` |
| Setting | Guard always returns false | Hidden |

Backend-only (no Angular screens found):

- Visitor management (create visit, check-in, check-out, monthly dashboard)
- Active Directory login and user lookup
- Client master data
- Product presets
- Laptop allocation-form PDF (`POST /allocation-form`, no auth, no frontend caller)
- CSV reports: `GET /reports/assets`, `GET /reports/tickets`, `GET /reports/users` (Level 1 and Level 2 with the matching view permission; Level 3 gets 403; no token gets 401). Capped at 5000 rows, with a comment line when truncated. Password is not selected. `ResponseInterceptor` lets `StreamableFile` through so the body stays CSV. `tsconfig.build.json` compiles `src` only so `scripts/seed-satyamev.ts` does not change the emit root.

## Backend / frontend mapping

| Area | Backend | Frontend |
| --- | --- | --- |
| Auth | `src/auth`, `src/active-directory` | `src/app/modules/auth`, `src/app/core/auth` |
| Assets | `src/asset`, `src/exe-agent` | `src/app/modules/asset` |
| Tickets + chat | `src/ticketing` | `src/app/modules/ticket` |
| UAM | `src/user-access-management` | `src/app/modules/uam` |
| Audit + mobile scan API | `src/audit` | `src/app/modules/audit` |
| Org | `src/branch`, `src/department`, `src/vendor`, `src/client` | `modules/branch`, `department`, `vendor` (no client UI) |
| Dashboard | `src/dashboard` | `modules/dashboard` (Level 1), `modules/home` (others) |
| Reports | `src/reports` | `modules/report` (Level 1), export buttons on asset, ticket, and user |
| Visitors | `src/visitor-management-system` | none |
| Mail | `src/nodemailer` | none |

## API relationships

- Users belong to a branch and department and may have a manager.
- Assets belong to a branch, optional vendor, optional parent asset (UPS → batteries), and an allocation status. Assignment links `allocationToUserId`.
- Tickets optionally link an asset and a requester/assignee.
- UAM requests are created by a user, assigned through line manager then IT, and keep a transaction log.
- Audits are scoped to a branch and departments, then snapshot matching assets into `AuditAsset` rows that get scanned.
- Scanned hardware (`exe-agent`) is staged per user, then promoted into a real asset (laptop, PC, or server).

## Domain concepts

- **Roles:** `level1` (admin, all permissions), `level2` (customizable “super admin” in the UI; backend register label says “Admin”), `level3` (non-IT employee).
- **Module permissions:** Create / View / Update / Delete per Asset, Ticket, User, UAM, Vendor, Branch, Department, Audit. UI collapses these to Full, Read/Write, Read, or N/A. Extra flag `UAMNoCreate` gates assigning a UAM number.
- **Asset status:** In Pool, Assigned, Scrap, Down (timeline treats Down as repair).
- **Asset types:** laptop, PC, server, printer, monitor, mobile, UPS, battery, bag, headphone, dongle, keyboard, mouse, VC device, smart TV, AP, router, firewall, switches, projector, software, other. Schema also has furniture / online UPS outside the live type enum.
- **Warranty vs AMC:** on-site or off-site, with a 30-day expiry count on the dashboard API.
- **UAM actions:** Created → UAM number assigned → line manager → IT → Closed or Rejected. Request types: Create, Modify, Delete, Deactivate.
- **Ticket status:** Open, Assigned, In Progress, Hold, Vendor Dependency, Closed. Priority Low–Critical. Nature Incident or Request.
- **Audit status:** Open → In Progress (first scan) → Completed/Closed. Force-complete marks unscanned items missing.

## Testing strategy

- Frontend: Karma/Jasmine (`ng test`). Mostly generated specs; not a product test suite.
- Backend: Jest (`npm test`). Coverage script exists; do not assume broad coverage.
- No e2e suite is wired in the frontend README (needs a runner). Backend has `test:e2e` config.

## Discovered edge cases

- Level 3 sees only own tickets, own/assigned UAM, and own profile. Asset detail for another user is blocked.
- Asset delete is Level 1 only. Ticket delete is Level 1 only.
- Mobile audit endpoints are restricted to Level 2 at runtime.
- Web audit controller has JWT but method-level role decorators are absent.
- Allocation-form endpoint has no JWT.
- Exe-agent endpoints are any logged-in user (TODO comment for role checks).
- Ticket chat is any logged-in user who knows the ticket id.
- Assigning a ticket used to `delete` `_id` on the live ticket object, then closing the dialog called `GET /ticketing/undefined`. Update now sends a copy of the allowed fields and keeps `_id`. Cancel does not reload. The assign dialog shows a spinner while `GET /users/paginate` searches IT users.
- Production `ng build` failed because `layout.component.scss` is 4.31 kB and `anyComponentStyle.maximumError` was 4 kB. The error ceiling is now 6 kB. The 2 kB warning is unchanged. `nest build` succeeds.
- Deploy: frontend `npm run deploy` builds with `API_BASE_URL` and runs `wrangler pages deploy` (project `lunar`, SPA `_redirects`). Backend `npm run deploy` validates `render.yaml` and uses the Render CLI against GitHub `master` (`lunar-api`, health `GET /health`). `CORS_ORIGIN` accepts exact origins and `*` wildcards such as `https://*.lunar.pages.dev`.
- Asset, ticket, and user Export buttons download CSV from `GET /reports/*` for Level 1 and Level 2 with view access. Vendor export stays commented out. CSV is built in the backend without a spreadsheet library.
- UAM emails are prepared; `sendEmail` is commented out. PDF generation still runs.
- Forgot-password UI calls an endpoint that does not exist on the backend. Password reset that does exist is an admin reset for Level 1/2.
- AD login is not on the Angular sign-in form.
- QR encodes the database id, while audit scan accepts asset id or asset code.
- Call-medium values differ in casing between frontend and backend enum.
- Ticket sub-category is on the form; the schema field is commented out.
- Vendor populate path may not match the schema field name (`venderId` vs `vendorId`).
- Default admin user is seeded on startup if missing. Treat credentials as a production risk; do not publish them.
- Laptop, PC, and server short-detail cards used the opposite warranty icon: a future `warranty[0].endAt` showed a red cross, and an expired date showed a green check. Printers and other types, the bottom sheet, and the full detail page already used the correct direction. The icon only looks at the first warranty entry. Latitude 5440 (`AMD-LT-0108`) ends `2026-10-11T04:45:00.000Z`, which is still in force.
- Material typography `$font-family` in `styles.scss` and `theme.scss` must be one quoted string. An unquoted comma list fails the Sass build and blocks the dev server from picking up later template changes.
- Focused outline inputs turn into a solid dark box if `.mat-form-field-outline-thick` gets a background. That element covers the whole field. Set `color` for the border and keep `background-color` transparent.

## Regression risks

- Changing role or permission checks affects both guards and the sidebar. Level 1 dashboard vs everyone else’s Home must stay split.
- Asset assignment writes allocation status and a transaction used by the timeline. Skipping the transaction breaks history.
- Promoting a scanned asset deletes the scan and creates a real asset. Partial failure can duplicate or lose the scan.
- Audit complete with force marks everything unscanned as missing. Do not change that default silently.
- UAM status transitions are ordered. Updating a closed/rejected request is blocked for non–Level 1.
- UPS create also creates child battery assets.

## Brochure and local demo data

- Product brochure source is `brochure/index.html` in the Angular repo. The print file is `brochure/AssetHub-Platform-Overview.pdf`. Screenshots live in `brochure/shots/`. Satyamev Infotech Private Limited is illustrated customer data for that brochure, not a tenant in the product.
- Local demo load is a one-shot script, `scripts/seed-satyamev.ts` in the backend. It is not started with the API. It replaces local Mongo records and keeps the existing administrator login. Offices: Ahmedabad, Mumbai, Pune, Bangalore, Hyderabad.
- Laptop, PC, and server memory and disk sizes are stored as whole gigabytes (`mem.total`, `memLayout.size`, `diskLayout.size`). Spec cards append the label “GB”. Storing bytes makes the card show values such as 34359738368 GB.
- `scripts/capture-brochure-shots.js` retakes the screenshots against a running API (`:8000`) and Angular app (`:4200`). Run it with Node 20; the machine default may be newer than Puppeteer 20 supports.
- Level 3 “my allocated assets” compares the signed-in user id with `String(...)`. An object-to-string comparison used to hide that person’s own equipment.

## Historical implementation details

- Online UPS type is commented out of the enum; UPS + battery parent/child remains.
- `audit-assets` verify endpoint is fully commented out.
- Reports used to be an empty controller. CSV export now lives in `src/reports` and is mounted from `app.module.ts`. Ticket number in the CSV is the document id because tickets have no separate number field.
- Product-preset role decorators are commented out.
- Socket.io appears only as a transitive frontend dependency, not as an app feature.

## Visual system (2026-09-23)

Full-bleed studio shell: light grey canvas, white content panels, ink `#111827`. Tokens in `src/styles/styles.scss`. Collapsed rail is 76px; expanded is 240px (`localStorage` `ah-nav-expanded`). Active rail item is dark fill with white icon/type. Dashboard, home, list modules (asset, ticket, UAM, audit, user, vendor, branch, department), reports, and sign-in all use the same white-panel language and primary buttons. Asset and U.A.M rows still open Manage menus. Below 960px the rail becomes an overlay with labels. Header shows page title plus signed-in person. List paginators use `pagination.totalData` and a 1-based page.

## Deploy-readiness audit (2026-09-23)

Not production-ready. Parallel work is split so agents do not edit the same files. See the chat prompts; do not start a second agent on a file another agent owns.

- **Auth (rechecked 2026-10-06):** JWT secret is `requireJwtSecret()` from `process.env.JWT_SECRET` (`src/common/utils/jwt-secret.util.ts`). Boot throws if it is missing, blank, or the literal `JWT_SECRET`. Login has no rate limit. CORS allows `http://localhost:4200` and `http://127.0.0.1:4200` unless `CORS_ORIGIN` is set. Helmet is enabled. `RolesGuard` and `PermissionGuard` deny the request when the decorator is missing (`guards.spec.ts`).
- **Open routes:** `POST /allocation-form` now requires JWT and Level 1 or 2. Exe-agent routes require JWT and Level 1 or 2. AD is commented out of `app.module.ts` but `TicketingModule` still imports `ActiveDirectoryModule`, so AD routes stay mounted. AD login endpoints are public; AD user listing is Level 1/2.
- **Privilege:** `PUT /users/:id` accepts `role`. `PUT /auth/reset-password` lets Level 1/2 set any user’s password. Ticket chat requires ticket view or update; Level 3 is limited to their own ticket in `chat.service.ts`. Web audit routes use JWT and audit permissions. UAM number/approve/close/reject exist on the API and are not called by Angular.
- **Dashboard (rechecked 2026-10-06):** `/dashboard` renders fleet status, warranty/AMC counts, a coverage table, ticket counts for Open / In Progress / Hold / Vendor Dependency, branch allocation, last 10 assets, users by branch, and this week’s new accounts. API fields still unused on that screen: Assigned and Closed ticket counts, `itUserSpecificDetails`, UAM totals.
- **Reports:** Level 1 `/report` downloads the three CSVs (5,000-row cap) and shows warranty and AMC figures. List export buttons call the same endpoints for Level 1 and Level 2 with view permission.
- **Dead UI:** Settings guard always returns false. Forgot-password links to a route and `api/auth/forgot-password` that do not exist. Vendor export stays commented out. Asset edit `routerLink` is a single path segment. UAM delete calls `/uam/:id`; user delete calls `/user/:id`. UAM get-by-id searches the in-memory list. UAM status chips reuse asset statuses. List paginators bind `[length]` to `totalPage`.

## Coverage tracking

| Module | Brochure status | Notes |
| --- | --- | --- |
| Auth / roles | In the brochure | Three roles, module table |
| Dashboard / home | In the brochure | Admin dashboard and employee home, Satyamev data |
| Assets / scan / QR / timeline | In the brochure | Inventory list and Latitude timeline |
| Tickets / chat | In the brochure | Ticket conversation |
| UAM / PDF | In the brochure | Request list; email send still disabled in code |
| Audit / mobile API | In the brochure | Audit dashboard |
| Branch / department / vendor | In the brochure | Five offices and seven departments |
| Client / visitors / presets / allocation PDF | Inventoried as partial | Backend or unwired |
| Reports | Shipped for Level 1 | CSV export; settings still hidden |
| Payments / SMS / IoT | Not present | |
| Lunar brief | `LUNAR_BRIEF.md` (2026-10-06) | Factual brochure source. Title is Lunar; logo file is still Rikiel. No AI, no Graph/M365, no time-saved metric in code. |
