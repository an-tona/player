import React from 'react'
import { useState, useEffect } from 'react'
import preloader from '../images/preloader.gif';

function MainPage() {
  return (
    <>
    <div className='track_search_preloader_container' style={{display: 'flex', justifyContent:'center', alignItems:'center'}}>
            <h4>Searching tracks...</h4>
            <img src={preloader} alt='preloader' style={{width:'30px', height:'30px'}}/>
        </div> 
    </>
   
  )
}

export default MainPage