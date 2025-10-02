import { useState, useEffect } from "react";
import Fade from "../utils/fade";
import { NuiEvent } from "../hooks/NuiEvent";
import { useSelector } from "react-redux";
import healthicon from "../assets/images/heart.png";
import armouricon from "../assets/images/shield.png";
import thirsticon from "../assets/images/drop.png";
import hungericon from "../assets/images/burger.png";
import stressicon from "../assets/images/brain.png";
import oxygenicon from "../assets/images/oxygen.png";
import novolume from "../assets/images/nosound.png";
import volume1 from "../assets/images/volume1.png";
import volume2 from "../assets/images/volume2.png";
import volume3 from "../assets/images/volume3.png";

const Minimap = () => {
  const [status, setStatus] = useState({
    minimap: false,
    status: {
    [0]: 50,
    [1]: 0,
    [2]: 0,
    [3]: 0,
    [4]: 0,
    [5]: 0,
    },
    voice: false,
    voicemode: 1,
  });

  const [waypoint, setWaypoint] = useState(true);
  const [dir, setDir] = useState(0);
  // const [newdir, setNewDir] = useState(0);

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (dir != newdir) {

  //       if (Math.abs(dir - newdir) > 170){
  //         console.log(true)
  //         setDir(newdir)
  //       }else{
  //         if (dir < newdir) {
  //           setDir(dir + 1);
  //       } else {
  //         setDir(dir - 1);
  //       }
  //       }


  //     }
  //   }, 1);

  // }, [newdir,dir]);
  
  NuiEvent("minimapcompass", (data) => setDir((data.heading - 180)));


  // var statusnames = [
  //   {
  //     top: 0,
  //     left: 0,
  //     icon: healthicon
  //   },
  //   {
  //     top: 0,
  //     left: 0,
  //     icon: armouricon
  //   },    
  //   {
  //     top: 0,
  //     left: 0,
  //     icon: hungericon
  //   },
  //   {
  //     top: 0,
  //     left: 0,
  //     icon: thirsticon
  //   },
  //   {
  //     top: 0,
  //     left: 0,
  //     icon: stressicon
  //   },

  // ]




    var statusnames = [
      {
        icon: healthicon,
        show: true,
        type: 'health'
      },
      {
        icon: armouricon,
        show: 'partial',
        type: 'armor'
      },    
      {
        icon: hungericon,
        show: false,
        type: 'hunger'
      },
      {
        icon: thirsticon,
        show: false,
        type: 'thirst'
      },
      {
        icon: oxygenicon,
        show: false,
        type: 'oxygen'
      },
      {
        icon: stressicon,
        show: false,
        type: 'stress'
      },
  
    ]

    var statusposition = [
      // {
      //   top: 1,
      //   left: 0,
   
      // },
      {
        top: 0,
        left: 0,

      },    
      {
        top: 0,
        left: 0,

      },
      {
        top: 1,
        left: 0,

      },
      {
        top: 3.2,
        left: -.7,
      },
      {
        top: 6,
        left: -2.3,
      },
      {
        top: 9,
        left: -5.25,
      },
  
    ]


  var statusdata = [];
  var counter = 0
  for (const i in statusnames) {

    if (statusnames[i].show == true || (status.status[i] > 0 && status.status[i] < 99) || (statusnames[i].show == 'partial' && status.status[i] > 0)){
    statusdata[i] = {
      value: status.status[i],
      icon: statusnames[i].icon,
      type: statusnames[i].type,
      top: statusposition[counter].top,
      left: statusposition[counter].left,
    };
    counter = counter + 1
    }
  }
  


  const handlestatus = (data) => {
    setStatus(data);
  };

  NuiEvent("status", handlestatus);

  const handlevoicemode = (data) => {
  }

  NuiEvent("voicemode", handlevoicemode);

  NuiEvent("minimapwaypoint", (data) => setWaypoint(data));

  const settings = useSelector((state) => state.settings)

  return (
    <>
      <Fade in={settings.showminimap}>
        
        <div style={{height: status.minimap ? '17.2vw' : '4.5vw'}} className="minimap">

          <div style={{visibility: settings.playerstatus ? '' : 'hidden'}} className="playerstatus">


              <div
               style={status.minimap ? {
                left: '0vw',
                top: '1vw',
                backgroundColor: status.voice ? 'rgba(255,255,255,0.5)' : 'rgba(0, 0, 0, 0.5)',
               } : {
                backgroundColor: status.voice ? 'rgba(255,255,255,0.5)' : 'rgba(0, 0, 0, 0.5)',
               }}
               className="status">
                <img src={volume3} alt="" />
                <img style={{clipPath: `polygon(0 ${100 - (status.voicemode * 33)}%, 100% ${100 - (status.voicemode * 33)}%, 100% 100%, 0% 100%)`}} className="value" src={volume3} alt="" />
              </div>

            {statusdata.map((data,index) => (
              <div
               style={status.minimap ? {
                left: data.left + 'vw',
                top: data.top + 'vw',
               } : {}}
               className={`status ${data.type}`}>
                <img src={data.icon} alt="" />
                <img style={{clipPath: `polygon(0 ${100 - data.value}%, 100% ${100 - data.value}%, 100% 100%, 0% 100%)`}} className="value" src={data.icon} alt="" />
              </div>
            
            ))}
              {/* <div
               style={{
                left: statusnames[1].left + 'vw',
                top: statusnames[1].top + 'vw',
               }}
               className="status">
                <img src={statusnames[1].icon} alt="" />
                <img style={{clipPath: `polygon(0 ${100 - status.armour}%, 100% ${100 - status.armour}%, 100% 100%, 0% 100%)`}} className="value" src={statusnames[1].icon} alt="" />
              </div>

              <div
               style={{
                left: statusnames[2].left + 'vw',
                top: statusnames[2].top + 'vw',
               }}
               className="status">
                <img src={statusnames[2].icon} alt="" />
                <img style={{clipPath: `polygon(0 ${100 - status.hunger}%, 100% ${100 - status.hunger}%, 100% 100%, 0% 100%)`}} className="value" src={statusnames[2].icon} alt="" />
              </div>

              <div
               style={{
                left: statusnames[3].left + 'vw',
                top: statusnames[3].top + 'vw',
               }}
               className="status">
                <img src={statusnames[3].icon} alt="" />
                <img style={{clipPath: `polygon(0 ${100 - status.thirst}%, 100% ${100 - status.thirst}%, 100% 100%, 0% 100%)`}} className="value" src={statusnames[3].icon} alt="" />
              </div>

              <div
               style={{
                opacity: status.stress ? '1.0' : '0.0',
                left: statusnames[4].left + 'vw',
                top: statusnames[4].top + 'vw',
               }}
               className="status">
                <img src={statusnames[4].icon} alt="" />
                <img style={{clipPath: `polygon(0 ${100 - status.stress}%, 100% ${100 - status.stress}%, 100% 100%, 0% 100%)`}} className="value" src={statusnames[4].icon} alt="" />
              </div> */}

          </div>
{/* 
          {settings.playerstatus &&
          <div style={status.minimap ? {top: '12vw',marginLeft: '13vw'} : {marginTop: '-2vw'}} className="voice">
            {status.voice ? 
            status.voicemode == 1 ? <img src={volume1} alt="" /> : status.voicemode == 2 ? <img src={volume2} alt="" /> : <img src={volume3} alt="" />
            : <img src={novolume} alt="" />}
          </div>} */}

          {status.minimap &&
          <>
          <div style={{transform: `rotate(${-dir}deg) scale(${settings.minimapsize / 50})`}}  className="map">
            <div style={{transform: `rotate(${dir}deg)`}} className="north">N</div>
          </div>



          <Fade in={waypoint ? true : false}>
          <div className="distance">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
          <p>{waypoint}KM</p>
          </div>
          </Fade>
          </>
          }
        </div>
      </Fade>
    </>
  );
};

export default Minimap;
