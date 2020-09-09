import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../store/AppStore';
import { Answer } from '../model/Answer';
import { showAnswer, hideAnswer, newTargetAnswer } from '../store/actions/answer-actions'

export interface IAnswerPropertiesWidgetProps {
  answer: Answer,
  showAnswerAction: typeof showAnswer,
  hideAnswerAction: typeof hideAnswer,
  newTargetAnswerAction: typeof newTargetAnswer,
}

const AnswerPropertiesWidget = (props: IAnswerPropertiesWidgetProps) => {
  const onToggleAnswerVisible = React.useCallback((event) => {
    if (props.answer.visible) {
      props.hideAnswerAction();
    } else {
      props.showAnswerAction();
    }
  }, [props]);

  const onRerollAnswer = React.useCallback((event) => {
    props.newTargetAnswerAction(Math.random());
  }, [props]);

  return (
    <div className='container' style={{ maxWidth: '100%' }}>
      <div className='AnswerPropertiesWidget'>
        <form>
          <div className='row'>
            <div className='column column-50'>
              <input type='button' style={{ width: '100%' }} value={props.answer.visible ? "Hide Target" : "Show Target"} onClick={onToggleAnswerVisible} />
            </div>
            <div className='column column-50'>
              <input type='button' style={{ width: '100%' }} value="Roll New Target" onClick={onRerollAnswer} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

const mapStateToProps = (state: IAppState) => ({
  answer: state.answer
})

const mapDispatchToProps = {
  showAnswerAction: showAnswer,
  hideAnswerAction: hideAnswer,
  newTargetAnswerAction: newTargetAnswer,
}

export default connect(mapStateToProps, mapDispatchToProps)(AnswerPropertiesWidget);