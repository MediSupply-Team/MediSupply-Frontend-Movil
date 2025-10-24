import React from 'react';

const MapView = ({ children, testID = 'mapview', ...props }: any) => (
  <div testID={testID} {...props}>
    {children}
  </div>
);

export const Marker = ({ title, description, coordinate, testID = 'marker', ...rest }: any) => (
  <div
    testID={testID}
    data-title={title}
    data-desc={description}
    data-lat={coordinate?.latitude}
    data-lng={coordinate?.longitude}
    {...rest}
  />
);

export default MapView;
