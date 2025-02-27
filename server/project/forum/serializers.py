from rest_framework import serializers
from .models import Post, Comment, SavedPost, Vote, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]

class PostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source="author.username")
    upvotes = serializers.IntegerField(read_only=True)
    downvotes = serializers.IntegerField(read_only=True)
    # Use a nested serializer to return both id and name for the category
    category = CategorySerializer(read_only=True)
    # Use a writeable field to accept the category id when creating a post
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), write_only=True, source="category"
    )

    class Meta:
        model = Post
        fields = "__all__"

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source="author.username", read_only=True)
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "content", "author", "created_at"]

class SavedPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedPost
        fields = "__all__"

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = "__all__"
        read_only_fields = ["id", "user", "post"]
