import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {
    margin: 0;
    width: 1920px;
    height: 1080px;
    background: #0f172a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Segoe UI', sans-serif;
    color: white;
  }
  h1 { font-size: 64px; }
</style>
</head>
<body>
  <h1>Test 16:9 Render</h1>
</body>
</html>`;

fs.writeFileSync('test_render.html', html);

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlUrl = 'file:///' + path.resolve('test_render.html').replace(/\\/g, '/');
const outPng = path.resolve('test_render.png');

console.log('Rendering...');
execSync(`"${chromePath}" --headless --disable-gpu --screenshot="${outPng}" --window-size=1920,1080 --hide-scrollbars "${htmlUrl}"`);
console.log('Rendered:', fs.existsSync(outPng), fs.statSync(outPng).size);
