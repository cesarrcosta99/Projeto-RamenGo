document.addEventListener('DOMContentLoaded', () => {
    const apiKey = "ZtVdh8XQ2U8pWI2gmZ7f796Vh8GllXoN7mr0djNf";
    const brothsContainer = document.querySelector('.broths');
    const proteinsContainer = document.querySelector('.proteins');
    const buttonImage = document.getElementById('defaultImage');
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

            if (selectedBrothId && selectedProteinId) {
                buttonImage.src = "../assets/button-sucess.png";
            }
        });

        card.querySelector('img').setAttribute('data-image-inactive', item.imageInactive);
        card.querySelector('img').setAttribute('data-image-active', item.imageActive);

        return card;
    };

    const updateCarouselIndicators = (carousel, container) => {
        const indicators = carousel.querySelectorAll('.carousel-indicator');
        const totalItems = container.children.length;
        const itemWidth = container.children[0].offsetWidth;
        const scrollPosition = container.scrollLeft;
        const currentItem = Math.round(scrollPosition / itemWidth);

        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentItem);
        });
    };

    const setupCarousel = (container, type) => {
        const carousel = container.closest('.carousel');
        const indicatorContainer = carousel.querySelector('.carousel-controls');

        const totalItems = container.children.length;
        for (let i = 0; i < totalItems; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'carousel-indicator';
            if (i === 0) indicator.classList.add('active');
            indicatorContainer.appendChild(indicator);
        }

        container.addEventListener('scroll', () => {
            updateCarouselIndicators(carousel, container);
        });
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
        setupCarousel(brothsContainer, 'broths');
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
        setupCarousel(proteinsContainer, 'proteins');
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
        .then(response => {
            alert('Pedido enviado com sucesso!');
            localStorage.setItem('orderData',JSON.stringify(response.data))

            window.location.href='../sucess/index.html'

        })
        .catch(error => {
            console.error('Erro ao enviar pedido:', error);
            alert('Erro ao enviar pedido. Por favor, tente novamente.');
        });

    });
});
