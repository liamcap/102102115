from django.shortcuts import render, HttpResponse, redirect
from app.models import UserInfo

def index(request):
    return HttpResponse("欢迎使用")

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
