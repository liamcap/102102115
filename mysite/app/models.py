from django.db import models

class UserInfo(models.Model):
    name = models.CharField(max_length=32)
    password = models.CharField(max_length=64)
    age =models.IntegerField(default=2)
    likes = models.IntegerField(null=True, blank=True)

'''
create table app_userinfo(
    id bigint auto_increment primary key,
    name varchar(32),
    password varchar(64),
    age int dedault 2
)
'''

'''
执行命令
python manage.py makemigrations
python manage.py migrate
'''
