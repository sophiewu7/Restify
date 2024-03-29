# Generated by Django 4.0.10 on 2023-03-31 00:33

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('properties', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('NEW', 'Host: New Reservation'), ('HCANCEL', 'Host: Reservation Canceled'), ('APPROVED', 'User: Approved Reservation'), ('UCANCEL', 'User: Requst Canceled')], db_column='type', max_length=200)),
                ('property', models.ForeignKey(db_column='notification', on_delete=django.db.models.deletion.CASCADE, to='properties.property')),
                ('user', models.ForeignKey(db_column='user', on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
