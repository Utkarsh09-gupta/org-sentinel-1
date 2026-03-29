import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Key, Globe, Cloud, Server, Activity, Users, Building, CheckCircle2, Loader2, Plug, Unplug, Wifi, WifiOff, AlertTriangle } from "lucide-react";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useIntegrations, type Integration } from "@/context/IntegrationContext";
import { useToast } from "@/hooks/use-toast";

const iconMap: Record<string, React.ElementType> = {
  shield: Shield, key: Key, globe: Globe, cloud: Cloud,
  server: Server, activity: Activity, users: Users, building: Building,
};

const categoryLabels: Record<string, { label: string; description: string }> = {
  identity: { label: "Identity & Access Systems", description: "Connect your identity providers to sync users, roles, and access policies." },
  cloud: { label: "Cloud & Activity Logs", description: "Ingest cloud platform logs and monitor API activity in real time." },
  hr: { label: "HR Systems", description: "Import organizational hierarchy, departments, and employee roles." },
};

const IntegrationCard = ({ integration }: { integration: Integration }) => {
  const { connect, disconnect } = useIntegrations();
  const { toast } = useToast();
  const Icon = iconMap[integration.icon] || Shield;
  const isConnected = integration.status === "connected";
  const isConnecting = integration.status === "connecting";

  const handleToggle = async () => {
    if (isConnected) {
      disconnect(integration.id);
      toast({ title: `${integration.name} disconnected` });
    } else {
      await connect(integration.id);
      toast({ title: `${integration.name} connected`, description: `Now syncing: ${integration.dataDescription}` });
    }
  };

  return (
    <motion.div
      layout
      className={`relative rounded-xl border p-5 transition-all duration-300 ${
        isConnected
          ? "border-primary/40 bg-primary/5 shadow-md"
          : "border-border/50 bg-card hover:border-primary/20"
      }`}
    >
      {isConnected && (
        <motion.div
          className="absolute top-3 right-3"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-500/15 text-green-600">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Connected
          </span>
        </motion.div>
      )}

      <div className="flex items-start gap-4">
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${
          isConnected ? "bg-primary/15 text-primary" : "bg-muted/50 text-muted-foreground"
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground text-sm mb-1">{integration.name}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">{integration.description}</p>
          <p className="text-xs text-muted-foreground/70 mb-4">
            <span className="font-medium text-muted-foreground">Data:</span> {integration.dataDescription}
          </p>
          <Button
            size="sm"
            variant={isConnected ? "outline" : "default"}
            onClick={handleToggle}
            disabled={isConnecting}
            className="gap-2 text-xs"
          >
            {isConnecting ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Connecting...</>
            ) : isConnected ? (
              <><Unplug className="w-3.5 h-3.5" /> Disconnect</>
            ) : (
              <><Plug className="w-3.5 h-3.5" /> Connect</>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const Integrations = () => {
  const { integrations, mode, setMode, connectedCount, liveEvents, dataHealth, isSyncing } = useIntegrations();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const categories = ["all", "identity", "cloud", "hr"];

  const filtered = activeCategory === "all" ? integrations : integrations.filter(i => i.category === activeCategory);

  return (
    <Layout>
      <section className="relative min-h-screen">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="section-padding relative z-10">
          {/* Header */}
          <AnimatedSection className="text-center mb-10">
            <p className="text-sm font-medium text-primary mb-2 tracking-widest uppercase">Enterprise Integrations</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              Data <span className="gradient-text">Integrations</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Connect Org Sentinel to your company's identity, cloud, and HR systems. Data is ingested via secure APIs — no file uploads required.
            </p>

            {/* Mode toggle */}
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full border border-border/50 bg-card">
              <span className={`text-sm font-medium ${mode === "demo" ? "text-foreground" : "text-muted-foreground"}`}>Demo Mode</span>
              <Switch checked={mode === "live"} onCheckedChange={(v) => setMode(v ? "live" : "demo")} />
              <span className={`text-sm font-medium ${mode === "live" ? "text-foreground" : "text-muted-foreground"}`}>Live Integration</span>
            </div>
          </AnimatedSection>

          {/* Status bar */}
          <AnimatedSection delay={0.05}>
            <div className="max-w-4xl mx-auto mb-8 flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border/50 text-sm">
                {connectedCount > 0 ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-muted-foreground" />}
                <span className="text-foreground font-medium">{connectedCount}</span>
                <span className="text-muted-foreground">integrations active</span>
              </div>
              {isSyncing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-sm text-primary">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Syncing data...
                </motion.div>
              )}
              {dataHealth && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border/50 text-sm">
                  <span className="text-muted-foreground">Data Reliability:</span>
                  <span className={`font-bold ${dataHealth.score >= 90 ? "text-green-500" : dataHealth.score >= 75 ? "text-yellow-500" : "text-red-500"}`}>
                    {dataHealth.score}%
                  </span>
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* Category Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {categories.map(cat => (
              <Button
                key={cat}
                size="sm"
                variant={activeCategory === cat ? "default" : "outline"}
                onClick={() => setActiveCategory(cat)}
                className="text-xs capitalize"
              >
                {cat === "all" ? "All Systems" : categoryLabels[cat]?.label || cat}
              </Button>
            ))}
          </div>

          {/* Integration Cards */}
          <div className="max-w-5xl mx-auto">
            {activeCategory !== "all" && categoryLabels[activeCategory] && (
              <p className="text-sm text-muted-foreground mb-4 text-center">{categoryLabels[activeCategory].description}</p>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((integration, i) => (
                  <motion.div
                    key={integration.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <IntegrationCard integration={integration} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Data Health Section */}
          {dataHealth && (
            <AnimatedSection delay={0.1}>
              <div className="max-w-3xl mx-auto mt-10 rounded-xl border border-border/50 bg-card p-6">
                <h3 className="font-display font-semibold text-foreground text-sm mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Data Health Report
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  {[
                    { label: "Total Records", value: dataHealth.totalRecords },
                    { label: "Valid Records", value: dataHealth.validRecords },
                    { label: "Duplicates", value: dataHealth.duplicates },
                    { label: "Missing Fields", value: dataHealth.missingFields },
                  ].map(stat => (
                    <div key={stat.label} className="text-center p-3 rounded-lg bg-muted/20">
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
                {dataHealth.warnings.length > 0 && (
                  <div className="space-y-2">
                    {dataHealth.warnings.map((w, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-yellow-600 bg-yellow-500/10 px-3 py-2 rounded-lg">
                        <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        {w}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </AnimatedSection>
          )}

          {/* Live Events Feed */}
          {liveEvents.length > 0 && (
            <AnimatedSection delay={0.15}>
              <div className="max-w-3xl mx-auto mt-8 rounded-xl border border-border/50 bg-card p-6">
                <h3 className="font-display font-semibold text-foreground text-sm mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Live Data Sync
                  <span className="ml-auto flex items-center gap-1.5 text-xs text-green-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live
                  </span>
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <AnimatePresence>
                    {liveEvents.slice(0, 8).map(event => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-start gap-3 text-xs p-2.5 rounded-lg ${
                          event.severity === "critical" ? "bg-red-500/10" :
                          event.severity === "warning" ? "bg-yellow-500/10" : "bg-muted/20"
                        }`}
                      >
                        <Badge variant={event.severity === "critical" ? "destructive" : event.severity === "warning" ? "secondary" : "outline"} className="text-[10px] shrink-0">
                          {event.severity}
                        </Badge>
                        <span className="text-muted-foreground">{event.message}</span>
                        <span className="ml-auto text-muted-foreground/50 shrink-0">
                          {event.timestamp.toLocaleTimeString()}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Integrations;
