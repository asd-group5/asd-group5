# Generated by Django 5.1 on 2024-10-07 05:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('custom', '0003_menuitem_stock'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='menuitem',
            name='stock',
        ),
    ]
