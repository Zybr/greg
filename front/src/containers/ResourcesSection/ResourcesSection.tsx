import React from 'react';
import styles from './ResourcesSection.module.scss';
import { connect } from 'react-redux';
import { State } from "../../models/State";
import ResourceActCreators from "../../actions/resources/act-creators";
import { Resource } from "../../models/Resource";
import Resources from "../../components/Resources/Resources";
import {
    Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

interface ResourcesSectionProps extends JSX.IntrinsicAttributes {
    resources: Resource[],
    onLoad: Function,
}

// const useStyles = makeStyles((theme) => ({
//     root: {
//         flexGrow: 1,
//     },
//     paper: {
//         padding: theme.spacing(1),
//         textAlign: 'center',
//         color: theme.palette.text.secondary,
//     },
// }));

class ResourcesSection extends React.Component {
    public readonly props: ResourcesSectionProps;

    constructor(props: ResourcesSectionProps, children?: React.ReactNode) {
        super(props, children);
        this.props = props as ResourcesSectionProps;
    }

    componentDidMount() {
        this.props.onLoad();
    }

    render() {
        return (
            <Grid
                className={styles.ResourcesContainer}
                data-testid="ResourcesSection"
                container
                spacing={5}
            >
                <Grid container item xs={12} spacing={3}>
                    <Resources resources={this.props.resources}/>
                </Grid>
            </Grid>
        )
    }
}

export default connect(
    (state: State) => ({ // Map state to props
        resources: state.resources,
    }),
    (dispatch: Function) => ({ // Map dispatch to props
        onLoad: () => dispatch(ResourceActCreators.fetchResources()),
    })
)(ResourcesSection as any);
