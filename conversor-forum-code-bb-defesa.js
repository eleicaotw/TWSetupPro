(function () {
    'use strict';

    const estiloTW = `
        #twConversor {
            font-family: Verdana, sans-serif;
            background-color: #f4e4bc;
            border: 2px solid #c4a300;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 0 10px #0006;
            width: 380px;
        }
        #twConversor h4 {
            margin: 0 0 10px 0;
            font-size: 16px;
            color: #502d16;
        }
        #twConversor textarea {
            width: 100%;
            font-family: monospace;
            margin-bottom: 10px;
            padding: 5px;
            resize: vertical;
        }
        #twConversor button {
            background-color: #d0b36b;
            border: 1px solid #aa8c39;
            padding: 5px 10px;
            cursor: pointer;
            font-weight: bold;
        }
        #minimizarTW {
            position: absolute;
            top: 5px;
            right: 10px;
            background: none;
            border: none;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
            color: #502d16;
        }
        #twWrapper {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
        }
        #twToggle {
            display: none;
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: #f4e4bc;
            border: 2px solid #c4a300;
            border-radius: 50%;
            font-size: 20px;
            font-weight: bold;
            width: 30px;
            height: 30px;
            text-align: center;
            line-height: 25px;
            cursor: pointer;
            z-index: 9999;
        }
    `;

    const estilo = document.createElement("style");
    estilo.textContent = estiloTW;
    document.head.appendChild(estilo);

    const wrapper = document.createElement("div");
    wrapper.id = "twWrapper";
    wrapper.innerHTML = `
        <div id="twConversor">
            <button id="minimizarTW">−</button>
            <h4>Corrigir Numeração TW</h4>
            <textarea id="entrada" rows="10" placeholder="Cole os códigos aqui..."></textarea>
            <button id="converter">Corrigir Numeração</button>
            <textarea id="saida" rows="10" readonly placeholder="Resultado..."></textarea>
        </div>
        <div id="twToggle">+</div>
    `;
    document.body.appendChild(wrapper);

    const entrada = document.getElementById("entrada");
    const saida = document.getElementById("saida");
    const btnConverter = document.getElementById("converter");
    const btnMinimizar = document.getElementById("minimizarTW");
    const toggleBtn = document.getElementById("twToggle");
    const blocoConversor = document.getElementById("twConversor");

    btnConverter.onclick = function () {
        const input = entrada.value.trim();
        const linhas = input.split(/\n+/);
        let contador = 1;

        const resultados = linhas.map(linha => {
            return linha.replace(/\[\*\]1/, `[*]${contador++}`);
        }).join("\n");

        saida.value = resultados;
    };

    btnMinimizar.onclick = () => {
        blocoConversor.style.display = "none";
        toggleBtn.style.display = "block";
    };

    toggleBtn.onclick = () => {
        blocoConversor.style.display = "block";
        toggleBtn.style.display = "none";
    };
})();
