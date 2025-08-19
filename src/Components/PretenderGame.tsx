/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useRef, useState} from "react";
import type SignalRService from "../SignalRService.ts";
import type Member from "../Classes/Member.ts";

function PretenderGame({connection, lobbyId, dispatchError, initialMembers = []}: {
    connection: SignalRService,
    lobbyId: string,
    dispatchError: (message: string, details?: string) => void,
    initialMembers: Member[]
}) {
    const firstRender = useRef(true);

    const [members, setMembers] = useState<Member[]>(initialMembers);

    useEffect(() => {
        if (!firstRender.current) return;
        firstRender.current = false;

        connection.on("MemberJoined", (connectionId: string, username: string) => {
            setMembers(prevMembers => [...prevMembers, {ConnectionId: connectionId, Username: username}]);
        });
    }, [])

    return (
        <>
            {lobbyId} 
            <br/> 
            {connection.state}
            <br/>
            <big>Members</big>
            {members.map((member, index) => (
                <div key={index}>
                    {member.Username} ({member.ConnectionId})
                </div>
            ))}
        </>
    )
}

export default PretenderGame;