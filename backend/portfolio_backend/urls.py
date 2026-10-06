from pathlib import Path
from django.contrib import admin
from django.urls import path, include, re_path
from django.http import JsonResponse, HttpResponse, Http404
from django.conf import settings
from django.views.static import serve


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


def serve_frontend_asset(request, path):
    """
    Directly serve Vite compiled assets, images, media, videos, and fonts.
    Looks in front/dist first, then falls back to staticfiles and front/public.
    """
    candidates = [
        settings.BASE_DIR.parent / 'front' / 'dist',
        getattr(settings, 'STATIC_ROOT', None),
        settings.BASE_DIR.parent / 'front' / 'public',
        settings.BASE_DIR.parent / 'front' / 'images',
    ]

    for doc_root in candidates:
        if not doc_root:
            continue
        doc_root_path = Path(doc_root)
        file_path = doc_root_path / path
        if file_path.exists() and file_path.is_file():
            return serve(request, path, document_root=str(doc_root_path))

    raise Http404(f"Asset '{path}' not found.")


def frontend_view(request, filename='index.html'):
    """Serve the compiled frontend HTML or fallback to API overview."""
    dist_dir = settings.BASE_DIR.parent / 'front' / 'dist'
    target_file = dist_dir / filename
    if target_file.exists() and target_file.is_file():
        content_type = 'text/html' if filename.endswith('.html') else 'text/plain; charset=utf-8'
        return HttpResponse(target_file.read_bytes(), content_type=content_type)

    # Fallback to staticfiles index.html
    staticfiles_index = Path(settings.STATIC_ROOT) / 'index.html'
    if staticfiles_index.exists() and staticfiles_index.is_file():
        return HttpResponse(staticfiles_index.read_bytes(), content_type='text/html; charset=utf-8')

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

    # Check staticfiles projects
    static_project = Path(settings.STATIC_ROOT) / 'projects' / f"{project_slug}.html"
    if static_project.exists():
        return HttpResponse(static_project.read_bytes(), content_type='text/html; charset=utf-8')

    return frontend_view(request, 'index.html')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api-info/', api_root_view, name='api-root-info'),
    path('projects/<slug:project_slug>/', project_page_view, name='project-detail-page'),
    path('projects/<slug:project_slug>.html', project_page_view, name='project-detail-html'),

    # Frontend Assets, CSS, JS, Images, Videos, Media, Static
    re_path(r'^(?P<path>(assets|images|media|videos)/.*)$', serve_frontend_asset, name='frontend-assets'),
    re_path(r'^(?P<path>[^/]+\.(?:ico|svg|png|jpg|jpeg|webp|pdf|txt|xml|json|mp4|webm))$', serve_frontend_asset, name='frontend-root-files'),
    re_path(r'^static/(?P<path>.*)$', serve_frontend_asset, name='static-files'),

    path('', frontend_view, name='frontend-home'),
]


