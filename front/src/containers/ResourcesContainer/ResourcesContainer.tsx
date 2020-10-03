import React from 'react';
import styles from './ResourcesContainer.module.scss';
import { connect } from 'react-redux';
import { State } from "../../models/State";
import ResourceActCreators from "../../actions/resources/ResourceActCreators";
import { Resource, ResourceCreate } from "../../models/Resource";
import Resources from "../../components/Resources/Resources";
import {
    Grid,
    Box
} from '@material-ui/core';
import EditResource from "../../components/EditResource/EditResource";

interface Props {
    resources: Resource[],
    onLoad: Function,
    onCreate: { (data: ResourceCreate): void },
}

class ResourcesContainer extends React.Component {
    public readonly props: Props;

    constructor(props: Props, children?: React.ReactNode) {
        super(props, children);
        this.props = props as Props;
    }

    componentDidMount() {
        this.props.onLoad();
    }

    render() {
        return (
            <Box pt={10}>
                <Grid
                    className={styles.ResourcesContainer}
                    data-testid="ResourcesContainer"
                    container
                    spacing={10}
                >
                    <Grid item xs={4}>
                        <EditResource onApply={this.props.onCreate}/>
                        <div className="Resources-container">
                            <Resources/>
                        </div>
                    </Grid>
                    <Grid container item xs={8}>
                    </Grid>
                </Grid>
            </Box>
        )
    }
}

export default connect(
    (state: State) => ({ // Map state to props
        resources: state.resources,
    }),
    (dispatch: Function) => ({ // Map dispatch to props
        onLoad: () => dispatch(ResourceActCreators.fetchList()),
        onCreate: (data: ResourceCreate) => dispatch(ResourceActCreators.create(data)),
    })
)(ResourcesContainer as any);
