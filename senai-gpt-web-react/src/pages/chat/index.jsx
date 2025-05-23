// Importação de estilos e imagens
import "./chat.css";
import logo from "../../assets/imgs/Chat.png";
import logoWhite from "../../assets/imgs/ChatWhite.png";
import example from "../../assets/imgs/example.svg";
import exampleWhite from "../../assets/imgs/example-white.svg";
import chatIcon from "../../assets/imgs/chat.svg";
import chatIconWhite from "../../assets/imgs/chat-white.svg";
import sendIcon from "../../assets/imgs/send.svg";
import sendIconWhite from "../../assets/imgs/send-white.svg";

// Hooks e bibliotecas
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-regular-svg-icons";

// Componente principal do chat
function Chat() {

    // Estados do componente
    const [chats, setChats] = useState([]); // Lista de chats disponíveis
    const [chatSelecionado, setChatSelecionado] = useState(null); // Chat em foco
    const [userMessage, setUserMessage] = useState(""); // Mensagem digitada pelo usuário

    const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false); // Controle da visibilidade do painel esquerdo
    const [darkMode, setDarkMode] = useState(false); // Controle do modo escuro

    // Carregamento inicial: rascunho, chats e modo escuro
    useEffect(() => {
        let rascunhoMensagem = localStorage.getItem("rascunhoMensagem");
        if (rascunhoMensagem) setUserMessage(rascunhoMensagem);

        getChats(); // Busca os chats do usuário

        let modoEscuro = localStorage.getItem("darkMode");
        if (modoEscuro === "true") {
            setDarkMode(true);
            document.body.classList.add("dark-mode");
        }
    }, []);

    // Salva a mensagem digitada no localStorage como rascunho
    useEffect(() => {
        localStorage.setItem("rascunhoMensagem", userMessage);
    }, [userMessage]);

    // Busca os chats do back-end e filtra por ID do usuário logado
    const getChats = async () => {
        let response = await fetch("https://senai-gpt-api.azurewebsites.net/chats", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("meuToken")
            }
        });

        if (response.ok) {
            let json = await response.json();
            let userId = localStorage.getItem("meuId");
            json = json.filter(chat => chat.userId == userId);
            setChats(json);
        } else if (response.status === 401) {
            alert("Token inválido. Faça login novamente.");
            localStorage.clear();
            window.location.href = "/login";
        }
    };

    // Função para deslogar o usuário
    const onLogOutClick = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    // Seleciona um chat da lista
    const clickChat = (chat) => {
        setChatSelecionado(chat);
        setIsLeftPanelOpen(false);
    };

    // Simulação de chamada ao ChatGPT (resposta fixa por segurança)
    const chatGPT = async (message) => {
        return "[Mensagem fixa]";
        // ... código original de integração com a API do Azure OpenAI
    };

    // Função para envio de mensagem
    const enviarMensagem = async (message) => {
        let chatAtual = { ...chatSelecionado };

        if (!chatSelecionado) {
            chatAtual = await novoChat();
        }

        let userId = localStorage.getItem("meuId");

        let novaMensagemUsuario = {
            userId: crypto.randomUUID(),
            text: message,
            id: userId
        };

        // Adiciona a mensagem do usuário ao chat
        let novoChatSelecionado = { ...chatAtual };
        novoChatSelecionado.messages.push(novaMensagemUsuario);
        setChatSelecionado(novoChatSelecionado);

        // Resposta do "ChatGPT"
        let resposta = await chatGPT(message);

        let novaRespostaChatGPT = {
            userId: "chatbot",
            text: resposta,
            id: crypto.randomUUID()
        };

        novoChatSelecionado.messages.push(novaRespostaChatGPT);
        setChatSelecionado({ ...novoChatSelecionado });

        // Atualiza o chat no back-end
        await fetch(`https://senai-gpt-api.azurewebsites.net/chats/${chatAtual.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("meuToken")
            },
            body: JSON.stringify(novoChatSelecionado)
        });

        setUserMessage("");
        await getChats(); // Atualiza a lista lateral
    };

    // Cria um novo chat
    const novoChat = async () => {
        let nomeChat = prompt("Digite o nome do novo chat:");
        if (!nomeChat) {
            alert("Nome inválido.");
            return;
        }

        setIsLeftPanelOpen(false);

        let userId = localStorage.getItem("meuId");
        let novoChatObj = {
            id: crypto.randomUUID(),
            chatTitle: nomeChat,
            messages: [],
            userId
        };

        setChatSelecionado(novoChatObj);
        setUserMessage("");

        let response = await fetch("https://senai-gpt-api.azurewebsites.net/chats", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("meuToken")
            },
            body: JSON.stringify(novoChatObj)
        });

        if (response.ok) {
            await getChats();
            return novoChatObj;
        } else {
            console.log("Erro ao criar o chat.");
        }
    };

    // Deleta o chat selecionado
    const deletarChat = async () => {
        let confirmacao = window.confirm("Você tem certeza que deseja deletar este chat?");
        toggleLeftPanel();

        if (confirmacao) {
            let response = await fetch(`https://senai-gpt-api.azurewebsites.net/chats/${chatSelecionado.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("meuToken")
                }
            });

            if (response.ok) {
                setChatSelecionado(null);
                await getChats();
            } else {
                alert("Erro ao deletar o chat.");
            }
        }
    };

    // Alterna visibilidade do painel lateral
    const toggleLeftPanel = () => {
        setIsLeftPanelOpen(!isLeftPanelOpen);
    };

    // Alterna entre modo claro e escuro
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);

        if (darkMode) {
            document.body.classList.remove("dark-mode");
        } else {
            document.body.classList.add("dark-mode");
        }

        localStorage.setItem("darkMode", !darkMode);
    };

    // Renderização da interface
    return (
        <>
            <div className="container">
                {/* Botão para abrir/fechar painel esquerdo */}
                <button className="btn-toggle-panel" onClick={toggleLeftPanel}>☰</button>

                {/* Painel esquerdo com lista de chats */}
                <header className={`left-panel ${isLeftPanelOpen ? "open" : ""}`}>
                    <div className="top">
                        <button className="btn-new-chat" onClick={novoChat}>+ New chat</button>
                        {chats.map(chat => (
                            <button key={chat.id} className="btn-chat" onClick={() => clickChat(chat)}>
                                <FontAwesomeIcon icon={faMessage} className="icon" />
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

                {/* Painel principal com a interface do chat */}
                <main className="central-panel">

                    {/* Tela inicial com logo e exemplos */}
                    {chatSelecionado == null ? (
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
                                        <p onClick={() => setUserMessage("Explique como um computador quântico funciona.")}>
                                            Explique como um computador quântico funciona.
                                        </p>
                                        <p onClick={() => setUserMessage("Explique como um computador quântico funciona.")}>
                                            Explique como um computador quântico funciona.
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="chat-container">
                                <div className="chat-header">
                                    <h2>{chatSelecionado.chatTitle}</h2>
                                </div>
                                <div className="chat-messages">
                                    {chatSelecionado.messages.map(message => (
                                        <p key={message.id} className={`message-item ${message.userId === "chatbot" ? "chatbot" : ""}`}>
                                            {message.text}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Campo de digitação e envio de mensagens */}
                    <div className="input-container-1">
                        <input
                            value={userMessage}
                            onChange={event => setUserMessage(event.target.value)}
                            placeholder="Type a message."
                            type="text"
                        />
                        <img
                            onClick={() => enviarMensagem(userMessage)}
                            src={darkMode ? sendIconWhite : sendIcon}
                            alt="Send."
                        />
                    </div>
                </main>
            </div>
        </>
    );
}

export default Chat;
