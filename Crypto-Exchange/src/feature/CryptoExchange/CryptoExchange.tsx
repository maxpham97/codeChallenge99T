import { Box, Skeleton, Text } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { ConnectionLine } from "../../components/ConnectionLine";
import { CryptoInput } from "../../components/CryptoInput";
import { ExchangeButton } from "../../components/ExchangeButton";
import { ReverseButton } from "../../components/ReverseButton";
import type { CmcCoin } from "../../models/CmcCoin";
import { CryptoExchangeStore } from "../../store/CryptoExchangeStore";
import { ConversionInfoBlock, ExchangeBlock, Label, ReverseButtonWrapper, Root } from "./CryptoExchange.styles";

interface Props {
    coins: CmcCoin[];
}

const CryptoExchange = observer((props: Props) => {
    const { coins } = props;

    const cryptoExchangeStore = useMemo(() => new CryptoExchangeStore(coins), [coins]);

    const {
        toCoin,
        fromCoin,
        toAmount,
        isLoading,
        fromAmount,
        conversion,
        isLoadingTo,
        isLoadingFrom,
        conversionError,
        reverse,
        exchange,
        setToCoin,
        setFromCoin,
        setToAmount,
        setFromAmount,
    } = cryptoExchangeStore;

    return (
        <Root>
            <Label>Crypto Exchange Widget</Label>
            <ExchangeBlock>
                {/* From input */}
                <CryptoInput
                    coins={coins}
                    coin={fromCoin}
                    label="You Send"
                    amount={fromAmount}
                    loading={isLoadingFrom}
                    setCoin={setFromCoin}
                    setAmount={setFromAmount}
                />

                <ConnectionLine $left="32%" />
                <ConnectionLine $left="38%" />

                <ReverseButtonWrapper>
                    <ReverseButton onClick={reverse} />
                </ReverseButtonWrapper>

                {/* To input */}
                <CryptoInput
                    coins={coins}
                    coin={toCoin}
                    label="You Get"
                    amount={toAmount}
                    loading={isLoadingTo}
                    setCoin={setToCoin}
                    setAmount={setToAmount}
                />

                <ConversionInfoBlock>
                    <Box>
                        {isLoading && <Skeleton w={200} h={20} />}
                        {conversionError && (
                            <Text size="sm" c="red">
                                {conversionError}
                            </Text>
                        )}
                        {!isLoading && !conversionError && conversion && (
                            <Text size="sm">
                                🔄 1 {fromCoin?.symbol} = {conversion.rate.toFixed(6)} {toCoin?.symbol}
                            </Text>
                        )}
                    </Box>

                    <ExchangeButton loading={isLoading} disabled={Boolean(conversionError || !conversion)} onClick={exchange} />
                </ConversionInfoBlock>
            </ExchangeBlock>
        </Root>
    );
});

export default CryptoExchange;
