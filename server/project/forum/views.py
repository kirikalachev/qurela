from django.shortcuts import render, redirect, get_object_or_404
from .models import Category, Post, Comment, SavedPost
from .forms import PostForm, CommentForm
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db.models import F
from .models import Post, Vote

def post_list(request):
    post_list = Post.objects.all()
    paginator = Paginator(post_list, 10)  # Show 10 posts per page
    page_number = request.GET.get('page')
    posts = paginator.get_page(page_number)
    return render(request, 'forum/post_list.html', {'posts': posts})

@login_required
def create_post(request):
    if request.method == 'POST':
        form = PostForm(request.POST)
        other_category = request.POST.get('other_category')
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            if other_category:
                category, created = Category.objects.get_or_create(name=other_category)
                post.category = category
            else:
                post.category = form.cleaned_data['category']
            post.save()
            return redirect('post_list')
    else:
        form = PostForm()
    return render(request, 'forum/create_post.html', {'form': form})

@login_required
def save_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    saved_post, created = SavedPost.objects.get_or_create(user=request.user, post=post)

    if not created:
        saved_post.delete()  # If already saved, remove from saved posts

    return redirect('post_list')

@login_required
def user_posts(request):
    published_posts = Post.objects.filter(author=request.user)
    saved_posts = SavedPost.objects.filter(user=request.user)

    return render(request, 'forum/user_posts.html', {
        'published_posts': published_posts,
        'saved_posts': saved_posts,
    })

@login_required
def upvote_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    existing_vote = Vote.objects.filter(user=request.user, post=post).first()

    if existing_vote:
        if existing_vote.vote_type == -1:  # If user has already downvoted, remove downvote
            post.downvotes = F('downvotes') - 1
            post.upvotes = F('upvotes') + 1
            existing_vote.vote_type = 1  # Change vote to upvote
            existing_vote.save()
        elif existing_vote.vote_type == 1:  # If user has already upvoted, remove upvote
            post.upvotes = F('upvotes') - 1
            existing_vote.delete()
    else:  # If no previous vote, add an upvote
        Vote.objects.create(user=request.user, post=post, vote_type=1)
        post.upvotes = F('upvotes') + 1

    post.save()
    return redirect('post_list')

@login_required
def downvote_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    existing_vote = Vote.objects.filter(user=request.user, post=post).first()

    if existing_vote:
        if existing_vote.vote_type == 1:  # If user has already upvoted, remove upvote
            post.upvotes = F('upvotes') - 1
            post.downvotes = F('downvotes') + 1
            existing_vote.vote_type = -1  # Change vote to downvote
            existing_vote.save()
        elif existing_vote.vote_type == -1:  # If user has already downvoted, remove downvote
            post.downvotes = F('downvotes') - 1
            existing_vote.delete()
    else:  # If no previous vote, add a downvote
        Vote.objects.create(user=request.user, post=post, vote_type=-1)
        post.downvotes = F('downvotes') + 1

    post.save()
    return redirect('post_list')

@login_required
def add_comment(request, post_id):
    post = Post.objects.get(id=post_id)
    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.post = post
            comment.author = request.user
            comment.save()
            return redirect('post_list')
    else:
        form = CommentForm()
    return render(request, 'forum/add_comment.html', {'form': form, 'post': post})

@login_required
def edit_post(request, post_id):
    post = get_object_or_404(Post, id=post_id, author=request.user)  # Ensure only the author can edit

    if request.method == 'POST':
        form = PostForm(request.POST, instance=post)
        if form.is_valid():
            form.save()  # `updated_at` will automatically update due to `auto_now=True`
            return redirect('post_list')  # Redirect to the list of posts or the post details page
    else:
        form = PostForm(instance=post)
    return render(request, 'forum/edit_post.html', {'form': form, 'post': post})
@login_required
def post_detail(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    comments = post.comments.all()
    
    return render(request, 'forum/post_detail.html', {'post': post, 'comments': comments})

