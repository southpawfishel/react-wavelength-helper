import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../store/AppStore';
import { Answer } from '../model/Answer';
import { newTargetAnswer, toggleAnswer } from '../store/actions/answer-actions';
import { Button, JustifyContent, Layout, Text } from '../ui';

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
    <Layout justifyContent={JustifyContent.SpaceEvenly} paddingBottom={'1rem'}>
      <Button background={'purple'} onClick={onToggleAnswerVisible}>
        <Text color={'white'}>
          {answer.visible ? 'Hide Target' : 'Show Target'}
        </Text>
      </Button>
      <Button background={'purple'} onClick={onRerollAnswer}>
        <Text color={'white'}>Roll New Target</Text>
      </Button>
    </Layout>
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
