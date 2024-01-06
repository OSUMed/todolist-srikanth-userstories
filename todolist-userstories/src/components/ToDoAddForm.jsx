import React, { useState } from "react";
import { Button, Box, TextField, Card, CardContent } from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";

const ToDoAddForm = ({ toDoList, setToDoList }) => {
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
    <Card>
      <CardContent>
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
              <Button type="submit" variant="contained" color="primary">
                Add Task
              </Button>
            </Box>
            {error && (
              <FormHelperText error={true} className="text-center">
                Please enter a task
              </FormHelperText>
            )}
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default ToDoAddForm;
