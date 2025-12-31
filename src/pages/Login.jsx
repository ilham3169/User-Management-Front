import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Added this import
import { Lock, Eye, EyeOff, Activity, User, Globe, AlertCircle, CheckCircle } from 'lucide-react';
import { translations, languages } from '../utils/translations';
import { checkExistingSession, login, update_login} from '../services/authService.js';

export default function Login() {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState('en');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' }); 

  const t = translations[language];

  useEffect(() => {
    const verify = async () => {
      const session = await checkExistingSession();
      if (session.isValid) {
        navigate('/dashboard');
      }
    };
    verify();
  }, [navigate]);

  const handleSubmit = async () => {
    setMessage({ type: '', text: '' });

    if (!username || !password) { 
      setMessage({ type: 'error', text: t.errorEmptyFields }); 
      return; 
    }

    try {
      const response = await login(username, password); 
      localStorage.setItem('token', response.access_token); 
      
      setMessage({ type: 'success', text: t.successLogin });
      await update_login(username);

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (error) { 
      setMessage({ type: 'error', text: t.errorInvalidCredentials }); 
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const changeLanguage = (code) => {
    setLanguage(code);
    setShowLanguageMenu(false);
    setMessage({ type: '', text: '' }); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      
      {/* Language Selector - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <div className="relative">
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition border border-gray-200"
          >
            <Globe className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              {languages.find(lang => lang.code === language)?.flag}
            </span>
          </button>

          {/* Language Dropdown */}
          {showLanguageMenu && (
            <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden min-w-[160px]">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition flex items-center gap-3 ${
                    language === lang.code ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Login Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-white">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
              <Activity className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">{t.title}</h1>
          <p className="text-blue-100 text-center text-sm">{t.subtitle}</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">{t.welcome}</h2>
          </div>

          {/* Username Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              {t.username}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder={t.usernamePlaceholder}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              {t.password}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder={t.passwordPlaceholder}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {t.signIn}
          </button>

          {/* Message Display */}
          {message.text && (
            <div
              className={`mt-4 p-4 rounded-lg flex items-start gap-3 animate-fade-in ${
                message.type === 'error'
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-green-50 border border-green-200'
              }`}
            >
              {message.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              )}
              <p
                className={`text-sm font-medium ${
                  message.type === 'error' ? 'text-red-700' : 'text-green-700'
                }`}
              >
                {message.text}
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">{t.needAssistance}</span>
            </div>
          </div>

          {/* Bottom Links */}
          <div className="text-center space-y-2">
            <a href="https://t.me/darwinyeahjustadarwin" className="block text-sm text-gray-600 hover:text-blue-600">
              {t.contactSupport}
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            {t.protectedBy}
          </p>
        </div>
      </div>
    </div>
  );
}