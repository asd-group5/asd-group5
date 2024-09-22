from django.db import models

#Temporary until menu backend is done
class MenuItem(models.Model):
    name = models.CharField(max_length=30)
    price = models.DecimalField(decimal_places=2,max_digits=6)

class Option(models.Model):
    option_id = models.AutoField(primary_key=True)
    option_name = models.CharField(max_length=100)
    option_price = models.DecimalField(decimal_places=2,max_digits=5)
    menuItem = models.ManyToManyField(MenuItem)
