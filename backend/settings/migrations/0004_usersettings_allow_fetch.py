# Generated by Django 3.2.8 on 2022-05-13 21:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('settings', '0003_usersettings_timezone'),
    ]

    operations = [
        migrations.AddField(
            model_name='usersettings',
            name='allow_fetch',
            field=models.BooleanField(default=False),
        ),
    ]
