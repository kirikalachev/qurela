from django.urls import path
from .views import edit_post
from . import views

urlpatterns = [
    path('home_forum', views.post_list, name='post_list'),
    path('create/', views.create_post, name='create_post'),
    path('upvote/<int:post_id>/', views.upvote_post, name='upvote_post'),
    path('downvote/<int:post_id>/', views.downvote_post, name='downvote_post'),
    path('comment/<int:post_id>/', views.add_comment, name='add_comment'),
    path('save/<int:post_id>/', views.save_post, name='save_post'),
    path('my_posts/', views.user_posts, name='user_posts'),
    path('post/edit/<int:post_id>/', edit_post, name='edit_post'),
    path('post/<int:post_id>/', views.post_detail, name='post_detail'),
]