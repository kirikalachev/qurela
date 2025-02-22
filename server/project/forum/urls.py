from django.urls import path
from . import views

urlpatterns = [
    path("posts/", views.post_list, name="post_list"),
    path("posts/<int:post_id>/", views.post_detail, name="post_detail"),
    path("posts/<int:post_id>/save/", views.save_post, name="save_post"),
    path("my_posts/", views.user_posts, name="user_posts"),
    path("posts/<int:post_id>/upvote/", views.upvote_post, name="upvote_post"),
    path("posts/<int:post_id>/downvote/", views.downvote_post, name="downvote_post"),
    path("posts/<int:post_id>/comment/", views.add_comment, name="add_comment"),
]
