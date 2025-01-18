from django.shortcuts import render
from itertools import combinations
import re
import spacy
import requests
from difflib import SequenceMatcher

# Load SpaCy NLP model
nlp = spacy.load("en_core_web_sm")

WHO_API_BASE_URL = "http://apps.who.int/gho/athena/api/"

def get_ngrams(doc, n):
    tokens = [token for token in doc if token.is_alpha]
    return [tokens[i:i+n] for i in range(len(tokens)-n+1)]

def contains_quotes(user_input):
    return bool(re.search(r'["\'].*?["\']', user_input))

def similarity_score(a, b):
    return SequenceMatcher(None, a, b).ratio() * 100

def extract_and_filter_quotes(user_input):
    quoted = re.findall(r'["](.+?)["]', user_input)
    doc = nlp(user_input)
    filtered_tokens = []
    in_quote = False

    for token in doc:
        if token.text.startswith(('"', '“')):
            in_quote = not in_quote
            continue
        if not in_quote:
            filtered_tokens.append(token.text)
    filtered_input = " ".join(filtered_tokens).replace('  ', ' ').strip()
    return quoted, filtered_input

def question_prossesing(user_input):
    doc = nlp(user_input)
    # Check if the input ends with a question mark or starts with question words
    question_words = {"what", "why", "how", "when", "where", "who", "which", "whose", "whom"}
    is_question = any(token.lower_ in question_words for token in doc) or user_input.strip().endswith("?")
    
    # Extract keywords (nouns, verbs, and proper nouns)
    keywords = [token.text.lower() for token in doc if token.pos_ in {"NOUN", "PROPN", "VERB"} and not token.is_stop]
    
    return is_question, keywords
def summarize_document(text):
    return "This is a summary of the input document."

def detect_intent(user_input):
    if contains_quotes(user_input):
        quoted, filtered_input = extract_and_filter_quotes(user_input)
        quotedNLP = nlp(quoted)
        filtered_inputNLP = nlp(filtered_input)
        unigrams = [token.lemma_ for token in filtered_inputNLP]
        bigrams = get_ngrams(filtered_inputNLP, 2)
        ngrams = set(unigrams + bigrams)
        Sumkeywords = {"summarize", "summary", "shorten", "condense"}
        if sum(len(q.split()) for q in quoted) > 100:
            if any(max(similarity_score(ngram, keyword) for keyword in Sumkeywords) > 80 for ngram in ngrams):
                return "summarize"
        
    else:
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