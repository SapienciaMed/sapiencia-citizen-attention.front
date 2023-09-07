
export const UploadComponent = () => {

  const  handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        // Aquí puedes realizar acciones con el archivo seleccionado, como cargarlo o mostrar su información.
        console.log('Archivo seleccionado:', selectedFile);
      };
  

  return (
    <>
        <label className="upload-label" style={{ display:'flex', alignItems:'center'}} htmlFor="fileInput">Adjuntar archivos <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.00008 5.83331V11.1666" stroke="#533893" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.6666 8.50002H5.33325" stroke="#533893" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M8 14.5V14.5C4.686 14.5 2 11.814 2 8.5V8.5C2 5.186 4.686 2.5 8 2.5V2.5C11.314 2.5 14 5.186 14 8.5V8.5C14 11.814 11.314 14.5 8 14.5Z" stroke="#533893" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></label>
        <input
          type="file"
          id="fileInput"
          name="fileInput"
          onChange={handleFileChange}
          style={{display:'none'}}
        />
    </>
  )
}
