from django.contrib import admin
from .models import ContactMessage, Project, Skill, ProfileInfo


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'created_at', 'is_read']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['created_at']
    list_editable = ['is_read']
    ordering = ['-created_at']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'category', 'year', 'order', 'is_active']
    list_filter = ['is_active', 'category', 'year']
    search_fields = ['title', 'slug', 'overview', 'role']
    list_editable = ['order', 'is_active']
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'proficiency', 'order']
    list_filter = ['category']
    search_fields = ['name']
    list_editable = ['proficiency', 'order']


@admin.register(ProfileInfo)
class ProfileInfoAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'phone', 'location']
