import { useState } from 'react'
import { useAuth } from '../state/auth'
import { analyzeSingle } from '../lib/api'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

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
		<div className="mx-auto max-w-5xl px-4 py-6">
			<header className="flex items-center justify-between py-2">
				<div className="flex items-center gap-3">
					<Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
					<span className="text-muted-foreground">/</span>
					<span className="font-medium">Job Seeker</span>
				</div>
				<div className="flex items-center gap-3 text-sm">
					<span className="text-muted-foreground">{user?.email}</span>
					<Button variant="outline" onClick={logout}>Logout</Button>
				</div>
			</header>

			<Card>
				<CardHeader>
					<CardTitle>Analyze your resume</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<label className="text-sm" htmlFor="jd">Job Description</label>
						<Textarea id="jd" value={jd} onChange={(e) => setJd(e.target.value)} rows={8} placeholder="Paste the job description here" />
					</div>
					<div className="space-y-2">
						<label className="text-sm" htmlFor="resume">Upload Resume (PDF)</label>
						<input id="resume" className="block w-full text-sm" type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
					</div>
					<Button disabled={loading || !file || !jd} onClick={onAnalyze}>{loading ? 'Analyzing…' : 'Analyze'}</Button>
					{error && <div className="text-sm text-red-600" role="alert">{error}</div>}
					{result && (
						<div className="rounded-md border p-4 space-y-1">
							<div className="text-sm text-muted-foreground">File</div>
							<div className="font-medium">{result.filename}</div>
							<div className="text-sm text-muted-foreground">ATS Score</div>
							<div className="font-semibold">{(result.score * 100).toFixed(1)}%</div>
							<div className="text-sm text-muted-foreground">Keyword Match</div>
							<div className="font-semibold">{(result.keyword_match * 100).toFixed(1)}%</div>
							<p className="text-sm text-muted-foreground mt-2">{result.summary}</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
