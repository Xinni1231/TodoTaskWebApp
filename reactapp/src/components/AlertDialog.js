import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";

export const AlertDialog = ({ title, content, action }) => {
    return (<Dialog open={true} onClose={() => action(false)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => { action(false); }}>No</Button>
            <Button onClick={() => { action(true); }}>Yes</Button>
        </DialogActions>
    </Dialog>)
}
