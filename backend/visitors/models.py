from django.db import models

class Visitor(models.Model):
    ip_address = models.GenericIPAddressField()
    visited_at = models.DateTimeField(auto_now_add=True)