from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import IntegrityError
from django.shortcuts import get_object_or_404
from django.db.models import Q

from .models import Event, Registration
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    LoginSerializer,
    EventSerializer,
    RegistrationSerializer
)

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'tokens': tokens
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(request, email=email, password=password)
            if user is not None:
                tokens = get_tokens_for_user(user)
                return Response({
                    'user': UserSerializer(user).data,
                    'tokens': tokens
                }, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EventListView(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Event.objects.all().order_by('date')
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) | Q(location__icontains=search_query)
            )
        return queryset

class EventDetailView(generics.RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'id'

class EventRegisterView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, id):
        event = get_object_or_404(Event, id=id)
        try:
            registration, created = Registration.objects.get_or_create(user=request.user, event=event)
            if not created:
                return Response({'error': 'You are already registered for this event.'}, status=status.HTTP_400_BAD_REQUEST)
            return Response(RegistrationSerializer(registration, context={'request': request}).data, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return Response({'error': 'You are already registered for this event.'}, status=status.HTTP_400_BAD_REQUEST)

class MyRegistrationsView(generics.ListAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Registration.objects.filter(user=self.request.user).order_by('-registered_at')
