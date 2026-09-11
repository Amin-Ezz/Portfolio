from pathlib import Path
from django.contrib import admin
from django.urls import path, include, re_path
from django.http import JsonResponse, HttpResponse
from django.conf import settings
from django.conf.urls.static import static

def api_root_view(request):
    return JsonResponse({
        "project": "AMIN.EZ Portfolio Full-Stack API",
        "domain": "aminez.ir",
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

def frontend_view(request, filename='index.html'):
    """Serve the compiled frontend HTML or fallback to API overview."""
    dist_dir = settings.BASE_DIR.parent / 'front' / 'dist'
    target_file = dist_dir / filename
    if target_file.exists() and target_file.is_file():
        content_type = 'text/html' if filename.endswith('.html') else 'text/plain; charset=utf-8'
        return HttpResponse(target_file.read_bytes(), content_type=content_type)
    
    # Fallback to dist index.html
    index_file = dist_dir / 'index.html'
    if index_file.exists():
        return HttpResponse(index_file.read_bytes(), content_type='text/html; charset=utf-8')
    
    # If frontend has not been compiled yet, return API root
    return api_root_view(request)

def project_page_view(request, project_slug):
    """Serve specific project editorial case study HTML if available."""
    dist_dir = settings.BASE_DIR.parent / 'front' / 'dist' / 'projects'
    project_html = dist_dir / f"{project_slug}.html"
    if project_html.exists():
        return HttpResponse(project_html.read_bytes(), content_type='text/html; charset=utf-8')
    return frontend_view(request, 'index.html')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api-info/', api_root_view, name='api-root-info'),
    path('projects/<slug:project_slug>/', project_page_view, name='project-detail-page'),
    path('projects/<slug:project_slug>.html', project_page_view, name='project-detail-html'),
    path('', frontend_view, name='frontend-home'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

