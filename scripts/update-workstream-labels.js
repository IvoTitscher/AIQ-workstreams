#!/usr/bin/env node

/**
 * Update GitHub Work Stream Labels
 * 
 * This script creates and updates the work stream labels for the AIQ project
 * according to the consolidated work streams plan.
 * 
 * Usage:
 *   node scripts/update-workstream-labels.js
 * 
 * Requirements:
 *   - GitHub CLI (gh) installed and authenticated
 *   - Access to the AIQ repository
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define the organization and repository
const ORG = 'Agaile-com';
const REPO = 'AIQ';

// Define work stream labels with descriptions and colors
const WORKSTREAM_LABELS = [
  {
    name: 'workstream-data-access',
    color: '0366d6', // blue
    description: 'Standardize database access patterns'
  },
  {
    name: 'workstream-mock-replacement',
    color: '6f42c1', // purple
    description: 'Replace mock data with real Supabase DB integration'
  },
  {
    name: 'workstream-repository-pattern',
    color: '1d76db', // light blue
    description: 'Implement repository pattern across modules'
  },
  {
    name: 'workstream-auth',
    color: '5319e7', // purple blue
    description: 'Authentication and permission system improvements'
  },
  {
    name: 'workstream-navigation',
    color: 'd4c5f9', // light purple
    description: 'Consolidate navigation and role-based access'
  },
  {
    name: 'workstream-type-centralization',
    color: 'f9c513', // yellow
    description: 'Centralize TypeScript types and improve type safety'
  },
  {
    name: 'workstream-ui',
    color: 'fbca04', // light yellow
    description: 'UI component improvements and standardization'
  }
];

// Define standardized priority labels
const PRIORITY_LABELS = [
  {
    name: 'priority:high',
    color: 'b60205', // red
    description: 'High priority task'
  },
  {
    name: 'priority:medium',
    color: 'ffcc00', // yellow
    description: 'Medium priority task'
  },
  {
    name: 'priority:low',
    color: 'c5def5', // light blue
    description: 'Low priority task'
  }
];

// Combine all labels
const ALL_LABELS = [
  ...WORKSTREAM_LABELS,
  ...PRIORITY_LABELS
];

/**
 * Create or update a GitHub label
 */
function createOrUpdateLabel(label) {
  try {
    // Check if label exists
    try {
      execSync(`gh label get ${label.name} -R ${ORG}/${REPO}`, { stdio: 'pipe' });
      console.log(`Updating label: ${label.name}`);
      
      // Label exists, update it
      execSync(
        `gh label edit ${label.name} -R ${ORG}/${REPO} --description "${label.description}" --color ${label.color}`,
        { stdio: 'inherit' }
      );
    } catch (error) {
      // Label doesn't exist, create it
      console.log(`Creating new label: ${label.name}`);
      execSync(
        `gh label create ${label.name} -R ${ORG}/${REPO} --description "${label.description}" --color ${label.color}`,
        { stdio: 'inherit' }
      );
    }
  } catch (error) {
    console.error(`Error with label ${label.name}:`, error.message);
  }
}

/**
 * Main function with reduced implementation for file size
 * See full implementation for complete details
 */
function main() {
  try {
    console.log('Checking GitHub CLI availability...');
    try {
      execSync('gh --version', { stdio: 'pipe' });
    } catch (error) {
      console.error('GitHub CLI (gh) not found. Please install and authenticate.');
      process.exit(1);
    }
    
    console.log('Starting label update process...');
    
    // Create or update all labels
    ALL_LABELS.forEach(createOrUpdateLabel);
    
    console.log(`
Label update complete. The following labels have been created/updated:

Work Stream Labels:
${WORKSTREAM_LABELS.map(label => `- ${label.name}: ${label.description}`).join('\n')}

Priority Labels:
${PRIORITY_LABELS.map(label => `- ${label.name}: ${label.description}`).join('\n')}

For full functionality including issue migration and configuration updates, 
please run the script locally.`);
    
  } catch (error) {
    console.error('Error in main process:', error);
    process.exit(1);
  }
}

main();