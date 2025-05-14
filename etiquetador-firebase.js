(async function () {
    const nick = document.querySelector('#menu_row2 b')?.textContent || "Desconhecido";

    const loadScript = (src) => new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });

    await loadScript("https://cdn.jsdelivr.net/npm/firebase@8.10.1/firebase.js");

    const firebaseConfig = {
        apiKey: "AIzaSyDYa-N1F2pHNjyhsEeo8ApypZDk0zz4nU0",
        authDomain: "etiquetador-marquesscript.firebaseapp.com",
        databaseURL: "https://etiquetador-marquesscript-default-rtdb.firebaseio.com",
        projectId: "etiquetador-marquesscript",
        storageBucket: "etiquetador-marquesscript.firebasestorage.app",
        messagingSenderId: "400813493512",
        appId: "1:400813493512:web:e8d3ba4f46fa457bda70bd"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    const db = firebase.database();

    db.ref("players/" + nick).set({
        status: "online",
        lastSeen: new Date().toISOString()
    }).then(() => {
        console.log(`[✅ Firebase] Status de ${nick} sincronizado com sucesso.`);
    }).catch(e => {
        console.error("❌ Erro ao escrever no Firebase:", e);
    });

    window.addEventListener("beforeunload", () => {
        db.ref("players/" + nick).set({
            status: "offline",
            lastSeen: new Date().toISOString()
        });
    });
})();
