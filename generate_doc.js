const fs = require('fs');

// We can just require the questions if we pull them out, or read the file and eval it.
const content = fs.readFileSync('rebuild_visteon_js.js', 'utf8');

// A bit hacky but works since we know the file structure
const startIndex = content.indexOf('const questions = [');
const endIndex = content.indexOf('];', startIndex) + 2;
const arrayString = content.substring(startIndex, endIndex).replace('const questions = ', '');

const questions = eval(arrayString);
// Now `questions` is an array of the 21 objects

let md = `# Visteon Assessment Guide

This document contains the detailed login procedures for both candidates and administrators, as well as the complete list of the 21 exclusive C programming challenges for Visteon.

---

## 1. Access Instructions

### Candidate Login (Visteon Employees)
1. Navigate to: [VirtualLab Visteon Portal](https://virtuallab-7olf.onrender.com/?client=visteon) (or the dedicated branded link).
2. Enter your full name and your official Visteon email address (e.g., \`user@visteon.com\`).
3. Click "Access VirtualLab".
4. Check your email for a 6-digit OTP (One-Time Password).
5. Enter the OTP into the platform. You will be immediately directed to the "Visteon Embedded Lab" containing the 21 questions.

*Note: The platform restricts access to authorized Visteon domains and whitelisted emails. Public emails (gmail, yahoo) are blocked.*

### Administrator Login (HR / Technical Managers)
1. Navigate to the same portal.
2. In the top-right corner of the login screen, click the small "Admin" link.
3. Provide your pre-configured Admin credentials. (Please check with your platform engineer for the secure Admin password).
4. Upon secure login, you will access the Admin Dashboard where you can:
    - View all candidate submissions in real-time.
    - Review syntax, logic, and automated test scores.
    - Check for cheating violations (tab switching, copy-pasting).
    - Manage candidates in the system.

---

## 2. Visteon Challenge Curriculum (21 Problems)

The following 21 problems are specifically designed to test embedded automotive software logic in C.

`;

questions.forEach(q => {
    md += `### ${q.title}
**Difficulty:** ${q.difficulty} | **Points:** ${q.points}

**Problem Statement:**
${q.statement}

**Acceptance Criteria:**
${q.acceptance.map(a => '- ' + a).join('\n')}

**Test Cases:**
`;

    q.testCases.forEach(tc => {
        md += `- **Input:** \`${tc.stdin}\` -> **Expected Output:** \`${tc.expectedOutput.replace(/\n/g, '\\n')}\`\n`;
    });
    md += '\n---\n\n';
});

fs.writeFileSync('VISTEON_ASSESSMENT_GUIDE.md', md);
console.log('Successfully generated VISTEON_ASSESSMENT_GUIDE.md');
