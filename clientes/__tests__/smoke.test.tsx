import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

describe('Smoke test', () => {
  it('renders a simple component', () => {
    const { getByText } = render(<Text>Hola</Text>);
    expect(getByText('Hola')).toBeTruthy();
  });
});
