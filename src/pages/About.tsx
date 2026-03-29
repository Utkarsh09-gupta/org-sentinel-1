import { Target, Eye, Shield } from "lucide-react";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";

const About = () => (
  <Layout>
    <section className="relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-electric-blue/8 rounded-full blur-[120px]" />
      <div className="section-padding relative">
        <AnimatedSection className="text-center mb-16">
          <p className="text-sm font-medium text-primary mb-2 tracking-widest uppercase">About</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-6">
            Our <span className="gradient-text">Mission</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We believe the most dangerous security threats aren't external hackers — they're the everyday human decisions
            that silently erode your infrastructure. OrgSentinel exists to make internal risk visible, measurable, and preventable.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            { icon: Target, title: "Mission", desc: "To shift security from reactive to predictive by modeling human behavior as the primary risk vector." },
            { icon: Eye, title: "Vision", desc: "A world where every organization can see its internal risks before they become incidents." },
            { icon: Shield, title: "Values", desc: "Transparency, simplicity, and the belief that security should be accessible to every team." },
          ].map((item, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className="glass-card p-8 h-full text-center">
                <div className="w-14 h-14 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection>
          <div className="glass-card p-10 max-w-3xl mx-auto text-center">
            <h3 className="font-display text-2xl font-bold mb-4 gradient-text">Tech Stack</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {["React / Next.js", "TailwindCSS", "D3.js / Cytoscape", "NetworkX"].map((tech, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/30 text-sm text-muted-foreground">
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  </Layout>
);

export default About;
