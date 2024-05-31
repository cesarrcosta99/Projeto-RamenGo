document.addEventListener('DOMContentLoaded', () => {
    const apiKey = "ZtVdh8XQ2U8pWI2gmZ7f796Vh8GllXoN7mr0djNf";
    const brothsContainer = document.querySelector('.broths');
    const proteinsContainer = document.querySelector('.proteins');
    let selectedBrothId = null;
    let selectedProteinId = null;

    const createCard = (item, type) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.imageInactive}" alt="${item.name}" />
            <p class="name">${item.name}</p>
            <p class="description">${item.description}</p>
            <p class="price">US$ ${item.price}</p>
        `;

        card.addEventListener('click', () => {
            document.querySelectorAll(`.${type} .card`).forEach(c => {
                c.classList.remove('selected');
                c.querySelector('img').src = c.querySelector('img').getAttribute('data-image-inactive');
            });

            card.classList.add('selected');
            card.querySelector('img').src = item.imageActive;

            if (type === 'broths') {
                selectedBrothId = item.id;
            } else if (type === 'proteins') {
                selectedProteinId = item.id;
            }
        });

        card.querySelector('img').setAttribute('data-image-inactive', item.imageInactive);
        card.querySelector('img').setAttribute('data-image-active', item.imageActive);

        return card;
    };

    
    axios.get('https://api.tech.redventures.com.br/broths', {
        headers: {
            'x-api-key': apiKey
        }
    })
    .then(response => {
        response.data.forEach(broth => {
            const card = createCard(broth, 'broths');
            brothsContainer.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar broths:', error);
    });

    
    axios.get('https://api.tech.redventures.com.br/proteins', {
        headers: {
            'x-api-key': apiKey
        }
    })
    .then(response => {
        response.data.forEach(protein => {
            const card = createCard(protein, 'proteins');
            proteinsContainer.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar proteins:', error);
    });

    
    document.getElementById('submitButton').addEventListener('click', () => {
        if (!selectedBrothId || !selectedProteinId) {
            alert('Selecione um caldo e uma proteína.');
            return;
        }

        const requestBody = {
            brothId: selectedBrothId,
            proteinId: selectedProteinId
        };

        axios.post('https://api.tech.redventures.com.br/orders', requestBody, {
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            }
        })
        .then(() => {
            alert('Pedido enviado com sucesso!');
        })
        .catch(error => {
            console.error('Erro ao enviar pedido:', error);
            alert('Erro ao enviar pedido. Por favor, tente novamente.');
        });
    });
});
