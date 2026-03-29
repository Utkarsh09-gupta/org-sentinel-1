import { Shield, Network, Zap, BarChart3 } from "lucide-react";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";

const Product = () => (
  <Layout>
    <section className="relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-electric-purple/10 rounded-full blur-[120px]" />
      <div className="section-padding relative">
        <AnimatedSection className="text-center mb-16">
          <p className="text-sm font-medium text-primary mb-2 tracking-widest uppercase">Product</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-6">
            The <span className="gradient-text">Decision-Safety</span> Simulator
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            OrgSentinel models how employees, vendors, and admins interact with your company infrastructure.
            It builds an access relationship graph and simulates cascading failure scenarios caused by normal human behavior.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {[
            { icon: Network, title: "Access Relationship Graph", desc: "Maps every connection between users, permissions, and systems to reveal hidden dependencies and risk pathways." },
            { icon: Zap, title: "Cascading Failure Simulation", desc: "Models how a single misconfiguration can propagate through your infrastructure, causing chain-reaction failures." },
            { icon: Shield, title: "Pre-Incident Detection", desc: "Identifies vulnerabilities before damage occurs, shifting your security posture from reactive to predictive." },
            { icon: BarChart3, title: "Blast Radius Scoring", desc: "Quantifies the potential impact of every risk scenario so you can prioritize what matters most." },
          ].map((item, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className="glass-card p-8 group hover:border-primary/30 transition-all duration-300 h-full">
                <item.icon className="w-10 h-10 text-primary mb-5 group-hover:scale-110 transition-transform" />
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="mt-20 text-center">
          <div className="glass-card p-10 max-w-3xl mx-auto">
            <h3 className="font-display text-2xl font-bold mb-4 gradient-text">Built for Startups</h3>
            <p className="text-muted-foreground leading-relaxed">
              OrgSentinel helps fast-growing tech teams detect internal vulnerabilities before damage occurs.
              No security team required — just upload your configuration and let the simulation engine do the work.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  </Layout>
);

export default Product;
