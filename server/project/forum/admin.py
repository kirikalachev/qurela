from django.contrib import admin
from .models import Post, Comment, Category

class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'created_at')
    list_filter = ('category', 'author')
    search_fields = ('title', 'content', 'category__name')

admin.site.register(Post, PostAdmin)
admin.site.register(Comment)
admin.site.register(Category)
