import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../state/auth'
import { loginRequest } from '../lib/api'

export default function Login() {
	const [email, setEmail] = useState('seeker@example.com')
	const [password, setPassword] = useState('password')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const { login } = useAuth()
	const navigate = useNavigate()

	async function onSubmit(e: FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError(null)
		try {
			const res = await loginRequest(email, password)
			login(res.access_token, { email: res.user_email, role: res.role })
			navigate(res.role === 'hr' ? '/hr' : '/job-seeker')
		} catch (err: any) {
			setError(err?.response?.data?.detail || 'Login failed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div style={{ maxWidth: 420, margin: '60px auto', fontFamily: 'Inter, system-ui, Arial' }}>
			<h2>Login</h2>
			<form onSubmit={onSubmit}>
				<div style={{ marginBottom: 12 }}>
					<label>Email</label>
					<input value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 8 }} />
				</div>
				<div style={{ marginBottom: 12 }}>
					<label>Password</label>
					<input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: 8 }} />
				</div>
				{error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
				<button disabled={loading} type="submit">{loading ? 'Logging in...' : 'Login'}</button>
			</form>
			<p style={{ marginTop: 16, color: '#666' }}>
				Demo users: seeker@example.com / password, hr@example.com / password
			</p>
		</div>
	)
}
