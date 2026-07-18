import { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { loginUser, registerUser, fetchUserProfile } from '../api';

const initialUserProfile: UserProfile = {
  name: '',
  email: '',
  tier: 'Gold',
  points: 0,
  nextTierPoints: 1000,
  savedAddress: '',
  orders: [],
};

const getStoredUserProfile = (): UserProfile => {
  const saved = localStorage.getItem('luxemarket_profile');
  if (!saved) return initialUserProfile;

  try {
    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== 'object') return initialUserProfile;

    return {
      ...initialUserProfile,
      ...parsed,
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      points: typeof parsed.points === 'number' ? parsed.points : initialUserProfile.points,
      nextTierPoints: typeof parsed.nextTierPoints === 'number' ? parsed.nextTierPoints : initialUserProfile.nextTierPoints,
    };
  } catch {
    return initialUserProfile;
  }
};

export function useAuth(triggerNotification: (msg: string) => void, setCurrentPage: (page: any) => void) {
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('luxemarket_token'));
  const [userProfile, setUserProfile] = useState<UserProfile>(getStoredUserProfile);

  // Sync token to storage
  useEffect(() => {
    if (authToken) {
      localStorage.setItem('luxemarket_token', authToken);
    } else {
      localStorage.removeItem('luxemarket_token');
    }
  }, [authToken]);

  // Sync profile storage
  useEffect(() => {
    if (!authToken) {
      setUserProfile(initialUserProfile);
      localStorage.removeItem('luxemarket_profile');
      return;
    }

    if (!userProfile.name && !userProfile.email && userProfile.points === 0 && userProfile.orders.length === 0) {
      localStorage.removeItem('luxemarket_profile');
      return;
    }

    localStorage.setItem('luxemarket_profile', JSON.stringify(userProfile));
  }, [authToken, userProfile]);

  // Load user profile on mount / token change
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!authToken) return;

      try {
        const user = await fetchUserProfile(authToken);
        if (!user) return;

        const defaultAddress = Array.isArray(user.addresses)
          ? user.addresses.find((address) => address.isDefault) || user.addresses[0]
          : null;

        setUserProfile((prev) => ({
          ...prev,
          name: user.name || '',
          email: user.email || '',
          role: user.role,
          savedAddress: defaultAddress
            ? `${defaultAddress.addressLine1 || ''}${defaultAddress.addressLine2 ? `, ${defaultAddress.addressLine2}` : ''}${defaultAddress.city ? `, ${defaultAddress.city}` : ''}${defaultAddress.state ? `, ${defaultAddress.state}` : ''}${defaultAddress.pincode ? `, ${defaultAddress.pincode}` : ''}`
            : '',
        }));
      } catch (error) {
        console.warn('Unable to load user profile from backend', error);
      }
    };

    loadUserProfile();
  }, [authToken]);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupIsSeller, setSignupIsSeller] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError('All fields are required.');
      return;
    }
    try {
      setIsLoggingIn(true);
      setLoginError(null);
      const data = await loginUser(loginEmail, loginPassword);
      
      setAuthToken(data.token);
      
      const profile = await fetchUserProfile(data.token);
      if (profile) {
        const defaultAddress = Array.isArray(profile.addresses)
          ? profile.addresses.find((address: any) => address.isDefault) || profile.addresses[0]
          : null;
        setUserProfile((prev) => ({
          ...prev,
          name: profile.name || '',
          email: profile.email || '',
          role: profile.role,
          savedAddress: defaultAddress
            ? `${defaultAddress.addressLine1 || ''}${defaultAddress.addressLine2 ? `, ${defaultAddress.addressLine2}` : ''}${defaultAddress.city ? `, ${defaultAddress.city}` : ''}${defaultAddress.state ? `, ${defaultAddress.state}` : ''}${defaultAddress.pincode ? `, ${defaultAddress.pincode}` : ''}`
            : '',
        }));
      }
      
      triggerNotification('Login successful! Welcome back.');
      setLoginEmail('');
      setLoginPassword('');
      setCurrentPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Invalid credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
      setSignupError('All fields are required.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match.');
      return;
    }
    try {
      setIsSigningUp(true);
      setSignupError(null);
      await registerUser(signupName, signupEmail, signupPassword, signupIsSeller ? 'seller' : 'user');
      
      triggerNotification('Registration successful! Please log in with your credentials.');
      setCurrentPage('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupConfirmPassword('');
      setSignupIsSeller(false);
    } catch (err) {
      setSignupError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setUserProfile(initialUserProfile);
    localStorage.removeItem('luxemarket_token');
    localStorage.removeItem('luxemarket_profile');
    triggerNotification('Logged out successfully.');
    setCurrentPage('home');
  };

  return {
    authToken,
    setAuthToken,
    userProfile,
    setUserProfile,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    loginError,
    setLoginError,
    isLoggingIn,
    signupName,
    setSignupName,
    signupEmail,
    setSignupEmail,
    signupPassword,
    setSignupPassword,
    signupConfirmPassword,
    setSignupConfirmPassword,
    signupIsSeller,
    setSignupIsSeller,
    signupError,
    setSignupError,
    isSigningUp,
    handleLoginSubmit,
    handleSignupSubmit,
    handleLogout,
  };
}
