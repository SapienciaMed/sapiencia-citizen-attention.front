import { useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Fieldset } from 'primereact/fieldset';
import { Tree } from "primereact/tree";
import { TreeNode } from "primereact/treenode";

export const AssignProgramComponent = () => {
    const [visible, setVisible] = useState<boolean>(false);
    const [nodes, setNodes] = useState<TreeNode[]>([{children:[{data: "Meeting",key: "1-0",label: "cambio de programa y univesidad"},{data: "Meeting",key: "1-1",label: "cambio de programa y univesidad"}],data:'Envent',key:'1',label:'Becas mejores bachilleres'}]);
    const [nodesSeleted, setNodesSeleted] = useState<TreeNode[]>([]);
    const [selectedKeysProgram, setSelectedKeysProgram] = useState(null);
    const [selectedProgram, setSelectedProgram] = useState(null);

    console.log(nodes)

  return (
    <>
        <Button 
            className="rounded-full !h-10 mt-10"
            onClick={() => setVisible(true)} 
        > 
            Asignar programas 
        </Button>

        <Dialog
            header="Asignación de Programas y/o asuntos de solicitudes"
            headerClassName="text-2xl" 
            visible={visible}
            style={{ width: '85vw' }} 
            onHide={() => setVisible(false)}
            className="dialog-movil" 
        >
            <Card className="card col-card-100">
                <div className="col-card-100 container-fieldset">

                    <div className="col-45">
                        <Fieldset 
                            legend="Programas y asuntos disponibles" 
                            pt={{legend:{style:{marginLeft:'20px'}}}} 
                        >
                            <Tree 
                                value={nodes} 
                                selectionMode="checkbox" 
                                selectionKeys={selectedKeysProgram} 
                                onSelectionChange={(e) => setSelectedKeysProgram(e.value)}
                                filterMode='lenient' 
                                className="w-full md:w-30rem"
                                style={{border:0, padding:0}} 
                            />
                        </Fieldset>
                    </div>
                    <div className="col-10 btn-fieldset">
                        <div>
                            <Button 
                                className="rounded-full !h-10 mt-10"
                                onClick={() => setVisible(true)} 
                            > 
                                Agregar 
                            </Button>
                        </div>
                        <div>
                        <Button
                                text
                                className="rounded-full !text-base !text-black !h-10 mt-4"
                                >Quitar</Button>
                        </div>
                    </div>
                    <div className="col-45">
                        <Fieldset 
                            legend="Programas y asuntos seleccionados"
                            pt={{legend:{style:{marginLeft:'20px'}}}}
                        >
                            <Tree 
                                value={nodesSeleted} 
                                selectionMode="checkbox" 
                                selectionKeys={selectedProgram} 
                                onSelectionChange={(e) => setSelectedProgram(e.value)} 
                                className="w-full md:w-30rem"
                                style={{border:0, padding:0}}  
                            />
                        </Fieldset>
                    </div>

                </div>
            </Card>

            <div className="flex justify-center mt-8">
                <Button
                    text
                    className="!px-8 rounded-full !py-2 !text-base !text-black mr-4 !h-10"
                >
                    Cancelar
                </Button>
                <Button className="rounded-full !h-10">Cambiar</Button>
            </div>

        </Dialog>
    </>
  )
}
