from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Visitor

# Räknar unika besökare
def track_visitor(request):
    ip = request.META.get('REMOTE_ADDR')
    Visitor.objects.get_or_create(ip_address=ip)
    count = Visitor.objects.values('ip_address').distinct().count()
    return JsonResponse({'unique_visitors': count})

# Hanterar inloggning
@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'success': True, 'username': user.username})
        else:
            return JsonResponse({'success': False, 'error': 'Fel användarnamn eller lösenord'})
    return JsonResponse({'error': 'Endast POST tillåtet'})

# Hanterar utloggning
@csrf_exempt
def logout_view(request):
    logout(request)
    return JsonResponse({'success': True})

# Returnerar inloggad användare (används vid sidladdning för att återställa session)
def me_view(request):
    if request.user.is_authenticated:
        return JsonResponse({'success': True, 'username': request.user.username})
    return JsonResponse({'success': False}, status=401)

# Hanterar registrering
@csrf_exempt
def register_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        if User.objects.filter(username=username).exists():
            return JsonResponse({'success': False, 'error': 'Användarnamnet är redan taget'})
        User.objects.create_user(username=username, password=password)
        return JsonResponse({'success': True})
    return JsonResponse({'error': 'Endast POST tillåtet'})