from rest_framework import serializers
from .models import Post, Comment, SavedPost, Vote, Category

class PostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    upvotes = serializers.IntegerField(read_only=True)
    downvotes = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source="author.username", read_only=True)  # ✅ Returns username

    class Meta:
        model = Comment
        fields = ["id", "content", "author", "created_at"]




class SavedPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedPost
        fields = '__all__'

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
