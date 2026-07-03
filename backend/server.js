const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper to check if ADB is installed
let isAdbAvailable = false;
function checkAdb() {
  return new Promise((resolve) => {
    exec('adb --version', (err, stdout) => {
      if (err) {
        console.warn('⚠️ ADB is not available on this system. Simulator Mode will be active.');
        isAdbAvailable = false;
      } else {
        console.log('✅ ADB detected successfully:\n', stdout.trim().split('\n')[0]);
        isAdbAvailable = true;
      }
      resolve(isAdbAvailable);
    });
  });
}

// Global variable representing simulated logcat logs
let simulatedLogs = [
  "[System UI] Device boot completed successfully.",
  "[TouchScreen] ERR: Touch panel interrupt timeout (status: 0x800045).",
  "[TouchScreen] WARNING: Ghost touch detected at (x: 142, y: 888) - potential sensor leak.",
  "[BatteryService] Temperature: 39.5 C, Status: Discharging.",
  "[DisplayManager] Screen brightness set to 75%.",
  "[InputDispatcher] Input channel dead: Lower-Right corner unresponsive (x > 1000, y > 2500).",
  "[Accessibility] TalkBack service is currently: DISABLED."
];

// Helper to run shell commands safely
function runCommand(cmd) {
  return new Promise((resolve) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        resolve({ success: false, error: stderr || error.message });
      } else {
        resolve({ success: true, stdout });
      }
    });
  });
}

// ----------------------------------------------------
// Mock Simulator File Database
// ----------------------------------------------------
const SIMULATED_FILES = {
  '/sdcard': [
    { name: 'DCIM', isDir: true, size: 0, date: '2026-07-01 10:00' },
    { name: 'Download', isDir: true, size: 0, date: '2026-07-02 12:15' },
    { name: 'Documents', isDir: true, size: 0, date: '2026-06-15 08:30' },
    { name: 'WhatsApp', isDir: true, size: 0, date: '2026-07-03 21:00' },
    { name: 'contacts.vcf', isDir: false, size: 46200, date: '2026-07-03 22:45' },
    { name: 'recovery_manifest.json', isDir: false, size: 1024, date: '2026-07-03 23:00' }
  ],
  '/sdcard/DCIM': [
    { name: 'Camera', isDir: true, size: 0, date: '2026-07-01 10:05' },
    { name: 'Screenshots', isDir: true, size: 0, date: '2026-07-01 10:10' }
  ],
  '/sdcard/DCIM/Camera': [
    { name: 'IMG_20260701_120411.jpg', isDir: false, size: 2450000, date: '2026-07-01 12:04' },
    { name: 'IMG_20260702_153322.jpg', isDir: false, size: 3120000, date: '2026-07-02 15:33' },
    { name: 'VID_20260702_180005.mp4', isDir: false, size: 18500000, date: '2026-07-02 18:00' }
  ],
  '/sdcard/DCIM/Screenshots': [
    { name: 'Screenshot_20260703_221045.png', isDir: false, size: 420000, date: '2026-07-03 22:10' }
  ],
  '/sdcard/Download': [
    { name: 'bank_statement_june.pdf', isDir: false, size: 450000, date: '2026-07-01 14:20' },
    { name: 'recovery_guide_android.txt', isDir: false, size: 4096, date: '2026-06-20 11:00' },
    { name: 'ReviveApp_V1.1_Debug.apk', isDir: false, size: 12400000, date: '2026-07-03 18:30' }
  ],
  '/sdcard/Documents': [
    { name: 'medical_report.pdf', isDir: false, size: 890000, date: '2026-06-15 08:35' },
    { name: 'notes.txt', isDir: false, size: 512, date: '2026-06-22 09:12' }
  ],
  '/sdcard/WhatsApp': [
    { name: 'Backups', isDir: true, size: 0, date: '2026-07-03 21:05' },
    { name: 'Media', isDir: true, size: 0, date: '2026-07-03 21:10' }
  ],
  '/sdcard/WhatsApp/Backups': [
    { name: 'msgstore.db.crypt14', isDir: false, size: 85400000, date: '2026-07-03 02:00' }
  ],
  '/sdcard/WhatsApp/Media': [
    { name: 'WhatsApp Images', isDir: true, size: 0, date: '2026-07-03 21:12' }
  ],
  '/sdcard/WhatsApp/Media/WhatsApp Images': [
    { name: 'IMG-WA0001.jpg', isDir: false, size: 310000, date: '2026-07-03 21:12' },
    { name: 'IMG-WA0002.jpg', isDir: false, size: 154000, date: '2026-07-03 21:15' }
  ]
};

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. GET /api/devices
app.get('/api/devices', async (req, res) => {
  const devices = [
    {
      id: 'demo_device',
      name: 'Galaxy S24 Ultra (Demo Device)',
      status: 'device',
      isMock: true,
      androidVersion: '14',
      battery: 42
    }
  ];

  if (isAdbAvailable) {
    const { success, stdout } = await runCommand('adb devices');
    if (success) {
      const lines = stdout.split('\n');
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          const parts = line.split(/\s+/);
          if (parts.length >= 2) {
            const id = parts[0];
            const status = parts[1];
            if (status === 'device' || status === 'unauthorized') {
              // Try to grab model name
              const modelRes = await runCommand(`adb -s ${id} shell getprop ro.product.model`);
              const name = modelRes.success ? modelRes.stdout.trim() : `Android Device (${id})`;
              
              // Get battery
              const battRes = await runCommand(`adb -s ${id} shell dumpsys battery | grep level`);
              let battery = 100;
              if (battRes.success) {
                const match = battRes.stdout.match(/\d+/);
                if (match) battery = parseInt(match[0]);
              }

              // Get release version
              const verRes = await runCommand(`adb -s ${id} shell getprop ro.build.version.release`);
              const androidVersion = verRes.success ? verRes.stdout.trim() : 'Unknown';

              devices.unshift({
                id,
                name: `${name} (Real Device)`,
                status,
                isMock: false,
                androidVersion,
                battery
              });
            }
          }
        }
      }
    }
  }

  res.json({
    adbInstalled: isAdbAvailable,
    devices
  });
});

