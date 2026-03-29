import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Lock, CheckCircle2, Loader2, Building2, Mail, KeyRound, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const CompanyLogin = () => {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgId, setOrgId] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!companyName.trim()) e.companyName = "Company name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email address";
    if (!password.trim()) e.password = "Password is required";
    else if (password.length < 6) e.password = "Minimum 6 characters";
    if (!agreed) e.agreed = "You must accept the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    login({ companyName: companyName.trim(), email: email.trim(), orgId: orgId.trim() || undefined });
    toast({ title: "Welcome", description: `Authenticated as ${companyName.trim()}` });
    setLoading(false);
    navigate("/integrations");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md relative z-10">
        {/* Trust badges */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <span className="font-display text-2xl font-bold tracking-tight text-foreground">ORG SENTINEL</span>
          </div>
          <p className="text-muted-foreground text-sm">Enterprise Security Platform</p>
        </div>

        {/* Login card */}
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-foreground mb-1">Company Login</h2>
          <p className="text-sm text-muted-foreground mb-6">Authenticate your organization to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="companyName" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Company Name</Label>
              <Input id="companyName" placeholder="Acme Corporation" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={errors.companyName ? "border-destructive" : ""} />
              {errors.companyName && <p className="text-xs text-destructive">{errors.companyName}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Official Email</Label>
              <Input id="email" type="email" placeholder="admin@acme.com" value={email} onChange={(e) => setEmail(e.target.value)} className={errors.email ? "border-destructive" : ""} />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><KeyRound className="w-3.5 h-3.5" /> Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={errors.password ? "border-destructive" : ""} />
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="orgId" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><Hash className="w-3.5 h-3.5" /> Organization ID <span className="text-muted-foreground/60">(optional)</span></Label>
              <Input id="orgId" placeholder="ORG-XXXX" value={orgId} onChange={(e) => setOrgId(e.target.value)} />
            </div>

            {/* Compliance checkbox */}
            <div className="pt-2 space-y-1.5">
              <div className="flex items-start gap-2.5">
                <Checkbox id="terms" checked={agreed} onCheckedChange={(v) => setAgreed(v === true)} className="mt-0.5" />
                <label htmlFor="terms" className="text-xs leading-relaxed text-muted-foreground cursor-pointer">
                  I agree and authorize Org Sentinel to securely access, process, and analyze organizational data from connected systems solely for risk analysis, simulation, and security insights, in compliance with data protection standards.
                  <span className="block mt-1 space-x-2">
                    <a href="#" className="text-primary underline underline-offset-2">Privacy Policy</a>
                    <a href="#" className="text-primary underline underline-offset-2">Terms of Service</a>
                    <a href="#" className="text-primary underline underline-offset-2">Security Policy</a>
                  </span>
                </label>
              </div>
              {errors.agreed && <p className="text-xs text-destructive">{errors.agreed}</p>}
            </div>

            <Button type="submit" disabled={loading} className="w-full mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Authenticating...</> : "Login"}
            </Button>

            <Button type="button" variant="outline" className="w-full border-primary/30 text-foreground hover:bg-primary/5">
              Request Access
            </Button>
          </form>
        </div>

        {/* Trust elements */}
        <div className="mt-6 text-center space-y-3">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="w-3.5 h-3.5 text-primary" /> 256-bit Encryption
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> SOC 2 Compliant
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5 text-primary" /> GDPR Ready
            </div>
          </div>
          <p className="text-xs text-muted-foreground/70">Trusted by enterprise teams worldwide</p>
          <p className="text-[11px] text-muted-foreground/50">Your data is encrypted and securely processed</p>
        </div>
      </motion.div>
    </div>
  );
};

export default CompanyLogin;
