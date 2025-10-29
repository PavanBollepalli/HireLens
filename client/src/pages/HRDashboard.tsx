import { useState } from 'react'
import { useAuth } from '../state/auth'
import { analyzeBatch } from '../lib/api'
import { Link } from 'react-router-dom'

export default function HRDashboard() {
	const { token, user, logout } = useAuth()
	const [jd, setJd] = useState('')
	const [files, setFiles] = useState<File[]>([])
	const [loading, setLoading] = useState(false)
	const [results, setResults] = useState<Array<{ filename: string; score: number; keyword_match: number; summary: string }>>([])
	const [best, setBest] = useState<string | undefined>(undefined)
	const [error, setError] = useState<string | null>(null)

	async function onAnalyze() {
		if (!token || files.length === 0) return
		setLoading(true)
		setError(null)
		setResults([])
		try {
			const res = await analyzeBatch(token, jd, files)
			setResults(res.results)
			setBest(res.best_candidate)
		} catch (err: any) {
			setError(err?.response?.data?.detail || 'Batch analysis failed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div style={{ maxWidth: 1100, margin: '32px auto', fontFamily: 'Inter, system-ui, Arial' }}>
			<header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<h2>HR Dashboard</h2>
				<div>
					<span style={{ marginRight: 12 }}>{user?.email}</span>
					<button onClick={logout}>Logout</button>
				</div>
			</header>
			<p><Link to="/">Home</Link></p>

			<div style={{ display: 'grid', gap: 16 }}>
				<label>Job Description</label>
				<textarea value={jd} onChange={(e) => setJd(e.target.value)} rows={8} style={{ width: '100%', padding: 8 }} />
				<label>Upload Resumes (PDF, multiple)</label>
				<input multiple type="file" accept="application/pdf" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
				<button disabled={loading || files.length === 0 || !jd} onClick={onAnalyze}>{loading ? 'Analyzing...' : 'Analyze All'}</button>
				{error && <div style={{ color: 'red' }}>{error}</div>}

				{results.length > 0 && (
					<div style={{ marginTop: 16 }}>
						<h3>Ranking</h3>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<thead>
								<tr>
									<th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>#</th>
									<th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Filename</th>
									<th style={{ textAlign: 'right', borderBottom: '1px solid #ddd', padding: 8 }}>ATS Score</th>
									<th style={{ textAlign: 'right', borderBottom: '1px solid #ddd', padding: 8 }}>Keyword Match</th>
									<th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Summary</th>
								</tr>
							</thead>
							<tbody>
								{results.map((r, idx) => (
									<tr key={r.filename} style={{ background: best === r.filename ? '#f0fff4' : undefined }}>
										<td style={{ padding: 8 }}>{idx + 1}</td>
										<td style={{ padding: 8 }}>{r.filename}</td>
										<td style={{ padding: 8, textAlign: 'right' }}>{(r.score * 100).toFixed(1)}%</td>
										<td style={{ padding: 8, textAlign: 'right' }}>{(r.keyword_match * 100).toFixed(1)}%</td>
										<td style={{ padding: 8 }}>{r.summary}</td>
									</tr>
								))}
							</tbody>
						</table>
						{best && <p style={{ marginTop: 8 }}><strong>Best Candidate:</strong> {best}</p>}
					</div>
				)}
			</div>
		</div>
	)
}
