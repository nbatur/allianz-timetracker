import React, { useState, useRef } from 'react';
import validator from 'validator'
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { RecordService } from '../service/RecordService';

const TimeTracker = () => {

    let emptyRecord = {
        email: '',
        start: '',
        end: ''        
    };
    const [loadingState, setLoadingState] = useState(false);
    const [recordDialog, setRecordDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [record, setRecord] = useState(emptyRecord);
    const [email, setEmail] = useState('');
    const recordService = new RecordService();
    const [records, setRecords] = useState([]);
    const defaultLimit = 10;
    const defaultTimeout = 5000;

    const openNew = () => {
        setRecord(emptyRecord);
        setSubmitted(false);
        setRecordDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setRecordDialog(false);
    }

    // Save the time record posted from IU
    const saveRecord = async () => {
        setSubmitted(true);

        console.log(record)

        if (!validator.isEmail(record.email)) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please enter a valid email!', life: defaultTimeout });
            return;
        }

        let _record = { ...record };
        let startVal = new Date(_record.start);
        let endVal = new Date(_record.end);

        console.log(startVal.getTime());
        console.log(endVal.getTime());

        if (startVal.getTime() >= endVal.getTime()) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Start time cannot be equal to or lesser than end time!', life: defaultTimeout });
        } else {
            _record.start = new Date(_record.start).toLocaleString();
            _record.end = new Date(_record.end).toLocaleString();
            let result = await recordService.createRecord(_record);

            if (result) {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Record Created.', life: defaultTimeout });
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Record Creation failed!', life: defaultTimeout });
            }

            setRecordDialog(false);
            setRecord(emptyRecord);
        }
    }

    // search for esxiting records, empty email will retrieve all records limited by default value
    const searchRecords = async () => {
        if (email.trim() !== '' && !validator.isEmail(email)) {          
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please enter a valid email!', life: defaultTimeout });
            setLoadingState(false);
            
        } else {
            setLoadingState(true);
            console.log(email);
            let response = {};
            
            if (email.trim()) {
                response = await recordService.getRecordsByEmail(email, defaultLimit);
            } else {
                response = await recordService.getRecords(defaultLimit);
            }

            console.log(response);
            if (Array.isArray(response)) {
                
                console.log("result before null removal: ");
                console.log(response);

                // Remove the null entries from result array
                response = response.filter(x => x !== null);

                console.log("result after null removal: ");
                console.log(response);
                setRecords(response);
                setLoadingState(false);
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Could not retrieve records from server! ' + response, life: defaultTimeout });
                setLoadingState(false);          
            }
        }
    }

    const onEmailChange = (event) => {
        setEmail(event.target.value);       
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _record = { ...record };
        _record[`${name}`] = val;

        setRecord(_record);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />                    
                </div>
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>      
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        )
    }

    const startBodyTemplate = (rowData) => {
        var dateStr = new Date(rowData.start)
        let startDate = dateStr.toLocaleString()
        return (
            <>
                <span className="p-column-title">Start Date</span>
                {startDate}
            </>
        );
    }

    const endBodyTemplate = (rowData) => {
        var dateStr = new Date(rowData.end)
        let endDate = dateStr.toLocaleString()
        return (
            <>
                <span className="p-column-title">Start Date</span>
                {endDate}
            </>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Employee Timetrack Table</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const recordDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveRecord} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
            <div className="card">
                    <h5>Search for Timetrack</h5>
                    <div className="formgroup-inline">
                        <div className="field">
                            <label htmlFor="email" className="p-sr-only">Firstname</label>
                            <InputText id="email" type="text" onChange={onEmailChange} placeholder="Employee Email" />
                        </div>
                        <Button className="mr-2 mb-2" label="Search" icon="pi pi-search" iconPos="right" loading={loadingState} onClick={searchRecords} />
                    </div>
                </div>
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={records}
                        dataKey="email" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records"
                        globalFilter={globalFilter} emptyMessage="No records found." header={header} responsiveLayout="scroll">
                        <Column field="email" header="Email" sortable headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="start" header="Start Date" sortable body={startBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="end" header="End Date" sortable body={endBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={recordDialog} style={{ width: '450px' }} header="Record Details" modal className="p-fluid" footer={recordDialogFooter} onHide={hideDialog}>
    
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" value={record.email} onChange={(e) => onInputChange(e, 'email')} required autoFocus className={classNames({ 'p-invalid': submitted && !record.email })} />
                            {submitted && !record.email && <small className="p-invalid">Email is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="calendar">Start</label>
                            <Calendar inputId="start" value={record.startDate} onChange={(e) => onInputChange(e, 'start')} dateFormat="yy.mm.dd" showTime showIcon className={classNames({ 'p-invalid': submitted && !record.start })}/>
                            {submitted && !record.start && <small className="p-invalid">Start is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="calendar">End</label>
                            <Calendar inputId="end" value={record.endDate} onChange={(e) => onInputChange(e, 'end')} dateFormat="yy.mm.dd" showTime showIcon className={classNames({ 'p-invalid': submitted && !record.end })}/>
                            {submitted && !record.end && <small className="p-invalid">End is required.</small>}
                        </div>                       
                    </Dialog>        
                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(TimeTracker, comparisonFn);