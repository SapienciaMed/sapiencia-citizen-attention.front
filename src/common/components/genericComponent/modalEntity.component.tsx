import { useEffect, useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext';
import { useWorkEntityService } from '../../hooks/WorkEntityService.hook';
import "../../../styles/workEntities-styles.scss";
import { Card } from 'primereact/card';
import { IEntityAffairsProgram, IWorkEntity } from '../../interfaces/workEntity.interfaces';
import { TreeNode } from 'primereact/treenode';
import { Tree } from 'primereact/tree';
import { Button } from 'primereact/button';
import { EResponseCodes } from '../../constants/api.enum';

interface Props {
    entityId:number;
    show:boolean;
    exitModal: () => void;
}

export const ModalEntityComponent = (prosp:Props) => {

    const workEntityService = useWorkEntityService();
  
    
    const { entityId, show, exitModal } = prosp;

    const [visible, setVisible] = useState<boolean>(false);
    const [value, setValue] = useState<string>('');
    const [checked, setChecked] = useState<boolean>(false);
    const [idEntity, setIdEntity] = useState<string>("");
    const [typeEntity, setTypeEntity] = useState<string>("");
    const [nameEntity, setNameEntity] = useState<string>("");
    const [documenUser, setDocumenUser] = useState<string>("");
    const [nameUser, setNameUser] = useState<string>("");
    const [consta1, setConsta1] = useState<string>("");
    const [consta2, setConsta2] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [userId, setUserId] = useState<number>();
    const [loading, setLoading] = useState(false);
    const [programs, setPrograms] = useState<{
      info: TreeNode[];
      selection: TreeNode[];
    }>({
      info: [],
      selection: [],
    });
    const [hasSelectedPrograms, setHasSelectedPrograms] = useState(false);
    const [assignedAffairsPrograms, setAssignedAffairsPrograms] = useState<IEntityAffairsProgram[]>([]);
    const [assignedProgramsAux, setAssignedProgramsAux] = useState<TreeNode[]>([]);
    const [selectedPrograms, setSelectedPrograms] = useState(null);
    const [fullName, setfullName] = useState<string[]>([]);

 
  



    const getWorkEntity = async (id: number) => {
        const responseUser = await workEntityService.getWorkEntityById(id);
        return responseUser;
      };
    
    useEffect(() => {
        
        if(entityId !== undefined){
            
            getWorkEntity(entityId).then(({ data }) => {

                setIdEntity(data.id.toString());
                setAssignedAffairsPrograms([...data.affairsPrograms]);
                setTypeEntity(data.workEntityType["tet_descripcion"]);
                setNameEntity(data['name']);
                setUserId(data.userId);
                setDocumenUser(data.user["numberDocument"]);
                setNameUser(`${data.user["names"]} ${data.user["lastNames"]}`);
                setfullName([data.user["names"], data.user["lastNames"]]);
                setConsta1(data.user["numberContact1"]);
                setConsta2(data.user["numberContact2"]);
                setEmail(data.user["email"]);
                const status = data["status"] ? true : false;
                setChecked(status);

        });
            
        }
    }, [entityId]);

    useEffect(()=>{
        setVisible(show)
    },[show])

    const nodeTemplate = (node, options) => {
        let label = <span className="!font-sans">{node.label}</span>;
    
        if (node.url) {
          label = (
            <a href={node.url} className="text-primary hover:underline font-semibold">
              {node.label}
            </a>
          );
        }
    
        return <span className={options.className}>{label}</span>;
      };

      useEffect(() => {
        const fetchPrograms = async () => {
          setLoading(true);
          try {
            const response = await workEntityService.getProgramsAffairs();
    
            if (response.operation.code === EResponseCodes.OK) {
              let treePrograms = {
                info: [],
                selection: [],
              };
              let childrens: TreeNode[] = [];
              for await (const program of response.data) {
                ["info", "selection"].forEach((key) => {
                  treePrograms[key] = response.data.map((program) => {
                    let affairs = program.affairs.map((affair) => {
                      return {
                        id: affair.aso_codigo.toString(),
                        key: key + "_" + program.prg_codigo + "_" + affair.aso_codigo,
                        label: affair.aso_asunto,
                        data: affair.affairProgramId,
                      } as TreeNode;
                    });
                    if (key == "selection") {
                      childrens.push(...affairs);
                    }
                    return {
                      id: program.prg_codigo.toString(),
                      key: key + "_" + program.prg_codigo,
                      label: program.prg_descripcion,
                      data: {
                        cod: program.prg_codigo,
                        check: false,
                      },
                      children: affairs,
                    } as TreeNode;
                  });
                });
              }
              let newTree = treePrograms as {
                info: TreeNode[];
                selection: TreeNode[];
              };
              setPrograms(newTree);
              let assignedAffairProgramIds = assignedAffairsPrograms.map(
                (assignedAffairsProgram) => assignedAffairsProgram.affairProgramId
              );
              let newAssignedPrograms = newTree.selection.filter((assignedProgram) => {
                let childIds = assignedProgram.children.map((child) => child.data);
                const contains = assignedAffairProgramIds.some((id) => {
                  return childIds.indexOf(id) !== -1;
                });
                return contains;
              });
    
              newAssignedPrograms.forEach((assignedProgram) => {
                let totalChilds = assignedProgram.children.length;
                assignedProgram.children = assignedProgram.children.filter((child) => {
                  return assignedAffairProgramIds.includes(child.data);
                });
                assignedProgram.data.check = totalChilds == assignedProgram.children.length;
              });
    
              
              setAssignedProgramsAux([...newAssignedPrograms]);
    
              const selection = Object.assign(
                {},
                ...newAssignedPrograms.map((assignedProgram) => {
                  return {
                    [assignedProgram.key]: {
                      checked: assignedProgram.data.check,
                      partialChecked: !assignedProgram.data.check,
                    },
                    ...Object.assign(
                      {},
                      ...assignedProgram.children.map((child) => {
                        return {
                          [child.key]: {
                            checked: true,
                            partialChecked: false,
                          },
                        };
                      })
                    ),
                  };
                })
              );
              
              setSelectedPrograms(selection);
    
              updatePrograms([...{ ...newTree }.selection, ...newAssignedPrograms], selection);
            }
          } catch (error) {
            console.error("Error al obtener la lista de programas:", error);
          } finally {
            setLoading(false);
          }
        };
        fetchPrograms();
      }, [assignedAffairsPrograms]);

      const updatePrograms = (initPrograms, defaultSelectedProgram = null) => {
        defaultSelectedProgram = defaultSelectedProgram ?? selectedPrograms;
        let newSelectionPrograms: TreeNode[] = [];
        initPrograms.forEach((program) => {
          let newChildren: TreeNode[] = [];
          let newProgram = { ...program };
          newProgram.children.forEach((children) => {
            if (
              !defaultSelectedProgram[{ ...children }.key] ||
              (!defaultSelectedProgram[{ ...children }.key].checked &&
                !defaultSelectedProgram[{ ...children }.key].partialChecked)
            ) {
              newChildren.push({ ...children });
            }
          });
    
          newProgram.children = newChildren;
          if (newProgram.children.length) {
            newSelectionPrograms.push(newProgram);
          }
        });
        let newPrograms = { ...programs };
        newPrograms.selection = newSelectionPrograms;
    
        setPrograms(newPrograms);
        setHasSelectedPrograms(false);
      };
 

    const closeIcon = () => (
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1.43383 25C1.22383 25 1.04883 24.93 0.908828 24.79C0.768828 24.6267 0.698828 24.4517 0.698828 24.265C0.698828 24.195 0.710495 24.125 0.733828 24.055C0.757161 23.985 0.780495 23.915 0.803828 23.845L8.53883 12.505L1.32883 1.655C1.25883 1.515 1.22383 1.375 1.22383 1.235C1.22383 1.04833 1.29383 0.884999 1.43383 0.744999C1.57383 0.581665 1.74883 0.499998 1.95883 0.499998H6.26383C6.56716 0.499998 6.8005 0.581665 6.96383 0.744999C7.1505 0.908332 7.2905 1.06 7.38383 1.2L12.0738 8.165L16.7988 1.2C16.8922 1.06 17.0322 0.908332 17.2188 0.744999C17.4055 0.581665 17.6505 0.499998 17.9538 0.499998H22.0488C22.2355 0.499998 22.3988 0.581665 22.5388 0.744999C22.7022 0.884999 22.7838 1.04833 22.7838 1.235C22.7838 1.39833 22.7372 1.53833 22.6438 1.655L15.4338 12.47L23.2038 23.845C23.2505 23.915 23.2738 23.985 23.2738 24.055C23.2972 24.125 23.3088 24.195 23.3088 24.265C23.3088 24.4517 23.2388 24.6267 23.0988 24.79C22.9588 24.93 22.7838 25 22.5738 25H18.1288C17.8255 25 17.5805 24.9183 17.3938 24.755C17.2305 24.5917 17.1022 24.4517 17.0088 24.335L11.8988 16.985L6.82383 24.335C6.75383 24.4517 6.6255 24.5917 6.43883 24.755C6.27549 24.9183 6.0305 25 5.70383 25H1.43383Z"
            fill="#533893"
          />
        </svg>
      );

  return (
    <>
        <Dialog
            visible={visible}
            onHide={exitModal}
            closeIcon={closeIcon}
            header={<h1>Detalle de la Entidad de trabajo</h1>}
        >
            <Card className='card'>
                <div>
                    <div className='flex flex-wrap mb-4'>
                        <div className='mr-4'>
                            <label>Id Entidad</label>
                            <br />
                            <InputText 
                                id="username" 
                                value={idEntity}
                                className='h-10 input-desabled'
                                disabled 
                                onChange={(e) => setValue(e.target.value)} />
                        </div>
                        <div className='mr-4'>
                            <label>Tipo entidad</label>
                            <br />
                            <InputText 
                                id="username" 
                                value={typeEntity}
                                className='h-10 input-desabled'
                                disabled 
                                onChange={(e) => setValue(e.target.value)} />
                        </div>
                        <div className='mr-4'>
                            <label>Nombre entidad</label>
                            <br />
                            <InputText 
                                id="username" 
                                value={nameEntity}
                                className='h-10 input-desabled'
                                disabled 
                                onChange={(e) => setValue(e.target.value)} />
                        </div>
                    </div>
                    <div className='flex flex-wrap mb-4'>
                        <div className='mr-4'>
                            <label>Doc. identidad</label>
                            <br />
                            <InputText 
                                id="username" 
                                value={documenUser}
                                className='h-10 input-desabled'
                                disabled 
                                onChange={(e) => setValue(e.target.value)} />
                        </div>
                        <div className='mr-4'>
                            <label>Nombres y Apellidos</label>
                            <br />
                            <InputText 
                                id="username" 
                                value={nameUser}
                                className='h-10 input-desabled'
                                disabled 
                                onChange={(e) => setValue(e.target.value)} />
                        </div>
                        <div className='mr-4'>
                            <label>Correo electrónico</label>
                            <br />
                            <InputText 
                                id="username" 
                                value={email}
                                className='h-10 input-desabled'
                                disabled 
                                onChange={(e) => setValue(e.target.value)} />
                        </div>
                        <div className='mr-4'>
                            <label>N° contacto 1</label>
                            <br />
                            <InputText 
                                id="username" 
                                value={consta1}
                                className='h-10 input-desabled'
                                disabled 
                                onChange={(e) => setValue(e.target.value)} />
                        </div>
                    </div>
                    <div className='flex flex-wrap'>
                        <div className='mr-4'>
                            <label>N° contacto 2</label>
                            <br />
                            <InputText 
                                id="username" 
                                value={consta2}
                                className='h-10 input-desabled'
                                disabled 
                                onChange={(e) => setValue(e.target.value)} />
                        </div>
                        <div className='mr-4'>
                            <label>Estado</label>
                            <br />
                            <InputText 
                                id="username" 
                                value={checked?'Activo':'Inactivo'}
                                className='h-10 input-desabled'
                                disabled 
                                onChange={(e) => setValue(e.target.value)} />
                        </div>
                    </div>
                </div>
            </Card>
            <Card className='card mt-4'>
            <Tree
                  value={assignedProgramsAux}
                  contentClassName="border-0"
                  collapseIcon={
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M2 2L6 6L10 2"
                        stroke="#533893"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  }
                  expandIcon={
                    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M2 10L6 6L2 2"
                        stroke="#533893"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  }
                  nodeTemplate={nodeTemplate}
                  className="w-full !p-0 !border-0"
                  header={
                    <div className="bg-[#EFEFEF] border-b border-b-[#D9D9D9] text-base py-3 px-5 rubik-medium">
                      Programas y asuntos asignados
                    </div>
                  }
                />
            </Card>

            <div className="mt-4 flex justify-center">
                <Button 
                    className="rounded-full !h-10" 
                    label='Aceptar'
                    onClick={exitModal}
                    >
                    
                </Button>
            </div>
                    
        </Dialog>
    </>
  )
}
