import { Loader, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Overlay } from "./components/Overlay";
import { coinData } from "./constants/mockData";
import CryptoExchange from "./feature/CryptoExchange/CryptoExchange";
import type { CmcCoin } from "./models/CmcCoin";

const Root = styled.div`
    position: relative;

    height: 100dvh;
    width: 100dvw;

    display: flex;
    align-items: center;
    justify-content: center;

    padding-bottom: 80px;
`;
function App() {
    const [areCoinsLoading, setAreCoinLoading] = useState<boolean>(true);
    const [coins, setCoins] = useState<CmcCoin[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCoins(coinData);
            setAreCoinLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Root>
            <Overlay />

            {areCoinsLoading ? (
                <Loader size="xl" color="var(--color-gray-100)" type="dots" />
            ) : coins ? (
                <CryptoExchange coins={coins} />
            ) : (
                <Text size="xl">💀 Something went wrong while fetching coins!</Text>
            )}
        </Root>
    );
}

export default App;
