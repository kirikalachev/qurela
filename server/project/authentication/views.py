from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from project import settings
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
import random

username_errors = {
    "already_exists":"Потребителското име вече съществува!",
    "too_long": "Потребителското име трябва да е под 15 знака!",
    "not_isalnum": "Потребителското име може да съдържа само букви и числа!",
}
password_errors = {
    "too_long": "Паролата трябва да е под 15 знака!",
    "isalnum": "Паролата трябва да съдържа поне по една буква, число и символ!",
}

def signup(request):
    if request.method == "POST":
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')

        errors = []

        if User.objects.filter(username=username).exists():
            errors.append(username_errors["already_exists"])
        if len(username) > 15:
            errors.append(username_errors["too_long"])
        if not username.isalnum():
            errors.append(username_errors["not_isalnum"])
        if len(password) > 15:
            errors.append(password_errors["too_long"])
        if password.isalnum():
            errors.append(password_errors["isalnum"])

        capcha = random.randint(1000, 9999)

        if errors:
            for error in errors:
                messages.error(request, error)
        else:
            send_mail(
                'Потвърждаване на имейл!',
                f'Моля напишете кратката капча представена отдолу за да завършите регистрацията си! {capcha}',
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False
            )
            request.session['capcha'] = capcha
            request.session['username'] = username
            request.session['email'] = email
            request.session['password'] = password

            return redirect('confirm')

    return render(request, "authentication/signup.html")

def confirm(request):
    if request.method == "POST":
        capchatest = request.POST.get('capchatest')

        capcha = request.session.get('capcha')
        username = request.session.get('username')
        email = request.session.get('email')
        password = request.session.get('password')

        if capchatest == str(capcha):
            myuser = User.objects.create_user(username, email, password)
            myuser.is_active = True
            myuser.save()
            return redirect('signin')

    return render(request, "authentication/signup.html")

def signin(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('account')  # redirect to account view instead of rendering the template directly

        else:
            messages.error(request, "Невалидно потребителско име или парола.")
            return render(request, "authentication/signin.html")
        
    return render(request, "authentication/signin.html")

def signout(request):
    logout(request)
    messages.success(request, "Излязохте от профила си успешно!")
    return render(request, "home/index.html")

@login_required  # Ensure the user is logged in to access this view
def account(request):
    user = request.user
    return render(request, "authentication/account.html", {'username': user.username, 'email': user.email})