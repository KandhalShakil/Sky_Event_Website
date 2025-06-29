from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('booking/', views.book_event, name='book_event'),
    path('register/', views.register_user, name='register_user'),
    path('login/', views.login_user, name='login_user'),
]
