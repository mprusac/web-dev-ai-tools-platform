
const fs = require('fs'); //učitava ugrađeni Node.js modul koji omogućuje rad s datotekama na disku, fs - file system
//Ova linija u tvoj program učitava skup alata koji omogućuju: čitanje (readFileSync, readFile, ...), 
// pisanje (writeFileSync, appendFileSync, ...), provjeru (existsSync, statSync, ...), brisanje (unlinkSync, ...), i mnoge druge operacije s datotekama i mapama.
// Dakle, bez ove linije, ne bi mogao čitati ni pisati .csv datoteku u kojoj su spremljeni AI alati.
//CSV datoteka alati.csv je jedini izvor podataka. Klasa Alati koristi fs metode readFileSync, writeFileSync i appendFileSync da bi: ž
// čitala sve alate, brisala ili ažurirala postojeće, dodavala nove.

//"Učitavam ugrađeni Node.js modul fs, koji mi omogućuje da čitam i pišem CSV datoteku s alatima umjetne inteligencije. 
// Bez toga ne bih mogao dohvatiti ili spremiti podatke koji su temelj aplikacije."

class Alati { //sadrži sve metode za rad s alatima, ponaša se kao "mala baza podataka" iznad CSV-a.
    constructor(putanjaCSV) { //konstruktor - posebna metoda klase koja se automatski poziva kada netko naparavi novu instancu klase
        this.putanja = putanjaCSV; //putanjaCSV je argument koji primiš kod poziva new Alati(...), 
        // this.putanja — pohranjuješ tu putanju kao vlastito svojstvo objekta, kasnije ga koristiš u svakoj metodi
    }

    //const alati = new Alati("alati.csv");  alati.putanja === "alati.csv" - Svaka metoda zna s kojom CSV datotekom treba raditi jer this.putanja pokazuje na nju.
    //Tvoj constructor omogućuje da se cijela aplikacija automatski zna povezati s pravom CSV datotekom, bez da to hardkodiraš u svakoj metodi.
    //Definiram klasu Alati, koja ima constructor u kojem pamtim putanju do CSV datoteke. Kad instanciram objekt pomoću new Alati(...), 
    // svaka metoda zna iz koje datoteke treba čitati i pisati, jer koristim this.putanja."
    // Metoda 'dohvatiSve' vraća sve alate iz CSV datoteke.
    // Parametar 'kategorija' je opcionalan – ako nije naveden, vraćaju se svi alati.
    // Ako je naveden, kasnije se radi filtracija po toj kategoriji.
    dohvatiSve(kategorija = null) { //metoda klase Alati, ako nista nije poslano bit ce null
        // Čitamo cijeli sadržaj CSV datoteke kao tekst (sinkrono, bez callbacka).
        // 'this.putanja' je npr. "alati.csv", a 'utf-8' znači da čitamo kao običan tekst.
        const podaci = fs.readFileSync(this.putanja, 'utf-8'); //fs.readFileSync(...), Čita sadržaj CSV datoteke kao običan tekst., this.putanja je "alati.csv" (dodijeljeno u constructoru)., 'utf-8' kaže da se čita kao Unicode tekst - čita datoteku kao teskt a ne kao bianrne podatke, ne prikazuje cudne simbole
        //Nakon ove linije, varijabla podaci sadrži cijeli sadržaj datoteke kao jedan veliki string,
        // Uklanjamo prazne znakove s kraja i razdvajamo tekst po novim redovima.
        // Tako dobivamo niz stringova – svaki string predstavlja jedan red u CSV-u.
        const redovi = podaci.trim().split('\n'); //trim() — uklanja prazne razmake s početka/kraja teksta., split('\n') — dijeli tekst po retcima., redovi postaje niz stringova — po jedan red za svaki alat.

        let alati = redovi
            .map(red => red.trim()) //Za svaki red iz CSV-a uklanja razmake na početku i kraju.
            .filter(red => red !== "") //Uklanja prazne retke (ako postoje).
            .map(red => {

                //destrukturiranje niza - uzmeš vrijednosti iz niza i rasporediš ih u varijable po redu
                const [naziv, opis, kategorijaA, url, godina] = red.split(';').map(e => e.trim());
                //trim uklanja sve razmake, tabove i prijelome
                //split - razdvaja tekst na redove, jedan veliki string pretvara u niz, gdje svaki element niza predstavlja jedan red
                return { naziv, opis, kategorija: kategorijaA, url, godina };
                //Dijeli svaki red po ; i dobiva 5 elemenata: naziv, opis, kategorija, url, godina
                //Svaki element se dodatno trim-a. kategorijaA → privremeno ime (jer kategorija već postoji kao parametar funkcije).
                //return { ... } Stvara novi JavaScript objekt sa strukturiranim podacima:

                // Početna obrada redova iz CSV-a:
                // 1. .map(red => red.trim()) – prolazi kroz svaki red i uklanja praznine s početka i kraja (npr. višak razmaka ili \n).
                // 2. .filter(red => red !== "") – izbacuje sve prazne retke iz CSV-a.
                // 3. .map(red => { ... }) – parsira svaki red kao CSV zapis i pretvara ga u JS objekt.
                //    - red.split(';') – dijeli CSV redak u polja po znaku ';'
                //    - .map(e => e.trim()) – uklanja razmake iz svakog polja
                //    - destrukturiranje – sprema 5 vrijednosti u varijable: naziv, opis, kategorijaA, url, godina
                //    - return vraća JS objekt gdje 'kategorijaA' preimenujemo u 'kategorija' za konzistentnost

                // Vraćamo JavaScript objekt s podacima iz CSV retka.
                // Ključevi su naziv, opis, kategorija, url, godina.
                // Varijabla 'kategorijaA' sadrži vrijednost iz CSV-a, ali ključ u objektu mora biti 'kategorija',
                // pa koristimo zapis: kategorija: kategorijaA
                // Ovo nije JSON nego pravi JS objekt, iako izgleda jednako.
                // Kasnije, kada šaljemo podatke klijentu (npr. putem API-ja), JS objekt se može pretvoriti u JSON.

            });

        // Ako je korisnik poslao parametar 'kategorija' (npr. /alati?kategorija=tekst)
        if (kategorija) { //provjera je li poslan neki get parametar
            const kat = kategorija.toLowerCase(); //Pretvara kategoriju koju je korisnik poslao (npr. tekst) u mala slova: "tekst".
            alati = alati.filter(a => a.kategorija.toLowerCase() === kat); //.filter(...) zadržava samo one alate čija kategorija odgovara uneseno.
            //a - trenutni element niza - jedan alat tj objekt sa svim info alata, kategorija - pristupa se svojstvu tog alata, lowercase, 
            // Filtriramo niz 'alati' tako da ostanu samo oni čija kategorija odgovara traženoj
            // .filter() prolazi kroz svaki alat i zadržava samo one koji zadovoljavaju uvjet
            // a.kategorija.toLowerCase() === kat → znači kategorija se mora točno poklapati
        }

        //Vrati mi true samo ako je kategorija ovog alata (pretvorena u mala slova) jednaka traženoj kategoriji korisnika (također u malim slovima)."

        return alati; //Vraća se niz alata kao JavaScript objekti.
    }


