from django.conf import settings
from django.db import models

DELIVERY_CHOICES = {
    ("ST", "Standard"),
    ("PR", "Priority"),
    ("SC", "Scheduled")
}

class Order(models.Model):
    total_price = models.DecimalField(decimal_places=2,max_digits=6)
    instructions = models.CharField(max_length=500, blank=True, default='')
    delivery_method = models.CharField(max_length=3, choices=DELIVERY_CHOICES, default="ST")
    delivery_date = models.DateTimeField(null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    order_item = models.ManyToManyField('custom.MenuItem', through='OrderItem')

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, verbose_name='order')
    menu_item = models.ForeignKey('custom.MenuItem', on_delete=models.CASCADE)

