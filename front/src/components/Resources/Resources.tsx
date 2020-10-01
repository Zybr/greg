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
import { State } from "../../models/State";
import ResourceActCreators from "../../actions/resources/ResourceActCreators";
import { connect } from 'react-redux';

interface ResourcesProps extends JSX.IntrinsicAttributes {
    resources: Resource[],
    onDelete: Function,
}

const Resources = ({resources, onDelete}: ResourcesProps) => (
    <List className={styles.Resources} dense={true} data-testid="Resources">
        {resources.map(resource => (
            <ListItem key={resource.id} button>
                <ListItemText
                    primary={resource.name}
                    secondary={resource.url}
                />
                <ListItemSecondaryAction>
                    <IconButton onClick={() => onDelete ? onDelete(resource.id) : null}>
                        <DeleteIcon/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        ))}
    </List>
);

export default connect(
    (state: State) => ({ // Map state to props
        resources: state.resources,
    }),
    (dispatch: Function) => ({ // Map dispatch to props
        onDelete: (id: string) => dispatch(ResourceActCreators.remove(id)),
    })
)(Resources as any);
