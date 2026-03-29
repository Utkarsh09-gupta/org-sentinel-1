import { Upload, GitBranch, ShieldAlert, Zap, BarChart3, Monitor } from "lucide-react";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";

const steps = [
  { icon: Upload, title: "Upload Configuration", desc: "Upload your organization's infrastructure configuration and user access data." },
  { icon: GitBranch, title: "Build Access Graph", desc: "Automatically map relationships: Users → Permissions → Systems." },
  { icon: ShieldAlert, title: "Apply Risk Rules", desc: "Run the risk rule engine to identify potential vulnerability patterns." },
  { icon: Zap, title: "Simulate Failures", desc: "Simulate cascading failure chains from realistic internal scenarios." },
  { icon: BarChart3, title: "Compute Blast Radius", desc: "Calculate the Blast Radius Score for each failure scenario." },
  { icon: Monitor, title: "Visualize Dashboard", desc: "View the complete risk dashboard with actionable insights." },
];

const HowItWorks = () => (
  <Layout>
    <section className="relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-electric-cyan/10 rounded-full blur-[120px]" />
      <div className="section-padding relative">
        <AnimatedSection className="text-center mb-20">
          <p className="text-sm font-medium text-accent mb-2 tracking-widest uppercase">Process</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-6">
            How <span className="gradient-text">OrgSentinel</span> Works
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Six steps from configuration to actionable risk intelligence.
          </p>
        </AnimatedSection>

        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-electric-blue via-electric-purple to-electric-cyan hidden md:block" />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <AnimatedSection key={i} delay={i * 0.12}>
                <div className="flex gap-6 md:gap-8 items-start">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-xl glass-card flex items-center justify-center group-hover:glow-primary transition-all">
                      <step.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center">
                      <span className="text-xs font-bold text-foreground">{i + 1}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default HowItWorks;
