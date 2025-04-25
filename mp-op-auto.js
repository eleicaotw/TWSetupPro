(function () {
    'use strict';

    const defaultMensagem = `Olá [player]{player}[/player]!

[i]Segue seu alvo para a próxima OP.[/i]

📅 [b]{data_hora}[/b]

⚔️ [b]ALVOS NT[/b]
[spoiler=Spoiler]
{alvos}
[/spoiler]

⚔️ [b]ALVOS FAKES[/b]
[spoiler=Spoiler]
{fakes}
[/spoiler]`;

    const addLog = (msg) => {
    const box = document.getElementById('log_envio_mp');
    if (box) {
        const p = document.createElement('div');
        p.textContent = msg;
        box.appendChild(p);
    }
    const logs = JSON.parse(localStorage.getItem('mp_logs') || '[]');
    logs.push(msg);
    localStorage.setItem('mp_logs', JSON.stringify(logs));
};

    let fila = JSON.parse(localStorage.getItem('fila_mp') || '[]');
    let total = parseInt(localStorage.getItem('fila_total') || '0');

    if (fila.length > 0 && window.location.href.includes('screen=mail') && window.location.href.includes('mode=new')) {
        const atual = fila.shift();
        localStorage.setItem('fila_mp', JSON.stringify(fila));
        localStorage.setItem('fila_total', total);

        const inputTo = document.querySelector('input[name="to"]');
        const inputSubject = document.querySelector('input[name="subject"]');
        const inputText = document.querySelector('textarea[name="text"]');
        const btnSubmit = document.querySelector("input[type='submit'][name='send']");

        if (inputTo && inputSubject && inputText && btnSubmit) {
            inputTo.value = atual.player;
            inputSubject.value = atual.assunto;
            inputText.value = atual.corpo;

            setTimeout(() => {
                btnSubmit.click();
            }, 1000);

            setTimeout(() => {
                if (fila.length > 0) {
                        const params = new URLSearchParams(window.location.search);
                    const village = params.get('village');
                    window.location.href = `/game.php?village=${village}&screen=mail&mode=new`;
                    }
                }, 500);
        }

        if (fila.length === 0) {
            addLog(`📨 Enviado para ${atual.player} (${total}/${total})`);
            addLog(`✅ Todas as MPs foram enviadas.`);
            const snd = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_4094e265d5.mp3?filename=notification-121041.mp3');
            snd.addEventListener('canplaythrough', () => snd.play());
            const btn = document.getElementById('iniciar_envio');
            if (btn) {
                btn.innerText = '▶️ Iniciar Envio';
                btn.disabled = false;
            }
        } else {
            addLog(`📨 Enviado para ${atual.player} (${total - fila.length}/${total})`);
        }
        return;
    }

    const getMensagemPadrao = () => localStorage.getItem('mp_mensagem_padrao') || defaultMensagem;
    const setMensagemPadrao = (str) => localStorage.setItem('mp_mensagem_padrao', str);

    const wrapper = document.createElement('div');
    wrapper.style = 'position: fixed; top: 60px; right: 20px; z-index: 9999; font-family: Verdana;';

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'MP OP Auto - by eleição';
    toggleBtn.style = 'margin-bottom: 5px; width: 100%; background: #8b5a2b; color: white; border: none; padding: 5px; font-weight: bold;';

    const container = document.createElement('div');
    container.style = 'background: #f4e4bc; border: 3px solid #8b5a2b; color: #2e1a0f; max-width: 550px; box-shadow: 3px 3px 8px rgba(0,0,0,0.5); padding: 15px;';

    const logBox = document.createElement('div');
    logBox.id = 'log_envio_mp';
    logBox.style = 'max-height: 120px; overflow-y: auto; border: 1px solid #ccc; background: #fff; padding: 5px; margin-top: 10px; font-size: 12px;';

    container.innerHTML = `
    <label><b>📌 Assunto:</b><br>
      <input id="assunto_op" type="text" style="width:100%" value="${localStorage.getItem('mp_assunto') || '⚔️ OP - SEU ALVO 💥'}">
    </label><br>

    <label><b>🗓️ Data da OP:</b><br>
      <input id="data_op" type="date" style="width:100%" value="${localStorage.getItem('mp_data') || ''}">
    </label><br>

    <label><b>🕒 Hora da OP:</b><br>
      <input id="hora_op" type="time" style="width:100%" value="${localStorage.getItem('mp_hora') || ''}">
    </label><br>

    <label><b>📍 Coordenadas + Jogador:</b><br>
      <textarea id="dados_mp" rows="4" style="width:100%">${localStorage.getItem('mp_dados') || ''}</textarea>
    </label><br>

    <label><b>🎯 Fakes:</b><br>
      <textarea id="fakes_mp" rows="3" style="width:100%">${localStorage.getItem('mp_fakes') || ''}</textarea>
    </label><br>

    <label><input type="radio" name="modo_fake" value="igual" checked> Dividir igualmente</label><br>
    <label><input type="radio" name="modo_fake" value="fixo"> Fakes por jogador: <input id="qtd_fixa" type="number" style="width: 60px"></label><br><br>

    <button id="iniciar_envio" style="font-weight: bold; background: #d4b47c; border: 2px solid #8b5a2b; padding: 5px 10px">▶️ Iniciar Envio</button>
    <button id="clear_fila" style="margin-left: 10px; font-weight: bold; background: #fdd; border: 1px solid red;">🧹 Limpar Dados</button>
    <br><br>
    <details>
      <summary><b>📂 Modelo de Mensagem</b></summary>
      <textarea id="template_padrao" rows="6" style="width:100%">${getMensagemPadrao()}</textarea><br>
      <button id="salvar_padrao">💾 Salvar Modelo</button>
      <button id="restaurar_padrao" style="margin-left: 10px">↩️ Restaurar Padrão</button>
    </details>`;

    container.appendChild(logBox);
    wrapper.appendChild(toggleBtn);
    wrapper.appendChild(container);
    const savedLogs = JSON.parse(localStorage.getItem('mp_logs') || '[]');
savedLogs.forEach(msg => {
    const p = document.createElement('div');
    p.textContent = msg;
    logBox.appendChild(p);
});
document.body.appendChild(wrapper);

    toggleBtn.onclick = () => {
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
    };

    document.getElementById('salvar_padrao').onclick = () => {
        setMensagemPadrao(document.getElementById('template_padrao').value);
        alert('Modelo salvo!');
    };

    document.getElementById('restaurar_padrao').onclick = () => {
        document.getElementById('template_padrao').value = defaultMensagem;
        setMensagemPadrao(defaultMensagem);
        alert('Modelo restaurado para o padrão.');
    };

    document.getElementById('clear_fila').onclick = () => {
        localStorage.removeItem('mp_assunto');
        localStorage.removeItem('mp_data');
        localStorage.removeItem('mp_hora');
        localStorage.removeItem('mp_dados');
        localStorage.removeItem('mp_fakes');
        document.getElementById('assunto_op').value = '';
        document.getElementById('data_op').value = '';
        document.getElementById('hora_op').value = '';
        document.getElementById('dados_mp').value = '';
        document.getElementById('fakes_mp').value = '';
        localStorage.removeItem('mp_logs');
        document.getElementById('log_envio_mp').innerHTML = '';
        alert('Dados de configuração apagados.');
    };

    document.getElementById('iniciar_envio').onclick = () => {
        const btn = document.getElementById('iniciar_envio');
        let originalText = btn.innerText;
        btn.innerText = '⏳ Enviando...';
        btn.disabled = true;
        // Limpa logs ao iniciar nova OP
        localStorage.removeItem('mp_logs');
        document.getElementById('log_envio_mp').innerHTML = '';
        const assunto = document.getElementById('assunto_op').value.trim();
        const data_raw = document.getElementById('data_op').value;
        const hora = document.getElementById('hora_op').value;
        const dados = document.getElementById('dados_mp').value.trim();
        const fakes = document.getElementById('fakes_mp').value.trim();
        localStorage.setItem('mp_assunto', assunto);
        localStorage.setItem('mp_dados', dados);
        localStorage.setItem('mp_fakes', fakes);
        localStorage.setItem('mp_data', data_raw);
        localStorage.setItem('mp_hora', hora);

        const modo = document.querySelector('input[name="modo_fake"]:checked').value;
        const qtdFixa = parseInt(document.getElementById('qtd_fixa').value);

        const [ano, mes, dia] = data_raw.split('-');
        const datahora = `${dia}/${mes} - ${hora}`;

        const jogadores = {};
        for (const linha of dados.split('\n')) {
            const match = linha.match(/^(\d+\|\d+)\s+(.*)$/);
            if (!match) continue;
            const coord = match[1];
            const nome = match[2];
            if (!jogadores[nome]) jogadores[nome] = [];
            jogadores[nome].push(coord);
        }
        addLog(`🔄 Separado ${Object.keys(jogadores).length} jogador(es) com seus alvos.`);

        const fakeList = fakes.split('\n');
        const nomes = Object.keys(jogadores);
        const porJogador = modo === 'fixo' ? qtdFixa : Math.floor(fakeList.length / nomes.length);
        addLog(`🎯 Dividindo ${fakeList.length} fakes em ${nomes.length} grupos (${porJogador} por jogador).`);

        const fila = [];
        let index = 0;
        nomes.forEach((nome, i) => {
            const coords = jogadores[nome];
            const fake = fakeList.slice(index, index + porJogador);
            index += porJogador;
            const template = getMensagemPadrao()
                .replace('{player}', nome)
                .replace('{alvos}', coords.join('\n'))
                .replace('{fakes}', fake.join('\n'))
                .replace('{data_hora}', datahora);
            fila.push({ player: nome, assunto, corpo: template });
        });

        localStorage.setItem('fila_mp', JSON.stringify(fila));
        localStorage.setItem('fila_total', fila.length);
        addLog(`🚀 Iniciando envio de ${fila.length} MPs.`);

        const params = new URLSearchParams(window.location.search);
        const village = params.get('village');
        window.location.href = `/game.php?village=${village}&screen=mail&mode=new`;
    };
})();
