import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Wifi, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import { useSimulation } from "@/context/SimulationContext";

const DEFAULT_NODES = [
  { id: "intern", label: "Intern", type: "user" as const, risk: "high" },
  { id: "admin", label: "Admin", type: "user" as const, risk: "medium" },
  { id: "vendor", label: "Vendor", type: "user" as const, risk: "high" },
  { id: "custdb", label: "Customer DB", type: "resource" as const, risk: "high" },
  { id: "github", label: "GitHub Repo", type: "resource" as const, risk: "medium" },
  { id: "payment", label: "Payment System", type: "resource" as const, risk: "low" },
];

const DEFAULT_EDGES = [
  { from: "intern", to: "custdb", permission: "read" },
  { from: "intern", to: "github", permission: "read" },
  { from: "admin", to: "custdb", permission: "admin" },
  { from: "admin", to: "github", permission: "write" },
  { from: "admin", to: "payment", permission: "admin" },
  { from: "vendor", to: "github", permission: "write" },
  { from: "vendor", to: "payment", permission: "read" },
];

const DEFAULT_HEATMAP = [
  { label: "Customer DB", risk: 92, color: "#EF4444" },
  { label: "Payment System", risk: 45, color: "#F59E0B" },
  { label: "GitHub Repo", risk: 67, color: "#F59E0B" },
  { label: "Auth Service", risk: 23, color: "#22C55E" },
  { label: "Cloud Storage", risk: 78, color: "#EF4444" },
  { label: "API Gateway", risk: 34, color: "#22C55E" },
];

const DEFAULT_SCENARIOS = [
  { text: "Intern exported customer data to personal device", risk: "Critical" },
  { text: "Vendor API key reused in production", risk: "High" },
  { text: "Ex-employee access remained active for 90 days", risk: "High" },
  { text: "Admin overlap caused critical deletion", risk: "Critical" },
  { text: "Cloud storage bucket was publicly exposed", risk: "Medium" },
  { text: "Unreviewed code pushed directly to production", risk: "Medium" },
];

const riskColor = (r: string) => r === "high" ? "#EF4444" : r === "medium" ? "#F59E0B" : "#22C55E";

// Simple force-style layout for dynamic nodes
function layoutNodes(nodes: { id: string; label: string; type: string; risk: string }[]) {
  const users = nodes.filter(n => n.type === "user");
  const resources = nodes.filter(n => n.type === "resource");
  const positioned: { id: string; label: string; risk: string; x: number; y: number }[] = [];

  users.forEach((u, i) => {
    const angle = (Math.PI / (users.length + 1)) * (i + 1);
    positioned.push({ ...u, x: 80 + i * (400 / Math.max(users.length - 1, 1)), y: 50 + Math.sin(angle) * 60 });
  });

  resources.forEach((r, i) => {
    positioned.push({ ...r, x: 60 + i * (420 / Math.max(resources.length - 1, 1)), y: 220 + (i % 2) * 60 });
  });

  return positioned;
}

