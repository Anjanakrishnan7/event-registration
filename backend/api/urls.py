from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    EventListView,
    EventDetailView,
    EventRegisterView,
    MyRegistrationsView
)

urlpatterns = [
    path('register', RegisterView.as_view(), name='register'),
    path('login', LoginView.as_view(), name='login'),
    path('events', EventListView.as_view(), name='event-list'),
    path('events/<int:id>', EventDetailView.as_view(), name='event-detail'),
    path('events/<int:id>/register', EventRegisterView.as_view(), name='event-register'),
    path('my-registrations', MyRegistrationsView.as_view(), name='my-registrations'),
]
