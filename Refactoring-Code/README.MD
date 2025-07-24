# Issues

-   [x] Move getPriority() outside component - avoids function recreation on every render.
-   [x] Fix typo in lhsPriority – use balancePriority instead to prevent reference error.
-   [x] Avoid key={index} in lists – use stable keys like currency-blockchain.
-   [x] Use formattedBalances instead of sortedBalances in map() – ensures .formatted is defined.
-   [x] Extend WalletBalance type with blockchain – required for priority logic.
-   [x] Simplify filter logic – use clear, readable condition: balancePriority > -99 && balance.amount > 0.
