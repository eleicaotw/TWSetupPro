
(function () {
    'use strict';

    // Verifica se estamos na página correta (screen=mail)
    if (window.location.href.indexOf("screen=mail") === -1) {
        return;  // Não executa se não estiver em screen=mail
    }

    const STORAGE_KEY = 'mp_op_auto_state_v2';
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

    const config = {
        assunto: "OP - SEU ALVO",
        data: "",
        hora: "",
        coordenadasJogador: [],
        fakes: [],
        dividirIgualmente: false,
        fakesPorJogador: ""
    };

    // Função para atualizar a configuração
    const updateConfig = () => {
        // Atualiza a configuração de fakes, se necessário
        config.fakes = document.getElementById('fakes').value.split('
').map(item => item.trim());
        config.coordenadasJogador = document.getElementById('coordenadasJogador').value.split('
').map(item => item.trim());
        config.dividirIgualmente = document.querySelector('input[name="dividirIgualmente"]:checked').value === 'sim';
        config.fakesPorJogador = document.getElementById('fakesPorJogador').value;
        // Salva as configurações no localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    };

    // Função para enviar os MPs
    const enviarMP = () => {
        updateConfig();  // Atualiza as configurações antes de enviar

        const jogadores = config.coordenadasJogador;
        const fakes = config.fakes;
        const dividirFakes = config.dividirIgualmente;

        // Lógica para dividir fakes, caso necessário
        let fakesPorJogador = dividirFakes ? Math.ceil(fakes.length / jogadores.length) : fakes.length;
        
        for (let i = 0; i < jogadores.length; i++) {
            const jogador = jogadores[i];
            const fakesParaEnviar = fakes.slice(i * fakesPorJogador, (i + 1) * fakesPorJogador);

            // Envia a MP para cada jogador
            enviarMensagem(jogador, fakesParaEnviar);
        }
    };

    // Função para enviar a mensagem de MP
    const enviarMensagem = (jogador, fakes) => {
        // Aqui a lógica para enviar a MP vai depender de como a página do TW é estruturada.
        console.log(`Enviando MP para: ${jogador}`);
        console.log(`Fakes para enviar: ${fakes.join(', ')}`);
        // Aqui você pode inserir o código para preencher o formulário e enviar a MP
    };

    // Botão de "Iniciar Envio"
    document.getElementById('iniciarEnvio').addEventListener('click', enviarMP);

    // Exibe um log
    const log = document.getElementById('tw_script_log');
    const addLog = (msg) => {
        const time = new Date().toLocaleTimeString();
        log.innerHTML = `<span style="color:green">[${time}] ${msg}</span>`;
    };

    addLog("MP OP Auto carregado");

})();
