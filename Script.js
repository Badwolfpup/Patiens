//The seven piles on the board
const pile1 = document.getElementById('pile1');
const pile2 = document.getElementById('pile2');
const pile3 = document.getElementById('pile3');
const pile4 = document.getElementById('pile4');
const pile5 = document.getElementById('pile5');
const pile6 = document.getElementById('pile6');
const pile7 = document.getElementById('pile7');
const PILE_IDS = ['pile1', 'pile2', 'pile3', 'pile4', 'pile5', 'pile6', 'pile7'];

//The four color piles, where you stack the cards in order
const hearts = document.getElementById('hearts');
const diamonds = document.getElementById('diamonds');
const clubs = document.getElementById('clubs');
const spades = document.getElementById('spades');

//The discardpile and the takepile
const discardpile = document.getElementById('discardpile');
const takepile = document.getElementById('takepile');

//Arrays that holds the cards in the color piles
const heartspile = [];
const spadesspile = [];
const diamondsspile = [];
const clubspile = [];
const takepilelist = [];
const discardpilelist = [];

//Array that holds the clicked images
let ClickedImages = [];


//Converts the value of the card to a number
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

//Shuffles a new deck of cards
const shuffleNewDeck = () => {
    const suits = ['H', 'R', 'K', 'S'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    const deck = [];
    for (let suit of suits) {
        for (let value of values) {
            let img = document.createElement('img');

            //Object that holds information about the card
            img.cardData = { Suit: suit, Value: value, ConvertedValue: ValueConverter(value), Image: `Spelkort/${suit}${value}.png`, isRevealed: false, isClicked: false, isRed: suit === 'H' || suit === 'R' }; 
            img.classList.add('playingcard');
            img.src = `Spelkort/baksida.png`
            img.style.objectFit = 'cover';
            img.loading = 'lazy';
            AddClickToImg(img);
            deck.push(img);
        }
    }
    return deck;
}

let deck = shuffleNewDeck();

//Deals the cards to the seven piles
const DealCards = () => {
    let pile = [];
    for (let i = 1; i < 8; i++) {
        let pilediv = document.getElementById(`pile${i}`);
        for (let j = 0; j < i; j++) {
            let random = Math.floor(Math.random() * deck.length);
            let [img] = deck.splice(random, 1);
            img.style.top = `${j * 20}px`;
            pilediv.append(img);
            
            if (j == i - 1) {
                img.cardData.isRevealed = true; //Last card in pile is revealed
                img.src = img.cardData.Image //Changes the image to the revealed image
            }      
        }
    }

    //Adds the rest of the cards to the takepile
    while (deck.length > 0) {
        let random = Math.floor(Math.random() * deck.length);
        let [img] = deck.splice(random, 1);
        
        takepile.append(img);
    }
    AddClickToColorPiles();
}

DealCards();

//Adds click event to the empty color piles
function AddClickToColorPiles() {
    [hearts, diamonds, clubs, spades].forEach((pile) => {
        const img = Array.from(pile.children)[0];
        img.addEventListener('click', (e) => CheckImgParent(img));
    });
}

//Adds click event to the image
function AddClickToImg(img) {
    img.addEventListener('click', (e) => CheckImgParent(img));
}

//Checks which type of pile the image is clicked and calls the correct function
function CheckImgParent(img) {
    const parentelement = img.parentElement;
    if (!parentelement) return;
    const parentid = parentelement.id;
    if (parentid === 'takepile') {
        ClickedTakePile(img);
    }
    else if (parentid === 'discardpile') {
        ClickedDiscardPile(img);
    } else if (IsColorpile(parentelement)) {
        ClickedColorPile(img);
    } else {
        ClickedCardPile(img);
    }
}

//Changes the border of the image so that the selected images are highlighted, or removes the border if the image is already selected
const ChangeBorder = (img) => {
    if (img.cardData.isClicked) {
        img.style.border = 'none';
        img.style.height = `144px`;
        img.style.width = `100px`;
        img.cardData.isClicked = false;
    }
    else {
        img.style.border = `3px solid red`;
        img.style.height = `138px`;
        img.style.width = `94px`;
        img.cardData.isClicked = true;
    }
}

//Function that is called when the takepile is clicked
function ClickedTakePile(img) //Högen med ouppvända kort
{
    //Checks if there are any cards highlighted in the takepile and removes its border
    if (discardpilelist.length > 0 && discardpilelist[discardpilelist.length - 1].cardData.isClicked) {
        ChangeBorder(discardpilelist[discardpilelist.length - 1]);
    }
    //Reset the selected images array
    ClickedImages.length = 0;
    DrawCard(img);
}

//Draws a card from the takepile and puts it in the discardpile
function DrawCard(img) {
    if (img && img.parentElement) {

        const cardsleft = Array.from(img.parentElement.children);
        if (cardsleft.length <= 0) { return; }
        discardpilelist.push(cardsleft[cardsleft.length - 1]);
        discardpilelist[discardpilelist.length - 1].cardData.isRevealed = true;
        discardpilelist[discardpilelist.length - 1].cardData.isClicked = false;
        discardpilelist[discardpilelist.length - 1].src = discardpilelist[discardpilelist.length - 1].cardData.Image;

        discardpile.append(cardsleft.pop());
        if (cardsleft.length <= 0) {
            img.src = 'Spelkort/nocard.png';
        }
    }
  
}

//Function that is called when the discardpile is clicked
function ClickedDiscardPile(img) //Högen med uppvända kort
{  
    //If there are any cards selected, reverse the border of the last card and add/remove it to the selected images array
    if (discardpilelist.length > 0) {
        ChangeBorder(img);
        ClickedImages.length = 0;
        if (discardpilelist[discardpilelist.length - 1].cardData.isClicked) {
            ClickedImages.push(discardpilelist[discardpilelist.length - 1]);
        }
    }
}

//Function that is called when a card is clicked in the color piles
function ClickedColorPile(img) {

    //If there are no cards selected, add border to the clicked image and add it to the selected images array
    if (ClickedImages.length <= 0) {
        if ((img.parentElement.id === 'hearts' && heartspile.length >= 1) ||
            (img.parentElement.id === 'spades' && spadesspile.length >= 1) ||
            (img.parentElement.id === 'diamonds' && diamondsspile.length >= 1) ||
            (img.parentElement.id === 'clubs' && clubspile.length >= 1)) {
            ChangeBorder(img);
            ClickedImages.push(img);
            return;
        }
    }

    //If there is only one card selected and it is the same card that is clicked, remove the border and remove the card from the selected images array
    if (ClickedImages.length == 1 && ClickedImages[0].src === img.src) {
        ChangeBorder(img);
        ClickedImages.pop();
        return;
    }

    //If there is only one card selected and it is the same color as the color pile that is clicked,
    if (ClickedImages.length === 1 && IsColorpile(img.parentElement) && IsSameSuit(img.parentElement)) 
    {
        const parent = ClickedImages[0].parentElement;
        if ('cardData' in img) //Checks if the image has carddata, thus ensuring that it is a card and not the original image
        {            
            if (img.cardData.ConvertedValue == ClickedImages[0].cardData.ConvertedValue - 1)  //Checks if the selected card is one more than the card in the color pile
            {
                ClickedImages[0].style.top = 0; 
                RemoveBorder(ClickedImages[0]);
                if (ClickedImages[0].cardData.Suit === 'H') {
                    heartspile.push(ClickedImages[0]);
                    hearts.append(ClickedImages.pop());
                } else if (ClickedImages[0].cardData.Suit === 'S') {
                    spadesspile.push(ClickedImages[0]);
                    spades.append(ClickedImages.pop());
                } else if (ClickedImages[0].cardData.Suit === 'R') {
                    diamondsspile.push(ClickedImages[0]);
                    diamonds.append(ClickedImages.pop());
                } else if (ClickedImages[0].cardData.Suit === 'K') {
                    clubspile.push(ClickedImages[0]);
                    clubs.append(ClickedImages.pop());
                }
                
            }
        } else if (ClickedImages[0].cardData.ConvertedValue === 1) //Checks if the card is an ace (since the pile is empty and only accepts aces))
        {
            ClickedImages[0].style.top = 0;
            RemoveBorder(ClickedImages[0]);
            if (ClickedImages[0].cardData.Suit === 'H') {
                heartspile.push(ClickedImages[0]);
                hearts.append(ClickedImages.pop());
            } else if (ClickedImages[0].cardData.Suit === 'S') {
                spadesspile.push(ClickedImages[0]);
                spades.append(ClickedImages.pop());
            } else if (ClickedImages[0].cardData.Suit === 'R') {
                diamondsspile.push(ClickedImages[0]);
                diamonds.append(ClickedImages.pop());
            } else if (ClickedImages[0].cardData.Suit === 'K') {
                clubspile.push(ClickedImages[0]);
                clubs.append(ClickedImages.pop());
            }
            
            
        }
        if (IsParentPile(parent)) //Checks if the added image came from a pile and if so, reveals the last card in the pile or adds a empty card
        {
            const lastitem = Array.from(parent.children)[Array.from(parent.children).length - 1];
            if (lastitem) {
                lastitem.cardData.isRevealed = true;
                lastitem.src = lastitem.cardData.Image;
            } else {
                const newimg = document.createElement('img');
                newimg.classList.add('playingcard');
                addCarddataToEmptyImg(newimg);
                AddClickToImg(newimg);
                newimg.src = newimg.cardData.Image;
                parent.append(newimg);
            }   
        }
        CheckWinner();
    }  

}

//Checks if the parent (div) of the image is a color pile
function IsColorpile(img) 
{
    return img.id === 'hearts' || img.id === 'diamonds' || img.id === 'clubs' || img.id === 'spades';
}

//Checks if the selected card is the same suit as the color pile
function IsSameSuit(img) 
{
    return img.id === 'hearts' && ClickedImages[0].cardData.Suit == 'H' ||
        img.id === 'spades' && ClickedImages[0].cardData.Suit == 'S' ||
        img.id === 'diamonds' && ClickedImages[0].cardData.Suit == 'R' ||
        img.id === 'clubs' && ClickedImages[0].cardData.Suit == 'K';
}

//Removes the border of the image
function RemoveBorder(img) 
{
    img.style.border = 'none';
    img.style.height = `144px`;
    img.style.width = `100px`;
}

//Function that is called when a card in the card piles is clicked
function ClickedCardPile(img) {

    //Checks if the card is revealed. (Only revealed cards can be clicked))
    if (img.cardData.isRevealed) {
        //If the card is not clicked, check if the selected cards can be moved,
        //add border to the card and add it to the selected images array
        if (!img.cardData.isClicked) {
            if (checkIfCanMove(img)) {
                return;
            }
            
            if (img.cardData.Suit !== 'empty') {
                ClickedImages.length = 0;
                const children = Array.from(img.parentElement.children);
                const index = children.indexOf(img);
                for (let i = index; i < children.length; i++) {
                    ChangeBorder(children[i]);
                    ClickedImages.push(children[i]);
                }
            }
        }
        else //If the card is clicked, remove the border of all cards and empty the selected images array
        {
            ClickedImages.forEach(img => ChangeBorder(img));
            ClickedImages.length = 0;          
        }
    }
}

//Checks if the parent of the image is one of the seven card piles
function IsParentPile(parent) {
    return parent.id === 'pile1' || parent.id === 'pile2' || parent.id === 'pile3' || parent.id === 'pile4' || parent.id === 'pile5' || parent.id === 'pile6' || parent.id === 'pile7';

}

//Checks if the parent of the image is one of the seven card piles
function IsPile(img) {
    return img.parentElement.id === 'pile1' || img.parentElement.id === 'pile2' || img.parentElement.id === 'pile3' || img.parentElement.id === 'pile4' || img.parentElement.id === 'pile5' || img.parentElement.id === 'pile6' || img.parentElement.id === 'pile7';
}

//Adds an empty cardData object to the image
function addCarddataToEmptyImg(img) {
    img.cardData = { Suit: 'empty', Value: 0, ConvertedValue: ValueConverter("0"), Image: `Spelkort/nocard.png`, isRevealed: true, isClicked: false, isRed: true, isDiscardpile: false }
}

//Checks if the selected cards can be moved to the clicked card
function checkIfCanMove(img) {

    if (ClickedImages.length <= 0) { return false; } //If there are no selected cards, return false

    if (IsColorpile(ClickedImages[0].parentElement)) {
        if (ClickedImages.length === 1) {

        } else {
            return false;
        }       
    }

    const parentdiv = ClickedImages[0].parentElement;
    const imgparent = img.parentElement;
    const ispile = IsPile(ClickedImages[0]);
    const iscolorpile = IsColorpile(parentdiv);

    //Checks if the selected cards is of opposite color and if the value of the selected card is one less than the clicked card
    if ((ClickedImages[0].cardData.isRed != img.cardData.isRed && ClickedImages[0].cardData.ConvertedValue === img.cardData.ConvertedValue - 1) || (img.cardData.Suit === 'empty' && ClickedImages[0].cardData.Value === 'K')) {

        //Removes the border of the selected cards, changes top position and adds them to the clicked cardpile
        while (ClickedImages.length > 0) {
            ClickedImages[0].style.top = Array.from(imgparent.children)[0].cardData.Suit === 'empty' ? `0px` : `${(Array.from(imgparent.children).length) * 20}px`;
            ClickedImages[0].style.border = 'none';
            ClickedImages[0].style.height = `144px`;
            ClickedImages[0].style.width = `100px`;
            ClickedImages[0].cardData.isClicked = false;
            ClickedImages[0].cardData.isRevealed = true;
            RemoveBorder(ClickedImages[0]);
            if (Array.from(imgparent.children)[0].cardData.Suit === 'empty') {
                img.remove();
                imgparent.append(ClickedImages.shift());
            } else {
                imgparent.append(ClickedImages.shift());
            }
                    

        };
        //Handles the last card in the card pile that the selected cards came from
        if (ispile) {

            let clickedimagediv = Array.from(parentdiv.children);
            if (clickedimagediv.length > 0) {
                clickedimagediv[clickedimagediv.length - 1].cardData.isRevealed = true;
                clickedimagediv[clickedimagediv.length - 1].src = clickedimagediv[clickedimagediv.length - 1].cardData.Image;
            } else {
                const newimg = document.createElement('img');
                newimg.classList.add('playingcard');
                addCarddataToEmptyImg(newimg);
                AddClickToImg(newimg);
                newimg.src = newimg.cardData.Image;
                parentdiv.append(newimg);
            }
        }
        //Handles the last card in the color pile that the selected cards came from
        else if (iscolorpile) {
            if (parentdiv.id === 'hearts') {
                heartspile.pop();
            } else if (parentdiv.id === 'spades') {
                spadesspile.pop();
            } else if (parentdiv.id === 'diamonds') {
                diamondsspile.pop();
            } else {
                clubspile.pop();
            }
        }
          
        return true;
        }
}

//Checks if the player has won the game, and resets the game
function CheckWinner() {
    //if (heartspile.length > 0 || spadesspile.length > 0 || diamondsspile.length > 0 || clubspile.length > 0) {
    //    alert('Grattis du vann!');
    //    resetGame();
    //}
    if (heartspile.length === 14 && spadesspile.length === 14 && diamondsspile.length === 14 && clubspile.length === 14) {
        alert('Grattis du vann!');
        resetGame();
    }
}

//Resets the game
function resetGame() {
    // Clear all piles
    PILE_IDS.forEach(id => {
        const pile = document.getElementById(id);
        while (pile.firstChild) {
            pile.removeChild(pile.firstChild);
        }
    });

    // Clear color piles
    [hearts, diamonds, clubs, spades].forEach((pile) => pile.appendChild(NewImage(pile)));

    // Clear discard and take piles
    discardpilelist.length = 0;
    takepilelist.length = 0;
    //discardpile.src = 'Spelkort/kasthog.png';
    //takepile.src = 'Spelkort/baksida.png';

    // Clear temporary list
    ClickedImages.length = 0;

    // Reset piles arrays
    heartspile.length = 0;
    spadesspile.length = 0;
    diamondsspile.length = 0;
    clubspile.length = 0;

    // Shuffle a new deck
    deck = shuffleNewDeck();

    // Deal cards again
    DealCards();


}

//Returns the filepath of the original image in the colorpiles
function GetFilepath(div) {
    if (div.id === 'hearts') {
        return "./Spelkort/hjarter.png";
    } else if (div.id === 'spades') {
        return "./Spelkort/spader.png";
    } else if (div.id === 'diamonds') {
        return "./Spelkort/ruter.png";
    } else if (div.id === 'clubs') {
        return "./Spelkort/klover.png";
    } else {
        return "./Spelkort/nocard.png";
    }
}

//Creates a new image and sets the src to the original image in the colorpiles
function NewImage(div) {
    div.innerHTML = "";
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = GetFilepath(div);
    return img;
}





function IsTakeOrDiscardPile(img) {
    return img.id === 'takepile' || img.id === 'discardpile';
}
//Image: `Spelkort/${suit}${value}.png`