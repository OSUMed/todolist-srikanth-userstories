import React, { useState } from "react";
import {
  Button,
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import AddIcon from "@mui/icons-material/Add";

const ToDoAddForm = ({ setToDoList }) => {
  const [task, setTask] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!task.trim()) {
      setError(true);
      return;
    }
    setTask("");
    const newTaskObject = {
      id: new Date().getTime().toString(),
      taskName: task,
      completed: false,
    };
    setToDoList((prevToDoList) => {
      return prevToDoList ? [newTaskObject, ...prevToDoList] : [newTaskObject];
    });

    setError(false);
  };

  return (
    <Box className="flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit} noValidate>
        <Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            className="space-x-3"
          >
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
            />
            <Box>
              <Button type="submit" variant="contained" color="primary">
                <AddIcon />
                <Typography className="hidden md:block ">Add Task</Typography>
                <Typography className="block md:hidden ">Add</Typography>
              </Button>
            </Box>
          </Box>
          {error && (
            <FormHelperText error={true} className="text-center">
              Please enter a task
            </FormHelperText>
          )}
        </Box>
      </form>
    </Box>
  );
};

export default ToDoAddForm;
