import React, { useState } from 'react';
import TodoList from './components/TodoLists';
import { AppBar, Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import DiamondIcon from '@mui/icons-material/Diamond';

const drawerWidth = 200;

function App() {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    return (
        <Box display={'flex'}>
            <AppBar position='fixed' sx={{ width: `calc(100% - ${drawerWidth}px)`, bgcolor: '#6D5D6E' }}>
                <Toolbar>
                    <h4 >TO DO TASK</h4>
                </Toolbar>
            </AppBar>
            <Drawer variant='permanent' sx={{
                width: drawerWidth,
                '& .MuiDrawer-paper': { width: drawerWidth, bgcolor: '#FDF4F5' }
            }}>
                <Toolbar sx={{ bgcolor: '#6D5D6E' }} >
                    <span style={{ display: 'flex', direction: 'row' }}>
                        <DiamondIcon color='disabled' fontSize='large' />
                        <h4 style={{ margin: 0, paddingLeft: 10, display: 'flex', alignItems: 'center' }}>TEST TODO</h4>
                    </span>
                </Toolbar>
                <Divider />
                <List>
                    <ListItem disablePadding>
                        <ListItemButton selected={selectedIndex === 0} onClick={(e) => handleListItemClick(e, 0)}>
                            <ListItemIcon sx={{ minWidth: '35px' }}>
                                <EventIcon />
                            </ListItemIcon>
                            <ListItemText primary='To-Do Task' sx={{ '& .MuiTypography-root': { fontSize: '15px' } }} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            <Box component={'main'} sx={{ flexGrow: 1 }}>
                <Toolbar />
                <TodoList />
            </Box>
        </Box >
    );
}

export default App;
