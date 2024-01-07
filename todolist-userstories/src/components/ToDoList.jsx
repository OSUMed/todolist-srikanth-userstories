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
  Dialog,
  DialogActions,
} from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import PropTypes from "prop-types";

const ToDoList = () => {
  const [toDoList, setToDoList] = useState([]);
  const [finishedTasks, setFinishedTasks] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Local Storage Logic:
  useEffect(() => {
    const toDoListString = localStorage.getItem("toDoList");

    setToDoList(JSON.parse(toDoListString) || []);
  }, []);

  useEffect(() => {
    const toDoListJSON = JSON.stringify(toDoList);
    localStorage.setItem("toDoList", toDoListJSON);
  }, [toDoList]);

  // CRUD Logic:
  const handleMoveUpList = (taskId) => {};
  const handleMoveDownList = (taskId) => {};

  const isTaskCompleted = (taskId) => finishedTasks.includes(taskId);
  const handleCheckBoxToggle = (taskId) => {
    // if completed task is toggled again, remove it from the finishedTasks array
    if (isTaskCompleted(taskId)) {
      setFinishedTasks((prevFinishedTasks) =>
        prevFinishedTasks.filter((id) => id !== taskId)
      );
      return;
    }
    setFinishedTasks((prevFinishedTasks) => [...prevFinishedTasks, taskId]);
  };

  const handleDeleteDialogOpen = (task) => {
    setSelectedTask(task);
    setOpenDeleteDialog(true);
  };

  const handleClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteConfirmation = (task) => {
    let taskId = task.id;
    setToDoList((prevToDoList) => {
      return prevToDoList.filter((task) => task.id !== taskId);
    });
    setOpenDeleteDialog(false);
  };

  return (
    <Box className="h-screen flex flex-col justify-center items-center">
      <Card className="w-[60%] ">
        <CardContent>
          <List>
            {toDoList.map((task) => (
              <Box className="group" key={task.id}>
                <ListItem className="group-hover:bg-gray-200 rounded shadow-sm p-2 mb-2 ">
                  <Box
                    className="flex flex-grow"
                    onClick={() => handleCheckBoxToggle(task.id)}
                  >
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isTaskCompleted(task.id)}
                            disableRipple
                            onClick={() => handleCheckBoxToggle(task.id)}
                          />
                        }
                        label={
                          <Typography
                            variant="h6"
                            className={`text-center ${
                              finishedTasks.includes(task.id)
                                ? "line-through"
                                : ""
                            }`}
                          >
                            {task.taskName}
                          </Typography>
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
                        <Button variant="outlined">
                          <Typography className="hidden md:block">
                            Priority
                          </Typography>
                          <LabelImportantIcon />
                        </Button>
                        <Button
                          color="error"
                          variant="outlined"
                          onClick={() => handleDeleteDialogOpen(task)}
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
      <Button variant="outlined" onClick={setOpenDeleteDialog} className="p-4">
        Open simple dialog
      </Button>
      <HandleDialogClose
        setOpen={setOpenDeleteDialog}
        open={openDeleteDialog}
        handleClose={handleClose}
        handleDeleteConfirmation={handleDeleteConfirmation}
        task={selectedTask}
      />
    </Box>
  );
};

const HandleDialogClose = (props) => {
  const { open, setOpen, handleClose, handleDeleteConfirmation, task } = props;
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete message</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this message? This cannot be undone.
        </DialogContentText>
        <Card variant="outlined" sx={{ margin: 2, padding: 2 }}>
          <Typography variant="body2">{task && task.taskName}</Typography>
        </Card>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{ color: "black", border: "1px solid black" }}
        >
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={() => handleDeleteConfirmation(task)}
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ToDoList;
