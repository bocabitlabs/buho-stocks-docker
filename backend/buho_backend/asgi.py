"""
ASGI config for buho_backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/
"""

import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from django.urls import re_path

from buho_backend import consumers
from buho_backend.settings_loader import get_settings_module

settings_module = get_settings_module()

os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)

# print(settings_module)
django_asgi_app = get_asgi_application()

websocket_urlpatterns = [
    re_path(r"ws/tasks/$", consumers.TaskConsumer.as_asgi()),
]

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AllowedHostsOriginValidator(AuthMiddlewareStack(URLRouter(websocket_urlpatterns))),
    }
)
