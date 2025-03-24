document.addEventListener("DOMContentLoaded", () => {
    const baseURL = "http://localhost:3000/characters";
    const characterBar = document.getElementById("character-bar");
    const detailedInfo = document.getElementById("detailed-info");
    const characterName = document.getElementById("name");
    const characterImage = document.getElementById("image");
    const characterVotes = document.getElementById("vote-count");
    const votesForm = document.getElementById("votes-form");
    const votesInput = document.getElementById("votes");
    const resetButton = document.getElementById("reset-btn");
    const characterForm = document.getElementById("character-form");

    let currentCharacter = null;

    // Fetch and display characters in the character bar
    fetch(baseURL)
        .then(res => res.json())
        .then(characters => {
            characters.forEach(character => addCharacterToBar(character));
        });

    function addCharacterToBar(character) {
        const span = document.createElement("span");
        span.textContent = character.name;
        span.addEventListener("click", () => displayCharacterDetails(character));
        characterBar.appendChild(span);
    }

    function displayCharacterDetails(character) {
        currentCharacter = character;
        characterName.textContent = character.name;
        characterImage.src = character.image;
        characterVotes.textContent = character.votes;
    }

    // Handle votes form submission
    votesForm.addEventListener("submit", event => {
        event.preventDefault();
        if (currentCharacter) {
            const newVotes = parseInt(votesInput.value) || 0;
            currentCharacter.votes += newVotes;
            characterVotes.textContent = currentCharacter.votes;
            votesInput.value = "";

            // Update votes on the server
            fetch(`${baseURL}/${currentCharacter.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ votes: currentCharacter.votes })
            });
        }
    });

    // Reset votes
    resetButton.addEventListener("click", () => {
        if (currentCharacter) {
            currentCharacter.votes = 0;
            characterVotes.textContent = 0;

            // Reset votes on the server
            fetch(`${baseURL}/${currentCharacter.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ votes: 0 })
            });
        }
    });

    // Handle new character form submission
    characterForm.addEventListener("submit", event => {
        event.preventDefault();
        const name = document.getElementById("new-name").value;
        const image = document.getElementById("new-image").value;
        const newCharacter = { name, image, votes: 0 };

        fetch(baseURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCharacter)
        })
        .then(res => res.json())
        .then(character => {
            addCharacterToBar(character);
            displayCharacterDetails(character);
        });

        characterForm.reset();
    });
});
