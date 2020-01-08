import React from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';

import manifest from '../../../utils/manifest';

const Braytech = (props) => {
  const { t, itemHash } = props;

  const definition = manifest.BraytechDefinition[itemHash];

  // description
  const description = definition.displayProperties.description;

  return (
    <>
      {description ? (
        <div className='description'>
          <pre>{description}</pre>
        </div>
      ) : null}
      {itemHash === 'commonality' ? <div className='line' /> : null}
      {itemHash === 'commonality' ? (
        <div className='description'>
          <p>{t('At current, {{number}} players are indexed by VOLUSPA.', { number: manifest.statistics.general.scraped.toLocaleString() })}</p>
        </div>
      ) : null}
    </>
  );
};

export default compose(
  withTranslation()
)(Braytech);