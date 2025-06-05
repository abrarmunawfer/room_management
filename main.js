const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

let backendProcess;
let splashWindow;
let mainWindow;

function ensureDataDirectory() {
  const dataDir = path.join(os.homedir(), 'RoomManagementApp', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('Created data directory at:', dataDir);
  } else {
    console.log('Data directory exists at:', dataDir);
  }
  return dataDir;
}

function startBackend(dataDir) {
  const isDev = !app.isPackaged;
  const basePath = isDev ? __dirname : process.resourcesPath;

  const backendJarPath = path.join(basePath, 'backend', 'target', 'backend-0.0.1-SNAPSHOT.jar');
  const javaExecutable = process.env.JAVA_EXEC
    ? process.env.JAVA_EXEC
    : path.join(basePath, 'jre', 'bin', process.platform === 'win32' ? 'java.exe' : 'java');

  console.log('Running in', isDev ? 'development' : 'production', 'mode');
  console.log('Base path:', basePath);
  console.log('Backend JAR path:', backendJarPath);
  console.log('Java executable path:', javaExecutable);
  console.log('Data directory:', dataDir);

  if (!fs.existsSync(backendJarPath)) {
    console.error('ERROR: Backend JAR not found at:', backendJarPath);
    return;
  }

  if (!javaExecutable || (!fs.existsSync(javaExecutable) && !process.env.JAVA_EXEC)) {
    console.error('ERROR: Java executable not found at:', javaExecutable);
    console.error('If you expect to use system java, set JAVA_EXEC env variable.');
    return;
  }

  backendProcess = spawn(javaExecutable, [`-Dapp.data.dir=${dataDir}`, '-jar', backendJarPath]);

  backendProcess.stdout.on('data', (data) => {
    const msg = data.toString();
    console.log(`[Backend stdout]: ${msg}`);
    if (msg.includes('Started RoomManagementAppApplication')) {
      showMainWindow();
    }
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`[Backend stderr]: ${data.toString()}`);
  });

  backendProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
  });

  backendProcess.on('error', (err) => {
    console.error('Failed to start backend:', err);
  });
}

function createSplashWindow() {
  const splashPath = path.join(__dirname, 'splash.html');
  const logoPath = path.join(__dirname, 'logo.jpg');
  const iconPath = path.join(__dirname, 'icon.ico');

  splashWindow = new BrowserWindow({
    width: 600,
    height: 400,
    frame: false,
    transparent: false,
    alwaysOnTop: true,
    resizable: false,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  splashWindow.loadFile(splashPath).then(() => {
    splashWindow.webContents.executeJavaScript(`
      document.querySelector('img').src = 'file://${logoPath.replace(/\\/g, '/')}';
    `);
  }).catch(err => {
    console.error('Failed to load splash screen:', err);
  });
}

function showMainWindow() {
  if (splashWindow) {
    splashWindow.close();
  }

  const isDev = !app.isPackaged;
  const basePath = isDev ? __dirname : process.resourcesPath;

  const { pathToFileURL } = require('url');
  const indexHtmlPath = path.join(basePath, 'frontend', 'build', 'index.html');

  if (!fs.existsSync(indexHtmlPath)) {
    console.error('ERROR: Frontend index.html not found at:', indexHtmlPath);
  } else {
    console.log('Frontend index.html found at:', indexHtmlPath);
  }

  const indexPath = pathToFileURL(indexHtmlPath).href;
  const iconPath = path.join(basePath, 'icon.ico');

  console.log('Loading main window from URL:', indexPath);

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(indexPath).catch(err => {
    console.error('Error loading frontend:', err);
  });
}

app.whenReady().then(() => {
  console.log('App is ready');
  console.log('Electron __dirname:', __dirname);
  console.log('Process cwd:', process.cwd());

  const dataDir = ensureDataDirectory();
  createSplashWindow();
  startBackend(dataDir);

  setTimeout(() => {
    if (!mainWindow) {
      console.log("Backend taking too long; opening main window anyway.");
      showMainWindow();
    }
  }, 30000);  // increased timeout to 30 sec

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createSplashWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (backendProcess) {
      backendProcess.kill();
      console.log('Backend process killed.');
    }
    app.quit();
  }
});
