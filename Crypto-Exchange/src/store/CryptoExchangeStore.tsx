import { debounce } from "lodash";
import { makeAutoObservable, runInAction } from "mobx";
import toast from "react-hot-toast";
import type { CmcCoin } from "../models/CmcCoin";
import type { ConversionDirection } from "../types/ConversionDirection";

const CONVERSION_DEBOUNCE_MS = 300;
const CALCULATION_DELAY_MS = 1500;

export class CryptoExchangeStore {
    coins: CmcCoin[] = [];

    fromCoin: CmcCoin | null = null;
    fromAmount: number = 0;

    toCoin: CmcCoin | null = null;
    toAmount: number = 0;

    conversion: any | null = null;
    conversionError: string | null = null;

    isLoading = false;

    isLoadingFrom = false;
    isLoadingTo = false;

    constructor(coins: CmcCoin[]) {
        this.coins = coins;

        this.fromCoin = this.coins[0] ?? null;
        this.toCoin = this.coins[1] ?? null;

        if (this.fromCoin && this.toCoin) {
            this.isLoadingTo = true;

            this.setFromAmount(1);
        }

        makeAutoObservable(this);
    }

    setFromAmount = (amount: number): void => {
        this.fromAmount = amount;

        this._debouncedGetConversion("from");
    };

    setToAmount = (amount: number): void => {
        this.toAmount = amount;

        this._debouncedGetConversion("to");
    };

    setFromCoin = (coin: CmcCoin): void => {
        if (this.fromCoin && this.toCoin) {
            this.isLoading = true;
            this.isLoadingTo = true;
        }

        this.fromCoin = coin;

        this._debouncedGetConversion("from");
    };

    setToCoin = (coin: CmcCoin): void => {
        if (this.fromCoin && this.toCoin) {
            this.isLoading = true;
            this.isLoadingFrom = true;
        }

        this.toCoin = coin;

        this._debouncedGetConversion("to");
    };

    private calculateExchange = (fromAmount: number, fromPrice: number, toPrice: number) => {
        return (fromAmount * fromPrice) / toPrice;
    };

    private delay = (ms: number): Promise<void> => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    private _debouncedGetConversion = debounce((direction: ConversionDirection) => {
        this._getConversion(direction);
    }, CONVERSION_DEBOUNCE_MS);

    private _getConversion = async (direction: ConversionDirection): Promise<void> => {
        if (!this.fromCoin || !this.toCoin) return;

        try {
            if (direction === "from") {
                this.isLoadingTo = true;
            } else {
                this.isLoadingFrom = true;
            }

            this.isLoading = true;
            this.conversionError = null;

            await this.delay(CALCULATION_DELAY_MS);

            const result = await this.improvedGetConversion(direction, this.fromCoin, this.toCoin, this.fromAmount, this.toAmount);

            this.conversion = result;

            if (direction === "from") {
                this.toAmount = result?.toAmount ?? 0;
            } else {
                this.fromAmount = result?.fromAmount ?? 0;
            }
        } catch (e) {
            const errorMsg = "🚨 Error fetching conversion rate!";
            this.conversionError = errorMsg;
            toast.error(errorMsg);
            console.error(e);
        } finally {
            runInAction(() => {
                this.isLoading = false;

                this.isLoadingFrom = false;
                this.isLoadingTo = false;
            });
        }
    };

    private improvedGetConversion = async (direction: string, fromCoin: CmcCoin, toCoin: CmcCoin, fromAmount: number, toAmount: number) => {
        if (!fromCoin || !toCoin) return null;

        try {
            let calculatedAmount;

            if (direction === "from") {
                calculatedAmount = this.calculateExchange(fromAmount, fromCoin.price_usd, toCoin.price_usd);

                return {
                    direction: "from",
                    toAmount: calculatedAmount,
                    rate: fromCoin.price_usd / toCoin.price_usd,
                };
            } else {
                calculatedAmount = this.calculateExchange(toAmount, toCoin.price_usd, fromCoin.price_usd);

                return {
                    direction: "to",
                    fromAmount: calculatedAmount,
                    rate: toCoin.price_usd / fromCoin.price_usd,
                };
            }
        } catch (error) {
            console.error("Exchange calculation error:", error);
            return null;
        }
    };

    reverse = (): void => {
        if (this.fromCoin && this.toCoin) {
            this.isLoading = true;
            this.isLoadingTo = true;

            [this.fromCoin, this.toCoin] = [this.toCoin, this.fromCoin];
            [this.fromAmount, this.toAmount] = [this.toAmount, this.fromAmount];

            this._debouncedGetConversion("from");
        } else {
            toast.error("Two coins should be selected!");
        }
    };

    exchange = (): void => {
        if (this.fromAmount && this.toAmount && this.fromCoin && this.toCoin) {
            toast.success(
                `Exchange $${this.fromCoin?.symbol} (${this.fromAmount.toFixed(2)}) to $${this.toCoin?.symbol} (${this.toAmount.toFixed(2)})`
            );
        } else {
            toast.error("❌ Failed to exchange! Not all necessary data is provided.");
        }
    };
}
