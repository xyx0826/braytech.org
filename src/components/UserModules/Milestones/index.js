import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';
import moment from 'moment';

import manifest from '../../../utils/manifest';
import { seasonalMods } from '../../../utils/destinyEnums';
import Items from '../../Items';
import ObservedImage from '../../ObservedImage';
import ProgressBar from '../../UI/ProgressBar';

import './styles.css';

class Milestones extends React.Component {
  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { t, member } = this.props;
    const characterActivities = member.data.profile.characterActivities.data;

    return (
      <div className='user-module milestones'>
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

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation())(Milestones);
