
import { useRef, useState } from 'react';
import { FileUpload, FileUploadHeaderTemplateOptions, FileUploadSelectEvent, FileUploadUploadEvent, ItemTemplateOptions,} from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { trashIcon } from '../icons/trash';
import { clip } from '../icons/clip';
import { iconUpload } from '../icons/upload';
import { imagesicon } from '../icons/images';
import { MessageComponent } from '../componentsEditWorkEntities/message.component';
import { fileIcon } from '../icons/file-icon';

interface Props {
    filesSupportDocument?:(data: []) => void;
    statusDialog?:(data:boolean) => void;
    multiple?:boolean;
}

export const UploadManagetComponen = (props:Props) => {

    const { filesSupportDocument, statusDialog, multiple=true } = props;

    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef<FileUpload>(null);
    const [largeFile, setLargeFile] = useState(false);
    const [visible, setVisible] = useState(false);
    const [fileValue, setFileValue]=useState<number>(0);

    const customUpload = (file) => {
        filesSupportDocument(file.files);
        setVisible(true)
      };

    const onTemplateSelect = (e) => { 
              
        let _totalSize = totalSize;
        let files = e.files;
        
        Object.keys(files).forEach((key) => {
          _totalSize += files[key].size || 0;
        });
    
        setTotalSize(_totalSize);
      };

    const onTemplateRemove = (file: File, callback: Function) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {     
        setTotalSize(0);
    };

    const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 100000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';
        setFileValue(value);

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / 10 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
            </div>
        );
    };

    const clearFile =() => {
        setTotalSize(0);
      }

    const itemTemplate = (file, props:ItemTemplateOptions) => {
        
        if(fileValue > 100 ){
            onTemplateRemove(file, props.onRemove);
            setLargeFile(true)
            clearFile();
            return
          }
              
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    {file.objectURL!==undefined?(
                        <>
                            <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                        </>):(
                        <>
                            <i>{fileIcon}</i>
                        </>)}
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                    </span>
                </div>
                <Button type="button" icon={trashIcon} className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column justify-center">
            <span style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }} className="flex-column">
              <i style={{display:'flex', justifyContent:'center'}}>{imagesicon}</i>
              <p className='flex items-center justify-center'>Arrastra y suelta el archivo aquí</p>
              <p className="text-red-500">Solo es permitido el formato PDF y JPG</p>
            </span>
          </div>
        );
    };

    const chooseOptions = { icon: ( clip ), iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: ( iconUpload ), iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: ( trashIcon ), iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

  return (
    <div>
        {visible?
        (<>
            <MessageComponent
                headerMsg='Archivos adjuntados'
                msg='Archivos adjuntados exitosamente'
                twoBtn={false}
                nameBtn1='Cerrar'
                onClickBt1={() => statusDialog(false)}
            />
        </>):(<></>)}
        {largeFile?(<>
            <MessageComponent 
            headerMsg="Error" 
            msg="El Tamaño de los Archivo Supera el Límite Permitido" 
            nameBtn1="Cerrar"
            twoBtn={false} 
            onClickBt1={()=>setLargeFile(false)}
          /></>):(<></>)}
        <Tooltip target=".custom-choose-btn" content="Adjuntar" position="bottom" />
        <Tooltip target=".custom-upload-btn" content="Cargar" position="bottom" />
        <Tooltip target=".custom-cancel-btn" content="Eliminar" position="bottom" />

        <FileUpload 
            multiple={multiple} 
            ref={fileUploadRef}
            accept="pdf,jpg" 
            onSelect={onTemplateSelect} 
            onError={onTemplateClear} 
            onClear={onTemplateClear}
            headerTemplate={headerTemplate} 
            itemTemplate={itemTemplate} 
            emptyTemplate={emptyTemplate}
            chooseOptions={chooseOptions} 
            uploadOptions={uploadOptions} 
            cancelOptions={cancelOptions}
            customUpload={true} 
            uploadHandler={customUpload}
        />
    </div>
  )
}
