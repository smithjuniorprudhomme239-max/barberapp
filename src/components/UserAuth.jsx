import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function UserAuth({ onSuccess, onClose }) {
  const { login, signup, forgotPassword } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotError, setForgotError] = useState('')
  const [forgotSuccess, setForgotSuccess] = useState(false)
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (mode === 'login') {
      const res = await login(form.email, form.password)
      if (res.ok) {
        setSuccess('Login successful!')
        setTimeout(() => onSuccess(), 1000)
      } else {
        setError(res.msg)
      }
    } else {
      const res = await signup(form.name, form.email, form.password)
      if (res.ok) {
        setSuccess('Sign up successful! Please check your email to verify your account.')
        setTimeout(() => onSuccess(), 2000)
      } else {
        setError(res.msg)
      }
    }
  }

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const handleForgotPassword = async e => {
    e.preventDefault()
    if (isSubmitting || cooldown > 0) return
    
    setForgotError('')
    setForgotSuccess(false)
    setIsSubmitting(true)
    
    const res = await forgotPassword(forgotEmail)
    setIsSubmitting(false)
    
    if (res.ok) {
      setForgotSuccess(true)
      setForgotEmail('')
      setCooldown(60) // 1 minute cooldown
    } else {
      setForgotError(res.msg)
      if (res.msg.includes('rate limit')) {
        setCooldown(60) // 1 minute cooldown on rate limit error
      }
    }
  }

  return (
    <div className="login-page">
      {!showForgotPassword ? (
        <form className="login-form" onSubmit={submit}>
          <button type="button" className="close-btn" onClick={onClose}>✕</button>
          <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>

          {mode === 'signup' && (
            <input name="name" placeholder="Full Name" value={form.name} onChange={handle} required />
          )}
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handle} required />
          <div className="password-input-container">
            <input 
              name="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={form.password} 
              onChange={handle} 
              required 
            />
            <button 
              type="button" 
              className="password-toggle" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          {error && <p className="login-error">{error}</p>}
          {success && <p className="login-success">{success}</p>}

          <button type="submit">{mode === 'login' ? 'Login' : 'Sign Up'}</button>



          <p className="auth-toggle">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <span onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}>
              {mode === 'login' ? ' Sign Up' : ' Login'}
            </span>
          </p>
        </form>
      ) : (
        <form className="login-form" onSubmit={handleForgotPassword}>
          <button type="button" className="close-btn" onClick={() => setShowForgotPassword(false)}>✕</button>
          <h2>Forgot Password</h2>
          <p className="forgot-password-info">Enter your email address and we'll send you a link to reset your password.</p>
          <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            value={forgotEmail} 
            onChange={(e) => setForgotEmail(e.target.value)} 
            required 
          />
          {forgotError && <p className="login-error">{forgotError}</p>}
          {forgotSuccess && <p className="login-success">If an account with that email exists, a password reset link has been sent. Please check your inbox and spam folder.</p>}
          <button type="submit" disabled={isSubmitting || cooldown > 0}>
            {isSubmitting ? 'Sending...' : cooldown > 0 ? `Try again in ${cooldown}s` : 'Send Reset Link'}
          </button>
          <p className="back-to-login">
            <span onClick={() => setShowForgotPassword(false)}>Back to Login</span>
          </p>
        </form>
      )}
    </div>
  )
}