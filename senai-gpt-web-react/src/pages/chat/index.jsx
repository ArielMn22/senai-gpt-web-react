import "./chat.css";
import logo from "../../assets/imgs/Chat.png";
import logoWhite from "../../assets/imgs/ChatWhite.png";
import example from "../../assets/imgs/example.svg";
import exampleWhite from "../../assets/imgs/example-white.svg";
import sendIcon from "../../assets/imgs/send.svg";
import sendIconWhite from "../../assets/imgs/send-white.svg";

import { useEffect, useState } from "react";

function Chat() {
    const [chats, setChats] = useState([]);
    const [chatSelecionado, setChatSelecionado] = useState(null);
    const [mensagens, setMensagens] = useState([]);
    const [userMessage, setUserMessage] = useState("");
    const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const rascunho = localStorage.getItem("rascunhoMensagem");
        if (rascunho) setUserMessage(rascunho);

        getChats();

        const modoEscuro = localStorage.getItem("darkMode");
        if (modoEscuro === "true") {
            setDarkMode(true);
            document.body.classList.add("dark-mode");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("rascunhoMensagem", userMessage);
    }, [userMessage]);

    const getChats = async () => {
        const res = await fetch("https://senai-gpt-api.azurewebsites.net/chats", {
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("meuToken")}`
             }
        });
        const json = await res.json();
        const userId = localStorage.getItem("meuId");
        setChats(json.filter(chat => chat.userId === userId));
    };

    const getMensagens = async (chatId) => {
        const res = await fetch(`https://senai-gpt-api.azurewebsites.net/messages?chatId=${chatId}`, {
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("meuToken")}`
             }
        });
        const json = await res.json();
        setMensagens(json);
    };

    const clickChat = async (chat) => {
        setChatSelecionado(chat);
        setIsLeftPanelOpen(false);
        await getMensagens(chat.id);
    };

    const chatGPT = async (msg) => {
        return "[Mensagem fixa]";
    };

    const enviarMensagem = async (msg) => {
        if (!msg.trim()) return;

        let chatAtual = chatSelecionado;

        if (!chatSelecionado) {
            chatAtual = await novoChat();
        }

        const userId = localStorage.getItem("meuId");

        const novaMsgUsuario = {
            chatId: chatAtual.id,
            userId,
            text: msg,
            id: crypto.randomUUID()
        };

        const resposta = await chatGPT(msg);
        const novaMsgBot = {
            chatId: chatAtual.id,
            userId: "chatbot",
            text: resposta,
            id: crypto.randomUUID()
        };

        await fetch("https://senai-gpt-api.azurewebsites.net/messages", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("meuToken")}`
             },
            body: JSON.stringify(novaMsgUsuario)
        });

        await fetch("https://senai-gpt-api.azurewebsites.net/messages", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("meuToken")}`
             },
            body: JSON.stringify(novaMsgBot)
        });

        setUserMessage("");
        await getMensagens(chatAtual.id);
        await getChats();
    };

    const novoChat = async () => {
        const nome = prompt("Digite o nome do novo chat:");
        if (!nome) {
            alert("Nome inválido.");
            return;
        }

        const userId = localStorage.getItem("meuId");
        const novo = {
            chatTitle: nome,
            userId
        };

        const res = await fetch("https://senai-gpt-api.azurewebsites.net/chats", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("meuToken")}`
            },
            body: JSON.stringify(novo)
        });

        const chatCriado = await res.json();
        setChatSelecionado(chatCriado);
        setMensagens([]);
        setUserMessage("");
        await getChats();
        return chatCriado;
    };

    const deletarChat = async () => {
        const confirmacao = window.confirm("Você tem certeza que deseja deletar este chat?");
        if (!confirmacao || !chatSelecionado) return;

        await fetch(`https://senai-gpt-api.azurewebsites.net/chats/${chatSelecionado.id}`, {
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("meuToken")}`
            }
        });

        const res = await fetch(`https://senai-gpt-api.azurewebsites.net/messages?chatId=${chatSelecionado.id}`, {
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("meuToken")}`
            }
        });
        const msgs = await res.json();

        for (const msg of msgs) {
            await fetch(`https://senai-gpt-api.azurewebsites.net/messages/${msg.id}`, {
                method: "DELETE",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("meuToken")}`
                }
            });
        }

        setChatSelecionado(null);
        setMensagens([]);
        await getChats();
    };

    const toggleLeftPanel = () => setIsLeftPanelOpen(!isLeftPanelOpen);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle("dark-mode", !darkMode);
        localStorage.setItem("darkMode", String(!darkMode));
    };

    const onLogOutClick = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <div className="container">
            <button className="btn-toggle-panel" onClick={toggleLeftPanel}>☰</button>

            <header className={`left-panel ${isLeftPanelOpen ? "open" : ""}`}>
                <div className="top">
                    <button className="btn-new-chat" onClick={novoChat}>+ New chat</button>
                    {chats.map(chat => (
                        <button key={chat.id} className="btn-chat" onClick={() => clickChat(chat)}>
                            {chat.chatTitle}
                        </button>
                    ))}
                </div>
                <div className="bottom">
                    {chatSelecionado && (
                        <button className="btn-chat" onClick={deletarChat}>
                            Delete current chat: {chatSelecionado.chatTitle}
                        </button>
                    )}
                    <button className="btn-chat" onClick={toggleDarkMode}>Light mode</button>
                    <button className="btn-chat" onClick={onLogOutClick}>Log out</button>
                </div>
            </header>

            <main className="central-panel">
                {!chatSelecionado ? (
                    <>
                        <div className="chat-logo">
                            <img src={darkMode ? logoWhite : logo} alt="Logo do SenaiGPT." />
                        </div>

                        <div className="dicas-container">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="dicas-item">
                                    <h2>
                                        <img src={darkMode ? exampleWhite : example} alt="Example icon." />
                                        Examples
                                    </h2>
                                    <p onClick={() => setUserMessage("Explique como um computador quântico funciona.")}>
                                        Explique como um computador quântico funciona.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="chat-container">
                        <div className="chat-header">
                            <h2>{chatSelecionado.chatTitle}</h2>
                        </div>
                        <div className="chat-messages">
                            {mensagens.map(msg => (
                                <p key={msg.id} className={`message-item ${msg.userId === "chatbot" ? "chatbot" : ""}`}>
                                    {msg.text}
                                </p>
                            ))}
                        </div>
                    </div>
                )}

                <div className="input-container-1">
                    <input
                        value={userMessage}
                        onChange={e => setUserMessage(e.target.value)}
                        placeholder="Type a message."
                        type="text"
                    />
                    <img
                        onClick={() => enviarMensagem(userMessage)}
                        src={darkMode ? sendIconWhite : sendIcon}
                        alt="Send"
                    />
                </div>
            </main>
        </div>
    );
}

export default Chat;