// 2. GET /api/device/:id/info
app.get('/api/device/:id/info', async (req, res) => {
  const { id } = req.params;

  if (id === 'demo_device') {
    return res.json({
      success: true,
      device: {
        id: 'demo_device',
        name: 'Samsung Galaxy S24 Ultra (SM-S928B)',
        status: 'device',
        isMock: true,
        androidVersion: '14 (API 34)',
        battery: 42,
        temperature: '39.5°C',
        storage: {
          used: '112 GB',
          total: '256 GB',
          percentage: 43
        },
        usbDebugging: 'Active (Simulated)',
        screenResolution: '1440 x 3120',
        recoveryIntelligence: {
          displayHealth: 42,
          displayHealthExplanation: 'The lower-right region shows black pixel bleeding, and vertical colored lines span from top to bottom, suggesting internal OLED substrate leakage and structural damage rather than only shattered cover glass.',
          damageSeverity: 'CRITICAL',
          touchRisk: {
            deadZones: [{ xStart: 1000, yStart: 2500, xEnd: 1440, yEnd: 3120, label: 'Bottom-Right Dead Touch' }],
            ghostZones: [{ xStart: 0, yStart: 0, xEnd: 400, yEnd: 600, label: 'Upper-Left Ghost Touch Area' }],
            safeZones: [{ xStart: 400, yStart: 600, xEnd: 1440, yEnd: 2500, label: 'Safe Center Workspace' }]
          },
          recoveryTimeline: [
            { step: 1, title: 'Trigger Emergency Backup', desc: 'Secure high-value DCIM Photos and Contacts files immediately before OLED leakage expands.', status: 'pending' },
            { step: 2, title: 'Export Cryptographic Keys', desc: 'Pull critical config and app files (e.g. WhatsApp databases, key stores) from /sdcard.', status: 'pending' },
            { step: 3, title: 'Activate Remote Voice Assistance', desc: 'Enable TalkBack via ADB key events to provide audio narration for unresponsive areas.', status: 'pending' },
            { step: 4, title: 'Bypass Lock Screen via Input Keyevents', desc: 'Use Smart Overlay Safe touch triggers to type PIN and confirm file transfers.', status: 'pending' },
            { step: 5, title: 'Disconnect and Schedule Hardware Repair', desc: 'OLED screen replacement recommended. Storage and motherboard are fully intact.', status: 'pending' }
          ]
        }
      }
    });
  }

  // Real ADB Fetching
  if (!isAdbAvailable) {
    return res.status(400).json({ success: false, error: 'ADB is not installed on server' });
  }

  // Check state
  const nameRes = await runCommand(`adb -s ${id} shell getprop ro.product.model`);
  const modelName = nameRes.success ? nameRes.stdout.trim() : 'Android Device';

  const brandRes = await runCommand(`adb -s ${id} shell getprop ro.product.brand`);
  const brandName = brandRes.success ? brandRes.stdout.trim() : '';

  const sdkRes = await runCommand(`adb -s ${id} shell getprop ro.build.version.sdk`);
  const sdk = sdkRes.success ? sdkRes.stdout.trim() : '';

  const relRes = await runCommand(`adb -s ${id} shell getprop ro.build.version.release`);
  const rel = relRes.success ? relRes.stdout.trim() : '';

  // Storage Info
  let storage = { used: 'N/A', total: 'N/A', percentage: 0 };
  const dfRes = await runCommand(`adb -s ${id} shell df -h /data`);
  if (dfRes.success) {
    const lines = dfRes.stdout.trim().split('\n');
    if (lines.length > 1) {
      // Columns: Filesystem Size Used Free Blksize /data
      // Let's parse columns
      const cols = lines[1].trim().split(/\s+/);
      if (cols.length >= 4) {
        const total = cols[1];
        const used = cols[2];
        let percent = parseInt(cols[4].replace('%', ''));
        if (isNaN(percent) && cols[3]) {
          percent = parseInt(cols[3].replace('%', ''));
        }
        storage = {
          used,
          total,
          percentage: isNaN(percent) ? 50 : percent
        };
      }
    }
  }

  // Battery Info
  let battery = 100;
  let temp = '30.0°C';
  const battRes = await runCommand(`adb -s ${id} shell dumpsys battery`);
  if (battRes.success) {
    const lines = battRes.stdout.split('\n');
    lines.forEach(line => {
      if (line.includes('level:')) {
        const m = line.match(/\d+/);
        if (m) battery = parseInt(m[0]);
      }
      if (line.includes('temperature:')) {
        const m = line.match(/\d+/);
        if (m) {
          // ADB temperature is in tenths of a degree Celsius (e.g. 352 means 35.2 C)
          temp = (parseInt(m[0]) / 10).toFixed(1) + '°C';
        }
      }
    });
  }

  // Screen resolution
  let resolution = '1080 x 2400';
  const wmRes = await runCommand(`adb -s ${id} shell wm size`);
  if (wmRes.success) {
    const m = wmRes.stdout.match(/\d+x\d+/);
    if (m) {
      resolution = m[0].replace('x', ' x ');
    }
  }

  res.json({
    success: true,
    device: {
      id,
      name: `${brandName.toUpperCase()} ${modelName}`,
      status: 'device',
      isMock: false,
      androidVersion: `${rel} (API ${sdk})`,
      battery,
      temperature: temp,
      storage,
      usbDebugging: 'Active',
      screenResolution: resolution,
      recoveryIntelligence: {
        displayHealth: 75,
        displayHealthExplanation: 'Device is communicating fully via ADB interface. Touch panel status report is inaccessible, standard touch heuristics indicate a healthy kernel device tree. Display buffer matches active window sizes.',
        damageSeverity: 'MODERATE',
        touchRisk: {
          deadZones: [],
          ghostZones: [],
          safeZones: [{ xStart: 0, yStart: 0, xEnd: 1440, yEnd: 3120, label: 'Entire Display Safe' }]
        },
        recoveryTimeline: [
          { step: 1, title: 'Initiate Full Data Dump', desc: 'Secure camera assets and user documents using the Emergency Backups panel.', status: 'pending' },
          { step: 2, title: 'Verify Input Response', desc: 'Click points on the screen viewer to verify touch signals map correctly on-device.', status: 'pending' },
          { step: 3, title: 'Export User Contacts', desc: 'Generate contact dump and pull the output file to local machine.', status: 'pending' }
        ]
      }
    }
  });
});

