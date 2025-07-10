import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Login'
import GoogleSSOLogin from './pages/GoogleSSOLogin'

function App() {
  const [count, setCount] = useState(0)
  const [page, setPage] = useState('main') // 'main', 'login', 'googleSSO'
  const [user, setUser] = useState(null)
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [pushStatus, setPushStatus] = useState('');
  const [syncStatus, setSyncStatus] = useState('');

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setShowInstall(false);
        setDeferredPrompt(null);
      });
    }
  };

  const handlePushSubscribe = async () => {
    if (!('serviceWorker' in navigator)) {
      setPushStatus('Service Worker를 지원하지 않는 브라우저입니다.');
      return;
    }
    if (!('PushManager' in window)) {
      setPushStatus('Push API를 지원하지 않는 브라우저입니다.');
      return;
    }
    if (Notification.permission === 'denied') {
      setPushStatus('알림 권한이 차단되어 있습니다.');
      return;
    }
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        // 실제 서비스에서는 applicationServerKey(VAPID 공개키) 필요
      });
      setPushStatus('푸시 구독 성공!');
      // 실제 서비스에서는 sub 정보를 서버로 전송 필요
      console.log('Push Subscription:', JSON.stringify(sub));
    } catch (err) {
      setPushStatus('푸시 구독 실패: ' + err.message);
    }
  };

  const handleSyncRegister = async () => {
    if (!('serviceWorker' in navigator)) {
      setSyncStatus('Service Worker를 지원하지 않는 브라우저입니다.');
      return;
    }
    if (!('SyncManager' in window)) {
      setSyncStatus('SyncManager를 지원하지 않는 브라우저입니다.');
      return;
    }
    try {
      const reg = await navigator.serviceWorker.ready;
      await reg.sync.register('demo-sync');
      setSyncStatus('백그라운드 동기화 등록 성공! (개발자도구 > Application > Service Workers에서 확인 가능)');
    } catch (err) {
      setSyncStatus('백그라운드 동기화 등록 실패: ' + err.message);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    setPage('main')
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('authToken')
  }

  if (page === 'login') {
    return <Login onSwitchSignup={() => {}} onSuccess={handleLoginSuccess} />
  }
  if (page === 'googleSSO') {
    return <GoogleSSOLogin onSuccess={handleLoginSuccess} />
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      {user ? (
        <div>
          <p>환영합니다, {user.nickname || user.username}!</p>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      ) : (
        <>
          <button onClick={() => setPage('login')}>일반 로그인</button>
          <button onClick={() => setPage('googleSSO')}>Google SSO 로그인</button>
        </>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', bottom: 80, left: 0, right: 0, zIndex: 9999, gap: '24px' }}>
        <button onClick={handleSyncRegister} style={{ padding: '10px 20px', fontSize: '15px', borderRadius: '8px', background: '#ffe600', color: '#222', border: 'none', cursor: 'pointer' }}>
          백그라운드 동기화
        </button>
        {syncStatus && <div style={{ color: '#222', fontSize: '14px', marginRight: '16px' }}>{syncStatus}</div>}
        <button onClick={handlePushSubscribe} style={{ padding: '10px 20px', fontSize: '15px', borderRadius: '8px', background: '#ffe600', color: '#222', border: 'none', cursor: 'pointer' }}>
          푸시 알림 구독하기
        </button>
        {pushStatus && <div style={{ color: '#222', fontSize: '14px' }}>{pushStatus}</div>}
      </div>
      {showInstall && (
        <div style={{ position: 'fixed', bottom: 20, left: 0, right: 0, textAlign: 'center', zIndex: 9999 }}>
          <button onClick={handleInstallClick} style={{ padding: '12px 24px', fontSize: '16px', borderRadius: '8px', background: '#317EFB', color: '#fff', border: 'none', cursor: 'pointer' }}>
            홈 화면에 앱 추가하기
          </button>
        </div>
      )}
    </>
  )
}

export default App
