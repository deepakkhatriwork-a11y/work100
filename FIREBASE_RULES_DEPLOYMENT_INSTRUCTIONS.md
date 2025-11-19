# Firebase Rules Deployment Instructions

## Prerequisites

1. Install Node.js (if not already installed)
2. Install Firebase CLI globally:
   ```bash
   npm install -g firebase-tools
   ```

## Authentication

1. Login to Firebase:
   ```bash
   firebase login
   ```

## Deployment

1. Navigate to your project directory:
   ```bash
   cd c:\Users\kushal\CascadeProjects\Titanium\vite-project
   ```

2. Deploy the updated Firestore rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

## Verification

After deployment, test the order cancellation feature:
1. Log in as a regular user
2. Place an order or use an existing order
3. Navigate to the orders page
4. Click "Cancel Order" for an order
5. Confirm the cancellation succeeds without permission errors

## Troubleshooting

If you still encounter permission errors:

1. Verify the rules were deployed successfully by checking the Firebase Console
2. Ensure the order document has the correct `userid` field matching the authenticated user's UID
3. Check Firebase console logs for specific error details
4. Make sure you're using the correct Firebase project

## Updated Rules Summary

The updated rules now allow:
- Users to read their own orders (matching by userid)
- Users to update their own orders (needed for cancellation)
- Admin users (identified by email) to have full access to orders
- Proper separation between read, update, and delete permissions