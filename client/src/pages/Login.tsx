import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/auth'
import { loginRequest } from '../lib/api'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

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
			login(res.access_token, { email: res.user_email, role: res.role, fullName: res.full_name ?? undefined })
			navigate(res.role === 'hr' ? '/hr' : '/job-seeker')
		} catch (err: any) {
			setError(err?.response?.data?.detail || 'Login failed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Login</CardTitle>
					<CardDescription>Sign in with your credentials or create a new account below.</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={onSubmit} className="space-y-4">
						<div className="space-y-2">
							<label className="text-sm" htmlFor="email">Email</label>
							<Input id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
						</div>
						<div className="space-y-2">
							<label className="text-sm" htmlFor="password">Password</label>
							<Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
						</div>
						{error && <div className="text-sm text-red-600" role="alert">{error}</div>}
						<div className="text-sm text-muted-foreground">
							Don't have an account? <Link className="underline" to="/signup">Sign up</Link>
						</div>
						<Button className="w-full" disabled={loading} type="submit">{loading ? 'Logging in…' : 'Login'}</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
