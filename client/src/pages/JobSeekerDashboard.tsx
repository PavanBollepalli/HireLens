import { useState } from 'react'
import { useAuth } from '../state/auth'
import { analyzeSingle } from '../lib/api'
import { Link } from 'react-router-dom'

export default function JobSeekerDashboard() {
	const { token, user, logout } = useAuth()
	const [jd, setJd] = useState('')
	const [file, setFile] = useState<File | null>(null)
	const [loading, setLoading] = useState(false)
	const [result, setResult] = useState<null | { filename: string; score: number; keyword_match: number; summary: string }>(null)
	const [error, setError] = useState<string | null>(null)

	async function onAnalyze() {
		if (!token || !file) return
		setLoading(true)
		setError(null)
		setResult(null)
		try {
			const res = await analyzeSingle(token, jd, file)
			setResult(res)
		} catch (err: any) {
			setError(err?.response?.data?.detail || 'Analysis failed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div style={{ maxWidth: 900, margin: '32px auto', fontFamily: 'Inter, system-ui, Arial' }}>
			<header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<h2>Job Seeker Dashboard</h2>
				<div>
					<span style={{ marginRight: 12 }}>{user?.email}</span>
					<button onClick={logout}>Logout</button>
				</div>
			</header>
			<p><Link to="/">Home</Link></p>
			<div style={{ display: 'grid', gap: 16 }}>
				<label>Job Description</label>
				<textarea value={jd} onChange={(e) => setJd(e.target.value)} rows={8} style={{ width: '100%', padding: 8 }} />
				<label>Upload Resume (PDF)</label>
				<input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
				<button disabled={loading || !file || !jd} onClick={onAnalyze}>{loading ? 'Analyzing...' : 'Analyze'}</button>
				{error && <div style={{ color: 'red' }}>{error}</div>}
				{result && (
					<div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8 }}>
						<h3>Result</h3>
						<p><strong>File:</strong> {result.filename}</p>
						<p><strong>ATS Score:</strong> {(result.score * 100).toFixed(1)}%</p>
						<p><strong>Keyword Match:</strong> {(result.keyword_match * 100).toFixed(1)}%</p>
						<p>{result.summary}</p>
					</div>
				)}
			</div>
		</div>
	)
}
