
export const UploadComponent = () => {

  const  handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        // Aquí puedes realizar acciones con el archivo seleccionado, como cargarlo o mostrar su información.
        console.log('Archivo seleccionado:', selectedFile);
      };
  

  return (
    <>
        <label className="upload-label" htmlFor="fileInput">Adjuntar archivos ⊕</label>
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