    dohvatiPoNazivu(trazeniNaziv) { //metoda klase alati, prima naziv alata koji trazimo, koristi se u serveru za REST rutu /api/alati/:naziv, za HTML stranicu /alati/detalji?naziv=ChatGPT
        const svi = this.dohvatiSve(); //poziva metodu bez filtera, cita scsv datoteku i vraca sve alate kao niz objekata
        return svi.find(a => a.naziv.trim().toLowerCase() === trazeniNaziv.trim().toLowerCase()) || null;
        //find - js metoda koja prolazi svaki element niza, vraca prvi koji je uvjet true, ako nijedan ne odgovara vraca undefined
        //a - trenutni alat, a.naziv - naziv alata, trim uklanja razmake s pocetka i kraja, lower usporeduje mala slova, usporeduje s trazennaziv
        //ako ne pronadje alat vraca undefined
    }

    // Metoda 'dohvatiPoNazivu' vraća jedan alat iz CSV-a koji odgovara traženom nazivu.
    // Korisnik šalje 'trazeniNaziv' (npr. iz URL parametra).
    // 1. Poziva se 'dohvatiSve()' da bi dobili sve alate kao niz objekata.
    // 2. .find(...) prolazi kroz svaki alat i traži prvi koji odgovara po nazivu.
    // 3. .trim() uklanja razmake s početka/kraja, a .toLowerCase() pretvara sve u mala slova.
    //    Time omogućujemo da korisnik može upisati naziv alata neovisno o velikim slovima i razmacima.
    // 4. Ako alat postoji – vraća se taj objekt; ako ne postoji – vraća se null.


    //"Metoda dohvatiPoNazivu traži jedan alat iz CSV-a čiji naziv odgovara onome koji je korisnik poslao. 
    // Poziva dohvatiSve() da dobije sve alate, zatim koristi .find() s usporedbom koja ignorira velika i mala slova. 
    // Ako alat ne postoji, vraća null, što omogućuje serveru da javi korisniku da alat nije pronađen."


