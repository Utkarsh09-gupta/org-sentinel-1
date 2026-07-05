import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import Database from 'better-sqlite3';
import path from 'path';

import fs from 'fs';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const dbPath = process.env.DATABASE_URL || 'sentinel.db';
const dbDir = path.dirname(dbPath);
if (dbDir && dbDir !== '.' && !fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const db = new Database(dbPath);

// Root route for health check
app.get('/', (req, res) => {
  res.json({
    status: 'Backend is running',
    endpoints: ['/api/upload (POST)', '/api/simulate (POST)']
  });
});

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS access_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT,
    role TEXT,
    resource TEXT,
    permission TEXT
  )
`);

interface AccessEntry {
  userId: string;
  role: string;
  resource: string;
  permission: string;
}

interface RiskFinding {
  resource: string;
  risk: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

app.post('/api/upload', (req: Request, res: Response) => {
  const data: AccessEntry[] = req.body.data;
  if (data && Array.isArray(data)) {
    const insert = db.prepare('INSERT INTO access_entries (userId, role, resource, permission) VALUES (?, ?, ?, ?)');
    const deleteOld = db.prepare('DELETE FROM access_entries');
    
    const transaction = db.transaction((entries: AccessEntry[]) => {
      deleteOld.run();
      for (const entry of entries) {
        insert.run(entry.userId, entry.role, entry.resource, entry.permission);
      }
    });

    transaction(data);
    res.json({ message: 'Data ingested successfully', count: data.length });
  } else {
    res.status(400).json({ error: 'Invalid data format' });
  }
});

function riskColor(score: number) {
  if (score >= 70) return "#EF4444";
  if (score >= 40) return "#F59E0B";
  return "#22C55E";
}

function riskLevel(score: number) {
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}

const SENSITIVE_RESOURCES = ["customerdb", "customer database", "paymentsystem", "payment system", "cloudstorage", "cloud storage"];

app.post('/api/simulate', (req: Request, res: Response) => {
  const entries: AccessEntry[] = db.prepare('SELECT userId, role, resource, permission FROM access_entries').all() as AccessEntry[];
  const findings: RiskFinding[] = [];

  for (const e of entries) {
    const role = e.role.toLowerCase();
    const perm = e.permission.toLowerCase();
    const resName = e.resource.toLowerCase();

    // rule 1: intern + export = HIgh risk
    if (role === 'intern' && perm === 'export') {
      findings.push({
        resource: e.resource,
        risk: 'High Risk',
        description: 'Intern attempted to export data',
        severity: 'High'
      });
    }

    // rule 2: admin + delete = critical risk
    if (role === 'admin' && perm === 'delete') {
      findings.push({
        resource: e.resource,
        risk: 'Critical Risk',
        description: 'Admin performed delete operation',
        severity: 'Critical'
      });
    }

    // rule 3: if resource == "Public"-> public exposure === security risk
    if (resName === 'public') {
      findings.push({
        resource: e.resource,
        risk: 'Security Risk',
        description: 'Public exposure of resource',
        severity: 'High'
      });
    }

    // client aligned rule 1: Intern reading customer data
    if (role === 'intern' && resName.includes('customer') && perm === 'read') {
      findings.push({
        resource: e.resource,
        risk: 'Data Exposure',
        description: `${e.role} exported customer data to personal device`,
        severity: 'Critical'
      });
    }

    // client aligned rule 2: Vendor write to code repos
    if (role === 'vendor' && (resName.includes('github') || resName.includes('repo')) && (perm === 'write' || perm === 'admin')) {
      findings.push({
        resource: e.resource,
        risk: 'Supply Chain Risk',
        description: 'Vendor pushed malicious code to repository',
        severity: 'High'
      });
    }

    // client aligned rule 3: Admin access to payment
    if (role === 'admin' && resName.includes('payment') && perm === 'admin') {
      findings.push({
        resource: e.resource,
        risk: 'Critical Privilege Risk',
        description: 'Admin privilege misuse affected payment system',
        severity: 'Critical'
      });
    }

    // client aligned rule 4: Write/Admin access to sensitive data
    if ((perm === 'write' || perm === 'admin') && SENSITIVE_RESOURCES.some(s => resName.includes(s.replace(/\s/g, '')) || resName.includes(s))) {
      findings.push({
        resource: e.resource,
        risk: 'Data Modification Risk',
        description: `${e.role} has ${e.permission} access to sensitive ${e.resource}`,
        severity: 'High'
      });
    }
  }

  // client aligned rule 5: Privilege overlap — resources accessed by multiple roles
  const resourceRoles: Record<string, Set<string>> = {};
  for (const e of entries) {
    const key = e.resource;
    if (!resourceRoles[key]) resourceRoles[key] = new Set();
    resourceRoles[key].add(e.role);
  }
  for (const [resource, roles] of Object.entries(resourceRoles)) {
    if (roles.size > 1) {
      findings.push({
        resource,
        risk: 'Privilege Overlap',
        description: `Multiple roles accessed sensitive ${resource}`,
        severity: 'Medium'
      });
    }
  }

  // Build SimulationResult structure for frontend
  const userSet = new Set<string>();
  const resourceSet = new Set<string>();
  for (const e of entries) {
    userSet.add(`${e.role}:${e.userId}`);
    resourceSet.add(e.resource);
  }

  const resourceScores: Record<string, number> = {};
  for (const res of resourceSet) {
    const relatedFindings = findings.filter(f => f.resource === res);
    let score = 15;
    for (const f of relatedFindings) {
      score += f.severity === 'Critical' ? 30 : f.severity === 'High' ? 20 : 10;
    }
    resourceScores[res] = Math.min(score, 100);
  }

  const nodes = [];
  for (const u of userSet) {
    const [role, userId] = u.split(':');
    nodes.push({ id: userId, label: role, type: 'user', risk: 'low' });
  }
  for (const res of resourceSet) {
    const score = resourceScores[res] || 15;
    nodes.push({ id: res, label: res, type: 'resource', risk: riskLevel(score) });
  }

  const edges = entries.map(e => ({ from: e.userId, to: e.resource, permission: e.permission }));

  const heatmap = Object.entries(resourceScores).map(([label, risk]) => ({
    label, risk, color: riskColor(risk),
  })).sort((a, b) => b.risk - a.risk);

  const seenDesc = new Set<string>();
  const scenarios = findings
    .filter(f => { if (seenDesc.has(f.description)) return false; seenDesc.add(f.description); return true; })
    .map(f => ({ text: f.description, risk: f.severity }));

  const scores = Object.values(resourceScores);
  const blastRadius = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  res.json({
    entries,
    nodes,
    edges,
    heatmap,
    scenarios,
    blastRadius,
    isAtRisk: findings.length > 0
  });
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
