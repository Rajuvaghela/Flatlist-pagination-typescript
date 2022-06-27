import React from 'react';
import renderer from 'react-test-renderer';
import DisplayJson from '../src/DisplayJson';

test('renders correctly', () => {
  const tree = renderer.create(<DisplayJson />).toJSON();
  expect(tree).toMatchSnapshot();
});