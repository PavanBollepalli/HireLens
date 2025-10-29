from typing import List, Tuple
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def normalize_text(text: str) -> str:
	text = text.lower()
	text = re.sub(r"[^a-z0-9\s]", " ", text)
	text = re.sub(r"\s+", " ", text).strip()
	return text


def extract_keywords(text: str, top_k: int = 30) -> List[str]:
	normalized = normalize_text(text)
	words = [w for w in normalized.split(" ") if len(w) > 2]
	# naive frequency-based keywords
	freq = {}
	for w in words:
		freq[w] = freq.get(w, 0) + 1
	return [w for w, _ in sorted(freq.items(), key=lambda kv: kv[1], reverse=True)[:top_k]]


def compute_ats_score(job_description: str, resume_text: str) -> Tuple[float, float]:
	jd = normalize_text(job_description)
	cv = normalize_text(resume_text)
	# TF-IDF cosine similarity
	vectorizer = TfidfVectorizer(stop_words="english")
	try:
		X = vectorizer.fit_transform([jd, cv])
		cos = cosine_similarity(X[0], X[1])[0][0]
	except ValueError:
		cos = 0.0
	# keyword coverage
	jd_keywords = set(extract_keywords(jd, top_k=40))
	coverage = 0.0
	if jd_keywords:
		covered = sum(1 for k in jd_keywords if k in cv)
		coverage = covered / len(jd_keywords)
	# weighted score
	score = 0.7 * cos + 0.3 * coverage
	return float(score), float(coverage)


def summarize_result(score: float, coverage: float) -> str:
	if score > 0.8:
		level = "Excellent fit"
	elif score > 0.6:
		level = "Strong fit"
	elif score > 0.4:
		level = "Moderate fit"
	else:
		level = "Low fit"
	return f"{level}. Cosine similarity and keyword coverage indicate a {int(coverage*100)}% keyword match."
