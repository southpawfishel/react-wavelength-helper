import { Answer } from '../../model/Answer';
// import { SET_CARD } from '../actions/card-actions';

const answerReducer = (state: Answer, action: any) => {
  // switch (action.type) {
  //     case SET_CARD:
  //         return action.payload.card;
  //     default:
  //         return new Card();
  // }
  return new Answer();
}

export default answerReducer;