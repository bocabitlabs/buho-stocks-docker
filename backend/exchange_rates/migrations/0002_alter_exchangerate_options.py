# Generated by Django 5.0.7 on 2024-08-11 14:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("exchange_rates", "0001_initial"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="exchangerate",
            options={
                "verbose_name": "Exchange Rate",
                "verbose_name_plural": "Exchange Rates",
            },
        ),
    ]