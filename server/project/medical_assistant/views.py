from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Conversation, Message
from django.shortcuts import render
from django.db.models import Count
import re
import nltk
import spacy
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from nltk.tokenize import word_tokenize
import numpy as np
from .search_index import categories
from nltk.tokenize import sent_tokenize
from rank_bm25 import BM25Okapi
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer

# Load SpaCy NLP model
nlp = spacy.load("en_core_web_sm")

WHO_API_BASE_URL = "http://apps.who.int/gho/athena/api/"

from django.db.models import Count

@login_required
def conversation_list(request):
    conversations = Conversation.objects.filter(user=request.user).order_by('-created_at')
    return render(request, 'medical_assistant/conversation_list.html', {'conversations': conversations})

@login_required
def conversation_detail(request, conversation_id):
    conversation = get_object_or_404(Conversation, id=conversation_id, user=request.user)
    messages = conversation.messages.all().order_by('timestamp')
    return render(request, 'medical_assistant/conversation_detail.html', {'conversation': conversation, 'messages': messages})

@login_required
def new_conversation(request):
    return render(request, 'medical_assistant/conversation_detail.html', {'conversation': None, 'messages': []})

@login_required
def send_message(request, conversation_id=None):
    conversation = None

    if conversation_id:
        # If a conversation exists, get it
        conversation = get_object_or_404(Conversation, id=conversation_id, user=request.user)

    if request.method == 'POST':
        user_message = request.POST.get('message')

        if user_message:  # Only proceed if the user typed something
            if not conversation:
                # Create a new conversation if one doesn't exist
                conversation = Conversation.objects.create(user=request.user)

            # Save the user's message
            Message.objects.create(conversation=conversation, sender='user', text=user_message)
            
            # Generate a bot response
            Message.objects.create(conversation=conversation, sender='bot', text='Here is the response')

            return redirect('conversation_detail', conversation_id=conversation.id)

    return redirect('conversation_list')

# ///responses:///

def clean_document(document):
    """Remove navigation and promotional elements from the document text."""
    patterns = [
        r"Products\s+&\s+Services",
        r"A\s+Book:\s+Mayo\s+Clinic\s+Guide\s+to\s+\w+",
        r"A\s+Book:\s+Mayo\s+Clinic\s+on\s+\w+",
        r"Bath\s+Safety\s+and\s+Mobility\s+Products",
        r"Show\s+more\s+products",
        r"Enlarge\s+image",
        r"\bClose\b",
        r"from\s+Mayo\s+Clinic\s+Types",
        r"Types\s+Ankylosing\s+spondylitis\s+Gout\s+Juvenile\s+idiopathic",
    ]
    for pattern in patterns:
        document = re.sub(pattern, '', document, flags=re.IGNORECASE)
    # Remove extra whitespace and newlines
    document = " ".join(document.split())
    return document

# def extract_snippet(query, document, snippet_length=600):
#     """Extract a relevant snippet answering the query from the document."""
#     document = clean_document(document)
#     sentences = sent_tokenize(document)
#     if not sentences:
#         return document[:snippet_length]
#     query_tokens = query.lower().split()
#     tokenized_sentences = [sentence.lower().split() for sentence in sentences]
#     bm25 = BM25Okapi(tokenized_sentences)
#     sentence_scores = bm25.get_scores(query_tokens)
#     ranked_sentences = sorted(zip(sentences, sentence_scores), key=lambda x: x[1], reverse=True)[:3]
#     snippet = " ".join(sentence for sentence, score in ranked_sentences)
#     snippet = snippet[:snippet_length]
    
#     return snippet
# def extract_snippet_coherent(query, document, snippet_length=600):
#     """
#     Extract a coherent snippet from the document:
#     - Clean the document
#     - Tokenize into sentences
#     - Identify the most relevant sentence using BM25
#     - Expand to include neighboring sentences if they are similarly relevant
#     """
#     # Clean the document from extraneous navigation/promotional text
#     document = clean_document(document)
    
#     # Tokenize document into sentences
#     sentences = sent_tokenize(document)
#     if not sentences:
#         return document[:snippet_length]
    
#     # Tokenize the query
#     query_tokens = query.lower().split()
    
#     # Compute BM25 scores for each sentence
#     tokenized_sentences = [sentence.lower().split() for sentence in sentences]
#     bm25 = BM25Okapi(tokenized_sentences)
#     sentence_scores = bm25.get_scores(query_tokens)
    
#     # Find index of the most relevant sentence
#     best_index = max(range(len(sentence_scores)), key=lambda i: sentence_scores[i])
#     best_score = sentence_scores[best_index]
    
