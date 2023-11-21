from django.shortcuts import render, HttpResponse, redirect
from app.models import UserInfo
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
import uuid

def index(request):
    return HttpResponse("欢迎使用")

# def user_list(request):

#     # 默认app目录下寻找templates
#     return render(request, "user_list.html")

# def user_add(request):
#     return HttpResponse("添加用户")

# def tpl(request):
#     name = "taylor"
#     roles = ["the", "eras", "tour"]
#     user_info = {"name":"swift", "salary":1000}
#     return render(request, "tpl.html", {"n1":name, "n2":roles, "n3":user_info})

def orm(request):
    UserInfo.objects.all().delete()
    UserInfo.objects.create(name="Liam", password="999")
    UserInfo.objects.create(name="Cap", password="1221", likes=5)
    return HttpResponse("success")

def info_list(request):

    data_list = UserInfo.objects.all()
    # 渲染返回给用户
    return render(request, "User_info.html", {"data_list":data_list})

def info_add(request):
    if request.method == "GET":
        return render(request, 'User_add.html')
    
    # 获取信息
    user_name = request.POST.get("user")
    pwd = request.POST.get("password")
    age = request.POST.get("age")
    likes = request.POST.get("likes")

    # 添加到数据库
    UserInfo.objects.create(name=user_name,password=pwd,age=age,likes=likes)

    return redirect("/info/list/")

def info_delete(request):
    nid = request.GET.get("nid")
    UserInfo.objects.filter(id=nid).delete()
    return redirect("/info/list/")

class LoginView(APIView):
    authrntication_classs = []

    def post(self, request):
        user = request.data.get("username")
        pwd = request.data.get("password")
        user_object = UserInfo.objects.filter(name=user, password=pwd).first()
        if not user_object:
            return Response({"code":1001, 'msg':"密码错误"})
        
        token = str(uuid.uuid4())
        user_object.token = token
        user_object.save()
        
        return Response({"status": True, 'data': token})
