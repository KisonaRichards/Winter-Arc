/* Installable app (PWA): install prompt, iPhone "Add to Home Screen" help, service worker. */
let _deferredInstall = null;
const isStandalone = () => (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); _deferredInstall = e; if (typeof renderAlerts === 'function') renderAlerts(); });
window.addEventListener('appinstalled', () => { _deferredInstall = null; if (typeof renderAlerts === 'function') renderAlerts(); });

const isNativeApp = () => !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());

function getInstallAlert() {
  if (isStandalone() || isNativeApp()) return null; // already an app
  if (_deferredInstall) return { type: 'install', snooze: 14, title: `${SEASON.icon} INSTALL ${APP_NAME.toUpperCase()}`, body: 'Add it to your home screen for one-tap access and a full-screen game.', actions: [{ label: 'INSTALL', fn: 'installApp()' }] };
  if (isIOS()) return { type: 'install', snooze: 14, title: `${SEASON.icon} ADD ${APP_NAME.toUpperCase()} TO YOUR HOME SCREEN`, body: 'Get a full-screen app icon (and be ready for reminders later).', actions: [{ label: 'SHOW ME HOW', fn: 'showIOSInstallHelp()' }] };
  return null;
}
async function installApp() {
  if (!_deferredInstall) return;
  _deferredInstall.prompt();
  try { await _deferredInstall.userChoice; } catch (e) {}
  _deferredInstall = null; renderAlerts();
}
function showIOSInstallHelp() {
  modalShell(`<h3 class="font-display font-bold text-lg text-white">Add to Home Screen</h3>
    <ol class="text-sm text-slate-300 space-y-2 list-decimal pl-5"><li>Tap the <b>Share</b> button in Safari.</li><li>Scroll down and tap <b>Add to Home Screen</b>.</li><li>Tap <b>Add</b>, then open ${APP_NAME} from your home screen.</li></ol>
    <button onclick="closeQuestModal()" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-ice-500 to-blue-600 text-white text-sm font-bold">Got it</button>`);
}
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && !isNativeApp()) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