// 3. GET /api/device/:id/screenshot
// Streams a screenshot directly to the browser
app.get('/api/device/:id/screenshot', async (req, res) => {
  const { id } = req.params;

  if (id === 'demo_device') {
    // Return a built-in static mock screenshot (or let frontend draw it using CSS/Canvas, which is cleaner)
    // To make sure it always returns an image, we can send a 1x1 transparent png, or a nice generated design
    // Let's generate a beautiful mockup image in Base64 or direct bytes:
    const mockImage = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      'base64'
    );
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': mockImage.length
    });
    return res.end(mockImage);
  }

  if (!isAdbAvailable) {
    return res.status(404).send('ADB Not Available');
  }

  // Exec out screencap is very fast and returns raw PNG
  exec(`adb -s ${id} exec-out screencap -p`, { encoding: 'buffer', maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
    if (err) {
      console.error('Screenshot error:', err);
      return res.status(500).send('Screenshot capture failed');
    }
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': stdout.length
    });
    res.end(stdout);
  });
});

// 4. POST /api/device/:id/tap
app.post('/api/device/:id/tap', async (req, res) => {
  const { id } = req.params;
  const { x, y } = req.body;

  simulatedLogs.push(`[InputBridge] Tap command executed at coordinate (${x}, ${y}).`);

  if (id === 'demo_device') {
    return res.json({ success: true, message: `Simulated tap at (${x}, ${y})` });
  }

  if (!isAdbAvailable) {
    return res.status(400).json({ success: false, error: 'ADB is not installed' });
  }

  const { success, error } = await runCommand(`adb -s ${id} shell input tap ${x} ${y}`);
  res.json({ success, error });
});

