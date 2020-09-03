import * as React from 'react';

export const BuyGameNotice: React.FunctionComponent<{}> = () => {
  return (
    <div className='container' style={{ maxWidth: '100%' }}>
      <div className='BuyGameNotice'>
        <h4>
          I did not create the board game Wavelength. I just really enjoy playing it. <a
            href='https://www.wavelength.zone/'>Please visit the official site</a> and buy a physical copy to support the
    developers!
        </h4>
      </div>
    </div>
  );
}