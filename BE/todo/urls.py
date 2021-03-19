#from django.conf.urls import url
from django.urls import path
from . import views

urlpatterns = [
#    path('', views.ToDoListView.as_view(), name='todo'),
    path('', views.todoOverview, name='todo-overview'),
    path('todo-list/', views.todoList, name='todo-list'),
    path('todo-detail/<str:pk>/', views.todoDetail, name='todo-detail'),
    path('todo-create/', views.todoCreate, name='todo-create'),
    path('todo-update/<str:pk>/', views.todoUpdate, name='todo-update'),
    path('todo-delete/<str:pk>/', views.todoDelete, name='todo-delete'),
]