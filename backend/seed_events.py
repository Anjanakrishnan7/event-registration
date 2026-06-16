import os
import django
from django.utils import timezone
from datetime import timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'event_registration.settings')
django.setup()

from api.models import Event

def seed():
    Event.objects.all().delete()
    
    events = [
        {
            "title": "Kerala Startup Conclave 2026",
            "description": "Annual gathering of Kerala's startup ecosystem. Meet founders, investors, and mentors.",
            "date": timezone.now() + timedelta(weeks=3),
            "location": "Kochi, Kerala"
        },
        {
            "title": "React & Frontend Dev Meetup",
            "description": "Community meetup for frontend developers. Live coding, talks, and networking.",
            "date": timezone.now() + timedelta(weeks=4),
            "location": "Bangalore, Karnataka"
        },
        {
            "title": "Django & Python Workshop",
            "description": "Hands-on full day workshop covering Django REST Framework, deployment, and best practices.",
            "date": timezone.now() + timedelta(weeks=5),
            "location": "Chennai, Tamil Nadu"
        },
        {
            "title": "Cloud & DevOps Summit India",
            "description": "Deep dive into AWS, Docker, Kubernetes and modern DevOps practices.",
            "date": timezone.now() + timedelta(weeks=6),
            "location": "Hyderabad, Telangana"
        },
        {
            "title": "AI/ML Bootcamp for Beginners",
            "description": "Three day beginner-friendly bootcamp covering Python, data science, and machine learning basics.",
            "date": timezone.now() + timedelta(weeks=7),
            "location": "Kozhikode, Kerala"
        },
        {
            "title": "Product Management Masterclass",
            "description": "Learn product thinking, user research, roadmapping and stakeholder management from experienced PMs.",
            "date": timezone.now() + timedelta(weeks=8),
            "location": "Pune, Maharashtra"
        }
    ]
    
    for event_data in events:
        Event.objects.create(**event_data)
        print(f"Created event: {event_data['title']}")

if __name__ == "__main__":
    seed()
