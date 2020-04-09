import 'react-native';
import React from 'react';
import Register from '../screens/Register.js';
import renderer from 'react-test-renderer';

test('Does create account render?', () => {
  const snap = renderer.create(<Register />).toJSON();

  expect(snap).toMatchSnapshot();
});
