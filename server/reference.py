from django.shortcuts import render
import requests
import spacy

# Load SpaCy NLP model
nlp = spacy.load("en_core_web_sm")

# WHO API Base URL
WHO_API_BASE_URL = "http://apps.who.int/gho/athena/api/"

# Fetch and cache available indicators
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
            # Placeholder: Add summarization functionality here if needed
            context = {
                'intent': 'summarize',
                'response': "This is a summary of the provided input."
            }
        else:
            # Default response
            context = {
                'intent': 'default',
                'response': "Sorry, I couldn't understand your query. Please try asking in a different way."
            }

        return render(request, "medical_assistant/assistant.html", context)

    # Render the assistant interface
    return render(request, "medical_assistant/assistant.html")