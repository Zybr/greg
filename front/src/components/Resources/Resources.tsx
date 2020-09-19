import React from 'react';
import styles from './Resources.module.scss';
import { Resource } from "../../models/Resource";
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete'

interface ResourceProps {
    resources: Resource[],
}

const Resources = ({resources}: ResourceProps) => (
    <List className={styles.Resources} dense={true} data-testid="Resources">
        {resources.map(resource => (
            <ListItem key={resource.id} button>
                <ListItemText
                    primary={resource.name}
                    secondary={resource.url}
                />
                <ListItemSecondaryAction>
                    <IconButton>
                        <DeleteIcon/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        ))}
    </List>
);

export default Resources;

