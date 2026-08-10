
import {
    Search,
    MessageCircle,
    Send,
    ArrowLeft,
    Loader2,
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    getConversations,
    searchChatUsers,
    createConversation,
    getMessages,
} from "../../services/api/conversation.service";

import socket from "../../services/api/socket";

function Connections() {
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [conversations, setConversations] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [results, setResults] =
        useState([]);

    const [searching, setSearching] =
        useState(false);

    const [activeConversation, setActiveConversation] =
        useState(null);

    const [messages, setMessages] =
        useState([]);

    const [message, setMessage] =
        useState("");

    const [loadingMessages, setLoadingMessages] =
        useState(false);

    const searchTimeout =
        useRef(null);

    useEffect(() => {
        socket.connect();

        const loadConversations =
            async () => {
                try {
                    const response =
                        await getConversations();

                    setConversations(
                        response?.data || []
                    );
                } catch (error) {
                    console.error(
                        error
                    );
                }
            };

        loadConversations();

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const handleNewMessage =
            (newMessage) => {

                if (
                    newMessage.conversation !==
                    activeConversation?._id
                ) {
                    return;
                }

                setMessages(
                    (prev) => [
                        ...prev,
                        newMessage,
                    ]
                );
            };

        socket.on(
            "newMessage",
            handleNewMessage
        );

        return () => {
            socket.off(
                "newMessage",
                handleNewMessage
            );
        };
    }, [
        activeConversation,
    ]);

    const handleSearch = (
        value
    ) => {

        setSearch(value);

        clearTimeout(
            searchTimeout.current
        );

        if (!value.trim()) {
            setResults([]);
            return;
        }

        searchTimeout.current =
            setTimeout(
                async () => {

                    try {

                        setSearching(
                            true
                        );

                        const response =
                            await searchChatUsers(
                                value.trim()
                            );

                        setResults(
                            response?.data ||
                            []
                        );

                    } catch (error) {

                        console.error(
                            error
                        );

                        setResults([]);

                    } finally {

                        setSearching(
                            false
                        );

                    }

                },
                350
            );
    };

    const openConversation =
        async (userId) => {

            try {

                const response =
                    await createConversation(
                        userId
                    );

                const conversation =
                    response.data;

                setActiveConversation(
                    conversation
                );

                socket.emit(
                    "joinConversation",
                    conversation._id
                );

                setSearch("");
                setResults([]);

                setLoadingMessages(
                    true
                );

                const messagesResponse =
                    await getMessages(
                        conversation._id
                    );

                setMessages(
                    messagesResponse?.data ||
                    []
                );

                setConversations(
                    (prev) => {

                        const exists =
                            prev.some(
                                (item) =>
                                    item._id ===
                                    conversation._id
                            );

                        if (exists) {
                            return prev;
                        }

                        return [
                            conversation,
                            ...prev,
                        ];
                    }
                );

            } catch (error) {

                console.error(
                    error
                );

                alert(
                    error.response?.data
                        ?.message ||
                    "Unable to start conversation."
                );

            } finally {

                setLoadingMessages(
                    false
                );

            }
        };

    const sendMessage = () => {

        if (
            !message.trim() ||
            !activeConversation
        ) {
            return;
        }

        const otherUser =
            activeConversation.participants.find(
                (participant) =>
                    participant._id !==
                    user._id
            );

        socket.emit(
            "sendMessage",
            {
                conversationId:
                    activeConversation._id,
                senderId:
                    user._id,
                receiverId:
                    otherUser?._id,
                content:
                    message.trim(),
            }
        );

        setMessage("");
    };

    const getOtherUser = (
        conversation
    ) => {

        return conversation.participants.find(
            (participant) =>
                participant._id !==
                user._id
        );
    };

    return (
        <div className="flex h-[calc(100vh-48px)] overflow-hidden rounded-3xl border border-white/10 bg-[#0B1023]">

            <div
                className={`w-full border-r border-white/10 md:w-[360px] ${
                    activeConversation
                        ? "hidden md:block"
                        : "block"
                }`}
            >

                <div className="border-b border-white/10 p-6">

                    <h1 className="text-2xl font-bold text-white">
                        Connections
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Search and start a conversation
                    </p>

                    <div className="relative mt-5">

                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                        />

                        <input
                            value={search}
                            onChange={(e) =>
                                handleSearch(
                                    e.target.value
                                )
                            }
                            placeholder={
                                user?.activeRole ===
                                "startup_builder"
                                    ? "Search professionals or investors..."
                                    : "Search startups..."
                            }
                            className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
                        />

                    </div>

                </div>

                {search.trim() && (
                    <div className="border-b border-white/10 p-3">

                        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
                            Search Results
                        </p>

                        {searching ? (

                            <div className="flex items-center justify-center py-8">

                                <Loader2
                                    size={20}
                                    className="animate-spin text-violet-400"
                                />

                            </div>

                        ) : results.length === 0 ? (

                            <p className="px-3 py-6 text-center text-sm text-slate-600">
                                No eligible connections found.
                            </p>

                        ) : (

                            <div className="space-y-1">

                                {results.map(
                                    (result) => (

                                        <button
                                            key={
                                                result._id
                                            }
                                            onClick={() =>
                                                openConversation(
                                                    result.type ===
                                                    "startup"
                                                        ? result.founder?._id
                                                        : result._id
                                                )
                                            }
                                            className="flex w-full items-center gap-3 rounded-2xl p-3 text-left transition hover:bg-white/5"
                                        >

                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-sm font-bold text-white">

                                                {result.type ===
                                                "startup"
                                                    ? result.name
                                                          ?.charAt(
                                                              0
                                                          )
                                                          .toUpperCase()
                                                    : result.name
                                                          ?.charAt(
                                                              0
                                                          )
                                                          .toUpperCase()}

                                            </div>

                                            <div className="min-w-0">

                                                <p className="truncate text-sm font-semibold text-white">

                                                    {
                                                        result.name
                                                    }

                                                </p>

                                                <p className="truncate text-xs capitalize text-slate-500">

                                                    {result.type ===
                                                    "startup"
                                                        ? `${result.stage?.replace(
                                                              "_",
                                                              " "
                                                          )} • Startup`
                                                        : result.activeRole?.replace(
                                                              "_",
                                                              " "
                                                          )}

                                                </p>

                                            </div>

                                        </button>

                                    )
                                )}

                            </div>

                        )}

                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-3">

                    <p className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Recent Chats
                    </p>

                    {conversations.length ===
                    0 ? (

                        <div className="px-5 py-16 text-center">

                            <MessageCircle
                                size={32}
                                className="mx-auto text-slate-700"
                            />

                            <p className="mt-4 text-sm text-slate-500">
                                No conversations yet.
                            </p>

                        </div>

                    ) : (

                        <div className="space-y-1">

                            {conversations.map(
                                (conversation) => {

                                    const otherUser =
                                        getOtherUser(
                                            conversation
                                        );

                                    return (
                                        <button
                                            key={
                                                conversation._id
                                            }
                                            onClick={async () => {

                                                setActiveConversation(
                                                    conversation
                                                );

                                                socket.emit(
                                                    "joinConversation",
                                                    conversation._id
                                                );

                                                const response =
                                                    await getMessages(
                                                        conversation._id
                                                    );

                                                setMessages(
                                                    response?.data ||
                                                    []
                                                );
                                            }}
                                            className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${
                                                activeConversation?._id ===
                                                conversation._id
                                                    ? "bg-white/10"
                                                    : "hover:bg-white/5"
                                            }`}
                                        >

                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-sm font-bold text-white">

                                                {otherUser?.fullName
                                                    ?.charAt(
                                                        0
                                                    )
                                                    .toUpperCase()}

                                            </div>

                                            <div className="min-w-0">

                                                <p className="truncate text-sm font-semibold text-white">

                                                    {
                                                        otherUser?.fullName
                                                    }

                                                </p>

                                                <p className="truncate text-xs text-slate-600">

                                                    {conversation.lastMessage?.content ||
                                                        "Start chatting"}

                                                </p>

                                            </div>

                                        </button>
                                    );
                                }
                            )}

                        </div>

                    )}

                </div>

            </div>

            <div
                className={`flex flex-1 flex-col ${
                    activeConversation
                        ? "flex"
                        : "hidden md:flex"
                }`}
            >

                {!activeConversation ? (

                    <div className="flex flex-1 flex-col items-center justify-center">

                        <MessageCircle
                            size={52}
                            className="text-slate-700"
                        />

                        <h2 className="mt-5 text-lg font-semibold text-white">
                            Start a conversation
                        </h2>

                        <p className="mt-2 max-w-sm text-center text-sm text-slate-600">
                            Search for a startup or connection to start chatting.
                        </p>

                    </div>

                ) : (

                    <>
                        <div className="flex items-center gap-4 border-b border-white/10 px-6 py-5">

                            <button
                                onClick={() =>
                                    setActiveConversation(
                                        null
                                    )
                                }
                                className="rounded-xl p-2 text-slate-400 hover:bg-white/5 hover:text-white md:hidden"
                            >
                                <ArrowLeft
                                    size={20}
                                />
                            </button>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 font-bold text-white">

                                {getOtherUser(
                                    activeConversation
                                )
                                    ?.fullName
                                    ?.charAt(
                                        0
                                    )
                                    .toUpperCase()}

                            </div>

                            <div>

                                <h2 className="font-semibold text-white">

                                    {
                                        getOtherUser(
                                            activeConversation
                                        )
                                            ?.fullName
                                    }

                                </h2>

                                <p className="text-xs capitalize text-slate-500">

                                    {getOtherUser(
                                        activeConversation
                                    )
                                        ?.activeRole
                                        ?.replace(
                                            "_",
                                            " "
                                        )}

                                </p>

                            </div>

                        </div>

                        <div className="flex-1 overflow-y-auto p-6">

                            {loadingMessages ? (

                                <div className="flex h-full items-center justify-center">

                                    <Loader2
                                        size={22}
                                        className="animate-spin text-violet-400"
                                    />

                                </div>

                            ) : messages.length ===
                              0 ? (

                                <div className="flex h-full items-center justify-center">

                                    <p className="text-sm text-slate-600">
                                        Start the conversation.
                                    </p>

                                </div>

                            ) : (

                                <div className="space-y-3">

                                    {messages.map(
                                        (item) => {

                                            const own =
                                                item.sender?._id ===
                                                user._id;

                                            return (
                                                <div
                                                    key={
                                                        item._id
                                                    }
                                                    className={`flex ${
                                                        own
                                                            ? "justify-end"
                                                            : "justify-start"
                                                    }`}
                                                >

                                                    <div
                                                        className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                                                            own
                                                                ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white"
                                                                : "bg-white/5 text-slate-300"
                                                        }`}
                                                    >
                                                        {
                                                            item.content
                                                        }
                                                    </div>

                                                </div>
                                            );
                                        }
                                    )}

                                </div>

                            )}

                        </div>

                        <div className="border-t border-white/10 p-4">

                            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4">

                                <input
                                    value={
                                        message
                                    }
                                    onChange={(e) =>
                                        setMessage(
                                            e.target.value
                                        )
                                    }
                                    onKeyDown={(e) => {

                                        if (
                                            e.key ===
                                            "Enter"
                                        ) {
                                            sendMessage();
                                        }

                                    }}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent py-4 text-sm text-white outline-none placeholder:text-slate-600"
                                />

                                <button
                                    onClick={
                                        sendMessage
                                    }
                                    className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 p-3 text-white transition hover:scale-105"
                                >

                                    <Send
                                        size={18}
                                    />

                                </button>

                            </div>

                        </div>
                    </>
                )}

            </div>

        </div>
    );
}

export default Connections;