from django.core.management.base import BaseCommand, CommandError
from stock_prices.api import StockPricesApi
import logging
from stock_prices.services.yfinance_service import YFinanceStockPricesService

logger = logging.getLogger("buho_backend")

class Command(BaseCommand):
    help = "Gets a stock price"

    def add_arguments(self, parser):
        parser.add_argument("ticker", type=str)

    def handle(self, *args, **options):
        ticker = options["ticker"]

        yfinance = YFinanceStockPricesService()
        api = StockPricesApi(yfinance)
        data = api.get_current_data(ticker)
        logger.debug(data)
        self.stdout.write(self.style.SUCCESS(f"Successfully got price for {ticker}"))
        # self.stdout.write(self.style.SUCCESS(data))
