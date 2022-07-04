import Board from './Components/Board';
import { createGlobalState } from 'react-hooks-global-state';
import Confetti from 'react-confetti';
import toast, { Toaster } from 'react-hot-toast';
import useWindowSize from 'react-use/lib/useWindowSize';
import Navbar from './Components/Navbar';

export const { useGlobalState } = createGlobalState({
  card1: {"type": null, "id": null },
  card2: {"type": null, "id": null },
  win: false
});

function App() {
  const { width, height } = useWindowSize()
  const [win] = useGlobalState('win');
  return (
    <div className="App">
      <Navbar></Navbar>
      {win == true && <Toaster></Toaster> }
      {win == true && <Confetti
        width={width}
        height={height}
        ></Confetti> }
      <Board></Board>
    </div>
  );
}

export default App;
