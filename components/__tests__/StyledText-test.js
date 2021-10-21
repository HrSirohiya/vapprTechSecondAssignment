import * as React from 'react';
import renderer from 'react-test-renderer';

import  MonoText  from '../../App';

test(`renders correctly`, () => {
  const tree = renderer.create(
    <MonoText />
    ).toJSON();

  expect(tree).toMatchSnapshot();
});
