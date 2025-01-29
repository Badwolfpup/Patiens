//Card piles

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

//Arrays that holds the images in the color piles, discardpile and takepile
const heartspile = [];
const spadesspile = [];
const diamondsspile = [];
const clubspile = [];
const takepilelist = [];
const discardpilelist = [];


//The elements that is in the menu
const autoflyttaradio = document.querySelectorAll('input[name="autoflytta"]');
const startbtn = document.getElementById('startautosolve');
const resetbtn = document.getElementById('resetgame');

//The elements that is used when clicking the hamburger menu
const navLinks = document.getElementById('nav-links');
const hamburger = document.getElementById('hamburger');
const mainContainer = document.getElementById('main-container');

let autoflytta = true; //Variable that holds if the autoflytta is checked or not
let IsFinished = false; //Variable that holds if the game is finished or not

//Array that holds the clicked images, used in manual gameplay
let ClickedImages = [];

//Checked event for the radiobuttons that holds the autoflytta variable
autoflyttaradio.forEach(radio => {
    radio.addEventListener('change', (e) => {
        autoflytta = JSON.parse(e.target.value); //Sets the autoflytta variable to the value of the radiobutton
    });
});

//Eventlistener for the hamburger menu
document.getElementById('hamburger').addEventListener('click', function () {
    // Toggle the 'active' class on the menu, hamburger icon, and main content
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    mainContainer.classList.toggle('active');
});

//Eventlistener for the reset button. Resets the game
resetbtn.addEventListener('click', (e) => {
    resetGame();
        // Toggle the 'active' class on the menu, hamburger icon, and main content
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
    mainContainer.classList.remove('active');
});

//Eventlistener for the start button. Starts the automatic solver
startbtn.addEventListener('click', (e) => {
    let CanMove = Array.from(takepile.children).length; //Used to determine if there are any moves left. 

    // Toggle the 'active' class on the menu, hamburger icon, and main content
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
    mainContainer.classList.remove('active');

    //Timer that runs the automatic solver
    const ivall = setInterval(() => {
        //Loops through the seven piles
        for (let i = 0; i < PILE_IDS.length; i++) {
            let automove = false; //Variable that holds if a card has been moved
            let pilediv = document.getElementById(PILE_IDS[i]); //Gets the pile
            let children = Array.from(pilediv.children); //Gets the children of the pile
            if (children.length <= 0) { return; } //If there are no children, return
            let firstrevealedchild = 0; //Variable that holds the index of the first card that has isRevealed set to true
            let hasfirstrevealedchild = false; //Variable that holds if there is a revealed child
            let lastrevealedchild = 0; //Variable that holds the index of the last card that has isRevealed set to true

            //Loops through the children of the pile
            for (let j = 0; j < children.length; j++) {
                //If the card is revealed, set hasfirstrevealedchild to true and set the index of the first revealed card
                if (children[j].cardData.isRevealed) {
                    if (!hasfirstrevealedchild) { hasfirstrevealedchild = true; firstrevealedchild = j; }
                    //Checks if the last card of the pile has isRevealed set to true, otherwise set the index of the last card to 0
                    if (j === children.length - 1) {
                        lastrevealedchild = j !== firstrevealedchild ? lastrevealedchild = j : 0;
                    }
                }
            }
            //If there is a card that has isRevealed set to true
            if (hasfirstrevealedchild) {
                let index = lastrevealedchild && lastrevealedchild !== firstrevealedchild ? lastrevealedchild : firstrevealedchild; //If there is a lastrevealedchild, set the index to that, otherwise set it to the firstrevealedchild
                automove = AutoMoveColorPile(children[index]) ? true : AutoMoveToCardPile(children[firstrevealedchild]) //Check if the card can be moved to a color pile or to another pile. Sets autmove to true if the card can be moved
                //If automove is true, reset the CanMove variable to the sum och the takepile and discardpile and return, ending the current timer tick.
                if (automove) {
                    let takepilearray = Array.from(takepile.children)[Array.from(takepile.children).length - 1].cardData.Suit !== 'empty' ? Array.from(takepile.children).length : 0;
                    let discardpilearray = Array.from(discardpile.children)[Array.from(discardpile.children).length - 1].cardData.Suit !== 'empty' ? Array.from(discardpile.children).length : 0;
                    CanMove = takepilearray + discardpilearray;
                    return;
                }
            }
        }
        //If there are cards in the discardpile, check if the last card can be moved to a color pile or to another pile. Sets autmove to true if the card can be moved,
        //and reset the CanMove variable to the sum och the takepile and discardpile and return, ending the current timer tick.
        if (discardpilelist.length > 0) {
            automove = AutoMoveColorPile(discardpilelist[discardpilelist.length - 1]) ? true : AutoMoveToCardPile(discardpilelist[discardpilelist.length - 1])
            if (automove) { 
                let takepilearray = Array.from(takepile.children)[Array.from(takepile.children).length - 1].cardData.Suit !== 'empty' ? Array.from(takepile.children).length : 0;
                let discardpilearray = Array.from(discardpile.children)[Array.from(discardpile.children).length - 1].cardData.Suit !== 'empty' ? Array.from(discardpile.children).length : 0;
                CanMove = takepilearray + discardpilearray;
                return;
            }
        }
        //Calls the ClickedTakePile function with the last card in the takepile. Draws a new card if there's one left in the takepile, otherwise moves the cards from the discardpile back to the takepile
        ClickedTakePile(Array.from(takepile.children)[Array.from(takepile.children).length - 1]);
        //Decreases the CanMove variable by one. If no card is moved, eventually it'll become negative and the game will end.
        CanMove--;

        //If the game is finished, clear the interval and resets IsFinished to false and returns, ending the current timer tick.
        if (IsFinished) {
            clearInterval(ivall);
            IsFinished = false;
            return;
        }
        //If there are no moves left, alert the user and clear the interval. Stopping the game
        if (CanMove < 0) {
            alert("Det finns ingen lösning");
            clearInterval(ivall);
        }
    }, 1000);

});

