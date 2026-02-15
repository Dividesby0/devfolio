import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X, Activity, Thermometer, Droplets, Pause, Play, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const PumpCard = ({ pump }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'critical': return 'bg-red-950/40 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
      case 'warning': return 'bg-yellow-950/40 border-yellow-500/50 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]';
      default: return 'bg-emerald-950/40 border-emerald-500/30 text-emerald-500';
    }
  };

  const getBarColor = (value, max, thresholds) => {
    const percentage = (value / max) * 100;
    if (percentage > thresholds.critical) return 'bg-red-500';
    if (percentage > thresholds.warning) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  return (
    <div className={`p-5 rounded-xl border transition-all duration-300 ${getStatusColor(pump.status)}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <h4 className="font-bold text-base tracking-wide text-foreground/90">PUMP-{pump.id}</h4>
          <span className="text-[10px] uppercase tracking-wider opacity-70">Industrial IoT Sensor</span>
        </div>
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase border ${
          pump.status === 'critical' ? 'bg-red-500/20 border-red-500/40' :
          pump.status === 'warning' ? 'bg-yellow-500/20 border-yellow-500/40' :
          'bg-emerald-500/20 border-emerald-500/40'
        }`}>
          {pump.status}
        </span>
      </div>
      
      <div className="space-y-4">
        {/* Temperature */}
        <div>
          <div className="flex justify-between text-xs mb-1.5 font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5"><Thermometer className="w-3.5 h-3.5"/> Core Temp</span>
            <span className="font-mono text-foreground">{pump.temp}°C</span>
          </div>
          <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              className={`h-full rounded-full ${getBarColor(pump.temp, 130, { warning: 65, critical: 80 })}`} 
              animate={{ width: `${Math.min((pump.temp / 130) * 100, 100)}%` }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </div>
        </div>

        {/* Pressure */}
        <div>
          <div className="flex justify-between text-xs mb-1.5 font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5"/> Hydraulic Pressure</span>
            <span className="font-mono text-foreground">{pump.pressure} PSI</span>
          </div>
          <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              className={`h-full rounded-full ${getBarColor(pump.pressure, 3500, { warning: 80, critical: 90 })}`}
              animate={{ width: `${Math.min((pump.pressure / 3500) * 100, 100)}%` }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </div>
        </div>

        {/* Flow Rate */}
        <div>
          <div className="flex justify-between text-xs mb-1.5 font-medium text-muted-foreground">
             <span className="flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5"/> Output Flow</span>
             <span className="font-mono text-foreground">{pump.flow} GPM</span>
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
             <span className="text-xs text-muted-foreground">Failure Probability</span>
             <span className={`text-sm font-bold font-mono ${pump.risk > 0.5 ? 'text-red-500' : 'text-emerald-500'}`}>
               {(pump.risk * 100).toFixed(1)}%
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnomalyDemo = ({ isOpen, onClose }) => {
  const [pumps, setPumps] = useState([
    { id: '101', temp: 65, pressure: 2100, flow: 450, status: 'normal', risk: 0.05 },
    { id: '102', temp: 72, pressure: 2300, flow: 440, status: 'normal', risk: 0.12 },
    { id: '103', temp: 88, pressure: 2900, flow: 410, status: 'warning', risk: 0.45 },
    { id: '104', temp: 62, pressure: 2050, flow: 460, status: 'normal', risk: 0.02 },
  ]);
  const [alerts, setAlerts] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [stats, setStats] = useState({ anomalies: 12, accuracy: 98.4, falsePositives: 2 });

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setPumps(prevPumps => prevPumps.map(pump => {
        const tempChange = (Math.random() - 0.5) * 5;
        const pressureChange = (Math.random() - 0.5) * 100;
        
        let newTemp = Math.max(50, Math.min(130, pump.temp + tempChange));
        let newPressure = Math.max(1500, Math.min(3500, pump.pressure + pressureChange));
        let newStatus = 'normal';
        let newRisk = pump.risk;

        if (newTemp > 100 || newPressure > 3000) {
          newStatus = 'critical';
          newRisk = 0.95;
          if (Math.random() > 0.8) {
             setAlerts(prev => [{
               id: Date.now(),
               pumpId: pump.id,
               type: 'CRITICAL OVERHEAT',
               message: `Pump #${pump.id} exceeds safety thresholds. Immediate shutdown advised.`,
               timestamp: new Date().toLocaleTimeString()
             }, ...prev].slice(0, 5));
             setStats(s => ({ ...s, anomalies: s.anomalies + 1 }));
          }
        } else if (newTemp > 85 || newPressure > 2800) {
          newStatus = 'warning';
          newRisk = 0.60;
        } else {
          newRisk = Math.max(0, newRisk - 0.05);
        }

        return { ...pump, temp: Math.floor(newTemp), pressure: Math.floor(newPressure), status: newStatus, risk: newRisk };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 gap-0 bg-[#0a0a0f] text-slate-200 border-slate-800 overflow-hidden flex flex-col font-sans">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-[#111116]">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg">
              <Shield className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
                ANOMALY DETECTION SYSTEM
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">V2.0 LIVE</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 font-medium tracking-wide">
                REAL-TIME INDUSTRIAL MONITORING // FRACKING PUMPS
              </DialogDescription>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)} className="bg-transparent border-slate-700 hover:bg-slate-800 text-slate-300">
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? 'PAUSE SIMULATION' : 'RESUME SIMULATION'}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white hover:bg-slate-800">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 bg-[#0a0a0f]">
          {/* Main Dashboard - Left Column */}
          <div className="lg:col-span-8 p-6 overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               {pumps.map(pump => <PumpCard key={pump.id} pump={pump} />)}
            </div>

            <Card className="bg-[#111116] border-slate-800 shadow-none">
              <CardHeader className="pb-4 border-b border-slate-800/50">
                <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-slate-400">
                  <Activity className="w-4 h-4 text-blue-500"/> Live Sensor Telemetry
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-56 w-full rounded-lg border border-slate-800 bg-[#08080a] relative overflow-hidden flex items-end justify-between px-1 gap-0.5 p-4">
                  <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none">
                    <div className="border-r border-slate-800/20"></div>
                    <div className="border-r border-slate-800/20"></div>
                    <div className="border-r border-slate-800/20"></div>
                    <div className="border-b border-slate-800/20 col-span-4 row-start-2"></div>
                    <div className="border-b border-slate-800/20 col-span-4 row-start-3"></div>
                  </div>
                  {/* Mock Chart Visualization */}
                  {Array.from({ length: 50 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-full bg-blue-500/80 hover:bg-blue-400 transition-colors rounded-sm"
                      initial={{ height: '20%' }}
                      animate={{ height: `${Math.random() * 70 + 10}%` }}
                      transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: i * 0.03 }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-4 bg-[#111116] border-l border-slate-800 flex flex-col h-full">
            {/* Stats Panel */}
            <div className="p-6 border-b border-slate-800">
               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-5">System Metrics</h3>
               <div className="space-y-4">
                  <div className="bg-[#0a0a0f] p-4 rounded-lg border border-slate-800">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-slate-400">Model Accuracy</span>
                      <span className="font-mono font-bold text-emerald-400">{stats.accuracy}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-emerald-500 h-full w-[98.4%]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0a0a0f] p-4 rounded-lg border border-slate-800">
                      <div className="text-xs text-slate-500 mb-1">Anomalies</div>
                      <div className="text-2xl font-mono font-bold text-white">{stats.anomalies}</div>
                    </div>
                    <div className="bg-[#0a0a0f] p-4 rounded-lg border border-slate-800">
                      <div className="text-xs text-slate-500 mb-1">False Positives</div>
                      <div className="text-2xl font-mono font-bold text-yellow-500">{stats.falsePositives}</div>
                    </div>
                  </div>
               </div>
            </div>

            {/* Alerts Feed */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 px-6 border-b border-slate-800 bg-[#16161e]">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                   <AlertTriangle className="w-4 h-4 text-orange-500"/> Alert Log
                 </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {alerts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-3 opacity-50">
                      <Shield className="w-12 h-12" />
                      <p className="text-sm font-medium">System Nominal</p>
                    </div>
                  ) : (
                    alerts.map(alert => (
                      <motion.div 
                        key={alert.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-4 bg-red-950/10 border-l-4 border-red-500 border-y border-r border-slate-800/50 rounded-r-md"
                      >
                         <div className="flex justify-between items-start mb-2">
                           <span className="font-bold text-red-400 text-xs tracking-wider uppercase">{alert.type}</span>
                           <span className="text-[10px] font-mono text-slate-500">{alert.timestamp}</span>
                         </div>
                         <p className="text-slate-400 text-xs leading-relaxed border-t border-red-500/10 pt-2 mt-1">{alert.message}</p>
                         <div className="mt-3">
                            <Button size="sm" variant="outline" className="h-7 text-[10px] w-full border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 uppercase tracking-wide">
                               Initiate Shutdown
                            </Button>
                         </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnomalyDemo;