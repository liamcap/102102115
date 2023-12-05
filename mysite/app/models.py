from django.db import models

class UserInfo(models.Model):
    name = models.CharField(max_length=32)
    password = models.CharField(max_length=64)
    age =models.IntegerField(default=2)
    likes = models.IntegerField(null=True, blank=True)  #新增不出错
    token = models.CharField(max_length=64, null=True, blank=True)
