from django.db import models

class UserInfo(models.Model):
    name = models.CharField(max_length=32)
    password = models.CharField(max_length=64)
    age =models.IntegerField(default=2)
    likes = models.IntegerField(null=True, blank=True)  #新增不出错
    token = models.CharField(max_length=64, null=True, blank=True)

# 新建数据 insert into app_Userinfo(name)values("Liam")
# UserInfo.objects.create(name="Liam")

# 删除数据
# Userinfo.objects.filter(id=1).delete()
# Userinfo.objects.all().delete()

# 获取数据
# data_list = Userinfo.objects.all()
# data_list = Userinfo.objects.filter(id=1) 列表对象
# row_obj = Userinfo.objects.filter(id=1).first() 列表的第一个
# for obj in data_list:
#   print(obj.name, obj.age)

# 更新数据
# Userinfo.objects.all().update(password=999)

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
