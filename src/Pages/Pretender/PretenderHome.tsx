import {Center, Stack, Title} from "@mantine/core";
import {useSearchParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import SignalRService from "../../SignalRService.ts";
import BarLoader from "../../Components/BarLoader.tsx";

const hubUrl: string = import.meta.env.DEV ? "http://localhost:5000/pretenderHub" : "/pretenderHub";
const pretenderHubConnection = new SignalRService(hubUrl);

function PretenderHome() {
    // TODO: Enter username first
    const username: string = "";
    const [error, setError] = useState<string | null>(null);
    const firstRender = useRef(true);
    const [lobbyId, setLobbyId] = useState<string | null>(null)

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (!firstRender.current) {
            return;
        }
        firstRender.current = false;
        
        setLobbyId(searchParams.get('lobbyId'));
        console.log("pretenderHome");
        pretenderHubConnection.start().then(async () => {
            if (!lobbyId) {
                let serverResponded = false;
                pretenderHubConnection.on("LobbyCreated", (lobbyId: string) => {
                    console.log("Lobby created with ID:", lobbyId);
                    serverResponded = true;
                    setLobbyId(lobbyId);
                    setSearchParams({lobbyId: lobbyId});
                });

                try {
                    await pretenderHubConnection.invoke("CreateLobby")
                } catch {
                    setError("Failed to create lobby");
                    return;
                }

                setTimeout(() => {
                    if (!serverResponded) {
                        setError("Server timed out while creating lobby");
                        pretenderHubConnection.off("LobbyCreated");
                    }
                }, 5000);
            }
        }, () => {
            console.log(pretenderHubConnection.state());
            setError("Failure establishing connection");
        });
    }, []);

    if (error) {
        return (
            <Center h="100vh">
                <Stack>
                    <div style={{textAlign: 'center'}}>
                        <Title order={1}>Something went wrong</Title>
                        <p>{error}</p>
                    </div>
                </Stack>
            </Center>
        )
    }

    if (!lobbyId) {
        return (
            <Center h="100vh">
                <Stack>
                    <div style={{textAlign: 'center'}}>
                        <Title order={1}>Creating Lobby...</Title>
                    </div>
                    <Center inline>
                        <BarLoader/>
                    </Center>
                </Stack>
            </Center>
        )
    }
}

export default PretenderHome;