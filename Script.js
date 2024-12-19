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

const discardpile = document.getElementById('discardpile');
const takepile = document.getElementById('takepile');
const cardDivs = document.querySelectorAll('.cardpile');

const heartspile = [];
const spadesspile = [];
const diamondsspile = [];
const clubspile = [];
const takepilelist = [];
const discardpilelist = [];

let templist = [];

let mouseIsOver;

let currentParent = null;

function addImageToOtherPiles() {
    takepile.src = 'Spelkort/baksida.png';

    discardpile.src = 'Spelkort/kasthog.png';

}


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
            deck.push({ Suit: suit, Value: value, ConvertedValue: ValueConverter(value), Image: `Spelkort/${suit}${value}.png`, isRevealed: false, isClicked: false, isRed: suit === 'H' || suit === 'R'});
        }
    }
    return deck;
}
let deck = shuffleNewDeck();

const DealCards = () => {
    let pile = [];
    let pilediv;
    for (let i = 1; i < 8; i++) {
        for (let j = 0; j < i; j++) {
            let random = Math.floor(Math.random() * deck.length);
            pile.push(...deck.splice(random, 1));
            pilediv = document.getElementById(`pile${i}`);
            let img = document.createElement('img');
            img.src = `Spelkort/baksida.png`
            img.classList.add('playingcard');

            if (j == i - 1) {
                pile[pile.length - 1].isRevealed = true;
                img.src = pile[pile.length - 1].Image
            } 
            img.cardData = pile[pile.length - 1];
            //img.style.border = `3px solid red`;
            img.style.top = `${j * 20}px`;
            img.draggable = true;
            pilediv.append(img);
        }

    }
}

DealCards();

addImageToOtherPiles();

function AddCLickToDom() {
    document.querySelectorAll('img').forEach((img) => {
        img.addEventListener('click', (e) => {
            if (img.id === 'takepile')
            {
                ClickedTakePile(img);
            }
            else if (img.id === 'discardpile')
            {
                ClickedDiscardPile(img);
            } else if (img.id === 'hearts' || img.id === 'diamonds' || img.id === 'clubs' || img.id === 'spades')
            {
                ClickedColorPile(img);
            } else
            {
                ClickedCardPile(img);
            }
        });
    });
}

window.addEventListener('DOMContentLoaded', AddCLickToDom);

function ClickedTakePile(img) //Högen med ouppvända kort
{
    if (discardpilelist.length > 0) {
        let clickedimg = discardpilelist[discardpilelist.length - 1];
        if (clickedimg.cardData.isClicked === true) {
            clickedimg.cardData.isClicked === false
            moveCardsBackToDiv();
        }
        discardpile.style.border = 'none';
        discardpile.style.top = '0px';
    }
    DrawCard();
}

function ClickedDiscardPile(img) //Högen med uppvända kort
{
    if (discardpilelist.length > 0) {
        if (discardpilelist[discardpilelist.length - 1].cardData.isClicked) {
            moveCardsBackToDiv();
            img.style.border = 'none';
            return;
        }

        discardpilelist[discardpilelist.length - 1].cardData.isClicked = true;
        img.style.border = '3px solid red';
        templist.push(discardpilelist[discardpilelist.length-1]);
    }
}

function ClickedColorPile(img) {
    if (templist.length === 1 && IsColorpile(img) && IsSameSuit(img)) //Kollar att det är en av färghögarna och att det är samma färg och att det bara är ett kort valt sedan innan
    {
        if (templist.length <= 0) {
            img.style.border = `3px solid red`;
            templist.push(img);
            return;
        }

        const parent = templist[0].parentElement;
        if ('cardData' in img) //Kollar om det finns en cardData i img, vilket betyder att det ligger ett kort i högen redan
        {
            if (img.cardData.ConvertedValue == templist[0].cardData.ConvertedValue - 1) {
                img.src = templist[0].cardData.Image;
                img.cardData = templist[0].cardData;
                if (templist[0].cardData.Suit === 'H') {
                    heartspile.push(templist);
                } else if (templist[0].cardData.Suit === 'S') {
                    spadesspile.push(templist.pop());
                } else if (templist[0].cardData.Suit === 'R') {
                    diamondsspile.push(templist.pop());
                } else if (templist[0].cardData.Suit === 'K') {
                    clubspile.push(templist.pop());
                }
                RemoveCardAfterAddToColorPile(parent);
            }
        } else if (templist[0].cardData.ConvertedValue === 1) //Kollar om det ett ess som ska läggas i en tom hög
        {
            img.src = templist[0].cardData.Image;
            img.cardData = templist[0].cardData;
            if (templist[0].cardData.Suit === 'H') {
                heartspile.push(templist.pop());
            } else if (templist[0].cardData.Suit === 'S') {
                spadesspile.push(templist.pop());
            } else if (templist[0].cardData.Suit === 'R') {
                diamondsspile.push(templist.pop());
            } else if (templist[0].cardData.Suit === 'K') {
                clubspile.push(templist.pop());
            }
            RemoveCardAfterAddToColorPile(parent);
        }

        return;
    }

}

