from django.urls import path
from .views import (
    conversation_list,
    conversation_detail,
    new_conversation,
    send_message,
    search_articles
)

urlpatterns = [
    path('conversation_list/', conversation_list, name='conversation_list'),
    path('conversation/<int:conversation_id>/', conversation_detail, name='conversation_detail'),
    path('new/', new_conversation, name='new_conversation'),
    path('conversation/<int:conversation_id>/send/', send_message, name='send_message'),
    path('conversation/send/', send_message, name='send_message_no_id'),
    path("search/", search_articles, name="search_articles"),
]