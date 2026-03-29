import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/org-sentinel-logo.jpeg";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/product", label: "Product" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/features", label: "Features" },
  { to: "/integrations", label: "Integrations" },
  { to: "/dashboard-demo", label: "Demo" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { session, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50" style={{ background: "hsl(30 40% 93% / 0.85)", backdropFilter: "blur(20px)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center mr-6">
            <img src={logo} alt="OrgSentinel" className="h-[56px] w-auto" />
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  location.pathname === link.to
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-foreground text-sm font-medium hover:bg-primary/15 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {session!.companyName.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{session!.companyName}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-medium text-foreground truncate">{session!.companyName}</p>
                        <p className="text-xs text-muted-foreground truncate">{session!.email}</p>
                      </div>
                      <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted/50 transition-colors">
                        <User className="w-4 h-4" /> Profile
                      </button>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-outline-glow text-sm !px-4 !py-2">
                  Company Login
                </Link>
                <Link to="/simulate" className="btn-primary text-sm !px-4 !py-2">
                  Start Simulation
                </Link>
              </>
            )}
          </div>

          <button className="lg:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-border/50"
            style={{ background: "hsl(30 40% 93% / 0.97)" }}
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-md text-sm ${
                    location.pathname === link.to
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                {isAuthenticated ? (
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm font-medium text-foreground">{session!.companyName}</span>
                    <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="text-sm text-destructive">Logout</button>
                  </div>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline-glow block text-center text-sm">Company Login</Link>
                    <Link to="/simulate" onClick={() => setMobileOpen(false)} className="btn-primary block text-center text-sm">Start Simulation</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