function ClickedCardPile(img) {
    if (img.cardData.isRevealed) {

        if (!img.cardData.isClicked) {
            if (checkIfCanMove(img)) {
                return;
            }
            moveCardsBackToDiv();
            const children = Array.from(img.parentElement.children);
            const index = children.indexOf(img);
            for (let i = index; i < children.length; i++) {
                children[i].cardData.isClicked = true;
                children[i].style.border = `3px solid red`;
                templist.push(children[i]);
            }
        }
        else {

            moveCardsBackToDiv();

        }


    }

}

function DrawCard() {
    if (deck.length > 0) {
        let random = Math.floor(Math.random() * deck.length);
        let img = document.createElement('img');
        img.classList.add('playingcard');
        img.cardData = deck[random];
        discardpilelist.push(img);
        discardpile.src = img.cardData.Image;

        deck.splice(random, 1);
    }
}

function moveCardsBackToDiv() {
    if (templist.length > 0) {
         templist.forEach((child) => {
            child.style.border = 'none';
            child.cardData.isClicked = false;
        });
        templist = [];
    }
}

function RemoveCardAfterAddToColorPile(parent) {
    if (templist.length > 1) {
        console.log('hej');
    } else {
        if (parent.tagName === "IMG") {
            let children = Array.from(parent.children);
            parent.removeChild(children[children.length - 1]);
            children.pop();
            if (Array.from(parent.children).length > 0) {
                children[children.length - 1].cardData.isRevealed = true;
                children[children.length - 1].src = children[children.length - 1].cardData.Image;
            } else {
                const newimg = document.createElement('img');
                newimg.classList.add('playingcard');
                newimg.src = 'Spelkort/nocard.png';
                parent.append(newimg);
            }
        } else {
            discardpilelist.pop();
            discardpile.src = discardpilelist[discardpilelist.length - 1].cardData.Image;
        }
    }
}

function checkIfCanMove(img) {
    if (templist.length > 0) {
        const parentdiv = templist[0].parentElement;
        if (templist[0].cardData.isRed != img.cardData.isRed && templist[0].cardData.ConvertedValue === img.cardData.ConvertedValue - 1) {
            for (let i = 0; i < templist.length; i++) {
                templist[i].style.top = `${(i + Array.from(img.parentElement.children).length) * 20}px`;
                templist[i].style.border = 'none';
                templist[i].cardData.isClicked = false;
                img.parentElement.append(templist[i].remove());
            };

                let imginparentdiv = Array.from(parentdiv.children);
                if (imginparentdiv.length > 0) {
                    imginparentdiv[imginparentdiv.length - 1].cardData.isRevealed = true;
                    imginparentdiv[imginparentdiv.length - 1].cardData.Image = `Spelkort/${imginparentdiv[imginparentdiv.length - 1].cardData.Suit}${imginparentdiv[imginparentdiv.length - 1].cardData.Value}.png`;
                    imginparentdiv[imginparentdiv.length - 1].src = imginparentdiv[imginparentdiv.length - 1].cardData.Image;
                }


            return true;
        }
    }
    return false;
}

function IsColorpile(img) {
    return img.id === 'hearts' || img.id === 'diamonds' || img.id === 'clubs' || img.id === 'spades';
}

function IsSameSuit(img) {
    return  img.id === 'hearts' && templist[0].cardData.Suit == 'H' ||
            img.id === 'spades' && templist[0].cardData.Suit == 'S' ||
            img.id === 'diamonds' && templist[0].cardData.Suit == 'R' ||
            img.id === 'clubs' && templist[0].cardData.Suit == 'K';
}

function IsPile(img) {
    return img.parentElement.id === 'pile1' || img.parentElement.id === 'pile2' || img.parentElement.id === 'pile3' || img.parentElement.id === 'pile4' || img.parentElement.id === 'pile5' || img.parentElement.id === 'pile6' || img.parentElement.id === 'pile7';
}

function IsTakeOrDiscardPile(img) {
    return img.id === 'takepile' || img.id === 'discardpile';
}
//Image: `Spelkort/${suit}${value}.png`