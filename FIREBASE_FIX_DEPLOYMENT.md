# Firebase Rules Fix Deployment Instructions

## Overview
This document provides instructions to deploy the updated Firebase database rules that fix the "Permission denied" error during authentication.

## Prerequisites
1. Node.js installed on your system
2. Firebase CLI installed globally

## Installation Steps

### 1. Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Deploy the Updated Rules
From your project root directory, run:
```bash
firebase deploy --only database:rules
```

## Alternative Deployment Method

You can also run the automated deployment script:
```bash
node src/utils/deployFirebaseRules.js
```

## Verification

After deployment, test the authentication:
1. Try to log in with existing credentials
2. Try to register a new user
3. Verify that no "Permission denied" errors occur

## Troubleshooting

If you still encounter permission errors:

1. Check that the rules were deployed successfully by viewing them in the Firebase Console
2. Ensure you're using the correct Firebase project
3. Verify that the Realtime Database is enabled in your Firebase project
4. Check Firebase console logs for specific error details

## Updated Rules Summary

The updated database.rules.json now includes proper permissions for:
- Users to read and write their own data
- Users to check their admin status
- Public access to visitors data (as before)