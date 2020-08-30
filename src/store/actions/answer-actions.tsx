export const SET_ANSWER = 'answer:set';
export const NEW_TARGET = 'answer:newTarget';
export const SHOW_ANSWER = 'answer:show';
export const HIDE_ANSWER = 'answer:hide';

export function setAnswer() {
  return {
    type: SET_ANSWER,
    payload: {}
  }
}

export function newTargetAnswer(target: number) {
  return {
    type: NEW_TARGET,
    payload: {
      target
    }
  }
}

export function showAnswer() {
  return {
    type: SHOW_ANSWER,
    payload: {}
  }
}

export function hideAnswer() {
  return {
    type: HIDE_ANSWER,
    payload: {}
  }
}