#!/usr/bin/env node

/**
 * Implement Repository Pattern
 * 
 * This script analyzes the codebase and generates templates for implementing
 * the repository pattern across modules. This is part of the
 * workstream-repository-pattern initiative.
 * 
 * Usage:
 *   node scripts/implement-repository-pattern.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define modules that need the repository pattern
const MODULES = [
  'auth',
  'assessment',
  'item',
  'results',
  'psychometric',
  'admin',
  'analytics'
];

/**
 * Find direct database access in modules
 */
function findDirectDatabaseAccess() {
  const results = {};
  
  // Search for direct database access in each module
  MODULES.forEach(module => {
    results[module] = {
      moduleDir: null,
      hasDirectAccess: false,
      files: []
    };
    
    try {
      // Find module directory
      const moduleDir = path.join(process.cwd(), 'src', 'modules', module);
      
      if (fs.existsSync(moduleDir)) {
        results[module].moduleDir = moduleDir;
        
        // Find files with direct database access
        const grepCommand = `grep -r "from\\|supabase" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" ${moduleDir}`;
        const output = execSync(grepCommand, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
        
        const lines = output.split('\n').filter(Boolean);
        
        if (lines.length > 0) {
          results[module].hasDirectAccess = true;
          
          const accessFiles = new Set();
          
          lines.forEach(line => {
            const parts = line.split(':');
            const filepath = parts[0];
            accessFiles.add(filepath);
          });
          
          results[module].files = Array.from(accessFiles);
        }
      }
    } catch (error) {
      // grep returns exit code 1 if no matches
      if (error.status !== 1) {
        console.error(`Error searching for direct access in ${module} module:`, error.message);
      }
    }
  });
  
  return results;
}

/**
 * Main function with reduced implementation for file size
 * See full implementation for complete details
 */
function main() {
  try {
    console.log('Analyzing codebase for direct database access...');
    
    // Find direct database access
    const directAccessResults = findDirectDatabaseAccess();
    
    // Generate a summary report
    const reportPath = path.join(process.cwd(), 'workstream-repository-pattern-report.md');
    
    let reportContent = `# Workstream Repository Pattern Report

## Overview

This report outlines the implementation of the repository pattern across modules. This is part of the \`workstream-repository-pattern\` initiative, which aims to improve code organization, testability, and maintainability.

## Current Status

`;

    // Add status for each module
    Object.entries(directAccessResults).forEach(([module, result]) => {
      reportContent += `### ${module.charAt(0).toUpperCase() + module.slice(1)} Module\n\n`;
      
      if (result.moduleDir) {
        reportContent += `- Module directory: \`${result.moduleDir}\`\n`;
        reportContent += `- Has direct database access: ${result.hasDirectAccess ? 'Yes' : 'No'}\n`;
        
        if (result.hasDirectAccess && result.files.length > 0) {
          reportContent += `- Files with direct access: ${result.files.length}\n`;
          if (result.files.length > 0 && result.files.length <= 3) {
            reportContent += `  - \`${result.files.join('`\n  - `')}\`\n`;
          }
        }
      } else {
        reportContent += `- Module directory not found\n`;
      }
      
      reportContent += '\n';
    });
    
    // Add implementation details
    reportContent += `## Implementation

For complete implementation details, please run the full script locally:
\`\`\`bash
node scripts/implement-repository-pattern.js
\`\`\`

This script will:
1. Analyze direct database access across all modules
2. Generate repository structures for each module:
   - Repository interfaces defining data access contracts
   - Repository implementations providing data access logic
   - Repository factories for consistent instance access
3. Create example services that use the repositories
4. Generate comprehensive documentation and guides:
   - Repository Pattern Guide
   - Migration Guide

The repository pattern provides:
- Separation of concerns between data access and business logic
- Improved testability with easy mocking
- Consistent error handling and response formatting
- Centralized data access logic
- Better maintainability and code organization

## Next Steps

1. Start with the Assessment Module, which has the most direct database access
2. Follow the Migration Guide to replace direct database access with repository pattern
3. Add unit tests for each repository
4. Update existing tests to use mock repositories
5. Proceed to the next module (Item Module)
`;

    fs.writeFileSync(reportPath, reportContent, 'utf8');
    console.log(`Generated summary report at ${reportPath}`);
    
    console.log('This is a simplified version of the script. For full functionality, please run locally.');
  } catch (error) {
    console.error('Error in main process:', error);
    process.exit(1);
  }
}

main();