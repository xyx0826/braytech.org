import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';
import { groupBy } from 'lodash';

import manifest from '../../../utils/manifest';
import { seasonalMods } from '../../../utils/destinyEnums';
import Items from '../../Items';
import ObservedImage from '../../ObservedImage';
import ProgressBar from '../../UI/ProgressBar';

import './styles.css';

class Challenges extends React.Component {
  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { t, member } = this.props;
    const characterActivities = member.data.profile.characterActivities.data;

    console.log(groupBy(characterActivities[member.characterId].availableActivities.filter(a => a.challenges), a => a.challenges[0].objective.objectiveHash))

    return (
      <div className='user-module challenges'>
        Hi!
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    }
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation())(Challenges);
