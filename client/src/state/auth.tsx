import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'

export type User = { email: string; role: 'job_seeker' | 'hr' }

type AuthContextType = {
	user: User | null
	token: string | null
	login: (token: string, user: User) => void
	logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
	const [user, setUser] = useState<User | null>(() => {
		const raw = localStorage.getItem('user')
		return raw ? JSON.parse(raw) as User : null
	})

	useEffect(() => {
		if (token) localStorage.setItem('token', token)
		else localStorage.removeItem('token')
	}, [token])
	useEffect(() => {
		if (user) localStorage.setItem('user', JSON.stringify(user))
		else localStorage.removeItem('user')
	}, [user])

	const value = useMemo(() => ({
		user,
		token,
		login: (t: string, u: User) => { setToken(t); setUser(u) },
		logout: () => { setToken(null); setUser(null) }
	}), [token, user])

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}

export function ProtectedRoute({ children, role }: { children: React.ReactNode; role: User['role'] }) {
	const { user } = useAuth()
	if (!user) return <Navigate to="/login" replace />
	if (role && user.role !== role) return <Navigate to="/" replace />
	return <>{children}</>
}