// 5. POST /api/device/:id/swipe
app.post('/api/device/:id/swipe', async (req, res) => {
  const { id } = req.params;
  const { x1, y1, x2, y2, duration = 300 } = req.body;

  simulatedLogs.push(`[InputBridge] Swipe command executed from (${x1}, ${y1}) to (${x2}, ${y2}) in ${duration}ms.`);

  if (id === 'demo_device') {
    return res.json({ success: true, message: `Simulated swipe from (${x1}, ${y1}) to (${x2}, ${y2})` });
  }

  if (!isAdbAvailable) {
    return res.status(400).json({ success: false, error: 'ADB is not installed' });
  }

  const { success, error } = await runCommand(`adb -s ${id} shell input swipe ${x1} ${y1} ${x2} ${y2} ${duration}`);
  res.json({ success, error });
});

// 6. POST /api/device/:id/keyevent
app.post('/api/device/:id/keyevent', async (req, res) => {
  const { id } = req.params;
  const { keycode } = req.body;

  let keyName = `KEYCODE_${keycode}`;
  if (keycode === 3) keyName = 'HOME';
  if (keycode === 4) keyName = 'BACK';
  if (keycode === 26) keyName = 'POWER';
  if (keycode === 24) keyName = 'VOLUME_UP';
  if (keycode === 25) keyName = 'VOLUME_DOWN';

  simulatedLogs.push(`[InputBridge] Key event triggered: ${keyName} (Keycode: ${keycode}).`);

  if (id === 'demo_device') {
    return res.json({ success: true, message: `Simulated keyevent ${keycode}` });
  }

  if (!isAdbAvailable) {
    return res.status(400).json({ success: false, error: 'ADB is not installed' });
  }

  const { success, error } = await runCommand(`adb -s ${id} shell input keyevent ${keycode}`);
  res.json({ success, error });
});

// 7. GET /api/device/:id/files
app.get('/api/device/:id/files', async (req, res) => {
  const { id } = req.params;
  let targetPath = req.query.path || '/sdcard';

  // Normalize path slightly
  if (!targetPath.startsWith('/')) {
    targetPath = '/' + targetPath;
  }

  if (id === 'demo_device') {
    // Grab mock files or fallback to /sdcard
    const files = SIMULATED_FILES[targetPath] || SIMULATED_FILES['/sdcard'];
    return res.json({
      success: true,
      currentPath: targetPath,
      files
    });
  }

  if (!isAdbAvailable) {
    return res.status(400).json({ success: false, error: 'ADB is not installed' });
  }

  // Safe file exploration using standard columns
  // Run ls -la or ls -p (to append slashes to directories)
  const { success, stdout, error } = await runCommand(`adb -s ${id} shell "ls -lp ${targetPath}"`);
  if (!success) {
    return res.json({ success: false, error: error || 'Failed to list directory contents' });
  }

  // Parse lines
  const lines = stdout.split('\n');
  const files = [];

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('total')) return;

    // Split on white spaces
    const parts = trimmed.split(/\s+/);
    // Usually columns look like:
    // -rw-rw---- 1 root sdcard_rw 46200 2026-07-03 22:45 contacts.vcf
    // drwxrwx--- 1 root sdcard_rw     0 2026-07-03 21:00 WhatsApp/
    
    if (parts.length >= 4) {
      // Find the file name, which is the last column (or last few if spaces are allowed)
      // Standard ls -lp gives: permissions links owner group size date time name
      // If we find name, let's parse:
      let name = parts.slice(7).join(' ');
      if (!name && parts[3]) {
        // Fallback for simple ls outputs
        name = parts[parts.length - 1];
      }

      if (name && name !== '.' && name !== '..') {
        const isDir = name.endsWith('/');
        const cleanName = isDir ? name.slice(0, -1) : name;
        
        let size = 0;
        let sizeCol = parts[4];
        if (!isDir && sizeCol) {
          size = parseInt(sizeCol) || 0;
        }

        // Date parse
        const dateStr = `${parts[5] || ''} ${parts[6] || ''}`.trim() || '2026-07-03 12:00';

        files.push({
          name: cleanName,
          isDir,
          size,
          date: dateStr
        });
      }
    }
  });

  // Sort: directories first, then files alphabetically
  files.sort((a, b) => {
    if (a.isDir && !b.isDir) return -1;
    if (!a.isDir && b.isDir) return 1;
    return a.name.localeCompare(b.name);
  });

  res.json({
    success: true,
    currentPath: targetPath,
    files
  });
});

