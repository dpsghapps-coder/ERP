# DPS-ERP — Product Requirements Document
**Version:** 2.0  
**Status:** Ready for Agentic Implementation  
**Tech Stack:** Laravel 12 · React 19 · Inertia.js · TypeScript · Tailwind CSS v4 · Shadcn UI · SQLite/MySQL  
**Architecture:** Mobile-First · RBAC-Driven · Glassmorphic UI · SPA (Inertia)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Tech Stack & Architecture](#2-tech-stack--architecture)
3. [Database Schema](#3-database-schema)
4. [User Roles & Permissions (RBAC)](#4-user-roles--permissions-rbac)
5. [Global Layout & Navigation](#5-global-layout--navigation)
6. [Module 1 — Client & Lead Management (CRM)](#6-module-1--client--lead-management-crm)
7. [Module 2 — Products, Services & Pricing](#7-module-2--products-services--pricing)
8. [Module 3 — Order Management](#8-module-3--order-management)
9. [Module 4 — Production Management](#9-module-4--production-management)
10. [Module 5 — Procurement Management](#10-module-5--procurement-management)
11. [Module 6 — Human Resource Management (HRM)](#11-module-6--human-resource-management-hrm)
12. [Module 7 — Photo/Video Studio Management](#12-module-7--photovideo-studio-management)
13. [Module 8 — Administration](#13-module-8--administration)
14. [API Route Map](#14-api-route-map)
15. [UI/UX Standards & Component Library](#15-uiux-standards--component-library)
16. [Implementation Roadmap](#16-implementation-roadmap)
17. [Non-Functional Requirements](#17-non-functional-requirements)

---

## 1. Executive Summary

DPS-ERP is a unified enterprise management platform designed to bridge creative studios with industrial production operations. It replaces fragmented point solutions by consolidating CRM, Order Management, Production, Procurement, HR, and Studio Scheduling into a single application.

**Core goals:**
- Eliminate data silos between sales, production, and creative departments.
- Provide real-time operational visibility through a role-aware dashboard.
- Deliver a premium glassmorphic UI that feels modern on both desktop and mobile.
- Be fully implementable by an agentic coder following this document alone.

---

## 2. Tech Stack & Architecture

### 2.1 Backend

| Concern | Technology |
|---|---|
| Framework | Laravel 12 (PHP 8.4) |
| Auth | Laravel Breeze + Inertia adapter |
| ORM | Eloquent |
| Queue | Laravel Queues (database driver for dev, Redis for prod) |
| Events/Listeners | Laravel Events |
| DB (production) | MySQL 8.x |
| DB (local/testing) | SQLite |
| File Storage | Laravel Storage + local disk (S3-compatible in prod) |
| API Style | Inertia (server-driven SPA) — no separate REST API needed for frontend |

### 2.2 Frontend

| Concern | Technology |
|---|---|
| Framework | React 19 |
| Routing | Inertia.js (server-side routing) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Component Library | Shadcn UI (customized) |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| State | Inertia shared props + local React state (no Redux) |
| Icons | Lucide React |

### 2.3 Folder Structure (Laravel + Inertia)

```
/app
  /Http
    /Controllers        ← one controller per module (e.g., CrmController)
    /Middleware
    /Requests           ← FormRequest validation classes
  /Models
  /Services             ← business logic layer, one service per module
  /Policies             ← RBAC gate policies
/resources
  /js
    /Components
      /ui               ← shadcn primitives
      /shared           ← AppHeader, Sidebar, BottomNav, etc.
    /Layouts
      /AppLayout.tsx
    /Pages
      /Auth
      /CRM
      /Orders
      /Production
      /Procurement
      /HRM
      /Studio
      /Admin
      /Dashboard
    /types              ← TypeScript interfaces mirroring Eloquent models
    /lib                ← utils, formatters, hooks
/routes
  web.php               ← all Inertia routes
/database
  /migrations
  /seeders
  /factories
```

---

## 3. Database Schema

### 3.1 Core Tables

#### `users`
```sql
id, name, email, password, avatar, role_id (FK), is_active,
email_verified_at, remember_token, created_at, updated_at
```

#### `roles`
```sql
id, name (slug), display_name, description, created_at, updated_at
```

#### `permissions`
```sql
id, name (slug), module, description
```

#### `role_permission` (pivot)
```sql
role_id (FK), permission_id (FK)
```

---

### 3.2 CRM Tables

#### `clients`
```sql
id, company_name, industry, website, phone, email, address,
city, country, status (enum: lead|prospect|active|inactive),
assigned_to (FK users), source, notes, created_at, updated_at
```

#### `contacts`
```sql
id, client_id (FK), first_name, last_name, job_title, email,
phone, is_primary, created_at, updated_at
```

#### `interactions`
```sql
id, client_id (FK), user_id (FK), type (enum: call|email|meeting|note),
subject, body, occurred_at, created_at, updated_at
```

---

### 3.3 Products & Pricing Tables

#### `products`
```sql
id, sku, name, description, type (enum: physical|service|digital),
category_id (FK), unit, is_active, created_at, updated_at
```

#### `product_categories`
```sql
id, name, parent_id (nullable FK self-ref), created_at, updated_at
```

#### `price_lists`
```sql
id, name, currency, is_default, valid_from, valid_to,
created_at, updated_at
```

#### `price_list_items`
```sql
id, price_list_id (FK), product_id (FK), unit_price, min_qty,
created_at, updated_at
```

---

### 3.4 Orders Tables

#### `orders`
```sql
id, order_number (unique), client_id (FK), contact_id (FK),
status (enum: draft|confirmed|in_production|ready|delivered|cancelled),
total_amount, discount_amount, tax_amount, grand_total,
currency, payment_status (enum: unpaid|partial|paid),
delivery_date, notes, created_by (FK users), created_at, updated_at
```

#### `order_items`
```sql
id, order_id (FK), product_id (FK), description, qty,
unit_price, discount_pct, line_total, created_at, updated_at
```

---

### 3.5 Production Tables

#### `production_jobs`
```sql
id, job_number (unique), order_id (FK, nullable), title, description,
status (enum: queued|in_progress|paused|completed|cancelled),
priority (enum: low|normal|high|urgent), assigned_to (FK users),
started_at, due_date, completed_at, created_at, updated_at
```

#### `production_tasks`
```sql
id, production_job_id (FK), title, description, assigned_to (FK users),
status (enum: todo|in_progress|done), due_date, completed_at,
sort_order, created_at, updated_at
```

#### `production_materials`
```sql
id, production_job_id (FK), product_id (FK), required_qty,
consumed_qty, created_at, updated_at
```

---

### 3.6 Procurement Tables

#### `suppliers`
```sql
id, company_name, contact_name, email, phone, address,
city, country, payment_terms, notes, is_active,
created_at, updated_at
```

#### `purchase_orders`
```sql
id, po_number (unique), supplier_id (FK), status
(enum: draft|sent|partial|received|cancelled),
expected_date, total_amount, notes, created_by (FK users),
created_at, updated_at
```

#### `purchase_order_items`
```sql
id, purchase_order_id (FK), product_id (FK), description,
qty, unit_cost, line_total, received_qty, created_at, updated_at
```

---

### 3.7 HRM Tables

#### `employees`
```sql
id, user_id (FK, nullable), employee_number, first_name, last_name,
department_id (FK), job_title, employment_type (enum: full_time|part_time|contract),
date_hired, date_terminated, salary, pay_frequency, phone, emergency_contact,
created_at, updated_at
```

#### `departments`
```sql
id, name, manager_id (FK employees, nullable), created_at, updated_at
```

#### `leave_requests`
```sql
id, employee_id (FK), leave_type (enum: annual|sick|unpaid|maternity|paternity),
start_date, end_date, days_count, reason, status (enum: pending|approved|rejected),
reviewed_by (FK users, nullable), created_at, updated_at
```

#### `attendance_logs`
```sql
id, employee_id (FK), date, check_in, check_out, hours_worked,
notes, created_at, updated_at
```

---

### 3.8 Studio Tables

#### `studio_resources`
```sql
id, name, type (enum: studio_room|camera|lighting|prop|vehicle),
description, is_available, created_at, updated_at
```

#### `studio_bookings`
```sql
id, booking_reference, order_id (FK, nullable), client_id (FK, nullable),
title, description, status (enum: tentative|confirmed|in_progress|completed|cancelled),
start_datetime, end_datetime, created_by (FK users), notes, created_at, updated_at
```

#### `studio_booking_resources` (pivot)
```sql
studio_booking_id (FK), studio_resource_id (FK)
```

#### `studio_crew` (pivot)
```sql
studio_booking_id (FK), user_id (FK), role_in_shoot
```

---

### 3.9 System Tables

#### `audit_logs`
```sql
id, user_id (FK), action, model_type, model_id, old_values (JSON),
new_values (JSON), ip_address, user_agent, created_at
```

#### `notifications`
```sql
id, type, notifiable_type, notifiable_id, data (JSON),
read_at, created_at, updated_at
```

---

## 4. User Roles & Permissions (RBAC)

### 4.1 Phase 1 Role

| Role | Slug | Description |
|---|---|---|
| System Admin | `admin` | Full access to all modules and system settings |

### 4.2 Permission Structure (for future phases)

Permissions follow the format: `module.action`

**Example permissions:**
```
crm.view_clients
crm.create_clients
crm.edit_clients
crm.delete_clients
orders.view
orders.create
orders.approve
production.manage
procurement.create_po
hrm.view_payroll
studio.manage_bookings
admin.manage_users
admin.view_audit_logs
```

### 4.3 Middleware

Create a `CheckRole` middleware applied to all protected routes:

```php
// Route group example
Route::middleware(['auth', 'role:admin'])->group(function () {
    // all module routes
});
```

Gate definitions live in `AuthServiceProvider` using Laravel Policies per module.

---

## 5. Global Layout & Navigation

### 5.1 AppLayout Component

All authenticated pages use a single `AppLayout.tsx` wrapper with:
- A persistent `<AppHeader />` (desktop)
- A collapsible `<Sidebar />` (desktop)
- A fixed `<BottomNav />` (mobile, ≤768px)
- A `<main>` content area with scroll

### 5.2 AppHeader

**Left:** Logo + app name "DPS-ERP"  
**Center:** Global search bar (searches across clients, orders, jobs — debounced, 300ms)  
**Right (left to right):**
1. Notification bell — badge with unread count, dropdown preview of last 5 notifications
2. Wrench/tools icon — quick access to system settings
3. User avatar (rounded) + username + dropdown with: Profile, Settings, Logout

**Behavior:**
- `position: sticky; top: 0; z-index: 50`
- `backdrop-filter: blur(12px)` with semi-transparent background
- Border-bottom: 1px solid with low opacity

### 5.3 Sidebar (Desktop, ≥769px)

**Default state:** Expanded (240px wide)  
**Collapsed state:** Icon-only (64px wide), toggle persisted in localStorage

**Nav Groups:**

```
ENTERPRISE
  ├── Dashboard          /dashboard
  ├── CRM                /crm
  ├── Products           /products
  ├── Orders             /orders
  ├── Production         /production
  ├── Procurement        /procurement
  ├── HRM                /hrm
  └── Studio             /studio

SYSTEM
  └── Administration     /admin
```

**Behavior:**
- Active item: highlighted pill with accent color
- Each item: icon + label (label hidden when collapsed)
- Hover: subtle background transition (150ms)

### 5.4 Bottom Navigation (Mobile, ≤768px)

Fixed bottom bar showing 5 primary items:

```
Dashboard | CRM | Orders | Studio | Admin
```

Remaining modules accessible via a right-side slide-in drawer (hamburger icon in header replaces desktop logo area on mobile).

### 5.5 UI/UX Tokens

```css
/* Glassmorphism base */
--glass-bg: rgba(255, 255, 255, 0.08);
--glass-border: rgba(255, 255, 255, 0.15);
--glass-blur: blur(16px);
--glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);

/* Typography */
--font-sans: 'Inter Variable', sans-serif;

/* Spacing scale follows Tailwind defaults */

/* Radius */
--radius-card: 16px;
--radius-button: 8px;
```

---

## 6. Module 1 — Client & Lead Management (CRM)

### 6.1 Purpose

Track the full client lifecycle from lead acquisition through active account management. Log all interactions and associate clients with orders and studio bookings.

### 6.2 Pages & Routes

| Route | Component | Description |
|---|---|---|
| `GET /crm` | `CRM/Index.tsx` | Client list with filters |
| `GET /crm/create` | `CRM/Create.tsx` | New client form |
| `GET /crm/{id}` | `CRM/Show.tsx` | Client profile / detail view |
| `GET /crm/{id}/edit` | `CRM/Edit.tsx` | Edit client |
| `POST /crm` | — | Store client |
| `PUT /crm/{id}` | — | Update client |
| `DELETE /crm/{id}` | — | Soft-delete client |

### 6.3 CRM Index Page

**Filters (top bar):**
- Status: All · Lead · Prospect · Active · Inactive
- Assigned To: dropdown of users
- Search: by company name or contact email

**Table columns:**
`Company` · `Primary Contact` · `Status Badge` · `Assigned To` · `Last Interaction` · `Actions (View, Edit)`

**Actions:**
- "+ New Client" button → `/crm/create`
- Row click → `/crm/{id}`

### 6.4 Client Profile Page (`/crm/{id}`)

**Layout:** Two-column on desktop, stacked on mobile

**Left column (main):**
- Company info card (name, website, industry, phone, email, address)
- Contacts sub-table (list of contacts with add/edit inline)
- Interaction timeline (chronological log of all calls, emails, meetings, notes)
  - "Log Interaction" button opens a modal (type, subject, body, date)

**Right column (sidebar):**
- Status badge + change status dropdown
- Assigned To (editable dropdown)
- Associated Orders (list with link to order detail)
- Associated Studio Bookings (list with link)
- Quick stats: total order value, number of orders

### 6.5 Interaction Logging

- Type: `call | email | meeting | note`
- Fields: Subject, Body (rich text), Date/Time occurred
- Auto-stamps logged user and timestamp
- Rendered as a vertical timeline with type icon and color coding

### 6.6 Validation Rules

```
company_name: required|string|max:255
email: nullable|email|unique:clients,email,{id}
phone: nullable|string|max:30
status: required|in:lead,prospect,active,inactive
assigned_to: nullable|exists:users,id
```

---

## 7. Module 2 — Products, Services & Pricing

### 7.1 Purpose

Maintain a catalogue of all goods and services the company sells or uses in production. Manage pricing tiers via price lists.

### 7.2 Pages & Routes

| Route | Component | Description |
|---|---|---|
| `GET /products` | `Products/Index.tsx` | Product list |
| `GET /products/create` | `Products/Create.tsx` | New product form |
| `GET /products/{id}/edit` | `Products/Edit.tsx` | Edit product |
| `POST /products` | — | Store |
| `PUT /products/{id}` | — | Update |
| `DELETE /products/{id}` | — | Soft-delete |
| `GET /products/categories` | `Products/Categories.tsx` | Category management |
| `GET /products/price-lists` | `Products/PriceLists.tsx` | Price list management |
| `GET /products/price-lists/{id}` | `Products/PriceListDetail.tsx` | Edit price list items |

### 7.3 Product List

**Filters:** Category · Type (physical/service/digital) · Active/Inactive · Search by name/SKU

**Table columns:**
`SKU` · `Name` · `Category` · `Type Badge` · `Unit` · `Status Toggle` · `Actions`

### 7.4 Product Form Fields

```
sku:          required|string|max:50|unique
name:         required|string|max:255
description:  nullable|string
type:         required|in:physical,service,digital
category_id:  nullable|exists:product_categories,id
unit:         required|string|max:30  (e.g. "pcs", "kg", "hr", "sqm")
is_active:    boolean, default true
```

### 7.5 Price Lists

- A company can have multiple price lists (e.g., "Retail", "Wholesale", "Studio Clients").
- One price list is marked as `is_default = true`.
- Price list items link a product to a unit price (and optional minimum quantity).
- When creating an order, the system auto-populates prices from the default (or client-selected) price list.

**Price List Detail Page:**
- Editable table: Product (searchable) · Unit Price · Min Qty
- "Add row" button inserts a new line
- Inline save per row

---

## 8. Module 3 — Order Management

### 8.1 Purpose

Manage the full sales order lifecycle from draft quote to delivery, including line items, payment status, and linkage to production.

### 8.2 Pages & Routes

| Route | Component | Description |
|---|---|---|
| `GET /orders` | `Orders/Index.tsx` | Orders list |
| `GET /orders/create` | `Orders/Create.tsx` | New order form |
| `GET /orders/{id}` | `Orders/Show.tsx` | Order detail |
| `GET /orders/{id}/edit` | `Orders/Edit.tsx` | Edit draft order |
| `POST /orders` | — | Store |
| `PUT /orders/{id}` | — | Update |
| `POST /orders/{id}/confirm` | — | Confirm order (draft → confirmed) |
| `POST /orders/{id}/cancel` | — | Cancel order |
| `GET /orders/{id}/pdf` | — | Generate & download PDF invoice |

### 8.3 Order Index

**Filters:** Status · Payment Status · Client · Date range · Search by order number

**Table columns:**
`Order #` · `Client` · `Date` · `Status Badge` · `Payment Badge` · `Grand Total` · `Delivery Date` · `Actions`

**Status badge color map:**
- `draft` → grey
- `confirmed` → blue
- `in_production` → amber
- `ready` → purple
- `delivered` → green
- `cancelled` → red

### 8.4 Order Create/Edit Form

**Header section:**
- Client (searchable dropdown → auto-loads contacts)
- Contact (filtered by selected client)
- Delivery Date (date picker)
- Notes (textarea)
- Price List (defaults to client's assigned price list or system default)

**Line Items table (dynamic rows):**
- Product (searchable dropdown)
- Description (auto-filled from product, editable)
- Qty (number)
- Unit Price (auto-filled from price list, editable)
- Discount % (optional)
- Line Total (computed: qty × unit_price × (1 - discount/100))
- Delete row button

**Summary panel (right-aligned):**
- Subtotal
- Discount total
- Tax (configurable rate from system settings)
- Grand Total

**Actions:**
- "Save as Draft"
- "Confirm Order" (validates all required fields, transitions status)

### 8.5 Order Detail Page

- Read-only view of all order data
- Status timeline (horizontal stepper showing lifecycle stages)
- Payment status section with "Mark as Paid / Partial" action
- "Create Production Job" button → pre-fills production job from order data
- "Download PDF" button → server-side PDF via Laravel's DomPDF or similar
- Interaction log (shared with client timeline)

### 8.6 Validation Rules

```
client_id:      required|exists:clients,id
delivery_date:  nullable|date|after:today
items:          required|array|min:1
items.*.product_id:  required|exists:products,id
items.*.qty:         required|numeric|min:0.01
items.*.unit_price:  required|numeric|min:0
items.*.discount_pct: nullable|numeric|between:0,100
```

---

## 9. Module 4 — Production Management

### 9.1 Purpose

Track internal production jobs tied (or not) to sales orders. Break each job into tasks, assign team members, log material consumption, and monitor progress.

### 9.2 Pages & Routes

| Route | Component | Description |
|---|---|---|
| `GET /production` | `Production/Index.tsx` | Job board / list |
| `GET /production/create` | `Production/Create.tsx` | New job form |
| `GET /production/{id}` | `Production/Show.tsx` | Job detail with tasks |
| `GET /production/{id}/edit` | `Production/Edit.tsx` | Edit job |
| `POST /production` | — | Store |
| `PUT /production/{id}` | — | Update |
| `POST /production/{id}/tasks` | — | Add task to job |
| `PUT /production/tasks/{taskId}` | — | Update task (status, assignee) |
| `DELETE /production/tasks/{taskId}` | — | Remove task |

### 9.3 Production Index — Kanban Board

Default view is a **Kanban board** with columns:
`Queued` | `In Progress` | `Paused` | `Completed`

Each card shows:
- Job number + title
- Linked order number (if any)
- Assigned user avatar
- Priority badge
- Due date (color: red if overdue)
- Task completion ratio (e.g., "3/5 tasks")

Toggle to **List view** available (same filters, tabular layout).

**Filters:** Assigned To · Priority · Date range

### 9.4 Production Job Detail

**Header:** Job number, title, status controls, priority badge, due date

**Tabs:**

1. **Tasks** — checklist/kanban of sub-tasks
   - Add task inline
   - Drag to reorder (sort_order)
   - Assign per task
   - Status toggle (todo → in_progress → done)

2. **Materials** — table of required vs. consumed materials
   - Link to product catalogue
   - "Log Consumption" button updates consumed_qty

3. **Overview** — linked order info, notes, audit trail of status changes

### 9.5 Validation Rules

```
title:       required|string|max:255
order_id:    nullable|exists:orders,id
priority:    required|in:low,normal,high,urgent
assigned_to: nullable|exists:users,id
due_date:    nullable|date
```

---

## 10. Module 5 — Procurement Management

### 10.1 Purpose

Manage supplier relationships and purchase orders for raw materials, equipment, and services.

### 10.2 Pages & Routes

| Route | Component | Description |
|---|---|---|
| `GET /procurement` | `Procurement/Index.tsx` | PO list |
| `GET /procurement/create` | `Procurement/Create.tsx` | New PO |
| `GET /procurement/{id}` | `Procurement/Show.tsx` | PO detail |
| `GET /procurement/{id}/edit` | `Procurement/Edit.tsx` | Edit draft PO |
| `POST /procurement` | — | Store |
| `PUT /procurement/{id}` | — | Update |
| `POST /procurement/{id}/receive` | — | Mark items as received |
| `GET /procurement/suppliers` | `Procurement/Suppliers.tsx` | Supplier list |
| `GET /procurement/suppliers/create` | `Procurement/SupplierCreate.tsx` | New supplier |
| `GET /procurement/suppliers/{id}` | `Procurement/SupplierShow.tsx` | Supplier profile |

### 10.3 PO Index

**Filters:** Status · Supplier · Date range · Search by PO number

**Table columns:**
`PO #` · `Supplier` · `Status Badge` · `Expected Date` · `Total Amount` · `Actions`

### 10.4 PO Create/Edit Form

Same dynamic line-item pattern as Orders:
- Supplier (searchable dropdown)
- Expected Delivery Date
- Line items: Product · Description · Qty · Unit Cost · Line Total
- Notes

### 10.5 Goods Receiving

- "Receive Items" action on a confirmed PO opens a modal
- Shows each PO line with outstanding qty
- User enters actually received qty per line
- System updates `received_qty` and transitions status:
  - All items fully received → `received`
  - Partial → `partial`
- Future: create inventory adjustment entry (Phase 3+)

### 10.6 Supplier Profile

- Company info card
- All POs linked to this supplier (list)
- Total spend (aggregate)
- Notes/payment terms

---

## 11. Module 6 — Human Resource Management (HRM)

### 11.1 Purpose

Manage employee records, departmental structure, leave requests, and basic attendance logging.

### 11.2 Pages & Routes

| Route | Component | Description |
|---|---|---|
| `GET /hrm` | `HRM/Index.tsx` | Employee directory |
| `GET /hrm/create` | `HRM/Create.tsx` | New employee |
| `GET /hrm/{id}` | `HRM/Show.tsx` | Employee profile |
| `GET /hrm/{id}/edit` | `HRM/Edit.tsx` | Edit employee |
| `POST /hrm` | — | Store |
| `PUT /hrm/{id}` | — | Update |
| `GET /hrm/departments` | `HRM/Departments.tsx` | Department management |
| `GET /hrm/leave` | `HRM/Leave.tsx` | Leave request list (admin) |
| `POST /hrm/leave` | — | Submit leave request |
| `PUT /hrm/leave/{id}/approve` | — | Approve leave |
| `PUT /hrm/leave/{id}/reject` | — | Reject leave |
| `GET /hrm/attendance` | `HRM/Attendance.tsx` | Attendance log view |
| `POST /hrm/attendance` | — | Log attendance |

### 11.3 Employee Directory

**Filters:** Department · Employment Type · Active/Terminated · Search by name

**Grid view** (avatar cards) with toggle to list view.

**Card shows:** Avatar initials, full name, job title, department, status dot.

### 11.4 Employee Profile

**Tabs:**

1. **Profile** — personal info, contact, employment details, salary (masked by default)
2. **Leave** — history of leave requests for this employee + submit new request
3. **Attendance** — monthly attendance log, hours summary
4. **Documents** — file attachments (contracts, ID copies — stored via Laravel Storage)

### 11.5 Leave Management (Admin View)

- Table of all pending leave requests
- Filter by status, employee, department, date
- Approve/Reject inline with optional rejection note

### 11.6 Validation Rules

```
employee_number: required|unique:employees,employee_number,{id}
first_name:      required|string|max:100
last_name:       required|string|max:100
department_id:   required|exists:departments,id
employment_type: required|in:full_time,part_time,contract
date_hired:      required|date
salary:          nullable|numeric|min:0
```

---

## 12. Module 7 — Photo/Video Studio Management

### 12.1 Purpose

Manage studio resource availability and shoot bookings. Assign crew, link bookings to client orders, and prevent double-booking of equipment and spaces.

### 12.2 Pages & Routes

| Route | Component | Description |
|---|---|---|
| `GET /studio` | `Studio/Index.tsx` | Calendar / booking overview |
| `GET /studio/create` | `Studio/Create.tsx` | New booking form |
| `GET /studio/{id}` | `Studio/Show.tsx` | Booking detail |
| `GET /studio/{id}/edit` | `Studio/Edit.tsx` | Edit booking |
| `POST /studio` | — | Store booking |
| `PUT /studio/{id}` | — | Update booking |
| `DELETE /studio/{id}` | — | Cancel booking |
| `GET /studio/resources` | `Studio/Resources.tsx` | Resource list |
| `POST /studio/resources` | — | Create resource |
| `PUT /studio/resources/{id}` | — | Update resource |

### 12.3 Studio Calendar View

**Default view:** Week calendar (7-day grid, time slots from 06:00–22:00)  
**Toggle views:** Day · Week · Month (month shows booking density)

**Booking block on calendar:**
- Title of booking
- Client name
- Status color (tentative=grey, confirmed=blue, in_progress=amber, completed=green)
- Click → opens detail panel/modal

**Sidebar panel (calendar page):**
- Resource availability legend
- Quick filter by resource type
- "+ New Booking" button

### 12.4 Booking Form

**Fields:**
- Title (required)
- Client (searchable, optional)
- Linked Order (optional, filtered by selected client)
- Status (tentative / confirmed)
- Start Date & Time
- End Date & Time
- Resources (multi-select checkbox list of available resources)
  - System checks availability: if any selected resource has an overlapping confirmed booking, show inline conflict warning — do not block submission for tentative bookings, but block for confirmed ones
- Crew (multi-select from users/employees, with role in shoot text field)
- Notes

### 12.5 Resource Management

**List of studio resources:**
- Type filter: Studio Room · Camera · Lighting · Prop · Vehicle
- Toggle availability (is_available flag for maintenance/off-rotation)

**Resource card:** Name, type badge, availability toggle, linked bookings count.

### 12.6 Conflict Detection (Backend)

```php
// In StudioService::checkConflicts()
// Query: bookings that overlap with requested time window
// for each requested resource_id
// Condition: start_datetime < requested_end AND end_datetime > requested_start
// AND status NOT IN ('cancelled') AND studio_booking_id != current_id
```

Return conflicts as a list of `[resource_name, conflicting_booking_title, time_window]`.

---

## 13. Module 8 — Administration

### 13.1 Purpose

Centralized system configuration, user management, role/permission assignment, and audit trail visibility.

### 13.2 Pages & Routes

| Route | Component | Description |
|---|---|---|
| `GET /admin` | `Admin/Index.tsx` | Admin dashboard / overview |
| `GET /admin/users` | `Admin/Users/Index.tsx` | User list |
| `GET /admin/users/create` | `Admin/Users/Create.tsx` | Invite/create user |
| `GET /admin/users/{id}/edit` | `Admin/Users/Edit.tsx` | Edit user & role |
| `POST /admin/users` | — | Create user |
| `PUT /admin/users/{id}` | — | Update user |
| `DELETE /admin/users/{id}` | — | Deactivate user |
| `GET /admin/roles` | `Admin/Roles/Index.tsx` | Role list |
| `GET /admin/roles/create` | `Admin/Roles/Create.tsx` | New role |
| `GET /admin/roles/{id}/edit` | `Admin/Roles/Edit.tsx` | Edit role + permissions |
| `POST /admin/roles` | — | Store role |
| `PUT /admin/roles/{id}` | — | Update role + permissions |
| `GET /admin/audit-logs` | `Admin/AuditLogs.tsx` | Audit log viewer |
| `GET /admin/settings` | `Admin/Settings.tsx` | System settings |
| `PUT /admin/settings` | — | Save settings |

### 13.3 User Management

**User list table:**
`Avatar` · `Name` · `Email` · `Role` · `Status (Active/Inactive)` · `Last Login` · `Actions`

**Create/Edit user form:**
- Name, Email, Role (dropdown), Password (create only), is_active toggle
- On create: send email invitation (queued job)

### 13.4 Role & Permission Management

**Role edit page:**
- Role name + display name fields
- Permission matrix: grouped by module, checklist of permissions
- Save assigns permissions via `role_permission` pivot

### 13.5 System Settings

Stored in a `settings` key-value table or `.env`-backed config:

| Setting Key | Description | Default |
|---|---|---|
| `company_name` | Shown in header and PDFs | "DPS-ERP" |
| `company_logo` | File upload, stored in storage | null |
| `default_currency` | ISO currency code | "USD" |
| `default_tax_rate` | Percentage applied to orders | 0 |
| `date_format` | Display format for dates | "Y-m-d" |
| `timezone` | App timezone | "UTC" |
| `default_price_list_id` | FK to price_lists | null |

### 13.6 Audit Logs

- Full-text searchable log of all model CRUD events
- Filters: User · Model Type · Action (created/updated/deleted) · Date range
- Each row expandable to show `old_values` vs `new_values` JSON diff

**Implementation:** Use a Laravel Observer on each model to write to `audit_logs`. Register observers in `AppServiceProvider`.

---

## 14. API Route Map

All routes are Inertia (web) routes returning React page components, not JSON responses, unless noted.

```php
// routes/web.php

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // CRM
    Route::resource('crm', CrmController::class);
    Route::post('/crm/{client}/interactions', [CrmController::class, 'logInteraction']);

    // Products
    Route::resource('products', ProductController::class);
    Route::resource('products/categories', ProductCategoryController::class)->except(['show']);
    Route::resource('products/price-lists', PriceListController::class);

    // Orders
    Route::resource('orders', OrderController::class);
    Route::post('/orders/{order}/confirm', [OrderController::class, 'confirm']);
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel']);
    Route::get('/orders/{order}/pdf', [OrderController::class, 'downloadPdf']);

    // Production
    Route::resource('production', ProductionController::class);
    Route::resource('production.tasks', ProductionTaskController::class)->shallow();

    // Procurement
    Route::resource('procurement', ProcurementController::class);
    Route::post('/procurement/{po}/receive', [ProcurementController::class, 'receive']);
    Route::resource('procurement/suppliers', SupplierController::class);

    // HRM
    Route::resource('hrm', HrmController::class);
    Route::resource('hrm/departments', DepartmentController::class)->except(['show']);
    Route::resource('hrm/leave', LeaveController::class)->except(['edit', 'update']);
    Route::put('/hrm/leave/{leave}/approve', [LeaveController::class, 'approve']);
    Route::put('/hrm/leave/{leave}/reject', [LeaveController::class, 'reject']);
    Route::resource('hrm/attendance', AttendanceController::class)->only(['index', 'store']);

    // Studio
    Route::resource('studio', StudioController::class);
    Route::resource('studio/resources', StudioResourceController::class)->except(['show']);

    // Admin
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('index');
        Route::resource('users', AdminUserController::class)->except(['show']);
        Route::resource('roles', AdminRoleController::class)->except(['show']);
        Route::get('audit-logs', [AuditLogController::class, 'index'])->name('audit-logs');
        Route::get('settings', [SettingsController::class, 'edit'])->name('settings');
        Route::put('settings', [SettingsController::class, 'update'])->name('settings.update');
    });

});
```

---

## 15. UI/UX Standards & Component Library

### 15.1 Glassmorphism Implementation

Apply the following Tailwind/CSS pattern to all card surfaces:

```tsx
// GlassCard component
<div className="
  bg-white/8
  backdrop-blur-xl
  border border-white/15
  rounded-2xl
  shadow-[0_8px_32px_rgba(0,0,0,0.12)]
  p-6
">
```

### 15.2 Shared Components to Build

| Component | Description |
|---|---|
| `GlassCard` | Base card surface with glassmorphism styles |
| `PageHeader` | Title + breadcrumb + primary action button |
| `DataTable` | Sortable, filterable table with pagination |
| `StatusBadge` | Colored pill for enum statuses |
| `SearchInput` | Debounced search with clear button |
| `ConfirmModal` | Reusable delete/action confirmation dialog |
| `FormField` | Label + input + error message wrapper |
| `AvatarInitials` | Fallback avatar from name initials |
| `EmptyState` | Illustration + message for empty lists |
| `Kanban` | Drag-and-drop board (Production module) |
| `CalendarGrid` | Week/month calendar (Studio module) |
| `LineItemTable` | Dynamic add/remove rows (Orders, PO) |
| `Timeline` | Vertical event list (CRM interactions) |

### 15.3 Form Conventions

- All forms use `React Hook Form` + `Zod` schema validation.
- Validation errors come from the server (Inertia `errors` prop) and are displayed inline below each field.
- Required fields marked with `*` label suffix.
- Submit buttons show loading spinner during Inertia form submission.
- Unsaved change warning (browser `beforeunload`) on all create/edit pages.

### 15.4 Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| `< 768px` | Mobile: bottom nav, stacked layouts, full-width modals |
| `768px – 1024px` | Tablet: sidebar collapsed by default |
| `> 1024px` | Desktop: sidebar expanded by default |

### 15.5 Motion Guidelines (Framer Motion)

- Page transitions: `opacity 0→1, y 8→0, duration 0.2s`
- Card appear: staggered children with `delay: index * 0.05s`
- Modal: `scale 0.95→1, opacity 0→1, duration 0.15s`
- Sidebar collapse: `width` tween, `duration 0.2s, ease: easeInOut`
- Do NOT animate: table rows, form inputs, status badges (keep UI snappy)

---

## 16. Implementation Roadmap

### Phase 1 — Foundation (Week 1–2)

- [ ] Laravel 12 project setup with Inertia + React 19 + TypeScript
- [ ] Tailwind CSS v4 + Shadcn UI installation and theme configuration
- [ ] Database migrations for all tables (Section 3)
- [ ] Laravel Breeze authentication (login, logout, password reset)
- [ ] `admin` role seeded, middleware configured
- [ ] `AppLayout.tsx` with Header, Sidebar, BottomNav (all navigation wired)
- [ ] Dashboard placeholder page
- [ ] Audit log observer registered globally
- [ ] Base components: GlassCard, PageHeader, DataTable, StatusBadge, FormField

### Phase 2 — Core Sales Cycle (Week 3–5)

- [ ] Module 2: Products, Categories, Price Lists (full CRUD)
- [ ] Module 1: CRM — Clients, Contacts, Interaction Timeline
- [ ] Module 3: Orders — Create, Line Items, Confirm, PDF download, Status lifecycle
- [ ] Notification system (bell icon + database notifications)

### Phase 3 — Operations (Week 6–8)

- [ ] Module 4: Production — Kanban board, Tasks, Materials
- [ ] Module 5: Procurement — Suppliers, POs, Goods Receiving
- [ ] Module 7: Studio — Calendar, Bookings, Resource conflict detection

### Phase 4 — People & Admin (Week 9–10)

- [ ] Module 6: HRM — Employees, Departments, Leave, Attendance
- [ ] Module 8: Administration — Users, Roles, Permissions matrix, Settings, Audit Logs

### Phase 5 — Polish & Hardening (Week 11–12)

- [ ] Global search implementation (across clients, orders, jobs)
- [ ] Dashboard KPI widgets (order totals, production summary, upcoming bookings)
- [ ] Mobile UX pass (bottom nav, drawer, responsive tables)
- [ ] Framer Motion page transitions and micro-interactions
- [ ] Unit tests (PHPUnit) for all Service classes
- [ ] Feature tests (Pest) for all critical routes
- [ ] Performance: eager loading, pagination on all lists, query logging in dev

---

## 17. Non-Functional Requirements

### 17.1 Performance

- All index pages must paginate at 25 rows per page (configurable).
- Eager load all relationships used in list views to avoid N+1 queries.
- Use Laravel's `cache()` for system settings (invalidate on save).
- Target < 300ms server response for Inertia page loads.

### 17.2 Security

- All routes behind `auth` middleware.
- CSRF protection via Laravel's default token (Inertia handles this automatically).
- All user inputs validated via FormRequest classes — no raw `$request->all()`.
- Passwords hashed with Bcrypt (Laravel default).
- Admin actions (user management, role changes) logged to `audit_logs`.
- File uploads: validate MIME type + max size (10MB) server-side.

### 17.3 Accessibility

- All interactive elements keyboard-navigable.
- ARIA labels on icon-only buttons.
- Color is never the sole indicator of status (always pair with text or icon).
- Minimum contrast ratio: 4.5:1 for body text.

### 17.4 Testing Strategy

| Layer | Tool | Coverage Target |
|---|---|---|
| Unit (Services) | PHPUnit | All business logic methods |
| Feature (Routes) | Pest | All CRUD routes, auth checks |
| Frontend | Vitest + React Testing Library | Shared components |
| E2E (optional) | Playwright | Critical user flows (login, create order) |

### 17.5 Environment Variables Required

```env
APP_NAME="DPS-ERP"
APP_ENV=local
APP_KEY=
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dps_erp
DB_USERNAME=root
DB_PASSWORD=

FILESYSTEM_DISK=local

MAIL_MAILER=smtp
MAIL_HOST=
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS="noreply@dps-erp.com"

QUEUE_CONNECTION=database
```

---

*Document maintained by: DPS Engineering*  
*Last updated: 2026*
