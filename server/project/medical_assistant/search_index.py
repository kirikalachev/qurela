import os
import json
import numpy as np
import faiss
from nltk.tokenize import word_tokenize
from rank_bm25 import BM25Okapi
from sentence_transformers import SentenceTransformer

# Global dictionary to hold data and indexes for each category.
categories = {}

# Determine the base directory of your Django project.
# In this case, __file__ is in ...\project\medical_assistant, so two levels up is the 'project' folder.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Since your MayoScraper folder is located at the same level as your 'project' folder,
# we go one level up from BASE_DIR and then into MayoScraper/data.
data_dir = os.path.join(BASE_DIR, '..', 'MayoScraper', 'data')
data_dir = os.path.abspath(data_dir)  # Normalize the path

def load_category(category_name, filename):
    file_path = os.path.join(data_dir, filename)
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    # Assuming each JSON file is a list of articles with keys: "url", "title", "content"
    documents = [item['content'] for item in data]
    titles = [item['title'] for item in data]
    urls = [item['url'] for item in data]

    # Build a BM25 index on tokenized documents.
    tokenized_corpus = [word_tokenize(doc.lower()) for doc in documents]
    bm25 = BM25Okapi(tokenized_corpus)

    # Load an embedding model (using SentenceTransformer).
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    # Get embeddings for the documents.
    embeddings = embedding_model.encode(documents, convert_to_numpy=True)
    # Create a FAISS index.
    dimension = embeddings.shape[1]
    faiss_index = faiss.IndexFlatL2(dimension)
    faiss_index.add(embeddings)

    # Save all this into the categories dictionary under the given category name.
    categories[category_name] = {
        "bm25": bm25,
        "embedding_model": embedding_model,
        "faiss_index": faiss_index,
        "titles": titles,
        "urls": urls,
        "documents": documents
    }

# Iterate through all JSON files in the data_dir and load each as a separate category.
for filename in os.listdir(data_dir):
    if filename.endswith('.json'):
        category_name = os.path.splitext(filename)[0]  # e.g. 'diseases' from 'diseases.json'
        load_category(category_name, filename)