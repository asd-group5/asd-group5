from django.db import models

class Option(models.Model):
    option_id = models.AutoField(primary_key=True)
    option_name = models.CharField(max_length=100)
    option_price = models.DecimalField(decimal_places=2,max_digits=5)
