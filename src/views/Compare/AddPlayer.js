import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';

import * as enums from '../../utils/destinyEnums';
import ProfileSearch from '../../components/ProfileSearch';
import Button from '../../components/UI/Button';

class AddPlayer extends React.Component {
  state = {
    showSearch: false
  };

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handler_showSearch = e => {
    if (this.mounted) {
      this.setState({
        showSearch: true
      });
    }
  }

  handler_profileClick = (membershipType, membershipId, displayName) => {
    if (this.mounted) {
      this.props.action(membershipType, membershipId, displayName);
      this.setState({
        showSearch: false
      });
    }
  }

  resultsListItems = profiles => profiles.map((p, i) => {
    const { query, match } = this.props;
    const object = match.params?.object;
    const queryString = [...query.filter(m => m.membershipId !== p.membershipId), { membershipType: p.membershipType, membershipId: p.membershipId }].map(m => `${m.membershipType}:${m.membershipId}`).join('|');
    
    return (
      <li key={i} className='linked'>
        <div className='icon'>
          <span className={`destiny-platform_${enums.platforms[p.membershipType]}`} />
        </div>
        <div className='displayName'>{p.displayName}</div>
        <Link to={queryString ? `/compare/${object}?members=${queryString}` : `/compare/${object}`} />
      </li>
    );
  });

  render() {
    const { showSearch } = this.state;

    if (showSearch) {
      return (
        <div className='column add-player'>
          <ul className='list'>
            <li />
          </ul>
          <ProfileSearch resultsListItems={this.resultsListItems} />
        </div>
      );
    } else {
      return (
        <div className='column add-player'>
          <Button text='Add player' action={this.handler_showSearch} />
        </div>
      );
    }

  }
}

export default compose(withTranslation(), withRouter)(AddPlayer);
