import React, { useEffect, useState } from "react";
import ToDoAddForm from "./ToDoAddForm";
import {
  List,
  ListItem,
  Button,
  Typography,
  Card,
  CardContent,
  Box,
  Checkbox,
  ButtonGroup,
  IconButton,
  FormGroup,
  FormControlLabel,
  Input,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const ToDoList = () => {
  const [toDoList, setToDoList] = useState([]);
  const [finishedTasks, setFinishedTasks] = useState([]);
  const [taskToUpdate, setTaskToUpdate] = useState({});

  // Local Storage Logic:
  useEffect(() => {
    const toDoListString = localStorage.getItem("toDoList");
    setToDoList(JSON.parse(toDoListString) || []);
  }, []);
  useEffect(() => {
    const toDoListJSON = JSON.stringify(toDoList);
    localStorage.setItem("toDoList", toDoListJSON);
  }, [toDoList]);

  // Priority Logic:
  const handleMoveUpList = (taskId) => {};
  const handleMoveDownList = (taskId) => {};

  // CRUD Logic:
  const isTaskAlreadyCompleted = (taskId) => finishedTasks.includes(taskId);
  const markCheckmark = (taskId) => {
    // if completed task is toggled again, remove it from the finishedTasks array
    if (isTaskAlreadyCompleted(taskId)) {
      setFinishedTasks((prevFinishedTasks) =>
        prevFinishedTasks.filter((id) => id !== taskId)
      );
      setToDoList(
        toDoList.map((task) =>
          task.id === taskId ? { ...task, completed: false } : task
        )
      );

      return;
    }
    setFinishedTasks((prevFinishedTasks) => [...prevFinishedTasks, taskId]);
    setToDoList(
      toDoList.map((task) =>
        task.id === taskId ? { ...task, completed: true } : task
      )
    );
  };

  const handleEditTask = (taskId) => {
    const task = toDoList.find((task) => task.id === taskId);
    if (task.completed) return;
    setToDoList((prevToDoList) => {
      return prevToDoList.map((task) =>
        task.id === taskId ? { ...task, editing: true } : task
      );
    });
  };

  const handleUpdateTask = (taskId) => {
    setToDoList((prevToDoList) => {
      return prevToDoList.map((task) =>
        task.id === taskId
          ? { ...task, editing: false, taskName: taskToUpdate }
          : task
      );
    });
  };

  const handleDeleteTask = (taskId) => {
    setToDoList((prevToDoList) => {
      return prevToDoList.filter((task) => task.id !== taskId);
    });
  };

  return (
    <Box className="h-screen flex flex-col justify-center items-center">
      <Card className="w-[60%]">
        <CardContent>
          <List>
            {toDoList.map((task) => (
              <Box className="group" key={task.id}>
                <ListItem className="group-hover:bg-gray-200 rounded shadow-sm p-2 mb-2 ">
                  <Box className="flex flex-grow">
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isTaskAlreadyCompleted(task.id)}
                            disableRipple
                            onClick={() => markCheckmark(task.id)}
                          />
                        }
                        label={
                          task.editing ? (
                            <Input
                              defaultValue={task.taskName}
                              onChange={(e) => setTaskToUpdate(e.target.value)}
                              disableUnderline
                            />
                          ) : (
                            <Typography
                              className={`text-center ${
                                task.completed ? "line-through" : ""
                              } ${
                                !task.editing
                                  ? "text-black !important"
                                  : "bg-white text-black"
                              }`}
                            >
                              {task.taskName}
                            </Typography>
                          )
                        }
                      />
                    </FormGroup>
                  </Box>

                  <Box className="flex items-end">
                    <Box>
                      <ButtonGroup
                        variant="text"
                        aria-label="text button group"
                        orientation="vertical"
                        className="space-y-2"
                      >
                        {!task.editing ? (
                          <Button
                            variant="outlined"
                            onClick={() => handleEditTask(task.id)}
                          >
                            <Typography className="hidden md:block">
                              Edit
                            </Typography>
                            <EditIcon />
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            onClick={() => handleUpdateTask(task.id)}
                          >
                            <Typography className="hidden md:block">
                              Update
                            </Typography>
                            <EditIcon />
                          </Button>
                        )}
                        <Button
                          color="error"
                          variant="outlined"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Typography className="hidden md:block">
                            Delete
                          </Typography>
                          <DeleteIcon />
                        </Button>
                      </ButtonGroup>
                    </Box>
                    <Box className="h-full flex flex-col">
                      <IconButton
                        class="text-gray-400 hover:text-gray-600 focus:text-gray-600 active:text-gray-800 p-2"
                        onClick={() => handleMoveUpList(task.id)}
                      >
                        <ArrowUpwardIcon />
                      </IconButton>
                      <IconButton
                        class="text-gray-400 hover:text-gray-600 focus:text-gray-600 active:text-gray-800 p-2"
                        onClick={() => handleMoveDownList(task.id)}
                      >
                        <ArrowDownwardIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </ListItem>
              </Box>
            ))}
          </List>

          <ToDoAddForm setToDoList={setToDoList} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default ToDoList;