//Moves cards automatically to the seven piles, from either another card pile or the discardpile
function AutoMoveToCardPile(img) {
    if (!img) { return false; } //If the image is null, return false

    const parent = img.parentElement; //Gets the parent of the image
    if (!parent) { return false; } //If there is no parent, return false

    if (parent.id === 'takepile') { return false; } //If the parent is the takepile, return false
    if ((PILE_IDS.includes(parent.id) && !img.cardData.isRevealed) || !('cardData' in img)) { return false; } //If the parent is one of the seven piles and the card is not revealed, or if the image does not have carddata, return false

    const imgInParent = Array.from(parent.children); //Gets the children of the parent

    //Loops through the seven card piles
    for (let i = 0; i < PILE_IDS.length; i++) {
        const pilediv = document.getElementById(PILE_IDS[i]); //Gets the current pile
        const children = Array.from(pilediv.children); //Gets the children of the pile

        if (children.length <= 0) { continue; } //If there are no children, continue to the next pile

        const lastchild = children[children.length - 1]; //Gets the last child of the pile

        //If the card is a king and the king isnt already on a empty pile (ergo it has no cards under it)
        if (img.cardData.Value === 'K' && imgInParent.indexOf(img) !== 0) {
            //Checks if the first card in the pile has its Suit set to empty and if the length of the pile is 1
            if (Array.from(pilediv.children)[0].cardData.Suit === 'empty' && Array.from(pilediv.children).length === 1) {
                img.style.top = 0; //Sets the top of the card to 0
                if (parent.id === 'discardpile') { discardpilelist.pop(); } //If the parent is the discardpile, remove the last card from the discardpilelist
                children[0].remove(); //Remove the empty card   
                const index = imgInParent.indexOf(img); //Get the index of the clicked card
                const exit = imgInParent.length; //Get the length of the array
                let numberofcards = 0; //Variable that holds the number of cards. Used to set the top of the cards
                //Loops through the cards in the parent, starting with the clicked card and en ding with the last card
                for (let i = index; i < exit; i++) {
                    imgInParent[i].style.top = `${numberofcards * 20}px`; //Sets the top of the card, adding 20px for each card
                    numberofcards++; //Increases the number of cards
                    pilediv.append(imgInParent[i]); //Appends the card to the pile
                }
                //If the parent is a cardpile, reveal the last card in the pile or add a empty card
                if (IsParentPile(parent)) {
                    const children = Array.from(parent.children); //Gets the children of the parent                  
                    if (children.length > 0) { //If there are children in the parent, reveal the last card and set isRevealed to true
                        children[children.length - 1].cardData.isRevealed = true;
                        children[children.length - 1].src = children[children.length - 1].cardData.Image;
                    }             
                    else { //If there are no children in the parent, add a empty card
                        AddEmptyCard(parent);
                    }
                }
                return true;
            }
        }
        //If the last card in the pile is revealed and the card is one less than the last card and the card is of the opposite type as the last card
        if (lastchild.cardData.isRevealed && lastchild.cardData.ConvertedValue === img.cardData.ConvertedValue + 1 && lastchild.cardData.isRed !== img.cardData.isRed) {

            if (parent.id === 'discardpile') { discardpilelist.pop(); } //If the parent is the discardpile, remove the last card from the discardpilelist
            const index = imgInParent.indexOf(img); //Get the index of the clicked card
            const exit = imgInParent.length; //Get the length of the array
            let numberofcards = children.length; //Variable that holds the number of cards. Used to set the top of the cards
            //Loops through the cards in the parent, starting with the clicked card and ending with the last card
            for (let i = index; i < exit; i++) {
                imgInParent[i].style.top = `${numberofcards * 20}px`; //Sets the top of the card, adding 20px for each card
                numberofcards++; //Increases the number of cards
                pilediv.append(imgInParent[i]); //Appends the card to the pile
            }
            //If the parent is a cardpile, reveal the last card in the pile or add a empty card
            if (IsParentPile(parent)) {
                const children = Array.from(parent.children); //Gets the children of the parent
                if (children.length > 0) { //If there are children in the parent, reveal the last card and set isRevealed to true
                    children[children.length - 1].cardData.isRevealed = true;
                    children[children.length - 1].src = children[children.length - 1].cardData.Image;
                } else { //If there are no children in the parent, add a empty card
                    AddEmptyCard(parent);
                }
            }
            return true;
        }
    }

    return false;
}

