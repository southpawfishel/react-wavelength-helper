import { Card } from '../../model/Card';
import { SET_CARD } from '../actions/card-actions';

const cardReducer = (state: Card, action: any) => {
    switch (action.type) {
        case SET_CARD:
            return action.payload.card;
        default:
            return new Card();
    }
}

export default cardReducer;