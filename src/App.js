import { Helmet } from "react-helmet";
import "./App.css";

import Game from "./Game/Game";

function App() {
  return (
    <div className="App">
      <Helmet>
        {/* For detecting touch input on mobile */}
        <script src="https://code.jquery.com/pep/0.4.3/pep.js"></script>
      </Helmet>
      <Game />
    </div>
  );
}

export default App;
