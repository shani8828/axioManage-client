import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Info, LifeBuoy, ArrowLeft, Search, Map } from "lucide-react";

export default function NoPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-gray-100 px-6 py-12 text-slate-900 overflow-hidden">
      
      {/* Animated Background Element */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 10, 0] 
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -right-20 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl -z-10"
      />

      {/* Floating 404 Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <motion.h1 
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="text-[12rem] md:text-[16rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-indigo-600 to-indigo-900 leading-none select-none opacity-10"
        >
          404
        </motion.h1>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Map className="w-16 h-16 text-indigo-600 mb-4" />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-center">
            Lost in Space?
          </h2>
        </div>
      </motion.div>

      <p className="text-center text-slate-500 max-w-lg mt-6 mb-10 leading-relaxed">
        The page you’re looking for has drifted out of orbit. Don’t worry, even the best managers encounter a missing link now and then.
      </p>

      {/* Glassmorphism Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mb-12">
        <ActionCard 
          to="/" 
          icon={<Home className="w-5 h-5" />} 
          title="Back to Base" 
          desc="Return to dashboard"
          variant="primary"
        />
        <ActionCard 
          to="/about" 
          icon={<Info className="w-5 h-5" />} 
          title="About Us" 
          desc="Learn our mission"
          variant="secondary"
        />
        <ActionCard 
          href="mailto:support@example.com" 
          icon={<LifeBuoy className="w-5 h-5" />} 
          title="Get Support" 
          desc="Talk to a human"
          variant="secondary"
          isExternal
        />
      </div>

      {/* Tips Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="max-w-xl w-full bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white shadow-xl shadow-slate-200/50"
      >
        <div className="flex items-center gap-2 mb-4 text-indigo-600">
          <Search className="w-5 h-5" />
          <h3 className="font-bold uppercase tracking-wider text-xs">Quick Recovery Tips</h3>
        </div>
        <ul className="space-y-3 text-sm text-slate-600 font-medium">
          <li className="flex items-start gap-2">
            <span className="text-indigo-500">•</span> Double check the URL spelling
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-500">•</span> Use the sidebar to find a specific tool
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-500">•</span> Try refreshing the page
          </li>
        </ul>
      </motion.div>

      <Link to={-1} className="mt-8 flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors text-sm font-semibold group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Go Back to Previous Page
      </Link>
    </div>
  );
}

// Helper component for the action cards
function ActionCard({ to, href, icon, title, desc, variant, isExternal }) {
  const content = (
    <div className={`p-6 rounded-2xl border transition-all duration-300 h-full ${
      variant === 'primary' 
      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700' 
      : 'bg-white border-slate-200 text-slate-900 hover:border-indigo-300 hover:shadow-md'
    }`}>
      <div className={`mb-4 w-10 h-10 rounded-xl flex items-center justify-center ${variant === 'primary' ? 'bg-white/20' : 'bg-indigo-50 text-indigo-600'}`}>
        {icon}
      </div>
      <h4 className="font-bold text-lg mb-1">{title}</h4>
      <p className={`text-xs ${variant === 'primary' ? 'text-indigo-100' : 'text-slate-500'}`}>{desc}</p>
    </div>
  );

  return (
    <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
      {isExternal ? <a href={href}>{content}</a> : <Link to={to}>{content}</Link>}
    </motion.div>
  );
}