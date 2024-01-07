import "./App.css";
import ToDoList from "./components/ToDoList";
import Container from "@mui/material/Container";

function App() {
  return (
    <div className="App">
      <Container maxWidth="lg">
        <ToDoList />
      </Container>
    </div>
  );
}

export default App;
