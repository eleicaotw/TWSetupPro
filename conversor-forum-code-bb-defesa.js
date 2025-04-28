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
