import Note from 'Note';

interface Deck {
    id: string;
    ownerId: string;
    title: string;
    notes: Array<Note>;
};

export default Deck;