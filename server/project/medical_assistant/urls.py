from django.urls import path
from .views import conversation_list, conversation_detail, new_conversation, send_message
from . import views
from .views import search_articles

urlpatterns = [
    path('assistant', views.assistant, name="assistant"),
    path('conversation_list/', conversation_list, name='conversation_list'),
    path('conversation/<int:conversation_id>/', conversation_detail, name='conversation_detail'),
    path('new/', new_conversation, name='new_conversation'),
    path('conversation/<int:conversation_id>/send/', send_message, name='send_message'),  # For existing conversations
    path('conversation/send/', send_message, name='send_message_no_id'),  # NEW route for new conversations
    path("search/", search_articles, name="search_articles"),
]

