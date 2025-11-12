import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, User } from '../state/auth'
import { signupRequest } from '../lib/api'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

const roles: Array<{ value: User['role']; label: string }> = [
	{ value: 'job_seeker', label: 'Job Seeker' },
	{ value: 'hr', label: 'HR' },
]

export default function Signup() {
	const navigate = useNavigate()
	const { login } = useAuth()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [fullName, setFullName] = useState('')
	const [role, setRole] = useState<User['role']>('job_seeker')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function onSubmit(e: FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError(null)
		try {
			const res = await signupRequest({
				email,
				password,
				full_name: fullName || undefined,
				role,
			})
			login(res.access_token, {
				email: res.user_email,
				role: res.role,
				fullName: res.full_name ?? undefined,
			})
			navigate(res.role === 'hr' ? '/hr' : '/job-seeker')
		} catch (err: any) {
			setError(err?.response?.data?.detail || 'Signup failed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Create an account</CardTitle>
					<CardDescription>Sign up to start analyzing resumes with HireLens.</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={onSubmit} className="space-y-4">
						<div className="space-y-2">
							<label className="text-sm" htmlFor="fullName">Full name</label>
							<Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Alex Smith" />
						</div>
						<div className="space-y-2">
							<label className="text-sm" htmlFor="email">Email</label>
							<Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
						</div>
						<div className="space-y-2">
							<label className="text-sm" htmlFor="password">Password</label>
							<Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
						</div>
						<div className="space-y-2">
							<label className="text-sm" htmlFor="role">Role</label>
							<select
								id="role"
								value={role}
								onChange={e => setRole(e.target.value as User['role'])}
								className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
							>
								{roles.map(opt => (
									<option key={opt.value} value={opt.value}>{opt.label}</option>
								))}
							</select>
						</div>
						{error && <div className="text-sm text-red-600" role="alert">{error}</div>}
						<div className="text-sm text-muted-foreground">
							Already have an account? <Link className="underline" to="/login">Log in</Link>
						</div>
						<Button className="w-full" disabled={loading} type="submit">{loading ? 'Signing up…' : 'Sign up'}</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}

