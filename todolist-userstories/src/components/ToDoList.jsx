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
  FormControl,
  FormControlLabel,
  Dialog,
  DialogActions,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import PropTypes from "prop-types";

import CloseIcon from "@mui/icons-material/Close";

const ToDoList = () => {
  const [toDoList, setToDoList] = useState([]);
  const [finishedTasks, setFinishedTasks] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [priority, setPriority] = useState("");
  // const [openSnackBar, setOpenSnackBar] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState({
    open: false,
    vertical: "bottom",
    horizontal: "right",
    severity: "",
  });
  const [task, setTask] = useState("");
  const [error, setError] = useState(false);
  const { vertical, horizontal, open, severity } = openSnackBar;
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [taskRestored, setTaskRestored] = useState(false);
  const [actionType, setActionType] = useState("");

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

  const getTaskIndex = (taskId) => {
    return toDoList.findIndex((task) => task.id === taskId);
  };
  const handleMoveUpList = (taskId) => {
    const currentIndex = getTaskIndex(taskId);
    if (currentIndex > 0) {
      const reorderedList = [...toDoList];
      const temp = [
        reorderedList[currentIndex],
        reorderedList[currentIndex - 1],
      ];
      reorderedList[currentIndex - 1] = temp[0];
      reorderedList[currentIndex] = temp[1];
      setToDoList(reorderedList);
    }
  };

  const handleMoveDownList = (taskId) => {
    const currentIndex = getTaskIndex(taskId);
    if (currentIndex < toDoList.length - 1) {
      const reorderedList = [...toDoList];
      const temp = [
        reorderedList[currentIndex],
        reorderedList[currentIndex + 1],
      ];
      reorderedList[currentIndex + 1] = temp[0];
      reorderedList[currentIndex] = temp[1];
      setToDoList(reorderedList);
    }
  };

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
    setOpenDeleteDialog(false);
    setSelectedTask(task);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirmation = (task) => {
    setTaskRestored(false);
    setActionType("delete");
    let taskId = task.id;
    setToDoList((prevToDoList) => {
      return prevToDoList.filter((task) => task.id !== taskId);
    });
    setOpenDeleteDialog(false);
    setOpenSnackBar({ ...openSnackBar, open: true, severity: "success" });
    setSnackBarMessage("Task deleted successfully");
  };
  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenDeleteDialog(false);
    setSelectedTask("");
    setOpenSnackBar({ ...openSnackBar, open: false });
  };

  const handleRestoreSnackBarDialog = () => {
    setOpenSnackBar({ ...openSnackBar, open: true });
    setToDoList((prevToDoList) => {
      return prevToDoList ? [selectedTask, ...prevToDoList] : [selectedTask];
    });
    setSelectedTask("");
    setTaskRestored(true);
    setActionType("restore");
    setSnackBarMessage("Task restored successfully");
  };

  const action = (
    <React.Fragment>
      {actionType === "delete" && (
        <>
          <Button
            color="secondary"
            size="small"
            onClick={handleRestoreSnackBarDialog}
          >
            UNDO
          </Button>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackBar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      )}
    </React.Fragment>
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!task.trim()) {
      setError(true);
      return;
    }
    const newTaskObject = {
      id: new Date().getTime().toString(),
      taskName: task,
      completed: false,
      priority: "",
    };
    setToDoList((prevToDoList) => {
      return prevToDoList ? [newTaskObject, ...prevToDoList] : [newTaskObject];
    });

    setTask("");
    setError(false);
    setActionType("create");
    setOpenSnackBar({ ...openSnackBar, open: true, severity: "success" });
    setSnackBarMessage("Task added successfully");
  };

  const onPriorityChange = (priority, taskId) => {
    setPriority(priority);
    const taskIndex = getTaskIndex(taskId);
    const newToDoList = [...toDoList];
    newToDoList[taskIndex].priority = priority;
    setToDoList(newToDoList);
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

                  <Box className="flex items-center">
                    <Box>
                      <Box className="flex flex-col items-end">
                        <Box className="flex">
                          <FormControl>
                            <Select
                              labelId="priority-select-label"
                              renderValue={(selected) => {
                                if (selected.length === 0) {
                                  return <em>Placeholder</em>;
                                }
                                return selected;
                              }}
                              displayEmpty
                              value={
                                task.priority === "" ? (
                                  "Priority Level"
                                ) : (
                                  <Typography>
                                    <LabelImportantIcon /> {task.priority}
                                  </Typography>
                                )
                              }
                              sx={{ m: 1, width: 150, height: 50 }}
                              onChange={(e) =>
                                onPriorityChange(e.target.value, task.id)
                              }
                            >
                              <MenuItem value="None">
                                <em>None</em>
                              </MenuItem>
                              <MenuItem value={"Low"}>Low</MenuItem>
                              <MenuItem value={"Medium"}>Medium</MenuItem>
                              <MenuItem value={"Urgent"}>Urgent</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        <Button
                          color="error"
                          variant="outlined"
                          sx={{ m: 1, width: 120, height: 50 }}
                          className="flex flex-row justify-center items-center space-x-2"
                          onClick={() => handleDeleteDialogOpen(task)}
                        >
                          <Typography className="hidden md:block">
                            Delete
                          </Typography>
                          <DeleteIcon />
                        </Button>
                      </Box>
                    </Box>
                    <Box className="h-full flex flex-col">
                      <IconButton
                        className="text-gray-400 hover:text-gray-600 focus:text-gray-600 active:text-gray-800 p-2"
                        onClick={() => handleMoveUpList(task.id)}
                      >
                        <ArrowUpwardIcon />
                      </IconButton>
                      <IconButton
                        className="text-gray-400 hover:text-gray-600 focus:text-gray-600 active:text-gray-800 p-2"
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

          <ToDoAddForm
            key={(toDoList.length > 0 && toDoList[0].id) || 0}
            setToDoList={setToDoList}
            setSnackBarMessage={setSnackBarMessage}
            setOpenSnackBar={setSnackBarMessage}
            openSnackBar={openSnackBar}
            setError={setError}
            setTask={setTask}
            error={error}
            handleSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
      <Button
        variant="outlined"
        // onClick={() => setOpenSnackBar(true)}
        onClick={() =>
          setOpenSnackBar({
            open: true,
            vertical: "top",
            horizontal: "left",
          })
        }
        className="p-4"
      >
        Open simple dialog
      </Button>
      <HandleDialogClose
        setOpen={setOpenDeleteDialog}
        open={openDeleteDialog}
        handleClose={handleCloseSnackBar}
        handleDeleteConfirmation={handleDeleteConfirmation}
        task={selectedTask}
      />

      <MessageSnackbar
        anchorOrigin={{ vertical, horizontal }}
        openSnackBar={openSnackBar}
        handleClose={handleCloseSnackBar}
        feedbackMessage={snackBarMessage}
        action={action}
        handleCloseSnackBar={handleCloseSnackBar}
      />
    </Box>
  );
};

const HandleDialogClose = (props) => {
  const { open, handleClose, handleDeleteConfirmation, task } = props;
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

const MessageSnackbar = ({
  openSnackBar,
  handleClose,
  feedbackMessage,
  action,
  handleCloseSnackBarDialog,
  handleCloseSnackBar,
}) => {
  const { open, severity, vertical, horizontal } = openSnackBar;
  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={severity}
          action={action}
        >
          {feedbackMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

const PriorityDropdown = ({ priority, onPriorityChange }) => {
  return (
    <Select
      value={priority}
      onChange={(e) => onPriorityChange(e.target.value)}
      style={{ marginLeft: "auto" }} // This pushes the dropdown to the right
    >
      <MenuItem value={1}>1</MenuItem>
      <MenuItem value={2}>2</MenuItem>
      <MenuItem value={3}>3</MenuItem>
    </Select>
  );
};

export default ToDoList;
