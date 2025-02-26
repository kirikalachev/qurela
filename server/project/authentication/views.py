from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
import random
from django.contrib.auth import get_user_model

User = get_user_model()

# Generate JWT tokens
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token)
    }

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken'}, status=400)
    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already registered'}, status=400)

    # Create the user as active (no email verification required)
    user = User.objects.create_user(username=username, email=email, password=password, is_active=True)
    user.save()

    # Generate JWT tokens for the new user
    tokens = get_tokens_for_user(user)

    return Response({'message': 'User registered successfully', 'tokens': tokens})



@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email(request):
    email = request.data.get('email')
    code = request.data.get('code')
    
    stored_code = request.session.get('verification_code')  # Get from session
    if not stored_code:
        return Response({'error': 'Verification code expired or not found'}, status=400)

    if str(code) != str(stored_code):
        return Response({'error': 'Invalid verification code'}, status=400)

    try:
        user = User.objects.get(email=email)
        user.is_active = True
        user.save()
        del request.session['verification_code']  # Remove code after success
        return Response({'message': 'Email verified successfully'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def signout(request):
    response = Response({"message": "Logged out successfully"}, status=200)
    
    # Remove authentication token
    response.delete_cookie("token")  # Deletes the JWT cookie (if stored in cookies)
    request.auth = None  # Clears DRF authentication session
    
    return response


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def account(request):
    user = request.user

    if request.method == 'PUT':
        username = request.data.get('username', user.username)
        name = request.data.get('name', user.get_full_name())
        profile_pic = request.data.get('profilePic')

        if User.objects.exclude(id=user.id).filter(username=username).exists():
            return Response({'error': 'Username already taken'}, status=400)

        user.username = username
        user.first_name = name.split()[0] if " " in name else name
        user.last_name = name.split()[1] if " " in name else ""
        
        if profile_pic:
            user.profile_pic = profile_pic  # Assuming `profile_pic` is a field in your User model

        user.save()
        return Response({'message': 'Profile updated successfully'})

    return Response({'username': user.username, 'email': user.email})


@api_view(['POST'])
@permission_classes([AllowAny])
def signin(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user is not None:
        tokens = get_tokens_for_user(user)
        return Response({'message': 'Login successful', 'tokens': tokens})
    return Response({'error': 'Invalid credentials'}, status=400)

