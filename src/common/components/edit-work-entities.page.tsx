import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { TreeNode } from "primereact/treenode";
import { classNames } from "primereact/utils";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { EResponseCodes } from "../constants/api.enum";
import { useWorkEntityService } from "../hooks/WorkEntityService.hook";
import { IEntityAffairsProgram, IWorkEntity } from "../interfaces/workEntity.interfaces";
import { ChangeResponsibleComponent } from "./componentsEditWorkEntities/changeResponsible.component";

import { ConfirmDialog, ConfirmDialogOptions, confirmDialog } from "primereact/confirmdialog";
import { Tree } from "primereact/tree";
import "../../styles/workEntities-styles.scss";
import { MessageComponent } from "./componentsEditWorkEntities/message.component";
import { string } from "yup";

interface User {
  email: string;
  name: string;
  numberContact1: string;
  numberDocument: string;
  userId: number;
}

interface Program {
  id: string;
  key: string;
  label: string;
  data: string;
  children: Program[];
}

interface Parent {
  id: string;
  key: string;
  label: string;
  data: string;
  children: Program[];
}

interface ProgramDelete {
  id: string;
  key: string;
  label: string;
  data: string;
  parent: Parent;
}

const EditWorkEntitiesPage = () => {
  const workEntityService = useWorkEntityService();

  const [anchoDePantalla, setAnchoDePantalla] = useState(window.innerWidth);
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
  const [workEntity, setWorkEntity] = useState<IWorkEntity>();
  const [nodes, setNodes] = useState<TreeNode[]>([
    {
      children: [{ data: { name: "backup-1.zip" }, key: "1-0" }],
      data: { name: "Cloud", size: "20kb", type: "Folder" },
      key: "1",
    },
  ]);
  const [cancelar, setCancelar] = useState(false);
  const [cancelarAssign, setCancelarAsdign] = useState(false);
  const [programs, setPrograms] = useState<{
    info: TreeNode[];
    selection: TreeNode[];
  }>({
    info: [],
    selection: [],
  });
  const [hasSelectedPrograms, setHasSelectedPrograms] = useState(false);
  const [hasUnselectedPrograms, setHasUnselectedPrograms] = useState(false);
  const [showAssignPrograms, setShowAssignPrograms] = useState(false);
  const [assignedAffairsPrograms, setAssignedAffairsPrograms] = useState<IEntityAffairsProgram[]>([]);
  const [assignedPrograms, setAssignedPrograms] = useState<TreeNode[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState(null);
  const [unselectedPrograms, setUnselectedPrograms] = useState(null);
  const [fullName, setfullName] = useState<string[]>([]);
  const [msgResponse, setMsgResponse] = useState<string>("");
  const [headerMsg, setHeaderMsg] = useState<string>("");
  const [showMsg, setShowMsg] = useState(false);

  const changedUser = (data: User) => {
    setUserId(data.userId);
    setConsta1(data.numberContact1);
    setEmail(data.email);
    const nameSplit = data["name"].split(" ");
    setfullName(nameSplit);
    setNameUser(data.name);
    setDocumenUser(data.numberDocument);
  };

  const cancelarChanges = () => {
    setCancelar(false);
    navigate(-1);
  };

  const cancelarChangesAssing = () => {
    setCancelarAsdign(false);
    setShowAssignPrograms(false);
  };

  const navigate = useNavigate();

  const WidthRef = useRef(null);
  const dataUser = useRef(null);
  WidthRef.current = document.getElementById("sidebar").offsetWidth;

  const getNameEntite = (name: string) => {
    setNameEntity(name);

    return name;
  };

  const { id } = useParams();

  const getWorkEntity = async (id: string) => {
    const responseUser = await workEntityService.getWorkEntityById(parseInt(id));
    return responseUser;
  };

  useEffect(() => {
    getWorkEntity(id).then(({ data, operation }) => {
      if (operation.code != "OK") {
        navigate(-1);
        return;
      }

      dataUser.current = data;

      setIdEntity(data.id.toString());
      setAssignedAffairsPrograms([...data.affairsPrograms]);

      setTypeEntity(data.workEntityType["tet_descripcion"]);
      //setNameEntity(data['name']);
      setUserId(data.userId);
      getNameEntite(data["name"]);
      setDocumenUser(data.user["numberDocument"]);
      setNameUser(`${data.user["names"]} ${data.user["lastNames"]}`);
      setfullName([data.user["names"], data.user["lastNames"]]);
      setConsta1(data.user["numberContact1"]);
      setConsta2(data.user["numberContact2"]);
      setEmail(data.user["email"]);
      const status = data["status"] ? true : false;
      setChecked(status);
    });
  }, []);

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

          setAssignedPrograms([...newAssignedPrograms]);

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

  useEffect(() => {
    const handleResize = () => {
      setAnchoDePantalla(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const defaultValues = {
    etityName: "Nombre entidad",
  };

  useEffect(() => {
    if (selectedPrograms) {
      const values: any[] = Object.values(selectedPrograms);
      const isChecked = values.map((value) => value.checked || value.partialChecked);
      setHasSelectedPrograms(isChecked.includes(true));
    }
  }, [selectedPrograms]);

  useEffect(() => {
    if (unselectedPrograms) {
      const values: any[] = Object.values(unselectedPrograms);
      const isChecked = values.map((value) => value.checked || value.partialChecked);
      setHasUnselectedPrograms(isChecked.includes(true));
    }
  }, [unselectedPrograms]);

  const {
    formState: { errors, isValid },
    handleSubmit,
    control,
    getValues,
  } = useForm({ defaultValues, mode: "all" });

  const onSubmit = async () => {};

  const onUpdate = async () => {
    const payload: IWorkEntity = {
      userId: userId,
      workEntityTypeId: parseInt(idEntity),
      name: nameEntity,
      id: parseInt(idEntity),
      status: checked,
      user: {
        names: fullName[0],
        lastNames: fullName[1],
        numberDocument: documenUser,
        email: email,
        numberContact1: consta1,
        numberContact2: consta2,
      },
      affairsPrograms: [],
    };

    if (assignedAffairsPrograms.length > 0) {
      payload.affairsPrograms = assignedAffairsPrograms;
    }

    const response = await workEntityService.updateWorkEntity(payload);

    if (response["operation"]["code"] === "OK") {
      setHeaderMsg("¡Cambios guardados!");
      setMsgResponse(response["operation"]["message"]);
      setShowMsg(true);
    } else {
      setHeaderMsg("Error");
      setMsgResponse(response["operation"]["message"]);
      setShowMsg(true);
    }
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? (
      <small className="p-error">{errors[name].message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

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

  const addPrograms = () => {
    let initPrograms = [...{ ...programs }.selection, ...assignedPrograms];
    const programstoAdd = initPrograms?.filter((program) => selectedPrograms.hasOwnProperty({ ...program }.key));
    let newAssignePrograms: TreeNode[] = [];

    [...programstoAdd].forEach((program) => {
      let newChildren: TreeNode[] = [];
      let newProgram = { ...program };
      newProgram.children.forEach((children) => {
        if (
          selectedPrograms[{ ...children }.key] &&
          (selectedPrograms[{ ...children }.key].checked || selectedPrograms[{ ...children }.key].partialChecked)
        ) {
          newChildren.push({ ...children });
        }
      });

      newProgram.children = newChildren;
      const existsIndex = newAssignePrograms.findIndex((newAssigneProgram) => newAssigneProgram.key == newProgram.key);

      if (existsIndex === -1) {
        newAssignePrograms.push(newProgram);
      } else {
        newAssignePrograms[existsIndex].children = [...newChildren, ...newAssignePrograms[existsIndex].children];
      }
      newChildren.forEach((child) => {
        if (unselectedPrograms?.[child.key]) {
          delete unselectedPrograms[child.key];          
        }
      });
      if (unselectedPrograms?.[newProgram.key]) {        
        delete unselectedPrograms[newProgram.key];
      }
    });

    setAssignedPrograms([...newAssignePrograms]);

    updatePrograms(initPrograms);
  };

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

  const removePrograms = () => {
    let initPrograms = [...assignedPrograms];
    // const programstoRemove = initPrograms.filter((program) => unselectedPrograms.hasOwnProperty({ ...program }.key));

    let newUnassignePrograms: TreeNode[] = [];
    let newSelectionPrograms: TreeNode[] = [];

    initPrograms.forEach((program) => {
      let toDeleteChildren: string[] = [];
      let newProgram = { ...program };
      newProgram.children.forEach((children) => {
        if (
          unselectedPrograms[{ ...children }.key] &&
          (unselectedPrograms[{ ...children }.key].checked || unselectedPrograms[{ ...children }.key].partialChecked)
        ) {
          toDeleteChildren.push(children.key.toString());
        }
      });
      newProgram.children = newProgram.children.filter(
        (children) => !toDeleteChildren.includes(children.key.toString())
      );

      const programDelete = findNodesByKeys(initPrograms, toDeleteChildren);

      if (programDelete.length > 0) {
        const parent: Parent = { id: "", key: "", label: "", data: "", children: [] };
        const children: Program[] = [];

        const currentProgram = programs.selection.filter((prog) => prog.id == programDelete[0].parent.id);

        programDelete.forEach((program) => {
          children.push({
            id: program.id,
            key: program.key,
            label: program.label,
            data: program.data,
            children: [],
          });

          if (currentProgram.length != 0 && children.length === programDelete.length) {
            programs.selection.forEach((program, items) => {
              if (program.id === currentProgram[0].id) {
                for (const element of children) {
                  programs.selection[items].children.push(element);
                }
              }
            });
          } else {
            if (parent.children.length === 0) {
              parent.id = program.parent.id;
              parent.key = program.parent.key;
              parent.label = program.parent.label;
              parent.data = program.parent.data;
              parent.children.push({
                id: program.id,
                key: program.key,
                label: program.label,
                data: program.data,
                children: [],
              });
            }
          }
        });

        parent.children = children;
        children.forEach((child) => {
          if (selectedPrograms?.[child.key]) {            
            delete selectedPrograms[child.key];
          }
        });
        if (selectedPrograms?.[parent.key]) {
          delete selectedPrograms[parent.key];
        }
        if (currentProgram.length === 0) {
          programs.selection.push(parent);
        }
      }

      if (newProgram.children.length) {
        newUnassignePrograms.push(newProgram);
      } else {
        newSelectionPrograms.push(program);
      }
    });

    setAssignedPrograms([...newUnassignePrograms]);
    setHasUnselectedPrograms(false);
  };

  const findNodesByKeys = (tree, keys) => {
    const result = [];

    const searchNodes = (nodes, parent) => {
      nodes.forEach((node) => {
        if (keys.includes(node.key)) {
          result.push({ ...node, parent });
        }

        if (node.children) {
          searchNodes(node.children, node);
        }
      });
    };

    searchNodes(tree, null);

    return result;
  };

  const closeIcon = () => (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.43383 25C1.22383 25 1.04883 24.93 0.908828 24.79C0.768828 24.6267 0.698828 24.4517 0.698828 24.265C0.698828 24.195 0.710495 24.125 0.733828 24.055C0.757161 23.985 0.780495 23.915 0.803828 23.845L8.53883 12.505L1.32883 1.655C1.25883 1.515 1.22383 1.375 1.22383 1.235C1.22383 1.04833 1.29383 0.884999 1.43383 0.744999C1.57383 0.581665 1.74883 0.499998 1.95883 0.499998H6.26383C6.56716 0.499998 6.8005 0.581665 6.96383 0.744999C7.1505 0.908332 7.2905 1.06 7.38383 1.2L12.0738 8.165L16.7988 1.2C16.8922 1.06 17.0322 0.908332 17.2188 0.744999C17.4055 0.581665 17.6505 0.499998 17.9538 0.499998H22.0488C22.2355 0.499998 22.3988 0.581665 22.5388 0.744999C22.7022 0.884999 22.7838 1.04833 22.7838 1.235C22.7838 1.39833 22.7372 1.53833 22.6438 1.655L15.4338 12.47L23.2038 23.845C23.2505 23.915 23.2738 23.985 23.2738 24.055C23.2972 24.125 23.3088 24.195 23.3088 24.265C23.3088 24.4517 23.2388 24.6267 23.0988 24.79C22.9588 24.93 22.7838 25 22.5738 25H18.1288C17.8255 25 17.5805 24.9183 17.3938 24.755C17.2305 24.5917 17.1022 24.4517 17.0088 24.335L11.8988 16.985L6.82383 24.335C6.75383 24.4517 6.6255 24.5917 6.43883 24.755C6.27549 24.9183 6.0305 25 5.70383 25H1.43383Z"
        fill="#533893"
      />
    </svg>
  );

  const cancelButtons = (
    options: ConfirmDialogOptions,
    acceptLabel = "Continuar",
    callback = null,
    cancelCallback = null,
    disabledCondition = false
  ) => {
    if (!callback) {
      callback = options.reject();
    }

    return (
      <div className="flex items-center justify-center gap-2 pb-2">
        {cancelarAssign ? (
          <>
            <MessageComponent
              twoBtn={true}
              nameBtn1="Continuar"
              nameBtn2="Cancelar"
              onClickBt2={() => setCancelarAsdign(false)}
              onClickBt1={cancelarChangesAssing}
              headerMsg="Cancelar cambios"
              msg="Desea cancelar la acción, no se guardarán los datos"
            />
          </>
        ) : (
          <></>
        )}

        <Button
          text
          rounded
          severity="secondary"
          className="!py-2 !text-base !font-sans !text-black"
          disabled={loading}
          onClick={() => setCancelarAsdign(true)}
        >
          Cancelar
        </Button>
        <Button
          label={acceptLabel}
          rounded
          className="!px-4 !py-2 !text-base !mr-0 !font-sans"
          disabled={loading || disabledCondition}
          onClick={(e) => {
            callback();
          }}
        />
      </div>
    );
  };

  const assingPrograms = () => {
    setShowAssignPrograms(false);
    confirmDialog({
      id: "messages",
      className: "rounded-2xl",
      headerClassName: "rounded-t-2xl",
      contentClassName: "md:w-[640px] max-w-full mx-auto justify-center",
      message: (
        <div className="flex flex-wrap w-full items-center justify-center">
          <div className="mx-auto text-primary text-2xl md:text-3xl w-full text-center">¡Asignación exitosa!</div>
          <div className="flex items-center justify-center text-center w-full mt-6 pt-0.5">
            Programas asignados exitosamente
          </div>
        </div>
      ),
      closeIcon: closeIcon,
      acceptLabel: "Cerrar",
      footer: (options) => acceptButton(options, "Cerrar"),
    });

    let newAssignedAffairsPrograms: IEntityAffairsProgram[] = [];
    assignedPrograms.forEach((assignedProgram) => {
      assignedProgram.children.forEach((child) => {
        newAssignedAffairsPrograms.push({ affairProgramId: child.data });
      });
    });
    setAssignedAffairsPrograms([...newAssignedAffairsPrograms]);
  };

  const acceptButton = (options, label = "Aceptar") => {
    return (
      <div className="flex items-center justify-center gap-2 pb-2">
        <Button
          label={label}
          rounded
          className="!px-4 !py-2 !text-base !mr-0 !font-sans"
          disabled={loading}
          onClick={(e) => {
            options.accept();
          }}
        />
      </div>
    );
  };

  return (
    <div className="container">
      <ConfirmDialog id="messages"></ConfirmDialog>
      <ConfirmDialog
        id="assingProgramsModal"
        className="rounded-2xl"
        headerClassName="rounded-t-2xl"
        header={
          <div className="text-2xl w-full lg:hidden block">
            Asignación de Programas
            <br />
            y/o asuntos de solicitudes
          </div>
        }
        closeIcon={closeIcon}
        contentClassName="w-full max-w-full lg:!pt-0 !px-0 justify-center"
        visible={showAssignPrograms}
        acceptLabel="Aceptar"
        footer={(options) =>
          cancelButtons(
            options,
            "Asignar",
            () => {
              assingPrograms();
            },
            null,
            !assignedPrograms.length
          )
        }
        message={
          <div className="grid grid-cols-1 max-h-[calc(100vh-19rem)] overflow-y-auto px-6">
            <div className="mx-auto text-3xl w-full text-left col-span-full hidden lg:block">
              Asignación de Programas y/o asuntos de solicitudes
            </div>
            <div className="p-card  shadow-none lg:border rounded-2xl lg:p-8 border-[#D9D9D9] grid lg:grid-cols-5 grid-cols-1 gap-7 text-center w-full mt-6">
              <div className="max-h-[450px] border-b !border-[#D9D9D9] lg:rounded-md rounded-2xl overflow-y-auto relative citizen-attention sticky-header lg:col-span-2">
                <Tree
                  id="selection-programs"
                  key="selection-programs"
                  value={programs.selection}
                  contentClassName="border-0"
                  // onSelect={onSelect}
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
                  selectionMode="checkbox"
                  selectionKeys={selectedPrograms}
                  onSelectionChange={(e) => setSelectedPrograms(e.value)}
                  className="w-full !p-0 text-left !border-[#D9D9D9] lg:!rounded-md !rounded-2xl sticky-header"
                  header={
                    <div className="text-base rubik-medium flex items-center justify-center">
                      <span className="bg-[#EFEFEF] py-3 px-6 rounded-md hidden lg:inline-block">
                        Programas y asuntos disponibles
                      </span>
                      <span className="bg-[#EFEFEF] py-3 px-6 rounded-md lg:hidden inline-block">
                        Programas
                        <br />y asuntos disponibles
                      </span>
                    </div>
                  }
                />
              </div>
              <div className="m-auto sticky bottom-1/4 w-fit grid lg:grid-cols-1 grid-cols-2 col-span-1 gap-y-4 gap-x-6">
                <Button
                  label="Agregar"
                  rounded
                  className="!px-4 !py-2 !text-base !font-sans max-w-[120px]"
                  type="submit"
                  onClick={addPrograms}
                  disabled={!hasSelectedPrograms}
                />
                <Button
                  label="Quitar"
                  rounded
                  className="!px-4 !py-2 !text-base !font-sans max-w-[120px]"
                  type="submit"
                  onClick={removePrograms}
                  disabled={!hasUnselectedPrograms}
                />
              </div>
              <div className="max-h-[450px] border-b !border-[#D9D9D9] lg:rounded-md rounded-2xl overflow-y-auto relative citizen-attention sticky-header lg:col-span-2">
                <Tree
                  id="selected-programs"
                  key="selected-programs"
                  value={assignedPrograms}
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
                  selectionMode="checkbox"
                  selectionKeys={unselectedPrograms}
                  onSelectionChange={(e) => {
                    setUnselectedPrograms(e.value);
                  }}
                  className="w-full !p-0 text-left !border-[#D9D9D9] lg:!rounded-md !rounded-2xl sticky-header"
                  header={
                    <div className="text-base rubik-medium flex items-center justify-center text-center">
                      <span className="bg-[#EFEFEF] py-3 px-6 rounded-md hidden lg:inline-block">
                        Programas y asuntos seleccionados
                      </span>
                      <span className="bg-[#EFEFEF] py-3 px-6 rounded-md lg:hidden inline-block">
                        Programas
                        <br />y asuntos seleccionados
                      </span>
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        }
      ></ConfirmDialog>
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <Card className="card card-body">
          <Card title="Editar entidad de trabajo" className="card card-container-movil">
            <Card title="Entidad" className="card card-movil">
              <div className="flex flex-row flex-wrap ">
                <div className="col-100 idEntity">
                  <div className="col-50">
                    <label>Id Entidad</label>
                    <br />
                    <InputText
                      value={idEntity}
                      className="h-10 input-desabled col-100"
                      disabled
                      onChange={(e) => setIdEntity(e.target.value)}
                    />
                  </div>
                </div>

                <span className="split"></span>

                <div className="col-100">
                  <label>Tipo entidad </label>
                  <br />
                  <InputText
                    value={typeEntity}
                    className="h-10 input-desabled col-100"
                    disabled
                    onChange={(e) => setTypeEntity(e.target.value)}
                  />
                </div>

                <span className="split"></span>
                <div className="col-100">
                  <label>
                    Nombre entidad<span style={{ color: "red" }}>*</span>
                  </label>
                  <br />
                  <Controller
                    name="etityName"
                    control={control}
                    rules={{
                      required: "Campo obligatorio.",
                      maxLength: { value: 100, message: "Solo se permiten 100 caracteres" },
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <InputText
                          id={field.name}
                          value={nameEntity}
                          className={classNames({ "p-invalid": fieldState.error }, "!h-10 col-100")}
                          onChange={(e) => field.onChange(getNameEntite(e.target.value))}
                        />
                        <br />
                        {getFormErrorMessage(field.name)}
                      </>
                    )}
                  />
                </div>
              </div>
            </Card>

            <br />

            <Card title="Usuario responsable" className="card card-movil">
              <div className="flex flex-row flex-wrap ">
                <div className="col-100">
                  <label>Doc. Identidad</label>
                  <br />
                  <InputText
                    value={documenUser}
                    className="h-10 input-desabled col-100"
                    disabled
                    onChange={(e) => setDocumenUser(e.target.value)}
                  />
                </div>

                <span className="split"></span>

                <div className="col-100">
                  <label>Nombres y apellidos</label>
                  <br />
                  <InputText
                    value={nameUser}
                    className="h-10 input-desabled col-100"
                    disabled
                    onChange={(e) => setNameUser(e.target.value)}
                  />
                </div>

                <span className="split"></span>

                <div className="col-100">
                  <label>No. Contacto 1</label>
                  <br />
                  <InputText
                    value={consta1}
                    className="h-10 input-desabled col-100"
                    disabled
                    onChange={(e) => setConsta1(e.target.value)}
                  />
                </div>

                <span className="split"></span>

                <div className="col-100">
                  <label>No. Contacto 2</label>
                  <br />
                  <InputText
                    value={consta2}
                    className="h-10 input-desabled col-100"
                    disabled
                    onChange={(e) => setConsta2(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-center mt-4 ">
                <div className="flex flex-row items-center movil-2 col-100">
                  <div className="col-100">
                    <label>Correo electrónico</label>
                    <br />
                    <InputText
                      value={email}
                      className="h-10 input-desabled col-100"
                      disabled
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <span className="split"></span>

                  <div className="flex flex-col ml-3 movil-3 col-100">
                    <label>Estado</label>
                    <div className="flex flex-row mt-3 movil-4">
                      <span className="mr-4">Inactivo</span>
                      <InputSwitch checked={checked} onChange={(e: InputSwitchChangeEvent) => setChecked(e.value)} />
                      <span className="ml-4">Activo</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "22px" }} className="bt-movil-1 col-100">
                  <ChangeResponsibleComponent dataUser={(e: User) => changedUser(e)} />
                </div>
              </div>
            </Card>

            <Card className="card card-movil mt-6">
              <div className="max-h-96 overflow-y-auto relative citizen-attention">
                <Tree
                  value={assignedPrograms}
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
                      Resumen programas y asuntos seleccionados
                    </div>
                  }
                />
                <div className="sticky bottom-0 pr-0 pt-9 pb-2.5 bg-white border-t border-t-[#D9D9D9] flex justify-end ">
                  <Button
                    label="Asignar programas"
                    rounded
                    className="!px-8 !py-2 !text-base !font-sans"
                    onClick={() => setShowAssignPrograms(!showAssignPrograms)}
                    disabled={loading}
                  />
                </div>
              </div>
            </Card>
          </Card>
        </Card>

        {cancelar ? (
          <>
            <MessageComponent
              twoBtn={true}
              nameBtn1="Continuar"
              nameBtn2="Cancelar"
              onClickBt2={cancelarChanges}
              onClickBt1={() => setCancelar(false)}
              headerMsg="Cancelar cambios"
              msg="Desea cancelar la acción, no se guardarán los datos"
            />
          </>
        ) : (
          <></>
        )}

        {showMsg ? (
          <>
            <MessageComponent
              twoBtn={false}
              nameBtn1="Cancelar"
              onClickBt1={() => setShowMsg(false)}
              headerMsg={headerMsg}
              msg={msgResponse}
            />
          </>
        ) : (
          <></>
        )}
        <div className="buton-fixe " style={{ width: anchoDePantalla - WidthRef.current }}>
          <div className="">
            <Button
              text
              rounded
              onClick={() => setCancelar(true)}
              severity="secondary"
              className="!px-8 !py-2 !text-base !text-black mr-4 !h-10"
              label="Cancelar"
            />
            <Button className="rounded-full !h-10" onClick={onUpdate} disabled={nameEntity ? false : true}>
              Guardar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditWorkEntitiesPage;
