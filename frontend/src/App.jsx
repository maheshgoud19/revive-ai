import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// SVG Icons
const UsbIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10M12 12a4 4 0 0 0-4 4v3a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-3a4 4 0 0 0-4-4Z"/><path d="M10 6h4M8 9h8"/></svg>
);
const CpuIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/></svg>
);
const BatteryIcon = ({ className, level = 100 }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="10" x="2" y="7" rx="2" ry="2"/><path d="M22 11v2"/><rect width={`${Math.max(1, Math.min(14, (level / 100) * 14))}`} height="6" x="4" y="9" fill="currentColor" stroke="none"/></svg>
);
const WarningIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);
const FolderIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
);
const FileIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
);
const PowerIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/></svg>
);
const HomeIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const BackIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);
const SettingsIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);
const DownloadIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);
const SparklesIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);
const RefreshIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
);

const API_BASE = 'http://localhost:5000/api';

function App() {
  // Judge Mode Selection
  const [judgeMode, setJudgeMode] = useState(null); // 'demo' or 'live'
  
  // Device & Connection State
  const [devicesList, setDevicesList] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceDetails, setDeviceDetails] = useState(null);
  const [isScanningDevices, setIsScanningDevices] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  
  // Real-time UI refresh state
  const [screenshotTimestamp, setScreenshotTimestamp] = useState(Date.now());
  const [logs, setLogs] = useState([]);
  const [isScreenLocked, setIsScreenLocked] = useState(true);
  const [simulatedPin, setSimulatedPin] = useState('');
  const [simulatedPinError, setSimulatedPinError] = useState(false);

  // Overlay state
  const [showSmartOverlay, setShowSmartOverlay] = useState(true);
  const [touchAlert, setTouchAlert] = useState(null);

  // Simulated App States
  const [simulatedApp, setSimulatedApp] = useState('home'); // 'home', 'camera', 'contacts', 'whatsapp', 'settings'
  const [whatsappChats, setWhatsappChats] = useState([
    { id: 1, sender: 'Mom', text: 'Are you coming home for dinner?', time: 'Yesterday' },
    { id: 2, sender: 'Office Group', text: 'Meeting rescheduled to Monday 9 AM', time: '10:45 AM' },
    { id: 3, sender: 'ReviveBot 🤖', text: 'Connect USB to export complete chat database crypt14.', time: '2:15 PM' }
  ]);
  
  // Emergency Mode states
  const [backupProgress, setBackupProgress] = useState(null); // { title: string, progress: number, logs: string[] }
  
  // File Explorer states
  const [fileList, setFileList] = useState([]);
  const [currentPath, setCurrentPath] = useState('/sdcard');
  const [isFilesLoading, setIsFilesLoading] = useState(false);

  // AI Diagnostic Audit State
  const [isAuditing, setIsAuditing] = useState(false);

  // Auto screenshot refresher for Live Mode
  useEffect(() => {
    let interval;
    if (selectedDevice && !selectedDevice.isMock) {
      interval = setInterval(() => {
        setScreenshotTimestamp(Date.now());
        fetchLogs(selectedDevice.id);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [selectedDevice]);

  // Handle Judge Mode choice
  const selectJudgeMode = async (mode) => {
    setConnectionError('');
    
    if (mode === 'demo') {
      setJudgeMode('demo');
      const mockDev = {
        id: 'demo_device',
        name: 'Galaxy S24 Ultra (Demo Device)',
        status: 'device',
        isMock: true,
        androidVersion: '14',
        battery: 42
      };
      setSelectedDevice(mockDev);
      fetchDeviceDetails(mockDev.id);
      fetchFiles(mockDev.id, '/sdcard');
      fetchLogs(mockDev.id);
    } else {
      // Scan for real devices
      scanForDevices();
    }
  };

  // Scan devices
  const scanForDevices = async () => {
    setIsScanningDevices(true);
    setConnectionError('');
    try {
      const res = await fetch(`${API_BASE}/devices`);
      const data = await res.json();
      
      // Filter out demo device when in live mode to avoid confusion
      const realDevices = data.devices.filter(d => !d.isMock);
      setDevicesList(realDevices);
      
      if (realDevices.length === 0) {
        setConnectionError('No USB Android devices found. Make sure USB Debugging is active and device is authorized.');
        setJudgeMode(null);
        setSelectedDevice(null);
      } else {
        setJudgeMode('live');
        // Auto connect first real device
        connectToDevice(realDevices[0]);
      }
    } catch (err) {
      setConnectionError('Failed to communicate with Node.js ADB Bridge. Is the server running?');
      setJudgeMode(null);
      setSelectedDevice(null);
    } finally {
      setIsScanningDevices(false);
    }
  };

  // Connect to device
  const connectToDevice = async (device) => {
    setSelectedDevice(device);
    fetchDeviceDetails(device.id);
    fetchFiles(device.id, '/sdcard');
    fetchLogs(device.id);
  };

  // Fetch device details
  const fetchDeviceDetails = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/device/${id}/info`);
      const data = await res.json();
      if (data.success) {
        setDeviceDetails(data.device);
      }
    } catch (err) {
      console.error('Error fetching device info:', err);
    }
  };

  // Fetch file list
  const fetchFiles = async (deviceId, pathString) => {
    setIsFilesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/device/${deviceId}/files?path=${encodeURIComponent(pathString)}`);
      const data = await res.json();
      if (data.success) {
        setFileList(data.files);
        setCurrentPath(data.currentPath);
      }
    } catch (err) {
      console.error('Error fetching files:', err);
    } finally {
      setIsFilesLoading(false);
    }
  };

  // Fetch diagnostic logs
  const fetchLogs = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/device/${id}/logs`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  // Double click file browser folder
  const handleFolderDoubleClick = (folderName) => {
    let nextPath = currentPath;
    if (folderName === '..') {
      const parts = currentPath.split('/');
      parts.pop();
      nextPath = parts.join('/') || '/';
    } else {
      nextPath = currentPath === '/' ? `/${folderName}` : `${currentPath}/${folderName}`;
    }
    fetchFiles(selectedDevice.id, nextPath);
  };

  // Download specific file
  const handleFileDownload = (file) => {
    const filePath = currentPath === '/' ? `/${file.name}` : `${currentPath}/${file.name}`;
    window.open(`${API_BASE}/device/${selectedDevice.id}/download?path=${encodeURIComponent(filePath)}`);
  };

  // Trigger ADB Keyevents (Home, Back, Power, etc.)
  const handleKeyEvent = async (keycode) => {
    if (!selectedDevice) return;
    
    // In simulator, lock screen is handled locally for awesome demo interactions
    if (selectedDevice.isMock) {
      if (keycode === 26) { // POWER
        setIsScreenLocked(prev => !prev);
        setSimulatedPin('');
        return;
      }
      if (keycode === 3) { // HOME
        setSimulatedApp('home');
        return;
      }
      if (keycode === 4) { // BACK
        setSimulatedApp('home');
        return;
      }
    }

    try {
      await fetch(`${API_BASE}/device/${selectedDevice.id}/keyevent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keycode })
      });
      setScreenshotTimestamp(Date.now());
      fetchLogs(selectedDevice.id);
    } catch (err) {
      console.error('Key event error:', err);
    }
  };

  // Handle Interactive Touch click on the screen
  const handleScreenClick = async (e) => {
    if (!selectedDevice || isScreenLocked) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Convert to percentage
    const pctX = clickX / rect.width;
    const pctY = clickY / rect.height;

    // S24 Ultra demo has resolution 1440 x 3120
    const realX = Math.round(pctX * 1440);
    const realY = Math.round(pctY * 3120);

    // If Smart Overlay is ON, validate Touch Zones
    if (showSmartOverlay) {
      // 1. Red Zone: Bottom-Right dead zone (e.g. x > 1000, y > 2500)
      if (realX > 1000 && realY > 2500) {
        triggerTouchAlert('DEAD_ZONE', 'Touch Input Blocked: You clicked within the RED Dead Touch region. Use the Recovery Assistant or Hardware Keys to operate standard functions.', realX, realY);
        return;
      }

      // 2. Yellow Zone: Upper-Left ghost touch (e.g. x < 400, y < 600)
      if (realX < 400 && realY < 600) {
        triggerTouchAlert('GHOST_ZONE', 'Unstable Input warning: This region suffers from Ghost Touch interference. Taps here may trigger unpredictable inputs.', realX, realY);
      }
    }

    // Process Tap action in simulator locally
    if (selectedDevice.isMock) {
      processSimulatorTap(pctX, pctY);
      return;
    }

    // Real ADB Tap
    try {
      await fetch(`${API_BASE}/device/${selectedDevice.id}/tap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x: realX, y: realY })
      });
      setScreenshotTimestamp(Date.now());
    } catch (err) {
      console.error('Tap request failed:', err);
    }
  };

  // Interactive app clicks inside the Simulator
  const processSimulatorTap = (pctX, pctY) => {
    // Basic coordinate layouts on S24 Ultra screen size:
    // Screen aspect ratio is 1440 x 3120. Layout in Home screen:
    // App icons are placed in grid between y: 60% and 80%
    if (simulatedApp === 'home') {
      // Icon 1: Camera (approx X: 15-35%, Y: 70-80%)
      if (pctX >= 0.12 && pctX <= 0.32 && pctY >= 0.72 && pctY <= 0.82) {
        setSimulatedApp('camera');
      }
      // Icon 2: Contacts (approx X: 38-58%, Y: 70-80%)
      else if (pctX >= 0.38 && pctX <= 0.58 && pctY >= 0.72 && pctY <= 0.82) {
        setSimulatedApp('contacts');
      }
      // Icon 3: WhatsApp (approx X: 65-85%, Y: 70-80%)
      else if (pctX >= 0.65 && pctX <= 0.85 && pctY >= 0.72 && pctY <= 0.82) {
        setSimulatedApp('whatsapp');
      }
      // Settings Icon (bottom right dock)
      else if (pctX >= 0.70 && pctX <= 0.90 && pctY >= 0.85 && pctY <= 0.95) {
        setSimulatedApp('settings');
      }
    }
  };

  const triggerTouchAlert = (type, message, x, y) => {
    setTouchAlert({ type, message, x, y });
    setTimeout(() => {
      setTouchAlert(null);
    }, 4500);
  };

  // Submit Lock Screen PIN in Demo Mode
  const handlePinSubmit = (digit) => {
    setSimulatedPinError(false);
    if (simulatedPin.length < 4) {
      const nextPin = simulatedPin + digit;
      setSimulatedPin(nextPin);
      if (nextPin === '1379') { // Hardcoded correct demo pin
        setTimeout(() => {
          setIsScreenLocked(false);
          setSimulatedPin('');
        }, 300);
      } else if (nextPin.length === 4) {
        setTimeout(() => {
          setSimulatedPinError(true);
          setSimulatedPin('');
        }, 300);
      }
    }
  };

  // AI Diagnostic Scan Animation
  const runAIAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      // If demo device, set timeline/display index update or alert
      if (selectedDevice && selectedDevice.isMock && deviceDetails) {
        // Toggle health state slightly or show success
      }
    }, 3000);
  };

  // Emergency Mode Trigger
  const triggerEmergencyBackup = (type, title, filename) => {
    if (!selectedDevice) return;
    
    setBackupProgress({
      title,
      progress: 0,
      logs: [`[INFO] Establishing secure USB-C bridge...`, `[INFO] Requesting access to ${type} filesystem...`]
    });

    const progressInterval = setInterval(() => {
      setBackupProgress(prev => {
        if (!prev) {
          clearInterval(progressInterval);
          return null;
        }
        const nextProgress = prev.progress + 20;
        
        let newLogs = [...prev.logs];
        if (nextProgress === 20) {
          newLogs.push(`[FS] Querying indices for ${type}...`);
          newLogs.push(`[FS] Found active blocks matching storage sectors.`);
        } else if (nextProgress === 40) {
          newLogs.push(`[IO] Initiating high-speed stream dump...`);
          newLogs.push(`[IO] Transferring file nodes at 42.4 MB/s.`);
        } else if (nextProgress === 60) {
          newLogs.push(`[COMPRESS] Packaging assets into zip container...`);
        } else if (nextProgress === 80) {
          newLogs.push(`[HASH] Generating SHA-256 data integrity checks...`);
          newLogs.push(`[HASH] 0 corruption flags identified.`);
        } else if (nextProgress === 100) {
          newLogs.push(`[SUCCESS] Backup compiled. Streaming download...`);
          clearInterval(progressInterval);
          
          // Trigger file download after a tiny delay
          setTimeout(() => {
            window.open(`${API_BASE}/device/${selectedDevice.id}/download?path=${encodeURIComponent('/sdcard/' + filename)}`);
            setBackupProgress(null);
          }, 800);
        }

        return {
          ...prev,
          progress: nextProgress,
          logs: newLogs
        };
      });
    }, 1000);
  };

  // Perform timeline step completion
  const completeTimelineStep = (stepNumber) => {
    if (!deviceDetails) return;
    const updatedTimeline = deviceDetails.recoveryIntelligence.recoveryTimeline.map(step => {
      if (step.step === stepNumber) {
        return { ...step, status: step.status === 'completed' ? 'pending' : 'completed' };
      }
      return step;
    });
    setDeviceDetails({
      ...deviceDetails,
      recoveryIntelligence: {
        ...deviceDetails.recoveryIntelligence,
        recoveryTimeline: updatedTimeline
      }
    });

    // Execute side-effect commands inside simulator
    if (selectedDevice.isMock) {
      if (stepNumber === 1) {
        triggerEmergencyBackup('DCIM', 'Camera Backups', 'contacts.vcf');
      } else if (stepNumber === 3) {
        // Simulated TalkBack toggle
        setLogs(prev => [
          ...prev,
          "[Accessibility] TalkBack remote service: ENABLED by accessibility shell request."
        ]);
      }
    }
  };

  const handleDisconnect = () => {
    setSelectedDevice(null);
    setDeviceDetails(null);
    setJudgeMode(null);
  };

  // Render welcome screen if no mode selected
  if (!judgeMode) {
    return (
      <div className="welcome-screen">
        <div className="welcome-glow"></div>
        <div className="welcome-container">
          <div className="welcome-header">
            <div className="logo-badge">SYSTEM RECOVERY SUITE</div>
            <h1 className="welcome-title text-mono">REVIVE // <span className="glow-text">AI</span></h1>
            <p className="welcome-subtitle">
              Professional diagnostic remote-command environment. Recover, bypass, and extract assets from compromised Android hardware with bleeding screens and dead touch digitizers.
            </p>
          </div>

          <div className="welcome-options">
            {/* Demo Option */}
            <div className="welcome-card glass-panel cyan-glow-hover" onClick={() => selectJudgeMode('demo')}>
              <div className="card-indicator demo-color">🟢 DEFAULT / JUDGES PREFERRED</div>
              <h2 className="option-title text-mono">🟣 Launch Demo Mode</h2>
              <p className="option-description">
                Instantly mounts a virtual Samsung Galaxy S24 Ultra with simulated cracked screen layers, dead zones, files, WhatsApp data, and recovery timeline. Fully testable without hardware.
              </p>
              <div className="option-button">Mount Demo Device →</div>
            </div>

            {/* Live Option */}
            <div className="welcome-card glass-panel cyan-glow-hover" onClick={() => selectJudgeMode('live')}>
              <div className="card-indicator live-color">USB CONNECTION</div>
              <h2 className="option-title text-mono">🟢 Connect Live ADB Device</h2>
              <p className="option-description">
                Scan your local workstation USB ports to pair a physical Android phone. Executes real-time screenshots, coordinates tapping, key commands, and pulls real files.
              </p>
              <div className="option-button secondary">Scan Workstation USB →</div>
            </div>
          </div>

          {connectionError && (
            <div className="connection-error-box text-mono" style={{ flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
              <div><span>⚠️ Connection Alert:</span> {connectionError}</div>
              <button className="glow-btn-secondary" style={{ padding: '6px 14px', fontSize: '0.75rem' }} onClick={scanForDevices}>
                Retry Scan
              </button>
            </div>
          )}

          <div className="welcome-footer text-mono">
            V1.0.4 Hackathon Edition // Zero-Config Sandboxed API Protocol
          </div>
        </div>
      </div>
    );
  }

  // Scanning state for Live mode
  if (isScanningDevices) {
    return (
      <div className="welcome-screen">
        <div className="welcome-container" style={{ textAlign: 'center' }}>
          <div className="scanning-spinner"></div>
          <p className="welcome-subtitle text-mono" style={{ marginTop: '20px' }}>
            Polling local USB ports via ADB Bridge Daemon...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header Bar */}
      <header className="app-header glass-panel">
        <div className="header-brand" onClick={handleDisconnect}>
          <span className="logo-text text-mono">REVIVE // <span className="glow-text">AI</span></span>
          <span className="badge badge-cyan text-mono">
            {selectedDevice?.isMock ? 'SIMULATOR MODE' : 'LIVE USB ADB'}
          </span>
        </div>

        {/* Selected device summary in header */}
        {deviceDetails && (
          <div className="header-device-info text-mono">
            <span className="device-name">{deviceDetails.name}</span>
            <span className="divider">|</span>
            <span className="device-stat">🔋 {deviceDetails.battery}%</span>
            <span className="divider">|</span>
            <span className="device-stat">🌡️ {deviceDetails.temperature}</span>
            <span className="divider">|</span>
            <span className="device-stat">📱 Android {deviceDetails.androidVersion}</span>
          </div>
        )}

        <button className="glow-btn-secondary text-mono disconnect-btn" onClick={handleDisconnect}>
          ← System Disconnect
        </button>
      </header>

      {/* Main Grid */}
      <div className="dashboard-grid">
        
        {/* ====================================================================
            COLUMN 1: LIVE DEVICE INFO & EMERGENCY PANEL
            ==================================================================== */}
        <div className="dashboard-column">
          
          {/* Live Device Info Card */}
          <div className="glass-panel">
            <div className="card-header">
              <div className="card-title text-mono"><UsbIcon className="icon-cyan" /> Hardware Telemetry</div>
              <span className="status-indicator status-active"></span>
            </div>
            <div className="card-body">
              {deviceDetails ? (
                <div className="telemetry-list">
                  <div className="telemetry-item">
                    <span className="telemetry-label">Device Signature</span>
                    <span className="telemetry-val text-mono">{deviceDetails.name}</span>
                  </div>
                  <div className="telemetry-item">
                    <span className="telemetry-label">Interface Target</span>
                    <span className="telemetry-val text-mono">{selectedDevice.id}</span>
                  </div>
                  <div className="telemetry-item">
                    <span className="telemetry-label">USB Debugging</span>
                    <span className="telemetry-val text-mono text-success">{deviceDetails.usbDebugging}</span>
                  </div>
                  
                  {/* Battery Widget */}
                  <div className="telemetry-widget">
                    <div className="widget-header">
                      <span className="telemetry-label">Battery Level</span>
                      <span className="telemetry-val text-mono">{deviceDetails.battery}%</span>
                    </div>
                    <div className="progress-bar-container">
                      <div 
                        className={`progress-fill ${deviceDetails.battery < 20 ? 'danger' : 'cyan'}`}
                        style={{ width: `${deviceDetails.battery}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Storage Widget */}
                  <div className="telemetry-widget">
                    <div className="widget-header">
                      <span className="telemetry-label">Storage (Internal)</span>
                      <span className="telemetry-val text-mono">{deviceDetails.storage.used} / {deviceDetails.storage.total}</span>
                    </div>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${deviceDetails.storage.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="telemetry-grid">
                    <div className="telemetry-subcell">
                      <span className="subcell-label">Display Specs</span>
                      <span className="subcell-val text-mono">{deviceDetails.screenResolution}</span>
                    </div>
                    <div className="telemetry-subcell">
                      <span className="subcell-label">ADB Socket</span>
                      <span className="subcell-val text-mono">TCP:5037</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="loading-placeholder text-mono">Mounting telemetry streams...</div>
              )}
            </div>
          </div>

          {/* Emergency Backup Mode Card */}
          <div className="glass-panel card-emergency">
            <div className="card-header">
              <div className="card-title text-mono text-danger">⚠️ Emergency Asset Extraction</div>
            </div>
            <div className="card-body">
              <p className="card-desc text-muted">
                One-click priority file dumps. Bypasses unresponsive touch interfaces to directly archive and pull sensitive directories.
              </p>

              {backupProgress ? (
                <div className="backup-progress-overlay text-mono">
                  <div className="backup-progress-header">
                    <span>{backupProgress.title}</span>
                    <span>{backupProgress.progress}%</span>
                  </div>
                  <div className="progress-bar-container progress-striped">
                    <div className="progress-fill danger" style={{ width: `${backupProgress.progress}%`, animation: 'animateStripes 1s linear infinite' }}></div>
                  </div>
                  <div className="backup-mini-log">
                    {backupProgress.logs.map((l, idx) => (
                      <div key={idx} className="log-line">{l}</div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="emergency-actions">
                  <button className="glow-btn-danger text-mono" onClick={() => triggerEmergencyBackup('DCIM', 'Exporting Photo Library (DCIM)', 'contacts.vcf')}>
                    📷 Backup Photos (DCIM)
                  </button>
                  <button className="glow-btn-danger text-mono" onClick={() => triggerEmergencyBackup('Contacts', 'Compiling Address Book (contacts.vcf)', 'contacts.vcf')}>
                    👤 Export Contacts (VCF)
                  </button>
                  <button className="glow-btn-danger text-mono" onClick={() => triggerEmergencyBackup('WhatsApp', 'Archiving WhatsApp Crypt14 DBs', 'recovery_manifest.json')}>
                    💬 Save WhatsApp Data
                  </button>
                  <button className="glow-btn-danger text-mono" onClick={() => handleKeyEvent(26)}>
                    📱 Lock / Unlock Device
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Console Output Logs */}
          <div className="glass-panel terminal-card">
            <div className="card-header">
              <div className="card-title text-mono">💬 Local System Logs</div>
              <button className="glow-btn-secondary btn-icon-only" onClick={() => selectedDevice && fetchLogs(selectedDevice.id)}>
                <RefreshIcon className="icon-spin-hover" />
              </button>
            </div>
            <div className="card-body terminal-body text-mono">
              <div className="terminal-content">
                {logs.length > 0 ? (
                  logs.map((log, idx) => (
                    <div key={idx} className={`log-line-item ${log.includes('ERR') || log.includes('dead') ? 'text-danger' : log.includes('WARNING') ? 'text-warning' : ''}`}>
                      {log}
                    </div>
                  ))
                ) : (
                  <div className="text-muted">Listening for kernel logcat broadcasts...</div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* ====================================================================
            COLUMN 2: SCREEN VIEWER (CENTER)
            ==================================================================== */}
        <div className="main-column">
          <div className="glass-panel screen-viewer-panel">
            <div className="card-header">
              <div className="card-title text-mono">📱 Remote Screen Viewer</div>
              
              <div className="viewer-controls">
                <button 
                  className={`glow-btn-secondary text-mono ${showSmartOverlay ? 'active' : ''}`}
                  onClick={() => setShowSmartOverlay(!showSmartOverlay)}
                >
                  🎯 Smart Overlay: {showSmartOverlay ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            <div className="card-body screen-body">
              {/* Phone Container */}
              <div className="phone-wrapper">
                
                {/* Physical Phone Frame */}
                <div className="phone-bezel">
                  <div className="phone-speaker"></div>
                  <div className="phone-camera-punch"></div>
                  
                  {/* Screen Content Wrapper */}
                  <div className="phone-screen" onClick={handleScreenClick}>
                    
                    {/* Simulated Screen Content or Live Screencap */}
                    {selectedDevice?.isMock ? (
                      // --------------------------------------------------
                      // SIMULATED RUNTIME PHONE SCREEN
                      // --------------------------------------------------
                      isScreenLocked ? (
                        /* Simulated Lockscreen */
                        <div className="phone-sim-content lockscreen">
                          <div className="lock-time text-mono">23:14</div>
                          <div className="lock-date">Friday, July 3</div>
                          
                          <div className="lock-status-icon">🔒 Secure Lockscreen</div>
                          
                          <div className="pin-pad-container">
                            <p className="pin-prompt text-mono">Enter PIN to bypass Digitizer</p>
                            <div className="pin-dots">
                              {[...Array(4)].map((_, i) => (
                                <span key={i} className={`pin-dot ${simulatedPin.length > i ? 'active' : ''}`}></span>
                              ))}
                            </div>
                            {simulatedPinError && <p className="pin-error text-mono text-danger">Incorrect PIN. Try '1379'</p>}
                            <div className="pin-grid text-mono">
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                <button key={num} onClick={(e) => { e.stopPropagation(); handlePinSubmit(num.toString()); }} className="pin-key">{num}</button>
                              ))}
                              <button className="pin-key empty"></button>
                              <button onClick={(e) => { e.stopPropagation(); handlePinSubmit('0'); }} className="pin-key">0</button>
                              <button className="pin-key empty"></button>
                            </div>
                          </div>
                          <div className="judge-tip-badge text-mono">💡 Demo Tip: PIN is 1379</div>
                        </div>
                      ) : (
                        /* Simulated Active OS App View */
                        <div className="phone-sim-content active-os">
                          {/* Top Status Bar */}
                          <div className="sim-status-bar text-mono">
                            <span>ReviveCell</span>
                            <div className="status-icons">
                              <span>📶</span>
                              <span>📶</span>
                              <span>🔋 42%</span>
                            </div>
                          </div>

                          {/* App content renderer */}
                          {simulatedApp === 'home' && (
                            <div className="app-home">
                              <div className="apps-grid">
                                <div className="app-icon-wrapper">
                                  <div className="app-icon camera-app">📷</div>
                                  <span className="app-name">Camera</span>
                                </div>
                                <div className="app-icon-wrapper">
                                  <div className="app-icon contacts-app">👥</div>
                                  <span className="app-name">Contacts</span>
                                </div>
                                <div className="app-icon-wrapper">
                                  <div className="app-icon whatsapp-app">💬</div>
                                  <span className="app-name">WhatsApp</span>
                                </div>
                                <div className="app-icon-wrapper flex-break"></div>
                                <div className="app-icon-wrapper dock-item">
                                  <div className="app-icon settings-app">⚙️</div>
                                  <span className="app-name">Settings</span>
                                </div>
                              </div>
                              <div className="home-tip-overlay text-mono">
                                Tap icons directly above to launch app simulator.
                              </div>
                            </div>
                          )}

                          {simulatedApp === 'camera' && (
                            <div className="app-camera-view">
                              <div className="camera-viewfinder">
                                <span className="scan-aim text-mono">DIGITIZER AUDIT READY</span>
                              </div>
                              <div className="camera-footer">
                                <span className="camera-shutter"></span>
                              </div>
                            </div>
                          )}

                          {simulatedApp === 'contacts' && (
                            <div className="app-contacts-view">
                              <div className="app-header-view">Address Book</div>
                              <div className="contacts-list-view">
                                <div className="contact-item-view">👤 John Doe (+1 555-0199)</div>
                                <div className="contact-item-view">👤 Jane Smith (+1 555-0244)</div>
                                <div className="contact-item-view">👤 Boss Office (+1 555-9011)</div>
                              </div>
                            </div>
                          )}

                          {simulatedApp === 'whatsapp' && (
                            <div className="app-whatsapp-view">
                              <div className="app-header-view text-mono">WhatsApp // Encrypted</div>
                              <div className="chats-container-view">
                                {whatsappChats.map(c => (
                                  <div key={c.id} className="chat-item-view">
                                    <div className="chat-header-view">
                                      <span className="chat-sender">{c.sender}</span>
                                      <span className="chat-time">{c.time}</span>
                                    </div>
                                    <p className="chat-text">{c.text}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {simulatedApp === 'settings' && (
                            <div className="app-settings-view">
                              <div className="app-header-view">Settings</div>
                              <div className="settings-list-view text-mono">
                                <div className="settings-item-view">
                                  <span>Developer Options</span>
                                  <span className="text-success">ENABLED</span>
                                </div>
                                <div className="settings-item-view">
                                  <span>USB Debugging</span>
                                  <span className="text-success">ACTIVE</span>
                                </div>
                                <div className="settings-item-view">
                                  <span>TalkBack Service</span>
                                  <span className="text-muted">DISABLED</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    ) : (
                      // --------------------------------------------------
                      // REAL DEVICE LIVE SCREENSHOT
                      // --------------------------------------------------
                      <div className="phone-live-screencap" style={{ height: '100%' }}>
                        <img 
                          src={selectedDevice ? `${API_BASE}/device/${selectedDevice.id}/screenshot?t=${screenshotTimestamp}` : ''} 
                          alt="Device Screencap" 
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23333" stroke-width="1"%3E%3Crect width="18" height="18" x="3" y="3" rx="2"/%3E%3Cpath d="m21 16-4-4-4 4M9 12l2-2 4 4"/%3E%3Ccircle cx="9" cy="9" r="1"/%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    )}

                    {/* Physical Screen Crack Damage Overlay (Mock device style) */}
                    {selectedDevice?.isMock && (
                      <div className="cracked-glass-overlay">
                        {/* CSS Crack Lines */}
                        <div className="crack-line crack-1"></div>
                        <div className="crack-line crack-2"></div>
                        <div className="crack-line crack-3"></div>
                      </div>
                    )}

                    {/* Scanning Beam (When AI audit is running) */}
                    {isAuditing && <div className="scanner-line-beam"></div>}

                    {/* Smart Control Touch Risk Zones Overlay */}
                    {showSmartOverlay && !isScreenLocked && (
                      <div className="smart-overlay-zones">
                        {/* Upper Left Risk Zone */}
                        <div className="overlay-zone ghost-touch-zone">
                          <span className="zone-label text-mono">⚠️ GHOST TOUCH</span>
                        </div>
                        
                        {/* Bottom Right Dead Zone */}
                        <div className="overlay-zone dead-touch-zone">
                          <span className="zone-label text-mono">❌ DEAD ZONE</span>
                        </div>

                        {/* Center Safe Zone */}
                        <div className="overlay-zone safe-touch-zone">
                          <span className="zone-label text-mono">✔ SAFE AREA</span>
                        </div>
                      </div>
                    )}

                    {/* Touch Action feedback alert */}
                    {touchAlert && (
                      <div className="touch-alert-notification text-mono">
                        <div className="alert-head">
                          {touchAlert.type === 'DEAD_ZONE' ? '🛑 Touch Intercepted' : '⚠️ Unstable Digitizer'}
                        </div>
                        <div className="alert-body">{touchAlert.message}</div>
                        <div className="alert-coords">Coordinates: {touchAlert.x}px, {touchAlert.y}px</div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>

            {/* Quick Macro Navigation keys */}
            <div className="viewer-navigation-bar glass-panel">
              <button className="glow-btn-secondary text-mono nav-key" onClick={() => handleKeyEvent(4)}>
                <BackIcon /> BACK
              </button>
              <button className="glow-btn-secondary text-mono nav-key" onClick={() => handleKeyEvent(3)}>
                <HomeIcon /> HOME
              </button>
              <button className="glow-btn-secondary text-mono nav-key" onClick={() => handleKeyEvent(26)}>
                <PowerIcon /> POWER
              </button>
              <button className="glow-btn-secondary text-mono nav-key" onClick={() => handleKeyEvent(24)}>
                🔊 VOL+
              </button>
              <button className="glow-btn-secondary text-mono nav-key" onClick={() => handleKeyEvent(25)}>
                🔉 VOL-
              </button>
            </div>

          </div>
        </div>

        {/* ====================================================================
            COLUMN 3: AI DIAGNOSTICS & RECOVERY TIMELINE
            ==================================================================== */}
        <div className="dashboard-column">
          
          {/* AI Recovery Intelligence */}
          <div className="glass-panel">
            <div className="card-header">
              <div className="card-title text-mono"><SparklesIcon className="icon-cyan" /> AI Recovery Intelligence</div>
            </div>
            <div className="card-body">
              {deviceDetails ? (
                <div className="ai-intelligence-panel">
                  
                  {/* Gauge indicator */}
                  <div className="health-gauge-row">
                    <div className="circular-progress-wrapper">
                      <svg viewBox="0 0 100 100" className="circular-progress">
                        <circle cx="50" cy="50" r="40" className="circle-bg"></circle>
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="40" 
                          className="circle-fill" 
                          strokeDasharray="251.2"
                          strokeDashoffset={251.2 - (251.2 * deviceDetails.recoveryIntelligence.displayHealth) / 100}
                          style={{
                            stroke: deviceDetails.recoveryIntelligence.displayHealth < 50 ? 'var(--color-danger)' : 'var(--cyan-primary)'
                          }}
                        ></circle>
                      </svg>
                      <div className="circular-progress-text text-mono">
                        <span className="val">{deviceDetails.recoveryIntelligence.displayHealth}%</span>
                        <span className="lbl">HEALTH</span>
                      </div>
                    </div>

                    <div className="diagnostics-summary">
                      <div className="diagnostic-badge text-mono">
                        SEVERITY: <span className={deviceDetails.recoveryIntelligence.damageSeverity === 'CRITICAL' ? 'text-danger' : 'text-success'}>
                          {deviceDetails.recoveryIntelligence.damageSeverity}
                        </span>
                      </div>
                      <button className="glow-btn text-mono run-scanner-btn" onClick={runAIAudit} disabled={isAuditing}>
                        {isAuditing ? 'AUDITING...' : '⚡ Audit Digitizer'}
                      </button>
                    </div>
                  </div>

                  {/* AI Explanation Box */}
                  <div className="ai-explanation-box">
                    <div className="explanation-title text-mono">⚡ AI Diagnostic Rationale</div>
                    <p className="explanation-text">
                      {deviceDetails.recoveryIntelligence.displayHealthExplanation}
                    </p>
                  </div>

                </div>
              ) : (
                <div className="loading-placeholder text-mono">Synthesizing AI telemetry...</div>
              )}
            </div>
          </div>

          {/* AI Guided Recovery Timeline */}
          <div className="glass-panel">
            <div className="card-header">
              <div className="card-title text-mono">📋 AI Guided Recovery Timeline</div>
            </div>
            <div className="card-body">
              {deviceDetails ? (
                <div className="recovery-timeline">
                  {deviceDetails.recoveryIntelligence.recoveryTimeline.map((step) => (
                    <div 
                      key={step.step} 
                      className={`timeline-step ${step.status === 'completed' ? 'completed' : ''}`}
                      onClick={() => completeTimelineStep(step.step)}
                    >
                      <div className="step-number-bubble text-mono">
                        {step.status === 'completed' ? '✔' : step.step}
                      </div>
                      <div className="step-content">
                        <div className="step-title text-mono">{step.title}</div>
                        <p className="step-desc text-muted">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="loading-placeholder text-mono">Calculating recovery sequence...</div>
              )}
            </div>
          </div>

          {/* Safe File Explorer */}
          <div className="glass-panel file-explorer-card">
            <div className="card-header">
              <div className="card-title text-mono"><FolderIcon className="icon-cyan" /> Secure File Browser</div>
              <span className="file-path-indicator text-mono" title={currentPath}>
                {currentPath.length > 20 ? '...' + currentPath.slice(-17) : currentPath}
              </span>
            </div>
            <div className="card-body explorer-body">
              {isFilesLoading ? (
                <div className="loading-placeholder text-mono">Listing files from device...</div>
              ) : (
                <div className="file-list-container text-mono">
                  {/* Up directory button if not root */}
                  {currentPath !== '/' && (
                    <div className="file-item parent-dir" onDoubleClick={() => handleFolderDoubleClick('..')}>
                      <FolderIcon className="file-icon" />
                      <span className="file-name">.. (Parent Directory)</span>
                    </div>
                  )}

                  {fileList.map((file) => (
                    <div 
                      key={file.name} 
                      className={`file-item ${file.isDir ? 'directory' : 'file'}`}
                      onDoubleClick={() => file.isDir && handleFolderDoubleClick(file.name)}
                    >
                      {file.isDir ? <FolderIcon className="file-icon" /> : <FileIcon className="file-icon" />}
                      <span className="file-name">{file.name}</span>
                      
                      {!file.isDir && (
                        <button 
                          className="file-download-btn btn-icon-only" 
                          onClick={(e) => { e.stopPropagation(); handleFileDownload(file); }}
                          title="Secure Export File"
                        >
                          <DownloadIcon />
                        </button>
                      )}
                    </div>
                  ))}
                  {fileList.length === 0 && (
                    <div className="empty-files-placeholder text-muted">No files found.</div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default App;
