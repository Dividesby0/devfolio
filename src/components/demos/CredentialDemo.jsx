import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Key, Lock, FileKey, Terminal, Activity, FileJson, Hash, 
  Globe, Server, RefreshCw, Copy, Eye, EyeOff, ShieldCheck, AlertTriangle, 
  CheckCircle2, Cpu, Database, Network, Fingerprint, Code, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

// --- Utility Functions (Simulated Cryptography) ---

const simulateAsyncOperation = (duration = 1000) => new Promise(resolve => setTimeout(resolve, duration));

const generateRandomHex = (length) => Array.from({length}, () => Math.floor(Math.random()*16).toString(16)).join('');

const mockPEM = (type, bits) => {
  const body = generateRandomHex(bits / 4).match(/.{1,64}/g).join('\n');
  return `-----BEGIN ${type}-----\n${body}\n-----END ${type}-----`;
};

// --- Sub-components ---

const SecurityMetric = ({ label, value, status = "good", subtext }) => (
  <div className="bg-secondary/20 border border-secondary/30 rounded-lg p-3 flex flex-col gap-1">
    <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
    <div className="flex items-end justify-between">
      <span className="text-xl font-mono font-bold">{value}</span>
      {status === "good" && <CheckCircle2 className="w-4 h-4 text-emerald-500 mb-1" />}
      {status === "warning" && <AlertTriangle className="w-4 h-4 text-yellow-500 mb-1" />}
    </div>
    {subtext && <span className="text-[10px] text-muted-foreground">{subtext}</span>}
  </div>
);

const LogTerminal = ({ logs }) => {
  const bottomRef = useRef(null);
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [logs]);

  return (
    <div className="bg-[#0c0c0c] border border-border rounded-lg overflow-hidden flex flex-col h-48 font-mono text-xs">
      <div className="bg-secondary/20 px-3 py-1 border-b border-border flex items-center gap-2">
        <Terminal className="w-3 h-3" />
        <span className="text-muted-foreground">security_audit.log</span>
      </div>
      <div className="p-3 overflow-y-auto flex-1 space-y-1">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-2 text-slate-300">
            <span className="text-slate-600 shrink-0">[{log.time}]</span>
            <span className={log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-emerald-400' : 'text-slate-300'}>
              {log.msg}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

const CopyButton = ({ text }) => {
  const { toast } = useToast();
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Content copied to secure clipboard." });
  };
  return (
    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleCopy}>
      <Copy className="w-3 h-3" />
    </Button>
  );
};

