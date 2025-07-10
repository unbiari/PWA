import { useState } from 'react';
import axios from 'axios';
import { API_LOGIN } from '../../utils/api';

function Login({ onSwitchSignup, onSuccess }) {
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!loginId || !loginPw) {
      setErrorMessage('ID와 비밀번호를 입력하세요.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('username', loginId.trim());
      formData.append('password', loginPw.trim());
      const response = await axios.post(
        API_LOGIN,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      const { access_token, user } = response.data;
      if (!access_token) throw new Error('Access token is missing in the response.');
      localStorage.setItem('authToken', access_token);
      alert(`Welcome, ${user.nickname || user.username}! 로그인 성공`);
      onSuccess(user);
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || 'Login failed. 아이디/비밀번호가 잘못되었습니다.');
      } else {
        setErrorMessage('An unexpected error occurred. 예상치 못한 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login 로그인</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID:</label>
          <input
            type="text"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            required
            placeholder="ID를 입력하세요"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={loginPw}
            onChange={(e) => setLoginPw(e.target.value)}
            required
            placeholder="비밀번호를 입력하세요"
          />
        </div>
        <button type="submit">Log In</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <p>
        Don’t have an account? &nbsp;
        <button onClick={onSwitchSignup}>Sign Up</button>
      </p>
    </div>
  );
}

export default Login;
