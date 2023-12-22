from decimal import Decimal

from companies.models import Company
from dividends_transactions.utils import DividendsTransactionCalculator
from rights_transactions.calculators import RightsTransactionCalculator
from shares_transactions.models import SharesTransaction
from shares_transactions.utils import SharesTransactionCalculator


class CompanyStatsCalculator:
    def __init__(self, company_id: int, use_portfolio_currency: bool = True):
        self.company: Company = Company.objects.get(id=company_id)
        self.use_portfolio_currency: bool = use_portfolio_currency

        self.shares_utils = SharesTransactionCalculator(
            self.company.shares_transactions,
            use_portfolio_currency=self.use_portfolio_currency,
        )
        self.rights_utils = RightsTransactionCalculator(
            self.company.rights_transactions,
            use_portfolio_currency=self.use_portfolio_currency,
        )

        self.dividends_utils = DividendsTransactionCalculator(
            self.company.dividends_transactions,
            use_portfolio_currency=self.use_portfolio_currency,
        )

    def get_company_first_year(self) -> int | None:
        query = SharesTransaction.objects.filter(company_id=self.company.id).order_by("transaction_date")
        if query.exists():
            return query[0].transaction_date.year
        return None

    def get_total_invested_on_year(self, year: int) -> Decimal:
        total: Decimal = Decimal(0)
        total += self.shares_utils.get_invested_on_year(year)
        total += self.rights_utils.get_invested_on_year(year)
        return total

    def get_accumulated_investment_until_year(self, year: int) -> Decimal:
        total: Decimal = Decimal(0)
        total += self.shares_utils.get_accumulated_investment_until_year(year)
        total += self.rights_utils.get_accumulated_investment_until_year(year)
        return total

    def get_accumulated_shares_count_until_year(self, year: int) -> int:
        count = self.shares_utils.get_shares_count_until_year(year)
        return count

    def get_dividends_of_year(self, year: int) -> Decimal:
        dividends = self.dividends_utils.get_dividends_of_year(year)
        return dividends

    def get_accumulated_dividends_until_year(self, year: int) -> Decimal:
        accumulated_dividends = self.dividends_utils.get_accumulated_dividends_until_year(year)
        return accumulated_dividends

    def get_accumulated_return_from_sales_until_year(self, year: int) -> Decimal:
        accumulated_sales_return = self.shares_utils.get_accumulated_return_from_sales_until_year(year)
        return accumulated_sales_return