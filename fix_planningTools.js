(function (){

    // Inject extra responsive CSS for better displaying
    function injectResponsiveCss() {
        var css = "@media (min-width: 768px) { .col-sm-4 { width: 50%; } }";
        var styleEl = document.createElement("style");
        styleEl.type = "text/css";
        if (styleEl.styleSheet) {
            // IE
            styleEl.styleSheet.cssText = css;
        } else {
            styleEl.appendChild(document.createTextNode(css));
        }
        document.head.appendChild(styleEl);
    }

    // 1 werkdag = 7.36 uur
    var HOURS_PER_DAY = 7.36;

    // Mapping van teller-codes naar leesbare omschrijvingen
    var CODE_MAP = {
        "V": "Wettelijke vakantie",
        "V!": "Wettelijke vakantie vorig jaar",
        "F": "Feestdag",
        "F!": "Feestdag vorig jaar",
        "V+": "Onbetaald verlof",
        "VR": "Vlaams opleidingsverlof",
        "VL": "Vlaams opleidingsverlof initiatief WG",
        "S+*": "Onbekende teller S+*",
        "J+": "Jeugd- en seniorenvakantie",
        "V5": "Extra verlof pas afgestudeerde",
        "ADV": "Arbeidsduurverkorting",
        "VC": "Historisch saldo",
        "45": "Arbeidsduurvrijstelling"
    };

    // Converteer "HH:MM" naar { days, hours, minutes } o.b.v. 7.36u per dag
    function parseTime(hhmm) {
        if (!hhmm || typeof hhmm !== "string" || hhmm.indexOf(":") === -1) {
            return null;
        }
        var parts = hhmm.split(":");
        var h = parseInt(parts[0], 10);
        var m = parseInt(parts[1], 10);
        if (isNaN(h) || isNaN(m)) return null;

        var totalMinutes = h * 60 + m;
        var minutesPerDay = HOURS_PER_DAY * 60;
        var days = Math.floor(totalMinutes / minutesPerDay);
        var restMinutes = totalMinutes - days * minutesPerDay;
        var hours = Math.floor(restMinutes / 60);
        var minutes = Math.round(restMinutes - hours * 60);

        return { days: days, hours: hours, minutes: minutes };
    }

    function formatTimeLong(hhmm) {
        var t = parseTime(hhmm);
        if (!t) return hhmm || "";
        var parts = [];
        parts.push(t.days + " d");
        parts.push(t.hours + " u");
        parts.push(t.minutes + " m");
        return parts.join(", ");
    }

    // Bepaal of de tabel nog "low quality" is (geen extra kolommen / geen d/u/m weergave)
    function isLowQualityTable(table) {
        if (!table) return false;

        var headerRow = table.querySelector("thead tr");
        if (!headerRow) return false;

        var headers = headerRow.querySelectorAll("th");
        // Als we al een 'Omschrijving'-kolom hebben, is de tabel al gefixt
        for (var i = 0; i < headers.length; i++) {
            var txt = headers[i].innerText || headers[i].textContent || "";
            if (txt.toLowerCase().indexOf("omschrijving") !== -1) {
                return false;
            }
        }

        // Kijk of we HH:MM waarden hebben in de body
        var body = table.querySelector("tbody");
        if (!body) return false;

        var hasHHMM = false;
        body.querySelectorAll("td .dynamicCell").forEach(function (div) {
            var v = (div.textContent || "").trim();
            if (/^\d{1,3}:\d{2}$/.test(v)) {
                hasHHMM = true;
            }
        });

        return hasHHMM;
    }

    function enhanceCountersGrid() {
        var container = document.querySelector("#counters table");
        if (!container) {
            // nothing to do
            return;
        }

        // Sla over als de tabel al gefixt is of geen ruwe HH:MM waarden heeft
        if (!isLowQualityTable(container)) {
            return;
        }

        var theadRow = container.querySelector("thead tr");
        var tbody = container.querySelector("tbody");
        if (!theadRow || !tbody) {
            console.warn("Counters-thead/tbody niet gevonden.");
            return;
        }

        // Extra kolomkoppen toevoegen
        var headers = theadRow.querySelectorAll("th");
        // Na de 'Teller'-kolom (index 1) een 'Omschrijving'-kolom
        var tellerHeader = headers[1];
        var descTh = document.createElement("th");
        descTh.className = "k-header";
        descTh.innerHTML = '<span class="k-link">Omschrijving</span>';
        tellerHeader.insertAdjacentElement("afterend", descTh);

        // Extra kolommen voor uitgeschreven tijd (Saldo, In aanvraag, Beschikbaar)
        var saldoHeader = headers[2];
        var openHeader = headers[3];
        var availHeader = headers[4];

        function makeLongHeader(title) {
            var th = document.createElement("th");
            th.className = "k-header";
            th.innerHTML = '<span class="k-link">' + title + ' (d/u/m)</span>';
            return th;
        }

        var saldoLongTh = makeLongHeader("Saldo");
        var openLongTh = makeLongHeader("In aanvraag");
        var availLongTh = makeLongHeader("Beschikbaar");

        saldoHeader.insertAdjacentElement("afterend", saldoLongTh);
        openHeader.insertAdjacentElement("afterend", openLongTh);
        availHeader.insertAdjacentElement("afterend", availLongTh);

        // Alle rijen verrijken
        Array.prototype.forEach.call(tbody.querySelectorAll("tr"), function (row) {
            var cells = row.querySelectorAll("td");
            if (cells.length < 5) return;

            // Teller-code (bv. "V", "F!", ...)
            var codeCell = cells[1];
            var codeDiv = codeCell.querySelector(".dynamicCell");
            var code = codeDiv ? codeDiv.textContent.trim() : "";

            // Omschrijving-kolom na code-kolom
            var descTd = document.createElement("td");
            descTd.className = codeCell.className;
            var descDiv = document.createElement("div");
            descDiv.className = "co1 dynamicCell";
            descDiv.textContent = CODE_MAP[code] || ("Onbekende teller (" + code + ")");
            descTd.appendChild(descDiv);
            codeCell.insertAdjacentElement("afterend", descTd);

            // Waardecellen: saldo, in aanvraag, beschikbaar
            // Let op: door Omschrijving-kolom is de index verschoven
            var saldoCell = row.querySelectorAll("td")[3];
            var openCell = row.querySelectorAll("td")[4];
            var availCell = row.querySelectorAll("td")[5];

            function appendLongCell(afterTd, hhmm) {
                var td = document.createElement("td");
                td.className = afterTd.className;
                var div = document.createElement("div");
                div.className = "co1 dynamicCell";
                div.textContent = formatTimeLong(hhmm);
                td.appendChild(div);
                afterTd.insertAdjacentElement("afterend", td);
                return td;
            }

            function getValue(td) {
                if (!td) return "";
                var d = td.querySelector(".dynamicCell");
                return d ? d.textContent.trim() : "";
            }

            // Voeg lange weergavekolommen toe
            var saldoVal = getValue(saldoCell);
            appendLongCell(saldoCell, saldoVal);

            var openVal = getValue(openCell);
            appendLongCell(openCell, openVal);

            var availVal = getValue(availCell);
            appendLongCell(availCell, availVal);
        });

        console.info("Counters-grid verrijkt met omschrijvingen en dagen/uren/minuten.");
    }

    // Elke 2 seconden checken of de tabel opnieuw 'low quality' is en dan opnieuw fixen
    try {
        injectResponsiveCss();        // inject CSS once
        enhanceCountersGrid();        // eerste run meteen
        setInterval(enhanceCountersGrid, 2000);
    } catch (e) {
        console.error("Fout bij verrijken counters-grid:", e);
    }
})()
