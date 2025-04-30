import "./new-user.css";
import logo from "../../assets/imgs/Chat.png";
import { useState } from "react";

function NewUser() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const onNewUserClick = async () => {

        if (name == "") {
            alert("Preencha o nome do usuário.");
            return;
        }

        if (email == "") {
            alert("Preencha o e-mail.");
            return;
        }

        if (password == "") {
            alert("Preencha a senha.");
            return;
        }

        if (confirmPassword == "") {
            alert("Preencha a confirmação da senha.");
            return;
        }

        if (password != confirmPassword) {
            alert("As senhas não conferem.");
            return;
        }

        let response = await fetch ("https://senai-gpt-api.up.railway.app/users", {

            headers: {
                "Content-Type": "application/json"
            },
            method: "POST", // Método que envia dados
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })

        });

        if (response.ok == true) { // Verifica se a requisição deu certo.

            alert("Novo usuário cadastrado com sucesso!");

            window.location.href = "/login";

        } else {

            alert("Erro inesperado aconteceu, caso persista, contate os administradores.");

        }

    }

    return (
        <>
            <header></header>

            <main className="page-container">

                <div className="up-image">
                </div>

                <div className="new-user-container">

                    <img className="new-user-logo" src={logo} alt="Logo do SenaiGPT." />

                    <h1
                        id="meutitulo"
                        className="titulo"
                    >Novo usuário</h1>

                    <input className="inpt" value={name} onChange={event => setName(event.target.value)} type="email" placeholder="Insira o nome do usuário" />
                    <input className="inpt" value={email} onChange={event => setEmail(event.target.value)} type="email" placeholder="Insira o e-mail" />
                    <input className="inpt" value={password} onChange={event => setPassword(event.target.value)} type="password" placeholder="Insira a senha" />
                    <input className="inpt" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} type="password" placeholder="Insira a senha" />

                    <button className="btn" onClick={() => onNewUserClick()}>Entrar</button>

                    <a className="form-hint" href="/login">Clique aqui para fazer o login</a>

                </div>

            </main>

            <footer></footer>
        </>
    )
}

export default NewUser;