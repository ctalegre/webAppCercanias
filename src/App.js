import React, { useCallback, useEffect, useState, useRef } from 'react'
import './App.css'
import callData from './renfeApi'
import helper from './helper'
import classNames from 'classnames'

// import './style_cer.css'
// import './style_cer_display.css'
import { Table, TableHead, TableRow, 
  TableCell, TableBody, withStyles, Button } from '@material-ui/core'

const styles = () => {
  return {
    nav:{
      position: 'fixed',
      width:'100%',
      fontWeight:'100',
      fontSize:12,
      height:30,
      background:'black',
      color:'white',
      zIndex:4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
      // borderBottom: '1px solid #1560ea'
    },
    civis:{
      color: 'red'
    },
    cell:{
      padding:'10px 0px'
    },
    C6:{
      fontWeight: 'bold',
      color: '#00328b'
    },
    C6_:{
      fontWeight: 'bold'
    },
    goodTrain:{
      opacity:'0.5',
      '&:hover':{
        opacity:1
      }
    }
  }
}

// const scroll = () => {
//   let scrolls = document.querySelectorAll('.scrollActive')
//   if(!scrolls.length) return 
  
//   window.scrollTo(0, scrolls[0].scrollTop)

// }
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
function HourComponent ({info, minutesBefore}) {
  const [infoRender, setInfoRender] = useState('')
  const [delay, setDelay] = useState(1000);

  useInterval(()=> {
    setInfoRender(helper.isTrainLost(info))
  }, [delay])
  
  return <span className={((helper.isOnMinutesBefore(info, minutesBefore) && infoRender) ? 'parpadea scrollActive' : '')}>
    {infoRender}
  </span>
}
function App (props) {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({})
  
  const [query, setQuery] = useState({
    "o": "",
    "d": ""
  })

  useEffect(() => {
    setQuery({
      "o": "65206",
      "d": "65003"
    })
  }, [])

  function reverseTrip () {
    setQuery({
      o: query.d,
      d: query.o
    })
  }

  const [minutesBefore, setMinutesBefore] = useState('25')

  //temporal
  const [isIda, setIsIda] = useState(true)
  
  const getData = useCallback(async (query) => {
    setIsLoading(true)
    const data = await callData(query)
    setData(data)

    setIsLoading(false)
  }, [query])

  useEffect(() => {
    getData(query)
  }, [getData, query])

  return (
    <>
    <div className={props.classes.nav}>
      {/* Nules > Cabanyal */}
      <span onClick={reverseTrip}>
        <strong>
        {data && data.origen} 
        </strong>
        {` / `}
        <strong>
        {data && data.destino} 
        </strong>
      </span>
      
    
          {/* <Button onClick={() => scroll()}>
            Dia Anterior
          </Button>
          <Button>
            Hoy
          </Button>
          <Button>
            Dia Siguiente
          </Button> */}
    </div>
    <div className="App" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '50px'
    }}>
      <div style={{
        // minWidth: '424px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection:'column',
        paddingTop: '30px'
      }}>
        <Table padding="none">
          <TableHead>
            <TableRow>
              <TableCell style={{paddingLeft:'40px'}}>Linea</TableCell>
              <TableCell></TableCell>
              <TableCell>Salida</TableCell>
              <TableCell>Llegada</TableCell>
              <TableCell style={{paddingRight:'40px'}}>Tiempo Viaje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? <p>Cargando...</p>
              : data && data.data && data.data.map((row, indexRow) => {
                return (
                 indexRow === 0 
                  // || !helper.isTrainLost(row[2].trim())) 
                  ? ''
                    : <TableRow key={indexRow} style={{ 
                      // display: (helper.isTrainLost(row[2].trim()) ? 'none': 'block'),
                      opacity: (helper.isTrainLost(row[2].trim()) ? '1': '0.3'),
                      // background: (helper.isOnMinutesBefore(row[2].trim(), '25') ? 'unset' : '#8bfdc4'),
                    }}>
                      {/* {row.map((cell, indexCell) => {
                        return <TableCell className={ row===1 ? props.classes.civis:''} key={indexCell}>{cell}</TableCell>
                      })} */}
                      <TableCell style={{paddingLeft:'40px'}} className={classNames(props.classes.cell, `${props.classes[helper.getLineClassname(row[0])]}`)}>{row[0] || ''}</TableCell>
                      <TableCell className={props.classes.cell +' '+ props.classes.civis}>{row[1] || ''}</TableCell>
                      <TableCell className={props.classes.cell}>{row[2] || ''}</TableCell>
                      <TableCell className={props.classes.cell}>{row[3] || ''}</TableCell>
                      <TableCell style={{paddingRight:'40px'}} className={props.classes.cell}>{row[4] || ''}</TableCell>
                      <TableCell>{
                          // helper.isTrainLost(row[2].trim())
                          // hoursMap[row[2]]

                          <HourComponent info={row[2]} minutesBefore={minutesBefore} />
                          }
                          <span className={props.classes.goodTrain}>
                            {helper.goodTrains(row[4], '0.35') && '👍'}
                            {!helper.goodTrains(row[4], '0.45') && '🐢'}
                          </span>
                      </TableCell>
                    </TableRow>
                )
              })}
          </TableBody>
        </Table>
        <div className="scrollActive"></div>
      </div>
    </div>
    </>
  )
}

export default withStyles(styles)(App)
