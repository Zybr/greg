import React from 'react';
import styles from './EditResourceDialog.module.scss';
import {
    Grid,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Input,
    FormHelperText
} from '@material-ui/core';

interface Handler {
    (event: React.SyntheticEvent): void
}

interface Props {
    isOpen: boolean,
    onChangeName?: Handler,
    onChangeUrl?: Handler,
    onCancel?: Handler,
    onApply?: Handler
}

const EditResourceDialog = (
    {
        isOpen = false,
        onChangeUrl,
        onChangeName,
        onApply,
        onCancel,
    }: Props
) => (
    <Dialog open={isOpen} onClose={onCancel} className={styles.EditResourceDialog}
            data-testid="EditResourceDialog">
        <DialogContent>
            <Grid>
                <FormControl>
                    <InputLabel>Name</InputLabel>
                    <Input onChange={onChangeName}/>
                    <FormHelperText>Unique resource name</FormHelperText>
                </FormControl>
            </Grid>
            <Grid>
                <FormControl>
                    <InputLabel>Url</InputLabel>
                    <Input onChange={onChangeUrl}/>
                    <FormHelperText>Full path to resource</FormHelperText>
                </FormControl>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={onApply} color="primary">Create</Button>
            <Button onClick={onCancel}>Cancel</Button>
        </DialogActions>
    </Dialog>
)

export default EditResourceDialog;

// class EditResourceDialog extends React.Component {
//     public readonly props: Props
//
//     constructor(props: Props) {
//         super(props)
//         this.props = props;
//     }
//
//     render() {
//         return (
//             <Dialog open={this.props.isOpen} onClose={this.props.onCancel} className={styles.EditResourceDialog}
//                     data-testid="EditResourceDialog">
//                 <DialogContent>
//                     <Grid>
//                         <FormControl>
//                             <InputLabel>Name</InputLabel>
//                             <Input onChange={this.props.onChangeName}/>
//                             <FormHelperText>Unique resource name</FormHelperText>
//                         </FormControl>
//                     </Grid>
//                     <Grid>
//                         <FormControl>
//                             <InputLabel>Url</InputLabel>
//                             <Input onChange={this.props.onChangeUrl}/>
//                             <FormHelperText>Full path to resource</FormHelperText>
//                         </FormControl>
//                     </Grid>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={this.props.onApply} color="primary">Create</Button>
//                     <Button onClick={this.props.onCancel}>Cancel</Button>
//                 </DialogActions>
//             </Dialog>
//         )
//     }
// }
