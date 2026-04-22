from django.contrib import admin
from django.urls import path
from visitors.views import track_visitor

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/visitors/', track_visitor),
]