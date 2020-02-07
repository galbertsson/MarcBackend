import ClozeNote from 'IClozeNote';
import BasicNote from 'IBasicNote';

interface Deck {
    _id: string;
    ownerId: string;
    title: string;
    notes: Array<ClozeNote | BasicNote>;
};

export default Deck;