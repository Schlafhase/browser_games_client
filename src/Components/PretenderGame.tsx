import type SignalRService from "../SignalRService.ts";
import type Member from "../Classes/Member.ts";

function PretenderGame({connection, lobbyId, members}: {
    connection: SignalRService,
    lobbyId: string,
    members: Member[]
}) {
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