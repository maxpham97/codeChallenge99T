interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
}

interface Props extends BoxProps {}

const getPriority = (blockchain: string): number => {
    switch (blockchain) {
        case "Osmosis":
            return 100;
        case "Ethereum":
            return 50;
        case "Arbitrum":
            return 30;
        case "Zilliqa":
        case "Neo":
            return 20;
        default:
            return -99;
    }
};

const WalletPage: React.FC<Props> = ({ children, ...rest }: Props) => {
    const balances = useWalletBalances();
    const prices = usePrices();

    const sortedBalances = useMemo(() => {
        if (!balances) return [];
        return balances
            .filter((balance) => getPriority(balance.blockchain) > -99 && balance.amount > 0)
            .sort((lhs, rhs) => getPriority(rhs.blockchain) - getPriority(lhs.blockchain));
    }, [balances]);

    const formattedBalances: FormattedWalletBalance[] = useMemo(() => {
        return sortedBalances.map((balance) => ({
            ...balance,
            formatted: balance.amount.toFixed(),
        }));
    }, [sortedBalances]);

    const rows = formattedBalances.map((balance) => {
        const usdValue = prices?.[balance.currency] * balance.amount || 0;
        return (
            <WalletRow
                className={classes.row}
                key={`${balance.currency}-${balance.blockchain}`}
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.formatted}
            />
        );
    });

    return <div {...rest}>{rows}</div>;
};
