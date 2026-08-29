import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const outputDir = path.resolve('diagrams');
const tempHtmlDir = path.resolve('diagrams/temp_html');
if (!fs.existsSync(tempHtmlDir)) {
  fs.mkdirSync(tempHtmlDir, { recursive: true });
}

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

// Common CSS styles for 16:9 PowerPoint-ready diagrams
const commonStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1920px;
    height: 1080px;
    background: #f8fafc;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    color: #1e293b;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 32px 48px;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 16px;
    margin-bottom: 24px;
  }
  .header h1 {
    font-size: 30px;
    font-weight: 700;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .header .badge {
    background: #4f46e5;
    color: #ffffff;
    font-size: 15px;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 20px;
    letter-spacing: 0.5px;
  }
  .header .subtitle {
    font-size: 15px;
    color: #64748b;
    font-weight: 500;
  }
  .canvas {
    flex: 1;
    position: relative;
    background: #ffffff;
    border-radius: 16px;
    border: 1.5px solid #e2e8f0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    padding: 24px;
    overflow: hidden;
  }
  .card {
    background: #ffffff;
    border: 1.5px solid #cbd5e1;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.03);
    position: absolute;
  }
  .card-header {
    background: #f1f5f9;
    padding: 10px 16px;
    font-weight: 700;
    font-size: 16px;
    border-bottom: 1.5px solid #cbd5e1;
    border-radius: 10px 10px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .card-header.indigo { background: #e0e7ff; color: #3730a3; border-color: #c7d2fe; }
  .card-header.emerald { background: #d1fae5; color: #065f46; border-color: #a7f3d0; }
  .card-header.amber { background: #fef3c7; color: #92400e; border-color: #fde68a; }
  .card-header.sky { background: #e0f2fe; color: #0369a1; border-color: #bae6fd; }
  .card-header.purple { background: #f3e8ff; color: #6b21a8; border-color: #e9d5ff; }
  .card-body {
    padding: 12px 16px;
    font-size: 13.5px;
    line-height: 1.5;
  }
`;

console.log('Rendering engine initialized.');
