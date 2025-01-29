// Script.test.js
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, 'Index.html'), 'utf8');
const script = fs.readFileSync(path.resolve(__dirname, 'Script.js'), 'utf8');

let window, document;

beforeEach(() => {
    const dom = new JSDOM(html, { runScripts: 'dangerously' });
    window = dom.window;
    document = window.document;
    const scriptEl = document.createElement('script');
    scriptEl.textContent = script;
    document.body.appendChild(scriptEl);
});

test('should deal cards correctly', () => {
    const pile1 = document.getElementById('pile1');
    const pile2 = document.getElementById('pile2');
    const pile3 = document.getElementById('pile3');
    const pile4 = document.getElementById('pile4');
    const pile5 = document.getElementById('pile5');
    const pile6 = document.getElementById('pile6');
    const pile7 = document.getElementById('pile7');
    const takepile = document.getElementById('takepile');

    expect(pile1.children.length).toBe(1);
    expect(pile2.children.length).toBe(2);
    expect(pile3.children.length).toBe(3);
    expect(pile4.children.length).toBe(4);
    expect(pile5.children.length).toBe(5);
    expect(pile6.children.length).toBe(6);
    expect(pile7.children.length).toBe(7);
    expect(takepile.children.length).toBe(24);
});

test('should move ace to color pile', () => {
    const hearts = document.getElementById('hearts');
    const pile1 = document.getElementById('pile1');
    const aceOfHearts = pile1.children[0];

    aceOfHearts.cardData = { Suit: 'H', Value: 'A', ConvertedValue: 1, isRevealed: true };
    CheckAutoMove(aceOfHearts);

    expect(hearts.children.length).toBe(2); // 1 original + 1 ace
    expect(pile1.children.length).toBe(0);
});

test('should check for win condition', () => {
    const hearts = document.getElementById('hearts');
    const spades = document.getElementById('spades');
    const diamonds = document.getElementById('diamonds');
    const clubs = document.getElementById('clubs');

    for (let i = 1; i <= 13; i++) {
        hearts.appendChild(createCard('H', i));
        spades.appendChild(createCard('S', i));
        diamonds.appendChild(createCard('R', i));
        clubs.appendChild(createCard('K', i));
    }

    CheckWinner();

    expect(window.alert).toHaveBeenCalledWith('Grattis du vann!');
});

function createCard(suit, value) {
    const img = document.createElement('img');
    img.cardData = { Suit: suit, Value: value, ConvertedValue: value, isRevealed: true };
    return img;
}

