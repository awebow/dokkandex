import storage from './storage';

export default {

    cardImage(card) {
        if(card.resource_id)
            return storage(`cards/${card.resource_id - card.resource_id % 10}.jpg`);

        return storage(`cards/${card.id - card.id % 10}.jpg`);
    },

    cardThumb(card) {
        if(card.resource_id)
            return storage(`thumbs/${card.resource_id - card.resource_id % 10}.png`);

        return storage(`thumbs/${card.id - card.id % 10}.png`);
    }

}