#     # Start with the best sentence
#     snippet_sentences = [sentences[best_index]]
    
#     # Optionally include the previous sentence if its score is significant
#     if best_index > 0 and sentence_scores[best_index - 1] > 0.5 * best_score:
#         snippet_sentences.insert(0, sentences[best_index - 1])
    
#     # Optionally include the next sentence if its score is significant
#     if best_index < len(sentences) - 1 and sentence_scores[best_index + 1] > 0.5 * best_score:
#         snippet_sentences.append(sentences[best_index + 1])
    
#     # Combine the selected sentences
#     snippet = " ".join(snippet_sentences)
    
#     # Trim to the desired snippet length
#     if len(snippet) > snippet_length:
#         snippet = snippet[:snippet_length].rsplit(" ", 1)[0]  # avoid cutting mid-word
    
#     return snippet

def extract_snippet_sumy(document, num_sentences=3, snippet_length=600):
    """
    Use Sumy to summarize the document.
    - num_sentences: Number of sentences to include in the summary.
    - snippet_length: Maximum length of the snippet.
    """
    # Clean the document (reuse your clean_document function)
    clean_text = clean_document(document)
    
    # Create a parser for the document
    parser = PlaintextParser.from_string(clean_text, Tokenizer("english"))
    
    # Choose a summarizer (LexRank is used here)
    summarizer = LexRankSummarizer()
    
    # Summarize the document
    summary = summarizer(parser.document, num_sentences)
    
    # Join the summary sentences into a snippet
    snippet = " ".join(str(sentence) for sentence in summary)
    
    # Optionally trim to the desired snippet_length
    if len(snippet) > snippet_length:
        snippet = snippet[:snippet_length].rsplit(" ", 1)[0]
    
    return snippet

def detect_category(query):
    """Find the most relevant category based on BM25 keyword search."""
    query_tokens = word_tokenize(query.lower())
    category_scores = {}
    for category, index_data in categories.items():
        bm25 = index_data["bm25"]
        score = sum(bm25.get_scores(query_tokens))
        category_scores[category] = score
    best_category = max(category_scores, key=category_scores.get)
    return best_category if category_scores[best_category] > 0 else None

def hybrid_search(query, category, top_n=5, bm25_weight=0.5, faiss_weight=0.5, score_threshold=3.0):
    """Retrieve top articles that strongly match the query using a hybrid approach."""
    index_data = categories[category]
    query_tokens = word_tokenize(query.lower())  
    bm25_scores = index_data["bm25"].get_scores(query_tokens)  
    bm25_top_n = np.argsort(bm25_scores)[::-1][:top_n]  
    query_embedding = np.array([index_data["embedding_model"].encode(query)]).astype("float32")  
    _, faiss_top_n = index_data["faiss_index"].search(query_embedding, top_n)  
    faiss_top_n = faiss_top_n[0]  
    combined_scores = {}
    for i in bm25_top_n:
        combined_scores[i] = bm25_scores[i] * bm25_weight
    for i in faiss_top_n:
        combined_scores[i] = combined_scores.get(i, 0) + faiss_weight
    ranked_results = sorted(combined_scores.items(), key=lambda x: x[1], reverse=True)
    search_results = []
    seen_titles = set()
    for idx, score in ranked_results:
        if score < score_threshold:
            continue
        document_text = index_data["documents"][idx]
        title = index_data["titles"][idx]
        if title in seen_titles:
            continue
        seen_titles.add(title)
        search_results.append({
            "title": title,
            "url": index_data["urls"][idx],
            "snippet": extract_snippet_sumy(document_text, num_sentences=3, snippet_length=600),
            "score": round(score, 2)
        })
    return search_results

