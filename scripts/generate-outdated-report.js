import fs from 'fs';

const outputFolder = 'dep_report';
const outputFile = 'index.html';
const appName = process.env.APP_NAME || '';
const title = `Outdated Dependencies Report${appName ? ` (${appName})` : ''}`;
const classes = [
  'patch',
  'minor',
  'major',
  'major-zero'
];

// one ncu run per manifest
const manifests = [
  {
    label: 'package.json',
    file: 'root.txt'
  }
];

const getReportSections = (updates) => {
  const lines = updates.split('\n');
  const filteredLines = lines.slice(2, -2);
  const filteredUpdates = filteredLines.join('\n');
  return filteredUpdates.split(/(?=Patch|Minor|Major|Major version zero)/);
};

const formatDate = (date) => {
  const options = {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };
  return date.toLocaleString('en-US', options).replace(',', ' @');
};

const escapeHtml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const readManifest = ({ label, file }) => {
  const path = `${outputFolder}/${file}`;

  if (!fs.existsSync(path)) {
    return {
      label,
      sections: [],
      upToDate: false,
      missing: true
    };
  }

  const updates = fs.readFileSync(path, 'utf-8');
  const sections = getReportSections(updates).filter((section) => section.trim());

  return {
    label,
    sections,
    // ncu says so in prose rather than emitting an empty grouping
    upToDate: sections.length === 0,
    missing: false
  };
};

const renderManifest = ({ label, sections, upToDate, missing }) => {
  if (missing) {
    return `<div class="manifest"><h3>${escapeHtml(label)}</h3><p class="note">no report produced</p></div>`;
  }

  if (upToDate) {
    return `<div class="manifest"><h3>${escapeHtml(label)}</h3><p class="note">everything matches latest</p></div>`;
  }

  const rendered = sections
    .map((section, idx) => {
      const lines = section.split('\n');
      const sectionTitle = lines.shift();
      return `<div class="section ${classes[idx]}"><div class="section-title">${escapeHtml(sectionTitle)}</div><pre>${escapeHtml(lines.join('\n')).split('\n').join('<br>')}</pre></div>`;
    })
    .join('\n');

  return `<div class="manifest"><h3>${escapeHtml(label)}</h3>${rendered}</div>`;
};

const reports = manifests.map(readManifest);

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        :root {
            --background-color: #0d1117;
            --foreground-color: #151b23f2;
        }
        body {
            font-family: Arial;
            sans-serif;
            padding: 1em;
            background-color: var(--background-color);
            color: #fff;
            font-size: 1em;
            display: flex;
            flex-direction: column;
            row-gap: 1em;
        }
        h1, h3 { margin: 0 }
        pre {
            font-size: 1.2em;
        }
        .section-title { font-weight: bold; font-size: 1.5em; }
        .section {
            background-color: var(--foreground-color);
            padding: 8px;
            border-radius: 4px;
        }
        .manifest {
            display: flex;
            flex-direction: column;
            row-gap: 0.5em;
        }
        .note { color: #8b949e; margin: 0 }
        .patch { color: #45d686; }
        .minor { color: #36c7c4; }
        .major { color: #ef5042; }
        .major-zero { color: #8f8de4; }
    </style>

</head>
<body>
    <div>
        <h1>${title}</h1>
        <h4>${formatDate(new Date())}</h4>
    </div>
    ${reports.map(renderManifest).join('\n')}
</body>
</html>
`;

fs.writeFileSync(`${outputFolder}/${outputFile}`, htmlContent);

// Also emit the report into the job summary, so a failed Pages publish does not lose it entirely.
if (process.env.GITHUB_STEP_SUMMARY) {
  const summary = reports
    .map(({ label, sections, upToDate, missing }) => {
      if (missing) return `### ${label}\n\nno report produced\n`;
      if (upToDate) return `### ${label}\n\neverything matches latest\n`;
      return `### ${label}\n\n\`\`\`\n${sections.join('\n').trim()}\n\`\`\`\n`;
    })
    .join('\n');

  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## ${title}\n\n${summary}`);
}

console.log(`Report saved to ${outputFile}`);
