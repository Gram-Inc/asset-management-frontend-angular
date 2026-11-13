const { spawnSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');
const project = process.env.CLOUDFLARE_PAGES_PROJECT || 'lunar';
const output = 'dist/asset-management-frontend-angular';
const api = (process.env.API_BASE_URL || '').trim().replace(/\/$/, '');

if (!api) {
  console.error('Set API_BASE_URL to the Render API origin, with no trailing slash.');
  console.error('Example: API_BASE_URL=https://lunar-api.onrender.com npm run deploy');
  process.exit(1);
}

const env = { ...process.env, API_BASE_URL: api };
const build = spawnSync('npm', ['run', 'build'], {
  cwd: root,
  env,
  stdio: 'inherit',
});
if (build.status !== 0) process.exit(build.status || 1);

const whoami = spawnSync('npx', ['wrangler', 'whoami'], {
  cwd: root,
  stdio: 'inherit',
});
if (whoami.status !== 0) {
  console.error('Sign in to Cloudflare first: npx wrangler login');
  process.exit(whoami.status || 1);
}

const listed = spawnSync('npx', ['wrangler', 'pages', 'project', 'list'], {
  cwd: root,
  encoding: 'utf8',
});
const alreadyExists = (listed.stdout || '').includes(project);
if (!alreadyExists) {
  const created = spawnSync(
    'npx',
    ['wrangler', 'pages', 'project', 'create', project, '--production-branch', 'master'],
    { cwd: root, stdio: 'inherit' },
  );
  if (created.status !== 0) process.exit(created.status || 1);
}

const deploy = spawnSync(
  'npx',
  [
    'wrangler',
    'pages',
    'deploy',
    output,
    '--project-name',
    project,
    '--commit-dirty',
  ],
  { cwd: root, stdio: 'inherit' },
);
if (deploy.status !== 0) process.exit(deploy.status || 1);

console.log(`Pages project: ${project}`);
console.log(`API used for this build: ${api}`);
console.log('On Render, CORS_ORIGIN must include this site, for example:');
console.log(`https://${project}.pages.dev,https://*.${project}.pages.dev`);
