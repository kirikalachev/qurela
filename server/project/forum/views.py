from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import F
from .models import Post, Comment, SavedPost, Vote, Category
from .serializers import PostSerializer, CommentSerializer, SavedPostSerializer, VoteSerializer, CategorySerializer

@api_view(["GET"])
def category_list(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

# List all posts or create a new post
@api_view(["GET", "POST"])
def post_list(request):
    if request.method == "GET":
        posts = Post.objects.all()
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
    post = get_object_or_404(Post, id=post_id)

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
    # Проверка дали потребителят е правилен
    print(f"User: {request.user}")
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
            post.downvotes = F("downvotes") - 1
            post.upvotes = F("upvotes") + 1
            existing_vote.vote_type = 1
            existing_vote.save()
        elif existing_vote.vote_type == 1:
            post.upvotes = F("upvotes") - 1
            existing_vote.delete()
    else:
        Vote.objects.create(user=request.user, post=post, vote_type=1)
        post.upvotes = F("upvotes") + 1

    post.save()
    return Response({"message": "Upvote registered"}, status=status.HTTP_200_OK)

# Downvote a post
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def downvote_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    existing_vote = Vote.objects.filter(user=request.user, post=post).first()

    if existing_vote:
        if existing_vote.vote_type == 1:
            post.upvotes = F("upvotes") - 1
            post.downvotes = F("downvotes") + 1
            existing_vote.vote_type = -1
            existing_vote.save()
        elif existing_vote.vote_type == -1:
            post.downvotes = F("downvotes") - 1
            existing_vote.delete()
    else:
        Vote.objects.create(user=request.user, post=post, vote_type=-1)
        post.downvotes = F("downvotes") + 1

    post.save()
    return Response({"message": "Downvote registered"}, status=status.HTTP_200_OK)

# Add a comment
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_comment(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    serializer = CommentSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(post=post, author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
