// Čekaj da se cijeli HTML dokument učita prije nego izvršiš JavaScript
// DOMContentLoaded znači da su svi HTML elementi dostupni (ali slike još ne moraju biti)
// Ovo osigurava da elementi poput getElementById neće vratiti null
// Sav kod unutar ove funkcije izvršit će se tek kada je stranica spremna
// Idealno mjesto za postavljanje event listenera i manipulaciju DOM-om

document.addEventListener("DOMContentLoaded", () => {

    const slajdovi = [
        document.getElementById("slide1"),
        document.getElementById("slide2"),
        document.getElementById("slide3")
    ];
    // Dohvaćanje HTML elemenata slajdova po ID-u i spremanje u niz
    // Svaki element predstavlja jedan slajd u carouselu
    // Ova struktura omogućuje jednostavno upravljanje slajdovima pomoću indeksa
    // Elementi "slide1", "slide2" i "slide3" moraju postojati u HTML-u s tim ID-evima

    let trenutni = 0;
    // Brojčani indeks trenutno prikazanog slajda u nizu slajdova (0 = prvi)
    // Pomoću ove varijable carousel zna koji slajd treba prikazati
    let interval = null;
    // Varijabla za pohranu ID-a aktivnog intervala (setInterval)
    // Koristi se za automatsko pokretanje i zaustavljanje izmjene slajdova

    function prikaziSljedeci() {
        trenutni = (trenutni + 1) % slajdovi.length;
        slajdovi[trenutni].checked = true;
    }

    // Funkcija koja prikazuje sljedeći slajd u carouselu
    // Povećava trenutni indeks i koristi % da se vrati na početak kad dosegne kraj
    // Označava novi aktivni slajd postavljanjem njegovog .checked svojstva na true
    // Pretpostavlja se da su slajdovi radio inputi u HTML-u

    function prikaziPrethodni() {
        trenutni = (trenutni - 1 + slajdovi.length) % slajdovi.length;
        slajdovi[trenutni].checked = true;
    }

    // Funkcija koja prikazuje prethodni slajd u carouselu
    // Smanjuje trenutni indeks i koristi % da bi se rotirao na kraj ako padne ispod nule
    // Formula (trenutni - 1 + duljina) % duljina osigurava da indeks ostane pozitivan
    // Označava prethodni slajd postavljanjem njegovog .checked svojstva na true

    interval = setInterval(prikaziSljedeci, 5000);

    // Pokreće automatsko prikazivanje sljedećeg slajda svakih 5 sekundi
    // setInterval vraća ID koji spremamo u varijablu 'interval' za moguće zaustavljanje
    // Funkcija prikaziSljedeci() se poziva svakih 5000 milisekundi


    const prethodniGumb = document.getElementById("prethodni");
    const sljedeciGumb = document.getElementById("sljedeci");

    // Dohvaćanje gumba za ručno upravljanje carouselom
    // 'prethodni' za pomicanje unatrag, 'sljedeci' za pomicanje naprijed
    // Ovi elementi moraju imati odgovarajuće ID-eve u HTML-u


    if (prethodniGumb && sljedeciGumb) {
        prethodniGumb.addEventListener("click", () => {
            clearInterval(interval);
            prikaziPrethodni();
            interval = setInterval(prikaziSljedeci, 5000);
        });

        // Provjeravamo jesu li gumbi za ručno upravljanje dostupni u DOM-u
        // Kada korisnik klikne na prethodni slajd:
        // - Zaustavljamo trenutni interval (da se carousel ne zaleti)
        // - Prikazujemo prethodni slajd pomoću prikaziPrethodni()
        // - Ponovno pokrećemo automatsko prikazivanje svakih 5 sekundi
        // Isto vrijedi za gumb "sljedeći", ali on zove prikaziSljedeci()


        sljedeciGumb.addEventListener("click", () => {
            clearInterval(interval);
            prikaziSljedeci();
            interval = setInterval(prikaziSljedeci, 5000);
        });
    }


    const slike = document.querySelectorAll('.thumb');

    // Dohvaćamo sve slike koje imaju klasu "thumb" (thumbnail slike)
    // querySelectorAll vraća NodeList svih odgovarajućih elemenata
    // Ove slike koristimo za otvaranje lightbox prikaza nakon klika

    // Za svaku thumbnail sliku dodajemo funkcionalnost lightbox prikaza
    slike.forEach(slika => {
        // Sprječavamo da klik na roditelja (npr. <a>) otvori sliku u novom tabu
        slika.parentElement.addEventListener('click', e => e.preventDefault());

        //parent vraca a a slika je child tog a

        //e je event objekt predtsavlja dogadaj, prevent sprjecava stand ponasanje dogadaja

        // Kada korisnik klikne na sliku, prikazujemo ju u overlayu
        slika.addEventListener('click', () => {
            // Kreiramo overlay sloj koji će prekriti stranicu
            const overlay = document.createElement('div');
            overlay.id = 'lightbox-overlay';

            // Kreiramo novu veliku sliku koristeći isti izvor (src) kao thumbnail
            const velikaSlika = document.createElement('img');
            velikaSlika.src = slika.src;

            //mala slika  thumb - manja verzija, velika sluzi kao pregled, prikazuje se u lightbocu

            // Dodajemo gumb za zatvaranje (✖)
            const zatvori = document.createElement('span');
            zatvori.textContent = '✖';
            // Klikom na ✖ brišemo overlay sa stranice
            zatvori.addEventListener('click', () => {
                document.body.removeChild(overlay);
            });

            // Složimo strukturu: slika i zatvaranje unutar overlaya
            overlay.appendChild(velikaSlika);
            overlay.appendChild(zatvori);
            document.body.appendChild(overlay); // dodamo overlay u DOM
        });
    });

    // appendChild() dodaje HTML element unutar drugog kao njegovo dijete
    // U ovom slučaju, slika i gumb za zatvaranje postaju djeca "overlay" sloja
    // Na kraju, overlay se dodaje u body kako bi bio prikazan na stranici


    //appendchild Dodaj ovaj HTML element kao posljednje dijete unutar drugog elementa.

    // parentElement označava HTML element koji sadrži sliku (npr. <a> oko <img>)
    // e.preventDefault() sprječava da se klik na <a> ponaša kao link
    // thumbnail slika (mala) je pregled, a velika se prikazuje u overlayu
    // overlay.appendChild(...) dodaje sliku i gumb ✖ u lightbox sloj
    // document.body.appendChild(overlay) dodaje cijeli lightbox sloj na stranicu
    // document.body.removeChild(overlay) uklanja overlay sa stranice kad korisnik klikne ✖


    const opisi = document.querySelectorAll(".opis-alata");

    opisi.forEach(opis => {
        const puniTekst = opis.textContent.trim();
        const rijeci = puniTekst.split(/\s+/);


        if (rijeci.length <= 6) return;

        const prvih6 = rijeci.slice(0, 6).join(" ") + " ";
        const ostatak = rijeci.slice(6).join(" ");

        const vise = document.createElement("a");
        vise.href = "#";
        vise.textContent = "...";
        vise.classList.add("vise-link");


        const wrapper = opis.nextElementSibling;

        if (wrapper && wrapper.classList.contains("skriveno-sve")) {

            wrapper.style.display = "none";
            opis.textContent = prvih6;
            opis.appendChild(vise);


            vise.addEventListener("click", e => {
                e.preventDefault();
                wrapper.style.display = "block";
                opis.style.display = "none";
            });
        }
    });




    const linkovi = document.querySelectorAll("nav a");

    const trenutnaStranica = window.location.pathname.split("/").pop();

    linkovi.forEach(link => {
        const href = link.getAttribute("href");
        if (
            // Ako link vodi na trenutnu stranicu ili smo na početnoj ("/")
            href === trenutnaStranica ||
            (trenutnaStranica === "" && href.includes("index.html"))
        ) {
            // Označi ga kao aktivnog (dodaj CSS klasu)
            link.classList.add("aktivna");
        } else {
            // Inače makni oznaku ako je ima
            link.classList.remove("aktivna");
        }
    });
});
