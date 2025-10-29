from typing import BinaryIO, Union
from io import BytesIO
from PyPDF2 import PdfReader


def extract_text_from_pdf(file_obj: Union[BinaryIO, bytes]) -> str:
	if isinstance(file_obj, bytes):
		file_obj = BytesIO(file_obj)
	reader = PdfReader(file_obj)
	texts = []
	for page in reader.pages:
		try:
			texts.append(page.extract_text() or "")
		except Exception:
			continue
	return "\n".join(texts)
