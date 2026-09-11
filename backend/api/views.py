from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from .models import ContactMessage, Project, Skill, ProfileInfo
from .serializers import (
    ContactMessageSerializer,
    ProjectSerializer,
    SkillSerializer,
    ProfileInfoSerializer
)


class HealthCheckView(APIView):
    """Simple health check endpoint for monitoring."""
    def get(self, request):
        return Response({
            "status": "healthy",
            "message": "سیستم بک‌اند پورتفولیو فعال و پاسخگو است.",
            "server_time": timezone.now().isoformat(),
            "framework": "Django 5.2 & Django REST Framework"
        })


class ContactMessageCreateView(APIView):
    """Receives contact form submissions from the website."""
    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "پیام شما با موفقیت دریافت و ثبت گردید. در اسرع وقت پاسخ خواهم داد.",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "success": False,
            "message": "اطلاعات وارد شده نامعتبر است. لطفاً فرم را تصحیح کنید.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ProjectListView(APIView):
    """Returns all active projects ordered by order."""
    def get(self, request):
        projects = Project.objects.filter(is_active=True).order_by('order', 'id')
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)


class ProjectDetailView(APIView):
    """Returns single project details by slug."""
    def get(self, request, slug):
        try:
            project = Project.objects.get(slug=slug, is_active=True)
            serializer = ProjectSerializer(project)
            return Response(serializer.data)
        except Project.DoesNotExist:
            return Response({
                "detail": f"پروژه‌ای با شناسه '{slug}' یافت نشد."
            }, status=status.HTTP_404_NOT_FOUND)


class SkillListView(APIView):
    """Returns all skills."""
    def get(self, request):
        skills = Skill.objects.all().order_by('order', 'name')
        serializer = SkillSerializer(skills, many=True)
        return Response(serializer.data)


class ProfileInfoView(APIView):
    """Returns personal and contact details."""
    def get(self, request):
        profile = ProfileInfo.objects.first()
        if not profile:
            profile = ProfileInfo.objects.create()
        serializer = ProfileInfoSerializer(profile)
        return Response(serializer.data)
