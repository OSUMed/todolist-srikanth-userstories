import React, { useState } from "react";
import { FormGroup, Button, Box, TextField, Card } from "@mui/material";

const ToDoAddForm = () => {
  const [task, setTask] = useState("");
  return (
    <form>
      <Box className="h-screen flex justify-center items-center space-x-3">
        <TextField
          id="add-task-textfield"
          label="New Task"
          variant="outlined"
          required
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <Button variant="contained" color="primary">
          Add Task
        </Button>
        <Box>New Task is: {task}</Box>
      </Box>
    </form>
  );
};

export default ToDoAddForm;
