# Generated by Django 5.1 on 2024-10-07 05:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('custom', '0002_auto_20240922_0943'),
    ]

    operations = [
        migrations.AddField(
            model_name='menuitem',
            name='stock',
            field=models.IntegerField(default=10),
            preserve_default=False,
        ),
    ]