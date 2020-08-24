import React ,{useRef,useState,useEffect} from 'react';
import SearchForm from './component/seachForm'

function App() {
  const myRef = useRef()
  const [data,setData] = useState(null)
  const [arr,setArr] = useState({})
  useEffect(()=>{
    console.log('father useEffect')
  })
  
  return <div >
      <SearchForm setArr={setArr}></SearchForm>
      <p>{JSON.stringify(arr)}</p>
      {/* <p>{myRef.current.a||0}</p> */}
  </div>
}

export default App