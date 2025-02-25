from django.urls import path
from .views import (
    ConversationListAPIView,
    ConversationDetailAPIView,
    NewConversationAPIView,
    SendMessageAPIView
)

urlpatterns = [
    path('conversations/', ConversationListAPIView.as_view(), name='conversation_list'),
    path('conversations/<int:conversation_id>/', ConversationDetailAPIView.as_view(), name='conversation_detail'),
    path('conversations/new/', NewConversationAPIView.as_view(), name='new_conversation'),
    path('conversations/<int:conversation_id>/send/', SendMessageAPIView.as_view(), name='send_message'),
    path('conversations/send/', SendMessageAPIView.as_view(), name='send_message_no_id'),
]
