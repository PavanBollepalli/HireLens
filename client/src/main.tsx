import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Login from './pages/Login'
import Signup from './pages/Signup'
import JobSeekerDashboard from './pages/JobSeekerDashboard'
import HRDashboard from './pages/HRDashboard'
import { AuthProvider, ProtectedRoute } from './state/auth'
import './index.css'

const router = createBrowserRouter([
	{ path: '/', element: <App /> },
	{ path: '/login', element: <Login /> },
	{ path: '/signup', element: <Signup /> },
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
