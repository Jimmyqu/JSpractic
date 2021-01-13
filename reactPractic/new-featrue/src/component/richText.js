import React, { useState,useRef,useEffect } from 'react';
import loadScript from 'load-script';

var defaultCDN = 'https://cdn.ckeditor.com/ckeditor5/11.0.1/classic/ckeditor.js';

const RichText = ({value,onChange}) =>{
    const dom = useRef()
    const [instan,setInstan] = useState()
    useEffect(()=>{
        let editor;
        loadScript(defaultCDN, ()=>{
            editor = window.ClassicEditor
            if(!editor)return
            console.log(dom.current)
            editor.create(dom.current).then(e=>{
                setInstan(e)
                console.log(instan)
                if(value){
                  e.setData(value);
                }
                e.model.document.on('change', function( r ) {
                    onChange(e.getData());
                });
            })
        })
    },[dom])

    useEffect(()=>{
        if(!instan){
            return 
        }
        instan.setData(value)
    },[value])
    return <textarea ref={dom} />;
  }

  export default RichText
// export default OtherChild