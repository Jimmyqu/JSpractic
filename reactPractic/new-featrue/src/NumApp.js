import React from 'react';
import NumInput from './component/NumInput'

function App() {

    return <div>
      <div style={{padding:'24px'}}>
        <NumInput value={2} width={120} min={1} max={10}></NumInput>
      </div>
    </div>
}

export default App