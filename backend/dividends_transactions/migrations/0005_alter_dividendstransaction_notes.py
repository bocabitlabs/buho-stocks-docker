# Generated by Django 5.1 on 2024-08-18 05:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("dividends_transactions", "0004_alter_dividendstransaction_notes"),
    ]

    operations = [
        migrations.AlterField(
            model_name="dividendstransaction",
            name="notes",
            field=models.TextField(blank=True, default=""),
        ),
    ]
