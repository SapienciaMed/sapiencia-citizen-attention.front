import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmDialog, ConfirmDialogOptions, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { EResponseCodes } from "../constants/api.enum";
import { useWorkEntityService } from "../hooks/WorkEntityService.hook";
import { IEntityAffairsProgram, IWorkEntity } from "../interfaces/workEntity.interfaces";

import { Dropdown } from "primereact/dropdown";
import { Tree } from "primereact/tree";
import { TreeNode } from "primereact/treenode";
import { IUser } from "../interfaces/user.interfaces";
import { IWorkEntityType } from "../interfaces/workEntityType.interface";

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

function CreateWorkEntitiesPage(): React.JSX.Element {
  const parentForm = useRef(null);
  const createEntityForm = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
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
  const [assignedPrograms, setAssignedPrograms] = useState<TreeNode[]>([]);
  const [assignedProgramsAux, setAssignedProgramsAux] = useState<TreeNode[]>([]);
  const [assignedAffairsPrograms, setAssignedAffairsPrograms] = useState<IEntityAffairsProgram[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState(null);
  const [unselectedPrograms, setUnselectedPrograms] = useState(null);
  const [data, setData] = useState<IWorkEntity[]>([]);
  const [workEntityTypes, setWorkEntityTypes] = useState<IWorkEntityType[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [buttonWidth, setButtonWidth] = useState({
    width: 0,
    left: 0,
  });

  const workEntityService = useWorkEntityService();

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    getValues,
    reset,
  } = useForm({ mode: "all" });

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
        <Button
          text
          rounded
          severity="secondary"
          className="!py-2 !text-base !font-sans !text-black"
          disabled={loading}
          onClick={(e) => {
            options.accept();
            if (cancelCallback) {
              cancelCallback();
            }
          }}
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

  const onSearch = async () => {
    setLoading(true);
    try {
      let payload = getValues() as { identification: number };
      const response = await workEntityService.getUserByDocument(payload?.identification);

      if (response.operation.code === EResponseCodes.OK) {
        setData([response.data]);
        setShowTable(true);
      } else {
        setShowTable(false);
        setData([]);
        confirmDialog({
          id: "messages",
          className: "!rounded-2xl overflow-hidden",
          headerClassName: "!rounded-t-2xl",
          contentClassName: "md:w-[640px] max-w-full mx-auto justify-center",
          message: (
            <div className="flex flex-wrap w-full items-center justify-center">
              <div className="mx-auto text-primary text-3xl w-full text-center">Lo sentimos</div>
              <div className="flex items-center justify-center text-center w-full mt-6 pt-0.5">
                {response.operation.message}
              </div>
            </div>
          ),
          closeIcon: closeIcon,
          acceptLabel: "Aceptar",
          footer: (options) => acceptButton(options),
        });
      }
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSave = async () => {
    setLoading(true);
    try {
      let payload = getValues() as IWorkEntity;
      payload.userId = selectedUser;
      payload.affairsPrograms = assignedAffairsPrograms;
      const response = await workEntityService.createWorkEntity(payload);

      if (response.operation.code === EResponseCodes.OK) {
        resetForm();
        confirmDialog({
          id: "messages",
          className: "!rounded-2xl overflow-hidden",
          headerClassName: "!rounded-t-2xl",
          contentClassName: "md:w-[640px] max-w-full mx-auto justify-center",
          message: (
            <div className="flex flex-wrap w-full items-center justify-center">
              <div className="mx-auto text-primary text-2xl md:text-3xl w-full text-center">¡Cambios guardados!</div>
              <div className="flex items-center justify-center text-center w-full mt-6 pt-0.5">¡Creación exitosa!</div>
            </div>
          ),
          closeIcon: closeIcon,
          acceptLabel: "Cerrar",
          footer: (options) => acceptButton(options, "Cerrar"),
        });
      } else {
        confirmDialog({
          id: "messages",
          className: "!rounded-2xl overflow-hidden",
          headerClassName: "!rounded-t-2xl",
          contentClassName: "md:w-[640px] max-w-full mx-auto justify-center",
          message: (
            <div className="flex flex-wrap w-full items-center justify-center">
              <div className="mx-auto text-primary text-3xl w-full text-center">Lo sentimos</div>
              <div className="flex items-center justify-center text-center w-full mt-6 pt-0.5">
                {response.operation.message}
              </div>
            </div>
          ),
          closeIcon: closeIcon,
          acceptLabel: "Aceptar",
          footer: (options) => acceptButton(options),
        });
      }
    } catch (error) {
      console.error("Error al crear Entidad:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResize = () => {
    if (parentForm.current?.offsetWidth) {
      let style = getComputedStyle(parentForm.current);
      let domReact = parentForm.current.getBoundingClientRect();

      setButtonWidth({
        width: parentForm?.current.offsetWidth + parseInt(style.marginLeft) + parseInt(style.marginRight),
        left: domReact.x - parseInt(style.marginLeft),
      });
    }
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

  useEffect(() => {
    const fetchWorkEntityTypes = async () => {
      setLoading(true);
      try {
        const response = await workEntityService.getWorkEntityTypes();

        if (response.operation.code === EResponseCodes.OK) {
          setWorkEntityTypes(response.data);
        }
      } catch (error) {
        console.error("Error al obtener la lista de tipos de entidades:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPrograms = async () => {
      setLoading(true);
      try {
        const response = await workEntityService.getProgramsAffairs();

        if (response.operation.code === EResponseCodes.OK) {
          let treePrograms = {
            info: [],
            selection: [],
          };
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
              return {
                id: program.prg_codigo.toString(),
                key: key + "_" + program.prg_codigo,
                label: program.prg_descripcion,
                data: program.prg_codigo,
                children: affairs,
              } as TreeNode;
            });
          });
          setPrograms(treePrograms);
        }
      } catch (error) {
        console.error("Error al obtener la lista de programas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkEntityTypes();
    fetchPrograms();
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const resetForm = () => {
    reset({ identification: "" }, { keepValues: false, keepErrors: false });
    setData([]);
    setShowTable(false);
    setSelectedUser(null);
  };

  const cancel = () => {
    confirmDialog({
      id: "messages",
      className: "!rounded-2xl overflow-hidden",
      headerClassName: "!rounded-t-2xl",
      contentClassName: "md:w-[640px] max-w-full mx-auto justify-center",
      message: (
        <div className="flex flex-wrap w-full items-center justify-center mx-auto">
          <div className="mx-auto text-primary text-2xl md:text-3xl w-full text-center">Cancelar acción</div>
          <div className="flex items-center justify-center text-center w-full mt-6 pt-0.5">
            ¿Desea cancelar la acción?,
            <br />
            no se guardarán los datos
          </div>
        </div>
      ),
      closeIcon: closeIcon,
      acceptLabel: "Cerrar",
      footer: (options) =>
        cancelButtons(
          options,
          "Continuar",
          () => {
            options.accept();
          },
          () => {
            resetForm();
            navigate(-1);
          }
        ),
    });
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? <small className="p-error">{errors[name].message}</small> : "";
  };

  const columns = () => {
    return [
      {
        name: "Doc. identidad",
        key: "numberDocument",
        body: (rowData: IUser) => {
          return rowData?.typeDocument + " " + rowData?.numberDocument;
        },
      },
      {
        name: "Nombres y Apellidos",
        key: "name",
        body: (rowData: IUser) => {
          return rowData?.names + " " + rowData?.lastNames;
        },
      },
      {
        name: "Correo electrónico",
        key: "email",
        field: "email",
      },
      {
        name: "N° contacto 1",
        key: "numberContact1",
        field: "numberContact1",
      },
      {
        name: "N° contacto 2",
        key: "numberContact2",
        field: "numberContact2",
      },
      {
        name: "Seleccionar",
        key: "name",
        body: (rowData: IUser) => {
          return radioUser(rowData);
        },
      },
    ];
  };

  const radioUser = (rowData: IUser) => {
    return (
      <RadioButton
        className="radio-sm"
        inputId={"selectedUser" + rowData?.id}
        name="selectedUser"
        value={rowData?.id}
        onChange={(e) => setSelectedUser(e.value)}
        checked={selectedUser === rowData?.id}
      />
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

    let newSelectionPrograms: TreeNode[] = [];
    initPrograms.forEach((program) => {
      let newChildren: TreeNode[] = [];
      let newProgram = { ...program };
      newProgram.children.forEach((children) => {
        if (
          !selectedPrograms[{ ...children }.key] ||
          (!selectedPrograms[{ ...children }.key].checked && !selectedPrograms[{ ...children }.key].partialChecked)
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

  const assingPrograms = () => {
    setShowAssignPrograms(false);
    confirmDialog({
      id: "messages",
      className: "!rounded-2xl overflow-hidden",
      headerClassName: "!rounded-t-2xl",
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
    setAssignedProgramsAux(assignedPrograms);
  };
  
  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto" ref={parentForm}>
      <ConfirmDialog id="messages"></ConfirmDialog>
      <ConfirmDialog
        id="assingProgramsModal"
        className="!rounded-2xl overflow-hidden"
        headerClassName="!rounded-t-2xl"
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
      <span className="text-3xl block md:hidden pb-5">Crear Entidad de trabajo</span>
      <div className="p-card rounded-2xl md:rounded-4xl shadow-none border border-[#D9D9D9]">
        <div className="p-card-body !py-6 !px-6 md:!px-11">
          <div className="p-card-title flex justify-end md:justify-between">
            <span className="text-3xl md:block hidden">Crear Entidad de trabajo</span>
          </div>
          <div className="p-card-content !pb-0 !pt-0 md:!pt-10">
            <form onSubmit={handleSubmit(onSearch)} className="flex flex-wrap gap-6 w-full">
              <Controller
                name="identification"
                control={control}
                rules={{
                  required: "Campo obligatorio.",
                  maxLength: { value: 15, message: "No debe tener más de 15 caracteres." },
                }}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-y-1.5 md:max-w-[16rem] w-full">
                    <label htmlFor={field.name} className="text-base">
                      Número de identificación <span className="text-red-600">*</span>
                    </label>
                    <InputText
                      keyfilter="int"
                      id={field.name}
                      value={field.value}
                      inputMode="tel"
                      className={classNames({ "p-invalid": fieldState.error }, "w-full py-2 !font-sans")}
                      onChange={(e) => field.onChange(e.target.value)}
                      maxLength={15}
                    />
                    {getFormErrorMessage(field.name)}
                  </div>
                )}
              />
              <div className="md:mt-8 flex w-full md:w-auto gap-x-3 justify-end ml-auto">
                <div>
                  <Button
                    text
                    rounded
                    type="button"
                    severity="secondary"
                    className="!py-2 !text-base !font-sans !text-black"
                    disabled={loading}
                    onClick={() => resetForm()}
                  >
                    Limpiar campos
                  </Button>
                </div>
                <div>
                  <Button
                    label="Buscar"
                    rounded
                    className="!px-4 !py-2 !text-base !font-sans"
                    type="submit"
                    // onClick={save}
                    disabled={!isValid || loading}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showTable && (
        <div className="relative pb-16 md:pb-28 z-0">
          <div className="relative p-card rounded-2xl md:rounded-4xl mt-6 shadow-none border border-[#D9D9D9]">
            <div className="p-card-body !py-6 !px-6 md:!px-11">
              <div className="p-card-title justify-between flex">
                <span className="text-xl md:text-3xl">Resultados de búsqueda</span>
                <span></span>
              </div>
              <div className="p-card-content !pb-0 !pt-0 md:!pt-10">
                <div className="overflow-hidden  mx-auto max-w-[calc(100vw-4.6rem)] sm:max-w-[calc(100vw-10.1rem)] lg:max-w-[calc(100vw-27.75rem)] hidden md:block borderless reverse-striped">
                  <DataTable
                    value={data}
                    showGridlines={false}
                    stripedRows={true}
                    emptyMessage={<span className="!font-sans">No se encontraron resultados</span>}
                    tableStyle={{ minWidth: "22.625rem", marginBottom: "6.063rem" }}
                  >
                    {columns().map((column) => {
                      return (
                        <Column
                          bodyClassName="text-base !font-sans !text-center min-w-[207px] w-[207px]"
                          headerClassName="text-base font-medium !text-black !text-center min-w-[207px] w-[207px] justify-center"
                          key={column.key}
                          header={column.name}
                          field={column?.field}
                          body={column?.body}
                        ></Column>
                      );
                    })}
                  </DataTable>
                </div>
                <div className="p-5 p-card md:hidden block relative rounded-2xl md:rounded-4xl mt-6 shadow-none border border-[#D9D9D9]">
                  <div className="pb-5">
                    {columns().map((column, index) => {
                      return (
                        <div className="flex flex-wrap items-start justify-between" key={column.key}>
                          <div className={classNames("w-1/2 text-sm", { "mt-4": index > 0 })}>{column.name}</div>
                          <div className={classNames("w-1/2 text-sm !font-sans text-right", { "mt-4": index > 0 })}>
                            {column.hasOwnProperty("body") ? column?.body(data[0]) : data[0]?.[column?.key]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {selectedUser && (
            <div className="relative p-card rounded-2xl md:rounded-4xl mt-6 shadow-none border border-[#D9D9D9]">
              <div className="p-card-body !py-6 !px-6 md:!px-11">
                <div className="p-card-title justify-between flex">
                  <span className="text-xl md:text-3xl">Entidad</span>
                  <span></span>
                </div>
                <div className="p-card-content !pb-0 !pt-0 md:!pt-10">
                  <form onSubmit={handleSubmit(onSave)} className="flex flex-wrap gap-6 w-full" ref={createEntityForm}>
                    <Controller
                      name="workEntityTypeId"
                      control={control}
                      rules={{
                        required: "Campo obligatorio.",
                      }}
                      render={({ field, fieldState }) => (
                        <div className="flex flex-col gap-y-1.5 md:max-w-2xs w-full">
                          <label htmlFor={field.name} className="text-base">
                            Tipo entidad <span className="text-red-600">*</span>
                          </label>
                          <Dropdown
                            id={field.name}
                            value={field.value}
                            className={classNames({ "p-invalid": fieldState.error }, "w-full !font-sans select-sm")}
                            optionLabel="tet_descripcion"
                            options={[{ tet_descripcion: "Seleccionar", ted_codigo: "" }, ...workEntityTypes]}
                            optionValue="tet_codigo"
                            onChange={(e) => field.onChange(e.value)}
                            placeholder="Seleccionar"
                          />

                          {getFormErrorMessage(field.name)}
                        </div>
                      )}
                    />
                    <Controller
                      name="name"
                      control={control}
                      rules={{
                        required: "Campo obligatorio.",
                        maxLength: { value: 100, message: "No debe tener más de 100 caracteres." },
                      }}
                      render={({ field, fieldState }) => (
                        <div className="flex flex-col gap-y-1.5 md:max-w-[16rem] w-full">
                          <label htmlFor={field.name} className="text-base">
                            Nombre entidad <span className="text-red-600">*</span>
                          </label>
                          <InputText
                            id={field.name}
                            value={field.value}
                            inputMode="text"
                            className={classNames({ "p-invalid": fieldState.error }, "w-full py-2 !font-sans")}
                            onChange={(e) => field.onChange(e.target.value)}
                            maxLength={100}
                          />
                          {getFormErrorMessage(field.name)}
                        </div>
                      )}
                    />
                    <div
                      className="fixed z-30 p-card rounded-none shadow-none border-t border-[#D9D9D9] w-full top-[calc(100vh-65px)] md:top-[calc(100vh-91px)]"
                      style={{ width: buttonWidth.width, left: buttonWidth.left }}
                    >
                      <div className="p-card-body !py-3 md:!py-6 md:!px-10 flex gap-x-6 justify-center md:justify-end max-w-[1200px] mx-auto">
                        <Button
                          text
                          rounded
                          type="button"
                          severity="secondary"
                          className="!py-2 !text-base !font-sans !text-black"
                          disabled={loading}
                          onClick={() => cancel()}
                        >
                          Cancelar
                        </Button>
                        <Button
                          label="Guardar"
                          rounded
                          className="!px-4 !py-2 !text-base !font-sans"
                          type="submit"
                          disabled={!isValid || loading}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
          {selectedUser && (
            <div className="relative p-card rounded-2xl md:rounded-4xl mt-6 shadow-none border border-[#D9D9D9]">
              <div className="p-card-body !py-6 !px-6 md:!px-11">
                <div className="p-card-content !pb-0 !pt-0">
                  <div className="max-h-96 overflow-y-auto relative citizen-attention">
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
                          Resumen programas y asuntos seleccionados
                        </div>
                      }
                    />
                    <div className="sticky bottom-0 pr-3 pt-9 pb-2.5 bg-white border-t border-t-[#D9D9D9] flex justify-end ">
                      <Button
                        label="Asignar programas"
                        rounded
                        className="!px-8 !py-2 !text-base !font-sans"
                        onClick={() => setShowAssignPrograms(!showAssignPrograms)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {!selectedUser && (
        <div
          className="fixed z-30 p-card rounded-none shadow-none border-t border-[#D9D9D9] w-full top-[calc(100vh-65px)] md:top-[calc(100vh-91px)]"
          style={{ width: buttonWidth.width, left: buttonWidth.left }}
        >
          <div className="p-card-body !py-3 md:!py-6 md:!px-10 flex gap-x-7 justify-center md:justify-start max-w-[1200px] mx-auto">
            <Button
              label="Regresar"
              rounded
              className="!px-8 !py-2 !text-base !font-sans"
              onClick={() => {
                navigate(-1);
              }}
              disabled={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateWorkEntitiesPage;