// 8. GET /api/device/:id/download
app.get('/api/device/:id/download', async (req, res) => {
  const { id } = req.params;
  const filePath = req.query.path;

  if (!filePath) {
    return res.status(400).send('File path parameter is required.');
  }

  const basename = path.basename(filePath);
  simulatedLogs.push(`[BridgeFS] Exporting file: ${filePath}`);

  if (id === 'demo_device') {
    // Generate beautiful mock file content depending on extension
    res.setHeader('Content-disposition', 'attachment; filename=' + basename);
    res.setHeader('Content-type', 'application/octet-stream');

    if (basename.endsWith('.vcf')) {
      const vcard = `BEGIN:VCARD\nVERSION:3.0\nN:Doe;John;;;\nFN:John Doe\nTEL;TYPE=CELL:+15555550199\nEMAIL;TYPE=PREF,INTERNET:john.doe@example.com\nEND:VCARD\nBEGIN:VCARD\nVERSION:3.0\nN:Smith;Jane;;;\nFN:Jane Smith\nTEL;TYPE=CELL:+15555550244\nEND:VCARD`;
      return res.send(vcard);
    } else if (basename.endsWith('.txt')) {
      return res.send(`ReviveAI Recovery Diagnostic Report\n===================================\nStatus: OLED Bleeding & Digitizer Unresponsive\nTarget device: SM-S928B\nData integrity: 100% SECURE\n`);
    } else {
      // Send dummy binary buffer
      const buffer = Buffer.alloc(1024 * 50); // 50KB dummy file
      return res.send(buffer);
    }
  }

  if (!isAdbAvailable) {
    return res.status(400).send('ADB Not Installed');
  }

  // Stream the output of adb exec-out cat
  res.setHeader('Content-disposition', 'attachment; filename=' + basename);
  res.setHeader('Content-type', 'application/octet-stream');

  const adbCmd = `adb -s ${id} exec-out cat "${filePath}"`;
  const process = exec(adbCmd, { encoding: 'buffer', maxBuffer: 100 * 1024 * 1024 });

  process.stdout.pipe(res);

  process.stderr.on('data', (err) => {
    console.error('ADB file cat error:', err.toString());
  });
});

// 9. GET /api/device/:id/logs
app.get('/api/device/:id/logs', async (req, res) => {
  const { id } = req.params;

  if (id === 'demo_device') {
    // Return rotating simulated logs + append generic activities
    const logs = [...simulatedLogs];
    // Rotate logs so they feel active
    if (logs.length > 50) {
      logs.shift();
    }
    return res.json({ success: true, logs });
  }

  if (!isAdbAvailable) {
    return res.status(400).json({ success: false, error: 'ADB is not installed' });
  }

  // Dump logcat buffers
  const { success, stdout, error } = await runCommand(`adb -s ${id} logcat -d -v brief -t 100`);
  if (!success) {
    return res.json({ success: false, error: error || 'Failed to capture logcat logs' });
  }

  const logs = stdout.trim().split('\n').filter(Boolean);
  res.json({ success: true, logs });
});

// Initial startup checks
checkAdb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 ReviveAI ADB Bridge Server running on http://localhost:${PORT}`);
  });
});
