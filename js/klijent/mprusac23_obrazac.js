document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.setAttribute("novalidate", "true");

    form.addEventListener("submit", e => {
        let imaGresaka = false;

        document.querySelectorAll(".greska").forEach(el => el.remove());
        form.querySelectorAll("input, textarea, select").forEach(el => el.style.border = "");

        const obaveznaPolja = [
            { id: "ime", poruka: "Ime je obavezno." },
            { id: "prezime", poruka: "Prezime je obavezno." },
            { id: "email", poruka: "Email je obavezan." },
            { id: "tel", poruka: "Telefon je obavezan." },
            { id: "datum", poruka: "Datum je obavezan." },
            { id: "vrijeme", poruka: "Vrijeme je obavezno." },
            { id: "lozinka", poruka: "Lozinka je obavezna." },
            { id: "boja", poruka: "Odaberite boju sučelja." },
            { id: "dokument", poruka: "Priložite dokumentaciju." }
        ];

        obaveznaPolja.forEach(polje => {
            const el = document.getElementById(polje.id);
            if (!el.value.trim()) {
                prikaziGresku(el, polje.poruka);
                imaGresaka = true;
            }
        });

        const komentar = document.getElementById("komentar");
        const tekst = komentar.value.trim();
        const duzina = tekst.length;

        const sadrziURL = /(http:\/\/|https:\/\/)[^\s]+(\.hr|\.com|\.org)/.test(tekst);
        const sadrziZabranjene = /[$€]/.test(tekst);

        if (duzina < 200 || duzina > 1000 || !sadrziURL || sadrziZabranjene) {
            prikaziGresku(komentar, "Komentar mora imati 200–1000 znakova, sadržavati URL (.hr/.com/.org), bez $ i €.");
            imaGresaka = true;
        }


        const preciznost = document.getElementById("preciznost");
        const vrijednost = preciznost.value.trim();

        if (!/^\d+(\.\d{1,2})?$/.test(vrijednost)) {
            prikaziGresku(preciznost, "Unesite broj (najviše 2 decimale, bez zareza).");
            imaGresaka = true;
        }


        const checkboxovi = document.querySelectorAll("input[name='isprobano']:checked");
        if (checkboxovi.length === 0) {
            const grupa = document.querySelector(".checkbox-grupa");
            prikaziGresku(grupa, "Odaberite barem jedan isprobani AI alat.");
            imaGresaka = true;
        }


        const spol = document.querySelector("input[name='spol']:checked");
        if (!spol) {
            const spolDiv = document.querySelector("input[name='spol']").parentElement;
            prikaziGresku(spolDiv, "Odaberite spol.");
            imaGresaka = true;
        }


        if (imaGresaka) {
            e.preventDefault();
        }
    });

    function prikaziGresku(element, poruka) {
        const p = document.createElement("p");
        p.classList.add("greska");
        p.style.color = "red";
        p.textContent = poruka;
        element.style.border = "2px solid red";
        element.insertAdjacentElement("afterend", p);
    }
});
