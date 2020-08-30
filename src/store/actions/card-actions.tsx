import { Card } from '../../model/Card';

export const SET_CARD = 'card:set';

export function setCard(card: Card) {
    return {
        type: SET_CARD,
        payload: {
            card
        }
    }
}