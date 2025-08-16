import type SignalRService from "../SignalRService.ts";

function PretenderGame({connection, lobbyId}: { connection: SignalRService, lobbyId: string }) {
    return (
        <>
            {lobbyId}
        </>
    )
}

export default PretenderGame;