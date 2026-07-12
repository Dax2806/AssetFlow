import React from 'react';
import { 
  Mail, Lock, User, Briefcase, ChevronRight, Sparkles, Sun, Moon, LogIn, Check, HelpCircle, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AssetFlowLogoIcon } from './common/AssetFlowLogo';

interface LandingPageProps {
  onSignIn: (email: string) => void;
  onSignUp: (userData: {
    name: string;
    email: string;
    departmentName: string;
    employeeId: string;
  }) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function LandingPage({ onSignIn, onSignUp, darkMode, setDarkMode }: LandingPageProps) {
  // Authentication states
  const [email, setEmail] = React.useState('om.patel@assetflow.com');
  const [password, setPassword] = React.useState('password123');
  const [rememberMe, setRememberMe] = React.useState(true);
  const [authTab, setAuthTab] = React.useState<'signin' | 'signup'>('signin');
  const [showEmailForm, setShowEmailForm] = React.useState(false);
  const [showAutofills, setShowAutofills] = React.useState(false);

  // Sign up fields
  const [signupName, setSignupName] = React.useState('');
  const [signupEmail, setSignupEmail] = React.useState('');
  const [signupPassword, setSignupPassword] = React.useState('');
  const [signupDept, setSignupDept] = React.useState('Engineering');
  const [signupEmpId, setSignupEmpId] = React.useState('');

  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [activeSlide, setActiveSlide] = React.useState(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter an email address.');
      return;
    }
    onSignIn(email);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword) {
      showToast('Please fill out all required fields.');
      return;
    }
    onSignUp({
      name: signupName,
      email: signupEmail,
      departmentName: signupDept,
      employeeId: signupEmpId || `EMP-${Math.floor(100 + Math.random() * 900)}`
    });
    showToast(`Account successfully registered! Welcome, ${signupName}.`);
  };

  // Demo accounts for quick evaluation
  const demoAccounts = [
    { label: 'Admin', email: 'om.patel@assetflow.com', desc: 'Full System Control' },
    { label: 'Asset Manager', email: 'jash.borad@assetflow.com', desc: 'Inventory & Audits' },
    { label: 'Dept Head', email: 'sarah.jenkins@assetflow.com', desc: 'Approvals & Team' },
    { label: 'Employee', email: 'rahul.patel@assetflow.com', desc: 'View Allocations' }
  ];

  const selectDemoAccount = (accEmail: string) => {
    setEmail(accEmail);
    setPassword('password123');
    showToast(`Loaded ${demoAccounts.find(a => a.email === accEmail)?.label} profile credentials.`);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + 3) % 3);
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % 3);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 font-sans flex relative overflow-hidden">
      
      {/* GLOWING AMBIENT BACKGROUNDS */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* TOAST ALERTS */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#16171d] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-bold flex items-center gap-2 border border-zinc-800"
          >
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT COLUMN: AUTHENTICATION FLOW */}
      <div className="w-full lg:w-[48%] flex flex-col justify-between p-8 sm:p-12 relative z-10 select-none min-h-screen">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight text-white flex items-center select-none cursor-pointer">
            assetflow<span className="text-emerald-400 font-extrabold ml-0.5 animate-pulse">●</span>
          </div>

          {/* Theme/Mode Switch (Muted) */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Center Main Login Form Container */}
        <div className="max-w-md w-full mx-auto my-auto space-y-8 flex flex-col justify-center">
          
          {/* Circular Glossy Bezel Coin Logo Icon */}
          <div className="flex justify-center">
            <div className="relative group cursor-pointer" onClick={() => showToast("AssetFlow Secure Auth State Active")}>
              {/* Outer faint pulsing flow ring */}
              <div className="absolute -inset-4 rounded-full border border-dashed border-emerald-500/20 animate-[spin_60s_linear_infinite] pointer-events-none" />
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 blur-md pointer-events-none opacity-80" />
              
              {/* Metallic 3D Coin Plate */}
              <div className="relative h-20 w-20 bg-gradient-to-b from-[#2e313e] to-[#12131a] border border-[#3e4253] rounded-full flex items-center justify-center shadow-2xl">
                {/* Gloss Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 rounded-full pointer-events-none" />
                
                {/* Silver Inner Bezel Ring */}
                <div className="absolute inset-[3px] rounded-full border border-white/5 bg-gradient-to-b from-[#1b1c24] to-[#0d0e12]" />
                
                <AssetFlowLogoIcon size={38} className="text-white z-10" />
                
                {/* Mini connection node */}
                <div className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 border border-black shadow-sm" />
              </div>
            </div>
          </div>

          {/* Header Title matching emergent style layout */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Build Full-Stack
              <span className="block mt-1">
                Asset Ledgers <span className="text-[#10b981]">in minutes</span>
              </span>
            </h1>
          </div>

          {/* Login Action Buttons */}
          <div className="space-y-4 w-full">
            
            {/* Google Authentication Button */}
            <button
              onClick={() => {
                showToast("Logging in with corporate Google Workspace profile...");
                onSignIn("om.patel@assetflow.com");
              }}
              className="w-full h-12 flex items-center justify-center rounded-2xl bg-white text-zinc-900 hover:bg-zinc-50 font-bold text-[13px] transition-all cursor-pointer active:scale-98 shadow-lg"
            >
              {/* Inline High-Fidelity Google "G" Icon */}
              <svg className="h-4.5 w-4.5 mr-3 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.5-1.14 2.76-2.4 3.6l3.71 2.88c2.17-2 3.82-4.94 3.82-8.33z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.97-1.08 7.96-2.92l-3.71-2.88c-1.03.69-2.35 1.1-4.25 1.1-3.27 0-6.04-2.2-7.03-5.17H1.14v2.99C3.12 20.06 7.22 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M4.97 14.13c-.25-.76-.4-1.57-.4-2.4 0-.83.15-1.64.4-2.4V6.34H1.14C.41 7.81 0 9.46 0 11.23c0 1.77.41 3.42 1.14 4.89l3.83-2.99z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.97 1.19 15.24 0 12 0 7.22 0 3.12 3.94 1.14 7.89l3.83 2.99c.99-2.97 3.76-5.13 7.03-5.13z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Email Authentication Dropdown Trigger Button */}
            <button
              onClick={() => {
                setShowEmailForm(!showEmailForm);
                showToast(showEmailForm ? "Email panel hidden" : "Email panel expanded");
              }}
              className={`w-full h-12 flex items-center justify-center rounded-2xl border transition-all font-bold text-[13px] cursor-pointer active:scale-98 ${
                showEmailForm 
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-500/15' 
                  : 'bg-[#181922] border-white/10 text-white hover:bg-[#20222f] hover:border-white/20'
              }`}
            >
              <Mail className="h-4 w-4 mr-3 shrink-0" />
              <span>Continue with Email</span>
            </button>

            {/* EXPANDABLE EMAIL CONTAINER: BOTH SIGN IN & SIGN UP */}
            <AnimatePresence>
              {showEmailForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="bg-[#11121a] border border-white/10 p-5 rounded-2xl text-left space-y-4">
                    
                    {/* Inline Tab Selector */}
                    <div className="grid grid-cols-2 p-1 bg-black/40 rounded-xl border border-white/5">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthTab('signin');
                          showToast("Switched to Sign In mode");
                        }}
                        className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                          authTab === 'signin' 
                            ? 'bg-[#1e202e] text-white shadow' 
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthTab('signup');
                          showToast("Switched to Sign Up mode");
                        }}
                        className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                          authTab === 'signup' 
                            ? 'bg-[#1e202e] text-white shadow' 
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        Sign Up
                      </button>
                    </div>

                    {/* SIGN IN VIEW */}
                    {authTab === 'signin' ? (
                      <form onSubmit={handleSignInSubmit} className="space-y-3.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
                            Corporate Email
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. om.patel@assetflow.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-10 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 text-xs font-semibold outline-none focus:border-emerald-500 text-white transition-colors"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
                            Security Token / Password
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-10 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 text-xs font-semibold outline-none focus:border-emerald-500 text-white transition-colors"
                          />
                        </div>

                        {/* Autofill helper drawer trigger */}
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => setShowAutofills(!showAutofills)}
                            className="text-[10.5px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                          >
                            <HelpCircle className="h-3.5 w-3.5" />
                            <span>Quick Role Autofills (Evaluation Mode)</span>
                          </button>
                          
                          {showAutofills && (
                            <div className="grid grid-cols-2 gap-1.5 mt-2 p-2 bg-black/50 border border-white/5 rounded-xl">
                              {demoAccounts.map((acc, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => selectDemoAccount(acc.email)}
                                  className={`px-2 py-1.5 rounded-lg border text-left text-[10px] transition-all ${
                                    email === acc.email 
                                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-bold' 
                                      : 'border-white/5 bg-[#171822] hover:bg-[#202130] text-zinc-400'
                                  }`}
                                >
                                  <span className="block font-semibold">{acc.label}</span>
                                  <span className="text-[8.5px] opacity-70 block truncate">{acc.email}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="w-full h-10 mt-1.5 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow shadow-emerald-600/10 transition-colors"
                        >
                          <LogIn className="h-3.5 w-3.5" />
                          <span>Authenticate & Sign In</span>
                        </button>
                      </form>
                    ) : (
                      /* SIGN UP VIEW (Styled precisely and completely) */
                      <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
                            Full Name
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              placeholder="e.g. Rahul Patel"
                              value={signupName}
                              onChange={(e) => setSignupName(e.target.value)}
                              className="h-10 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 text-xs font-semibold outline-none focus:border-emerald-500 text-white transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
                            Corporate Email
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              required
                              placeholder="name@assetflow.com"
                              value={signupEmail}
                              onChange={(e) => setSignupEmail(e.target.value)}
                              className="h-10 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 text-xs font-semibold outline-none focus:border-emerald-500 text-white transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
                            Password
                          </label>
                          <div className="relative">
                            <input
                              type="password"
                              required
                              placeholder="Minimum 6 characters"
                              value={signupPassword}
                              onChange={(e) => setSignupPassword(e.target.value)}
                              className="h-10 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 text-xs font-semibold outline-none focus:border-emerald-500 text-white transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
                            Assigned Department
                          </label>
                          <select
                            value={signupDept}
                            onChange={(e) => setSignupDept(e.target.value)}
                            className="h-10 w-full rounded-xl border border-white/10 bg-[#161720] px-3.5 text-xs font-semibold outline-none focus:border-emerald-500 text-zinc-300 transition-colors"
                          >
                            <option value="Engineering">Engineering</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Finance">Finance</option>
                            <option value="Operations">Operations</option>
                            <option value="HR">HR</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
                            Employee ID <span className="text-[9px] text-zinc-600 lowercase">(optional)</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. EMP-241"
                            value={signupEmpId}
                            onChange={(e) => setSignupEmpId(e.target.value)}
                            className="h-10 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 text-xs font-semibold outline-none focus:border-emerald-500 text-white transition-colors"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full h-10 mt-1.5 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow shadow-emerald-600/10 transition-colors"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Create & Allocate Account</span>
                        </button>
                      </form>
                    )}

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle view more inline action */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowEmailForm(true);
                  setAuthTab(authTab === 'signin' ? 'signup' : 'signin');
                  showToast(authTab === 'signin' ? 'Create new workspace profile' : 'Sign in using credentials');
                }}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors underline cursor-pointer font-medium"
              >
                {authTab === 'signin' ? 'Create Custom Employee Profile' : 'Already have a profile? Sign In'}
              </button>
            </div>

          </div>

          {/* Legal Compliance Block */}
          <div className="text-center pt-2">
            <p className="text-[11px] text-zinc-500 leading-relaxed max-w-xs mx-auto">
              By continuing, you agree to our{' '}
              <span className="underline hover:text-zinc-300 cursor-pointer">Terms of Service</span> and{' '}
              <span className="underline hover:text-zinc-300 cursor-pointer">Privacy Policy</span>.
            </p>
          </div>

        </div>

        {/* Footer info matching emergent screen */}
        <div className="text-center lg:text-left pt-6">
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
            © ASSETFLOW.INC • SECURE DATA PROTOCOL ACT
          </p>
        </div>

      </div>

      {/* RIGHT COLUMN: GRADIENT PORTAL WITH FLOATING BROWSER MOCKUP */}
      <div className="hidden lg:flex lg:w-[52%] p-6 flex-col justify-between relative select-none">
        
        {/* Rounded Gradient Core Box precisely duplicating the uploaded reference */}
        <div className="w-full h-full rounded-[32px] bg-gradient-to-br from-[#12a5df] via-[#1d4ed8] to-[#0ea5e9] p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
          
          {/* Light Ambient Glow over the gradient */}
          <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient from-white/10 to-transparent pointer-events-none" />
          <div className="absolute top-[-10%] left-[-10%] h-72 w-72 bg-cyan-200/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] h-72 w-72 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none" />

          {/* YC Badge on Top Right */}
          <div className="absolute top-8 right-8 z-20 flex items-center gap-1.5 bg-orange-600/90 text-white font-bold text-[10px] uppercase tracking-wide px-3 py-1.5 rounded-lg shadow-lg">
            <span className="h-3 w-3 bg-white text-orange-600 flex items-center justify-center font-black text-[8px] rounded-xs mr-0.5">Y</span>
            <span>Combinator S24</span>
          </div>

          {/* Centered-Top Title Block with sketch face avatars */}
          <div className="flex flex-col items-center text-center space-y-4 pt-10 z-10">
            
            {/* Sketch Face Avatars Group capsule matching reference perfectly */}
            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-md">
              {/* Left Avatars (Sketches) */}
              <div className="flex -space-x-1">
                {/* Female long-hair profile sketch */}
                <svg className="h-6 w-6 rounded-full bg-white border border-black p-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="8" r="4" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M5 20C5 16 8 14 12 14C16 14 19 16 19 20" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M7 6C6 8 6 12 9 12M17 6C18 8 18 12 15 12" stroke="black" strokeWidth="1" strokeLinecap="round" />
                </svg>
                {/* Male sketch curly */}
                <svg className="h-6 w-6 rounded-full bg-white border border-black p-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="8" r="3.5" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M6 21C6 17 9 15 12 15C15 15 18 17 18 21" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M9 5C10 4 14 4 15 5" stroke="black" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              <span className="text-[12px] font-extrabold text-white uppercase tracking-wider px-1">
                Built for teams
              </span>

              {/* Right Avatars (Sketches) */}
              <div className="flex -space-x-1">
                {/* Bearded sketch */}
                <svg className="h-6 w-6 rounded-full bg-white border border-black p-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="8" r="3.5" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M6 21C6 17 9 15 12 15C15 15 18 17 18 21" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M9 10C9 12 12 13 12 13C12 13 15 12 15 10" stroke="black" strokeWidth="1.5" />
                </svg>
                {/* Pony-tail sketch */}
                <svg className="h-6 w-6 rounded-full bg-white border border-black p-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="8" r="3.5" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M5 21C5 17 8 15 11 15C14 15 17 17 17 21" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M14.5 8C16 8 18 9.5 17 11.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Description Subtext centered */}
            <p className="text-sm font-bold text-sky-50 leading-relaxed max-w-md">
              {activeSlide === 0 && "Build, test and deploy with your favourite people in real-time, from concept to launch."}
              {activeSlide === 1 && "Monitor operational transfers, repair logs, and scheduling allocations in a centralized matrix."}
              {activeSlide === 2 && "Perform barcode audits, review historical ledger updates, and sign-off compliance seamlessly."}
            </p>
          </div>

          {/* FLOATING BROWSER MOCKUP CONTAINER */}
          <div className="w-full flex-1 flex items-center justify-center px-4 py-8 z-10">
            <motion.div 
              key={activeSlide}
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="w-full max-w-lg aspect-video rounded-2xl bg-[#0b0c10] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col"
            >
              
              {/* Browser Window Title Bar */}
              <div className="h-10 bg-[#12131a] border-b border-white/5 flex items-center justify-between px-4 shrink-0">
                {/* macOS traffic light circles */}
                <div className="flex items-center space-x-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                </div>
                
                {/* Simulated URL bar */}
                <div className="h-5.5 w-60 rounded bg-white/5 border border-white/5 flex items-center justify-center text-[9px] text-zinc-400 gap-1.5 px-3">
                  <svg className="h-2.5 w-2.5 text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" strokeWidth="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2" />
                  </svg>
                  <span className="truncate font-mono">assetflow.erp/{activeSlide === 0 ? 'trek-vibe-builder' : activeSlide === 1 ? 'allocation-ledger' : 'maintenance-dispatch'}</span>
                </div>

                {/* Simulated action details */}
                <div className="flex items-center space-x-2 text-zinc-500">
                  <div className="h-3.5 w-3.5 rounded border border-white/10 flex items-center justify-center text-[7px]">↑</div>
                  <div className="h-3.5 w-3.5 rounded border border-white/10 flex items-center justify-center text-[7px]">+</div>
                </div>
              </div>

              {/* BROWSER VIEWPORT CONTAINER */}
              <div className="flex-1 bg-white relative p-4 flex flex-col justify-between overflow-hidden">
                
                {/* SLIDE 0: EXACT REPLICATION OF THE IMAGE WEBUILDS EDIT VIEW */}
                {activeSlide === 0 && (
                  <div className="h-full flex flex-col justify-between relative text-zinc-900 select-none">
                    
                    {/* Simulated website header */}
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                      <span className="font-extrabold text-[10px] text-slate-800 tracking-wider">Trek Vibe</span>
                      <div className="flex items-center gap-2.5 text-[8px] font-bold text-slate-500">
                        <span>Home</span>
                        <span>About Us</span>
                        <span>Treks</span>
                        <span>Contact</span>
                        <span className="bg-slate-900 text-white rounded px-2 py-0.5 font-extrabold text-[7.5px] scale-95 border border-black">Join Now</span>
                      </div>
                    </div>

                    {/* Main Trek Typography Heading */}
                    <div className="my-auto space-y-2 text-left relative py-1">
                      
                      {/* Selection Box Outline styled precisely like the image */}
                      <div className="absolute -inset-2.5 border-2 border-blue-500 rounded pointer-events-none">
                        {/* Selector tag "h1" */}
                        <div className="absolute top-[-9px] left-2 bg-blue-600 text-white text-[7.5px] font-mono px-1 rounded flex items-center gap-0.5">
                          <span>◇</span> h1
                        </div>
                      </div>

                      {/* Display Heading Text */}
                      <h2 className="text-sm sm:text-base font-serif font-semibold text-slate-900 leading-snug tracking-tight text-center sm:text-left pr-4">
                        Step into the wild, breathe freedom, let
                        <span className="block text-slate-800 font-serif font-medium mt-1">Every trek tell your story.</span>
                      </h2>

                      {/* Paragraph Subtitle with Jane tag below */}
                      <p className="text-[7px] text-slate-400 font-medium leading-relaxed max-w-xs mt-2 relative">
                        Join a loving community of nature lovers, adventurers, and explorers as we uncover paths less traveled together.
                      </p>
                    </div>

                    {/* Bottom pine trees landscape matching the reference image */}
                    <div className="relative border-t border-zinc-100/60 pt-1.5 flex items-end justify-between">
                      
                      {/* Forest and tree vectors */}
                      <div className="flex items-end gap-1 select-none pointer-events-none opacity-80 h-10">
                        {/* Custom visual evergreen SVGs */}
                        <svg className="h-8 w-4 text-emerald-800" fill="currentColor" viewBox="0 0 20 40">
                          <polygon points="10,0 2,15 18,15" />
                          <polygon points="10,8 3,25 17,25" />
                          <polygon points="10,18 0,38 20,38" />
                        </svg>
                        <svg className="h-10 w-5 text-emerald-900" fill="currentColor" viewBox="0 0 20 40">
                          <polygon points="10,0 2,15 18,15" />
                          <polygon points="10,8 3,25 17,25" />
                          <polygon points="10,18 0,38 20,38" />
                        </svg>
                        <svg className="h-6 w-3 text-emerald-700" fill="currentColor" viewBox="0 0 20 40">
                          <polygon points="10,0 2,15 18,15" />
                          <polygon points="10,8 3,25 17,25" />
                          <polygon points="10,18 0,38 20,38" />
                        </svg>
                      </div>

                      {/* Simulated Trekking Button in browser viewport */}
                      <div className="flex gap-1 items-center pb-1 scale-95 origin-bottom-right">
                        <span className="bg-slate-900 text-white rounded-full px-2.5 py-0.5 text-[7px] font-black tracking-wider shadow flex items-center gap-1">
                          Start Trekking <span>→</span>
                        </span>
                        <span className="h-4 w-4 rounded-full border border-zinc-300 flex items-center justify-center text-[7px] bg-white text-zinc-500 font-bold shadow-xs">▶</span>
                      </div>

                      {/* Small signature emergent indicator on viewport bottom right */}
                      <div className="absolute right-0 bottom-0 text-[6px] font-bold text-zinc-400 bg-zinc-50 border border-zinc-200 rounded px-1 flex items-center gap-0.5 pointer-events-none">
                        <span>◳</span> Made with Emergent
                      </div>
                    </div>

                    {/* JANE Badged Cursor Floating Left */}
                    <div className="absolute left-18 bottom-8 z-20 flex flex-col items-start select-none pointer-events-none scale-90">
                      {/* Tiny green cursor pointer */}
                      <svg className="h-3 w-3 text-[#10b981] drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M0,0 L16,12 L9,14 L0,24 Z" />
                      </svg>
                      {/* Cursor label pill */}
                      <div className="bg-[#10b981] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-md shadow-lg -mt-0.5 ml-2">
                        Jane
                      </div>
                    </div>

                    {/* CHRIS Badged Cursor Floating Right pointing to "Join Now" */}
                    <div className="absolute right-10 top-5 z-20 flex flex-col items-start select-none pointer-events-none scale-90">
                      {/* Tiny blue cursor pointer */}
                      <svg className="h-3 w-3 text-[#3b82f6] drop-shadow-sm rotate-45" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M0,0 L16,12 L9,14 L0,24 Z" />
                      </svg>
                      {/* Cursor label pill */}
                      <div className="bg-[#3b82f6] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-md shadow-lg -mt-0.5 ml-2">
                        Chris
                      </div>
                    </div>

                  </div>
                )}

                {/* SLIDE 1: ENTERPRISE ALLOCATION LEDGER MAP */}
                {activeSlide === 1 && (
                  <div className="h-full flex flex-col justify-between text-zinc-900 select-none text-left">
                    <div className="flex items-center justify-between border-b border-zinc-150 pb-2">
                      <span className="text-[9px] font-extrabold tracking-wider text-slate-500">ASSETS MAP LEDGER</span>
                      <span className="text-[7.5px] font-mono bg-emerald-100 text-emerald-800 px-1 rounded font-bold uppercase tracking-wider">LIVE SYNC</span>
                    </div>

                    <div className="my-auto space-y-2.5">
                      <div className="grid grid-cols-2 gap-2">
                        {/* Box 1 */}
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-1 relative">
                          <div className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[7.5px] font-bold text-slate-400 block tracking-wider font-mono">AF-104 • STABLE</span>
                          <h4 className="text-[10px] font-extrabold text-slate-800 leading-tight">MacBook Pro M3 Max</h4>
                          <p className="text-[8px] text-zinc-500 font-medium">Holder: Om Patel (Engineering)</p>
                        </div>

                        {/* Box 2 */}
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <span className="text-[7.5px] font-bold text-slate-400 block tracking-wider font-mono">AF-891 • DEP. ACTIVE</span>
                          <h4 className="text-[10px] font-extrabold text-slate-800 leading-tight">Calibrate Centrifuge</h4>
                          <p className="text-[8px] text-zinc-500 font-medium">Assigned: Lab B Testing Fleet</p>
                        </div>
                      </div>

                      {/* Visual sync bridge schema */}
                      <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-[7.5px] text-emerald-700 font-bold leading-normal flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                        <span>Automatic tracking: HR directory sync successfully mapped 24 new remote laptops directly into local security audit logs.</span>
                      </div>
                    </div>

                    <div className="text-[7px] text-zinc-400 text-right">
                      Refreshed in 0.04ms • SECURE ERP TUNNEL
                    </div>
                  </div>
                )}

                {/* SLIDE 2: COMPACT MAINTENANCE REPAIR DISPATCHER */}
                {activeSlide === 2 && (
                  <div className="h-full flex flex-col justify-between text-zinc-900 select-none text-left">
                    <div className="flex items-center justify-between border-b border-zinc-150 pb-2">
                      <span className="text-[9px] font-extrabold tracking-wider text-slate-500">MAINTENANCE WORKFLOW STATUS</span>
                      <span className="text-[7.5px] font-mono bg-amber-100 text-amber-800 px-1 rounded font-bold uppercase tracking-wider">3 ACTIVE DISPATCHES</span>
                    </div>

                    <div className="my-auto space-y-1.5">
                      <div className="space-y-1">
                        {[
                          { title: 'Calibrate Lab Centrifuge Frame', status: 'Pending Tech Dispatch', color: 'bg-amber-400', tag: 'AF-891' },
                          { title: 'Battery Swap: MacBook Frame #102', status: 'Completed', color: 'bg-emerald-500', tag: 'AF-102' },
                          { title: 'Drone Calibration Suite #4', status: 'Dispatched (Medium Priority)', color: 'bg-sky-400', tag: 'AF-611' }
                        ].map((tk, idx) => (
                          <div key={idx} className="bg-slate-50 border border-slate-150 p-1.5 rounded-lg flex items-center justify-between text-[8px] font-semibold">
                            <div className="flex items-center gap-2 truncate">
                              <span className={`h-2 w-2 rounded-full ${tk.color}`} />
                              <span className="text-slate-800 truncate">{tk.title}</span>
                            </div>
                            <span className="text-slate-400 font-mono text-[7px] font-bold">{tk.tag}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-[7px] text-zinc-400 text-right">
                      Technician live dispatch board • Odoo ERP Solution
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>

          {/* BOTTOM STEP CONTROLS & PAGINATION DOTS (Exactly matching uploaded reference image) */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 z-10 mt-2">
            
            {/* Left Nav Arrow */}
            <button
              onClick={handlePrevSlide}
              className="h-10 w-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center border border-white/10 transition-all cursor-pointer active:scale-95"
              title="Previous Feature"
            >
              {/* Sleek rotating Arrow */}
              <svg className="h-4.5 w-4.5 text-white transform rotate-180" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Pagination dots (with active dot as a wide pill block) */}
            <div className="flex items-center space-x-2.5">
              {[0, 1, 2].map((slideIdx) => (
                <button
                  key={slideIdx}
                  onClick={() => {
                    setActiveSlide(slideIdx);
                    showToast(`Navigated to Slide ${slideIdx + 1}`);
                  }}
                  className={`h-2 rounded-full transition-all duration-350 cursor-pointer ${
                    activeSlide === slideIdx ? 'w-6 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                  title={`Go to slide ${slideIdx + 1}`}
                />
              ))}
            </div>

            {/* Right Nav Arrow */}
            <button
              onClick={handleNextSlide}
              className="h-10 w-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center border border-white/10 transition-all cursor-pointer active:scale-95"
              title="Next Feature"
            >
              <svg className="h-4.5 w-4.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
