import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Plug, Wifi, Database, ArrowRight, Loader2, CheckCircle2, AlertTriangle, Building2 } from "lucide-react";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useSimulation, AccessEntry } from "@/context/SimulationContext";
import { useIntegrations } from "@/context/IntegrationContext";
import { runSimulation } from "@/lib/simulationEngine";
import { fetchMockAccessEntries } from "@/lib/mockApiData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const Simulate = () => {
  const { session } = useAuth();
  const [entries, setEntries] = useState<AccessEntry[]>([]);
  const [running, setRunning] = useState(false);
  const [fetching, setFetching] = useState(false);
  const { setResult } = useSimulation();
  const { integrations, connectedCount, mode, setMode, dataHealth } = useIntegrations();
  const navigate = useNavigate();
  const { toast } = useToast();

  const connectedIntegrations = integrations.filter(i => i.status === "connected");

  // Auto-fetch data when integrations are connected
  useEffect(() => {
    if (connectedCount > 0 || mode === "demo") {
      setFetching(true);
      const data = fetchMockAccessEntries();
      
      // Sync with backend
      fetch("http://localhost:3001/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data })
      })
      .then(res => res.json())
      .then(json => {
        setEntries(data);
        setFetching(false);
      })
      .catch(err => {
        console.error("Upload failed", err);
        setEntries(data); // Fallback for UI visibility
        setFetching(false);
      });
    } else {
      setEntries([]);
    }
  }, [connectedCount, mode]);

  const runSim = async () => {
    if (entries.length === 0) {
      toast({ title: "No data available", description: "Connect integrations or enable Demo Mode first.", variant: "destructive" });
      return;
    }
    setRunning(true);
    
    try {
      const response = await fetch("http://localhost:3001/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      const result = await response.json();
      setResult(result);
      setRunning(false);
      navigate("/dashboard-demo");
    } catch (err) {
      toast({ title: "Simulation failed", description: "Could not connect to backend server.", variant: "destructive" });
      setRunning(false);
    }
  };

  const hasData = entries.length > 0;
  const showNoConnection = connectedCount === 0 && mode !== "demo";

  return (
    <Layout>
      <section className="relative min-h-screen">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="section-padding relative z-10">
          <AnimatedSection className="text-center mb-10">
            {session && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-sm font-medium text-primary mb-4">
                <Building2 className="w-3.5 h-3.5" />
                {session.companyName}
              </div>
            )}
            <p className="text-sm font-medium text-primary mb-2 tracking-widest uppercase">Simulation Engine</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              Run <span className="gradient-text">Risk Simulation</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Data is automatically ingested from your connected integrations via secure APIs.
            </p>
          </AnimatedSection>

          {/* Mode Toggle */}
          <AnimatedSection delay={0.05}>
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full border border-border/50 bg-card">
                <span className={`text-sm font-medium ${mode === "demo" ? "text-foreground" : "text-muted-foreground"}`}>Demo Mode</span>
                <Switch checked={mode === "live"} onCheckedChange={(v) => setMode(v ? "live" : "demo")} />
                <span className={`text-sm font-medium ${mode === "live" ? "text-foreground" : "text-muted-foreground"}`}>Live Integration</span>
              </div>
            </div>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto">
            {/* Data Source Status */}
            <AnimatedSection delay={0.1}>
              <div className="rounded-xl border border-border/50 bg-card p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                    <Database className="w-4 h-4 text-primary" /> Data Source
                  </h3>
                  <Badge variant="outline" className="gap-1.5 text-xs">
                    <Wifi className="w-3 h-3" />
                    {mode === "demo" ? "Demo API" : "Live Integration (API)"}
                  </Badge>
                </div>

                {mode === "demo" && (
                  <div className="text-sm text-muted-foreground bg-muted/20 rounded-lg p-4">
                    <p className="mb-2">
                      <span className="font-medium text-foreground">Demo Mode Active</span> — Using simulated API data from mock endpoints:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                      {["/api/users", "/api/roles", "/api/permissions", "/api/activity-logs"].map(ep => (
                        <code key={ep} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{ep}</code>
                      ))}
                    </div>
                  </div>
                )}

                {mode === "live" && connectedCount > 0 && (
                  <div className="space-y-2">
                    {connectedIntegrations.map(i => (
                      <div key={i.id} className="flex items-center gap-3 text-sm p-2.5 rounded-lg bg-green-500/5">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        <span className="text-foreground font-medium">{i.name}</span>
                        <span className="text-muted-foreground text-xs">— {i.dataDescription}</span>
                      </div>
                    ))}
                  </div>
                )}

                {showNoConnection && (
                  <div className="text-center py-6">
                    <Plug className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">No integrations connected. Connect your systems to ingest data.</p>
                    <Link to="/integrations">
                      <Button size="sm" className="gap-2">
                        <Plug className="w-3.5 h-3.5" /> Go to Integrations
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </AnimatedSection>

            {/* Data Health */}
            {dataHealth && hasData && (
              <AnimatedSection delay={0.15}>
                <div className="rounded-xl border border-border/50 bg-card p-6 mb-6">
                  <h3 className="font-semibold text-foreground text-sm flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Data Validation
                  </h3>
                  <div className="flex items-center gap-6 mb-4">
                    <div className="text-center">
                      <p className={`text-3xl font-bold ${dataHealth.score >= 90 ? "text-green-500" : dataHealth.score >= 75 ? "text-yellow-500" : "text-red-500"}`}>
                        {dataHealth.score}%
                      </p>
                      <p className="text-xs text-muted-foreground">Data Reliability</p>
                    </div>
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <div className="text-center p-2 rounded-lg bg-muted/20">
                        <p className="font-bold text-foreground">{dataHealth.totalRecords}</p>
                        <p className="text-[10px] text-muted-foreground">Records</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-muted/20">
                        <p className="font-bold text-foreground">{dataHealth.duplicates}</p>
                        <p className="text-[10px] text-muted-foreground">Duplicates</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-muted/20">
                        <p className="font-bold text-foreground">{dataHealth.missingFields}</p>
                        <p className="text-[10px] text-muted-foreground">Missing</p>
                      </div>
                    </div>
                  </div>
                  {dataHealth.warnings.length > 0 && (
                    <div className="space-y-1.5">
                      {dataHealth.warnings.map((w, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-yellow-600 bg-yellow-500/10 px-3 py-1.5 rounded">
                          <AlertTriangle className="w-3 h-3 shrink-0" /> {w}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AnimatedSection>
            )}

            {/* Fetched entries table */}
            {fetching && (
              <AnimatedSection>
                <div className="rounded-xl border border-border/50 bg-card p-8 text-center mb-6">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Fetching data from API endpoints...</p>
                </div>
              </AnimatedSection>
            )}

            {hasData && !fetching && (
              <AnimatedSection delay={0.1}>
                <div className="rounded-xl border border-border/50 bg-card p-6 mb-6">
                  <h3 className="font-semibold text-foreground text-sm mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" /> Ingested Access Entries ({entries.length})
                    <span className="ml-auto flex items-center gap-1.5 text-xs text-green-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live
                    </span>
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/30">
                          <th className="text-left py-2 text-muted-foreground font-medium">User ID</th>
                          <th className="text-left py-2 text-muted-foreground font-medium">Role</th>
                          <th className="text-left py-2 text-muted-foreground font-medium">Resource</th>
                          <th className="text-left py-2 text-muted-foreground font-medium">Permission</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entries.map((e, i) => (
                          <motion.tr
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="border-b border-border/10 hover:bg-muted/10"
                          >
                            <td className="py-2 text-foreground">{e.userId}</td>
                            <td className="py-2">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{e.role}</span>
                            </td>
                            <td className="py-2 text-foreground">{e.resource}</td>
                            <td className="py-2">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                e.permission === "admin" ? "bg-destructive/20 text-destructive" :
                                e.permission === "write" ? "bg-yellow-500/20 text-yellow-600" :
                                "bg-green-500/20 text-green-600"
                              }`}>{e.permission}</span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </AnimatedSection>
            )}

            {/* Run Button */}
            <AnimatedSection delay={0.2}>
              <div className="mt-8 text-center">
                <Button
                  onClick={runSim}
                  disabled={running || !hasData}
                  size="lg"
                  className="btn-primary text-base gap-2 min-w-[220px]"
                >
                  {running ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
                      Running Simulation...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" /> Run Simulation
                    </>
                  )}
                </Button>
                {showNoConnection && (
                  <p className="text-xs text-muted-foreground mt-3">
                    Connect integrations or switch to Demo Mode to load data.
                  </p>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Simulate;
