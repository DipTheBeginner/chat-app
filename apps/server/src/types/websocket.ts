export type ClientMessage =
    | {
        type: "join-group";
        groupId: string;
    }
    | {
        type: "leave-group";
        groupId: string;
    }
    | {
        type: "send-message";
        groupId: string;
        content: string;
    };