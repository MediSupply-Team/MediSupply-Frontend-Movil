import React from 'react';

export default function MaterialIcons({ name, testID, ...rest }: any) {
  const id = testID ?? `icon-${name}`;
  return <span testID={id} {...rest} />;
}