//Moves cards automatically to the color piles, from either a card pile or the discardpile
function AutoMoveColorPile(img) {
    if (!img) { return false; } //If the image is null, return false
    const parent = img.parentElement; //Gets the parent of the image
    if (!parent) { return false; } //If there is no parent, return false
    if (parent.id === 'takepile') { return false; } //If the parent is the takepile, return false

    const imgInParent = Array.from(parent.children); //Gets the children of the parent

    //Loops through the four color piles
    for (let i = 0; i < 4; i++) {
        const pile = [hearts, diamonds, clubs, spades][i]; //Gets the current color pile
        const colorimg = Array.from(pile.children)[Array.from(pile.children).length - 1]; //Gets the last card in the color pile

        //Checks if the image has no carddata, thus ensuring that it is the original image
        if (!('cardData' in colorimg)) { 
            //Checks that the clicked card is of the same color as the current color pile and that the value of the clicked card is 1
            if (pile.id === 'hearts' && img.cardData.Suit === 'H' && img.cardData.ConvertedValue === 1
                || pile.id === 'spades' && img.cardData.Suit === 'S' && img.cardData.ConvertedValue === 1
                || pile.id === 'diamonds' && img.cardData.Suit === 'R' && img.cardData.ConvertedValue === 1
                || pile.id === 'clubs' && img.cardData.Suit === 'K' && img.cardData.ConvertedValue === 1) {
                img.style.top = 0; //Sets the top of the card to 0
                if (parent.id === 'discardpile') { discardpilelist.pop(); } //If the parent is the discardpile, remove the last card from the discardpilelist
                pile.append(img); //Appends the card to the color pile
                //Pushes the image to the correct array
                if (pile.id === 'hearts') {
                    heartspile.push(img);
                } else if (pile.id === 'spades') {
                    spadesspile.push(img);
                } else if (pile.id === 'diamonds') {
                    diamondsspile.push(img);
                } else {
                    clubspile.push(img);
                }
                if (IsParentPile(parent)) { //If the parent is a cardpile, reveal the last card in the pile or add a empty card
                    const children = Array.from(parent.children);
                    if (children.length > 0) { //If there are children in the parent, reveal the last card and set isRevealed to true
                        children[children.length - 1].cardData.isRevealed = true;
                        children[children.length - 1].src = children[children.length - 1].cardData.Image;
                    } else { //If there are no children in the parent, add a empty card
                        AddEmptyCard(parent);
                    }
                }
                CheckWinner(); //Check if the game is won
                return true;
            }

        }
            //Checks if the clicked image is the same suit as the color pile and that the value of the clicked card is one more than the last card in the color pile
        else if (img.cardData.Suit === colorimg.cardData.Suit && colorimg.cardData.ConvertedValue === img.cardData.ConvertedValue - 1) {
            img.style.top = 0; //Sets the top of the card to 0
            if (parent.id === 'discardpile') { discardpilelist.pop(); } //If the parent is the discardpile, remove the last card from the discardpilelist
            pile.append(img); //Appends the card to the color pile
            //Pushes the image to the correct array
            if (pile.id === 'hearts') {
                heartspile.push(img);
            } else if (pile.id === 'spades') {
                spadesspile.push(img);
            } else if (pile.id === 'diamonds') {
                diamondsspile.push(img);
            } else {
                clubspile.push(img);
            }
            if (IsParentPile(parent)) { //If the parent is a cardpile, reveal the last card in the pile or add a empty card
                const children = Array.from(parent.children); //Gets the children of the parent
                if (children.length > 0) { //If there are children in the parent, reveal the last card and set isRevealed to true
                    children[children.length - 1].cardData.isRevealed = true;
                    children[children.length - 1].src = children[children.length - 1].cardData.Image;
                } else { //If there are no children in the parent, add a empty card
                    AddEmptyCard(parent);
                }
            }
            CheckWinner(); //Check if the game is won
            return true;
        }
    }

}

