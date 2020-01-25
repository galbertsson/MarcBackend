import Note from 'Note';

interface Deck {
    _id: string;
    ownerId: string;
    title: string;
    notes: Array<Note>;
};

export default Deck;