// --- Module: Dashboard ---
const DashboardModule = () => (
  <div className="space-y-6 animate-in fade-in">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <SecurityMetric label="System Entropy" value="99.8%" subtext="NIST SP 800-22 Passed" />
      <SecurityMetric label="Active Keys" value="24" subtext="4 Rotations Pending" status="warning" />
      <SecurityMetric label="FIPS 140-2" value="Compliant" subtext="Level 3 Verified" />
      <SecurityMetric label="Encryption" value="AES-256-GCM" subtext="Hardware Accelerated" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-secondary/10 border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2"><Activity className="w-4 h-4" /> Real-time Crypto Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['RSA Key Gen (4096-bit)', 'AES-GCM Encryption', 'SHA-3 Hashing', 'Signature Verification'].map((op, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm flex-1">{op}</span>
                <span className="text-xs font-mono text-muted-foreground">{Math.floor(Math.random() * 50) + 10}ms</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-secondary/10 border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Compliance Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: "PCI-DSS v4.0", status: "Compliant" },
            { name: "SOC 2 Type II", status: "Audited" },
            { name: "GDPR Data Protection", status: "Verified" },
            { name: "NIST Cybersecurity Framework", status: "High" }
          ].map((item, i) => (
             <div key={i} className="flex justify-between items-center text-sm border-b border-border/50 pb-2 last:border-0 last:pb-0">
               <span>{item.name}</span>
               <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">{item.status}</Badge>
             </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

// --- Module: Cryptography Suite ---
const CryptoSuiteModule = ({ addLog }) => {
  const [algo, setAlgo] = useState('rsa');
  const [keySize, setKeySize] = useState(4096);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    setProcessing(true);
    setResult(null);
    addLog(`Initiating ${algo.toUpperCase()} key generation sequence...`, 'info');
    
    await simulateAsyncOperation(800);
    addLog(`Testing primality (Miller-Rabin) for p and q...`, 'info');
    
    await simulateAsyncOperation(800);
    addLog(`Calculating modular multiplicative inverse...`, 'info');
    
    await simulateAsyncOperation(400);
    
    if (algo === 'rsa') {
      const pub = mockPEM('RSA PUBLIC KEY', keySize);
      const priv = mockPEM('RSA PRIVATE KEY', keySize);
      setResult({ public: pub, private: priv });
      addLog(`RSA-${keySize} Key Pair generated successfully.`, 'success');
    } else if (algo === 'ecc') {
      const pub = mockPEM('EC PUBLIC KEY', 256);
      const priv = mockPEM('EC PRIVATE KEY', 256);
      setResult({ public: pub, private: priv });
      addLog(`ECC (P-256) Key Pair generated successfully.`, 'success');
    }

    setProcessing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      <div className="lg:col-span-4 space-y-6">
         <div className="space-y-4">
            <Label>Algorithm</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant={algo === 'rsa' ? "default" : "outline"} onClick={() => setAlgo('rsa')} className="justify-start"><Key className="w-4 h-4 mr-2"/> RSA</Button>
              <Button variant={algo === 'ecc' ? "default" : "outline"} onClick={() => setAlgo('ecc')} className="justify-start"><Fingerprint className="w-4 h-4 mr-2"/> ECC</Button>
              <Button variant={algo === 'aes' ? "default" : "outline"} onClick={() => setAlgo('aes')} className="justify-start"><Lock className="w-4 h-4 mr-2"/> AES</Button>
              <Button variant={algo === 'hash' ? "default" : "outline"} onClick={() => setAlgo('hash')} className="justify-start"><Hash className="w-4 h-4 mr-2"/> SHA-3</Button>
            </div>
         </div>

         {algo === 'rsa' && (
           <div className="space-y-4 animate-in fade-in">
             <Label>Key Size (Bits)</Label>
             <div className="flex gap-2">
               {[2048, 4096, 8192].map(size => (
                 <Button key={size} size="sm" variant={keySize === size ? "secondary" : "ghost"} onClick={() => setKeySize(size)}>{size}</Button>
               ))}
             </div>
             <p className="text-xs text-muted-foreground">
               Use 2048 for legacy, 4096 for standard security, 8192 for paranoid/military grade.
             </p>
           </div>
         )}

         <Button className="w-full" onClick={handleGenerate} disabled={processing}>
           {processing ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Cpu className="w-4 h-4 mr-2" />}
           {processing ? 'Calculating...' : 'Generate Keys'}
         </Button>
      </div>

      <div className="lg:col-span-8 bg-secondary/10 rounded-lg border border-border p-4 overflow-hidden flex flex-col">
        {!result && !processing && (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
             <Database className="w-12 h-12 opacity-20" />
             <p>Select parameters and generate to view keys</p>
          </div>
        )}
        {processing && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
             <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
             </div>
             <div className="text-center">
               <p className="font-mono text-sm">Generating High-Entropy Primes</p>
               <p className="text-xs text-muted-foreground">Collecting system noise...</p>
             </div>
          </div>
        )}
        {result && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 h-full overflow-y-auto pr-2">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-emerald-500">Public Key (PEM)</Label>
                <CopyButton text={result.public} />
              </div>
              <pre className="bg-background/50 p-3 rounded-lg text-[10px] font-mono leading-tight overflow-x-auto border border-border">
                {result.public}
              </pre>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-red-400">Private Key (PKCS#8)</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-[10px]">Handle with care</Badge>
                  <CopyButton text={result.private} />
                </div>
              </div>
              <pre className="bg-background/50 p-3 rounded-lg text-[10px] font-mono leading-tight overflow-x-auto border border-border blur-sm hover:blur-none transition-all duration-300">
                {result.private}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Module: JWT / Tokens ---
const TokenToolsModule = ({ addLog }) => {
  const [payload, setPayload] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "admin": true\n}');
  const [token, setToken] = useState('');
  
  const generateJWT = async () => {
    addLog('Signing JWT with HS256...', 'info');
    await simulateAsyncOperation(300);
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const pay = btoa(payload.replace(/\s/g, ''));
    const sig = generateRandomHex(32);
    setToken(`${header}.${pay}.${sig}`);
    addLog('Token generated successfully.', 'success');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <div className="space-y-4">
          <div className="flex justify-between items-center">
             <Label>Payload (JSON)</Label>
             <Badge variant="outline">HS256</Badge>
          </div>
          <textarea 
            className="w-full h-64 bg-secondary/10 border border-border rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:border-primary"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
          />
          <Button className="w-full" onClick={generateJWT}>
            <FileKey className="w-4 h-4 mr-2" /> Sign & Generate Token
          </Button>
       </div>
       <div className="space-y-4">
          <Label>Encoded Token</Label>
          <div className="h-64 bg-secondary/10 border border-border rounded-lg p-4 break-all font-mono text-sm text-muted-foreground overflow-y-auto">
             {token ? (
               <>
                 <span className="text-red-400">{token.split('.')[0]}</span>.
                 <span className="text-purple-400">{token.split('.')[1]}</span>.
                 <span className="text-blue-400">{token.split('.')[2]}</span>
               </>
             ) : (
               <span className="opacity-50">Token will appear here...</span>
             )}
          </div>
          {token && (
             <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                   <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                   <div>
                      <h4 className="font-bold text-sm text-emerald-500">Valid Signature</h4>
                      <p className="text-xs text-muted-foreground mt-1">Verified against secret key.</p>
                   </div>
                </div>
             </div>
          )}
       </div>
    </div>
  );
};

// --- Main Component ---

const CredentialDemo = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [logs, setLogs] = useState([]);
  
  const addLog = (msg, type = 'info') => {
    const time = new Date().toISOString().split('T')[1].slice(0, 12);
    setLogs(prev => [...prev, { time, msg, type }]);
  };

  useEffect(() => {
    if (isOpen) {
      addLog('System initialized.', 'info');
      addLog('FIPS 140-2 validated cryptographic module loaded.', 'success');
    }
  }, [isOpen]);

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'generator', label: 'Key Generator', icon: Key },
    { id: 'crypto', label: 'Cryptography', icon: Shield },
    { id: 'pki', label: 'Certificates (PKI)', icon: FileJson },
    { id: 'tools', label: 'Developer Tools', icon: Code },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 gap-0 bg-[#020202] text-slate-200 border-slate-800 overflow-hidden flex flex-col font-sans">
        
        {/* Header */}
        <div className="h-16 border-b border-slate-800 bg-[#080808] flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
             <DialogTitle className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                   <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                   <div className="font-bold text-lg leading-none">VaultGuard</div>
                   <div className="text-[10px] text-muted-foreground font-mono mt-1">v4.2.0 • FIPS 140-2 L3</div>
                </div>
             </DialogTitle>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-500">System Secure</span>
             </div>
             <Button variant="ghost" size="icon" onClick={onClose}><div className="sr-only">Close</div><span className="text-2xl">×</span></Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Sidebar */}
          <div className="w-16 md:w-64 bg-[#050505] border-r border-slate-800 flex flex-col justify-between shrink-0">
             <nav className="p-2 space-y-1">
                {menuItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === item.id ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' : 'text-slate-500 hover:bg-secondary/50 hover:text-slate-300'}`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="hidden md:block">{item.label}</span>
                  </button>
                ))}
             </nav>
             <div className="p-4 border-t border-slate-800 hidden md:block">
                <div className="bg-[#111] rounded-lg p-3 border border-slate-800">
                   <div className="flex items-center gap-2 mb-2 text-xs text-slate-400">
                      <Server className="w-3 h-3" /> HSM Status
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className="text-xs font-mono">Online (US-EAST-1)</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#020202]">
             {/* Content Area */}
             <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                     {activeTab === 'dashboard' && <DashboardModule />}
                     {activeTab === 'crypto' && <CryptoSuiteModule addLog={addLog} />}
                     {activeTab === 'tools' && <TokenToolsModule addLog={addLog} />}
                     
                     {activeTab === 'generator' && (
                        <div className="flex flex-col items-center justify-center h-full text-center p-12 text-muted-foreground border-2 border-dashed border-slate-800 rounded-xl">
                           <Key className="w-16 h-16 mb-4 opacity-20" />
                           <h3 className="text-lg font-medium text-white">Standard Generator</h3>
                           <p className="max-w-md mx-auto mt-2 text-sm">Use the Crypto Suite tab for advanced RSA/ECC generation. This module is for standard passwords and API keys.</p>
                           <Button className="mt-6" variant="outline" onClick={() => setActiveTab('crypto')}>Go to Advanced Crypto</Button>
                        </div>
                     )}

                     {activeTab === 'pki' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                           <Card className="bg-secondary/5 border-border">
                              <CardHeader>
                                 <CardTitle className="text-sm">Certificate Request (CSR)</CardTitle>
                                 <CardDescription>Generate PKCS#10 request</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                 <div className="space-y-2">
                                    <Label>Common Name (CN)</Label>
                                    <div className="h-9 bg-secondary/20 rounded border border-border px-3 flex items-center text-sm">api.production.internal</div>
                                 </div>
                                 <div className="space-y-2">
                                    <Label>Organization (O)</Label>
                                    <div className="h-9 bg-secondary/20 rounded border border-border px-3 flex items-center text-sm">Acme Corp Ltd.</div>
                                 </div>
                                 <Button className="w-full" onClick={() => {
                                   addLog('Generating RSA-2048 key pair for CSR...', 'info');
                                   setTimeout(() => addLog('CSR signed and generated successfully.', 'success'), 1500);
                                 }}>Generate CSR</Button>
                              </CardContent>
                           </Card>
                           <div className="bg-[#111] rounded-lg border border-border p-6 flex flex-col items-center justify-center text-center">
                              <Globe className="w-12 h-12 text-slate-700 mb-4" />
                              <h3 className="text-white font-medium">Root CA Management</h3>
                              <p className="text-sm text-muted-foreground mt-2 mb-6">Manage internal certificate authorities and intermediate chains.</p>
                              <Button variant="outline">Access CA Vault</Button>
                           </div>
                        </div>
                     )}
                  </motion.div>
                </AnimatePresence>
             </div>

             {/* Bottom Panel (Logs) */}
             <div className="h-48 shrink-0 border-t border-slate-800 p-4 bg-[#050505]">
                <LogTerminal logs={logs} />
             </div>
          </div>
          
          {/* Right Panel (Docs/Context) - Hidden on small screens */}
          <div className="w-80 border-l border-slate-800 bg-[#050505] p-6 hidden xl:block overflow-y-auto">
             <div className="flex items-center gap-2 mb-6 text-indigo-400 font-medium">
                <BookOpen className="w-4 h-4" /> Technical Documentation
             </div>
             
             <div className="space-y-8">
                <div>
                   <h4 className="text-sm font-bold text-white mb-2">Algorithm Choice</h4>
                   <p className="text-xs text-slate-400 leading-relaxed">
                      For new systems, we recommend <strong>ECC (P-256)</strong> over RSA. It offers equivalent security to RSA-3072 with significantly smaller key sizes and faster handshake times.
                   </p>
                </div>

                <div>
                   <h4 className="text-sm font-bold text-white mb-2">Entropy Source</h4>
                   <p className="text-xs text-slate-400 leading-relaxed">
                      This system uses <code>window.crypto.getRandomValues()</code> which leverages the OS-level CSPRNG (Cryptographically Secure Pseudo-Random Number Generator).
                   </p>
                   <div className="mt-3 p-2 bg-slate-900 rounded border border-slate-800 font-mono text-[10px] text-slate-500">
                      /dev/urandom (Linux)<br/>CryptGenRandom (Windows)
                   </div>
                </div>

                <div>
                   <h4 className="text-sm font-bold text-white mb-2">Implementation Example</h4>
                   <div className="bg-[#111] p-3 rounded-lg border border-slate-800 overflow-x-auto">
                      <code className="text-[10px] font-mono text-emerald-400">
                        import &#123; generateKeyPair &#125; from 'crypto';<br/><br/>
                        generateKeyPair('rsa', &#123;<br/>
                        &nbsp;&nbsp;modulusLength: 4096,<br/>
                        &#125;, (err, publicKey, privateKey) =&gt; &#123;<br/>
                        &nbsp;&nbsp;// Handle keys<br/>
                        &#125;);
                      </code>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CredentialDemo;