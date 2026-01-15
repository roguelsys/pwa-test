// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('✅ Service Worker registered'));
}

// PWA Install Prompt
let deferredPrompt;
const installBtn = document.getElementById('installBtn');
installBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';
});

installBtn.addEventListener('click', async () => {
  installBtn.style.display = 'none';
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
});

// Camera Access
document.getElementById('cameraBtn').addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    document.getElementById('cameraView').srcObject = stream;
  } catch (err) {
    alert('Camera access denied or unavailable.');
  }
});

// Notifications
document.getElementById('notifyBtn').addEventListener('click', async () => {
  if (!('Notification' in window)) {
    alert('This browser does not support notifications.');
    return;
  }

  let permission = Notification.permission;
  if (permission === 'default') {
    permission = await Notification.requestPermission();
  }

  if (permission === 'granted') {
    navigator.serviceWorker.getRegistration().then(reg => {
      reg.showNotification('Hello from your PWA!', {
        body: 'This is a test notification.',
        icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png'
      });
    });
  } else {
    alert('Notifications not allowed.');
  }
});

