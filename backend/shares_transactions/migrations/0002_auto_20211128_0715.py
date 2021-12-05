# Generated by Django 3.2.8 on 2021-11-28 07:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shares_transactions', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='sharestransaction',
            old_name='price_per_share',
            new_name='gross_price_per_share',
        ),
        migrations.RenameField(
            model_name='sharestransaction',
            old_name='price_per_share_currency',
            new_name='gross_price_per_share_currency',
        ),
        migrations.RemoveField(
            model_name='sharestransaction',
            name='name',
        ),
    ]