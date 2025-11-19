# Firebase Rules Deployment Guide

This guide explains how to deploy the updated Firebase security rules that allow users to cancel their own orders.

## Prerequisites

1. Firebase CLI installed
2. Logged into Firebase account with appropriate permissions
3. Project access

## Deployment Steps

### 1. Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Deploy the updated rules

From the project root directory, run:

```bash
firebase deploy --only firestore:rules
```

This will deploy the rules from the `firestore.rules` file.

## What Changed in the Rules

The updated rules now allow authenticated users to update their own orders, which is necessary for the order cancellation feature:

```javascript
// Allow authenticated users to read and write their own orders
match /orders/{document} {
  allow read: if request.auth != null && request.auth.uid == resource.data.userid;
  allow create: if request.auth != null;
  // Allow users to update their own orders (needed for cancellation)
  allow update: if request.auth != null && (request.auth.token.admin == true || request.auth.uid == resource.data.userid);
  // Only admins can delete orders
  allow delete: if request.auth != null && request.auth.token.admin == true;
}
```

## Testing the Fix

After deploying the rules:

1. Log in as a regular user
2. Place an order (or use existing order)
3. Navigate to the orders page
4. Click "Cancel Order" for an order
5. Confirm the cancellation

The operation should now succeed without the "Missing or insufficient permissions" error.

## Troubleshooting

If you still encounter permission errors:

1. Verify the rules were deployed successfully
2. Check that the user is properly authenticated
3. Ensure the order document has the correct `userid` field matching the authenticated user's UID
4. Check Firebase console logs for specific error details