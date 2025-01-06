const pile1 = document.getElementById('pile1');
const pile2 = document.getElementById('pile2');
const pile3 = document.getElementById('pile3');
const pile4 = document.getElementById('pile4');
const pile5 = document.getElementById('pile5');
const pile6 = document.getElementById('pile6');
const pile7 = document.getElementById('pile7');
const PILE_IDS = ['pile1', 'pile2', 'pile3', 'pile4', 'pile5', 'pile6', 'pile7'];

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
            deck.push({ Suit: suit, Value: value, ConvertedValue: ValueConverter(value), Image: `Spelkort/${suit}${value}.png`, isRevealed: false, isClicked: false, isRed: suit === 'H' || suit === 'R', isDiscardpile: true});
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
        AddClickToImg(img);

    });
}

function AddClickToImg(img) {
    img.addEventListener('click', (e) => {
        if (img.id === 'takepile') {
            ClickedTakePile(img);
        }
        else if (img.id === 'discardpile') {
            ClickedDiscardPile(img);
        } else if (img.id === 'hearts' || img.id === 'diamonds' || img.id === 'clubs' || img.id === 'spades') {
            ClickedColorPile(img);
        } else {
            ClickedCardPile(img);
        }
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
        discardpile.style.height = `144px`;
        discardpile.style.width = `100px`;
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
            img.style.height = `144px`;
            img.style.width = `100px`;
            return;
        }

        discardpilelist[discardpilelist.length - 1].cardData.isClicked = true;
        img.style.border = '3px solid red';
        img.style.height = `138px`;
        img.style.width = `94px`;
        templist.push(discardpilelist[discardpilelist.length - 1]);
        templist[templist.length - 1].src = discardpilelist[discardpilelist.length - 1].cardData.Image;
    }
}

function ClickedColorPile(img) {

    if (templist.length <= 0) {
        if ((img.id === 'hearts' && heartspile.length >= 1) || (img.id === 'spades' && spadesspile.length >= 1) || (img.id === 'diamonds' && diamondsspile.length >= 1) || (img.id === 'clubs' && clubspile.length >= 1)) {

            img.style.border = `3px solid red`;
            img.style.height = `138px`;
            img.style.width = `94px`;
            templist.push(img);
            return;
        }
    }
    if (templist.length == 1 && templist[0].src === img.src) {
        img.style.border = `none`;
        img.style.height = `144px`;
        img.style.width = `100px`;
        templist.pop();
        return;
    }
    if (templist.length === 1 && IsColorpile(img) && IsSameSuit(img)) //Kollar att det är en av färghögarna och att det är samma färg och att det bara är ett kort valt sedan innan
    {
        const parent = templist[0].parentElement;
        if ('cardData' in img) //Kollar om det finns en cardData i img, vilket betyder att det ligger ett kort i högen redan
        {
            if (img.cardData.ConvertedValue == templist[0].cardData.ConvertedValue - 1) {
                
                img.cardData = templist[0].cardData;
                if (templist[0].cardData.Suit === 'H') {
                    heartspile.push(templist[0]);
                } else if (templist[0].cardData.Suit === 'S') {
                    spadesspile.push(templist[0]);
                } else if (templist[0].cardData.Suit === 'R') {
                    diamondsspile.push(templist[0]);
                } else if (templist[0].cardData.Suit === 'K') {
                    clubspile.push(templist[0]);
                }
                RemoveCardAfterAddToColorPile(parent);
                CheckWinner();
                img.src = templist[0].cardData.Image;
                templist.pop();
            }
        } else if (templist[0].cardData.ConvertedValue === 1) //Kollar om det ett ess som ska läggas i en tom hög
        {
            
            img.cardData = templist[0].cardData;
            if (templist[0].cardData.Suit === 'H') {
                heartspile.push(templist[0]);
            } else if (templist[0].cardData.Suit === 'S') {
                spadesspile.push(templist[0]);
            } else if (templist[0].cardData.Suit === 'R') {
                diamondsspile.push(templist[0]);
            } else if (templist[0].cardData.Suit === 'K') {
                clubspile.push(templist[0]);
            }
            RemoveCardAfterAddToColorPile(parent);
            CheckWinner();
            img.src = templist[0].cardData.Image;
            templist.pop();
        }
       CheckWinner();
    }  

}

