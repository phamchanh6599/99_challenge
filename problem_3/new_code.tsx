import React, { useMemo, useState, useEffect } from 'react';

// Add missing BoxProps interface
interface BoxProps {
  className?: string;
  style?: React.CSSProperties;
}

type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

// Add missing useWalletBalances hook
const useWalletBalances = (): WalletBalance[] => {
  const [balances, setBalances] = useState<WalletBalance[]>([]);

  useEffect(() => {
    const fetchBalances = async () => {
      const response = await fetch('/api/wallets/balances');
      const data = await response.json();
      setBalances(data);
    };

    fetchBalances();
  }, []);

  return balances;
};

// Add missing usePrices hook
const usePrices = (): Record<string, number> => {
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchPrices = async () => {
      const response = await fetch('/api/prices');
      const data = await response.json();
      setPrices(data);
    };

    fetchPrices();
  }, []);

  return prices;
};

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}

interface WalletPageProps extends BoxProps {}

const BLOCKCHAIN_PRIORITY: Record<Blockchain | string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const DEFAULT_PRIORITY = -99;
const MIN_VALID_PRIORITY = -99;
const CURRENCY_DECIMALS = 2;

const classes = {
  row: 'wallet-row',
};

const getPriority = (blockchain: string): number => {
  return BLOCKCHAIN_PRIORITY[blockchain] ?? DEFAULT_PRIORITY;
};

const isValidBalance = (balance: WalletBalance): boolean => {
  const priority = getPriority(balance.blockchain);
  return priority > MIN_VALID_PRIORITY && balance.amount > 0;
};

const comparePriority = (a: WalletBalance, b: WalletBalance): number => {
  return getPriority(b.blockchain) - getPriority(a.blockchain);
};

/**
 * Processes wallet balances by filtering, sorting, and formatting them.
 * 
 * Filters out invalid balances (low priority or zero/negative amounts),
 * sorts by blockchain priority (highest first), and adds formatted display
 * values including USD conversion.
 * 
 * @param balances - Array of raw wallet balances with currency, amount, and blockchain
 * @param prices - Object mapping currency codes to their current USD prices
 * @returns Array of formatted balances ready for display, each containing:
 *   - All original balance properties (currency, amount, blockchain)
 *   - formatted: Amount as string with fixed decimals (e.g., "123.45")
 *   - usdValue: Calculated USD value (amount * price)
 */
const useProcessedBalances = (
  balances: WalletBalance[],
  prices: Record<string, number>
): FormattedWalletBalance[] => {
  return useMemo(() => {
    return balances
      .filter(isValidBalance)
      .sort(comparePriority)
      .map((balance) => ({
        ...balance,
        formatted: balance.amount.toFixed(CURRENCY_DECIMALS),
        usdValue: (prices[balance.currency] || 0) * balance.amount,
      }));
  }, [balances, prices]);
};

// Add missing WalletRow component
const WalletRow: React.FC<{
  amount: number;
  usdValue: number;
  formattedAmount: string;
  className?: string;
}> = ({ amount, usdValue, formattedAmount, className }) => {
  return (
    <div className={className}>
      <span>Amount: {formattedAmount}</span>
      <span>USD Value: ${usdValue.toFixed(2)}</span>
    </div>
  );
};

const WalletRowItem: React.FC<{
  balance: FormattedWalletBalance;
  className?: string;
}> = ({ balance, className }) => {
  return (
    <WalletRow
      className={className}
      amount={balance.amount}
      usdValue={balance.usdValue}
      formattedAmount={balance.formatted}
    />
  );
};

const EmptyState: React.FC<{ message: string }> = ({ message }) => {
  return <div>{message}</div>;
};

const WalletList: React.FC<{
  balances: FormattedWalletBalance[];
  rowClassName?: string;
  emptyMessage?: string;
}> = ({ balances, rowClassName, emptyMessage = 'No balances available' }) => {
  if (balances.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <>
      {balances.map((balance) => (
        <WalletRowItem
          key={balance.currency}
          balance={balance}
          className={rowClassName}
        />
      ))}
    </>
  );
};

const WalletPage: React.FC<WalletPageProps> = (props) => {
  const { ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const processedBalances = useProcessedBalances(balances, prices);

  return (
    <div {...rest}>
      <WalletList balances={processedBalances} rowClassName={classes.row} />
    </div>
  );
};

export default WalletPage;