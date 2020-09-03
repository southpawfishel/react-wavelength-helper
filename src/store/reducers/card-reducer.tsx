import { Card } from '../../model/Card';
import { SET_CARD, SET_CARD_LEFT, SET_CARD_RIGHT } from '../actions/card-actions';

const cardReducer = (state: Card, action: any) => {
    switch (action.type) {
        case SET_CARD:
            return action.payload.card;
        case SET_CARD_LEFT:
            return state.set('left', action.payload.left);
        case SET_CARD_RIGHT:
            return state.set('right', action.payload.right);
        default:
            return state;
    }
}

export default cardReducer;