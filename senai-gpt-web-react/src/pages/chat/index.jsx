import "./chat.css";
import logo from "../../assets/imgs/Chat.png";
import example from "../../assets/imgs/example.svg";
import chatIcon from "../../assets/imgs/chat.svg";
import sendIcon from "../../assets/imgs/send.svg";
import micIcon from "../../assets/imgs/mic.svg";
import imageIcon from "../../assets/imgs/img.svg";
import { useEffect, useState } from "react";

function Chat() {

    const [chats, setChats] = useState([]);
    const [chatSelecionado, setChatSelecionado] = useState(null);

    const [userMessage, setUserMessage] = useState("");

    useEffect(() => {

        // Executada toda vez que a tela abre.
        getChats();


    }, []);

    const getChats = async () => {
        // Arrow Function
        let response = await fetch("https://senai-gpt-api.azurewebsites.net/chats", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("meuToken")
            }
        });

        console.log(response);

        if (response.ok == true) {

            let json = await response.json(); // Pegue as informações dos chats.

            setChats(json);

        } else {

            if (response.status == 401) {

                alert("Token inválido. Faça login novamente.");
                localStorage.clear();
                window.location.href = "/login";

            }

        }

    }

    const onLogOutClick = () => {

        localStorage.clear();
        window.location.href = "/login";

    }

    const clickChat = (chat) => {

        setChatSelecionado(chat);
        console.log(chat);

    }

    const chatGPT = async (message) => {

        // Configurações do endpoint e chave da API
        const endpoint = "https://ai-testenpl826117277026.openai.azure.com/";
        const apiKey = "DCYQGY3kPmZXr0lh7xeCSEOQ5oiy1aMlN1GeEQd5G5cXjuLWorWOJQQJ99BCACYeBjFXJ3w3AAAAACOGol8N";
        const deploymentId = "gpt-4"; // Nome do deployment no Azure OpenAI
        const apiVersion = "2024-05-01-preview"; // Verifique a versão na documentação

        // URL para a chamada da API
        const url = `${endpoint}/openai/deployments/${deploymentId}/chat/completions?api-version=${apiVersion}`;

        // Configurações do corpo da requisição
        const data = {
            messages: [{ role: "user", content: message }],
            max_tokens: 50
        };

        // Cabeçalhos da requisição
        const headers = {
            "Content-Type": "application/json",
            "api-key": apiKey
        };

        // Faz a requisição com fetch
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            const botMessage = result.choices[0].message.content;
            return botMessage;
        }

    }

    const enviarMensagem = async (message) => {
        
        let userId = localStorage.getItem("meuId"); // Pega o ID do usuário logado.

        // Cria o objeto da nova mensagem do usuário.
        let novaMensagemUsuario = {
            userId: crypto.randomUUID(),
            text: message,
            id: userId
        };

        // Atualiza o chat selecionado com a nova mensagem.
        // O operador spread (...) cria uma cópia do objeto chatSelecionado.
        let novoChatSelecionado = { ...chatSelecionado }; // Cópia do chatSelecionado.
        novoChatSelecionado.messages.push(novaMensagemUsuario); // Adiciona a mensagem do usuário.
        setChatSelecionado(novoChatSelecionado); // Atualiza o chat selecionado.

        // Faz a chamada para o ChatGPT e espera pela resposta.
        let resposta = await chatGPT(message);

        // Cria o objeto da nova resposta do ChatGPT.
        let novaRespostaChatGPT = {
            userId: "chatbot",
            text: resposta,
            id: crypto.randomUUID()
        };

        // Adiciona a nova resposta do ChatGPT ao chat selecionado.
        novoChatSelecionado.messages.push(novaRespostaChatGPT); // Adiciona a resposta do ChatGPT.
        setChatSelecionado({ ...novoChatSelecionado }); // Atualiza o chat selecionado.

        // Salva o chat no banco de dados.
        let response = await fetch("https://senai-gpt-api.azurewebsites.net/chats/" + chatSelecionado.id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("meuToken")
            },
            body: JSON.stringify(novoChatSelecionado)
        });

        if (response.ok == true) {
            console.log("Chat atualizado com sucesso.");
        } else {
            console.log("Erro ao atualizar o chat.");
        }

        setUserMessage(""); // Limpa a mensagem do usuário.

        // Atualiza a lista de chats.
        await getChats();

    }

    const novoChat = async () => {

        let nomeChat = prompt("Digite o nome do novo chat:"); // Pede o nome do novo chat.

        // if (nomeChat == null || nomeChat == "") {
        //     alert("Nome inválido.");
        //     return;
        // }

        let userId = localStorage.getItem("meuId"); // Pega o ID do usuário logado.

        // Cria o objeto do novo chat.
        let novoChat = {
            id: crypto.randomUUID(),
            chatTitle: nomeChat,
            messages: [],
            userId: userId
        };

        setChatSelecionado(novoChat); // Atualiza o chat selecionado.
        setUserMessage(""); // Limpa a mensagem do usuário.

        // Faz a requisição para criar um novo chat.
        let response = await fetch("https://senai-gpt-api.azurewebsites.net/chats", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("meuToken")
            },
            body: JSON.stringify(novoChat)
        });

        if (response.ok == true) {
            await getChats(); // Atualiza a lista de chats.
        } else {
            console.log("Erro ao criar o chat.");
        }

    }

    return (
        <>
            <div className="container">

                <header className="left-panel">

                    <div className="top">

                        <button className="btn-new-chat" onClick={() => novoChat()}>+ New chat</button>

                        {chats.map(chat => (
                            <button className="btn-chat" onClick={() => clickChat(chat)}>
                                <img src={chatIcon} alt="ícone de chat." />
                                {chat.chatTitle}
                            </button>
                        ))}

                    </div>

                    <div className="bottom">

                        <button className="btn-chat">Clear conversations</button>
                        <button className="btn-chat">Light mode</button>
                        <button className="btn-chat">My account</button>
                        <button className="btn-chat">Updates & FAQ</button>
                        <button className="btn-chat" onClick={() => onLogOutClick()}>Log out</button>

                    </div>

                </header>

                <main className="central-panel">

                    {chatSelecionado == null && (

                        <>

                            <div className="chat-logo">
                                <img src={logo} alt="Logo do SenaiGPT." />
                            </div>

                            <div className="dicas-container">

                                <div className="dicas-item">

                                    <h2>
                                        <img src={example} alt="Example icon." />
                                        Examples
                                    </h2>

                                    <p>Explique como um computador quântico funciona.</p>
                                    <p>Explique como um computador quântico funciona.</p>
                                    <p>Explique como um computador quântico funciona.</p>

                                </div>

                                <div className="dicas-item">

                                    <h2>
                                        <img src={example} alt="Example icon." />
                                        Examples
                                    </h2>

                                    <p>Explique como um computador quântico funciona.</p>
                                    <p>Explique como um computador quântico funciona.</p>
                                    <p>Explique como um computador quântico funciona.</p>

                                </div>

                                <div className="dicas-item">

                                    <h2>
                                        <img src={example} alt="Example icon." />
                                        Examples
                                    </h2>

                                    <p>Explique como um computador quântico funciona.</p>
                                    <p>Explique como um computador quântico funciona.</p>
                                    <p>Explique como um computador quântico funciona.</p>

                                </div>

                            </div>

                        </>

                    )}

                    {chatSelecionado != null && (

                        <>

                            <div className="chat-container">

                                <div className="chat-header">

                                    <h2>{chatSelecionado.chatTitle}</h2>

                                </div>

                                <div className="chat-messages">

                                    {chatSelecionado.messages.map(message => (
                                        <p className={"message-item " + (message.userId == "chatbot" ? "chatbot" : "")}>{message.text}</p>
                                    ))}

                                </div>

                            </div>

                        </>

                    )}

                    <div className="input-container-1">

                        <img src={micIcon} alt="Microphone." />
                        <img src={imageIcon} alt="Image." />

                        <input
                            value={userMessage}
                            onChange={event => setUserMessage(event.target.value)} placeholder="Type a message."
                            type="text"
                        />

                        <img onClick={() => enviarMensagem(userMessage)} src={sendIcon} alt="Send." />

                    </div>

                </main>

            </div>
        </>
    )

};

export default Chat;