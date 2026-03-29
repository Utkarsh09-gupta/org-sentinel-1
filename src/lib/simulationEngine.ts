import type { AccessEntry, RiskFinding, SimulationResult } from "@/context/SimulationContext";

const SENSITIVE_RESOURCES = ["customerdb", "customer database", "paymentsystem", "payment system", "cloudstorage", "cloud storage"];

function applyRules(entries: AccessEntry[]): RiskFinding[] {
  const findings: RiskFinding[] = [];

  for (const e of entries) {
    const res = e.resource.toLowerCase();
    const role = e.role.toLowerCase();
    const perm = e.permission.toLowerCase();

    // Rule 1: Intern reading customer data
    if (role === "intern" && res.includes("customer") && perm === "read") {
      findings.push({ resource: e.resource, risk: "Data Exposure", description: `${e.role} exported customer data to personal device`, severity: "Critical" });
    }
    // Rule 2: Vendor write to code repos
    if (role === "vendor" && (res.includes("github") || res.includes("repo")) && (perm === "write" || perm === "admin")) {
      findings.push({ resource: e.resource, risk: "Supply Chain Risk", description: `Vendor pushed malicious code to repository`, severity: "High" });
    }
    // Rule 3: Admin access to payment
    if (role === "admin" && res.includes("payment") && perm === "admin") {
      findings.push({ resource: e.resource, risk: "Critical Privilege Risk", description: `Admin privilege misuse affected payment system`, severity: "Critical" });
    }
    // Rule 5: Write access to sensitive data
    if ((perm === "write" || perm === "admin") && SENSITIVE_RESOURCES.some(s => res.includes(s.replace(/\s/g, "")) || res.includes(s))) {
      findings.push({ resource: e.resource, risk: "Data Modification Risk", description: `${e.role} has ${perm} access to sensitive ${e.resource}`, severity: "High" });
    }
  }

  // Rule 4: Privilege overlap — resources accessed by multiple roles
  const resourceRoles: Record<string, Set<string>> = {};
  for (const e of entries) {
    const key = e.resource;
    if (!resourceRoles[key]) resourceRoles[key] = new Set();
    resourceRoles[key].add(e.role);
  }
  for (const [resource, roles] of Object.entries(resourceRoles)) {
    if (roles.size > 1) {
      findings.push({ resource, risk: "Privilege Overlap", description: `Multiple roles accessed sensitive ${resource}`, severity: "Medium" });
    }
  }

  return findings;
}

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

export function runSimulation(entries: AccessEntry[]): SimulationResult {
  const findings = applyRules(entries);

  // Build unique nodes
  const userSet = new Set<string>();
  const resourceSet = new Set<string>();
  for (const e of entries) {
    userSet.add(`${e.role}:${e.userId}`);
    resourceSet.add(e.resource);
  }

  // Score each resource
  const resourceScores: Record<string, number> = {};
  for (const res of resourceSet) {
    const relatedFindings = findings.filter(f => f.resource === res);
    let score = 15; // base
    for (const f of relatedFindings) {
      score += f.severity === "Critical" ? 30 : f.severity === "High" ? 20 : 10;
    }
    resourceScores[res] = Math.min(score, 100);
  }

  // Build graph nodes
  const nodes: SimulationResult["nodes"] = [];
  for (const u of userSet) {
    const [role, userId] = u.split(":");
    nodes.push({ id: userId, label: role, type: "user", risk: "low" });
  }
  for (const res of resourceSet) {
    const score = resourceScores[res] || 15;
    nodes.push({ id: res, label: res, type: "resource", risk: riskLevel(score) });
  }

  // Build edges
  const edges = entries.map(e => ({ from: e.userId, to: e.resource, permission: e.permission }));

  // Heatmap
  const heatmap = Object.entries(resourceScores).map(([label, risk]) => ({
    label, risk, color: riskColor(risk),
  })).sort((a, b) => b.risk - a.risk);

  // Scenarios — dedupe
  const seenDesc = new Set<string>();
  const scenarios = findings
    .filter(f => { if (seenDesc.has(f.description)) return false; seenDesc.add(f.description); return true; })
    .map(f => ({ text: f.description, risk: f.severity }));

  // Blast radius
  const scores = Object.values(resourceScores);
  const blastRadius = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return { entries, nodes, edges, heatmap, scenarios, blastRadius };
}
