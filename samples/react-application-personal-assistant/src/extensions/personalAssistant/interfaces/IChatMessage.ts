export interface IChatMessage {
    position: string;
    type: string;
    avatar?: string;
    title: string;
    text: string | JSX.Element;
    msg?: string;
    date: Date;
    focus?: boolean;
    status? : "waiting" | "sent" | "received" | "read";
    className?: string;
}