from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import F
from .models import Post, Comment, SavedPost, Vote, Category
from .serializers import PostSerializer, CommentSerializer, SavedPostSerializer, VoteSerializer, CategorySerializer

# List all categories
@api_view(["GET"])
def category_list(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

# List posts, optionally filtered by category
@api_view(["GET", "POST"])
def post_list(request):
    if request.method == "GET":
        category_id = request.GET.get("category")  # Get category ID from query params
        posts = Post.objects.select_related("category").all()  # Use select_related for efficiency

        if category_id:
            posts = posts.filter(category__id=category_id)

        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Retrieve, update, or delete a post
@api_view(["GET", "PUT", "DELETE"])
def post_detail(request, post_id):
    post = get_object_or_404(Post.objects.select_related("category"), id=post_id)

    if request.method == "GET":
        serializer = PostSerializer(post)
        return Response(serializer.data)

    if request.method == "PUT":
        if post.author != request.user:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        serializer = PostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "DELETE":
        if post.author != request.user:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        post.delete()
        return Response({"message": "Post deleted"}, status=status.HTTP_204_NO_CONTENT)

# Fetch comments for a post
@api_view(["GET"])
def get_comments(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    comments = Comment.objects.filter(post=post).order_by("-created_at")
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)

# Add a comment to a post
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_comment(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(post=post, author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Save or remove a post from saved posts
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def save_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    saved_post, created = SavedPost.objects.get_or_create(user=request.user, post=post)

    if not created:
        saved_post.delete()
        return Response({"message": "Post removed from saved"}, status=status.HTTP_200_OK)

    return Response({"message": "Post saved"}, status=status.HTTP_201_CREATED)

# List user posts and saved posts
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_posts(request):
    published_posts = Post.objects.filter(author=request.user)
    saved_posts = SavedPost.objects.filter(user=request.user)

    return Response({
        "published_posts": PostSerializer(published_posts, many=True).data,
        "saved_posts": SavedPostSerializer(saved_posts, many=True).data,
    })

# Upvote a post
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upvote_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    existing_vote = Vote.objects.filter(user=request.user, post=post).first()

    if existing_vote:
        if existing_vote.vote_type == -1:
            Vote.objects.filter(user=request.user, post=post).update(vote_type=1)
            Post.objects.filter(id=post_id).update(upvotes=F("upvotes") + 1, downvotes=F("downvotes") - 1)
        elif existing_vote.vote_type == 1:
            existing_vote.delete()
            Post.objects.filter(id=post_id).update(upvotes=F("upvotes") - 1)
    else:
        Vote.objects.create(user=request.user, post=post, vote_type=1)
        Post.objects.filter(id=post_id).update(upvotes=F("upvotes") + 1)

    return Response({"message": "Upvote registered"}, status=status.HTTP_200_OK)

# Downvote a post
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def downvote_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    existing_vote = Vote.objects.filter(user=request.user, post=post).first()

    if existing_vote:
        if existing_vote.vote_type == 1:
            Vote.objects.filter(user=request.user, post=post).update(vote_type=-1)
            Post.objects.filter(id=post_id).update(upvotes=F("upvotes") - 1, downvotes=F("downvotes") + 1)
        elif existing_vote.vote_type == -1:
            existing_vote.delete()
            Post.objects.filter(id=post_id).update(downvotes=F("downvotes") - 1)
    else:
        Vote.objects.create(user=request.user, post=post, vote_type=-1)
        Post.objects.filter(id=post_id).update(downvotes=F("downvotes") + 1)

    return Response({"message": "Downvote registered"}, status=status.HTTP_200_OK)

# Get posts by category
@api_view(["GET"])
def posts_by_category(request, category_id):
    category = get_object_or_404(Category, id=category_id)
    posts = Post.objects.filter(category=category).select_related("category")
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)