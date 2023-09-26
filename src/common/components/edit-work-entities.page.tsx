import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import '../../styles/workEntities-styles.scss' 


const EditWorkEntitiesPage = () => {
  return (

    <div className='container'>
      <Card className='card card-body card-h'>
        <Card 
            title='Editar entidad de trabajo'
            className='card'
        >
          <form>

            <Card title='Entidad' className="">
              <div className="flex flex-row flex-wrap ">
                <div>
                  <label>Id Entidad</label><br/>
                  <InputText
                    className="!h-10 input-desabled"
                    disabled
                    />
                </div>

                <span className='split'></span>

                <div>
                  <label>Tipo entidad </label><br/>
                  <InputText
                    className="!h-10 input-desabled"
                    disabled
                    />
                </div>

                <span className='split'></span>

                <div>
                  <label>Nombre entidad</label><br/>
                  <InputText
                    className="!h-10"
                    />
                </div>
              </div>
            </Card>

            <br />

            <Card title='Usuario responsable'>
              <div className="flex flex-row flex-wrap ">
                <div>
                  <label>Id Entidad</label><br/>
                  <InputText
                    className="!h-10 input-desabled"
                    disabled
                    />
                </div>

                <span className='split'></span>

                <div>
                  <label>Id Entidad</label><br/>
                  <InputText
                    className="!h-10 input-desabled"
                    disabled
                    />
                </div>

                <span className='split'></span>

                <div>
                  <label>Id Entidad</label><br/>
                  <InputText
                    className="!h-10 input-desabled"
                    disabled
                    />
                </div>

                <span className='split'></span>

                <div>
                  <label>Id Entidad</label><br/>
                  <InputText
                    className="!h-10 input-desabled"
                    disabled
                    />
                </div>

              </div>

              <div>
                <label>Id Entidad</label><br/>
                <InputText
                  className="!h-10 input-desabled"
                  disabled
                  />
              </div>

            </Card>

          </form>
        </Card>
      </Card>
      <div className="buton-fixe w-full md:w-auto">
            <div className="p-card-body !py-3 md:!py-6 md:!px-10 flex gap-x-7 justify-center md:justify-end max-w-[1200px] mx-auto">
              <Button
                text
                rounded
                severity="secondary"
                className="!px-8 !py-2 !text-base !text-black !border !border-primary"
                label="Cancelar"
  
              />
              <Button
                label="Guardar"
                rounded
                className="!px-8 !py-2 !text-base"

              />
            </div>
          </div>
    </div>
  )
}

export default EditWorkEntitiesPage;
