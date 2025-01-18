from django.shortcuts import render
import re
import spacy
import requests

# Load SpaCy NLP model
nlp = spacy.load("en_core_web_sm")

WHO_API_BASE_URL = "http://apps.who.int/gho/athena/api/"

def get_ngrams(doc, n):
    tokens = [token for token in doc if token.is_alpha]
    return [tokens[i:i+n] for i in range(len(tokens)-n+1)]

def contains_quotes(user_input):
    return bool(re.search(r'["\'].*?["\']', user_input))

def extract_quotes(user_input):
    return re.findall(r'["\'](.*?)["\']', user_input)

def summarize_document(text):
    return "This is a summary of the input document."

def is_nutrition_question(user_input):
    # Preprocess the input
    user_input = user_input.lower().strip()
    
    # Define nutrition-related keywords
    nutrition_keywords = {
        "calories", "protein", "vitamins", "minerals", "carbohydrates", 
        "fat", "fiber", "nutrients", "diet", "nutrition", "healthy foods", 
        "superfoods", "sugar", "cholesterol", "water intake", "hydration"
    }
    
    # Common question starters
    question_words = {"what", "how", "why", "is", "are", "does", "can"}
    
    # Tokenize the input by splitting on spaces
    words = set(re.findall(r'\b\w+\b', user_input))
    
    # Check for nutrition keywords in the input
    if nutrition_keywords & words:
        return True
    
    # Check if it starts with a question word and contains a nutrition term
    if any(user_input.startswith(q_word) for q_word in question_words):
        if nutrition_keywords & words:
            return True
    
    return False

# Fetch WHO indicators
def fetch_indicators():
    response = requests.get(f"{WHO_API_BASE_URL}GHO?format=json")
    if response.status_code == 200:
        try:
            # Safely navigate the JSON response structure
            indicators = response.json().get("dimension", [{}])[0].get("code", [])
            # Build the dictionary only for items with "display" and "code" keys
            return {
                item.get("display"): item.get("code")
                for item in indicators
                if "display" in item and "code" in item
            }
        except (KeyError, IndexError, TypeError) as e:
            print(f"Error parsing indicators data: {e}")
            return {}
    else:
        print("Error fetching indicators from WHO API")
        return {}

# Cache indicators for quicker lookup
indicators = fetch_indicators()

# Query WHO API
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

# Detect user intent
def detect_intent(user_input):
    doc = nlp(user_input)
    
    # Detect "summarize" intent
    if any(token.lemma_ in ["summarize", "summary", "shorten", "condense"] for token in doc):
        return "summarize"
    
    # Detect "search" intent (default for questions)
    if user_input.lower().startswith(("what", "how", "does", "can", "is")):
        return "search"
    elif any(token.text.lower() in ["what", "how", "does", "can", "is"] for token in doc):
        return "search"

    return "search"  # Default to search if unsure

# Django view function
def assistant(request):
    if request.method == "POST":
        user_input = request.POST.get('request')
        intent = detect_intent(user_input)

        if intent == "search":
            # Extract WHO indicator code from user input
            indicator_code = parse_question(user_input)
            if indicator_code:
                # Query the WHO API
                api_data = query_who_api(indicator_code)
                # Format the API response for the user
                response = format_response(api_data)
                context = {
                    'intent': 'search',
                    'response': response
                }
            else:
                # No matching WHO indicator found
                context = {
                    'intent': 'search',
                    'response': "Sorry, I couldn't find relevant health data for your query."
                }

        elif intent == "summarize":
            summary = summarize_document(user_input)
            context = {
                'intent': 'summarize',
                'summary': summary,
            }

        return render(request, "medical_assistant/assistant.html", context)

    # Render the assistant interface
    return render(request, "medical_assistant/assistant.html")