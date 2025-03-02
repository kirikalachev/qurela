from django.urls import path
from .views import signup, verify_email, signin, signout, account

urlpatterns = [
    path('signup/', signup, name='signup'),
    path("verify_email/", verify_email, name="verify_email"),  # Fixed name
    path('signin/', signin, name='signin'),  # <== This must be included
    path('signout/', signout, name='signout'),
    path('account/', account, name='account'),
]
