export const SET_CARD = 'card:set';
export const SET_CARD_LEFT = 'card:setLeft';
export const SET_CARD_RIGHT = 'card:setRight';

export function setCard(card: any) {
    return {
        type: SET_CARD,
        payload: {
            card
        }
    }
}

export function setCardLeft(left: string) {
    return {
        type: SET_CARD_LEFT,
        payload: {
            left
        }
    }
}

export function setCardRight(right: string) {
    return {
        type: SET_CARD_RIGHT,
        payload: {
            right
        }
    }
}