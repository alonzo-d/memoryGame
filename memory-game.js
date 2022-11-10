"use strict";

window.onload = function() {
/** Memory game: find matching pairs of cards and flip both of them. */

    const FOUND_MATCH_WAIT_MSECS = 1000;
    const COLORS = [
        "red", "blue", "green", "orange", "purple",
        "red", "blue", "green", "orange", "purple",
    ];

    const colors = shuffle(COLORS);
    const flipped = [];

    const footer = document.getElementById('footer');
    const attemptsCounter = document.querySelector('.attemptsCounter');
    let attempts = 0;
    attemptsCounter.innerText = attempts;
    attemptsCounter.style.color = 'red';

    /* reset button */
    const resetBtn = document.createElement('button');
    footer.appendChild(resetBtn);
    resetBtn.innerText = "Reset"
    resetBtn.addEventListener('click', function() {
        const gameBoard = document.getElementById("game");
        const allCards = gameBoard.getElementsByClassName('grey');
        const arr = Array.from(allCards);
        for (let card of arr) {
            unFlipCard(card);
        }
        attemptsCounter.innerText = 0;
    });
    
    beginGame();    
    createCards(colors);

    function beginGame() {
        const fDiv = document.querySelector('div');
        const hidden = document.createElement('div');
        hidden.setAttribute('id', 'hidden');
        const startBtn = document.createElement('button');
        document.body.appendChild(startBtn);
        fDiv.before(startBtn)
        
        startBtn.setAttribute(
            "style", 
            "border:none; border-radius:0.3em; box-shadow:0 0.6em 2em rgba(86, 66, 0, 0.2); padding:1em 1.5em; cursor:pointer; margin:0 auto; font-size:25px; font-family:Arial, Helvetica, sans-serif; color:red; height:75px; width:250px; background-color:greenyellow;");
        startBtn.innerText = 'Play';
        startBtn.addEventListener('click', function() {
            const gameBoard = document.getElementById("game");
            const h1 = document.getElementById('h1');
            h1.style = 'display:none';
            gameBoard.style = 'display:flex';
            footer.style = 'display:flex';
            document.body.replaceChild(hidden, startBtn);

        });
    }
    
    /** Shuffle array items in-place and return shuffled array. */

    function shuffle(items) {
        for (let i = items.length - 1; i > 0; i--) {
        // generate a random index between 0 and i
            let j = Math.floor(Math.random() * i);
        // swap item at i <-> item at j
            [items[i], items[j]] = [items[j], items[i]];
        }

        return items;
    }

        /** Create card for every color in colors (each will appear twice) */
     
    function createCards(colors) {
        const gameBoard = document.getElementById("game");  // starter
        const firstR = document.querySelector('#firstR');
        gameBoard.appendChild(firstR);
        const secondR = document.getElementById('secondR');
        gameBoard.appendChild(secondR);
        const thirdR = document.getElementById('thirdR');
        gameBoard.appendChild(thirdR);
        const fourthR = document.getElementById('fourthR');
        gameBoard.appendChild(fourthR);

        for (let i = 0; i < colors.length; i += 1) {
            const card = document.createElement('div');
            card.setAttribute('class', colors[i]);
            card.classList.toggle('grey', true);
            card.addEventListener('click', handleCardClick);
            
            if (i < 2) {
                firstR.appendChild(card);
            } else if (i < 6) {
                secondR.appendChild(card);
            } else if (i < 9) {
                thirdR.appendChild(card);
            } else {
                fourthR.appendChild(card);
            } 

        }
        
    }

    /** Flip a card face-up. */

    function flipCard(card) {
        const clr = card.classList[0];
        card.style.backgroundColor = clr;
        
        // if cache has two values
        if (flipped.length === 2) {
            let firstCard = document.querySelector('.first');
            const timer = setTimeout(() => {
                unFlipCard(card);
                unFlipCard(firstCard);
            }, FOUND_MATCH_WAIT_MSECS);
            attempts += 1;
            attemptsCounter.innerText = attempts;

            if (returnMatch(flipped)) {
                clearTimeout(timer)
                firstCard.classList.remove('first');
                flipped.splice(0, flipped.length);
            } else {
                firstCard.classList.remove('first');
                flipped.splice(0, flipped.length);
            }
        }
         
    }

    /** Flip a card face-down. */

    function unFlipCard(card) {
        card.style.backgroundColor = card.classList[1];
    }

    /** Handle clicking on a card: this could be first-card or second-card. */

    function handleCardClick(evt) {
        const card = evt.target;
        const clr = evt.target.classList[0];
        
        // if cache is less than 2 and card is grey
        if (flipped.length < 2 && evt.target.style.backgroundColor !== clr) {
            flipped.push(clr);
            if (flipped.length === 1) {
                card.classList.add('first');
                flipCard(card);
            } else {
                flipCard(card);
            }
            
        } else { alert("This one is already matched!") }   
        
    }

    function returnMatch(pair) {
        let firstCard = pair[0];
        let secondCard = pair[1];

        return firstCard === secondCard;
    }
}
