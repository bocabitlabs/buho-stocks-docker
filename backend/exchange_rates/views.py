from rest_framework.response import Response
from rest_framework.authentication import (
    TokenAuthentication,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema

from exchange_rates.models import ExchangeRate
from exchange_rates.serializers import ExchangeRateSerializer
from exchange_rates.utils import get_exchange_rates_from_api

from forex_python.converter import RatesNotAvailableError


class ExchangeRateListAPIView(APIView):
    """Get all the exchange rates from a user"""

    authentication_classes = [
        TokenAuthentication,
    ]
    permission_classes = [IsAuthenticated]

    # 1. List all
    @swagger_auto_schema(tags=["exchange_rates"])
    def get(self, request, *args, **kwargs):
        """
        List all the exchange_rates items for given requested user
        """
        todos = ExchangeRate.objects.all()
        serializer = ExchangeRateSerializer(todos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ExchangeRateDetailAPIView(APIView):
    """Operations for a single Exchange rate"""

    authentication_classes = [
        TokenAuthentication,
    ]
    permission_classes = [IsAuthenticated]

    def get_object(self, exchange_from, exchange_to, exchange_date):
        try:
            return ExchangeRate.objects.get(
                exchange_from=exchange_from,
                exchange_to=exchange_to,
                exchange_date=exchange_date,
            )
        except ExchangeRate.DoesNotExist:
            return None

    # 3. Retrieve
    @swagger_auto_schema(tags=["exchange_rates"])
    def get(self, request, exchange_from, exchange_to, exchange_date, *args, **kwargs):
        """
        Retrieve the market item with given exchange_name
        """
        todo_instance = self.get_object(exchange_from, exchange_to, exchange_date)
        if not todo_instance:
            try:
                serializer = get_exchange_rates_from_api(
                    exchange_from, exchange_to, exchange_date
                )
                if not serializer:
                    return Response(
                        {"res": "Exchange rate does not exists"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            except RatesNotAvailableError as error:
                return Response(
                    {"error": True, "message": str(error)},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            serializer = ExchangeRateSerializer(todo_instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
