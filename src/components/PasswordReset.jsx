import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function PasswordReset({ onSuccess, onClose }) {
  const { resetPassword, user } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if user is logged in (via reset token)
    if (!user) {
      setError('Invalid or expired reset link')
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    const res = await resetPassword(password)
    setIsLoading(false)

    if (res.ok) {
      setSuccess('Your password has been successfully reset. You can now log in with your new password.')
      setTimeout(() => onSuccess(), 1500)
    } else {
      setError(res.msg)
    }
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <button type="button" className="close-btn" onClick={onClose}>✕</button>
        <h2>Reset Password</h2>
        <p className="forgot-password-info">Enter your new password below</p>
        
        <div className="password-input-container">
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="New Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
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
        
        <div className="password-input-container">
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Confirm New Password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>

        {error && <p className="login-error">{error}</p>}
        {success && <p className="login-success">{success}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  )
}