const DashboardDemo = () => {
  const { result } = useSimulation();
  const isLive = !!result;

  const graphNodes = useMemo(() => {
    if (result) return layoutNodes(result.nodes);
    return DEFAULT_NODES.map((n, i) => ({
      ...n,
      x: [80, 250, 420, 130, 310, 450][i],
      y: [120, 60, 130, 280, 220, 300][i],
    }));
  }, [result]);

  const graphEdges = useMemo(() => result?.edges ?? DEFAULT_EDGES, [result]);
  const heatmap = useMemo(() => result?.heatmap ?? DEFAULT_HEATMAP, [result]);
  const scenarios = useMemo(() => result?.scenarios ?? DEFAULT_SCENARIOS, [result]);
  const blastRadius = result?.blastRadius ?? 72;

  const nodeMap = Object.fromEntries(graphNodes.map(n => [n.id, n]));

  return (
    <Layout>
      <section className="relative">
        <div className="section-padding">
          <AnimatedSection className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-2">
              <p className="text-sm font-medium text-primary tracking-widest uppercase">
                {isLive ? "Live Simulation" : "Live Demo"}
              </p>
              {isLive && (
                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Dynamic
                </span>
              )}
            </div>
            {/* Data Source Badge */}
            <div className="flex justify-center mb-3">
              <Badge variant="outline" className="gap-1.5 text-xs">
                <Wifi className="w-3 h-3" />
                Source: {isLive ? "Live Integration (API)" : "Demo Data (API)"}
              </Badge>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              Risk <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              {isLive
                ? "Results generated from your uploaded organization data."
                : "Interactive prototype showing how OrgSentinel visualizes internal risk."}
            </p>
            {!isLive && (
              <Link to="/simulate" className="btn-primary inline-flex items-center gap-2 text-sm">
                Run Your Own Simulation <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </AnimatedSection>

          {/* Top row: Graph + Heatmap */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Access Graph */}
            <AnimatedSection>
              <div className="glass-card p-6 h-full">
                <h3 className="font-display font-semibold text-foreground mb-4 text-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" /> Access Graph
                </h3>
                <div className="relative bg-muted/20 rounded-lg overflow-hidden" style={{ height: 360 }}>
                  <svg width="100%" height="100%" viewBox="0 0 530 370" className="p-4">
                    {graphEdges.map((edge, i) => {
                      const a = nodeMap[edge.from], b = nodeMap[edge.to];
                      if (!a || !b) return null;
                      return (
                        <motion.line
                          key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                          stroke="hsl(225,50%,25%)" strokeWidth="1.5" strokeOpacity="0.3"
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                        />
                      );
                    })}
                    {graphNodes.map((node, i) => (
                      <motion.g key={node.id}
                        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                      >
                        <circle cx={node.x} cy={node.y} r="28" fill="hsl(30,30%,96%)" stroke={riskColor(node.risk)} strokeWidth="2" />
                        <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle" fill="hsl(225,50%,18%)" fontSize="10" fontFamily="Inter">
                          {node.label.length > 12 ? node.label.slice(0, 11) + "…" : node.label}
                        </text>
                      </motion.g>
                    ))}
                  </svg>
                </div>
              </div>
            </AnimatedSection>

            {/* Risk Heatmap */}
            <AnimatedSection delay={0.1}>
              <div className="glass-card p-6 h-full">
                <h3 className="font-display font-semibold text-foreground mb-4 text-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary" /> Risk Heatmap
                </h3>
                <div className="space-y-4">
                  {heatmap.map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground">{item.label}</span>
                        <span style={{ color: item.color }}>{item.risk}%</span>
                      </div>
                      <div className="h-3 rounded-full bg-muted/30 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: item.color }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.risk}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Blast Radius Score */}
                <div className="mt-6 p-4 rounded-lg bg-muted/20 border border-border/50 text-center">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Blast Radius Score</p>
                  <motion.p
                    className="font-display text-4xl font-bold"
                    style={{ color: blastRadius >= 70 ? "#EF4444" : blastRadius >= 40 ? "#F59E0B" : "#22C55E" }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                  >
                    {blastRadius} <span className="text-lg text-muted-foreground font-normal">/ 100</span>
                  </motion.p>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Bottom: Failure Scenarios */}
          <AnimatedSection delay={0.2}>
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-foreground mb-4 text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" /> Top Failure Scenarios
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {scenarios.map((s, i) => (
                  <motion.div
                    key={i}
                    className="p-4 rounded-lg bg-muted/20 border border-border/30 hover:border-primary/30 transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        s.risk === "Critical" ? "bg-destructive/20 text-destructive" :
                        s.risk === "High" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-blue-500/20 text-blue-400"
                      }`}>
                        {s.risk}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{s.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Action buttons */}
          <div className="mt-8 text-center flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/simulate" className="btn-primary inline-flex items-center justify-center gap-2">
              {isLive ? "Run New Simulation" : "Start Simulation"} <ArrowRight className="w-4 h-4" />
            </Link>
            {isLive && (
              <Link to="/dashboard-demo" className="btn-outline-glow" onClick={() => window.location.reload()}>
                View Static Demo
              </Link>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DashboardDemo;
