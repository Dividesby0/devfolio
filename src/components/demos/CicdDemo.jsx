import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, Globe, RefreshCw, X, PlayCircle, GitCommit, Package, TestTube, 
  Check, TerminalSquare, LayoutDashboard, Clock, CheckCircle2, XCircle, 
  GitBranch, Settings, BarChart2, FileJson, AlertTriangle, ArrowRight, 
  Download, MoreHorizontal, RotateCcw, Box, ShieldCheck, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

// --- Sub-components for Pipeline Visualization ---

const PipelineStage = ({ stage, status, isActive, isLast, onClick }) => {
  const getStatusColor = () => {
    if (status === 'failed') return 'border-red-500 text-red-500 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]';
    if (status === 'success') return 'border-emerald-500 text-emerald-500 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
    if (status === 'running') return 'border-blue-500 text-blue-500 bg-blue-950/20 shadow-[0_0_20px_rgba(59,130,246,0.4)]';
    return 'border-slate-800 text-slate-500 bg-slate-900/50';
  };

  return (
    <div className="flex items-center flex-1 relative group">
      {/* Node */}
      <motion.div 
        className={`relative z-10 flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer min-w-[140px] ${getStatusColor()} ${isActive ? 'scale-105' : 'hover:scale-105 hover:border-slate-600'}`}
        onClick={() => onClick(stage)}
        layout
      >
        <div className="mb-3 p-2 rounded-full bg-background/50 border border-white/5 backdrop-blur-sm">
           {status === 'success' ? <Check className="w-5 h-5" /> : 
            status === 'failed' ? <X className="w-5 h-5" /> :
            <stage.icon className={`w-5 h-5 ${status === 'running' ? 'animate-pulse' : ''}`} />
           }
        </div>
        <div className="font-bold text-xs uppercase tracking-wider mb-1">{stage.name}</div>
        <div className="text-[10px] opacity-70 font-mono">
           {status === 'running' ? 'In Progress...' : status === 'pending' ? 'Pending' : status === 'success' ? 'Completed' : status === 'failed' ? 'Failed' : 'Waiting'}
        </div>

        {/* Hover Details Card */}
        <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 bg-[#161b22] border border-slate-700 rounded-lg p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 text-center hidden md:block">
           <div className="text-xs font-semibold text-white mb-1">{stage.description}</div>
           <div className="text-[10px] text-slate-400">Avg. Duration: {stage.avgTime}</div>
           <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#161b22] border-t border-l border-slate-700 rotate-45"></div>
        </div>
      </motion.div>

      {/* Connector Line */}
      {!isLast && (
        <div className="flex-1 h-[2px] bg-slate-800 mx-2 relative overflow-hidden">
          {(status === 'running' || status === 'success') && (
            <motion.div 
              className={`absolute inset-0 ${status === 'failed' ? 'bg-red-900/50' : 'bg-gradient-to-r from-transparent via-blue-500 to-transparent'}`}
              initial={{ x: '-100%' }}
              animate={status === 'success' ? { x: '100%', opacity: 1 } : { x: ['-100%', '100%'] }}
              transition={status === 'success' ? { duration: 0.5 } : { repeat: Infinity, duration: 1.5, ease: 'linear' }}
            />
          )}
          {status === 'success' && <div className="absolute inset-0 bg-emerald-500/50" />}
        </div>
      )}
    </div>
  );
};

// --- Mock Data & Config ---

const INITIAL_CONFIG = `name: production-pipeline
on:
  push:
    branches: [ "main", "develop" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
      - run: npm ci
      - run: npm run build
`;

const BRANCHES = [
  { name: 'main', protected: true },
  { name: 'develop', protected: false },
  { name: 'feature/auth-v2', protected: false },
  { name: 'hotfix/login-bug', protected: false },
];

const STAGES = [
  { id: 'source', name: 'Source', icon: GitCommit, description: 'Fetch code & deps', avgTime: '45s' },
  { id: 'build', name: 'Build', icon: Package, description: 'Compile & bundle', avgTime: '2m 10s' },
  { id: 'test', name: 'Test', icon: TestTube, description: 'Unit & E2E tests', avgTime: '3m 45s' },
  { id: 'deploy-stg', name: 'Staging', icon: Server, description: 'Deploy to UAT', avgTime: '1m 20s' },
  { id: 'deploy-prod', name: 'Production', icon: Globe, description: 'Public release', avgTime: '1m 00s' },
];

// --- Main Component ---

const CicdDemo = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pipeline');
  const [pipelineState, setPipelineState] = useState({
    status: 'idle', // idle, running, success, failed
    currentStageIndex: -1,
    branch: 'main',
    progress: 0,
    startTime: null,
    runId: 1045
  });
  
  const [logs, setLogs] = useState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [config, setConfig] = useState(INITIAL_CONFIG);
  const logEndRef = useRef(null);

  // Mock History
  const [history, setHistory] = useState([
    { id: 1044, branch: 'main', status: 'success', time: '2 hours ago', duration: '5m 23s' },
    { id: 1043, branch: 'develop', status: 'failed', time: '5 hours ago', duration: '2m 10s' },
    { id: 1042, branch: 'feature/auth-v2', status: 'success', time: '1 day ago', duration: '4m 45s' },
  ]);

  // Scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [...prev, {
      ts: new Date().toISOString().split('T')[1].slice(0, 12),
      msg,
      type
    }]);
  };

  const triggerPipeline = async (source = 'manual') => {
    if (pipelineState.status === 'running') return;

    setPipelineState(prev => ({
      ...prev,
      status: 'running',
      currentStageIndex: 0,
      startTime: Date.now(),
      progress: 0,
      runId: prev.runId + 1
    }));
    setLogs([]);
    setArtifacts([]);
    setActiveTab('pipeline');

    toast({
      title: source === 'webhook' ? "Webhook Received" : "Pipeline Triggered",
      description: `Started build #${pipelineState.runId + 1} on branch ${pipelineState.branch}`,
    });

    addLog(`Pipeline triggered by ${source} event`, 'info');
    addLog(`Checking out branch '${pipelineState.branch}'...`, 'info');

    // Simulation Loop
    for (let i = 0; i < STAGES.length; i++) {
      setPipelineState(prev => ({ ...prev, currentStageIndex: i }));
      
      const stage = STAGES[i];
      addLog(`[${stage.name}] Starting stage execution...`, 'info');
      
      // Simulate work time
      await new Promise(r => setTimeout(r, 1500));

      // Random failure simulation (only if not main branch to keep demo nice mostly)
      if (pipelineState.branch !== 'main' && Math.random() > 0.8) {
        setPipelineState(prev => ({ ...prev, status: 'failed' }));
        addLog(`[${stage.name}] Critical error: Process exited with code 1`, 'error');
        toast({ title: "Build Failed", description: "The pipeline encountered a critical error.", variant: "destructive" });
        return;
      }

      // Add stage specific artifacts/logs
      if (stage.id === 'build') {
        addLog(`[${stage.name}] Transpiling assets... Done.`, 'success');
        setArtifacts(prev => [...prev, { name: 'app-bundle.js', size: '2.4MB' }, { name: 'styles.css', size: '156KB' }]);
      }
      if (stage.id === 'test') {
        addLog(`[${stage.name}] Running 243 tests... All passed (100%)`, 'success');
      }

      addLog(`[${stage.name}] Stage completed successfully.`, 'success');
    }

    setPipelineState(prev => ({ ...prev, status: 'success', currentStageIndex: STAGES.length }));
    addLog("Pipeline completed successfully.", 'success');
    toast({ title: "Deployment Successful", description: "Changes are now live in Production.", className: "bg-emerald-500 text-white border-0" });
    
    // Add to history
    setHistory(prev => [{
      id: pipelineState.runId + 1,
      branch: pipelineState.branch,
      status: 'success',
      time: 'Just now',
      duration: '45s' // Mock
    }, ...prev]);
  };

  const promoteBuild = () => {
     toast({ title: "Promotion Queued", description: "Promoting Staging build to Production..." });
     triggerPipeline('promotion');
  };

  const rollback = () => {
    toast({ title: "Rollback Initiated", description: "Reverting Production to previous stable version v2.3.0", variant: "default" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 gap-0 bg-[#0a0a0f] text-slate-300 border-slate-800 overflow-hidden flex flex-col font-sans">
        
        {/* --- Top Bar --- */}
        <div className="h-16 border-b border-slate-800 bg-[#111116] flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-6">
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-3">
               <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/20">
                 <Zap className="w-5 h-5 text-white" />
               </div>
               Enterprise CI/CD
            </DialogTitle>
            
            <div className="h-6 w-px bg-slate-800 mx-2" />

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Branch context</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200 gap-2 min-w-[140px] justify-between">
                    <span className="flex items-center gap-2"><GitBranch className="w-3.5 h-3.5" /> {pipelineState.branch}</span>
                    <ArrowRight className="w-3 h-3 rotate-90 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#1c1c24] border-slate-800 text-slate-300">
                  <DropdownMenuLabel>Switch Branch</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  {BRANCHES.map(b => (
                    <DropdownMenuItem 
                      key={b.name} 
                      onClick={() => setPipelineState(p => ({ ...p, branch: b.name }))}
                      className="hover:bg-slate-800 focus:bg-slate-800 cursor-pointer flex justify-between"
                    >
                      <span className="flex items-center gap-2"><GitBranch className="w-3.5 h-3.5" /> {b.name}</span>
                      {b.protected && <ShieldCheck className="w-3 h-3 text-emerald-500" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="secondary" 
              size="sm" 
              className="hidden md:flex bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              onClick={() => triggerPipeline('webhook')}
              disabled={pipelineState.status === 'running'}
            >
              <Box className="w-4 h-4 mr-2" /> Simulate Webhook
            </Button>
            <Button 
              size="sm" 
              onClick={() => triggerPipeline('manual')}
              disabled={pipelineState.status === 'running'}
              className={`${pipelineState.status === 'running' ? 'bg-slate-700' : 'bg-blue-600 hover:bg-blue-500'} text-white shadow-lg shadow-blue-900/20`}
            >
              {pipelineState.status === 'running' ? <RefreshCw className="w-4 h-4 animate-spin mr-2"/> : <PlayCircle className="w-4 h-4 mr-2"/>}
              {pipelineState.status === 'running' ? 'Running...' : 'Run Pipeline'}
            </Button>
            <div className="h-6 w-px bg-slate-800 mx-1" />
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-800 text-slate-400">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* --- Main Content Area --- */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Sidebar Navigation */}
          <div className="w-16 md:w-64 bg-[#111116] border-r border-slate-800 flex flex-col justify-between shrink-0">
            <div className="p-4 space-y-2">
              {[
                { id: 'pipeline', label: 'Pipeline View', icon: LayoutDashboard },
                { id: 'analytics', label: 'Analytics', icon: BarChart2 },
                { id: 'config', label: 'Configuration', icon: FileJson },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all ${activeTab === item.id ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="hidden md:block">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Latest History Snippet */}
            <div className="p-4 border-t border-slate-800 hidden md:block">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Recent Builds</h3>
              <div className="space-y-2">
                {history.slice(0, 3).map(h => (
                  <div key={h.id} className="flex items-center justify-between p-2 rounded bg-[#0a0a0f] border border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      {h.status === 'success' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500"/> : <XCircle className="w-3.5 h-3.5 text-red-500"/>}
                      <span className="font-mono text-slate-300">#{h.id}</span>
                    </div>
                    <span className="text-slate-500">{h.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Content */}
          <div className="flex-1 overflow-hidden bg-[#0a0a0f] relative flex flex-col">
            <Tabs value={activeTab} className="flex-1 flex flex-col overflow-hidden">
              
              {/* --- PIPELINE VIEW --- */}
              <TabsContent value="pipeline" className="flex-1 flex flex-col m-0 p-0 overflow-hidden outline-none data-[state=inactive]:hidden">
                {/* Visual Flow */}
                <div className="h-[300px] shrink-0 border-b border-slate-800 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] relative flex items-center justify-center p-8 overflow-x-auto">
                  <div className="absolute inset-0 bg-[#0a0a0f]/90 z-0" />
                  <div className="relative z-10 w-full max-w-5xl flex justify-between gap-4">
                    {STAGES.map((stage, index) => {
                      let status = 'pending';
                      if (pipelineState.currentStageIndex === index && pipelineState.status === 'running') status = 'running';
                      else if (pipelineState.currentStageIndex > index || (pipelineState.status === 'success')) status = 'success';
                      else if (pipelineState.currentStageIndex === index && pipelineState.status === 'failed') status = 'failed';
                      
                      return (
                        <PipelineStage 
                          key={stage.id} 
                          stage={stage} 
                          status={status}
                          isActive={pipelineState.currentStageIndex === index}
                          isLast={index === STAGES.length - 1}
                          onClick={(s) => console.log(s)}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Details Panel */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 divide-x divide-slate-800 overflow-hidden">
                   
                   {/* Terminal */}
                   <div className="md:col-span-2 flex flex-col bg-[#050508]">
                      <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-[#111116]">
                         <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                            <TerminalSquare className="w-4 h-4" /> console_output.log
                         </div>
                         <div className="flex gap-2">
                            <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-500">Filter: All</Badge>
                            <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-500">Clear</Badge>
                         </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed space-y-1 custom-scrollbar">
                         {logs.length === 0 && <div className="text-slate-600 italic p-4 text-center">Ready to build. Waiting for trigger...</div>}
                         {logs.map((l, i) => (
                           <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-1 duration-200">
                             <span className="text-slate-600 select-none w-20 text-right shrink-0">{l.ts}</span>
                             <span className={`${l.type === 'error' ? 'text-red-400' : l.type === 'success' ? 'text-emerald-400' : 'text-slate-300'}`}>
                               {l.type === 'info' && <span className="text-blue-500 mr-2">ℹ</span>}
                               {l.type === 'success' && <span className="text-emerald-500 mr-2">✓</span>}
                               {l.type === 'error' && <span className="text-red-500 mr-2">✕</span>}
                               {l.msg}
                             </span>
                           </div>
                         ))}
                         <div ref={logEndRef} />
                      </div>
                   </div>

                   {/* Right Details Panel */}
                   <div className="flex flex-col bg-[#0a0a0f]">
                      <div className="p-4 border-b border-slate-800">
                        <h3 className="text-sm font-bold text-white mb-1">Build Artifacts</h3>
                        <p className="text-xs text-slate-500">Generated assets from current run</p>
                      </div>
                      <div className="p-4 flex-1 overflow-y-auto">
                         {artifacts.length === 0 ? (
                           <div className="text-center py-10 text-slate-600 text-sm border border-dashed border-slate-800 rounded-lg">
                             No artifacts generated yet.
                           </div>
                         ) : (
                           <div className="space-y-3">
                             {artifacts.map((art, i) => (
                               <div key={i} className="flex items-center justify-between p-3 bg-[#111116] border border-slate-800 rounded-lg group hover:border-blue-500/30 transition-colors">
                                  <div className="flex items-center gap-3">
                                     <div className="p-2 bg-blue-500/10 rounded text-blue-500"><Package className="w-4 h-4"/></div>
                                     <div>
                                        <div className="text-sm font-medium text-slate-200">{art.name}</div>
                                        <div className="text-xs text-slate-500">{art.size}</div>
                                     </div>
                                  </div>
                                  <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-white">
                                    <Download className="w-4 h-4" />
                                  </Button>
                               </div>
                             ))}
                           </div>
                         )}

                         <div className="mt-8 pt-6 border-t border-slate-800">
                            <h3 className="text-sm font-bold text-white mb-4">Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                               <Button variant="outline" onClick={promoteBuild} className="border-slate-700 hover:bg-emerald-950/30 hover:text-emerald-500 hover:border-emerald-500/50">
                                  <ArrowRight className="w-4 h-4 mr-2" /> Promote
                               </Button>
                               <Button variant="outline" onClick={rollback} className="border-slate-700 hover:bg-red-950/30 hover:text-red-500 hover:border-red-500/50">
                                  <RotateCcw className="w-4 h-4 mr-2" /> Rollback
                               </Button>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </TabsContent>

              {/* --- ANALYTICS VIEW --- */}
              <TabsContent value="analytics" className="p-8 outline-none overflow-y-auto data-[state=inactive]:hidden">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                      { label: "Success Rate", value: "94.2%", trend: "+2.1%", color: "text-emerald-500" },
                      { label: "Avg. Duration", value: "4m 12s", trend: "-15s", color: "text-blue-500" },
                      { label: "Deployment Freq.", value: "12/day", trend: "+3", color: "text-purple-500" },
                      { label: "MTTR", value: "8m", trend: "stable", color: "text-slate-400" }
                    ].map((stat, i) => (
                      <Card key={i} className="bg-[#111116] border-slate-800">
                        <CardHeader className="pb-2">
                           <CardTitle className="text-sm font-medium text-slate-400">{stat.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="text-2xl font-bold text-white">{stat.value}</div>
                           <p className={`text-xs mt-1 ${stat.color}`}>{stat.trend} vs last week</p>
                        </CardContent>
                      </Card>
                    ))}
                 </div>
                 
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 bg-[#111116] border-slate-800">
                       <CardHeader>
                          <CardTitle className="text-white">Build Duration Trend</CardTitle>
                          <CardDescription>Performance metrics over last 30 builds</CardDescription>
                       </CardHeader>
                       <CardContent>
                          <div className="h-64 flex items-end gap-2 pt-4 border-b border-l border-slate-800 p-2">
                             {Array.from({length: 20}).map((_, i) => {
                               const height = Math.random() * 80 + 20;
                               return (
                                 <motion.div 
                                    key={i} 
                                    className="flex-1 bg-blue-600 rounded-t hover:bg-blue-500 transition-colors relative group"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{ duration: 0.5, delay: i * 0.05 }}
                                 >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                                       {Math.floor(height / 10)}m 30s
                                    </div>
                                 </motion.div>
                               )
                             })}
                          </div>
                          <div className="flex justify-between text-xs text-slate-500 mt-2">
                             <span>Build #1020</span>
                             <span>Build #1040</span>
                          </div>
                       </CardContent>
                    </Card>

                    <Card className="bg-[#111116] border-slate-800">
                       <CardHeader>
                          <CardTitle className="text-white">Pipeline Health</CardTitle>
                       </CardHeader>
                       <CardContent className="flex flex-col items-center justify-center pt-8">
                          <div className="relative w-48 h-48 flex items-center justify-center">
                             <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path className="text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                <motion.path 
                                  className="text-emerald-500" 
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                  fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="94, 100"
                                  initial={{ pathLength: 0 }}
                                  animate={{ pathLength: 1 }}
                                  transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                             </svg>
                             <div className="absolute text-center">
                                <div className="text-4xl font-bold text-white">94%</div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider">Reliability</div>
                             </div>
                          </div>
                          <div className="mt-8 w-full space-y-2">
                             <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Passed</span>
                                <span className="text-emerald-500 font-mono">142</span>
                             </div>
                             <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Failed</span>
                                <span className="text-red-500 font-mono">8</span>
                             </div>
                          </div>
                       </CardContent>
                    </Card>
                 </div>
              </TabsContent>

              {/* --- CONFIG VIEW --- */}
              <TabsContent value="config" className="flex-1 p-0 overflow-hidden outline-none data-[state=inactive]:hidden">
                 <div className="h-full flex flex-col">
                    <div className="p-3 bg-[#111116] border-b border-slate-800 flex justify-between items-center">
                       <span className="text-sm font-mono text-slate-300">/workflows/pipeline.yml</span>
                       <Button size="sm" variant="outline" className="h-7 text-xs border-slate-700">Save Changes</Button>
                    </div>
                    <textarea 
                      className="flex-1 w-full bg-[#0a0a0f] text-slate-300 font-mono text-sm p-6 resize-none focus:outline-none"
                      value={config}
                      onChange={(e) => setConfig(e.target.value)}
                      spellCheck="false"
                    />
                 </div>
              </TabsContent>

              {/* --- SETTINGS VIEW --- */}
              <TabsContent value="settings" className="p-8 outline-none data-[state=inactive]:hidden text-center text-slate-500">
                  <div className="max-w-2xl mx-auto space-y-8 mt-10">
                     <AlertTriangle className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
                     <h2 className="text-2xl font-bold text-white">Project Settings</h2>
                     <p>Settings panel simulation requires admin privileges. (This is a demo placeholder)</p>
                  </div>
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CicdDemo;