function ClickedCardPile(img) {

    if (img.cardData.isRevealed) {

        if (!img.cardData.isClicked) {
            if (checkIfCanMove(img)) {
                return;
            }
            moveCardsBackToDiv();
            if (img.cardData.Suit !== 'empty') {

                const children = Array.from(img.parentElement.children);
                const index = children.indexOf(img);
                for (let i = index; i < children.length; i++) {
                    children[i].cardData.isClicked = true;
                    children[i].style.border = `3px solid red`;
                    children[i].style.height = `138px`;
                    children[i].style.width = `94px`;
                    templist.push(children[i]);
                }
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
        AddClickToImg(img);
        discardpilelist.push(img);
        discardpile.src = img.cardData.Image;

        deck.splice(random, 1);
    } else {
        if (discardpilelist.length > 0) {
            for (let i = discardpilelist.length - 1; i >= 0; i--) {
                discardpilelist[i].cardData.isClicked = false;
                discardpilelist[i].cardData.isRevealed = false;
                deck.push(discardpilelist[i].cardData);
            }
            discardpilelist.length = 0;
        }
        discardpile.src = 'Spelkort/kasthog.png';
        discardpile.style.border = 'none';
        discardpile.style.height = `144px`;
        discardpile.style.width = `100px`;    

    }
}

function moveCardsBackToDiv() {
    if (templist.length > 0) {
         templist.forEach((child) => {
             child.style.border = 'none';
             child.style.height = `144px`;
             child.style.width = `100px`;
            child.cardData.isClicked = false;
        });
        templist = [];
    }
}

function RemoveCardAfterAddToColorPile(parent) {
    if (templist.length > 1) {
        console.log('hej');
    } else {
        if (parent) {
            let children = Array.from(parent.children);
            parent.removeChild(children[children.length - 1]);
            children.pop();
            if (Array.from(parent.children).length > 0) {
                children[children.length - 1].cardData.isRevealed = true;
                children[children.length - 1].src = children[children.length - 1].cardData.Image;
            } else {
                const newimg = document.createElement('img');
                newimg.classList.add('playingcard');
                addCarddataToEmptyImg(newimg);
                AddClickToImg(newimg);
                newimg.src = 'Spelkort/nocard.png';
                parent.append(newimg);
            }
        } else {
            discardpilelist.pop();
            if (discardpilelist.length > 0) {
                discardpile.src = discardpilelist[discardpilelist.length - 1].cardData.Image; 
            } else {
                discardpile.src = 'Spelkort/kasthog.png';
            }
                discardpile.style.border = 'none';
                discardpile.style.height = `144px`;
                discardpile.style.width = `100px`;
           
        }
    }
}

function addCarddataToEmptyImg(img) {
    img.cardData = { Suit: 'empty', Value: 0, ConvertedValue: ValueConverter("0"), Image: `Spelkort/nocard.png`, isRevealed: true, isClicked: false, isRed: true, isDiscardpile: false }
}

function checkIfCanMove(img) {

    if (templist.length > 0) {
        if (IsColorpile(templist[0])) { return false; }
        const parentdiv = templist[0].parentElement;
        const imgparent = img.parentElement;
        if ((templist[0].cardData.isRed != img.cardData.isRed && templist[0].cardData.ConvertedValue === img.cardData.ConvertedValue - 1) || (img.cardData.Suit === 'empty' && templist[0].cardData.Value === 'K')) {
            if (imgparent) {
                while (templist.length > 0) {
                    templist[0].style.top = Array.from(imgparent.children)[0].cardData.Suit === 'empty' ? `0px` : `${(Array.from(imgparent.children).length) * 20}px`;
                    templist[0].style.border = 'none';
                    templist[0].style.height = `144px`;
                    templist[0].style.width = `100px`;
                    templist[0].cardData.isClicked = false;
                    templist[0].cardData.isRevealed = true;
                    if (Array.from(imgparent.children)[0].cardData.Suit === 'empty') {
                        img.remove();
                        imgparent.append(templist.shift());
                    } else {
                        imgparent.append(templist.shift());
                    }
                    

                };
                if (parentdiv) {

                    let imginparentdiv = Array.from(parentdiv.children);
                    if (imginparentdiv.length > 0) {
                        imginparentdiv[imginparentdiv.length - 1].cardData.isRevealed = true;
                        imginparentdiv[imginparentdiv.length - 1].cardData.Image = `Spelkort/${imginparentdiv[imginparentdiv.length - 1].cardData.Suit}${imginparentdiv[imginparentdiv.length - 1].cardData.Value}.png`;
                        imginparentdiv[imginparentdiv.length - 1].src = imginparentdiv[imginparentdiv.length - 1].cardData.Image;
                    } else {
                        const newimg = document.createElement('img');
                        newimg.classList.add('playingcard');
                        addCarddataToEmptyImg(newimg);                                             
                        AddClickToImg(newimg);
                        newimg.src = newimg.cardData.Image;
                        parentdiv.append(newimg);
                    }
                } else if (Array.from(imgparent.children)[Array.from(imgparent.children).length - 1].cardData.isDiscardpile) {
                    discardpilelist.pop();
                    discardpile.style.border = 'none';
                    discardpile.style.height = `144px`;
                    discardpile.style.width = `100px`;
                    discardpile.src = discardpilelist.length > 0 ? discardpilelist[discardpilelist.length - 1].cardData.Image : 'Spelkort/kasthog.png';
                } else {
                    const imgparentarray = Array.from(imgparent.children);
                    if (imgparentarray[imgparentarray.length - 1].cardData.Suit === 'H') {
                        heartspile.pop();
                        hearts.style.border = 'none';
                        hearts.style.height = `144px`;
                        hearts.style.width = `100px`;
                        hearts.src = heartspile.length > 0 ? heartspile[heartspile.length - 1].cardData.Image : `Spelkort/hjarter.png`;
                    } else if (imgparentarray[imgparentarray.length - 1].cardData.Suit === 'S') {
                        spadesspile.pop();
                        spades.style.border = 'none';
                        spades.style.height = `144px`;
                        spades.style.width = `100px`;
                        spades.src = spadesspile.length > 0 ? spadesspile[spadesspile.length - 1].cardData.Image : `Spelkort/spader.png`;
                    } else if (imgparentarray[imgparentarray.length - 1].cardData.Suit === 'R') {
                        diamondsspile.pop();
                        diamonds.style.border = 'none';
                        diamonds.style.height = `144px`;
                        diamonds.style.width = `100px`;
                        diamonds.src = diamondspile.length > 0 ? diamondsspile[diamondsspile.length - 1].cardData.Image : `Spelkort/ruter.png`;
                    } else {
                        clubspile.pop();
                        clubs.style.border = 'none';
                        clubs.style.height = `144px`;
                        clubs.style.width = `100px`;
                        clubs.src = clubspile.length > 0 ? clubspile[clubspile.length - 1].cardData.Image : `Spelkort/klover.png`;
                    }
                }
            }
            else if ((img.id === 'hearts' || img.id === 'diamonds' || img.id === 'clubs' || img.id === 'spades') && templist.length == 1)
            {
                //templist[0].style.top = `${(Array.from(img.parentElement.children).length) * 20}px`;
                templist[0].style.border = 'none';
                templist[0].cardData.isClicked = false;
                templist[0].cardData.isRevealed = true;
                img.src = templist[0].cardData.Image;
                img.cardData = templist[0].cardData;
                templist.shift();

            }
            return true;
        }
        
    }
    return false;
}

function CheckWinner() {
    //if (heartspile.length > 0) {
    //    alert('Grattis du vann!');
    //    resetGame();
    //}
    if (heartspile.length === 13 && spadesspile.length === 13 && diamondsspile.length === 13 && clubspile.length === 13) {
        alert('Grattis du vann!');
        resetGame();
    }
}

function resetGame() {
    // Clear all piles
    PILE_IDS.forEach(id => {
        const pile = document.getElementById(id);
        while (pile.firstChild) {
            pile.removeChild(pile.firstChild);
        }
    });

    // Clear color piles
    [hearts, diamonds, clubs, spades].forEach((pile) => {
        pile.cardData = null;
    });

    hearts.src = `Spelkort/hjarter.png`;
    diamonds.src = 'Spelkort/ruter.png';
    clubs.src = `Spelkort/klover.png`;
    spades.src = 'Spelkort/spader.png';


    // Clear discard and take piles
    discardpilelist.length = 0;
    takepilelist.length = 0;
    discardpile.src = 'Spelkort/kasthog.png';
    takepile.src = 'Spelkort/baksida.png';

    // Clear temporary list
    templist.length = 0;

    // Reset piles arrays
    heartspile.length = 0;
    spadesspile.length = 0;
    diamondsspile.length = 0;
    clubspile.length = 0;

    // Shuffle a new deck
    deck = shuffleNewDeck();

    // Deal cards again
    DealCards();

    // Re-add click events to all images
    AddCLickToDom();
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