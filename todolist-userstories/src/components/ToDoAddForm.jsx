import React, { useState } from "react";
import { Button, Box, TextField, Card } from "@mui/material";

const ToDoAddForm = () => {
  const [task, setTask] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!task.trim()) {
      setError(true);
      return;
    }
    setTask("");
    setError(false);
  };
  console.log("the values are: ", error, task);
  return (
    <form onSubmit={handleSubmit} noValidate>
      <Box className="h-screen flex justify-center items-center space-x-3">
        <TextField
          error={error}
          id="add-task-textfield"
          label="New Task"
          variant="outlined"
          value={task}
          onChange={(e) => {
            setTask(e.target.value);
            setError(false);
          }}
          helperText={error ? "Please enter a task" : ""}
        />
        <Button type="submit" variant="contained" color="primary">
          Add Task
        </Button>
        <Box>New Task is: {task}</Box>
      </Box>
    </form>
  );
};

export default ToDoAddForm;
