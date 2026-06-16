from django.test import TestCase
from django.urls import reverse 
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

from .models import Event, Registration

User = get_user_model()

class EventRegAPITests(APITestCase):

    def setUp(self):
        self.user_data = {
            'email': 'testuser@example.com',
            'name': 'Test User',
            'password': 'testpassword123'
        }
        self.user = User.objects.create_user(
            email=self.user_data['email'],
            name=self.user_data['name'],
            password=self.user_data['password']
        )
        
        self.event1 = Event.objects.create(
            title="Python Conf 2026",
            description="All about Python",
            date=timezone.now() + timedelta(days=10),
            location="Chicago, IL"
        )
        self.event2 = Event.objects.create(
            title="React Meetup",
            description="Frontend discussions",
            date=timezone.now() + timedelta(days=20),
            location="San Jose, CA"
        )

    def test_user_registration(self):
        url = reverse('register')
        data = {
            'email': 'newuser@example.com',
            'name': 'New User',
            'password': 'securepassword123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], data['email'])

    def test_user_login(self):
        url = reverse('login')
        data = {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', response.data)
        self.assertEqual(response.data['user']['email'], self.user_data['email'])

    def test_user_login_invalid(self):
        url = reverse('login')
        data = {
            'email': self.user_data['email'],
            'password': 'wrongpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_events(self):
        url = reverse('event-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_search_events(self):
        url = reverse('event-list')
        response = self.client.get(url, {'search': 'Python'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Python Conf 2026")

    def test_retrieve_event_detail(self):
        url = reverse('event-detail', kwargs={'id': self.event1.id})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.event1.title)

    def test_event_registration(self):
        login_url = reverse('login')
        login_response = self.client.post(login_url, {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        }, format='json')
        token = login_response.data['tokens']['access']
        
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        
        url = reverse('event-register', kwargs={'id': self.event1.id})
        response = self.client.post(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        response_dup = self.client.post(url, format='json')
        self.assertEqual(response_dup.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response_dup.data)

    def test_my_registrations(self):
        Registration.objects.create(user=self.user, event=self.event2)
        
        login_url = reverse('login')
        login_response = self.client.post(login_url, {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        }, format='json')
        token = login_response.data['tokens']['access']
        
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        
        url = reverse('my-registrations')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['event']['title'], self.event2.title)
