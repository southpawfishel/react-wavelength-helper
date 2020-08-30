import React from 'react';
import MetaTags from 'react-meta-tags';

class Meta extends React.Component {
  render() {
    return (
      <div className='meta'>
        <MetaTags>
          <title>Wavelength Helper</title>
          <meta name='description' content='A helper app for playing Wavelength remotely while sheltering in place' />
          <meta name='author' content='Dave Fishel' />
          <meta name='apple-mobile-web-app-capable' content='yes' />
          <meta name='viewport' content='width=device-width' />
        </MetaTags>
      </div>
    )
  }
}

export default Meta;
