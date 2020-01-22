import React from 'react';
import { NavLink } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import './styles.css';

export function NavLinks(props) {
  return (
    <div className='module views'>
      <ul className='list'>
        <li className='linked'>
          <div className='icon' />
          <NavLink to='/database' exact />
        </li>
        <li className='linked'>
          <div className='icon manifest' />
          <NavLink to='/database/manifest' exact />
        </li>
        <li className='linked'>
          <div className='icon eververse' />
          <NavLink to='/database/eververse' exact />
        </li>
        <li className='linked'>
          <div className='icon chalice-of-opulence' />
          <NavLink to='/database/chalice-of-opulence' />
        </li>
      </ul>
    </div>
  );
}

class Database extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <div className='view' id='database'>
        <div className='module head'>
          <div className='page-header'>
            <div className='name'>{t('Database')}</div>
          </div>
        </div>
        <div className='buff'>
          <NavLinks />
          <div className='module'></div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    viewport: state.viewport
  };
}

export default compose(connect(mapStateToProps), withTranslation())(Database);
