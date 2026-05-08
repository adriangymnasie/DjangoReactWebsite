from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Visitor, Todo, Message


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')


def track_visitor(request):
    ip = get_client_ip(request)
    Visitor.objects.get_or_create(ip_address=ip)
    count = Visitor.objects.values('ip_address').distinct().count()
    return JsonResponse({'unique_visitors': count})


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


@csrf_exempt
def logout_view(request):
    logout(request)
    return JsonResponse({'success': True})


def me_view(request):
    if request.user.is_authenticated:
        return JsonResponse({'success': True, 'username': request.user.username})
    return JsonResponse({'success': False}, status=401)


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


@csrf_exempt
def todos_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Inte inloggad'}, status=401)

    if request.method == 'GET':
        todos = [
            {'id': t.id, 'text': t.text, 'author': t.author.username}
            for t in Todo.objects.select_related('author').order_by('created_at')
        ]
        return JsonResponse({'todos': todos})

    if request.method == 'POST':
        data = json.loads(request.body)
        text = data.get('text', '').strip()
        if not text:
            return JsonResponse({'error': 'Text saknas'}, status=400)
        todo = Todo.objects.create(text=text, author=request.user)
        return JsonResponse({'id': todo.id, 'text': todo.text, 'author': request.user.username})

    return JsonResponse({'error': 'Metod inte tillåten'}, status=405)


@csrf_exempt
def todo_detail_view(request, todo_id):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Inte inloggad'}, status=401)

    if request.method == 'DELETE':
        try:
            Todo.objects.get(id=todo_id).delete()
            return JsonResponse({'success': True})
        except Todo.DoesNotExist:
            return JsonResponse({'error': 'Hittades inte'}, status=404)

    return JsonResponse({'error': 'Metod inte tillåten'}, status=405)


@csrf_exempt
def messages_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Inte inloggad'}, status=401)

    if request.method == 'GET':
        msgs = [
            {'id': m.id, 'text': m.text, 'author': m.author.username}
            for m in Message.objects.select_related('author').order_by('created_at')
        ]
        return JsonResponse({'messages': msgs})

    if request.method == 'POST':
        data = json.loads(request.body)
        text = data.get('text', '').strip()
        if not text:
            return JsonResponse({'error': 'Text saknas'}, status=400)
        msg = Message.objects.create(text=text, author=request.user)
        return JsonResponse({'id': msg.id, 'text': msg.text, 'author': request.user.username})

    return JsonResponse({'error': 'Metod inte tillåten'}, status=405)
