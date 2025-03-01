from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from medical_assistant.serializers import ConversationSerializer, MessageSerializer
from django.shortcuts import get_object_or_404
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
import json
import requests
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Conversation, Message
from django.shortcuts import render
from django.db.models import Count
import re
import nltk
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
from googletrans import Translator
import spacy
nlp = spacy.load("en_core_web_sm")  # Load the spaCy model


WHO_API_BASE_URL = "https://apps.who.int/gho/athena/api/"

class ConversationRenameAPIView(APIView):
    """Rename a specific conversation."""
    permission_classes = [IsAuthenticated]

    def patch(self, request, conversation_id):
        conversation = get_object_or_404(Conversation, id=conversation_id, user=request.user)
        new_name = request.data.get('name')

        if not new_name:
            return Response({'error': 'New name is required'}, status=status.HTTP_400_BAD_REQUEST)

        conversation.name = new_name
        conversation.save()

        return Response({'message': 'Conversation renamed successfully'}, status=status.HTTP_200_OK)


class ConversationDeleteAPIView(APIView):
    """Delete a specific conversation."""
    permission_classes = [IsAuthenticated]

    def delete(self, request, conversation_id):
        conversation = get_object_or_404(Conversation, id=conversation_id, user=request.user)
        conversation.delete()  # Изтрива кореспонденцията
        return Response({'message': 'Conversation deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


class ConversationListAPIView(APIView):
    """Retrieve all conversations for the authenticated user."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        conversations = Conversation.objects.filter(user=request.user).order_by('-created_at')
        serializer = ConversationSerializer(conversations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ConversationDetailAPIView(APIView):
    """Retrieve messages in a specific conversation."""
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        conversation = get_object_or_404(Conversation, id=conversation_id, user=request.user)
        serializer = MessageSerializer(conversation.messages.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class NewConversationAPIView(APIView):
    """Create a new conversation."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        conversation = Conversation.objects.create(user=request.user)
        return Response({'message': 'New conversation created', 'conversation_id': conversation.id}, status=status.HTTP_201_CREATED)


class SendMessageAPIView(APIView):
    """Send a message in an existing or new conversation."""
    permission_classes = [IsAuthenticated]

    def post(self, request, conversation_id=None):
        try:
            data = json.loads(request.body)
            user_message = data.get('message')
            mode = data.get('mode', 'default')  # Optional mode

            if not user_message:
                return Response({'error': 'Message cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)

            if conversation_id:
                conversation = get_object_or_404(Conversation, id=conversation_id, user=request.user)
            else:
                conversation = Conversation.objects.create(user=request.user)

            # Save user message
            Message.objects.create(conversation=conversation, sender='user', text=user_message)

            # --- Process user input to generate a real response ---
            best_category = detect_category(user_message)
            main_title = extract_title(user_message)

            if best_category:
                results = hybrid_search(user_message, best_category)
                if results:
                    bot_response = {
                        "main_title": main_title,
                        "category": best_category,
                        "results": results,
                        "query": user_message
                    }
                else:
                    bot_response = {
                        "main_title": main_title,
                        "category": best_category,
                        "results": [],
                        "query": user_message,
                        "error": "No relevant results found for your query."
                    }
            else:
                bot_response = {
                    "main_title": main_title,
                    "category": None,
                    "results": [],
                    "query": user_message,
                    "error": "No relevant category found for your query."
                }

            # Save bot response
            Message.objects.create(conversation=conversation, sender='bot', text=json.dumps(bot_response))

            return Response({'conversation_id': conversation.id, 'response': bot_response}, status=status.HTTP_200_OK)

        except json.JSONDecodeError:
            return Response({'error': 'Invalid JSON data'}, status=status.HTTP_400_BAD_REQUEST)




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


def extract_title(query):
    """
    Extracts a short title from a user query using spaCy noun chunking.
    (Ensure you have initialized 'nlp' with your spaCy model.)
    """
    doc = nlp(query)
    noun_chunks = list(doc.noun_chunks)
    if noun_chunks:
        title = noun_chunks[-1].text
        if title.lower().startswith("the "):
            title = title[4:]
        return title.strip()
    return query.strip()


def extract_snippet_sumy(document, num_sentences=3, snippet_length=600):
    """
    Use Sumy to summarize the document.
    - num_sentences: Number of sentences to include in the summary.
    - snippet_length: Maximum length of the snippet.
    """
    # Clean the document
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