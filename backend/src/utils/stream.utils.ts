// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Streamable = { write: (str: string) => Promise<any> };

type StreamEventType = "text" | "loading" | "error";

type StreamEvent =
    | { type: "text"; content: string }
    | { type: "loading"; content: string | null }
    | { type: "error"; content: string };

export function streamEvent(stream: Streamable, event: StreamEvent): Promise<void> {
    return stream.write(JSON.stringify(event) + "\n");
}

export function streamText(stream: Streamable, content: string): Promise<void> {
    return streamEvent(stream, { type: "text", content });
}

export function streamLoading(stream: Streamable, content: string | null): Promise<void> {
    return streamEvent(stream, { type: "loading", content });
}

export function streamError(stream: Streamable, content: string): Promise<void> {
    return streamEvent(stream, { type: "error", content });
}

export type { StreamEventType, StreamEvent };
