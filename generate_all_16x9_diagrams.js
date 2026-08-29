import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const diagramsDir = path.resolve('diagrams');
const tempHtmlDir = path.resolve('diagrams/temp_html');
if (!fs.existsSync(tempHtmlDir)) {
  fs.mkdirSync(tempHtmlDir, { recursive: true });
}

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const baseStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1920px;
    height: 1080px;
    background: #f8fafc;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    color: #1e293b;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 24px 36px;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 12px;
    margin-bottom: 16px;
  }
  .header h1 {
    font-size: 26px;
    font-weight: 700;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .header .badge {
    background: #4f46e5;
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    padding: 5px 14px;
    border-radius: 20px;
    letter-spacing: 0.5px;
  }
  .header .subtitle {
    font-size: 14.5px;
    color: #64748b;
    font-weight: 500;
  }
  .canvas {
    flex: 1;
    position: relative;
    background: #ffffff;
    border-radius: 14px;
    border: 1.5px solid #cbd5e1;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    padding: 16px;
    overflow: hidden;
  }
  .uml-class {
    position: absolute;
    background: #ffffff;
    border: 2px solid #6366f1;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
    overflow: hidden;
  }
  .uml-title {
    background: #e0e7ff;
    color: #312e81;
    font-size: 16px;
    font-weight: 800;
    text-align: center;
    padding: 8px 12px;
    border-bottom: 2px solid #6366f1;
  }
  .uml-section {
    padding: 8px 12px;
    font-size: 12.5px;
    font-family: 'Consolas', 'Courier New', monospace;
    line-height: 1.45;
  }
  .uml-section.attrs {
    border-bottom: 1.5px solid #cbd5e1;
    color: #1e293b;
  }
  .uml-section.methods {
    background: #fafafa;
    color: #0f766e;
    font-weight: 600;
  }
`;

const diagrams = {};

// =============================================================================
// DIAGRAM 1: 4.1.1 USE CASE
// =============================================================================
diagrams['01_use_case'] = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
${baseStyles}
  .actor-col {
    position: absolute;
    width: 220px;
    display: flex;
    flex-direction: column;
    gap: 140px;
    z-index: 20;
  }
  .actor-card {
    background: #f8fafc;
    border: 2px solid #6366f1;
    border-radius: 16px;
    padding: 18px 14px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.12);
  }
  .actor-icon { font-size: 38px; margin-bottom: 6px; }
  .actor-title { font-size: 18px; font-weight: 800; color: #312e81; }
  .actor-desc { font-size: 12px; color: #64748b; font-weight: 600; margin-top: 2px; }
  .system-boundary {
    position: absolute;
    left: 280px;
    top: 15px;
    width: 1280px;
    height: 900px;
    border: 2.5px dashed #4f46e5;
    border-radius: 16px;
    background: #faf5ff40;
    padding: 20px 24px;
    z-index: 5;
  }
  .boundary-title {
    position: absolute;
    top: -14px;
    left: 40px;
    background: #4f46e5;
    color: white;
    padding: 4px 18px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
  .uc-grid {
    display: grid;
    grid-template-columns: 1fr 1.15fr 1.35fr;
    gap: 20px;
    height: 100%;
    padding-top: 10px;
  }
  .uc-col { display: flex; flex-direction: column; justify-content: space-around; }
  .uc-group-title {
    font-size: 13px;
    font-weight: 800;
    color: #4338ca;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    border-bottom: 1.5px solid #c7d2fe;
    padding-bottom: 4px;
    margin-bottom: 8px;
  }
  .uc-pill {
    background: #ffffff;
    border: 2px solid #818cf8;
    border-radius: 30px;
    padding: 12px 18px;
    font-size: 14.5px;
    font-weight: 700;
    color: #1e1b4b;
    text-align: center;
    box-shadow: 0 3px 8px rgba(0,0,0,0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 52px;
  }
  .uc-pill.include { background: #f0fdf4; border-color: #34d399; color: #064e3b; }
</style>
</head>
<body>
  <div class="header">
    <h1><span class="badge">Section 4.1.1</span> Use Case Diagram</h1>
    <div class="subtitle">System Actor Roles, Functional Boundaries & Include Relationships</div>
  </div>
  <div class="canvas">
    <div class="actor-col" style="left: 20px; top: 120px;">
      <div class="actor-card" id="actor-admin">
        <div class="actor-icon">🛡️</div>
        <div class="actor-title">Admin</div>
        <div class="actor-desc">System Administrator</div>
      </div>
      <div class="actor-card" id="actor-manager">
        <div class="actor-icon">💼</div>
        <div class="actor-title">Manager</div>
        <div class="actor-desc">Sales & Ops Head</div>
      </div>
    </div>

    <div class="actor-col" style="right: 20px; top: 120px;">
      <div class="actor-card" id="actor-agent">
        <div class="actor-icon">👔</div>
        <div class="actor-title">Agent</div>
        <div class="actor-desc">Sales Representative</div>
      </div>
      <div class="actor-card" id="actor-cp">
        <div class="actor-icon">🤝</div>
        <div class="actor-title">Channel Partner</div>
        <div class="actor-desc">External Broker Network</div>
      </div>
    </div>

    <div class="system-boundary">
      <div class="boundary-title">CRM System Boundary (Node.js / Express / MongoDB)</div>
      <div class="uc-grid">
        <div class="uc-col">
          <div>
            <div class="uc-group-title">1. User & Access Control</div>
            <div class="uc-pill" style="margin-bottom: 18px;">Manage Users & Roles</div>
            <div class="uc-pill">Login / Authenticate (JWT)</div>
          </div>
          <div>
            <div class="uc-group-title">2. Analytics & Audit</div>
            <div class="uc-pill">View Real-time Dashboards</div>
          </div>
        </div>

        <div class="uc-col">
          <div>
            <div class="uc-group-title">3. Project & Partner Governance</div>
            <div class="uc-pill" style="margin-bottom: 16px;">Create / Manage Projects</div>
            <div class="uc-pill" style="margin-bottom: 16px;">Assign Agents to Projects</div>
            <div class="uc-pill" style="margin-bottom: 16px;">Verify Channel Partners</div>
            <div class="uc-pill">Register as Channel Partner</div>
          </div>
        </div>

        <div class="uc-col">
          <div>
            <div class="uc-group-title">4. Lead Management Pipeline</div>
            <div class="uc-pill" style="margin-bottom: 14px;">Bulk Upload Leads via CSV</div>
            <div class="uc-pill" style="margin-bottom: 14px;">View & Filter Leads</div>
            <div class="uc-pill" style="margin-bottom: 14px;">Create Single Lead</div>
            <div class="uc-pill include" style="margin-bottom: 14px;">«include» Receive Email Alerts</div>
            <div class="uc-pill" style="margin-bottom: 14px;">Update Lead Stage / Status</div>
            <div class="uc-pill include" style="margin-bottom: 14px;">«include» Track Lead Timeline</div>
            <div class="uc-pill">Set Follow-up Date & Remarks</div>
          </div>
        </div>
      </div>
    </div>

    <svg style="position:absolute;width:100%;height:100%;pointer-events:none;z-index:10;">
      <line x1="240" y1="200" x2="310" y2="135" stroke="#4f46e5" stroke-width="2" />
      <line x1="240" y1="200" x2="310" y2="205" stroke="#4f46e5" stroke-width="2" />
      <line x1="240" y1="200" x2="720" y2="135" stroke="#4f46e5" stroke-width="2" />
      <line x1="240" y1="200" x2="720" y2="200" stroke="#4f46e5" stroke-width="2" />
      <line x1="240" y1="200" x2="720" y2="265" stroke="#4f46e5" stroke-width="2" />

      <line x1="240" y1="620" x2="310" y2="205" stroke="#0891b2" stroke-width="2" />
      <line x1="240" y1="620" x2="720" y2="135" stroke="#0891b2" stroke-width="2" />
      <line x1="240" y1="620" x2="720" y2="200" stroke="#0891b2" stroke-width="2" />
      <line x1="240" y1="620" x2="720" y2="265" stroke="#0891b2" stroke-width="2" />
      <line x1="240" y1="620" x2="1140" y2="135" stroke="#0891b2" stroke-width="2" />
      <line x1="240" y1="620" x2="1140" y2="195" stroke="#0891b2" stroke-width="2" />
      <line x1="240" y1="620" x2="1140" y2="260" stroke="#0891b2" stroke-width="2" />

      <line x1="1600" y1="200" x2="520" y2="205" stroke="#7c3aed" stroke-width="2" />
      <line x1="1600" y1="200" x2="1480" y2="195" stroke="#7c3aed" stroke-width="2" />
      <line x1="1600" y1="200" x2="1480" y2="260" stroke="#7c3aed" stroke-width="2" />
      <line x1="1600" y1="200" x2="1480" y2="400" stroke="#7c3aed" stroke-width="2" />
      <line x1="1600" y1="200" x2="1480" y2="530" stroke="#7c3aed" stroke-width="2" />

      <line x1="1600" y1="620" x2="520" y2="205" stroke="#059669" stroke-width="2" />
      <line x1="1600" y1="620" x2="1030" y2="330" stroke="#059669" stroke-width="2" />
      <line x1="1600" y1="620" x2="1480" y2="195" stroke="#059669" stroke-width="2" />
      <line x1="1600" y1="620" x2="1480" y2="260" stroke="#059669" stroke-width="2" />
    </svg>
  </div>
</body>
</html>`;

// =============================================================================
// DIAGRAM 2: 4.1.2 ACTIVITY LEAD LIFECYCLE
// =============================================================================
diagrams['02_activity_lead_lifecycle'] = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
${baseStyles}
  .pipeline-container { display: flex; justify-content: space-between; gap: 18px; height: 100%; position: relative; z-index: 5; }
  .stage-box {
    flex: 1;
    background: #f8fafc;
    border: 2px solid #cbd5e1;
    border-radius: 14px;
    padding: 16px 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .stage-tag {
    background: #3b82f6;
    color: white;
    font-size: 13px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 20px;
    margin-bottom: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .node {
    background: white;
    border: 2px solid #6366f1;
    border-radius: 12px;
    padding: 12px 14px;
    font-size: 13.5px;
    font-weight: 700;
    text-align: center;
    width: 100%;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    margin-bottom: 16px;
  }
  .decision {
    background: #fef3c7;
    border: 2px solid #f59e0b;
    border-radius: 8px;
    padding: 10px;
    font-size: 12.5px;
    font-weight: 700;
    text-align: center;
    width: 90%;
    margin-bottom: 16px;
  }
  .stage-chips { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; width: 100%; margin: 8px 0; }
  .chip {
    background: #e0e7ff;
    color: #3730a3;
    font-size: 12px;
    font-weight: 700;
    padding: 8px 6px;
    border-radius: 8px;
    text-align: center;
    border: 1px solid #c7d2fe;
  }
  .chip.booking { background: #dcfce7; color: #166534; border-color: #86efac; grid-column: span 2; }
  .start-node { width: 30px; height: 30px; background: #10b981; border-radius: 50%; margin-bottom: 12px; box-shadow: 0 0 0 4px #d1fae5; }
  .end-node { width: 32px; height: 32px; border: 3px solid #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-top: 12px; }
  .end-node::after { content: ''; width: 18px; height: 18px; background: #ef4444; border-radius: 50%; }
</style>
</head>
<body>
  <div class="header">
    <h1><span class="badge">Section 4.1.2</span> Activity Diagram: Lead Ingestion & Pipeline Lifecycle</h1>
    <div class="subtitle">Horizontal Flow: Lead Intake &rarr; Validation &rarr; Notification &rarr; Stage Progression &rarr; Timeline &rarr; Conversion</div>
  </div>
  <div class="canvas">
    <div class="pipeline-container">
      <div class="stage-box" style="border-color: #93c5fd;">
        <div class="stage-tag" style="background:#2563eb;">1. Ingestion</div>
        <div class="start-node"></div>
        <div class="node">Enter Lead Form OR Bulk CSV Upload</div>
        <div class="decision">Required Fields Valid? (Name, Email, Phone)</div>
        <div class="node" style="border-color:#ef4444; color:#b91c1c; font-size:12px;">[No] Toast Validation Error</div>
      </div>

      <div class="stage-box" style="border-color: #a7f3d0;">
        <div class="stage-tag" style="background:#059669;">2. DB Save & Alerts</div>
        <div class="node" style="margin-top:20px;">Save Lead to MongoDB<br><span style="font-size:11.5px;color:#059669;">Default Stage: <b>set-stage</b></span></div>
        <div class="node" style="border-color:#10b981; background:#ecfdf5;">Dispatch Email Alerts<br><span style="font-size:11.5px;color:#047857;">To Manager & Assigned Agents</span></div>
      </div>

      <div class="stage-box" style="border-color: #c4b5fd; flex:1.3;">
        <div class="stage-tag" style="background:#7c3aed;">3. Agent Stage Review</div>
        <div class="node">Agent Reviews Lead Profile</div>
        <div class="decision">Transition Lead Stage</div>
        <div class="stage-chips">
          <div class="chip">RNR (No Response)</div>
          <div class="chip">Follow-up</div>
          <div class="chip">Site Visit</div>
          <div class="chip">Site Visit Done</div>
          <div class="chip">Revisit</div>
          <div class="chip booking">🎉 Booking (Converted)</div>
        </div>
      </div>

      <div class="stage-box" style="border-color: #fed7aa;">
        <div class="stage-tag" style="background:#ea580c;">4. Timeline Logging</div>
        <div class="node" style="margin-top:20px;">Atomic $push to<br><b>lead.timeline</b> Array</div>
        <div class="node" style="font-size:12px; color:#475569;">Logs timestamp, stage & agent remarks</div>
        <div class="decision">Stage == Booking?</div>
      </div>

      <div class="stage-box" style="border-color: #fbcfe8;">
        <div class="stage-tag" style="background:#db2777;">5. Closure & Loop</div>
        <div class="node" style="border-color:#10b981; background:#f0fdf4; color:#15803d; font-weight:800;">
          [Yes] Lead Converted Successfully!
        </div>
        <div class="end-node"></div>
        <div class="node" style="border-color:#f59e0b; margin-top:24px; font-size:12px;">
          [No] Set Next Follow-up Date & Remarks (Loop)
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

// =============================================================================
// DIAGRAM 3: 4.1.2 ACTIVITY LOGIN
// =============================================================================
diagrams['03_activity_login'] = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
${baseStyles}
  .flow-grid { display: flex; justify-content: space-between; gap: 18px; height: 100%; }
  .flow-col {
    flex: 1;
    background: #f8fafc;
    border: 2px solid #e2e8f0;
    border-radius: 14px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .col-title {
    font-size: 14px;
    font-weight: 800;
    color: #1e293b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 14px;
    padding: 4px 12px;
    border-radius: 20px;
  }
  .node {
    background: white;
    border: 2px solid #6366f1;
    border-radius: 12px;
    padding: 14px;
    font-size: 13.5px;
    font-weight: 700;
    text-align: center;
    width: 100%;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  }
  .decision {
    background: #fef3c7;
    border: 2px solid #f59e0b;
    border-radius: 8px;
    padding: 12px;
    font-size: 13px;
    font-weight: 700;
    text-align: center;
    width: 95%;
    margin-bottom: 16px;
  }
  .err-node {
    background: #fef2f2;
    border: 1.5px solid #f87171;
    color: #991b1b;
    font-size: 12px;
    font-weight: 700;
    border-radius: 8px;
    padding: 10px;
    width: 100%;
    margin-bottom: 10px;
    text-align: center;
  }
  .route-card {
    background: #ffffff;
    border: 2px solid #3b82f6;
    border-radius: 10px;
    padding: 10px;
    width: 100%;
    margin-bottom: 10px;
    text-align: center;
    font-weight: 700;
    font-size: 13px;
  }
</style>
</head>
<body>
  <div class="header">
    <h1><span class="badge">Section 4.1.2</span> Activity Diagram: User Authentication & Role Routing</h1>
    <div class="subtitle">Horizontal Flow: Credential Input &rarr; Bcrypt Password Verification &rarr; JWT Generation &rarr; Role Dispatch</div>
  </div>
  <div class="canvas">
    <div class="flow-grid">
      <div class="flow-col">
        <div class="col-title" style="background:#e0e7ff; color:#3730a3;">1. Input Validation</div>
        <div style="width:24px;height:24px;background:#10b981;border-radius:50%;margin-bottom:12px;"></div>
        <div class="node">User Submits Email & Password</div>
        <div class="decision">Both Fields Provided?</div>
        <div class="err-node">[No] Return 400: Missing Details &rarr; End</div>
      </div>

      <div class="flow-col">
        <div class="col-title" style="background:#e0f2fe; color:#0369a1;">2. DB Lookup</div>
        <div class="node" style="margin-top:20px;">Query MongoDB<br><b>userModel.findOne({ email })</b></div>
        <div class="decision">User Exists?</div>
        <div class="err-node">[No] Return 401: Invalid Credentials &rarr; End</div>
      </div>

      <div class="flow-col">
        <div class="col-title" style="background:#fef3c7; color:#92400e;">3. Password Match</div>
        <div class="decision" style="margin-top:20px;">Bcrypt Compare Hash / Legacy Password?</div>
        <div class="err-node">[No] Return 401: Invalid Credentials &rarr; End</div>
        <div class="node" style="border-color:#10b981; background:#ecfdf5; color:#065f46;">
          [Yes] Credentials Validated
        </div>
      </div>

      <div class="flow-col">
        <div class="col-title" style="background:#fae8ff; color:#86198f;">4. Token Issue</div>
        <div class="node" style="margin-top:20px;">
          Generate JWT Token<br>
          <span style="font-size:12px;color:#701a75;">jwt.sign({ id: user._id })<br>Expires in 30 Days</span>
        </div>
        <div class="decision">Evaluate user.role</div>
      </div>

      <div class="flow-col">
        <div class="col-title" style="background:#dcfce7; color:#166534;">5. Role Routing</div>
        <div class="route-card" style="border-color:#4f46e5; color:#3730a3;">
          🛡️ Admin<br>&rarr; /admin/dashboard
        </div>
        <div class="route-card" style="border-color:#0891b2; color:#0e7490;">
          💼 Manager<br>&rarr; /manager/dashboard
        </div>
        <div class="route-card" style="border-color:#059669; color:#047857;">
          👔 Agent / Channel Partner<br>&rarr; /agent/dashboard
        </div>
        <div style="width:26px;height:26px;border:3px solid #10b981;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-top:8px;">
          <div style="width:14px;height:14px;background:#10b981;border-radius:50%;"></div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

// =============================================================================
// DIAGRAM 4: 4.1.3 SEQUENCE LOGIN
// =============================================================================
diagrams['04_sequence_login'] = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
${baseStyles}
  .seq-container { display: flex; justify-content: space-between; height: 100%; position: relative; padding: 0 40px; }
  .lifeline { display: flex; flex-direction: column; align-items: center; width: 220px; position: relative; }
  .ll-box { background: #e0e7ff; border: 2px solid #4f46e5; color: #1e1b4b; font-weight: 700; font-size: 15px; padding: 10px 16px; border-radius: 10px; text-align: center; width: 100%; z-index: 10; }
  .ll-line { flex: 1; width: 2px; background: #cbd5e1; border-left: 2px dashed #94a3b8; margin-top: 6px; }
  .msg-layer { position: absolute; top: 70px; left: 0; width: 100%; height: 840px; pointer-events: none; }
</style>
</head>
<body>
  <div class="header">
    <h1><span class="badge">Section 4.1.3</span> Sequence Diagram: User Authentication & Session Setup</h1>
    <div class="subtitle">Complete Request-Response Sequence for /user/login, Bcrypt Validation & JWT Issuance</div>
  </div>
  <div class="canvas">
    <div class="seq-container">
      <div class="lifeline"><div class="ll-box">👤 User (Actor)</div><div class="ll-line"></div></div>
      <div class="lifeline"><div class="ll-box">💻 React Frontend</div><div class="ll-line"></div></div>
      <div class="lifeline"><div class="ll-box">🌐 Express Router (/user)</div><div class="ll-line"></div></div>
      <div class="lifeline"><div class="ll-box">⚙️ loginController</div><div class="ll-line"></div></div>
      <div class="lifeline"><div class="ll-box">🗄️ MongoDB (User)</div><div class="ll-line"></div></div>
    </div>

    <div class="msg-layer">
      <svg style="position:absolute;width:100%;height:100%;">
        <defs>
          <marker id="arr" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#4f46e5"/></marker>
          <marker id="dash-arr" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#64748b"/></marker>
        </defs>

        <line x1="150" y1="40" x2="520" y2="40" stroke="#4f46e5" stroke-width="2" marker-end="url(#arr)" />
        <text x="330" y="32" font-size="14" font-weight="700" fill="#1e1b4b" text-anchor="middle">1: Enter email & password</text>

        <line x1="520" y1="90" x2="900" y2="90" stroke="#4f46e5" stroke-width="2" marker-end="url(#arr)" />
        <text x="710" y="82" font-size="14" font-weight="700" fill="#1e1b4b" text-anchor="middle">2: POST /user/login { email, password }</text>

        <line x1="900" y1="140" x2="1280" y2="140" stroke="#4f46e5" stroke-width="2" marker-end="url(#arr)" />
        <text x="1090" y="132" font-size="14" font-weight="700" fill="#1e1b4b" text-anchor="middle">3: loginController(req, res)</text>

        <line x1="1280" y1="190" x2="1670" y2="190" stroke="#4f46e5" stroke-width="2" marker-end="url(#arr)" />
        <text x="1475" y="182" font-size="14" font-weight="700" fill="#1e1b4b" text-anchor="middle">4: findOne({ email })</text>

        <line x1="1670" y1="230" x2="1280" y2="230" stroke="#64748b" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#dash-arr)" />
        <text x="1475" y="222" font-size="14" font-weight="700" fill="#475569" text-anchor="middle">5: return userDocument | null</text>

        <rect x="80" y="270" width="1680" height="180" fill="#fef2f250" stroke="#ef4444" stroke-dasharray="6,4" rx="8"/>
        <text x="95" y="295" font-size="13" font-weight="800" fill="#b91c1c">[alt: Invalid Credentials / User Not Found]</text>

        <line x1="1280" y1="330" x2="900" y2="330" stroke="#ef4444" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#arr)" />
        <text x="1090" y="322" font-size="13" font-weight="700" fill="#b91c1c" text-anchor="middle">6a: { success: false, message: "Invalid credentials" }</text>

        <line x1="900" y1="370" x2="520" y2="370" stroke="#ef4444" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#arr)" />
        <text x="710" y="362" font-size="13" font-weight="700" fill="#b91c1c" text-anchor="middle">7a: HTTP 200 { success: false }</text>

        <line x1="520" y1="410" x2="150" y2="410" stroke="#ef4444" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#arr)" />
        <text x="330" y="402" font-size="13" font-weight="700" fill="#b91c1c" text-anchor="middle">8a: Show Error Toast Alert</text>

        <rect x="80" y="470" width="1680" height="340" fill="#f0fdf450" stroke="#10b981" stroke-dasharray="6,4" rx="8"/>
        <text x="95" y="495" font-size="13" font-weight="800" fill="#15803d">[alt: Password Matches Bcrypt Hash]</text>

        <path d="M 1280 530 L 1340 530 L 1340 560 L 1280 560" fill="none" stroke="#4f46e5" stroke-width="2" marker-end="url(#arr)"/>
        <text x="1350" y="550" font-size="13" font-weight="700" fill="#4338ca">6b: jwt.sign({ id: user._id }, JWT_SECRET, 30d)</text>

        <line x1="1280" y1="610" x2="900" y2="610" stroke="#10b981" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#arr)" />
        <text x="1090" y="602" font-size="13" font-weight="700" fill="#047857" text-anchor="middle">7b: { success: true, token, role, redirectUrl }</text>

        <line x1="900" y1="660" x2="520" y2="660" stroke="#10b981" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#arr)" />
        <text x="710" y="652" font-size="13" font-weight="700" fill="#047857" text-anchor="middle">8b: HTTP 200 + JWT Token & Role</text>

        <path d="M 520 700 L 580 700 L 580 730 L 520 730" fill="none" stroke="#4f46e5" stroke-width="2" marker-end="url(#arr)"/>
        <text x="590" y="720" font-size="13" font-weight="700" fill="#4338ca">9b: Save Token & Set Auth Header</text>

        <line x1="520" y1="770" x2="150" y2="770" stroke="#10b981" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#arr)" />
        <text x="330" y="762" font-size="13" font-weight="700" fill="#047857" text-anchor="middle">10b: Navigate to Role Dashboard (/admin, /manager, /agent)</text>
      </svg>
    </div>
  </div>
</body>
</html>`;

// =============================================================================
// DIAGRAM 5: 4.1.3 SEQUENCE CREATE LEAD
// =============================================================================
diagrams['05_sequence_create_lead'] = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
${baseStyles}
  .seq-container { display: flex; justify-content: space-between; height: 100%; position: relative; padding: 0 20px; }
  .lifeline { display: flex; flex-direction: column; align-items: center; width: 210px; position: relative; }
  .ll-box { background: #e0e7ff; border: 2px solid #4f46e5; color: #1e1b4b; font-weight: 700; font-size: 14px; padding: 10px 12px; border-radius: 10px; text-align: center; width: 100%; z-index: 10; }
  .ll-line { flex: 1; width: 2px; background: #cbd5e1; border-left: 2px dashed #94a3b8; margin-top: 6px; }
  .msg-layer { position: absolute; top: 70px; left: 0; width: 100%; height: 840px; pointer-events: none; }
</style>
</head>
<body>
  <div class="header">
    <h1><span class="badge">Section 4.1.3</span> Sequence Diagram: Lead Creation & Email Notification</h1>
    <div class="subtitle">End-to-End Execution: Form Submit &rarr; Token Auth &rarr; Validation &rarr; DB Save &rarr; Nodemailer Multi-Dispatch</div>
  </div>
  <div class="canvas">
    <div class="seq-container">
      <div class="lifeline"><div class="ll-box">👤 Manager/Agent</div><div class="ll-line"></div></div>
      <div class="lifeline"><div class="ll-box">💻 React Frontend</div><div class="ll-line"></div></div>
      <div class="lifeline"><div class="ll-box">🛡️ authUser Middleware</div><div class="ll-line"></div></div>
      <div class="lifeline"><div class="ll-box">⚙️ leadController</div><div class="ll-line"></div></div>
      <div class="lifeline"><div class="ll-box">🗄️ MongoDB (All Collections)</div><div class="ll-line"></div></div>
      <div class="lifeline"><div class="ll-box">📧 Email Service (Nodemailer)</div><div class="ll-line"></div></div>
    </div>

    <div class="msg-layer">
      <svg style="position:absolute;width:100%;height:100%;">
        <defs>
          <marker id="arr" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#4f46e5"/></marker>
          <marker id="dash-arr" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#64748b"/></marker>
        </defs>

        <line x1="120" y1="30" x2="430" y2="30" stroke="#4f46e5" stroke-width="2" marker-end="url(#arr)" />
        <text x="275" y="22" font-size="13" font-weight="700" fill="#1e1b4b" text-anchor="middle">1: Fill lead form & submit</text>

        <line x1="430" y1="75" x2="740" y2="75" stroke="#4f46e5" stroke-width="2" marker-end="url(#arr)" />
        <text x="585" y="67" font-size="13" font-weight="700" fill="#1e1b4b" text-anchor="middle">2: POST /lead/create { token, leadData }</text>

        <line x1="740" y1="120" x2="1370" y2="120" stroke="#4f46e5" stroke-width="2" marker-end="url(#arr)" />
        <text x="1055" y="112" font-size="13" font-weight="700" fill="#1e1b4b" text-anchor="middle">3: verifyToken & findOne(User by decoded.id)</text>

        <line x1="1370" y1="160" x2="740" y2="160" stroke="#64748b" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#dash-arr)" />
        <text x="1055" y="152" font-size="13" font-weight="700" fill="#475569" text-anchor="middle">4: return user document</text>

        <line x1="740" y1="200" x2="1055" y2="200" stroke="#4f46e5" stroke-width="2" marker-end="url(#arr)" />
        <text x="895" y="192" font-size="13" font-weight="700" fill="#1e1b4b" text-anchor="middle">5: next() [req.body.role attached]</text>

        <path d="M 1055 230 L 1115 230 L 1115 260 L 1055 260" fill="none" stroke="#4f46e5" stroke-width="2" marker-end="url(#arr)"/>
        <text x="1125" y="250" font-size="13" font-weight="700" fill="#4338ca">6: validate email & phone format</text>

        <line x1="1055" y1="300" x2="1370" y2="300" stroke="#4f46e5" stroke-width="2" marker-end="url(#arr)" />
        <text x="1210" y="292" font-size="13" font-weight="700" fill="#1e1b4b" text-anchor="middle">7: new Lead(leadData).save()</text>

        <line x1="1370" y1="340" x2="1055" y2="340" stroke="#64748b" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#dash-arr)" />
        <text x="1210" y="332" font-size="13" font-weight="700" fill="#475569" text-anchor="middle">8: return saved lead</text>

        <line x1="1055" y1="390" x2="1370" y2="390" stroke="#4f46e5" stroke-width="2" marker-end="url(#arr)" />
        <text x="1210" y="382" font-size="13" font-weight="700" fill="#1e1b4b" text-anchor="middle">9: findById(project) & fetch agent/manager emails</text>

        <line x1="1370" y1="430" x2="1055" y2="430" stroke="#64748b" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#dash-arr)" />
        <text x="1210" y="422" font-size="13" font-weight="700" fill="#475569" text-anchor="middle">10: return projectDetails + emails</text>

        <rect x="980" y="470" width="760" height="120" fill="#faf5ff50" stroke="#8b5cf6" stroke-dasharray="6,4" rx="8"/>
        <text x="995" y="495" font-size="13" font-weight="800" fill="#6d28d9">[loop: for each assigned agent]</text>

        <line x1="1055" y1="540" x2="1680" y2="540" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arr)" />
        <text x="1360" y="532" font-size="13" font-weight="700" fill="#6d28d9" text-anchor="middle">11: sendEmail(agentEmail, "New Lead Notification: ...")</text>

        <line x1="1055" y1="620" x2="1680" y2="620" stroke="#4f46e5" stroke-width="2" marker-end="url(#arr)" />
        <text x="1360" y="612" font-size="13" font-weight="700" fill="#1e1b4b" text-anchor="middle">12: sendEmail(managerEmail, "New Lead Notification: ...")</text>

        <line x1="1055" y1="690" x2="430" y2="690" stroke="#10b981" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#arr)" />
        <text x="740" y="682" font-size="13.5" font-weight="800" fill="#047857" text-anchor="middle">13: HTTP 200 { success: true, message: "Lead created" }</text>

        <line x1="430" y1="750" x2="120" y2="750" stroke="#10b981" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#arr)" />
        <text x="275" y="742" font-size="13.5" font-weight="800" fill="#047857" text-anchor="middle">14: Display Success Toast & Update Lead Pipeline Table</text>
      </svg>
    </div>
  </div>
</body>
</html>`;

// =============================================================================
// DIAGRAM 6: 4.1.3 SEQUENCE UPDATE LEAD
// =============================================================================
diagrams['06_sequence_update_lead'] = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
${baseStyles}
  .seq-container { display: flex; justify-content: space-between; height: 100%; position: relative; padding: 0 40px; }
  .lifeline { display: flex; flex-direction: column; align-items: center; width: 240px; position: relative; }
  .ll-box { background: #e0e7ff; border: 2px solid #4f46e5; color: #1e1b4b; font-weight: 700; font-size: 15px; padding: 10px 16px; border-radius: 10px; text-align: center; width: 100%; z-index: 10; }
  .ll-line { flex: 1; width: 2px; background: #cbd5e1; border-left: 2px dashed #94a3b8; margin-top: 6px; }
  .msg-layer { position: absolute; top: 70px; left: 0; width: 100%; height: 840px; pointer-events: none; }
</style>
</head>
<body>
  <div class="header">
    <h1><span class="badge">Section 4.1.3</span> Sequence Diagram: Lead Stage Update & Audit Timeline</h1>
    <div class="subtitle">Complete Sequence: Agent Status Transition &rarr; Validation &rarr; Atomic $push to Timeline &rarr; UI Sync</div>
  </div>
  <div class="canvas">
    <div class="seq-container">
      <div class="lifeline"><div class="ll-box">👤 Sales Agent</div><div class="ll-line"></div></div>
      <div class="lifeline"><div class="ll-box">💻 React Frontend</div><div class="ll-line"></div></div>
      <div class="lifeline"><div class="ll-box">🛡️ authUser Middleware</div><div class="ll-line"></div></div>
      <div class="lifeline"><div class="ll-box">⚙️ leadController</div><div class="ll-line"></div></div>
      <div class="lifeline"><div class="ll-box">🗄️ MongoDB (Lead Collection)</div><div class="ll-line"></div></div>
    </div>

    <div class="msg-layer">
      <svg style="position:absolute;width:100%;height:100%;">
        <defs>
          <marker id="arr" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#4f46e5"/></marker>
          <marker id="dash-arr" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#64748b"/></marker>
        </defs>

        <line x1="160" y1="40" x2="520" y2="40" stroke="#4f46e5" stroke-width="2" marker-end="url(#arr)" />
        <text x="340" y="32" font-size="14" font-weight="700" fill="#1e1b4b" text-anchor="middle">1: Select new stage, enter remarks & follow-up date</text>

        <line x1="520" y1="100" x2="890" y2="100" stroke="#4f46e5" stroke-width="2" marker-end="url(#arr)" />
        <text x="705" y="92" font-size="14" font-weight="700" fill="#1e1b4b" text-anchor="middle">2: POST /lead/update { token, id, stage, remarks, followUpDate }</text>

        <line x1="890" y1="160" x2="1270" y2="160" stroke="#4f46e5" stroke-width="2" marker-end="url(#arr)" />
        <text x="1080" y="152" font-size="14" font-weight="700" fill="#1e1b4b" text-anchor="middle">3: updateLead(req, res) [Token verified, role attached]</text>

        <rect x="80" y="210" width="1680" height="170" fill="#fef2f250" stroke="#ef4444" stroke-dasharray="6,4" rx="8"/>
        <text x="95" y="235" font-size="13" font-weight="800" fill="#b91c1c">[alt: No Changed Fields Detected]</text>

        <line x1="1270" y1="270" x2="520" y2="270" stroke="#ef4444" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#arr)" />
        <text x="895" y="262" font-size="13" font-weight="700" fill="#b91c1c" text-anchor="middle">4a: HTTP 200 { success: false, message: "There was no change!" }</text>

        <line x1="520" y1="330" x2="160" y2="330" stroke="#ef4444" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#arr)" />
        <text x="340" y="322" font-size="13" font-weight="700" fill="#b91c1c" text-anchor="middle">5a: Show Warning Toast: "There was no change!"</text>

        <rect x="80" y="410" width="1680" height="380" fill="#f0fdf450" stroke="#10b981" stroke-dasharray="6,4" rx="8"/>
        <text x="95" y="435" font-size="13" font-weight="800" fill="#15803d">[alt: Valid Stage / Remarks Update]</text>

        <line x1="1270" y1="480" x2="1650" y2="480" stroke="#4f46e5" stroke-width="2" marker-end="url(#arr)" />
        <text x="1460" y="472" font-size="13" font-weight="700" fill="#1e1b4b" text-anchor="middle">4b: findByIdAndUpdate(id, { stage, remarks, followUpDate, $push: { timeline } })</text>

        <line x1="1650" y1="550" x2="1270" y2="550" stroke="#64748b" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#dash-arr)" />
        <text x="1460" y="542" font-size="13" font-weight="700" fill="#475569" text-anchor="middle">5b: return updated lead document</text>

        <line x1="1270" y1="630" x2="520" y2="630" stroke="#10b981" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#arr)" />
        <text x="895" y="622" font-size="14" font-weight="800" fill="#047857" text-anchor="middle">6b: HTTP 200 { success: true, message: "Lead Has Been Updated" }</text>

        <line x1="520" y1="710" x2="160" y2="710" stroke="#10b981" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#arr)" />
        <text x="340" y="702" font-size="14" font-weight="800" fill="#047857" text-anchor="middle">7b: Re-render UI with Updated Stage Badge & Timestamped Timeline Entry</text>
      </svg>
    </div>
  </div>
</body>
</html>`;

// =============================================================================
// DIAGRAM 7: 4.1.4 CLASS DIAGRAM
// =============================================================================
diagrams['07_class_diagram'] = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
${baseStyles}
</style>
</head>
<body>
  <div class="header">
    <h1><span class="badge">Section 4.1.4</span> Class Diagram</h1>
    <div class="subtitle">Object-Oriented Domain Model, Data Types, Multiplicities & Composition Structures</div>
  </div>
  <div class="canvas">
    <!-- Row 1: AuthMiddleware, User, ChannelPartner -->
    <!-- Card 1: AuthMiddleware -->
    <div class="uml-class" style="left: 40px; top: 30px; width: 440px; height: 360px;">
      <div class="uml-title" style="background:#f1f5f9; color:#0f172a;">AuthMiddleware</div>
      <div class="uml-section attrs" style="height: 120px;">
        <span style="color:#64748b;">// Security & JWT Validation</span><br>
        - secretKey: String<br>
        - tokenExpiry: String = "30d"
      </div>
      <div class="uml-section methods" style="height: 170px;">
        + authUser(req, res, next): void<br>
        - verifyJWT(token): Object<br>
        + checkRole(allowedRoles[]): Middleware
      </div>
    </div>

    <!-- Card 2: User -->
    <div class="uml-class" style="left: 540px; top: 30px; width: 620px; height: 360px;">
      <div class="uml-title">User</div>
      <div class="uml-section attrs" style="height: 220px;">
        + _id: ObjectId<br>
        + name: String [required]<br>
        + email: String [required, unique]<br>
        + number: Number [required, unique]<br>
        + password: String [required, bcrypt hash]<br>
        + role: Enum["Admin", "Manager", "Agent", "Channel Partner"]<br>
        + location: Enum["Bangalore", "Noida", "NCR", "Delhi", "Hyderabad", "Other"]<br>
        + isCP: Boolean = false
      </div>
      <div class="uml-section methods" style="height: 70px;">
        + login(email, password): Promise&lt;Token&gt;<br>
        + register(userData): Promise&lt;User&gt;
      </div>
    </div>

    <!-- Card 3: ChannelPartner -->
    <div class="uml-class" style="left: 1220px; top: 30px; width: 600px; height: 360px;">
      <div class="uml-title" style="background:#e0f2fe; color:#0369a1; border-color:#0284c7;">ChannelPartner</div>
      <div class="uml-section attrs" style="height: 220px;">
        + _id: ObjectId<br>
        + fullName: String, mobile: String, email: String<br>
        + panNo: String, panCardFile: String [uploads/]<br>
        + reraNo: String, reraCertificate: String, reraValidity: Date<br>
        + companyName: String, companyHead: String, gstNo: String<br>
        + address: String, city: String, pincode: String<br>
        + isVerified: Boolean = false, createdAt: Date = now()
      </div>
      <div class="uml-section methods" style="height: 70px;">
        + registerPartner(formData): Promise&lt;CP&gt;<br>
        + verifyCP(cpId): Promise&lt;UserCredentials&gt;
      </div>
    </div>

    <!-- Row 2: Project, Lead, EmailService -->
    <!-- Card 4: Project -->
    <div class="uml-class" style="left: 40px; top: 430px; width: 440px; height: 450px;">
      <div class="uml-title" style="background:#fef3c7; color:#92400e; border-color:#d97706;">Project</div>
      <div class="uml-section attrs" style="height: 290px;">
        + _id: ObjectId<br>
        + name: String [required]<br>
        + description: String<br>
        + assignedAgents: ObjectId[] &rarr; User [required]<br>
        + status: Enum["Active", "Hold", "Closed"] = "Active"<br>
        + location: Enum["Bangalore", "Noida", "NCR", ...]<br>
        + isMandateProject: Boolean = false<br>
        + createdAt: Date [timestamp]<br>
        + updatedAt: Date [timestamp]
      </div>
      <div class="uml-section methods" style="height: 90px;">
        + createProject(data): Promise&lt;Project&gt;<br>
        + assignAgents(projectId, agentIds[]): void
      </div>
    </div>

    <!-- Card 5: Lead & TimelineEntry -->
    <div class="uml-class" style="left: 540px; top: 430px; width: 780px; height: 450px;">
      <div class="uml-title" style="background:#d1fae5; color:#065f46; border-color:#059669;">Lead</div>
      <div class="uml-section attrs" style="height: 290px; display:flex; gap:20px;">
        <div style="flex:1.2;">
          + _id: ObjectId<br>
          + project: ObjectId &rarr; Project<br>
          + interested_in: ObjectId[] &rarr; Project<br>
          + name: String, email: String, phone: String<br>
          + source: Enum["Meta", "Google", "Other"]<br>
          + assignedAgent: ObjectId[] &rarr; User<br>
          + stage: Enum["RNR", "follow-up", "site-visit", ...]<br>
          + status: Enum["warm", "hot", "cold"]<br>
          + followUpDate: Date = null, remarks: String
        </div>
        <div style="flex:0.8; background:#f0fdf4; border:1.5px solid #86efac; border-radius:8px; padding:8px;">
          <div style="font-weight:800; color:#166534; font-size:12px; margin-bottom:4px;">◆ TimelineEntry (Embedded)</div>
          + stage: String<br>
          + remarks: String<br>
          + date: Date = now()
        </div>
      </div>
      <div class="uml-section methods" style="height: 90px;">
        + createLead(leadData): Promise&lt;Lead&gt;<br>
        + updateLead(id, stage, remarks, followUpDate): Promise&lt;Lead&gt;<br>
        + uploadCSV(file, selectedProject, selectedAgents): Promise&lt;Summary&gt;
      </div>
    </div>

    <!-- Card 6: EmailService -->
    <div class="uml-class" style="left: 1380px; top: 430px; width: 440px; height: 450px;">
      <div class="uml-title" style="background:#fae8ff; color:#86198f; border-color:#c026d3;">EmailService</div>
      <div class="uml-section attrs" style="height: 290px;">
        <span style="color:#64748b;">// Nodemailer Engine</span><br>
        - transporter: MailTransporter<br>
        - service: "gmail"<br>
        - authUser: process.env.EMAIL_USER<br>
        - authPass: process.env.EMAIL_PASS<br><br>
        <span style="font-weight:700; color:#701a75;">Triggers:</span><br>
        • New Lead Notification &rarr; Agents/Manager<br>
        • CP Verified Credentials &rarr; Partner
      </div>
      <div class="uml-section methods" style="height: 90px;">
        + sendEmail(to, subject, text): Promise&lt;void&gt;
      </div>
    </div>

    <!-- Association lines -->
    <svg style="position:absolute;width:100%;height:100%;pointer-events:none;z-index:10;">
      <line x1="480" y1="210" x2="540" y2="210" stroke="#6366f1" stroke-width="2" stroke-dasharray="4,3"/>
      <text x="510" y="200" font-size="11" font-weight="700" fill="#4338ca" text-anchor="middle">validates</text>

      <line x1="1160" y1="210" x2="1220" y2="210" stroke="#6366f1" stroke-width="2"/>
      <text x="1190" y="200" font-size="11" font-weight="700" fill="#4338ca" text-anchor="middle">1 &nbsp; 0..1</text>

      <line x1="480" y1="650" x2="540" y2="650" stroke="#6366f1" stroke-width="2"/>
      <text x="510" y="640" font-size="11" font-weight="700" fill="#4338ca" text-anchor="middle">1 &nbsp; 0..*</text>

      <line x1="1320" y1="650" x2="1380" y2="650" stroke="#6366f1" stroke-width="2" stroke-dasharray="4,3"/>
      <text x="1350" y="640" font-size="11" font-weight="700" fill="#4338ca" text-anchor="middle">triggers</text>
    </svg>
  </div>
</body>
</html>`;

// =============================================================================
// DIAGRAM 8: 4.1.5 COLLABORATION DIAGRAM
// =============================================================================
diagrams['08_collaboration_diagram'] = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
${baseStyles}
  .collab-node {
    position: absolute;
    background: #ffffff;
    border: 2px solid #4f46e5;
    border-radius: 12px;
    padding: 14px 18px;
    text-align: center;
    box-shadow: 0 4px 14px rgba(0,0,0,0.05);
    z-index: 20;
  }
  .collab-node.db {
    background: #faf5ff;
    border-color: #9333ea;
  }
  .node-title {
    font-size: 16px;
    font-weight: 800;
    color: #1e1b4b;
  }
  .node-sub {
    font-size: 12px;
    color: #64748b;
    font-weight: 600;
  }
</style>
</head>
<body>
  <div class="header">
    <h1><span class="badge">Section 4.1.5</span> Collaboration Diagram (Communication Diagram)</h1>
    <div class="subtitle">Structural Object Interactions & Numbered Message Sequence during POST /lead/create</div>
  </div>
  <div class="canvas">
    <!-- Left: Agent -->
    <div class="collab-node" style="left: 40px; top: 400px; width: 200px;">
      <div style="font-size:32px;">👤</div>
      <div class="node-title">Agent</div>
      <div class="node-sub">Actor</div>
    </div>

    <!-- Frontend -->
    <div class="collab-node" style="left: 320px; top: 400px; width: 240px;">
      <div style="font-size:32px;">💻</div>
      <div class="node-title">:React Frontend</div>
      <div class="node-sub">Client UI Component</div>
    </div>

    <!-- authUser -->
    <div class="collab-node" style="left: 680px; top: 160px; width: 280px;">
      <div style="font-size:32px;">🛡️</div>
      <div class="node-title">:authUser Middleware</div>
      <div class="node-sub">JWT Verification Layer</div>
    </div>

    <!-- leadController -->
    <div class="collab-node" style="left: 1040px; top: 400px; width: 280px;">
      <div style="font-size:32px;">⚙️</div>
      <div class="node-title">:leadController</div>
      <div class="node-sub">Business Logic Engine</div>
    </div>

    <!-- Right: DB Collections & Email -->
    <div class="collab-node db" style="left: 1500px; top: 80px; width: 260px;">
      <div style="font-size:30px;">🗄️</div>
      <div class="node-title">:User Collection</div>
      <div class="node-sub">MongoDB Document Store</div>
    </div>

    <div class="collab-node db" style="left: 1500px; top: 290px; width: 260px;">
      <div style="font-size:30px;">🗄️</div>
      <div class="node-title">:Lead Collection</div>
      <div class="node-sub">MongoDB Document Store</div>
    </div>

    <div class="collab-node db" style="left: 1500px; top: 500px; width: 260px;">
      <div style="font-size:30px;">🗄️</div>
      <div class="node-title">:Project Collection</div>
      <div class="node-sub">MongoDB Document Store</div>
    </div>

    <div class="collab-node" style="left: 1500px; top: 710px; width: 260px; border-color:#059669; background:#ecfdf5;">
      <div style="font-size:30px;">📧</div>
      <div class="node-title" style="color:#065f46;">:Email Service</div>
      <div class="node-sub" style="color:#047857;">Nodemailer (SMTP)</div>
    </div>

    <svg style="position:absolute;width:100%;height:100%;pointer-events:none;z-index:10;">
      <defs>
        <marker id="arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#4f46e5"/></marker>
      </defs>

      <!-- 1 & 11: Agent <-> Frontend -->
      <line x1="240" y1="440" x2="320" y2="440" stroke="#4f46e5" stroke-width="2"/>
      <text x="280" y="425" font-size="11" font-weight="700" fill="#4338ca" text-anchor="middle">1: submit form &rarr;</text>
      <text x="280" y="465" font-size="11" font-weight="700" fill="#047857" text-anchor="middle">&larr; 11: confirmation</text>

      <!-- 2: Frontend -> authUser -->
      <line x1="560" y1="420" x2="680" y2="230" stroke="#4f46e5" stroke-width="2"/>
      <text x="590" y="310" font-size="12" font-weight="700" fill="#4338ca">2: POST /lead/create &rarr;</text>

      <!-- 3 & 4: authUser <-> User Collection -->
      <line x1="960" y1="200" x2="1500" y2="130" stroke="#4f46e5" stroke-width="2"/>
      <text x="1200" y="150" font-size="12" font-weight="700" fill="#4338ca">3: verify token &rarr;</text>
      <text x="1200" y="175" font-size="12" font-weight="700" fill="#64748b">&larr; 4: return user/role</text>

      <!-- 5: authUser -> leadController -->
      <line x1="860" y1="250" x2="1080" y2="400" stroke="#4f46e5" stroke-width="2"/>
      <text x="940" y="340" font-size="12" font-weight="700" fill="#4338ca">5: next() &rarr;</text>

      <!-- 6: leadController -> Lead Collection -->
      <line x1="1320" y1="420" x2="1500" y2="340" stroke="#4f46e5" stroke-width="2"/>
      <text x="1400" y="370" font-size="12" font-weight="700" fill="#4338ca">6: save lead &rarr;</text>

      <!-- 7: leadController -> Project Collection -->
      <line x1="1320" y1="450" x2="1500" y2="530" stroke="#4f46e5" stroke-width="2"/>
      <text x="1400" y="505" font-size="12" font-weight="700" fill="#4338ca">7: fetch project &rarr;</text>

      <!-- 8: leadController -> User Collection -->
      <line x1="1260" y1="400" x2="1500" y2="150" stroke="#4f46e5" stroke-width="2"/>
      <text x="1350" y="260" font-size="12" font-weight="700" fill="#4338ca">8: fetch agent emails &rarr;</text>

      <!-- 9: leadController -> Email Service -->
      <line x1="1260" y1="480" x2="1500" y2="730" stroke="#059669" stroke-width="2"/>
      <text x="1350" y="625" font-size="12" font-weight="700" fill="#047857">9: send notifications &rarr;</text>

      <!-- 10: leadController -> Frontend -->
      <line x1="1040" y1="460" x2="560" y2="460" stroke="#10b981" stroke-width="2" stroke-dasharray="4,3"/>
      <text x="800" y="480" font-size="13" font-weight="800" fill="#047857" text-anchor="middle">&larr; 10: HTTP 200 { success: true, message: "Lead created" }</text>
    </svg>
  </div>
</body>
</html>`;

// =============================================================================
// DIAGRAM 9: 4.1.6 DEPLOYMENT DIAGRAM
// =============================================================================
diagrams['09_deployment_diagram'] = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
${baseStyles}
  .node-box {
    position: absolute;
    background: #f8fafc;
    border: 2.5px solid #475569;
    border-radius: 14px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.06);
    padding: 16px;
  }
  .node-header {
    font-size: 16px;
    font-weight: 800;
    color: #0f172a;
    border-bottom: 2px solid #cbd5e1;
    padding-bottom: 8px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .artifact-card {
    background: #ffffff;
    border: 2px solid #6366f1;
    border-radius: 10px;
    padding: 12px 14px;
    margin-bottom: 12px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.03);
  }
  .artifact-title {
    font-size: 14px;
    font-weight: 700;
    color: #312e81;
  }
  .artifact-detail {
    font-size: 12px;
    color: #64748b;
    font-family: monospace;
    margin-top: 4px;
  }
</style>
</head>
<body>
  <div class="header">
    <h1><span class="badge">Section 4.1.6</span> Deployment Diagram</h1>
    <div class="subtitle">Physical Nodes, Execution Environments, Artifact Distribution & Network Protocols</div>
  </div>
  <div class="canvas">
    <!-- Node 1: Client Device -->
    <div class="node-box" style="left: 30px; top: 30px; width: 440px; height: 840px; border-color:#3b82f6;">
      <div class="node-header" style="color:#1d4ed8;">🖥️ &laquo;device&raquo; Client Device</div>
      <div style="font-size:12px; color:#64748b; margin-bottom:14px;">User PC / Laptop / Mobile Browser</div>

      <div class="artifact-card" style="border-color:#3b82f6; background:#eff6ff;">
        <div class="artifact-title">&laquo;executionEnvironment&raquo; Web Browser</div>
        <div class="artifact-detail">Chrome, Firefox, Safari, Edge</div>
      </div>

      <div class="artifact-card">
        <div class="artifact-title">⚛️ &laquo;artifact&raquo; React 19 SPA</div>
        <div class="artifact-detail">Vite Production Bundle (HTML5, JS, CSS3)<br>Bootstrap 5, Recharts, Lucide Icons</div>
      </div>

      <div class="artifact-card">
        <div class="artifact-title">🔐 Client Auth State</div>
        <div class="artifact-detail">LocalStorage (JWT Token)<br>Axios HTTP Interceptors</div>
      </div>
    </div>

    <!-- Node 2: Application Server -->
    <div class="node-box" style="left: 540px; top: 30px; width: 680px; height: 840px; border-color:#6366f1;">
      <div class="node-header" style="color:#4338ca;">⚙️ &laquo;device&raquo; Application Server (Node.js)</div>
      <div style="font-size:12px; color:#64748b; margin-bottom:14px;">Host Runtime / VPS / Cloud Container (Port 3000)</div>

      <div class="artifact-card" style="border-color:#4f46e5; background:#eef2ff;">
        <div class="artifact-title">&laquo;executionEnvironment&raquo; Node.js Engine (v24.x)</div>
        <div class="artifact-detail">Express.js Framework (app.js, port 3000)</div>
      </div>

      <div class="artifact-card">
        <div class="artifact-title">🛣️ Routes Layer</div>
        <div class="artifact-detail">/user (Auth, Registration, CP Verification)<br>/lead (CRUD, CSV Import, Timeline Updates)<br>/project (Project Management, Agent Assignment)</div>
      </div>

      <div class="artifact-card">
        <div class="artifact-title">🛡️ Middleware Layer</div>
        <div class="artifact-detail">authUser.js (JWT Validation)<br>upload.js (Multer Multi-part File Handling)<br>corsOptions (Whitelisted Origins)</div>
      </div>

      <div class="artifact-card">
        <div class="artifact-title">📁 Static File Handler</div>
        <div class="artifact-detail">app.use('/uploads', express.static('uploads'))<br>Serves PAN/RERA/GST Certificates</div>
      </div>
    </div>

    <!-- Node 3: External Services -->
    <div class="node-box" style="left: 1290px; top: 30px; width: 520px; height: 390px; border-color:#059669;">
      <div class="node-header" style="color:#047857;">☁️ &laquo;system&raquo; External Services</div>
      <div class="artifact-card" style="border-color:#10b981; background:#ecfdf5;">
        <div class="artifact-title">📧 Email / SMTP Service</div>
        <div class="artifact-detail">Nodemailer Engine (service: "gmail")<br>Dispatches automated credentials & notifications</div>
      </div>
    </div>

    <!-- Node 4: Database Server -->
    <div class="node-box" style="left: 1290px; top: 470px; width: 520px; height: 400px; border-color:#9333ea;">
      <div class="node-header" style="color:#6b21a8;">🗄️ &laquo;database system&raquo; Database Server</div>
      <div class="artifact-card" style="border-color:#a855f7; background:#faf5ff;">
        <div class="artifact-title">🍃 MongoDB Document Database</div>
        <div class="artifact-detail">Mongoose ODM connection via TCP<br>Collections: Users, Leads, Projects, ChannelPartners</div>
      </div>
    </div>

    <!-- Protocols -->
    <svg style="position:absolute;width:100%;height:100%;pointer-events:none;z-index:10;">
      <!-- Client to App Server -->
      <line x1="470" y1="360" x2="540" y2="360" stroke="#4f46e5" stroke-width="2.5"/>
      <text x="505" y="345" font-size="12" font-weight="800" fill="#4338ca" text-anchor="middle">HTTPS / REST</text>

      <!-- App Server to Email -->
      <line x1="1220" y1="210" x2="1290" y2="210" stroke="#059669" stroke-width="2.5"/>
      <text x="1255" y="195" font-size="12" font-weight="800" fill="#047857" text-anchor="middle">SMTP</text>

      <!-- App Server to Mongo -->
      <line x1="1220" y1="650" x2="1290" y2="650" stroke="#9333ea" stroke-width="2.5"/>
      <text x="1255" y="635" font-size="12" font-weight="800" fill="#6b21a8" text-anchor="middle">Mongoose TCP</text>
    </svg>
  </div>
</body>
</html>`;

// =============================================================================
// DIAGRAM 10: 4.2.1 ER DIAGRAM
// =============================================================================
diagrams['10_er_diagram'] = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
${baseStyles}
  .er-entity {
    position: absolute;
    background: #ffffff;
    border: 2px solid #334155;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    overflow: hidden;
  }
  .er-title {
    background: #e2e8f0;
    color: #0f172a;
    font-size: 15px;
    font-weight: 800;
    text-align: center;
    padding: 8px 12px;
    border-bottom: 2px solid #334155;
    letter-spacing: 0.5px;
  }
  .er-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12.5px;
    font-family: 'Consolas', 'Courier New', monospace;
  }
  .er-table tr { border-bottom: 1px solid #e2e8f0; }
  .er-table tr:last-child { border-bottom: none; }
  .er-table td { padding: 5px 10px; }
  .er-pk { font-weight: 800; color: #b91c1c; }
  .er-fk { font-weight: 800; color: #2563eb; }
  .er-uk { font-weight: 800; color: #d97706; }
</style>
</head>
<body>
  <div class="header">
    <h1><span class="badge">Section 4.2.1</span> Entity-Relationship (E-R) Diagram</h1>
    <div class="subtitle">Relational Mapping of MongoDB Collections, Foreign Keys, Primary Keys & Cardinalities</div>
  </div>
  <div class="canvas">
    <!-- Row 1: USER, CHANNEL_PARTNER, PROJECT -->
    <!-- USER -->
    <div class="er-entity" style="left: 40px; top: 30px; width: 500px;">
      <div class="er-title" style="background:#e0e7ff; color:#312e81;">USER</div>
      <table class="er-table">
        <tr><td class="er-pk">PK</td><td>_id</td><td>ObjectId</td></tr>
        <tr><td></td><td>name</td><td>string</td></tr>
        <tr><td class="er-uk">UK</td><td>email</td><td>string</td></tr>
        <tr><td class="er-uk">UK</td><td>number</td><td>number</td></tr>
        <tr><td></td><td>password</td><td>string</td></tr>
        <tr><td></td><td>role</td><td>enum["Admin", "Manager", "Agent", "CP"]</td></tr>
        <tr><td></td><td>location</td><td>enum["Bangalore", "Noida", "NCR", ...]</td></tr>
        <tr><td></td><td>isCP</td><td>boolean</td></tr>
      </table>
    </div>

    <!-- CHANNEL_PARTNER -->
    <div class="er-entity" style="left: 600px; top: 30px; width: 580px;">
      <div class="er-title" style="background:#e0f2fe; color:#0369a1;">CHANNEL_PARTNER</div>
      <table class="er-table">
        <tr><td class="er-pk">PK</td><td>_id</td><td>ObjectId</td></tr>
        <tr><td></td><td>fullName, mobile, email</td><td>string</td></tr>
        <tr><td></td><td>panNo, panCardFile</td><td>string</td></tr>
        <tr><td></td><td>reraNo, reraCertificate, reraValidity</td><td>string, date</td></tr>
        <tr><td></td><td>companyName, companyHead, gstNo</td><td>string</td></tr>
        <tr><td></td><td>address, city, pincode, state</td><td>string</td></tr>
        <tr><td></td><td>isVerified</td><td>boolean</td></tr>
        <tr><td></td><td>createdAt</td><td>date</td></tr>
      </table>
    </div>

    <!-- PROJECT -->
    <div class="er-entity" style="left: 1240px; top: 30px; width: 580px;">
      <div class="er-title" style="background:#fef3c7; color:#92400e;">PROJECT</div>
      <table class="er-table">
        <tr><td class="er-pk">PK</td><td>_id</td><td>ObjectId</td></tr>
        <tr><td></td><td>name</td><td>string</td></tr>
        <tr><td></td><td>description</td><td>string</td></tr>
        <tr><td class="er-fk">FK</td><td>assignedAgents</td><td>ObjectId[] &rarr; USER</td></tr>
        <tr><td></td><td>status</td><td>enum["Active", "Hold", "Closed"]</td></tr>
        <tr><td></td><td>location</td><td>enum["Bangalore", "Noida", ...]</td></tr>
        <tr><td></td><td>isMandateProject</td><td>boolean</td></tr>
        <tr><td></td><td>createdAt, updatedAt</td><td>date</td></tr>
      </table>
    </div>

    <!-- Row 2: LEAD, TIMELINE_ENTRY -->
    <!-- LEAD -->
    <div class="er-entity" style="left: 280px; top: 430px; width: 780px;">
      <div class="er-title" style="background:#d1fae5; color:#065f46;">LEAD</div>
      <table class="er-table">
        <tr><td class="er-pk">PK</td><td>_id</td><td>ObjectId</td></tr>
        <tr><td class="er-fk">FK</td><td>project</td><td>ObjectId &rarr; PROJECT</td></tr>
        <tr><td class="er-fk">FK</td><td>interested_in</td><td>ObjectId[] &rarr; PROJECT</td></tr>
        <tr><td></td><td>name, email, phone</td><td>string</td></tr>
        <tr><td></td><td>source</td><td>enum["Meta", "Google", "Other"]</td></tr>
        <tr><td class="er-fk">FK</td><td>assignedAgent</td><td>ObjectId[] &rarr; USER</td></tr>
        <tr><td></td><td>stage</td><td>enum["RNR", "follow-up", "site-visit", ...]</td></tr>
        <tr><td></td><td>status</td><td>enum["warm", "hot", "cold"]</td></tr>
        <tr><td></td><td>followUpDate, remarks</td><td>date, string</td></tr>
        <tr><td></td><td>createdAt, updatedAt</td><td>date</td></tr>
      </table>
    </div>

    <!-- TIMELINE_ENTRY -->
    <div class="er-entity" style="left: 1140px; top: 430px; width: 500px;">
      <div class="er-title" style="background:#fae8ff; color:#86198f;">TIMELINE_ENTRY (Embedded)</div>
      <table class="er-table">
        <tr><td></td><td>stage</td><td>string</td></tr>
        <tr><td></td><td>remarks</td><td>string</td></tr>
        <tr><td></td><td>date</td><td>date (default: now)</td></tr>
      </table>
      <div style="padding:10px; font-size:12px; color:#64748b; background:#faf5ff;">
        * Embedded document array inside LEAD entity
      </div>
    </div>

    <!-- Crow's foot lines -->
    <svg style="position:absolute;width:100%;height:100%;pointer-events:none;z-index:10;">
      <!-- USER -> CP -->
      <line x1="540" y1="180" x2="600" y2="180" stroke="#334155" stroke-width="2"/>
      <text x="570" y="170" font-size="11" font-weight="700" fill="#334155" text-anchor="middle">1 : 0..1</text>

      <!-- USER -> LEAD -->
      <line x1="260" y1="330" x2="400" y2="430" stroke="#334155" stroke-width="2"/>
      <text x="310" y="390" font-size="11" font-weight="700" fill="#334155">1 : 0..*</text>

      <!-- PROJECT -> LEAD -->
      <line x1="1300" y1="330" x2="980" y2="430" stroke="#334155" stroke-width="2"/>
      <text x="1160" y="390" font-size="11" font-weight="700" fill="#334155">1 : 0..*</text>

      <!-- LEAD -> TIMELINE -->
      <line x1="1060" y1="530" x2="1140" y2="530" stroke="#334155" stroke-width="2"/>
      <text x="1100" y="520" font-size="11" font-weight="700" fill="#334155" text-anchor="middle">1 : 0..*</text>
    </svg>
  </div>
</body>
</html>`;

// =============================================================================
// DIAGRAM 11: 4.2.2 DB SCHEMA SNAPSHOTS
// =============================================================================
diagrams['11_db_schema'] = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
${baseStyles}
  .schema-card {
    position: absolute;
    background: #ffffff;
    border: 2px solid #cbd5e1;
    border-radius: 10px;
    box-shadow: 0 4px 14px rgba(0,0,0,0.04);
    overflow: hidden;
  }
  .schema-header {
    background: #f1f5f9;
    padding: 10px 16px;
    font-weight: 800;
    font-size: 15px;
    border-bottom: 2px solid #cbd5e1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .schema-body {
    padding: 12px 16px;
    font-size: 12.5px;
    font-family: 'Consolas', monospace;
    line-height: 1.5;
  }
  .type { color: #2563eb; font-weight: 700; }
  .req { color: #dc2626; font-weight: 700; }
  .enum { color: #7c3aed; }
  .def { color: #059669; }
</style>
</head>
<body>
  <div class="header">
    <h1><span class="badge">Section 4.2.2</span> Database Schema Design (Mongoose Collection Snapshots)</h1>
    <div class="subtitle">Exact Mongoose Schemas, Strict Validation Rules, Embedded Subdocuments & Enumerations</div>
  </div>
  <div class="canvas">
    <!-- Top-Left: users_collection -->
    <div class="schema-card" style="left: 40px; top: 20px; width: 880px; height: 410px;">
      <div class="schema-header" style="background:#e0e7ff; color:#312e81; border-color:#a5b4fc;">
        <span>users_collection (User.js)</span>
        <span style="font-size:12px; font-weight:600; color:#4338ca;">Model: mongoose.model("User")</span>
      </div>
      <div class="schema-body">
        _id: <span class="type">ObjectId</span> (Auto Primary Key)<br>
        name: <span class="type">String</span> <span class="req">[required: true]</span><br>
        email: <span class="type">String</span> <span class="req">[required: true, unique: true]</span><br>
        number: <span class="type">Number</span> <span class="req">[required: true, unique: true]</span><br>
        password: <span class="type">String</span> <span class="req">[required: true]</span><br>
        role: <span class="type">String</span> <span class="enum">enum: ["Admin", "Manager", "Agent", "Channel Partner"]</span> <span class="req">[required: true]</span><br>
        location: <span class="type">String</span> <span class="enum">enum: ["Bangalore", "Noida", "NCR", "Delhi", "Hyderabad", "Other"]</span><br>
        isCP: <span class="type">Boolean</span> <span class="def">default: false</span>
      </div>
    </div>

    <!-- Top-Right: projects_collection -->
    <div class="schema-card" style="left: 960px; top: 20px; width: 900px; height: 410px;">
      <div class="schema-header" style="background:#fef3c7; color:#92400e; border-color:#fde68a;">
        <span>projects_collection (Project.js)</span>
        <span style="font-size:12px; font-weight:600; color:#b45309;">Model: mongoose.model("Project")</span>
      </div>
      <div class="schema-body">
        _id: <span class="type">ObjectId</span> (Auto Primary Key)<br>
        name: <span class="type">String</span><br>
        description: <span class="type">String</span><br>
        assignedAgents: <span class="type">[{ type: ObjectId, ref: "User", required: true }]</span><br>
        status: <span class="type">String</span> <span class="enum">enum: ["Active", "Hold", "Closed"]</span> <span class="def">default: "Active"</span><br>
        location: <span class="type">String</span> <span class="enum">enum: ["Bangalore", "Noida", "NCR", "Delhi", "Hyderabad", "Other"]</span><br>
        isMandateProject: <span class="type">Boolean</span> <span class="def">default: false</span><br>
        createdAt: <span class="type">Date</span>, updatedAt: <span class="type">Date</span> <span class="def">[timestamps: true]</span>
      </div>
    </div>

    <!-- Bottom-Left: channelpartners_collection -->
    <div class="schema-card" style="left: 40px; top: 450px; width: 880px; height: 430px;">
      <div class="schema-header" style="background:#e0f2fe; color:#0369a1; border-color:#bae6fd;">
        <span>channelpartners_collection (ChannelPartner.js)</span>
        <span style="font-size:12px; font-weight:600; color:#0284c7;">Model: mongoose.model("ChannelPartner")</span>
      </div>
      <div class="schema-body" style="font-size:12px; line-height:1.45;">
        _id: <span class="type">ObjectId</span>, fullName: <span class="type">String</span>, mobile: <span class="type">String</span>, email: <span class="type">String</span><br>
        teamStrength: <span class="type">String</span>, panNo: <span class="type">String</span>, panCardFile: <span class="type">String</span> (uploads/path)<br>
        reraNo: <span class="type">String</span>, reraCertificate: <span class="type">String</span>, reraValidity: <span class="type">Date</span>, state: <span class="type">String</span><br>
        companyName: <span class="type">String</span>, companyHead: <span class="type">String</span>, companyWebsite: <span class="type">String</span><br>
        gstNo: <span class="type">String</span>, gstCertificate: <span class="type">String</span>, address: <span class="type">String</span>, city: <span class="type">String</span>, pincode: <span class="type">String</span><br>
        isVerified: <span class="type">Boolean</span> <span class="def">default: false</span><br>
        createdAt: <span class="type">Date</span> <span class="def">default: Date.now</span>
      </div>
    </div>

    <!-- Bottom-Right: leads_collection + TimelineEntry -->
    <div class="schema-card" style="left: 960px; top: 450px; width: 900px; height: 430px;">
      <div class="schema-header" style="background:#d1fae5; color:#065f46; border-color:#a7f3d0;">
        <span>leads_collection (Lead.js)</span>
        <span style="font-size:12px; font-weight:600; color:#059669;">Model: mongoose.model("Lead")</span>
      </div>
      <div class="schema-body" style="font-size:11.8px; line-height:1.45;">
        _id: <span class="type">ObjectId</span>, project: <span class="type">ObjectId ref:"Project"</span>, interested_in: <span class="type">[{ ObjectId ref:"Project" }]</span><br>
        name: <span class="type">String</span>, email: <span class="type">String</span>, phone: <span class="type">String</span>, source: <span class="enum">enum: ["Meta", "Google", "Other"]</span><br>
        assignedAgent: <span class="type">[{ type: ObjectId, ref: "User" }]</span><br>
        stage: <span class="enum">enum: ["RNR", "follow-up", "site-visit", "site-visit-done", "revisit", "booking", "set-stage"]</span> <span class="def">default: "set-stage"</span><br>
        status: <span class="enum">enum: ["warm", "hot", "cold"]</span>, followUpDate: <span class="type">Date</span> <span class="def">default: null</span>, remarks: <span class="def">default: "Not Available"</span><br>
        <div style="background:#f0fdf4; border:1px solid #86efac; border-radius:6px; padding:6px 10px; margin-top:6px;">
          <b>timeline: [ {</b> stage: <span class="type">String</span>, remarks: <span class="type">String</span>, date: <span class="type">Date</span> <span class="def">default: Date.now</span> <b>} ]</b> (Embedded)
        </div>
        createdAt: <span class="type">Date</span>, updatedAt: <span class="type">Date</span> <span class="def">[timestamps: true]</span>
      </div>
    </div>
  </div>
</body>
</html>`;

// Render all 11 diagrams to HTML files and execute Chrome Headless
console.log('Writing HTML templates...');
for (const [name, content] of Object.entries(diagrams)) {
  const htmlPath = path.join(tempHtmlDir, `${name}.html`);
  fs.writeFileSync(htmlPath, content, 'utf-8');
  console.log(`Saved: ${name}.html`);
}

console.log('Capturing 16:9 (1920x1080) PNG screenshots with Chrome...');
for (const name of Object.keys(diagrams)) {
  const htmlPath = path.join(tempHtmlDir, `${name}.html`);
  const htmlUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  const outPng = path.join(diagramsDir, `${name}.png`);

  console.log(`Rendering ${name}.png ...`);
  const cmd = `"${chromePath}" --headless --disable-gpu --screenshot="${outPng}" --window-size=1920,1080 --hide-scrollbars "${htmlUrl}"`;
  execSync(cmd);
  console.log(`Rendered: ${name}.png (Size: ${fs.statSync(outPng).size} bytes)`);
}

console.log('All 11 diagrams rendered successfully in 16:9 ratio!');
