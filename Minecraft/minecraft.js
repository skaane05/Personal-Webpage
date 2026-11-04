const SERVER_IP = "andska05.aternos.me";


async function getMinecraftStatus() {
    const url = `https://api.mcsrvstat.us/3/${SERVER_IP}`;
    console.log("Hallo")
    try {
        console.log("Trying")
        const response = await fetch(url, {
            headers: {
                "User-Agent": "NTNU-Folkesida/1.0"
            }
        });

        if (!response.ok) {
            throw new Error("API-feil: " + response.status);
        }

        const data = await response.json();

        if (!data.online) {
            document.querySelector("#status").textContent = "Offline";
            return;
        }

        document.querySelector("#status").textContent = "Online";

        document.querySelector("#playerCount").textContent =
            `${data.players.online}/${data.players.max}`;

        const playerList = document.querySelector("#players");
        playerList.innerHTML = "";

        (data.players.list || []).forEach(player => {
            const li = document.createElement("li");
            li.textContent = player.name;
            playerList.appendChild(li);
        });

    } catch (error) {
        console.error(error);
        document.querySelector("#status").textContent = "Kunne ikke hente status";
    }
}

getMinecraftStatus();

// Oppdater hvert 60. sekund
setInterval(getMinecraftStatus(), 1000);
setInterval(console.log("up"), 1000);