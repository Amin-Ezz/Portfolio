from django.urls import path
from .views import (
    HealthCheckView,
    ContactMessageCreateView,
    ProjectListView,
    ProjectDetailView,
    SkillListView,
    ProfileInfoView
)

urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='health-check'),
    path('contact/', ContactMessageCreateView.as_view(), name='contact-create'),
    path('projects/', ProjectListView.as_view(), name='project-list'),
    path('projects/<slug:slug>/', ProjectDetailView.as_view(), name='project-detail'),
    path('skills/', SkillListView.as_view(), name='skill-list'),
    path('profile/', ProfileInfoView.as_view(), name='profile-info'),
]
