from django.urls import path
from . import views
from .views import LoginView , ProfileView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns=[
    path('signup/', views.signup, name='signup'),
    path('logout/', views.logout, name='logout'),
    path('login/', LoginView.as_view(), name='login'),

     # Profile endpoint
    path('profile/', ProfileView.as_view(), name='profile'),

    
]