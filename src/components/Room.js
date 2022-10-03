
import './Room.css'

function Room({name}) {
    return (
      <div className="room">
         {name}
      </div>
    );
  }

  const data = [
    {name:"xxxxx"},
    {name:"yyyyyy"},
    {name:"xxxxxx"},
    {name:"xxxxx"},
    {name:"yyyyyy"},
    {name:"xxxxxx"},
    {name:"xxxxx"},
    {name:"yyyyyy"},
    {name:"xxxxxx"},
    {name:"xxxxx"},
    {name:"yyyyyy"},
    {name:"xxxxxx"},
  ]


  export default ()=><div className="roomContainer">
    {data.map(v=><Room {...v}/>)}
  </div>;