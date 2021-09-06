import { Route, Redirect } from 'react-router-dom';
import Authorized from './Authorized';

export default props => {
  const { component: Component, render, authority, redirectPath, ...rest } = props;
  return (
    <Authorized
      authority={authority}
      noMatch={<Route {...rest} render={() => <Redirect to={{ pathname: redirectPath }} />} />}
    >
      <Route {...rest} render={p => (Component ? <Component {...p} /> : render(p))} />
    </Authorized>
  );
};
