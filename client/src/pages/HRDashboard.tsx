import { useState } from 'react'
import { useAuth } from '../state/auth'
import { analyzeBatch } from '../lib/api'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

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
		<div className="mx-auto max-w-6xl px-4 py-6">
			<header className="flex items-center justify-between py-2">
				<div className="flex items-center gap-3">
					<Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
					<span className="text-muted-foreground">/</span>
					<span className="font-medium">HR</span>
				</div>
				<div className="flex items-center gap-3 text-sm">
					<span className="text-muted-foreground">{user?.email}</span>
					<Button variant="outline" onClick={logout}>Logout</Button>
				</div>
			</header>

			<Card>
				<CardHeader>
					<CardTitle>Batch rank resumes</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<label className="text-sm" htmlFor="jd">Job Description</label>
						<Textarea id="jd" value={jd} onChange={(e) => setJd(e.target.value)} rows={8} placeholder="Paste the job description here" />
					</div>
					<div className="space-y-2">
						<label className="text-sm" htmlFor="resumes">Upload Resumes (PDF, multiple)</label>
						<input id="resumes" multiple className="block w-full text-sm" type="file" accept="application/pdf" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
					</div>
					<Button disabled={loading || files.length === 0 || !jd} onClick={onAnalyze}>{loading ? 'Analyzing…' : 'Analyze All'}</Button>
					{error && <div className="text-sm text-red-600" role="alert">{error}</div>}

					{results.length > 0 && (
						<div className="overflow-x-auto rounded-md border">
							<table className="w-full text-sm">
								<thead className="bg-muted/50">
									<tr className="text-left">
										<th className="px-3 py-2">#</th>
										<th className="px-3 py-2">Filename</th>
										<th className="px-3 py-2 text-right">ATS Score</th>
										<th className="px-3 py-2 text-right">Keyword Match</th>
										<th className="px-3 py-2">Summary</th>
									</tr>
								</thead>
								<tbody>
									{results.map((r, idx) => (
										<tr key={r.filename} className={best === r.filename ? 'bg-green-50' : ''}>
											<td className="px-3 py-2">{idx + 1}</td>
											<td className="px-3 py-2">{r.filename}</td>
											<td className="px-3 py-2 text-right">{(r.score * 100).toFixed(1)}%</td>
											<td className="px-3 py-2 text-right">{(r.keyword_match * 100).toFixed(1)}%</td>
											<td className="px-3 py-2">{r.summary}</td>
										</tr>
									))}
								</tbody>
							</table>
							{best && <div className="p-3 text-sm">Best Candidate: <span className="font-medium">{best}</span></div>}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
