from django.shortcuts import render
from itertools import combinations
import re
import spacy
import requests

nlp = spacy.load("en_core_web_sm")

WHO_API_BASE_URL = "http://apps.who.int/gho/athena/api/"

def fetch_who_data(query):
    base_url = "https://api.who.int/data"
    params = {"filter": f"diseases:{query}"}
    try:
        response = requests.get(base_url, params=params, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from WHO API: {e}")
        return None

def get_ngrams(doc, n):
    tokens = [token for token in doc if token.is_alpha]
    return [tokens[i:i+n] for i in range(len(tokens)-n+1)]

def contains_quotes(user_input):
    return bool(re.search(r'["\'].*?["\']', user_input))

def extract_quotes(user_input):
    return re.findall(r'["\'](.*?)["\']', user_input)

def fetch_indicators():
    response = requests.get(f"{WHO_API_BASE_URL}GHO?format=json")
    if response.status_code == 200:
        indicators = response.json()["dimension"][0]["code"]
        return {item["display"]: item["code"] for item in indicators}
    else:
        print("Error fetching indicators")
        return {}

# Cache indicators for quicker lookup
indicators = fetch_indicators()

# WHO API Query
def query_who_api(indicator_code):
    url = f"{WHO_API_BASE_URL}GHO/{indicator_code}?format=json"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error querying WHO API: {e}")
        return {"error": "No data found or API error"}

# Format WHO API response
def format_response(api_data):
    try:
        data_points = api_data["fact"]
        results = []
        for point in data_points:
            region = point.get("dim", {}).get("REGION", "Unknown")
            year = point.get("dim", {}).get("YEAR", "Unknown")
            value = point.get("value", "N/A")
            results.append(f"Region: {region}, Year: {year}, Value: {value}")
        return "\n".join(results)
    except KeyError:
        return "No data available in the response"

# Parse question and extract indicator code
def parse_question(user_input):
    doc = nlp(user_input)
    keywords = [token.text.lower() for token in doc if token.is_alpha]

    for keyword in keywords:
        for display, code in indicators.items():
            if keyword in display.lower():
                return code
    return None

document_summaries = {
    "Coffee is linked to a lower risk of certain diseases, including heart disease and cancer.",
    "Tea has antioxidants that can help with mental clarity and relaxation.",
    "Exercise is essential for cardiovascular health and weight management.",
    "A balanced diet with fruits and vegetables is key to long-term health."
}

Errors = {
    
}

def summarize_document(text):
    return "This is a summary of the input document." 

def search_documents(user_input):
  """
  Searches WHO data API for information relevant to the user query.

  Args:
      user_input (str): The user's search query.

  Returns:
      tuple: A tuple containing the best matching document summary and its similarity score, 
              or ("No relevant information found.", 0) if no relevant data is found.
  """
  api_data = fetch_who_data(user_input)

  if not api_data:
    return "No relevant information found.", 0

  best_match = None
  highest_similarity = 0

  # Explore different search parameters depending on WHO data API structure
  # This example searches for "diseases" and "risk_factors" fields
  for document in api_data.get("results", []):
    doc_summary = document.get("description") or document.get("risk_factors")
    if not doc_summary:
      continue

    doc_nlp = nlp(doc_summary)
    user_nlp = nlp(user_input)

    similarity = user_nlp.similarity(doc_nlp)
    if similarity > highest_similarity:
      highest_similarity = similarity
      best_match = doc_summary

  # Handle case where no relevant data is found
  if not best_match:
    return "No relevant information found.", 0

  return best_match, highest_similarity

def detect_intent(user_input):
    doc = nlp(user_input)

    summarize_token = nlp("summarize")

    # Example rules for detecting intent (can be extended with more rules or a trained classifier)
    if any([token.lemma_ in ["summarize", "summary", "shorten", "condense"] for token in doc]):
        return "summarize"

    highest_similarity = 0
    for n in [1, 2, 3]:
        ngrams = get_ngrams(doc, n)
        for ngram in ngrams:
            ngram_text = " ".join([token.text for token in ngram])
            ngram_doc = nlp(ngram_text)
            similarity_score = ngram_doc.similarity(summarize_token)
            if similarity_score > highest_similarity:
                highest_similarity = similarity_score
    
    if highest_similarity >= 0.8 and contains_quotes(user_input):
        return "summarize"

    

    if user_input.lower().startswith(("what", "how", "does", "can", "is")):
        return "search"
    elif any(token.text.lower() in ["what", "how", "does", "can", "is"] for token in doc):
        return "search"

    return "search"

def assistant(request):
    if request.method == "POST":
        user_input = request.POST.get('request')

        intent = detect_intent(user_input)

        if intent == "search":
            best_match, similarity = search_documents(user_input)
            context = {
                'intent': 'search',
                'best_match': best_match,
                'similarity': similarity,
            }
        elif intent == "summarize":
            summary = summarize_document(user_input)
            context = {
                'intent': 'summarize',
                'summary': summary,
            }
        return render(request, "medical_assistant/assistant.html", context)
    return render(request, "medical_assistant/assistant.html")