# COD Orders Feature Documentation

## Overview
This feature enhances the admin dashboard to specifically track and manage Cash on Delivery (COD) orders. It provides a dedicated view for COD orders with detailed information and management capabilities.

## Components

### 1. CodOrdersTab.jsx
A dedicated tab in the admin dashboard for viewing all COD orders with:
- Search functionality
- Order statistics (total COD orders, total value, pending orders)
- Detailed table view of COD orders
- Ability to view individual order details

### 2. CodOrderDetail.jsx
Detailed view for individual COD orders with:
- Customer information
- Shipping address
- Order items with pricing
- Payment information specific to COD
- Status update functionality
- Invoice download capability

### 3. CodOrdersSummary.jsx
Summary component displayed on the main dashboard showing:
- Total COD orders count
- Total COD value
- Pending COD orders count
- Recent COD orders list

## Features

### COD Order Identification
The system identifies COD orders by checking the paymentMethod field for:
- "Cash on Delivery"
- "COD"
- Any variation containing "cash" or "cod" (case insensitive)

### Order Management
- Update order status (Processing, Shipped, Delivered, Cancelled)
- Download invoices for COD orders
- View detailed order information

### Statistics
The dashboard provides real-time statistics for COD orders:
- Total number of COD orders
- Total value of COD orders
- Number of pending COD orders

## Routes
- `/admin-dashboard` - Main admin dashboard with COD orders tab
- `/dashboard` - Main dashboard with COD orders summary

## Implementation Details
The feature integrates with the existing Firebase data structure and uses the same order collection. No changes to the database schema were required.

## Usage
1. Navigate to the Admin Dashboard
2. Click on the "COD Orders" tab
3. View the list of all COD orders
4. Use search to filter orders
5. Click "View" to see detailed order information
6. Update order status as needed
7. Download invoices when required