//Creates a new img-element
function AddEmptyCard(parent) {
    const newimg = document.createElement('img'); //Creates a new img element
    newimg.classList.add('playingcard'); //Adds the class playingcard to the img
    addCarddataToEmptyImg(newimg); //Adds carddata to the img
    AddClickToImg(newimg); //Adds click event to the img
    newimg.src = newimg.cardData.Image; //Sets the image of the img
    parent.append(newimg); //Appends the img to the parent
}


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
            img.classList.add('playingcard'); //Adds the class playingcard to the img
            img.src = `Spelkort/baksida.png` //Sets the unflipped image of the img
            img.style.objectFit = 'cover'; //Sets the object fit of the img to cover
            img.loading = 'lazy'; //Sets the loading of the img to lazy
            AddClickToImg(img); //Adds click event to the img
            deck.push(img); //Pushes the img to the deckarray
        }
    }
    return deck;
}

let deck = shuffleNewDeck(); //Holds the shuffled deck of cards

//Deals the cards to the seven piles
const DealCards = () => {
    let pile = []; //Array that holds the cards in the pile
    for (let i = 1; i < 8; i++) { //Loops through the seven piles
        let pilediv = document.getElementById(`pile${i}`); //Gets the current pile
        for (let j = 0; j < i; j++) { //Loops the number of cards to be added. Increments by one for each pile
            let random = Math.floor(Math.random() * deck.length); //Gets a random number between 0 and the length of the deck
            let [img] = deck.splice(random, 1); //Splices the deck at the random number and puts the card in the img variable
            img.style.top = `${j * 20}px`; //Sets the top of the card, adding 20px for each card
            pilediv.append(img); //Appends the card to the pile
            
            if (j == i - 1) { //If the card is the last card in the pile, set isRevealed to true and set the image to the revealed image
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
    addCarddataToEmptyImg(discardpile.children[0]);
    AddClickToColorPiles();
}

DealCards(); //Deals the cards

//Adds click event to the empty color piles
function AddClickToColorPiles() {
    [hearts, diamonds, clubs, spades].forEach((pile) => {
        const img = Array.from(pile.children)[0];
        img.addEventListener('click', (e) => CheckImgParent(img));
    });
}

//Adds click event to the image
function AddClickToImg(img) {
    img.addEventListener('click', (e) => {
        e.stopPropagation(); //Stops the event from bubbling up the DOM tree
        CheckImgParent(img) //Calls the CheckImgParent function with the img as parameter
    });
}

//Checks which type of pile the image is clicked and calls the correct function
function CheckImgParent(img) {
    const parentelement = img.parentElement; //Gets the parent of the image
    if (!parentelement) return; //If there is no parent, return
    const parentid = parentelement.id; //Gets the id of the parent
    if (autoflytta) { //If autoflytta is checked, call the automove functions     
        if (AutoMoveColorPile(img) || AutoMoveToCardPile(img)) { return; }
    }
    if (parentid === 'takepile') { //If the parent is the takepile, call the ClickedTakePile function
        ClickedTakePile(img);
    }
    else if (parentid === 'discardpile') { //If the parent is the discardpile, call the ClickedDiscardPile function
        ClickedDiscardPile(img);
    } else if (IsColorpile(parentelement)) { //If the parent is a color pile, call the ClickedColorPile function
        ClickedColorPile(img);
    } else { //If the parent is a card pile, call the ClickedCardPile function
        ClickedCardPile(img);
    }
}

//Changes the border of the image so that the selected images are highlighted, or removes the border if the image is already selected
//and changes the isClicked variable of the carddata
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

//Calls the Changeborder function for each image in the ClickedImages array
function ClearCLickedImages() { 
    ClickedImages.forEach(img => ChangeBorder(img));
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

    //If the takepile is empty, move the cards from the discardpile back to the takepile and return
    if (img.cardData.Suit === 'empty') {
        img.remove(); //Removes the empty card
        while (discardpilelist.length > 0) { //Loops through the discardpilelist and moves the cards back to the takepile
            takepile.append(discardpilelist.pop());
        }
        Array.from(takepile.children).forEach(img => {
                img.cardData.isRevealed = false;
                img.src = `Spelkort/baksida.png`;

        });
        return;
    } 
    DrawCard(img); //Draws a card from the takepile and puts it in the discardpile
}

//Draws a card from the takepile and puts it in the discardpile
function DrawCard(img) {
    if (img && img.parentElement) { //Checks if img has value and that it has a parent
        
        const cardsleft = Array.from(img.parentElement.children); //Gets the children of the parent
        const isLast = cardsleft === 1; //Checks if the card is the last card in the takepile
        if (cardsleft.length <= 0) { return; } //If there are no cards left in the takepile, return
        discardpilelist.push(cardsleft[cardsleft.length - 1]); //Pushes the last card in the takepile to the discardpilelist
        discardpilelist[discardpilelist.length - 1].cardData.isRevealed = true; //Sets isRevealed to true
        discardpilelist[discardpilelist.length - 1].cardData.isClicked = false; //Sets isClicked to false
        discardpilelist[discardpilelist.length - 1].src = discardpilelist[discardpilelist.length - 1].cardData.Image; //Sets the image of the card to the revealed image

        discardpile.append(cardsleft.pop()); //Appends the card to the discardpile
        if (cardsleft.length <= 0) { //If there are no cards left in the takepile, add a empty card
            AddEmptyCard(takepile);
        }
    }
  
}

//Function that is called when the discardpile is clicked
function ClickedDiscardPile(img) //Högen med uppvända kort
{  
    //If there are any cards selected, reverse the border of the last card and add/remove it to the selected images array
    if (discardpilelist.length > 0) {
        //If there are selected cards and those arent in the discardpile, clear the selected cards
        if (ClickedImages.length > 0 && ClickedImages[0].parentElement.id !== 'discardpile') 
        {
            ClearCLickedImages();
        }
        ChangeBorder(img); //Changes the border of the image
        ClickedImages.length = 0; //Resets the selected images array

        //If the card is the last card in the discardpile is clicked, add it to the selected images array
        if (discardpilelist[discardpilelist.length - 1].cardData.isClicked) { 
            ClickedImages.push(discardpilelist[discardpilelist.length - 1]);
        }
    }
}

//Function that is called when a card is clicked in the color piles
function ClickedColorPile(img) {

    //If there are no cards selected, add border to the clicked image and add it to the selected images array
    if (ClickedImages.length <= 0) {
        //Checks that the color pile has cards in it
        if ((img.parentElement.id === 'hearts' && heartspile.length >= 1) ||
            (img.parentElement.id === 'spades' && spadesspile.length >= 1) ||
            (img.parentElement.id === 'diamonds' && diamondsspile.length >= 1) ||
            (img.parentElement.id === 'clubs' && clubspile.length >= 1)) {
            ChangeBorder(img); //Changes the border of the image
            ClickedImages.push(img); //Pushes the image to the selected images array
            return;
        }
    }

    //If there is only one card selected and it is the same card that is clicked, remove the border and remove the card from the selected images array
    if (ClickedImages.length == 1 && ClickedImages[0].src === img.src) {
        ChangeBorder(img); //Changes the border of the image
        ClickedImages.pop(); //Removes the image from the selected images array
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
                ClickedImages[0].style.top = 0;  //Sets the top of the card to 0
                ChangeBorder(ClickedImages[0]); //Changes the border of the image

                //Pushes the image to the correct array and appends it to the color pile
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
            ClickedImages[0].style.top = 0; //Sets the top of the card to 0
            ChangeBorder(ClickedImages[0]); //Changes the border of the image
            //Pushes the image to the correct array and appends it to the color pile
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
            const lastitem = Array.from(parent.children)[Array.from(parent.children).length - 1]; //Gets the last card in the pile
            if (lastitem) { //If there is a last card in the pile, reveal the card and set isRevealed to true
                lastitem.cardData.isRevealed = true;
                lastitem.src = lastitem.cardData.Image;
            } else { //If there is no last card in the pile, add a empty card
                AddEmptyCard(parent);
            }
        } else { //If the added image came from the discardpile, remove the last card from the discardpilelist
            discardpilelist.pop();
        }
        CheckWinner(); //Check if the game is won
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

    if (ClickedImages.length > 0 && img.parentElement === ClickedImages[0].parentElement
        && !ClickedImages.includes(img)) { return; } //If the selected cards and the clicked card is in the same pile, return false)


    //Checks if the card is revealed. (Only revealed cards can be clicked))
    if (img.cardData.isRevealed) {
        //Checks if the card is not clicked
        if (!img.cardData.isClicked) {
            if (checkIfCanMove(img)) { //Checks if the selected cards can be moved to the clicked card
                return;
            }
            //If the card is not empty, add the card to the selected images array and change the border
            if (img.cardData.Suit !== 'empty') { 
                ClickedImages.forEach(img => ChangeBorder(img)); //Removes the border of the selected cards
                ClickedImages.length = 0; //Empties the selected images array
                const children = Array.from(img.parentElement.children); //Gets the children of the parent
                const index = children.indexOf(img); //Gets the index of the clicked card
                for (let i = index; i < children.length; i++) { //Loops through the children and adds border to the clicked card and adds it to the selected images array
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


    if (IsColorpile(ClickedImages[0].parentElement)) { //Checks if the selected cards are from a color pile
        if (ClickedImages.length === 1) { //return false if there is other than one card selected

        } else {
            return false;
        }       
    }

    const parentdiv = ClickedImages[0].parentElement; //Gets the parent of the selected cards
    const imgparent = img.parentElement; //Gets the parent of the clicked card
    const ispile = IsPile(ClickedImages[0]); //Checks if the selected cards are from a card pile
    const iscolorpile = IsColorpile(parentdiv); //Checks if the clicked card is a color pile

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
            if (Array.from(imgparent.children)[0].cardData.Suit === 'empty') { //If the clicked card is empty, remove the empty card before appending the selected cards
                img.remove();
                imgparent.append(ClickedImages.shift());
            } else {
                imgparent.append(ClickedImages.shift());
            }
                    

        };
        //Handles the last card in the card pile that the selected cards came from
        if (ispile) {

            let clickedimagediv = Array.from(parentdiv.children); //Gets the children of the parent
            if (clickedimagediv.length > 0) { //If there are children in the parent, reveal the last card and set isRevealed to true
                clickedimagediv[clickedimagediv.length - 1].cardData.isRevealed = true;
                clickedimagediv[clickedimagediv.length - 1].src = clickedimagediv[clickedimagediv.length - 1].cardData.Image;
            } else { //If there are no children in the parent, add a empty card
                AddEmptyCard(parentdiv);
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
        } else {
            discardpilelist.pop();
        }
          
        return true;
        }
}

//Checks if the player has won the game, and resets the game
function CheckWinner() {
    if (heartspile.length >= 13 && spadesspile.length >= 13 && diamondsspile.length >= 13 && clubspile.length >= 13) {
        alert('Grattis du vann!');
        resetGame();
    }
}

//Resets the game
function resetGame() {
    IsFinished = true;
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


