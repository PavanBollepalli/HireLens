import { Link } from 'react-router-dom'
import { useAuth } from './state/auth'

export default function App() {
	const { user } = useAuth()
	return (
		<div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'Inter, system-ui, Arial' }}>
			<h1>HireLens</h1>
			<p>ATS Resume Analyzer</p>
			{!user && (
				<p><Link to="/login">Login</Link></p>
			)}
			{user?.role === 'job_seeker' && (
				<p><Link to="/job-seeker">Go to Job Seeker Dashboard</Link></p>
			)}
			{user?.role === 'hr' && (
				<p><Link to="/hr">Go to HR Dashboard</Link></p>
			)}
		</div>
	)
}
