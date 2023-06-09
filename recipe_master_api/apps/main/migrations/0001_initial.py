# Generated by Django 3.2.9 on 2023-06-07 09:42

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Cart',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created_at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='updated_at')),
                ('amount', models.DecimalField(decimal_places=2, default=0.0, max_digits=10, verbose_name='Amount')),
                ('is_active', models.BooleanField(default=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created_at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='updated_at')),
                ('name', models.CharField(max_length=255, verbose_name='Name')),
                ('description', models.CharField(default='', max_length=255, verbose_name='Description')),
                ('is_active', models.BooleanField(default=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created_at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='updated_at')),
                ('name', models.CharField(max_length=255, verbose_name='Name')),
                ('email', models.EmailField(max_length=100, verbose_name='Email')),
                ('phone_number', models.CharField(max_length=15, validators=[django.core.validators.RegexValidator(message='Número inválido, insira um número nos formatos: (11) 1234-1234 ou (11) 12345-1234', regex='^(\\([0-9]{2}\\))\\s([9]{1})?([0-9]{4})-([0-9]{4})$')], verbose_name='Telefone')),
                ('address', models.CharField(default='', max_length=255, verbose_name='Endereço')),
                ('cpf_cnpj', models.CharField(max_length=20, validators=[django.core.validators.RegexValidator(message='CPF/CNPJ inválido, insira um número nos formatos: 000.000.000-00, 00.000.000/0000-00 ou sem formatação', regex='([0-9]{2}[\\.]?[0-9]{3}[\\.]?[0-9]{3}[\\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\\.]?[0-9]{3}[\\.]?[0-9]{3}[-]?[0-9]{2})')], verbose_name='CPF/CNPJ')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Restaurant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created_at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='updated_at')),
                ('corporate_name', models.CharField(max_length=255, unique=True, verbose_name='Corporate Name')),
                ('telephone_number', models.CharField(blank=True, max_length=15, verbose_name='Telephone')),
                ('cellphone_number', models.CharField(max_length=15, verbose_name='Cellphone')),
                ('address', models.CharField(max_length=255, verbose_name='Address')),
                ('is_active', models.BooleanField(default=True)),
                ('is_open', models.BooleanField(default=False)),
                ('delivery_time', models.PositiveIntegerField(default=0, verbose_name='Delivery Time (minutes)')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created_at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='updated_at')),
                ('name', models.CharField(max_length=255, verbose_name='Name')),
                ('description', models.CharField(default='', max_length=255, verbose_name='Description')),
                ('value', models.DecimalField(decimal_places=2, default=0.0, max_digits=10, verbose_name='Value')),
                ('is_active', models.BooleanField(default=True)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.category')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created_at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='updated_at')),
                ('status', models.CharField(choices=[('0', 'Em aprovação'), ('-1', 'Rejeitado'), ('1', 'Aprovado'), ('2', 'Em preparo'), ('3', 'Enviado'), ('4', 'Concluido')], default=0, max_length=50, verbose_name='Status')),
                ('notes', models.CharField(default='', max_length=255, verbose_name='Anotações')),
                ('cart', models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, to='main.cart', verbose_name='Carrinho')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='CartProduct',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created_at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='updated_at')),
                ('quantity', models.PositiveIntegerField()),
                ('amount', models.DecimalField(decimal_places=2, default=0.0, max_digits=10, verbose_name='Amount')),
                ('cart', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.cart')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.product')),
            ],
            options={
                'unique_together': {('cart', 'product')},
            },
        ),
        migrations.AddField(
            model_name='cart',
            name='client',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='main.client', verbose_name='Cliente'),
        ),
        migrations.AddField(
            model_name='cart',
            name='products',
            field=models.ManyToManyField(related_name='cart_products', through='main.CartProduct', to='main.Product'),
        ),
        migrations.AddField(
            model_name='cart',
            name='restaurant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.restaurant'),
        ),
    ]
