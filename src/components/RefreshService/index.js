import React from 'react';
import { connect } from 'react-redux';

import store from '../../store';
import * as utils from '../../utils/destinyUtils';
import getMember from '../../utils/getMember';
import Spinner from '../UI/Spinner';

import './styles.css';

const AUTO_REFRESH_INTERVAL = 30 * 1000;
const TIMEOUT = 60 * 60 * 1000;

class RefreshService extends React.Component {
  state = {
    loading: false
  }

  componentDidMount() {
    // start the countdown
    this.init();
  }

  componentDidUpdate(prevProps) {
    // if previous member prop data doesn't equal current member prop data, if config service was turned off/on
    if (prevProps.member.data !== this.props.member.data || this.props.member.stale || prevProps.refreshService.config.enabled !== this.props.refreshService.config.enabled) {
      // if config service was turned off/on
      if (prevProps.refreshService.config.enabled !== this.props.refreshService.config.enabled) {
        if (this.props.refreshService.config.enabled) {
          this.init();
        } else {
          this.quit();
        }

        // member data is stale -> go now
      } else if (this.props.member.stale) {
        this.track();
        this.service();

        // restart the countdown
      } else {
        this.clearInterval();
        this.startInterval();
      }
    }
  }

  componentWillUnmount() {
    this.quit();
  }

  render() {
    const { location } = this.props;
    const { loading } = this.state;

    if (loading && utils.isProfileRoute(location)) {
      return (
        <div id='refresh-service'>
          <Spinner mini />
        </div>
      );
    } else {
      return null;
    }
  }

  init() {
    if (this.props.member.membershipId && this.props.refreshService.config.enabled) {
      this.track();

      document.addEventListener('click', this.clickHandler);
      document.addEventListener('visibilitychange', this.visibilityHandler);

      this.startInterval();
    }
  }

  quit() {
    document.removeEventListener('click', this.clickHandler);
    document.removeEventListener('visibilitychange', this.visibilityHandler);

    this.clearInterval();
  }

  track() {
    this.lastActivityTimestamp = Date.now();
  }

  activeWithinTimespan(timespan) {
    return Date.now() - this.lastActivityTimestamp <= timespan;
  }

  startInterval() {
    this.refreshAccountDataInterval = window.setInterval(this.service, AUTO_REFRESH_INTERVAL);
  }

  clearInterval() {
    window.clearInterval(this.refreshAccountDataInterval);
  }

  clickHandler = () => {
    this.track();
  };

  visibilityHandler = () => {
    if (document.hidden === false) {
      this.track();
      this.service();
    }
  };

  service = async () => {

    // service is already asking for fresh data
    if (this.state.loading) {
      return;
    }

    // user has been inactive for TIMEOUT so we'll stop pinging the API
    if (!this.activeWithinTimespan(TIMEOUT)) {
      return;
    }

    const { membershipType, membershipId, characterId } = this.props.member;

    try {
      this.setState({ loading: true });

      const data = await getMember(membershipType, membershipId, true);

      ['profile', 'groups', 'milestones'].forEach(key => {
        if (data[key].ErrorCode !== 1) {
          throw new Error(data[key].ErrorCode);
        }
      });

      if (data) {
        store.dispatch({
          type: 'MEMBER_LOADED',
          payload: {
            membershipType,
            membershipId,
            characterId,
            data: {
              profile: data.profile.Response,
              groups: data.groups.Response,
              milestones: data.milestones.Response
            }
          }
        });
      }

      this.setState({ loading: false });

    } catch (e) {
      console.warn(`Error while refreshing profile - ignoring`, e);
    }
  };
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    refreshService: state.refreshService
  };
}

export default connect(mapStateToProps)(RefreshService);
