import { useRef, useState } from "react";
import { FileUpload, ItemTemplateOptions } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { Dialog } from "primereact/dialog";
import { PrimeIcons } from "primereact/api";

interface Atributos {
  id: string;
  dataArchivo: (data: object) => void;
}

export const UploadComponent = (props: Atributos) => {
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
    toast.current.show({ severity: "info", summary: "Success", detail: "File Uploaded" });
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
    const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : "0 B";

    return (
      <div className={className} style={{ backgroundColor: "transparent", display: "flex", alignItems: "center" }}>
        {chooseButton}
        {uploadButton}
        {cancelButton}
        <div className="flex align-items-center gap-3 ml-auto">
          <span>{formatedValue} / 1 MB</span>
          <ProgressBar value={value} showValue={false} style={{ width: "10rem", height: "12px" }}></ProgressBar>
        </div>
      </div>
    );
  };

  const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
    const file = inFile as File;
    const extencion = file.name.split(".");

    if (extencion[extencion.length - 1] !== "pdf") {
      onTemplateRemove(file, props.onRemove);
      return;
    }

    dataArchivo(inFile);

    const footerContent = (
      <div className="text-center">
        <Button
          label="Cerrar"
          className="text-center font-light"
          icon="pi pi-check"
          onClick={() => exitDialog()}
          rounded
        />
      </div>
    );

    const exitDialog = () => {
      setVisible(false);
      onTemplateRemove(file, props.onRemove);
    };

    return (
      <div className="flex align-items-center flex-wrap">
        <div className="card flex justify-content-center">
          <Dialog
            header="¡Archivo adjuntado!"
            className="p-dialog-titlebar-icon"
            visible={visible}
            onHide={() => setVisible(false)}
            footer={footerContent}
            pt={{
              root: { className: "text-center" },
              header: { style: { color: "#5e3893" } },
              closeButton: { style: { color: "#5e3893", display: "none" } },
            }}
          >
            <p className="m-0">Archivo adjuntado exitosamente</p>
          </Dialog>
        </div>

        {setVisible(true)}

        <div className="flex align-items-center" style={{ width: "40%" }}>
          <span className="flex flex-column text-left ml-3">{file.name}</span>
        </div>
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column justify-center">
        <span style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }} className="flex-column">
          <p>Arrastra y suelta el archivo aquí</p>
          <p className="text-red-500">Solo es permitido el formato PDF</p>
        </span>
      </div>
    );
  };

  const chooseOptions = {
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5.56769 16.8758C4.14661 16.8814 2.77647 16.347 1.73435 15.3808C1.22685 14.9116 0.821888 14.3424 0.54493 13.7091C0.267972 13.0758 0.125 12.3921 0.125 11.7008C0.125 11.0096 0.267972 10.3259 0.54493 9.69258C0.821888 9.05928 1.22685 8.49011 1.73435 8.02084L8.97935 1.17834C9.72449 0.498182 10.6969 0.121094 11.7058 0.121094C12.7147 0.121094 13.6871 0.498182 14.4323 1.17834C14.8208 1.539 15.1323 1.97454 15.348 2.45874C15.5638 2.94295 15.6793 3.46581 15.6877 3.99584C15.6903 4.45389 15.598 4.90752 15.4165 5.32812C15.2351 5.74871 14.9685 6.12716 14.6335 6.43959L7.37894 13.2917C6.94118 13.6978 6.36609 13.9235 5.76894 13.9235C5.17178 13.9235 4.59669 13.6978 4.15894 13.2917C3.94172 13.0915 3.76835 12.8485 3.64976 12.578C3.53118 12.3075 3.46995 12.0154 3.46995 11.72C3.46995 11.4246 3.53118 11.1325 3.64976 10.862C3.76835 10.5915 3.94172 10.3485 4.15894 10.1483L10.8673 3.83292C11.002 3.69832 11.1847 3.62272 11.3752 3.62272C11.5657 3.62272 11.7483 3.69832 11.8831 3.83292C12.0177 3.96769 12.0933 4.15037 12.0933 4.34084C12.0933 4.53131 12.0177 4.71399 11.8831 4.84875L5.17477 11.1642C5.09953 11.2298 5.03922 11.3108 4.99789 11.4018C4.95657 11.4927 4.93519 11.5914 4.93519 11.6913C4.93519 11.7911 4.95657 11.8898 4.99789 11.9807C5.03922 12.0717 5.09953 12.1527 5.17477 12.2183C5.34835 12.3668 5.56926 12.4484 5.79769 12.4484C6.02611 12.4484 6.24702 12.3668 6.4206 12.2183L13.6752 5.38542C13.8598 5.20453 14.0058 4.98818 14.1047 4.74938C14.2035 4.51058 14.253 4.25426 14.2502 3.99584C14.2423 3.66275 14.1668 3.33474 14.0285 3.03165C13.8901 2.72856 13.6917 2.45669 13.4452 2.2325C12.9721 1.79402 12.3509 1.55039 11.7058 1.55039C11.0608 1.55039 10.4395 1.79402 9.96643 2.2325L2.75019 9.06542C2.38474 9.4003 2.09294 9.80752 1.89332 10.2612C1.69369 10.7149 1.5906 11.2052 1.5906 11.7008C1.5906 12.1965 1.69369 12.6868 1.89332 13.1405C2.09294 13.5942 2.38474 14.0014 2.75019 14.3363C3.53076 15.0638 4.55813 15.4683 5.62519 15.4683C6.69224 15.4683 7.71961 15.0638 8.50019 14.3363L15.6781 7.54167C15.7442 7.47386 15.8232 7.41997 15.9104 7.38317C15.9976 7.34637 16.0913 7.32742 16.186 7.32742C16.2807 7.32742 16.3744 7.34637 16.4616 7.38317C16.5489 7.41997 16.6279 7.47386 16.6939 7.54167C16.8285 7.67644 16.9041 7.85912 16.9041 8.04959C16.9041 8.24006 16.8285 8.42274 16.6939 8.5575L9.45852 15.3808C8.40244 16.3616 7.00874 16.8971 5.56769 16.8758Z"
          fill="#533893"
        />
      </svg>
    ),
    iconOnly: true,
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };
  const uploadOptions = {
    icon: (
      <svg width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14.7513 13.5638C14.5524 13.5638 14.3616 13.4847 14.221 13.3441C14.0803 13.2034 14.0013 13.0127 14.0013 12.8138C14.0013 12.6148 14.0803 12.4241 14.221 12.2834C14.3616 12.1428 14.5524 12.0638 14.7513 12.0638C16.4113 12.0638 17.0013 11.2338 17.0013 8.88375C16.9291 8.04604 16.5635 7.26072 15.9689 6.66617C15.3744 6.07163 14.589 5.70601 13.7513 5.63375C13.4108 5.6424 13.0735 5.7031 12.7513 5.81375C12.654 5.85444 12.5492 5.87386 12.4438 5.87073C12.3384 5.86759 12.2349 5.84197 12.1402 5.79557C12.0455 5.74917 11.9618 5.68307 11.8947 5.6017C11.8277 5.52033 11.7788 5.42556 11.7513 5.32375C11.3707 4.1346 10.5788 3.12002 9.51765 2.46209C8.4565 1.80416 7.1956 1.54595 5.96124 1.73382C4.72689 1.92168 3.5999 2.54331 2.78252 3.48714C1.96515 4.43098 1.51091 5.63522 1.50133 6.88375C1.50133 10.3238 2.26133 12.0638 3.75133 12.0638C3.95024 12.0638 4.141 12.1428 4.28166 12.2834C4.42231 12.4241 4.50133 12.6148 4.50133 12.8138C4.50133 13.0127 4.42231 13.2034 4.28166 13.3441C4.141 13.4847 3.95024 13.5638 3.75133 13.5638C1.25133 13.5638 0.00132606 11.3138 0.00132606 6.88375C-0.029911 5.30751 0.491578 3.77005 1.47533 2.53808C2.45908 1.30611 3.84304 0.457349 5.38712 0.139031C6.93121 -0.179288 8.538 0.0529171 9.92879 0.795367C11.3196 1.53782 12.4066 2.74367 13.0013 4.20375C13.2653 4.15608 13.5331 4.13265 13.8013 4.13375C15.0363 4.20952 16.201 4.73429 17.0759 5.6092C17.9508 6.48411 18.4756 7.64876 18.5513 8.88375C18.5013 10.1638 18.5013 13.5638 14.7513 13.5638Z"
          fill="#39ACFF"
        />
        <path
          d="M12.0817 10.9638C11.8833 10.9615 11.6934 10.8826 11.5517 10.7438L9.25172 8.44376L6.95172 10.7438C6.80955 10.8762 6.6215 10.9484 6.4272 10.9449C6.2329 10.9415 6.04751 10.8628 5.9101 10.7254C5.77269 10.588 5.69397 10.4026 5.69055 10.2083C5.68712 10.014 5.75924 9.82593 5.89172 9.68376L8.72172 6.85376C8.79067 6.783 8.87308 6.72677 8.96411 6.68837C9.05514 6.64997 9.15293 6.63019 9.25172 6.63019C9.35052 6.63019 9.44831 6.64997 9.53933 6.68837C9.63036 6.72677 9.71278 6.783 9.78172 6.85376L12.6117 9.68376C12.7522 9.82438 12.8311 10.015 12.8311 10.2138C12.8311 10.4125 12.7522 10.6031 12.6117 10.7438C12.4689 10.8809 12.2797 10.9594 12.0817 10.9638Z"
          fill="#39ACFF"
        />
        <path
          d="M9.25098 14.4937C9.05206 14.4937 8.8613 14.4147 8.72065 14.2741C8.57999 14.1334 8.50098 13.9426 8.50098 13.7437V7.38373C8.50098 7.18482 8.57999 6.99405 8.72065 6.8534C8.8613 6.71275 9.05206 6.63373 9.25098 6.63373C9.44989 6.63373 9.64065 6.71275 9.78131 6.8534C9.92196 6.99405 10.001 7.18482 10.001 7.38373V13.7437C10.001 13.9426 9.92196 14.1334 9.78131 14.2741C9.64065 14.4147 9.44989 14.4937 9.25098 14.4937Z"
          fill="#39ACFF"
        />
      </svg>
    ),
    iconOnly: true,
    className: "custom-upload-btn p-button-success p-button-rounded p-button-outlined",
  };
  const cancelOptions = {
    icon: (
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M14.1212 18.375H6.8762C5.96008 18.375 5.19883 17.668 5.13058 16.7536L4.3457 6.125H16.6255L15.8668 16.7493C15.8012 17.6654 15.0391 18.375 14.1212 18.375V18.375Z"
          stroke="#FF0000"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M10.5 9.625V14.875"
          stroke="#FF0000"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path d="M3.5 6.125H17.5" stroke="#FF0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path
          d="M14.875 6.125L13.9886 3.76075C13.7323 3.07737 13.0795 2.625 12.3497 2.625H8.65025C7.9205 2.625 7.26775 3.07737 7.01138 3.76075L6.125 6.125"
          stroke="#FF0000"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M13.5016 9.625L13.1254 14.875"
          stroke="#FF0000"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M7.4984 9.625L7.87465 14.875"
          stroke="#FF0000"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    iconOnly: true,
    className: "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
  };

  return (
    <div>
      <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
      <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
      <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

      <FileUpload
        id={id}
        ref={fileUploadRef}
        name="demo[]"
        multiple={false}
        accept=".pdf"
        maxFileSize={1000000}
        onUpload={onTemplateUpload}
        onSelect={onTemplateSelect}
        onError={onTemplateClear}
        onClear={onTemplateClear}
        headerTemplate={headerTemplate}
        itemTemplate={itemTemplate}
        emptyTemplate={emptyTemplate}
        chooseOptions={chooseOptions}
        uploadOptions={uploadOptions}
        cancelOptions={cancelOptions}
      />
    </div>
  );
};
