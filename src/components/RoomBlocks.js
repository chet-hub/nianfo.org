
import './RoomBlocks.css'

function RoomBlock({src,desc,name}) {
    return (
      <div className="roomBlock">
         <img src={src}></img>
         <div className="roomBlockDesc">{desc}</div>
         <div className="roomBlockName">{name}</div>
      </div>
    );
  }

  export default ({data})=><div className="roomBlockContainer">
    {data.map(v=><RoomBlock {...v}/>)}
  </div>;