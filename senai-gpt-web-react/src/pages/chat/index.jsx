import "./chat.css";
import logo from "../../assets/imgs/Chat.png";
import example from "../../assets/imgs/example.svg";
import { useEffect, useState } from "react";

function Chat() {

    const [chats, setChats] = useState([]);
    const [chatSelecionado, setChatSelecionado] = useState(null);

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

    return (
        <>
            <div className="container">

                <header className="left-panel">

                    <div className="top">

                        <button className="btn-new-chat">+ New chat</button>

                        {chats.map(chat => (
                            <button className="btn-chat" onClick={() => clickChat(chat)}>
                                <img src="../assets/imgs/chat.svg" alt="ícone de chat." />
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
                                        <p className={"message-item " + (message.userId == "chatbot"? "chatbot" : "")}>{message.text}</p>
                                    ))}

                                </div>

                            </div>

                        </>

                    )}

                    <div className="input-container-1">

                        <img src="../assets/imgs/mic.svg" alt="Microphone." />
                        <img src="../assets/imgs/img.svg" alt="Image." />

                        <input placeholder="Type a message." type="text" />

                        <img src="../assets/imgs/send.svg" alt="Send." />

                    </div>

                </main>

            </div>
        </>
    )

};

export default Chat;