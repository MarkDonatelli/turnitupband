import { spawn } from 'node:child_process';

const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'dev', '--', '--offline', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, CALENDAR_MOCK: 'true' }
});
child.on('error', error => {
  console.error(`Unable to start Netlify Dev: ${error.message}`);
  process.exitCode = 1;
});
child.on('exit', code => { process.exitCode = code ?? 1; });
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal));
}
