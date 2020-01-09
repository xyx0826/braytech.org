import React from 'react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import * as enums from '../../../utils/destinyEnums';
import ProfileSearch from '../../../components/ProfileSearch';
import Button from '../../../components/UI/Button';

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
    const { query } = this.props;
    const queryString = [...query.filter(m => m.membershipId !== p.membershipId), { membershipType: p.membershipType, membershipId: p.membershipId }].map(m => `${m.membershipType}:${m.membershipId}`).join('|');
    
    return (
      <li key={i} className='linked'>
        <div className='icon'>
          <span className={`destiny-platform_${enums.PLATFORMS[p.membershipType]}`} />
        </div>
        <div className='displayName'>{p.displayName}</div>
        <Link to={queryString ? `/compare/nightfalls?members=${queryString}` : `/compare/nightfalls`} />
      </li>
    );
  });

  render() {
    const { showSearch } = this.state;

    if (showSearch) {
      return (
        <div className='add-player'>
          <ProfileSearch resultsListItems={this.resultsListItems} />
        </div>
      );
    } else {
      return (
        <div className='add-player'>
          <Button text='Add player' action={this.handler_showSearch} />
        </div>
      );
    }

  }
}

export default withTranslation()(AddPlayer);
