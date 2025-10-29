import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Login from './pages/Login'
import JobSeekerDashboard from './pages/JobSeekerDashboard'
import HRDashboard from './pages/HRDashboard'
import { AuthProvider, ProtectedRoute } from './state/auth'

const router = createBrowserRouter([
	{ path: '/', element: <App /> },
	{ path: '/login', element: <Login /> },
	{ path: '/job-seeker', element: (
		<ProtectedRoute role="job_seeker">
			<JobSeekerDashboard />
		</ProtectedRoute>
	) },
	{ path: '/hr', element: (
		<ProtectedRoute role="hr">
			<HRDashboard />
		</ProtectedRoute>
	) },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</React.StrictMode>
)
