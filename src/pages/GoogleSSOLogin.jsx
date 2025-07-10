import { useState } from 'react';
import axios from 'axios';
import { API_GOOGLE_SSO } from '../../utils/api';
import { GoogleLogin } from '@react-oauth/google';

function GoogleSSOLogin({ onSuccess }) {
  const [errorMessage, setErrorMessage] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(
        API_GOOGLE_SSO,
        { id_token_str: credentialResponse.credential }
      );
      const { access_token, user } = response.data;
      if (!access_token) throw new Error('토큰이 응답에 없습니다.');
      localStorage.setItem('authToken', access_token);
      alert(`환영합니다, ${user.nickname || user.username}!`);
      onSuccess(user);
    } catch (error) {
      setErrorMessage('구글 로그인에 실패했습니다.');
    }
  };

  return (
    <div className="login-container">
      <h2>Google SSO 로그인</h2>
      <div style={{ margin: '16px 0' }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setErrorMessage('구글 로그인에 실패했습니다.')}
        />
      </div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default GoogleSSOLogin; 