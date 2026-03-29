import { Users, Network, Zap, BarChart3, FileText, Rocket } from "lucide-react";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";

const features = [
  { icon: Users, title: "Human-Centric Threat Modeling", desc: "Simulates realistic internal mistakes rather than external attacks. Focuses on what real people actually do wrong.", color: "text-electric-blue" },
  { icon: Network, title: "Access Graph Engine", desc: "Maps relationships between users, permissions, and systems. Reveals hidden access paths and dependencies.", color: "text-electric-purple" },
  { icon: Zap, title: "Risk Propagation Simulation", desc: "Models cascading failure chains to show how one mistake can ripple through your entire infrastructure.", color: "text-electric-cyan" },
  { icon: BarChart3, title: "Blast Radius Scoring", desc: "Quantifies the potential impact of every internal security incident with a single, actionable score.", color: "text-electric-blue" },
  { icon: FileText, title: "Scenario-Based Risk Insights", desc: "Generates narrative explanations of potential failures so anyone can understand and act on the findings.", color: "text-electric-purple" },
  { icon: Rocket, title: "Startup-Focused Security", desc: "Built specifically for fast-growing tech teams that can't afford a dedicated security operations center.", color: "text-electric-cyan" },
];

const Features = () => (
  <Layout>
    <section className="relative overflow-hidden">
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-electric-blue/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-electric-purple/8 rounded-full blur-[120px]" />
      <div className="section-padding relative">
        <AnimatedSection className="text-center mb-16">
          <p className="text-sm font-medium text-secondary mb-2 tracking-widest uppercase">Features</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-6">
            Platform <span className="gradient-text">Capabilities</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to predict, analyze, and prevent internal security failures.
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className="glass-card p-8 h-full group hover:border-primary/30 transition-all duration-300 hover:translate-y-[-2px]">
                <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Features;
