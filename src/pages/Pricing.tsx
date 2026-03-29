import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    features: ["Basic risk simulation", "Access graph visualization", "Up to 50 users", "Email support", "Weekly reports"],
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$99",
    period: "/month",
    features: ["Advanced scenario engine", "Blast Radius scoring", "Risk dashboard", "Up to 200 users", "Priority support", "API access"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: ["Real-time monitoring", "Policy optimization", "Compliance reports", "Dedicated support", "Unlimited users", "Custom integrations"],
    highlighted: false,
  },
];

const Pricing = () => (
  <Layout>
    <section className="relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-electric-purple/8 rounded-full blur-[150px]" />
      <div className="section-padding relative">
        <AnimatedSection className="text-center mb-16">
          <p className="text-sm font-medium text-secondary mb-2 tracking-widest uppercase">Pricing</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Start free. Scale when you're ready.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <AnimatedSection key={i} delay={i * 0.12}>
              <div className={`glass-card p-8 h-full flex flex-col relative ${
                plan.highlighted ? "border-primary/50 glow-primary" : ""
              }`}>
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="font-display text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={plan.highlighted ? "btn-primary text-center" : "btn-outline-glow text-center"}
                >
                  {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                </Link>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Pricing;
