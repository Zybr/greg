import React from 'react';
import styles from './EditResource.module.scss';
import {
    Button
} from '@material-ui/core';
import EditResourceDialog from "../dialogs/EditResourceDialog/EditResourceDialog";
import { ResourceCreate } from "../../models/Resource";

interface Props {
    onApply: { (data: ResourceCreate): void }
}

class EditResource extends React.Component {
    public readonly state: {
        isOpen: boolean
        data: ResourceCreate,
    }

    public readonly props: Props;

    public constructor(props: Props) {
        super(props);
        this.props = props;
        this.state = {
            isOpen: false,
            data: {
                name: null as unknown as string,
                url: null as unknown as string,
                parameters: {},
            }
        }
    }

    public render() {
        return (
            <div className={styles.EditResource} data-testid="EditResource">
                <Button color="primary" variant="outlined" onClick={this.handleEditClick.bind(this)}>Add</Button>
                <EditResourceDialog
                    isOpen={this.state.isOpen}
                    onChangeName={this.handleChangeName.bind(this)}
                    onChangeUrl={this.handleChangeUrl.bind(this)}
                    onApply={this.handleApply.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                />
            </div>
        )
    }

    private handleChangeUrl(event: React.SyntheticEvent): void {
        this.setState({
            data: {
                ...this.state.data,
                ...{url: (event.target as HTMLInputElement).value}
            }
        });
    }

    private handleChangeName(event: React.SyntheticEvent): void {
        this.setState({
            data: {
                ...this.state.data,
                ...{name: (event.target as HTMLInputElement).value}
            }
        });
    }

    private handleEditClick(): void {
        this.setState({isOpen: true});
    }

    private handleApply(): void {
        this.setState({isOpen: false})
        this.props.onApply(this.state.data);
    }

    private handleCancel(): void {
        this.setState({isOpen: false})
    }
}

export default EditResource; 