    ukloniPoNazivu(nazivZaBrisanje) {
        //ucitaj sve alate
        const svi = this.dohvatiSve();
        //ukloni onaj ciji naziv odg
        const filtrirani = svi.filter(a => a.naziv.toLowerCase() !== nazivZaBrisanje.toLowerCase()); //filter prolazi sve alate, za svaki provjerava je li naziv razlicit od onog koji zelimo obrisat, ako je isti baca ga ako je razlciit ostavlja ga u lsiti
        //svi - niz alata iz csv, filter prolazi kroz svaki element niza, izvrsava funkciju za svaki, zadrzava samo one koji vrate true, a je jedan alat, tijekom svakog prolaza ti filter daje jedan alat a da ga ispitas,
        //a.naziv je naziv alata, lower pretvara u mala slova, nazivzabrisanje je ono sto korisnik zeli brisati i to u mala slova da usporedba bude pravedna, != vraca true ako su dvije vr razlciite
        //Za svaki alat u nizu, usporedi njegov naziv s nazivom za brisanje. Ako nisu isti → zadrži taj alat u rezultatu."
        //pretvori ostatak u csv formar
        const csv = filtrirani.map(a => `${a.naziv};${a.opis};${a.kategorija};${a.url};${a.godina}`).join('\n');
        //prepisi datoteku s tim sadrzajem
        fs.writeFileSync(this.putanja, csv, 'utf-8');//spremi novi sadrzaj u datoteku, write prepisuje cijelu datoteku s novim sadrzajem, utf unicode, this.putanja je alati.csv
    }

    // Metoda 'ukloniPoNazivu' briše alat iz CSV-a prema točnom nazivu.
    // 1. Dohvaćamo sve alate iz CSV datoteke.
    // 2. .filter(...) stvara novi niz alata u kojem je izbačen onaj s nazivom za brisanje.
    //    Koristimo .toLowerCase() da usporedba ne ovisi o velikim/malim slovima.
    // 3. .map(...) pretvara svaki alat natrag u CSV red (kao tekst).
    //    Koristimo template string `${...}` za lakše formatiranje svake linije.
    // 4. .join('\n') spaja sve retke u jedan string, odvojen znakom za novi red.
    // 5. fs.writeFileSync(...) prepisuje CSV datoteku s novim (filtriranim) sadržajem.

    // 'this' koristimo jer pozivamo metodu unutar iste klase ('dohvatiSve').
    // .filter(...) vraća novi niz alata bez onog koji se treba obrisati.
    // .map(...).join('\n') pretvara taj niz u tekstualni CSV sadržaj (linije s točkama-zarezima).
    // fs.writeFileSync(...) prepisuje CSV datoteku – i time alat zapravo "brišemo".


    //"Metoda ukloniPoNazivu briše alat iz alati.csv tako da najprije pročita sve alate, zatim izbaci onaj čiji naziv odgovara onome koji se želi obrisati. 
    // Rezultat pretvara natrag u CSV format i upisuje u datoteku. 
    // Na taj način ne brišem jedan red ručno, nego regeneriram cijelu datoteku bez tog alata."

    dodajNovi(alat) { //alat - objekt s 5 svojstava
        const redak = `${alat.naziv};${alat.opis};${alat.kategorija};${alat.url};${alat.godina}`;
        //jedan redak csv datoteke, sprema txt prikaz alata, koristimo navodnike da mozemo direktno ubacivati varijable u tekst, podaci su razdvojeni ;
        fs.appendFileSync(this.putanja, `\n${redak}`, 'utf-8');
        //appendfilesync - ugradena node funkcija za dodavanje teksta na kraj datoteke
        //`\n${redak} novi redak, dodaje da se ne spoji s prethodnim retkom, utf 8 cuva znakove u ispravnom formatu
    }
    //Ova metoda formatira podatke o alatu u jedan CSV red, i zatim ga doda na kraj datoteke alati.csv, osiguravajući da prethodni redovi ostanu nepromijenjeni.
    //  Dodaje se nova linija s podacima razdvojenima točkom-zarezom.
    //Metoda dodajNovi prima alat kao objekt i pretvara ga u jedan CSV red pomoću template stringa. Taj red dodaje na kraj datoteke pomoću fs.appendFileSync, 
    // uz novi red \n da se ne spoji s prethodnim unosom. Na taj način omogućujem da REST POST doda novi alat bez mijenjanja starih."

    // Metoda 'dodajNovi' dodaje novi alat u CSV datoteku.
    // 1. Primljeni alat je objekt sa svojstvima: naziv, opis, kategorija, url, godina.
    // 2. Spajamo ta svojstva u jedan CSV redak koristeći template string i znak ';' između podataka.
    // 3. fs.appendFileSync(...) nadopisuje taj redak na kraj CSV datoteke.
    //    Dodajemo '\n' na početku da red ide u novi red u datoteci.




