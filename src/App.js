import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "../src/styles/Global.css"
import Home from './pages/home/Home';
import Main from './pages/main/Main';
import PoseEstimation from './pages/client/Client';
import Routines from './pages/routines/Routines';
function App() {
  return (
    <BrowserRouter>
      <div className='main-screen' >
        <Routes>
          <Route path='/' element={<Home />}>
            <Route path='main' element={<Main />}/>
            <Route path='client' element={<PoseEstimation />}/>
            <Route path='routines' element={<Routines />}/>
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
