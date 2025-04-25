
(function () {
    'use strict';

    // Verifica se estamos na página correta (screen=forum)
    if (window.location.href.indexOf("screen=forum") === -1) {
        return;  // Não executa se não estiver em screen=forum
    }

    const STORAGE_KEY = 'conversor_defesa_pop_state_v2';
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

    const config = {
        tropas: "",
        codigoDefesa: ""
    };

    // Função para converter as tropas em código de defesa
    const converterParaCodigoDefesa = () => {
        const tropas = config.tropas.split('
').map(item => item.trim());
        config.codigoDefesa = tropas.join('; '); // Aqui, ajustamos a conversão de tropas para o formato adequado de BBCode
        updateLog(`Código de defesa gerado: ${config.codigoDefesa}`);
        return config.codigoDefesa;
    };

    // Atualiza a configuração
    const updateConfig = () => {
        config.tropas = document.getElementById('tropas').value;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    };

    // Função para atualizar o log
    const updateLog = (msg) => {
        const log = document.getElementById('tw_script_log');
        const time = new Date().toLocaleTimeString();
        log.innerHTML = `<span style="color:green">[${time}] ${msg}</span>`;
    };

    // Botão de "Converter"
    document.getElementById('converterBtn').addEventListener('click', () => {
        updateConfig();
        const resultado = converterParaCodigoDefesa();
        updateLog(`Resultado da conversão: ${resultado}`);
    });

    addLog("Conversor Defesa POP carregado");
})();
