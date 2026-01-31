
const express = require("express");
const server = express();
const Alati = require("./js/server/alati");
const alati = new Alati("alati.csv");
const os = require("os");
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
function dajPort(korime) {
  const HOST = os.hostname();
  let port = null;
  if (HOST != "spider") {
    port = 12222;
  } else {
    const portovi = require("/var/www/OWT/2025/portovi.js");
    port = portovi[korime];
  }
  return port;
}
const port = dajPort("mprusac23");
const putanja = __dirname;
console.log(putanja);
server.get("/", (zahtjev, odgovor) => {
  odgovor.redirect("/index.html");
});
server.get("/index.html", (zahtjev, odgovor) => {
  odgovor.sendFile(putanja + "/html/index.html");
});
server.get("/detalji.html", (zahtjev, odgovor) => {
  odgovor.sendFile(putanja + "/html/detalji.html");
});
server.get("/dodatna.html", (zahtjev, odgovor) => {
  odgovor.sendFile(putanja + "/html/dodatna.html");
});
server.get("/dokumentacija.html", (zahtjev, odgovor) => {
  odgovor.sendFile(putanja + "/html/dokumentacija.html");
});
server.get("/obrazac.html", (zahtjev, odgovor) => {
  odgovor.sendFile(putanja + "/html/obrazac.html");
});
server.get("/oautoru.html", (zahtjev, odgovor) => {
  odgovor.sendFile(putanja + "/html/oautoru.html");
});
server.use("/dizajn", express.static(putanja + "/css"));
server.use("/resursi", express.static(putanja + "/resursi"));
server.use("/JSKlijent", express.static(putanja + "/js/klijent"));
server.get("/alati", (zah, odg) => {
  const kategorija = zah.query.kategorija;
  const sviAlati = alati.dohvatiSve(kategorija);
  let html = `
<!DOCTYPE html>
<html lang="hr">
<head>
  <meta charset="UTF-8">
  <title>Popis AI alata</title>
  <link rel="stylesheet" href="/dizajn/mprusac23.css">
</head>
<body>
  <header>
    <div class="brand">
      <a href="/index.html">
        <img src="/resursi/slike/logo.png" alt="AI Logo" id="logo">
      </a>
      <h1>AI alati</h1>
    </div>
    <nav>
      <ul>
        <li><a href="/index.html">Početna</a></li>
        <li><a href="/oautoru.html">O autoru</a></li>
        <li><a href="/dokumentacija.html">Dokumentacija</a></li>
        <li><a href="/obrazac.html">Obrazac validacija</a></li>
        <li><a href="/alati">AI alati</a></li>
        <li><a href="/api/alati" target="_blank">REST API</a></li>
        <li><a href="/dodatna.html">Dodatna</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <div class="sadrzaj">
      <h2>Popis AI alata</h2>
            <form method="get" action="/alati">
          	  <label for="kategorija">Filtriraj po kategoriji:</label>
            <input type="text" id="kategorija" name="kategorija" value="${kategorija ? kategorija : ''}">
            <button type="submit">Filtriraj</button>
          </form>
          <ol> 
kategorija - provjerava je li kateg def ili ne, ako je def (? kateogrija) uzmi njezinu vrijednost ako nije def (: ") stavi prazan string
`;
  sviAlati.forEach((alat, index) => {
    html += ` 
        <li>
          ${alat.naziv} (${alat.godina}) - ${alat.kategorija} 
          <a href="/alati/detalji?naziv=${encodeURIComponent(alat.naziv)}">Detalji</a> 
          <form method="post" action="/alati/ukloni" style="display:inline">
            <input type="hidden" name="naziv" value="${alat.naziv}">
            <button type="submit">Ukloni</button>
          </form> 
          </li>
    `;
  });
  html += `
      </ol>
      <p><a href="/index.html">Natrag na početnu</a></p>
    </div>
  </main>
  <footer>
    <p><strong>Marin Prusac © 2025</strong></p>
    <div class="ikone">
      <a href="https:
        <img src="/resursi/slike/chatgpt.png" alt="ChatGPT">
      </a>
      <a href="https:
        <img src="/resursi/slike/perplexity.png" alt="Perplexity">
      </a>
      <a href="https:
        <img src="/resursi/slike/gemini.png" alt="Gemini">
      </a>
    </div>
  </footer>
</body>
</html>
`;
  odg.send(html);
});
server.get("/alati/detalji", (zah, odg) => {
  const naziv = zah.query.naziv;
  if (!naziv) {
    return odg.status(400).send("Nedostaje naziv alata.");
  }
  const alat = alati.dohvatiPoNazivu(naziv);
  if (!alat) {
    return odg.send(`
      <html>
      <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="/dizajn/mprusac23.css">
        <title>Detalji alata</title>
      </head>
      <body>
        <h1>Traženi AI alat nije pronađen!</h1>
        <p><a href="/alati">Natrag na popis alata</a></p>
      </body>
      </html>
    `);
  }
  const html = ` 
    <html>
    <head>
      <meta charset="UTF-8">
      <link rel="stylesheet" href="/dizajn/mprusac23.css">
      <title>Detalji alata</title>
    </head>
    <body>
      <h1>${alat.naziv}</h1> 
      <p><strong>Opis:</strong> ${alat.opis}</p>
      <p><strong>Kategorija:</strong> ${alat.kategorija}</p>
      <p><strong>URL:</strong> <a href="${alat.url}" target="_blank">${alat.url}</a></p> 
      <p><strong>Godina pokretanja:</strong> ${alat.godina}</p>
      <p><a href="/alati">Natrag na popis alata</a></p>
    </body>
    </html>
  `;
  odg.send(html);
});
server.post("/alati/ukloni", (zah, odg) => {
  const nazivZaBrisanje = zah.body.naziv;
  if (!nazivZaBrisanje) {
    return odg.status(400).send("Nedostaje naziv alata za brisanje.");
  }
  alati.ukloniPoNazivu(nazivZaBrisanje);
  odg.redirect("/alati");
});
server.get("/api/alati", (zah, odg) => {
  const svi = alati.dohvatiSve();
  odg.status(200).json(svi);
});
server.post("/api/alati", (zah, odg) => {
  const { naziv, opis, kategorija, url, godina } = zah.body;
  if (!naziv || !opis || !kategorija || !url || !godina) {
    return odg.status(400).json({ greska: "Neispravni ili nepotpuni podaci za alat." });
  }
  const novi = { naziv, opis, kategorija, url, godina };
  alati.dodajNovi(novi);
  odg.status(201).json(novi);
});
server.put("/api/alati", (zah, odg) => {
  odg.status(405).json({ greska: "Metoda nije dopuštena za popis alata." });
});
server.delete("/api/alati", (zah, odg) => {
  odg.status(405).json({ greska: "Metoda nije dopuštena za popis alata." });
});
server.get("/api/alati/:naziv", (zah, odg) => {
  const naziv = zah.params.naziv;
  const alat = alati.dohvatiPoNazivu(naziv);
  if (!alat) {
    return odg.status(404).json({ greska: "AI alat s traženim nazivom nije pronađen." });
  }
  odg.status(200).json(alat);
});
server.put("/api/alati/:naziv", (zah, odg) => {
  const naziv = zah.params.naziv;
  const alat = alati.dohvatiPoNazivu(naziv);
  if (!alat) {
    return odg.status(404).json({ greska: "AI alat s traženim nazivom nije pronađen za ažuriranje." });
  }
  const { naziv: noviNaziv, opis, kategorija, url, godina } = zah.body;
  if (!noviNaziv || !opis || !kategorija || !url || !godina) {
    return odg.status(400).json({ greska: "Neispravni podaci za ažuriranje." });
  }
  const novi = { naziv: noviNaziv, opis, kategorija, url, godina };
  alati.azurirajPostojeci(novi);
  odg.status(200).json(novi);
});
server.delete("/api/alati/:naziv", (zah, odg) => {
  const naziv = zah.params.naziv;
  const alat = alati.dohvatiPoNazivu(naziv);
  if (!alat) {
    return odg.status(404).json({ greska: "AI alat s traženim nazivom nije pronađen za brisanje." });
  }
  alati.ukloniPoNazivu(naziv);
  odg.status(204).send();
});
server.post("/api/alati/:naziv", (zah, odg) => {
  odg.status(405).json({ greska: "Metoda nije dopuštena za specifični alat." });
});
server.post("/obrazac", (zah, odg) => {
  const ime = zah.body.ime || "korisniče";
  const html = ` 
    <!DOCTYPE html>
    <html lang="hr">
    <head>
      <meta charset="UTF-8">
      <title>Obrazac poslan</title>
      <link rel="stylesheet" href="/dizajn/mprusac23.css">
    </head>
    <body>
      <main class="sadrzaj">
        <h2>Hvala ${ime}, obrazac je uspješno poslan!</h2>
        <p><a href="/index.html">Povratak na početnu stranicu</a></p>
      </main>
    </body>
    </html>
  `;
  odg.send(html);
});
server.use((zahtjev, odgovor) => {
  odgovor.status(404);
  odgovor.send("Stranica nije pronađena!");
});
server.listen(port, () => {
  console.log(`Server pokrenut na portu: ${port}`);
});
