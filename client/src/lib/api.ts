import axios from 'axios'
import { User } from '../state/auth'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = axios.create({ baseURL: API_BASE })

export async function loginRequest(email: string, password: string) {
	const res = await api.post('/auth/login', { email, password })
	return res.data as { access_token: string; role: User['role']; user_email: string }
}

export async function analyzeSingle(token: string, jd: string, file: File) {
	const form = new FormData()
	form.append('jd_text', jd)
	form.append('file', file)
	const res = await api.post('/analyze/single', form, {
		headers: { Authorization: `Bearer ${token}` }
	})
	return res.data as { filename: string; score: number; keyword_match: number; summary: string }
}

export async function analyzeBatch(token: string, jd: string, files: File[]) {
	const form = new FormData()
	form.append('jd_text', jd)
	files.forEach(f => form.append('files', f))
	const res = await api.post('/analyze/batch', form, {
		headers: { Authorization: `Bearer ${token}` }
	})
	return res.data as { results: Array<{ filename: string; score: number; keyword_match: number; summary: string }>; best_candidate?: string }
}
