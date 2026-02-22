import { Bell, Droplets, Menu, ChevronDown, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = ["Dashboard", "Farms", "Irrigation Control", "Analytics", "Weather", "Devices", "Settings"];

const Navbar = () => {
  const [active, setActive] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className="sticky top-0 z-50 card-glass shadow-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Droplets className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">EcoDrip</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActive(item)}
                className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  active === item
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item}
                {active === item && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-accent"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Farm Selector */}
            <button className="hidden sm:flex items-center gap-1.5 rounded-xl bg-muted/50 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
              🌾 Farm Alpha
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="rounded-xl p-2 text-muted-foreground hover:bg-muted transition-colors"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button className="relative rounded-xl p-2 text-muted-foreground hover:bg-muted transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
            </button>
            <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
              FM
            </div>
            <button
              className="lg:hidden rounded-xl p-2 text-muted-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-border"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => { setActive(item); setMobileOpen(false); }}
                  className={`block w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    active === item ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
