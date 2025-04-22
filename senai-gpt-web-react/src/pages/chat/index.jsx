import "./chat.css";

import chatIcon from "../../assets/imgs/chat.svg";
import logo from "../../assets/imgs/Chat.png";
import exampleLogo from "../../assets/imgs/example.svg";
import micIcon from "../../assets/imgs/mic.svg";
import imageIcon from "../../assets/imgs/img.svg";
import sendIcon from "../../assets/imgs/send.svg";
import { useEffect, useState } from "react";

function Chat() {

    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);

    useEffect(() => {

        getChats();

    }, []);

    const getChats = async () => {

        let response = await fetch("https://senai-gpt-api.azurewebsites.net/chats", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("meuToken")
            }
        });

        let json = await response.json();

        if (response.ok == true) {

            setChats(json);

        } else {

            if (response.status == 401) {
                alert("Token inválido. Faça login novamente.");
                window.location.href = "/login";
            }

        }
    }

    const onChatClick = async (chat) => {

        setSelectedChat(chat);

    }

    return (
        <>

            <div className="container">

                <header className="left-panel">

                    <div className="top">

                        <button className="btn-new-chat">+ New chat</button>

                        {chats.map(chat => (
                            <button onClick={() => onChatClick(chat)} className="btn-chat">
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
                        <button className="btn-chat">Log out</button>

                    </div>

                </header>

                <main className="central-panel">

                    {selectedChat == null ? (

                        <>

                            <div className="logo">
                                <img src={logo} alt="Logo do SenaiGPT." />
                            </div>

                            <div className="dicas-container">

                                <div className="dicas-item">

                                    <h2>
                                        <img src={exampleLogo} alt="Example icon." />
                                        Examples
                                    </h2>

                                    <p>Explique como um computador quântico funciona.</p>
                                    <p>Explique como um computador quântico funciona.</p>
                                    <p>Explique como um computador quântico funciona.</p>

                                </div>

                                <div className="dicas-item">

                                    <h2>
                                        <img src={exampleLogo} alt="Example icon." />
                                        Examples
                                    </h2>

                                    <p>Explique como um computador quântico funciona.</p>
                                    <p>Explique como um computador quântico funciona.</p>
                                    <p>Explique como um computador quântico funciona.</p>

                                </div>

                                <div className="dicas-item">

                                    <h2>
                                        <img src={exampleLogo} alt="Example icon." />
                                        Examples
                                    </h2>

                                    <p>Explique como um computador quântico funciona.</p>
                                    <p>Explique como um computador quântico funciona.</p>
                                    <p>Explique como um computador quântico funciona.</p>

                                </div>

                            </div>

                        </>

                    ) : null}

                    {selectedChat != null ? (

                        <div className="chat-container">

                            <div className="chat-header">
                                <h2>{selectedChat.chatTitle}</h2>
                            </div>

                            <div className="chat-messages">

                                {selectedChat.messages.map(message => (
                                    <p className={"message-item " + (message.userId == "chatbot" ? "chatbot" : "")}>{message.text}</p>
                                ))}

                            </div>

                        </div>
                    ) : null}

                    <div className="input-container-1">

                        <img src={micIcon} alt="Microphone." />
                        <img src={imageIcon} alt="Image." />

                        <input placeholder="Type a message." type="text" />

                        <img src={sendIcon} alt="Send." />

                    </div>

                </main>

            </div>

        </>

    );

}

export default Chat;