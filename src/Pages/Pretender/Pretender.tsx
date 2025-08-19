/* eslint-disable react-hooks/exhaustive-deps */
import {Button, Center, Stack, TextInput, Title} from "@mantine/core";
import {useSearchParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import SignalRService from "../../SignalRService.ts";
import BarLoader from "../../Components/BarLoader.tsx";
import Error from "../../Components/Error.tsx";
import PretenderGame from "../../Components/PretenderGame.tsx";
import  Member from "../../Classes/Member.ts";

const hubUrl: string = import.meta.env.DEV ? "http://localhost:5000/api/pretenderHub" : "/api/pretenderHub";
const pretenderHubConnection = new SignalRService(hubUrl);

function Pretender() {
    const firstRender = useRef(true);

    const [searchParams, setSearchParams] = useSearchParams();

    const [username, setUsername] = useState<string>("");
    const [usernameError, setUsernameError] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [errorDetails, setErrorDetails] = useState<string | null>(null);
    const hasError = useRef(false);

    const [lobbyId, setLobbyId] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingText, setLoadingText] = useState<string>("Creating Lobby...");

    const [joinedLobby, setJoinedLobby] = useState<boolean>(false);
    const [disableButton, setDisableButton] = useState<boolean>(false);
    
    const members = useRef<Member[]>([]);

    // Logic
    useEffect(() => {
        if (!firstRender.current) {
            return;
        }

        firstRender.current = false;
        const _lobbyId = searchParams.get('lobbyId');
        setLobbyId(_lobbyId);

        pretenderHubConnection.stop().then(async () => {
            try {
                await pretenderHubConnection.start();
                pretenderHubConnection.onclose((e) => {
                    dispatchError("Connection closed unexpectedly", e?.message)
                });
            } catch (e) {
                dispatchError("Failure establishing connection", (e as Error).message);
                return;
            }
        }, (e) => {
            console.log(pretenderHubConnection.state);
            dispatchError("Failure establishing connection", e);
        });

        return () => {
            pretenderHubConnection.stop().then();
        };
    }, []);


    // Render

    let content = <></>;

    if (error) {
        content = <Error error={error}
                         errorDetails={errorDetails}/>;
        console.log("stopping coz error")
        pretenderHubConnection.stop().then();
    } else if (loading) {
        content = (
            <Center h="100vh">
                <Stack>
                    <div style={{textAlign: 'center'}}>
                        <Title order={1}>{loadingText}</Title>
                    </div>
                    <Center inline>
                        <BarLoader/>
                    </Center>
                </Stack>
            </Center>
        )
    } else if (!joinedLobby) {
        content = (
            <Center h="100vh">
                <Stack gap={"xs"}>
                    <TextInput value={username}
                               placeholder={"Username"}
                               onChange={(e) => usernameChanged(e.currentTarget.value)}
                               onBlur={validateUsername}
                               error={usernameError}/>
                    <Button onClick={lobbyId ? joinLobby : createLobby}
                            disabled={disableButton}>
                        {lobbyId ? "Join Lobby" : "Create Lobby"}
                    </Button>
                </Stack>
            </Center>
        );
    } else if (joinedLobby && lobbyId) {
        content = (
            <PretenderGame connection={pretenderHubConnection} lobbyId={lobbyId}
                           dispatchError={dispatchError} initialMembers={members.current}></PretenderGame>
        )
    }

    return [<title>Pretender | Games at schlafhase.uk</title>,
        content];

    // Functions

    function usernameChanged(value: string) {
        setUsernameError(null);
        setUsername(value.slice(0, 20));
    }

    function validateUsername() {
        if (username === "") {
            setUsernameError("Username is required");
        }
    }

    async function joinLobby() {
        if (username === "") {
            setUsernameError("Username is required");
            return;
        }

        if (!lobbyId) {
            dispatchError("No lobby ID provided");
            return;
        }

        setDisableButton(true);
        let serverResponded = false;

        pretenderHubConnection.on("ReceiveLobbyInformation", (m: Record<string, string>) => {
            pretenderHubConnection.off("ReceiveLobbyInformation");
            
            setLoading(false);
            setJoinedLobby(true);
            serverResponded = true;
            
            members.current = Object.keys(m).map((key: string) => new Member(key, m[key]));
            console.log(m)
            console.log("Joined lobby with ID:", lobbyId);
        });

        try {
            setLoading(true);
            setLoadingText("Joining Lobby...");
            await pretenderHubConnection.invoke("JoinLobby", lobbyId, username)
        } catch (e) {
            console.error("Failed to join lobby: ", e);
            dispatchError("Failed to join lobby", (e as Error).message);
        }

        setTimeout(() => {
            if (!serverResponded) {
                dispatchError("Server timed out while joining lobby");
                pretenderHubConnection.off("ReceiveLobbyInformation");
            }
        }, 5000);
    }

    async function createLobby() {
        if (username === "") {
            setUsernameError("Username is required");
            return;
        }

        setDisableButton(true);
        let serverResponded = false;

        pretenderHubConnection.on("LobbyCreated", (lobbyId: string) => {
            pretenderHubConnection.off("LobbyCreated");
            
            members.current = [{ConnectionId: pretenderHubConnection.connectionId!, Username: username}];
            setLoading(false);
            setJoinedLobby(true);
            serverResponded = true;
            
            setLobbyId(lobbyId);
            setSearchParams({lobbyId: lobbyId});
            console.log("Lobby created with ID:", lobbyId);
        });

        try {
            setLoading(true);
            setLoadingText("Creating Lobby...");
            await pretenderHubConnection.invoke("CreateLobby", username);
        } catch (e) {
            dispatchError("Failed to create lobby", (e as Error).message);
            return;
        }

        setTimeout(() => {
            if (!serverResponded) {
                dispatchError("Server timed out while creating lobby");
                pretenderHubConnection.off("LobbyCreated");
            }
        }, 5000);
    }

    function dispatchError(message: string, details: string | null = null) {
        if (hasError.current) {
            return;
        }

        setError(message);
        setErrorDetails(details);
        hasError.current = true;
    }
}


export default Pretender;