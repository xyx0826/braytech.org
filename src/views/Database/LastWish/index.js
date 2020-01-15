import React from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { orderBy } from 'lodash';
import ReactMarkdown from 'react-markdown';
import queryString from 'query-string';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import { DestinyKey } from '../../../components/UI/Button';
import Items from '../../../components/Items';

import './styles.css';

class LastWish extends React.Component {
  state = {};

  componentDidMount() {
    this.mounted = true;

    window.scrollTo(0, 0);
    this.props.rebindTooltips();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { t } = this.props;

    return (
      <>
        <div className='module head'>
          <div className='page-header'>
            <div className='sub-name'>{t('Database')}</div>
            <div className='name'>{manifest.DestinyRecordDefinition[751035753].displayProperties.name}</div>
          </div>
        </div>
        <div className='buff'>
          {this.props.nav}
          <div className='module'>
            <div className='text'>
              <p></p>
            </div>
          </div>
          <div className='module'>
          
          </div>
        </div>
      </>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    }
  };
}

export default compose(connect(null, mapDispatchToProps), withTranslation())(LastWish);
