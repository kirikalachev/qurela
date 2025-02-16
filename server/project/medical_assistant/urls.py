from django.urls import path
from .views import assistant

urlpatterns = [
    path('assistant', assistant, name="assistant"),
]


# from django.urls import path, include
# from . import viewspip show spacy

# urlpatterns = [
#     path('assistant', views.assistant, name="assistant"),
# ]


