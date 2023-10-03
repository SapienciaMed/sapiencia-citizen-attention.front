import { useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Fieldset } from 'primereact/fieldset';
import { Tree, TreeCheckboxSelectionKeys } from "primereact/tree";
import { TreeNode } from "primereact/treenode";

export const AssignProgramComponent = () => {
    const [visible, setVisible] = useState<boolean>(false);
    const [nodes, setNodes] = useState<TreeNode[]>([
        {children:[{data: "Meeting",key: "1-0",label: "cambio de programa y univesidad"},{data: "Meeting",key: "1-1",label: "cambio de programa y univesidad"}],data:'Envent',key:'1',label:'Becas mejores bachilleres'},
        {children:[{data: "Pruebas",key: "2-0",label: "Programa y univesidad"},{data: "Meeting-2",key: "2-1",label: "cambio de programa "}],data:'Envent',key:'2',label:'Mejores bachilleres'},
        {children:[{data: "Pruebas1",key: "3-0",label: "Univesidad"},{data: "Meeting-3",key: "3-1",label: "cambio de programa "}],data:'Envent',key:'3',label:'Bachilleres'}
    ]);
    const [nodesSeleted, setNodesSeleted] = useState<TreeNode[]>([]);
    const [selectedKeys, setSelectedKeys] = useState(null);
    const [selectedProgram, setSelectedProgram] = useState(null);
    
    const addProgram = ()=>{
            const programs = [];
            programs.push(selectedKeys);
            const keyProgram = programs[0]!== null?Object.keys(programs[0]):[]; 

            nodes.filter( (nodos, index )=> {
                
            });
        
   }

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
                                selectionKeys={selectedKeys} 
                                onSelectionChange={(e) => setSelectedKeys(e.value)}
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
                                onClick={addProgram} 
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
                <Button 
                    className="rounded-full !h-10"
                >
                Asignar
                </Button>
            </div>

        </Dialog>
    </>
  )
}
