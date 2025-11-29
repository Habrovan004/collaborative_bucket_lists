from django.urls import path
from . import views
from .views import LoginView ,profile_view

urlpatterns=[
    path('signup/', views.signup, name='signup'),
    path('logout/', views.logout, name='logout'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', profile_view, name='profile'),
]