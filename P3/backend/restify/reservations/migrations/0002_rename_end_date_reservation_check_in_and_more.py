# Generated by Django 4.1.7 on 2023-03-10 17:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("reservations", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="reservation",
            old_name="end_date",
            new_name="check_in",
        ),
        migrations.RenameField(
            model_name="reservation",
            old_name="start_date",
            new_name="check_out",
        ),
    ]
