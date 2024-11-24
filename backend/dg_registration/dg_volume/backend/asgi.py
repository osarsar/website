
import os
import django
print("Setting up Django...")
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup() 
print("Django setup complete.")
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from pages.routing import websocket_urlpatterns
from django.core.asgi import get_asgi_application



application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # Handles HTTP requests
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
            )
    ),
})