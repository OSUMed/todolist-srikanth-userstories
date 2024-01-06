import logo from "./logo.svg";
import "./App.css";
import Button from "@mui/material/Button";

function App() {
  return (
    <div className="App">
      <div>
        <div className="text-xl  bg-blue-200">Hello World!</div>
        <Button variant="contained" color="primary">
          Click Me
        </Button>
      </div>
    </div>
  );
}

export default App;
