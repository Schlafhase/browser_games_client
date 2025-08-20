/* eslint-disable react-hooks/exhaustive-deps */
import {useCallback, useState} from 'react';
import type SignalRService from '../SignalRService';
import type Member from '../Classes/Member';
import {useSearchParams} from "react-router-dom";
import useFirstRenderLogic from "./useFirstRenderLogic.ts";

function useLobby(connection: SignalRService) {
    const [searchParams, setSearchParams] = useSearchParams();

    const [lobbyId, setLobbyId] = useState<string | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const [isJoined, setIsJoined] = useState(false);
    
    useFirstRenderLogic(() => {
        setLobbyId(searchParams.get('lobbyId'));
    });
    
    const registerLobbyEvents = useCallback(() => {
        connection.on("MemberJoined", (connectionId: string, username: string) => {
            setMembers(prevMembers => [
                ...prevMembers,
                { ConnectionId: connectionId, Username: username }
            ]);
        })
        connection.on("MemberLeft", (connectionId: string) => {
            setMembers(prevMembers => prevMembers.filter(member => member.ConnectionId !== connectionId));
        });
    }, []);

    const createLobby = useCallback(async (username: string): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            const timeout = setTimeout(() => {
                connection.off("LobbyCreated");
                const e = new Error("Server timed out");
                reject(e);
            }, 5000);

            connection.on("LobbyCreated", (newLobbyId: string) => {
                clearTimeout(timeout);
                connection.off("LobbyCreated");

                setMembers([{
                    ConnectionId: connection.connectionId!,
                    Username: username
                }]);
                registerLobbyEvents();
                setLobbyId(newLobbyId);
                setSearchParams({lobbyId: newLobbyId}, {replace: true});
                setIsJoined(true);
                resolve(newLobbyId);
            });

            connection.invoke("CreateLobby", username).catch(e => {
                clearTimeout(timeout);
                connection.off("LobbyCreated");
                reject(e);
            });
        });
    }, []);

    const joinLobby = useCallback(async (lobbyId: string, username: string) => {
        return new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
                connection.off("ReceiveLobbyInformation");
                reject(new Error("Server timed out"));
            }, 5000);

            connection.on("ReceiveLobbyInformation", (memberMap: Record<string, string>) => {
                clearTimeout(timeout);
                connection.off("ReceiveLobbyInformation");

                setMembers(Object.entries(memberMap).map(([id, name]) => ({
                    ConnectionId: id,
                    Username: name
                })));
                registerLobbyEvents();
                setLobbyId(lobbyId);
                setIsJoined(true);
                resolve();
            });

            connection.invoke("JoinLobby", lobbyId, username).catch(e => {
                clearTimeout(timeout);
                connection.off("ReceiveLobbyInformation");
                reject(e);
            });
        });
    }, []);

    return {
        lobbyId,
        members,
        isJoined,
        createLobby,
        joinLobby,
        setMembers
    };
}

export default useLobby;