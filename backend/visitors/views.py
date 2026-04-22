from django.http import JsonResponse
from .models import Visitor

def track_visitor(request):
    ip = request.META.get('REMOTE_ADDR')
    Visitor.objects.get_or_create(ip_address=ip)
    count = Visitor.objects.values('ip_address').distinct().count()
    return JsonResponse({'unique_visitors': count})