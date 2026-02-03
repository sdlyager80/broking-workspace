import { useState } from 'react';
import { DxcFlex, DxcTypography, DxcTextInput, DxcButton, DxcCheckbox } from '@dxc-technology/halstack-react';
import './Login.css';

function Login({ onLogin }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!userId || !password) {
      setError('Please enter both User ID and Password.');
      return;
    }
    setError('');
    onLogin({
      userId: userId,
      name: "John Smith",
      email: "john.smith@dxc.com",
      domain: "Insurance Services",
      role: "Broker Assistant",
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <DxcFlex direction="column" gap="var(--spacing-gap-l)" alignItems="center">
          {/* Logo */}
          <DxcFlex gap="var(--spacing-gap-s)" alignItems="center">
            <svg width="36" height="36" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 0L37.5 15L52.5 7.5L45 22.5L60 30L45 37.5L52.5 52.5L37.5 45L30 60L22.5 45L7.5 52.5L15 37.5L0 30L15 22.5L7.5 7.5L22.5 15L30 0Z" fill="#24A148"/>
              <path d="M30 15L35 25L45 20L40 30L50 35L40 40L45 50L35 45L30 55L25 45L15 50L20 40L10 35L20 30L15 20L25 25L30 15Z" fill="#FFC107"/>
              <path d="M30 20L32.5 27.5L40 25L37.5 32.5L45 35L37.5 37.5L40 45L32.5 42.5L30 50L27.5 42.5L20 45L22.5 37.5L15 35L22.5 32.5L20 25L27.5 27.5L30 20Z" fill="#0095FF"/>
            </svg>
            <DxcTypography fontSize="font-scale-05" fontWeight="font-weight-bold">
              Nexus
            </DxcTypography>
          </DxcFlex>

          <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-stronger)">
            Broker Assistant
          </DxcTypography>

          {error && (
            <div className="login-error">
              <span className="material-icons" style={{ fontSize: '16px' }}>error</span>
              <DxcTypography fontSize="font-scale-01">{error}</DxcTypography>
            </div>
          )}

          <DxcFlex direction="column" gap="var(--spacing-gap-m)" style={{ width: '100%' }}>
            <DxcTextInput
              label="User ID"
              placeholder="Enter your user ID"
              value={userId}
              onChange={({ value }) => setUserId(value)}
              size="fillParent"
            />
            <DxcTextInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={({ value }) => setPassword(value)}
              size="fillParent"
            />
            <DxcCheckbox
              label="Remember me"
              checked={rememberMe}
              onChange={({ value }) => setRememberMe(value)}
            />
          </DxcFlex>

          <DxcFlex direction="column" gap="var(--spacing-gap-s)" style={{ width: '100%' }}>
            <DxcButton
              label="Sign In"
              onClick={handleLogin}
              mode="primary"
              size="fillParent"
            />
          </DxcFlex>

          <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-stronger)">
            DXC Technology - Insurance Services Platform
          </DxcTypography>
        </DxcFlex>
      </div>
    </div>
  );
}

export default Login;
