import { Center, Stack, Title } from '@mantine/core';
import BarLoader from './BarLoader';

interface LoadingScreenProps {
    message: string;
}

function LoadingScreen({ message }: LoadingScreenProps) {
    return (
        <Center h="100vh">
            <Stack>
                <div style={{ textAlign: 'center' }}>
                    <Title order={1}>{message}</Title>
                </div>
                <Center inline>
                    <BarLoader />
                </Center>
            </Stack>
        </Center>
    );
}

export default LoadingScreen;
