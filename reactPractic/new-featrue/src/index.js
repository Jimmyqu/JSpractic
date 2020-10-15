import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
// import App from './ContextApp';
// import App from './MemoApp';
// import App from './UnmontedApp';
// import App from './Hocapp';
// import App from './hooksApp';
// import App from './FormApp';
// import App from './Apps/TestHooksRelyApp';
// import App from './Apps/MemoUsage';
// import App from './Apps/MemoUsage1';
import App from './Apps/ReducerApp';



import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />,document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();