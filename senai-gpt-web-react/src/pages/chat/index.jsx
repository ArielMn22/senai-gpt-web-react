import "./chat.css";
import logo from "../../assets/imgs/Chat.png";
import example from "../../assets/imgs/example.svg";

function Chat() {

    return (
        <>
            <div className="container">

                <header className="left-panel">

                    <div className="top">

                        <button className="btn-new-chat">+ New chat</button>

                        <button className="btn-chat">
                            <img src="../assets/imgs/chat.svg" alt="ícone de chat." />
                            AI Chat Tool Ethics
                        </button>

                        <button className="btn-chat">
                            <img src="../assets/imgs/chat.svg" alt="ícone de chat." />
                            AI Chat Tool Impact Writing
                        </button>

                        <button className="btn-chat">
                            <img src="../assets/imgs/chat.svg" alt="ícone de chat." />
                            New chat
                        </button>

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