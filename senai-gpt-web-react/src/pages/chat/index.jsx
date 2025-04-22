import "./chat.css";

import chatIcon from "../../assets/imgs/chat.svg";
import logo from "../../assets/imgs/Chat.png";
import exampleLogo from "../../assets/imgs/example.svg";
import micIcon from "../../assets/imgs/mic.svg";
import imageIcon from "../../assets/imgs/img.svg";
import sendIcon from "../../assets/imgs/send.svg";

function Chat() {

    return (
        <>
        
        <div className="container">
        
        <header className="left-panel">
    
            <div className="top">
    
                <button className="btn-new-chat">+ New chat</button>
    
                <button className="btn-chat">
                    <img src={chatIcon} alt="ícone de chat."/>
                    AI Chat Tool Ethics
                </button>
                
                <button className="btn-chat">
                    <img src={chatIcon} alt="ícone de chat."/>
                    AI Chat Tool Impact Writing
                </button>
                
                <button className="btn-chat">
                    <img src={chatIcon} alt="ícone de chat."/>
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
    
            <div className="logo">
                <img src={logo} alt="Logo do SenaiGPT."/>
            </div>
    
            <div className="dicas-container">

                <div className="dicas-item">

                    <h2>
                        <img src={exampleLogo} alt="Example icon."/>
                        Examples
                    </h2>

                    <p>Explique como um computador quântico funciona.</p>
                    <p>Explique como um computador quântico funciona.</p>
                    <p>Explique como um computador quântico funciona.</p>

                </div>

                <div className="dicas-item">

                    <h2>
                        <img src={exampleLogo} alt="Example icon."/>
                        Examples
                    </h2>

                    <p>Explique como um computador quântico funciona.</p>
                    <p>Explique como um computador quântico funciona.</p>
                    <p>Explique como um computador quântico funciona.</p>

                </div>

                <div className="dicas-item">

                    <h2>
                        <img src={exampleLogo} alt="Example icon."/>
                        Examples
                    </h2>
                    
                    <p>Explique como um computador quântico funciona.</p>
                    <p>Explique como um computador quântico funciona.</p>
                    <p>Explique como um computador quântico funciona.</p>

                </div>

            </div>

            <div className="input-container-1">

                <img src={micIcon} alt="Microphone."/>
                <img src={imageIcon} alt="Image."/>
                
                <input placeholder="Type a message." type="text"/>
                
                <img src={sendIcon} alt="Send."/>

            </div>

        </main>

    </div>

        </>

    );

}

export default Chat;