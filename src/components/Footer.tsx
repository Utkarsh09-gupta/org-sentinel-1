import { Link } from "react-router-dom";
import logo from "@/assets/org-sentinel-logo.jpeg";

const Footer = () => (
  <footer className="border-t border-border/50 bg-muted/20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="inline-block mb-4">
            <img src={logo} alt="OrgSentinel" className="h-10 w-auto" />
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Predict internal security failures before they happen. Built for modern startups.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-4 text-sm">Product</h4>
          <div className="space-y-2">
            {[["Features", "/features"], ["How It Works", "/how-it-works"], ["Pricing", "/pricing"], ["Demo", "/dashboard-demo"]].map(([label, to]) => (
              <Link key={to} to={to} className="block text-sm text-muted-foreground hover:text-primary transition-colors">{label}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-4 text-sm">Company</h4>
          <div className="space-y-2">
            {[["About", "/about"], ["Contact", "/contact"], ["Product", "/product"]].map(([label, to]) => (
              <Link key={to} to={to} className="block text-sm text-muted-foreground hover:text-primary transition-colors">{label}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-4 text-sm">Legal</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Privacy Policy</p>
            <p>Terms of Service</p>
            <p>Security</p>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground">© 2026 OrgSentinel. All rights reserved.</p>
        <p className="text-sm text-muted-foreground">Protecting you from yourself.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
