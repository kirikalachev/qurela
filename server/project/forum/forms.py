from django import forms
from .models import Post, Category, Comment

class PostForm(forms.ModelForm):
    other_category = forms.CharField(required=False, label="Other Category")

    class Meta:
        model = Post
        fields = ['title', 'content', 'category']

    category = forms.ModelChoiceField(
        queryset=Category.objects.all(),
        empty_label="Select a category",
        required=False
    )

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']