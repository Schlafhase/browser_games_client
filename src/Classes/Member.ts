class Member {
    public ConnectionId: string;
    public Username: string;
    
    constructor(connectionId: string, username: string) {
        this.ConnectionId = connectionId;
        this.Username = username;
    }
}

export default Member;