import './App.css';
import RoomBlocks from './components/RoomBlocks'
import Welcome from './components/Welcome'
import Room from './components/Room'

//px.jpg  sjml.jpg  wssl.jpg

const roomBlocks = [
  {
    src:"./pusha/amtf.jpg", 
    desc:"Wed Sep 14 2022Comments (0)", 
    name:"Post 6 Headline"
  },
  {
    src:"./pusha/dsz.jpg", 
    desc:"Wed Sep 14 2022Comments (0)", 
    name:"Post 6 Headline"
  },
  {
    src:"./pusha/dzw.jpg", 
    desc:"Wed Sep 14 2022Comments (0)", 
    name:"Post 6 Headline"
  },
  {
    src:"./pusha/gml.jpg", 
    desc:"Wed Sep 14 2022Comments (0)", 
    name:"Post 6 Headline"
  },
  {
    src:"./pusha/gsy.jpg", 
    desc:"Wed Sep 14 2022Comments (0)", 
    name:"Post 6 Headline"
  },
  {
    src:"./pusha/ml.jpg", 
    desc:"Wed Sep 14 2022Comments (0)", 
    name:"Post 6 Headline"
  }
]



function App() {
  return (
    <div className="App">
      <Welcome />
      <RoomBlocks data={roomBlocks}></RoomBlocks>
      <Room />
    </div>
  );
}

export default App;
