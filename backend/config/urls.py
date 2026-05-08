from django.contrib import admin
from django.urls import path
from visitors.views import (
    track_visitor, login_view, logout_view, register_view, me_view,
    todos_view, todo_detail_view, messages_view,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/visitors/', track_visitor),
    path('api/login/', login_view),
    path('api/logout/', logout_view),
    path('api/register/', register_view),
    path('api/me/', me_view),
    path('api/todos/', todos_view),
    path('api/todos/<int:todo_id>/', todo_detail_view),
    path('api/messages/', messages_view),
]
