from django.shortcuts import render, HttpResponse

# Create your views here.

def index(request):
    return HttpResponse("欢迎使用")

def user_list(request):

    # 默认app目录下寻找templates
    return render(request, "user_list.html")

def user_add(request):
    return HttpResponse("添加用户")