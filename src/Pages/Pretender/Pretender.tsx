import {useState} from "react";
import PretenderGame from "../../Components/PretenderGame.tsx";
import useError from "../../Hooks/useError.ts";
import useLobby from "../../Hooks/useLobby.ts";
import useSignalR from "../../Hooks/useSignalR.ts";
import LoadingScreen from "../../Components/LoadingScreen.tsx";
import LobbyJoinForm from "../../Components/LobbyJoinForm.tsx";

const hubUrl: string = import.meta.env.DEV ? "http://localhost:5000/api/pretenderHub" : "/api/pretenderHub";

function Pretender() {
    const error = useError();
    const {connection} = useSignalR(hubUrl, error.show);
    const {lobbyId, isJoined, createLobby, joinLobby, members} = useLobby(connection);

    const [username, setUsername] = useState<string>("");
    const [usernameError, setUsernameError] = useState<string | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [loadingText, setLoadingText] = useState<string>("Loading...");

    // Logic

    const handleUsernameChange = (value: string) => {
        setUsernameError(null);
        setUsername(value.slice(0, 20));
    };

    const validateUsername = (): boolean => {
        if (username.trim() === '') {
            setUsernameError('Username is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateUsername()) return;

        setLoading(true);
        
        try {
            if (lobbyId) {
                setLoadingText('Joining Lobby...');
                await joinLobby(lobbyId, username.trim());
            } else {
                setLoadingText('Creating Lobby...');
                await createLobby(username.trim());
            }
            setLoading(false);
        }
        catch (e) {
            if ((e as Error).message.startsWith("Server timed out")) {
                error.show("Server timed out");
            }
            else {
                error.show(lobbyId ? "Failed to join lobby" : "Failed to create lobby", (e as Error).message);
            }
        }
    };

    // Render

    let content = <></>;

    if (loading) {
        content = (
            <LoadingScreen message={loadingText}/>
        )
    } else if (!isJoined) {
        content = (
            <LobbyJoinForm username={username}
                           usernameError={usernameError}
                           isLoading={loading}
                           hasLobbyId={!!lobbyId}
                           onUsernameChange={handleUsernameChange}
                           onUsernameBlur={validateUsername}
                           onSubmit={handleSubmit}/>
        );
    } else if (isJoined && lobbyId) {
        content = (
            <PretenderGame connection={connection}
                           lobbyId={lobbyId}
                           members={members}></PretenderGame>
        )
    }

    return [<title>Pretender | Games at schlafhase.uk</title>,
        content];
}


export default Pretender;