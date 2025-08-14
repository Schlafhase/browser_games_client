import {HubConnection, HubConnectionBuilder, HubConnectionState} from '@microsoft/signalr';

class SignalRService {
    private connection: HubConnection;

    constructor(hubUrl: string) {
        this.connection = new HubConnectionBuilder()
            .withUrl(hubUrl)
            .withStatefulReconnect()
            .build();
    }
    
    state = () => this.connection.state;

    onclose = (callback: (error?: Error) => void) => {
        this.connection.onclose(callback);
    };

    onreconnecting = (callback: (error?: Error) => void) => {
        this.connection.onreconnecting(callback);
    };

    onreconnected = (callback: (connectionId?: string) => void) => {
        this.connection.onreconnected(callback);
    };

    start = async () => {
        try {
            await this.connection.start();
            console.log('SignalR Connected');
        } catch (err) {
            console.error('SignalR Connection Error: ', err);
            throw err;
        }
    };

    on = (methodName: string, newMethod: (...args: any[]) => void) => {
        this.connection.on(methodName, newMethod);
    };
    
    off = (methodName: string) => {
        this.connection.off(methodName);
    }

    invoke = async (methodName: string, ...args: any[]) => {
        try {
            await this.connection.invoke(methodName, ...args);
        } catch (error) {
            console.error(`Error invoking method ${methodName}:`, error)
            throw error;
        }
    };

    send = async (methodName: string, ...args: any[]) => {
        try {
            await this.connection.send(methodName, ...args);
        } catch (error) {
            console.error(`Error sending method ${methodName}:`, error);
            throw error;
        }
    }

    stop = async () => {
        try {
            await this.connection.stop();
        }
        catch (error) {
            console.error('Error stopping SignalR connection:', error);
            throw error;
        }
    };
}

export default SignalRService;