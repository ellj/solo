# Generated by Django 3.0.4 on 2020-04-02 18:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('solo_rog_api', '0016_auto_20200325_0637'),
    ]

    operations = [
        migrations.AlterField(
            model_name='part',
            name='nsn',
            field=models.CharField(max_length=13, null=True),
        ),
        migrations.AlterField(
            model_name='status',
            name='projected_qty',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='status',
            name='received_qty',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='suppadd',
            name='code',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterUniqueTogether(
            name='part',
            unique_together={('nsn', 'uom')},
        ),
    ]
