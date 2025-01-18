from django.urls import path, include
from . import views

urlpatterns = [
    path('signup', views.signup, name="signup"),
    path('confirm', views.confirm, name="confirm"),
    path('signin/', views.signin, name="signin"),
    path('signout', views.signout, name='signout'),
    path('account', views.account, name="account")
]