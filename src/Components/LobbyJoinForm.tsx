import { Button, Center, Stack, TextInput } from '@mantine/core';

interface LobbyJoinFormProps {
    username: string;
    usernameError: string | null;
    isLoading: boolean;
    hasLobbyId: boolean;
    onUsernameChange: (value: string) => void;
    onUsernameBlur: () => void;
    onSubmit: () => void;
}

function LobbyJoinForm({
                           username,
                           usernameError,
                           isLoading,
                           hasLobbyId,
                           onUsernameChange,
                           onUsernameBlur,
                           onSubmit
                       }: LobbyJoinFormProps) {
    return (
        <Center h="100vh">
            <Stack gap="xs">
                <TextInput
                    value={username}
                    placeholder="Username"
                    onChange={(e) => onUsernameChange(e.currentTarget.value)}
                    onBlur={onUsernameBlur}
                    error={usernameError}
                    onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
                />
                <Button onClick={onSubmit} disabled={isLoading || !!usernameError}>
                    {hasLobbyId ? "Join Lobby" : "Create Lobby"}
                </Button>
            </Stack>
        </Center>
    );
}

export default LobbyJoinForm;