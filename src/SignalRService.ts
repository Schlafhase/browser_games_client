import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';

class SignalRService {
    private connection: HubConnection;

    constructor(hubUrl: string) {
        this.connection = new HubConnectionBuilder()
            .withUrl(hubUrl)
            .withStatefulReconnect()
            .build();
        
        this.connection.onclose((e) => this.log(`SignalR connection closed: ${e}`));
        this.connection.onreconnecting((e) => this.log(`SignalR connection reconnecting: ${e}`));
        this.connection.onreconnected((connectionId) => this.log(`SignalR connection reconnected: ${connectionId}`));
    }

    get state() {
        return this.connection.state;
    }
    
    get connectionId() {
        return this.connection.connectionId;
        }

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
            this.log(`SignalR Connected`);
        } catch (e) {
            this.error(`SignalR Connection Error: ${e}`);
            throw e;
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
        } catch (e) {
            this.error(`Error invoking method ${methodName}: ${e}`)
            throw e;
        }
    };

    send = async (methodName: string, ...args: any[]) => {
        try {
            await this.connection.send(methodName, ...args);
        } catch (e) {
            this.error(`Error sending method ${methodName}: ${e}`);
            throw e;
        }
    }

    stop = async () => {
        try {
            await this.connection.stop();
        } catch (e) {
            this.error(`Error stopping SignalR connection: ${e}`);
            throw e;
        }
    };
    
    private log(message: string) {
        console.log(`%c[${this.connection.baseUrl} ${this.state}] ${message}`, "background: darkblue; color: white;");
    }
    
    private error(message: string) {
        console.error(`%c[${this.connection.baseUrl} ${this.state}] ${message}`, "background: red; color: white;");
    }
}

export default SignalRService;