import { Link } from 'react-router-dom'
import { useAuth } from './state/auth'
import { Button } from './components/ui/button'
import { ArrowRight, FileText, Users, Sparkles } from 'lucide-react'

export default function App() {
	const { user } = useAuth()
	return (
		<div className="min-h-screen flex flex-col">
			<header className="border-b">
				<div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
					<Link to="/" className="inline-flex items-center gap-2 font-semibold text-lg">
						<Sparkles className="h-5 w-5" /> HireLens
					</Link>
					<nav className="flex items-center gap-3">
						<Link to="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link>
						<Link to="#how" className="text-sm text-muted-foreground hover:text-foreground">How it works</Link>
						{user ? (
							<Link to={user.role === 'hr' ? '/hr' : '/job-seeker'}>
								<Button size="sm">Open Dashboard</Button>
							</Link>
						) : (
							<>
								<Link to="/signup">
									<Button variant="outline" size="sm">Sign Up</Button>
								</Link>
								<Link to="/login">
									<Button size="sm">Login</Button>
								</Link>
							</>
						)}
					</nav>
				</div>
			</header>

			<main className="flex-1">
				<section className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
					<div>
						<h1 className="text-4xl md:text-5xl font-bold tracking-tight">ATS Resume Analyzer for Job Seekers and HR</h1>
						<p className="mt-4 text-muted-foreground text-lg">Paste a job description, upload resume(s), and get instant ATS scores, keyword coverage, and ranked candidates.</p>
						<div className="mt-6 flex flex-wrap gap-3">
							<Link to="/signup"><Button className="gap-2">Get Started <ArrowRight className="h-4 w-4" /></Button></Link>
							<Link to="#features"><Button variant="outline">Learn More</Button></Link>
						</div>
					</div>
					<div className="rounded-lg border bg-card p-6">
						<div className="aspect-video rounded-md bg-muted flex items-center justify-center text-muted-foreground">Preview</div>
					</div>
				</section>

				<section id="features" className="border-t">
					<div className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-3 gap-6">
						<div className="rounded-lg border p-6">
							<FileText className="h-6 w-6" />
							<h3 className="mt-3 font-semibold">Single Resume Analysis</h3>
							<p className="text-sm text-muted-foreground mt-2">Job seekers paste a JD and upload a PDF to get an ATS score and keyword match.</p>
						</div>
						<div className="rounded-lg border p-6">
							<Users className="h-6 w-6" />
							<h3 className="mt-3 font-semibold">HR Batch Ranking</h3>
							<p className="text-sm text-muted-foreground mt-2">Upload a folder of resumes and get a ranked table with the best candidate highlighted.</p>
						</div>
						<div className="rounded-lg border p-6">
							<Sparkles className="h-6 w-6" />
							<h3 className="mt-3 font-semibold">Fast & Accessible</h3>
							<p className="text-sm text-muted-foreground mt-2">Built with modern tooling, responsive design, and a11y-first components.</p>
						</div>
					</div>
				</section>

				<section id="how">
					<div className="mx-auto max-w-6xl px-4 py-16">
						<h2 className="text-2xl font-semibold">How it works</h2>
						<ol className="mt-4 grid md:grid-cols-3 gap-4">
							<li className="rounded-lg border p-4">Paste the Job Description</li>
							<li className="rounded-lg border p-4">Upload one or multiple PDF resumes</li>
							<li className="rounded-lg border p-4">View ATS scores, keyword match, and rankings</li>
						</ol>
					</div>
				</section>
			</main>

			<footer className="border-t">
				<div className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted-foreground">
					© {new Date().getFullYear()} HireLens
				</div>
			</footer>
		</div>
	)
}
