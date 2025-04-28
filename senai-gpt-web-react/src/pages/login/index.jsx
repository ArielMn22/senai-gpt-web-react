import "./login.css";
import logo from "../../assets/imgs/Chat.png";
import { useState } from "react";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onLoginClick = async () => {

        let response = await fetch ("https://senai-gpt-api.azurewebsites.net/login", {

            headers: {
                "Content-Type": "application/json"
            },
            method: "POST", // Método que envia dados
            body: JSON.stringify({
                email: email,
                password: password
            })

        });

        if (response.ok == true) { // Verifica se a requisição deu certo.

            alert("Login realizado com sucesso!");

            console.log(response);

            let json = await response.json(); // Pegue o conteúdo da requisição.

            let token = json.accessToken;
            let userId = json.user.id;

            console.log("Token: " + token);

            // LOCALSTORAGE
            localStorage.setItem("meuToken", token);
            localStorage.setItem("meuId", userId);

            // COOKIES
            // function setCookie(name, value, days) {
            //     const date = new Date();
            //     date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // dias → ms
            //     const expires = "expires=" + date.toUTCString();
            //     document.cookie = `${name}=${value}; ${expires}; path=/`;
            // }
            // setCookie("meuToken", token, 7);

            window.location.href = "/chat";

        } else {

            if (response.status == 401) {

                alert("Credenciais incorretas. Tente novamente.");

            } else {
                
                alert("Erro inesperado aconteceu, caso persista, contate os administradores.");

            }

        }

    }

    return (
        <>
            <header></header>

            <main className="page-container">

                <div className="robo-image">
                </div>

                <div className="login-container">

                    <img className="login-logo" src={logo} alt="Logo do SenaiGPT." />

                    <h1
                        id="meutitulo"
                        className="titulo"
                    >Login</h1>

                    <input className="inpt" value={email} onChange={event => setEmail(event.target.value)} type="email" placeholder="Insira o e-mail" />
                    <input className="inpt" value={password} onChange={event => setPassword(event.target.value)} type="password" placeholder="Insira a senha" />

                    <button className="btn" onClick={() => onLoginClick()}>Entrar</button>

                </div>

            </main>

            <footer></footer>
        </>
    )
}

export default Login;