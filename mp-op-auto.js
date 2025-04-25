(function () {
    if (document.getElementById('mpopauto_interface')) return;

    const estilo = document.createElement("style");
    estilo.textContent = `
        #mpopauto_interface {
            position: fixed;
            top: 60px;
            right: 20px;
            z-index: 9999;
            background: #f4e4bc;
            border: 3px solid #8b5a2b;
            max-width: 550px;
            font-family: Verdana;
            padding: 15px;
            box-shadow: 3px 3px 8px rgba(0,0,0,0.5);
        }
        #mpopauto_interface textarea, #mpopauto_interface input {
            width: 100%;
            margin-bottom: 10px;
        }
        #mpopauto_interface button {
            margin: 5px 5px 5px 0;
            padding: 5px 10px;
            font-weight: bold;
            background-color: #d4b47c;
            border: 2px solid #8b5a2b;
            cursor: pointer;
        }
        #log_envio_mp {
            max-height: 120px;
            overflow-y: auto;
            background: #fff;
            border: 1px solid #ccc;
            padding: 5px;
            font-size: 12px;
        }
    `;
    document.head.appendChild(estilo);

    const wrapper = document.createElement("div");
    wrapper.id = "mpopauto_interface";
    wrapper.innerHTML = `
        <h4>MP OP Auto - by Eleição</h4>
        <label>📌 Assunto:<input id="assunto_op" type="text"></label>
        <label>🗓️ Data:<input id="data_op" type="date"></label>
        <label>🕒 Hora:<input id="hora_op" type="time"></label>
        <label>📍 Coordenadas + Jogador:<textarea id="dados_mp" rows="3"></textarea></label>
        <label>🎯 Fakes:<textarea id="fakes_mp" rows="3"></textarea></label>
        <label><input type="radio" name="modo_fake" value="igual" checked> Dividir igualmente</label><br>
        <label><input type="radio" name="modo_fake" value="fixo"> Fakes por jogador: <input id="qtd_fixa" type="number" style="width: 60px"></label><br>
        <button id="iniciar_envio">▶️ Iniciar Envio</button>
        <button id="clear_fila">🧹 Limpar Dados</button>
        <details>
            <summary>📂 Modelo de Mensagem</summary>
            <textarea id="template_padrao" rows="6"></textarea><br>
            <button id="salvar_padrao">💾 Salvar</button>
            <button id="restaurar_padrao">↩️ Restaurar</button>
        </details>
        <div id="log_envio_mp"></div>
    `;
    document.body.appendChild(wrapper);

    const defaultMensagem = `Olá [player]{player}[/player]!\n\n[i]Segue seu alvo para a próxima OP.[/i]\n\n📅 [b]{data_hora}[/b]\n\n⚔️ [b]ALVOS NT[/b]\n[spoiler=Spoiler]\n{alvos}\n[/spoiler]\n\n⚔️ [b]ALVOS FAKES[/b]\n[spoiler=Spoiler]\n{fakes}\n[/spoiler]`;

    const getMensagemPadrao = () => localStorage.getItem('mp_mensagem_padrao') || defaultMensagem;
    const setMensagemPadrao = (str) => localStorage.setItem('mp_mensagem_padrao', str);

    document.getElementById('template_padrao').value = getMensagemPadrao();

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
        localStorage.removeItem('mp_logs');
        document.getElementById('assunto_op').value = '';
        document.getElementById('data_op').value = '';
        document.getElementById('hora_op').value = '';
        document.getElementById('dados_mp').value = '';
        document.getElementById('fakes_mp').value = '';
        document.getElementById('log_envio_mp').innerHTML = '';
    };

    const addLog = (msg) => {
        const box = document.getElementById('log_envio_mp');
        const p = document.createElement('div');
        p.textContent = msg;
        box.appendChild(p);
        const logs = JSON.parse(localStorage.getItem('mp_logs') || '[]');
        logs.push(msg);
        localStorage.setItem('mp_logs', JSON.stringify(logs));
    };

    const iniciarEnvio = () => {
        const assunto = document.getElementById('assunto_op').value.trim();
        const data_raw = document.getElementById('data_op').value;
        const hora = document.getElementById('hora_op').value;
        const dados = document.getElementById('dados_mp').value.trim();
        const fakes = document.getElementById('fakes_mp').value.trim();

        const modo = document.querySelector('input[name="modo_fake"]:checked').value;
        const qtdFixa = parseInt(document.getElementById('qtd_fixa').value);

        const [ano, mes, dia] = data_raw.split('-');
        const datahora = `${dia}/${mes} - ${hora}`;

        const jogadores = {};
        for (const linha of dados.split('\\n')) {
            const match = linha.match(/^(\\d+\\|\\d+)\\s+(.*)$/);
            if (!match) continue;
            const coord = match[1];
            const nome = match[2];
            if (!jogadores[nome]) jogadores[nome] = [];
            jogadores[nome].push(coord);
        }

        const fakeList = fakes.split('\\n');
        const fila = [];
        const nomes = Object.keys(jogadores);
        const porJogador = modo === 'fixo' ? qtdFixa : Math.floor(fakeList.length / nomes.length);
        let index = 0;

        nomes.forEach((nome, i) => {
            const coords = jogadores[nome];
            const fake = fakeList.slice(index, index + porJogador);
            index += porJogador;
            const template = getMensagemPadrao()
                .replace('{player}', nome)
                .replace('{alvos}', coords.join('\\n'))
                .replace('{fakes}', fake.join('\\n'))
                .replace('{data_hora}', datahora);
            fila.push({ player: nome, assunto, corpo: template });
        });

        localStorage.setItem('fila_mp', JSON.stringify(fila));
        localStorage.setItem('fila_total', fila.length);
        const village = new URLSearchParams(window.location.search).get('village');
        window.location.href = `/game.php?village=${village}&screen=mail&mode=new`;
    };

    document.getElementById('iniciar_envio').onclick = () => {
        localStorage.removeItem('mp_logs');
        document.getElementById('log_envio_mp').innerHTML = '';
        iniciarEnvio();
    };

    // Envio Automático
    const fila = JSON.parse(localStorage.getItem('fila_mp') || '[]');
    const total = parseInt(localStorage.getItem('fila_total') || '0');

    if (fila.length > 0 && window.location.href.includes('screen=mail') && window.location.href.includes('mode=new')) {
        const atual = fila[0];
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
                setTimeout(() => {
                    fila.shift();
                    localStorage.setItem('fila_mp', JSON.stringify(fila));
                    localStorage.setItem('fila_total', total);
                    addLog(`📨 Enviado para ${atual.player} (${total - fila.length}/${total})`);
                    if (fila.length > 0) {
                        const village = new URLSearchParams(window.location.search).get('village');
                        window.location.href = `/game.php?village=${village}&screen=mail&mode=new`;
                    } else {
                        addLog(`✅ Todas as MPs foram enviadas.`);
                        const snd = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_4094e265d5.mp3?filename=notification-121041.mp3');
                        snd.addEventListener('canplaythrough', () => snd.play());
                    }
                }, 500);
            }, 1000);
        }
    }
})();
