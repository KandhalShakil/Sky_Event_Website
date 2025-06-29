from django.shortcuts import render
from django.http import JsonResponse
from .models import EventBooking
import requests
from datetime import datetime
from .models import RegisteredUser
from django.views.decorators.csrf import csrf_exempt
import json


@csrf_exempt
def register_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        if RegisteredUser.objects.filter(email=data["email"]).exists():
            return JsonResponse({"status": "exists"}, status=409)

        RegisteredUser.objects.create(
            name=data["name"], email=data["email"],phone=data["phone"] ,password=data["password"]
        )
        return JsonResponse({"status": "success"})
    return JsonResponse({"status": "invalid method"}, status=405)


@csrf_exempt
def login_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        try:
            user = RegisteredUser.objects.get(email=data["email"])
            if user.password == data["password"]:
                return JsonResponse({"status": "success", "name": user.name , "phone" : user.phone})
            return JsonResponse({"status": "wrong_password"})
        except RegisteredUser.DoesNotExist:
            return JsonResponse({"status": "not_found"})
    return JsonResponse({"status": "invalid method"}, status=405)


def index(request):
    return render(request, "index.html")


@csrf_exempt
def book_event(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            booking = EventBooking(
                name=data.get("name"),
                email=data.get("email"),
                phone=data.get("phone"),
                date=data.get("date"),
                guests=data.get("guests"),
                payment_method=data.get("payment"),
                package=data.get("package")
            )
            booking.save()
            return JsonResponse({"status": "success"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)
    return JsonResponse({"status": "failed"}, status=400)