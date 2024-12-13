const pile1 = document.getElementById('pile1');
const pile2 = document.getElementById('pile2');
const pile3 = document.getElementById('pile3');
const pile4 = document.getElementById('pile4');
const pile5 = document.getElementById('pile5');
const pile6 = document.getElementById('pile6');
const pile7 = document.getElementById('pile7');

const hearts = document.getElementById('hearts');
const diamonds = document.getElementById('diamonds');
const clubs = document.getElementById('clubs');
const spades = document.getElementById('spades');

const discard = document.getElementById('discard');


let cardpiles = []
let img = document.createElement('img');
img.src = 'Spelkort/baksida.png';
discard.appendChild(img);

const ValueConverter = (value) => {
    switch (value) {
        case 'T': return 10;
        case 'J': return 11;
        case 'Q': return 12;
        case 'K': return 13;
        case 'A': return 1;
        default: return parseInt(value);
    }
}
const shuffleNewDeck = () => {
    const suits = ['H', 'R', 'K', 'S'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    const deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ Suit: suit, Value: value, ConvertedValue: ValueConverter(value), Image: `Spelkort/baksida.png`, isRevealed: false, isRed: suit === 'H' || suit === 'R'});
        }
    }
    return deck;
}
let deck = shuffleNewDeck();


const DealCards = () => {
    let pile = [];
    let pilediv;
    let clickedCard = {};
    for (let i = 1; i < 8; i++) {
        for (let j = 0; j < i; j++) {
            let random = Math.floor(Math.random() * deck.length);
            pile.push(...deck.splice(random, 1));
            pilediv = document.getElementById(`pile${i}`);
            let img = document.createElement('img');
            let div = document.createElement('div');
            
            if (j == i - 1) {
                pile[pile.length - 1].Image = `Spelkort/${pile[pile.length - 1].Suit}${pile[pile.length - 1].Value}.png`;
                pile[pile.length - 1].isRevealed = true;
            } 
            img.src = `${pile[pile.length - 1].Image}`
            //div.style = `width: ${img.width + 5}`
            //div.style = `height: ${img.height + 5}`
            div.style = `width: 105`
            div.style = `height: 149`

            div.appendChild(img);
            pilediv.appendChild(div);
        }
        let images = pilediv.querySelectorAll('img');
        images.forEach((img, index) => {
            img.style.position = 'absolute';
            img.height = 144;
            img.width = 100;
            let indeximg = 0;
            img.addEventListener('click', () => {
                const imgobject = pile.filter(x => img.src.substring(img.src.indexOf("Spelkort")) === x.Image);
                if (imgobject[0].isRevealed) {
                    console.log('clicked');
                    const piles = document.getElementById('bottom-container');
                    const getdivs = piles.querySelectorAll('div');
                    const imgdiv = null;
                    getdivs.forEach((onepile) => {
                        const allimages = onepile.querySelectorAll('img');
                        allimages.forEach((i, onecard) => {
                            if (onecard === img) { imgdiv = onepile; indeximg = i }
                            onepile.style.border = ''
                        });
                        //Adda index för att hålla koll vilken i ordningen
                    });
                    if (clickedCard) {
                        if (clickedCard.Image != img.src) {
                            if (clickedCard.isRed != img.isRed && img.ConvertedValue < clickedCard.ConvertedValue)
                            {
                                const imglist = Array.from(img.parentElement.querySelectorAll('img')).splice(index);
                                const clickeddiv = clickedCard.parentElement;
                                for (const i = 0; i < imglist.length; i++)
                                {
                                    clickeddiv.appendChild(imglist.shift());
                                }
                            } else {
                                img.style.border = '4px solid red';
                            }
                        }
                    }                   
                } 
            });
            img.style.top = `${index * 20}px`;
        });
    }
}



DealCards();

//Image: `Spelkort/${suit}${value}.png`