import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, Users, Key, Database, GitBranch, TrendingUp, Lock, Globe, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";

const NetworkGraph = () => (
  <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
    <svg className="w-full h-full" viewBox="0 0 800 600">
      {/* Animated network lines */}
      {[[100,100,400,200],[400,200,700,150],[400,200,300,400],[300,400,600,450],[700,150,650,400],[100,100,200,350],[200,350,300,400],[600,450,700,150]].map(([x1,y1,x2,y2], i) => (
        <motion.line
          key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="url(#lineGrad)" strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.6, 0.3] }}
          transition={{ duration: 3, delay: i * 0.3, repeat: Infinity, repeatType: "reverse" }}
        />
      ))}
      {/* Nodes */}
      {[[100,100],[400,200],[700,150],[300,400],[600,450],[200,350],[650,400]].map(([cx,cy], i) => (
        <motion.circle
          key={i} cx={cx} cy={cy} r="4" fill="hsl(225,50%,25%)"
          animate={{ r: [3,5,3], opacity: [0.4,0.8,0.4] }}
          transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
        />
      ))}
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(24, 85%, 52%)" />
          <stop offset="50%" stopColor="hsl(225, 50%, 25%)" />
          <stop offset="100%" stopColor="hsl(24, 75%, 58%)" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

const problems = [
  { icon: Key, title: "Misconfigured Permissions", desc: "Employees granted access they never should have had." },
  { icon: Users, title: "Over-trusted Vendors", desc: "Third-party access that bypasses internal controls." },
  { icon: AlertTriangle, title: "Inactive Employee Tokens", desc: "Former employees retaining active access credentials." },
  { icon: Database, title: "Accidental Data Exposure", desc: "Sensitive data exposed through human error." },
  { icon: GitBranch, title: "Privilege Escalation", desc: "Gradual accumulation of unnecessary permissions." },
  { icon: Lock, title: "Shadow Access Paths", desc: "Undocumented access routes through system complexity." },
];

const impacts = [
  {
    title: "Economic Impact",
    color: "from-primary to-secondary",
    items: ["Prevent costly internal breaches", "Reduce compliance penalties", "Increase investor confidence"],
  },
  {
    title: "Operational Impact",
    color: "from-secondary to-primary",
    items: ["Enable safe startup scaling", "Prevent privilege sprawl", "Improve infrastructure governance"],
  },
  {
    title: "Social Impact",
    color: "from-primary to-secondary",
    items: ["Strengthen data privacy protection", "Promote responsible access culture", "Build trust with stakeholders"],
  },
];

const Landing = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center grid-bg overflow-hidden">
        <NetworkGraph />
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />

        <div className="section-padding relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-4 gradient-text">
              ORG SENTINEL
            </h1>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight mb-6 max-w-4xl mx-auto text-foreground/90">
              Predict Internal Security Failures{" "}
              <span className="text-primary">Before They Happen</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
              Most security tools detect attacks after damage occurs.
              OrgSentinel predicts how normal human actions can break your system.
            </p>
            <p className="text-sm italic text-muted-foreground max-w-xl mx-auto mb-10">
              "In a world obsessed with external threats, we built the system that protects you from yourself."
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/simulate" className="btn-primary text-base flex items-center justify-center gap-2">
                Start Simulation <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/dashboard-demo" className="btn-outline-glow text-base">
                View Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative">
        <div className="section-padding">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-medium text-primary mb-2 tracking-widest uppercase">The Problem</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              The Biggest Threats Are <span className="gradient-text">Already Inside</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Most startups focus on external threats but ignore internal risks caused by everyday human behavior. These mistakes cause major incidents — no hacker required.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {problems.map((p, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="glass-card p-6 group hover:border-primary/30 transition-all duration-300 hover:glow-primary h-full">
                  <p.icon className="w-8 h-8 text-primary mb-4 transition-transform group-hover:scale-110" />
                  <h3 className="font-display font-semibold text-foreground mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-muted/10" />
        <div className="section-padding relative">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-medium text-accent mb-2 tracking-widest uppercase">Impact</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Why <span className="gradient-text">OrgSentinel</span> Matters
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {impacts.map((impact, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="glass-card p-8 h-full">
                  <div className={`h-1 w-16 rounded-full bg-gradient-to-r ${impact.color} mb-6`} />
                  <h3 className="font-display text-xl font-semibold text-foreground mb-4">{impact.title}</h3>
                  <ul className="space-y-3">
                    {impact.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        </div>
        <div className="section-padding relative text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Ready to <span className="gradient-text">Simulate</span>?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Discover vulnerabilities in your organization before they become incidents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/simulate" className="btn-primary flex items-center justify-center gap-2">
                Start Simulation <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/pricing" className="btn-outline-glow">
                View Pricing
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default Landing;
