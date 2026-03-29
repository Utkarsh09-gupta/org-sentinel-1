import { useState } from "react";
import { Send } from "lucide-react";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll be in touch soon.");
    setForm({ name: "", email: "", company: "", message: "" });
  };

  return (
    <Layout>
      <section className="relative overflow-hidden">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-electric-cyan/8 rounded-full blur-[120px]" />
        <div className="section-padding relative">
          <div className="max-w-2xl mx-auto">
            <AnimatedSection className="text-center mb-12">
              <p className="text-sm font-medium text-accent mb-2 tracking-widest uppercase">Contact</p>
              <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
                Get in <span className="gradient-text">Touch</span>
              </h1>
              <p className="text-muted-foreground">
                Ready to simulate? Let's talk about protecting your organization.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
                {[
                  { name: "name" as const, label: "Name", type: "text", placeholder: "Your name" },
                  { name: "email" as const, label: "Email", type: "email", placeholder: "you@company.com" },
                  { name: "company" as const, label: "Company", type: "text", placeholder: "Company name" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{field.label}</label>
                    <input
                      type={field.type}
                      required
                      value={form[field.name]}
                      onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all text-sm"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your security needs..."
                    className="w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all text-sm resize-none"
                  />
                </div>
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                  Send Message <Send className="w-4 h-4" />
                </button>
              </form>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
