import requests

url = "http://127.0.0.1:8000/api/v1/analyze-gap"
files = {'resume_file': ('resume.txt', b'python developer with 3 years experience. javascript, react.')}
data = {'jd_text': 'Looking for a backend engineer with Python and AWS experience.'}
headers = {'Authorization': 'Bearer test_token'} # Might fail auth if not mocked

response = requests.post(url, files=files, data=data, headers=headers)
print(response.status_code, response.text)