    azurirajPostojeci(alatZaAzuriranje) { //alatazazaur objekt koji sadrzi noviju verziju alata s istim nazivom
        const svi = this.dohvatiSve();
        const novi = svi.map(a => { //map - prolazi svaki alat niza i vraca novi elem za svaki stari
            if (a.naziv.toLowerCase() === alatZaAzuriranje.naziv.toLowerCase()) { //usporeduje naziv alata sa svakim koji treba azurirati, case sensitive
                return alatZaAzuriranje; //ako su nazivi jednaki vraca novu verziju alata
            } else {
                return a; //, inace zadrzava staru
            }
        });
        //pretvara azurirani niz u csv teskt, Svaki alat pretvara u jedan red CSV-a pomoću template stringa.
        // Na kraju koristi .join('\n') da spoji sve redove s novim redom između njih.
        const csv = novi.map(a => `${a.naziv};${a.opis};${a.kategorija};${a.url};${a.godina}`).join('\n');
        //novi je niz objekata nakon sto smo jedan azurirali, sada zelimo te alate ponovo zapisati u csv datoteku, svaki alat treba bit jedan txt red u scv formatu tj vr razdvojene s ;
        //.map() prolazi svaki objekt (alat) iz niza novi. Vraća novi niz — ovaj put ne objekata, već stringova.
        //=> Ovo je arrow funkcija, i koristi template literal (`${...}`) da kreira jedan red CSV-a za svaki alat.
        //.join('\n') ih spaja u jedan veliki string, pri čemu između svakog ide znak novog reda (\n).
        fs.writeFileSync(this.putanja, csv, 'utf-8'); //Cijeli novi CSV sadržaj zapisuješ nazad u "alati.csv". Zastarjeli alat je zamijenjen novim, ostali su ostali nepromijenjeni.

        //map() je metoda koju svaki niz (array) u JavaScriptu ima.
        // koristi se za pretvaranje svakog elementa niza u nešto drugo.
        //Vraća novi niz, koji sadrži rezultat funkcije koju si primijenio na svaki eleme

        //if odnosno tijelo funkcije unutar map se izvrsava za svaki alat

        //novi ➝ niz svih alata (objekti).
        //.map(...) ➝ svaki alat a pretvara u string red za CSV.
        //Rezultat je novi niz redova (kao stringovi).
        //.join('\n') ➝ spaja ih u jedan veliki CSV tekst.

        //map() koristim da za svaki alat iz niza stvorim jedan red u CSV formatu. Metoda map() prolazi sve elemente, i za svaki vraća novu vrijednost — u mom slučaju, string poput naziv;opis;kategorija;url;godina.
        //  Tako stvorim niz stringova koji onda spojim i spremim natrag u datoteku."
    }
}

//"Metoda azurirajPostojeci mi omogućuje da ažuriram podatke o postojećem AI alatu tako da:
// pročitam sve alate iz CSV-a,pronađem onaj čiji naziv odgovara,
// zamijenim ga novim podacima, i ponovno spremim cijeli sadržaj CSV-a u datoteku.
// Na taj način omogućujem PUT zahtjevima iz REST API-ja da ažuriraju alate."

module.exports = Alati;  //Ovo je standardna Node.js naredba kojom izvozimo klasu Alati iz ovog modula (alati.js), da bi je mogao koristiti server.js.

//U server.js si zato mogao napisati: const Alati = require("./js/server/alati");

//"Klasa Alati mi omogućuje da u Node.js aplikaciji radim s .csv datotekom kao da je baza.
// Sve metode prvo čitaju sadržaj kao tekst, zatim ga parsiraju u objekte, i po potrebi filtriraju, ažuriraju ili brišu.
// Kad promijenim podatke, ponovno ih pretvaram u CSV format i upisujem natrag u datoteku."



//readfilesync - Čita sadržaj datoteke i vraća ga kao string
//const podaci = fs.readFileSync(this.putanja, 'utf-8');
// Ova linija čita cijelu CSV datoteku kao običan tekst kako bi se mogla parsirati u JS objekte


//fswritefilesnyc - Prepisuje cijelu datoteku s novim sadržajem, briše stari
// Ako datoteka već postoji — briše je i napiše ispočetka.
//fs.writeFileSync("alati.csv", noviSadrzaj, "utf-8");
// "alati.csv" — datoteka koju želiš upisati
// noviSadrzaj — string koji želiš upisati (npr. novi CSV)
// "utf-8" — čuvaj ispravne znakove

// Ovom linijom izvozimo klasu 'Alati' iz ove datoteke.
// To nam omogućuje da ju uključimo u drugim datotekama pomoću 'require'.
// U našem slučaju, klasu koristimo u 'server.js' za manipulaciju CSV datotekom.


//fs.appendfilesnyc - dodaje novi sadrzaj na kraj postojece datoteke, bez brisanja starog
