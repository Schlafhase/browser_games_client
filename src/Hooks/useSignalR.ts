/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import SignalRService from '../SignalRService';

function useSignalR(hubUrl: string, handleError?: (message: string, details?: string) => void) {
    const [connection] = useState(() => new SignalRService(hubUrl));
    const [isConnected, setIsConnected] = useState(false);
    
    const _handleError = handleError || (() => {});

    useEffect(() => {
        const startConnection = async () => {
            try {
                await connection.start();
                setIsConnected(true);

                connection.onclose((e) => {
                    setIsConnected(false);
                    _handleError("Connection closed", e?.message);
                });
            } catch (e) {
                _handleError("Failed to establish connection", (e as Error).message);
            }
        };

        startConnection().then();

        return () => {
            connection.stop().then();
        };
    }, []);

    return { connection, isConnected };
}

export default useSignalR;