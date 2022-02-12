from django.utils.decorators import method_decorator
from rest_framework.authentication import (
    TokenAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from drf_yasg.utils import swagger_auto_schema

from currencies.models import get_all_currencies
from currencies.serializers import CurrencySerializer

@method_decorator(name='get', decorator=swagger_auto_schema(
    operation_description="description from swagger_auto_schema via method_decorator",
    tags=["currencies"]
))
class CurrencyList(generics.ListAPIView):
    queryset = get_all_currencies()
    serializer_class = CurrencySerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
