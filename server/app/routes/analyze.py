from typing import List
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from ..schemas import ATSResult, BatchATSResponse
from ..utils.pdf import extract_text_from_pdf
from ..ats import compute_ats_score, summarize_result
from ..core.security import get_current_user

router = APIRouter()


@router.post("/single", response_model=ATSResult)
async def analyze_single(
	jd_text: str = Form(...),
	file: UploadFile = File(...),
	user=Depends(get_current_user),
):
	if not file.filename.lower().endswith(".pdf"):
		raise HTTPException(status_code=400, detail="Only PDF resumes are supported")
	content = await file.read()
	resume_text = extract_text_from_pdf(bytes(content))
	score, coverage = compute_ats_score(jd_text, resume_text)
	return ATSResult(
		filename=file.filename,
		score=round(score, 4),
		keyword_match=round(coverage, 4),
		summary=summarize_result(score, coverage),
	)


@router.post("/batch", response_model=BatchATSResponse)
async def analyze_batch(
	jd_text: str = Form(...),
	files: List[UploadFile] = File(...),
	user=Depends(get_current_user),
):
	results: List[ATSResult] = []
	for uf in files:
		if not uf.filename.lower().endswith(".pdf"):
			continue
		content = await uf.read()
		resume_text = extract_text_from_pdf(bytes(content))
		score, coverage = compute_ats_score(jd_text, resume_text)
		results.append(
			ATSResult(
				filename=uf.filename,
				score=round(score, 4),
				keyword_match=round(coverage, 4),
				summary=summarize_result(score, coverage),
			)
		)
	# determine best candidate
	best = max(results, key=lambda r: r.score).filename if results else None
	# sort results by score descending
	results.sort(key=lambda r: r.score, reverse=True)
	return BatchATSResponse(results=results, best_candidate=best)
