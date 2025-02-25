from django.urls import path
from .views import (
    ConversationListAPIView,
    ConversationDetailAPIView,
    NewConversationAPIView,
    SendMessageAPIView,
    ConversationDeleteAPIView,  # Добавяме новия изглед за изтриване
    ConversationRenameAPIView  # <--- Добави този импорт
)

urlpatterns = [
    path('conversations/<int:conversation_id>/rename/', ConversationRenameAPIView.as_view(), name='conversation_rename'),
    path('conversations/', ConversationListAPIView.as_view(), name='conversation_list'),
    path('conversations/<int:conversation_id>/', ConversationDetailAPIView.as_view(), name='conversation_detail'),
    path('conversations/new/', NewConversationAPIView.as_view(), name='new_conversation'),
    path('conversations/<int:conversation_id>/send/', SendMessageAPIView.as_view(), name='send_message'),
    path('conversations/send/', SendMessageAPIView.as_view(), name='send_message_no_id'),
    path('conversations/<int:conversation_id>/delete/', ConversationDeleteAPIView.as_view(), name='conversation_delete'),  # Нов маршрут
]
