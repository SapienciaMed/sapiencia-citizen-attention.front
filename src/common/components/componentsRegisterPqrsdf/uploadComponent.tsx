import { useRef, useState } from 'react';
import { FileUpload, ItemTemplateOptions } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Dialog } from 'primereact/dialog';

interface Atributos {
    id:string;
    dataArchivo: (data:object) => void;
}

export const UploadComponent = (props:Atributos)=> {

    const { id, dataArchivo } = props;

    const [visible, setVisible] = useState(false);

    const toast = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);

    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e) => {
        let _totalSize = 0;

        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 10000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / 1 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
            </div>
        );
    };

    const itemTemplate = (inFile: object, props:ItemTemplateOptions) => {
        const file = inFile as File;
        const extencion = file.name.split('.');

        if(extencion[extencion.length -1] !== 'pdf' ){
            onTemplateRemove(file, props.onRemove)
            return
        }
        
        dataArchivo(inFile);

        const footerContent = (
            <div className='text-center'>
                <Button label="Cerrar" className='text-center font-light' icon="pi pi-check" onClick={() =>exitDialog()} rounded />
            </div>
        );

       const exitDialog = () => {
        setVisible(false);
        onTemplateRemove(file, props.onRemove);
       }
    
        
        return (
            <div className="flex align-items-center flex-wrap" >

                <div className="card flex justify-content-center">
                    <Dialog 
                        header="¡Archivo adjuntado!"
                        className='p-dialog-titlebar-icon' 
                        visible={visible} 
                        onHide={() => setVisible(false)} footer={footerContent}
                        pt={{ 
                            root:{className:'text-center'},
                            header:{style:{color:'#5e3893'}},
                            closeButton:{ style:{color:'#5e3893', display:'none'}}  
                        }}
                    >
                        <p className="m-0">Archivo adjuntado exitosamente</p>
                    </Dialog>
                </div>

                { setVisible(true) }

                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                    </span>
                </div>
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column justify-center">
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)'}} className='flex-column'>
                  <p>Arrastra y suelta el archivo aquí</p>
                  <p className='text-red-500'>Solo es permitido el formato PDF</p>
                </span>
            </div>
        );
    };

    const chooseOptions = { icon: '', iconOnly: true,  className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: '', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: '', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };
    

    return (
        <div>

            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
            <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

            <FileUpload id={id} ref={fileUploadRef} name="demo[]" multiple={false} accept=".pdf" maxFileSize={1000000}
                onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} />
        </div>
    )
}