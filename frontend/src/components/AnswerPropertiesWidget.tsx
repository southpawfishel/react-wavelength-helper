import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../store/AppStore';
import { Answer } from '../model/Answer';
import { newTargetAnswer, toggleAnswer } from '../store/actions/answer-actions';

export type IAnswerPropertiesWidgetProps = {
  answer: Answer;
  toggleAnswerAction: any;
  newTargetAnswerAction: any;
};

const AnswerPropertiesWidget: React.FC<IAnswerPropertiesWidgetProps> = ({
  answer,
  toggleAnswerAction,
  newTargetAnswerAction,
}) => {
  const onToggleAnswerVisible = React.useCallback(() => {
    toggleAnswerAction();
  }, [toggleAnswerAction]);

  const onRerollAnswer = React.useCallback(() => {
    newTargetAnswerAction(Math.random());
  }, [newTargetAnswerAction]);

  return (
    <div className="container" style={{ maxWidth: '100%' }}>
      <div className="AnswerPropertiesWidget">
        <form>
          <div className="row">
            <div className="column column-50">
              <input
                type="button"
                style={{ width: '100%' }}
                value={answer.visible ? 'Hide Target' : 'Show Target'}
                onClick={onToggleAnswerVisible}
              />
            </div>
            <div className="column column-50">
              <input
                type="button"
                style={{ width: '100%' }}
                value="Roll New Target"
                onClick={onRerollAnswer}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state: IAppState) => ({
  answer: state.answer,
});

const mapDispatchToProps = {
  toggleAnswerAction: toggleAnswer,
  newTargetAnswerAction: newTargetAnswer,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnswerPropertiesWidget);
