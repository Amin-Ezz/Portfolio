from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static

def api_root_view(request):
    return JsonResponse({
        "project": "AMIN.EZ Portfolio Full-Stack API",
        "version": "1.0.0",
        "status": "online",
        "endpoints": {
            "health": "/api/health/",
            "contact": "/api/contact/ [POST]",
            "projects": "/api/projects/",
            "skills": "/api/skills/",
            "profile": "/api/profile/",
            "admin": "/admin/"
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('', api_root_view, name='api-root'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