@csrf_exempt
def search_articles(request):
    results = []
    best_category = None
    query = ""
    if request.method == "POST":
        try:
            if request.content_type == "application/json":
                data = json.loads(request.body.decode('utf-8'))
                query = data.get("query", "")
            else:
                query = request.POST.get("query", "")
            if not query:
                return JsonResponse({"error": "Query is required"}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        best_category = detect_category(query)
        if not best_category:
            return JsonResponse({"error": "No relevant category found"}, status=400)
        results = hybrid_search(query, best_category)
    return render(request, "search_form.html", {
        "category": best_category,
        "results": results,
        "query": query
    })

# # ///responses:///

# def get_ngrams(doc, n):
#     tokens = [token for token in doc if token.is_alpha]
#     return [tokens[i:i+n] for i in range(len(tokens)-n+1)]

# def contains_quotes(user_input):
#     return bool(re.search(r'["\'].*?["\']', user_input))

# def extract_quotes(user_input):
#     return re.findall(r'["\'](.*?)["\']', user_input)

# def summarize_document(text):
#     return "This is a summary of the input document."

# def is_nutrition_question(user_input):
#     # Preprocess the input
#     user_input = user_input.lower().strip()
    
#     # Define nutrition-related keywords
#     nutrition_keywords = {
#         "calories", "protein", "vitamins", "minerals", "carbohydrates", 
#         "fat", "fiber", "nutrients", "diet", "nutrition", "healthy foods", 
#         "superfoods", "sugar", "cholesterol", "water intake", "hydration"
#     }
    
#     # Common question starters
#     question_words = {"what", "how", "why", "is", "are", "does", "can"}
    
#     # Tokenize the input by splitting on spaces
#     words = set(re.findall(r'\b\w+\b', user_input))
    
#     # Check for nutrition keywords in the input
#     if nutrition_keywords & words:
#         return True
    
#     # Check if it starts with a question word and contains a nutrition term
#     if any(user_input.startswith(q_word) for q_word in question_words):
#         if nutrition_keywords & words:
#             return True
    
#     return False

# # Fetch WHO indicators
# def fetch_indicators():
#     response = requests.get(f"{WHO_API_BASE_URL}GHO?format=json")
#     if response.status_code == 200:
#         try:
#             # Safely navigate the JSON response structure
#             indicators = response.json().get("dimension", [{}])[0].get("code", [])
#             # Build the dictionary only for items with "display" and "code" keys
#             return {
#                 item.get("display"): item.get("code")
#                 for item in indicators
#                 if "display" in item and "code" in item
#             }
#         except (KeyError, IndexError, TypeError) as e:
#             print(f"Error parsing indicators data: {e}")
#             return {}
#     else:
#         print("Error fetching indicators from WHO API")
#         return {}

# # Cache indicators for quicker lookup
# indicators = fetch_indicators()

# # Query WHO API
# def query_who_api(indicator_code):
#     url = f"{WHO_API_BASE_URL}GHO/{indicator_code}?format=json"
#     try:
#         response = requests.get(url, timeout=10)
#         response.raise_for_status()
#         return response.json()
#     except requests.exceptions.RequestException as e:
#         print(f"Error querying WHO API: {e}")
#         return {"error": "No data found or API error"}

# # Format WHO API response
# def format_response(api_data):
#     try:
#         data_points = api_data["fact"]
#         results = []
#         for point in data_points:
#             region = point.get("dim", {}).get("REGION", "Unknown")
#             year = point.get("dim", {}).get("YEAR", "Unknown")
#             value = point.get("value", "N/A")
#             results.append(f"Region: {region}, Year: {year}, Value: {value}")
#         return "\n".join(results)
#     except KeyError:
#         return "No data available in the response"

# # Parse question and extract indicator code
# def parse_question(user_input):
#     doc = nlp(user_input)
#     keywords = [token.text.lower() for token in doc if token.is_alpha]

#     for keyword in keywords:
#         for display, code in indicators.items():
#             if keyword in display.lower():
#                 return code
#     return None

# # Detect user intent
# def detect_intent(user_input):
#     doc = nlp(user_input)
    
#     # Detect "summarize" intent
#     if any(token.lemma_ in ["summarize", "summary", "shorten", "condense"] for token in doc):
#         return "summarize"
    
#     # Detect "search" intent (default for questions)
#     if user_input.lower().startswith(("what", "how", "does", "can", "is")):
#         return "search"
#     elif any(token.text.lower() in ["what", "how", "does", "can", "is"] for token in doc):
#         return "search"

#     return "search"  # Default to search if unsure

# # Django view function
# def assistant(request):
#     if request.method == "POST":
#         user_input = request.POST.get('request')
#         intent = detect_intent(user_input)

#         if intent == "search":
#             # Extract WHO indicator code from user input
#             indicator_code = parse_question(user_input)
#             if indicator_code:
#                 # Query the WHO API
#                 api_data = query_who_api(indicator_code)
#                 # Format the API response for the user
#                 response = format_response(api_data)
#                 context = {
#                     'intent': 'search',
#                     'response': response
#                 }
#             else:
#                 # No matching WHO indicator found
#                 context = {
#                     'intent': 'search',
#                     'response': "Sorry, I couldn't find relevant health data for your query."
#                 }

#         elif intent == "summarize":
#             summary = summarize_document(user_input)
#             context = {
#                 'intent': 'summarize',
#                 'summary': summary,
#             }

#         return render(request, "medical_assistant/assistant.html", context)

#     # Render the assistant interface
#     return render(request, "medical_assistant/assistant.html")