#!/usr/bin/env node

/**
 * Utility script to deploy Firebase rules
 * This script helps automate the deployment of Firebase database rules
 */

const { exec } = require('child_process');
const path = require('path');

// Function to deploy Firebase rules
function deployFirebaseRules() {
  console.log('Deploying Firebase rules...');
  
  // Check if Firebase CLI is installed
  exec('firebase --version', (error, stdout, stderr) => {
    if (error) {
      console.error('Firebase CLI is not installed. Please install it first:');
      console.log('npm install -g firebase-tools');
      return;
    }
    
    console.log(`Firebase CLI version: ${stdout.trim()}`);
    
    // Login to Firebase (if not already logged in)
    exec('firebase login', (loginError, loginStdout, loginStderr) => {
      if (loginError) {
        console.error('Failed to login to Firebase:', loginError.message);
        return;
      }
      
      console.log('Successfully logged in to Firebase');
      
      // Deploy database rules
      exec('firebase deploy --only database:rules', (deployError, deployStdout, deployStderr) => {
        if (deployError) {
          console.error('Failed to deploy Firebase rules:', deployError.message);
          console.error('stderr:', deployStderr);
          return;
        }
        
        console.log('Firebase rules deployed successfully!');
        console.log(deployStdout);
      });
    });
  });
}

// Run the deployment function
if (require.main === module) {
  deployFirebaseRules();
}

module.exports = { deployFirebaseRules };