# Trattoria Demi Website, Reservations & Management Platform

### Overview
Trattoria Demi, a local restaurant in Evanston, IL, was operating with outdated systems. Payroll was calculated with pen and paper, and stored in a filing cabinet, their online presence was a static WordPress site built from archaic templates, and they paid over $1,000 monthly to OpenTable for basic reservation management.

This full stack application consists of three distinct sections built to solve these issues:

* **Public Website** - Customer-facing site with menu, online reservations, contact form, gift card ordering, gallery, and FAQs, optimized for mobile & desktop
* **Reservation PWA** - iPad-optimized progressive web app for in-house reservation management
* **Admin Dashboard** - Desktop dashboard for payroll processing, employee management, and operational analytics

<br/> 

## Tech Stack 

### Frontend
* Framework: React
* Language: JavaScript
* Styling: CSS
* Data Visualization: Nivo Charts
* State Management: React Context
* HTTP Client: Axios
* Authentication: JWT-based token validation powered by Userfront
* Deployment: Vercel

### Backend
* Runtime: Node
* Framework: Express.js
* Database: MongoDB
* Deployment: Render

<br/>

## Integrations

* Stripe - Gift card payment processing 
* Userfront - Dashboard authentication
* Mapbox - Location services and directions
* Twilio - SMS notifications for reservations
* Resend - Email communications and purchasing confirmations

<br/>

## API Architecture

### Endpoints

#### Reservations
- `GET /api/reservations/id/:id` - Retrieves reservation details by ID
- `GET /api/reservations/date/:date` - Returns all reservations for a specific date
- `GET /api/reservations/timelist` - Returns available time slots for a given date
- `GET /api/reservations/check` - Validates reservation availability and returns recommended times
- `POST /api/reservations/` - Creates reservation with availability validation
- `POST /api/reservations/override` - Creates admin reservation bypassing availability validation
- `PATCH /api/reservations/id/:id/state/:state` - Updates reservation status (arrived, cancelled, no-show)
- `PUT /api/reservations/id/:id` - Modifies existing reservation details
- `GET /api/reservations/stats` - Aggregates reservation analytics

#### Time Blocks
- `GET /api/reservations/timeblock` - Returns all scheduled closures and blocked times
- `POST /api/reservations/timeblock` - Creates new time block for closures or special events
- `PUT /api/reservations/timeblock/:id` - Updates existing time block
- `DELETE /api/reservations/timeblock/:id` - Removes time block

#### Menu
- `GET /api/order/menus` - Retrieves current menu data for online ordering
- `GET /api/order/menu-check` - Checks for menu updates to trigger client refresh

#### Online Ordering (in development)
- `GET /api/order/today` - Returns all orders for current day
- `GET /api/order/id/:id` - Retrieves specific order details
- `GET /api/order/status` - Returns online ordering system status (open/closed)
- `POST /api/order/checkout` - Processes delivery order with Stripe payment
- `POST /api/order/pickup` - Creates pickup order
- `PATCH /api/order/id/:id` - Confirms order and sets pickup time
- `PATCH /api/order/status` - Updates system availability status
- `PUT /api/order/id/:id` - Marks order as complete
- `DELETE /api/order/id/:id` - Cancels and removes order

#### Payroll
- `GET /api/payroll/employees` - Returns all employee records
- `GET /api/payroll/` - Retrieves payroll data for specific period
- `GET /api/payroll/graph` - Returns historical payroll data for chart visualization
- `POST /api/payroll/` - Saves processed payroll for a pay period
- `PUT /api/payroll/employee` - Updates employee information
- `DELETE /api/payroll/period/:period` - Deletes payroll record by period

#### Gift Cards
- `POST /api/giftcard` - Initiates gift card purchase with Stripe checkout
- `GET /api/giftcard/all` - Returns all giftcard records
- `GET /api/giftcard/stats` - Aggregates gift card analytics

#### Stripe
- `POST /payment-webhook` - Webhook to handle completed giftcard and ordering checkout sessions
  
#### Contact
- `POST /api/messages` - Submits customer contact form inquiry

<br/>

## Public Website

Landing Page with custom SVG animation
> https://www.trattoriademi.com/home

https://github.com/user-attachments/assets/e35d8d92-c4e5-423d-a011-f79018fc25c3

<br/>

Public facing reservation form
> https://www.trattoriademi.com/reserve

https://github.com/user-attachments/assets/3e08e4ef-dd81-4fcb-94b9-572ccf06829f

Upon successful reservation, customers are sent a text containing the relevant reservation information as well as a link where they can manage or cancel their reservation.
Texts are additionally sent when the reservation is updated, or canceled. 

<br/>

## Reservation PWA
Optimized for iPad Mini and other mobile devices.

- The main dashboard displays all active reservations organized by time slot, with real-time, server side event (SSE) driven change tracking. 
- Employees can quickly check guests in, mark no-shows, or cancel reservations.
- Each reservation includes a detailed timeline showing the full history of modifications.

###### Names have been changed for privacy
<img width="49%" height="50%" alt="Trattoria Demi PWA Reservations" src="https://github.com/user-attachments/assets/147d8f28-11cc-4954-81c5-525c14a7b219" />
<img width="49%" height="50%" alt="Trattoria Demi PWA Open Reservation" src="https://github.com/user-attachments/assets/93f90a00-5f66-4f33-8eca-e8af8b68e127" />


<br> <br/>

- Staff can create new reservations or modify existing ones directly from the iPad. 
- The system includes availability warnings and if needed suggests alternative time slots. 
- All create and modify actions require PIN authentication, creating an audit trail tied to individual employees for accountability.

<img width="49%" height="50%" alt="Trattoria Demi PWA New Reservation" src="https://github.com/user-attachments/assets/bdfc1840-45c1-4d71-9232-35c7a9479181" />
<img width="49%" height="50%" alt="Trattoria Demi PWA Edit Reservation" src="https://github.com/user-attachments/assets/42fbb66a-6472-4672-bce2-ebc460479288" />

<br> <br/>

## Admin Dashboard

### Payroll Management

- Payroll calculation and processing with trend line.
- Employee management (create, update, deactivate).

### Reservation Analytics
- Metrics across multiple time periods (daily, weekly, monthly, yearly, all-time) displaying reservation counts and guest totals.
- Visual breakdowns show completion rates, cancellations, and no-shows by party size or over time.  
- Time Block Management to block unavailable dates/times for one offs or recurring closures. 
  
### Gift Card Analytics
- Sales distribution by denomination, and feed of recent purchases.
  
###### Names & values have been changed or omitted for privacy
<img width="2880" height="4507" alt="Trattoria Demi Admin" src="https://github.com/user-attachments/assets/19d85629-de7f-4ca0-8dab-df05925c85b3" />
