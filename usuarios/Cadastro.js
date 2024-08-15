
import Header from '../Header';

import '../App.css';

import BotaoVoltar from '../componentes/BotaoVoltar';

//Utilizada para auxiliar no controle de outras funcoes da aplicacao
import React, { useState, useEffect } from 'react';

import axios from 'axios';

import axiosInstance from '../axios/configuracaoAxios';


function Cadastro() {

    //cria novo estado para os campos da tela
    const [campos, setCampos] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarsenha:''
    });

    const [mensagem, setMensagem] = useState('');

    const [erros, setErros] = useState({});

    function handleInputChange(event) {
        const { name, value } = event.target;
        setCampos(prevCampos => ({
            ...prevCampos,
            [name]: value
        }));

        setErros(prevErros => ({
            ...prevErros,
            [name]: ''
        }));
    }

    function validarCampos() {
        const novosErros = {};

        if (!campos.nome) {
            novosErros.nome = 'Nome é obrigatório';
        }

        if (!campos.email) {
            novosErros.email = 'E-mail é obrigatório';
        }

        if (!campos.senha) {
            novosErros.senha = 'Senha é obrigatório';
        }

        if (!campos.confirmarsenha) {
            novosErros.confirmarsenha = 'Confirmar Senha é obrigatório';
        }else if (campos.confirmarsenha!==campos.senha) {
            novosErros.senha = 'Senha e Confirmar Senha devem ser iguais!';
        }


        setErros(novosErros);

        return Object.keys(novosErros).length === 0;
    }


    function validaConfirmacaoSenha(){
        const novosErros = {};
        if (!campos.confirmarsenha) {
            novosErros.confirmarsenha = 'Confirmar Senha é obrigatório';
        }else if (campos.confirmarsenha!==campos.senha) {
            novosErros.confirmarsenha = 'Senha e Confirmar Senha devem ser iguais!';
        }
        setErros(novosErros);
    }

    function handleFormSubmit(event) {

        event.preventDefault();

        if (!validarCampos()) {
            return;
        }

        console.log('Submetendo:', campos);

        axiosInstance.post('/usuarios', campos)
            .then(response => {
                setMensagem('Formulário enviado com sucesso!');
                console.log(response.data);

                // Limpar os campos do formulário após o envio
                setCampos({
                    nome: '',
                    email: '',
                    senha: '',
                    confirmarsenha:''
                });

                // Limpar mensagem após 3 segundos
                setTimeout(() => {
                    setMensagem('');
                }, 3000);
            })
            .catch(error => {
                console.error('Houve um erro ao enviar o formulário:', error);
                setMensagem('Erro ao enviar o formulário. Tente novamente.');
            });
    }

    return (
        <div className="App">
            <Header title="Formulario de Cadastro" />

            <div className="form-container">
                <form onSubmit={handleFormSubmit}>
                    <fieldset>
                        <legend>
                            <h2>Dados de Cadastro</h2>
                        </legend>

                        <div className="inline-fields">
                            <div className="field-maior">
                                <label>Nome:
                                    <input type="text" name="nome" id="nome" value={campos.nome} onChange={handleInputChange} />
                                    {erros.nome && <p className="error">{erros.nome}</p>}
                                </label>
                            </div>
                        </div>    

                        <div className="inline-fields">
                            <div className="field-maior">
                                <label>E-mail:
                                    <input type="text" name="email" id="nomemaile" value={campos.email} onChange={handleInputChange} />
                                    {erros.email && <p className="error">{erros.email}</p>}
                                </label>
                            </div>

                            <div className="field-menor">
                                <label>Senha:
                                    <input type="password" name="senha" id="senha" value={campos.senha} onChange={handleInputChange} />
                                    {erros.senha && <p className="error">{erros.senha}</p>}
                                </label>
                            </div>

                            <div className="field-menor">
                                <label>Confirmar Senha:
                                    <input type="password" name="confirmarsenha" id="confirmarsenha" value={campos.confirmarsenha} onChange={handleInputChange} onBlur={validaConfirmacaoSenha}/>
                                    {erros.confirmarsenha && <p className="error">{erros.confirmarsenha}</p>}
                                </label>
                            </div>
                        </div>

                        <input type="submit" value="Salvar" />
                    </fieldset>
                </form>
                {mensagem && <p>{mensagem}</p>}
                <BotaoVoltar></BotaoVoltar>
            </div>
        </div>
    )
}

export default Cadastro;