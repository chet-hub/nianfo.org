import './App.css';
import RoomBlock from './components/RoomBlock'

const roomBlocks = [
  {
    src:"//images01.nicepagecdn.com/c461c07a441a5d220e8feb1a/f18a99e381785e19b930149d/2c34e97c-7abb-466b-83b1-4f153ec978b5.jpg", 
    desc:"Wed Sep 14 2022Comments (0)", 
    name:"Post 6 Headline"
  },
  {
    src:"//images01.nicepagecdn.com/c461c07a441a5d220e8feb1a/f18a99e381785e19b930149d/2c34e97c-7abb-466b-83b1-4f153ec978b5.jpg", 
    desc:"Wed Sep 14 2022Comments (0)", 
    name:"Post 6 Headline"
  },
  {
    src:"//images01.nicepagecdn.com/c461c07a441a5d220e8feb1a/f18a99e381785e19b930149d/2c34e97c-7abb-466b-83b1-4f153ec978b5.jpg", 
    desc:"Wed Sep 14 2022Comments (0)", 
    name:"Post 6 Headline"
  },
  {
    src:"//images01.nicepagecdn.com/c461c07a441a5d220e8feb1a/f18a99e381785e19b930149d/2c34e97c-7abb-466b-83b1-4f153ec978b5.jpg", 
    desc:"Wed Sep 14 2022Comments (0)", 
    name:"Post 6 Headline"
  },
  {
    src:"//images01.nicepagecdn.com/c461c07a441a5d220e8feb1a/f18a99e381785e19b930149d/2c34e97c-7abb-466b-83b1-4f153ec978b5.jpg", 
    desc:"Wed Sep 14 2022Comments (0)", 
    name:"Post 6 Headline"
  },
  {
    src:"//images01.nicepagecdn.com/c461c07a441a5d220e8feb1a/f18a99e381785e19b930149d/2c34e97c-7abb-466b-83b1-4f153ec978b5.jpg", 
    desc:"Wed Sep 14 2022Comments (0)", 
    name:"Post 6 Headline"
  }
]



function App() {
  return (
    <div className="App">
        <div className="roomBlockContainer">
          {roomBlocks.map(data=><RoomBlock {...data}/>)}
        </div>
        
    </div>
  );
}

export default App;
