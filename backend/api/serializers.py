from rest_framework import serializers
from .models import ContactMessage, Project, Skill, ProfileInfo


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_name(self, value):
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("لطفاً نام معتبری وارد کنید (حداقل ۲ نویسه).")
        return value.strip()

    def validate_message(self, value):
        if not value or len(value.strip()) < 5:
            raise serializers.ValidationError("متن پیام باید حداقل شامل ۵ نویسه باشد.")
        return value.strip()


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'id', 'slug', 'title', 'subtitle', 'tagline', 'category', 'year', 'role',
            'technologies', 'live_url', 'github_url', 'hero_image', 'detail_images',
            'accent_color', 'overview', 'problem', 'solution', 'process', 'metrics',
            'next_slug', 'next_title', 'prev_slug', 'prev_title', 'order'
        ]


class SkillSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Skill
        fields = ['id', 'name', 'category', 'category_display', 'proficiency', 'order']


class ProfileInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileInfo
        fields = [
            'id', 'full_name', 'role_title', 'bio', 'email', 'phone',
            'location', 'telegram_url', 'github_url', 'linkedin_url', 'resume_url'
        ]
