# Generated by Django 5.0.6 on 2024-10-27 07:00

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("address", "0001_initial"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="address",
            options={
                "ordering": ["-is_default", "-updated_at"],
                "verbose_name": "Delivery Address",
                "verbose_name_plural": "Delivery Addresses",
            },
        ),
        migrations.AddField(
            model_name="address",
            name="address_type",
            field=models.CharField(
                choices=[("HOME", "Home"), ("OFFICE", "Office"), ("OTHER", "Other")],
                default="HOME",
                max_length=10,
            ),
        ),
        migrations.AddField(
            model_name="address",
            name="delivery_instructions",
            field=models.TextField(
                blank=True, help_text="Enter delivery instructions", null=True
            ),
        ),
        migrations.AddField(
            model_name="address",
            name="detail_address",
            field=models.CharField(default=django.utils.timezone.now, max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="address",
            name="phone_number",
            field=models.CharField(default=1, max_length=20),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="address",
            name="country",
            field=models.CharField(default="South Korea", max_length=100),
        ),
    ]