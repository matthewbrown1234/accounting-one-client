import {Button, Typography} from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridToolbarContainer
} from "@mui/x-data-grid";
import {useEffect, useState} from "react";
import {Account, ApiValidationError, Pageable} from "../types";
import {
  createAccount,
  deleteAccount,
  fetchAccounts,
  updateAccount,
  withLoading
} from "../integration/Api.ts";
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import {GridRowParams} from "@mui/x-data-grid/models/params/gridRowParams";

export default function Accounts() {
  const [isFetching, setIsFetching] = useState(false);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [pageableAccounts, setPageableAccounts] = useState<Pageable<Account> | undefined>(undefined);
  const accounts = pageableAccounts?.content ?? [];
  const newRowExists = accounts.some((account) => account.id === "NEW");

  const onLoad = async () => {
    const pageableAccount = await withLoading({
      setIsFetching,
      fn: fetchAccounts
    })();
    setPageableAccounts(pageableAccount)
  }

  const handleDeleteAccount = async (id: number | "NEW") => {
    try {
      if (id !== "NEW") {
        await deleteAccount(id)
      }
      setPageableAccounts(prev => (prev && {
        ...prev,
        content: prev.content
        .filter((account) => account.id !== id),
        page: {
          ...prev.page,
          totalElements: prev.page.totalElements - 1
        }
      }));
    }
    catch (error) {
      if (error instanceof ApiValidationError) {
        alert("Validation Error: " + JSON.stringify(error.error.fields));
      } else {
        alert("Failed to delete account");
      }
    }
  }
  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.Edit}});
  };
  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.View}});
  };
  const handleCancelClick = (params: GridRowParams<Account>) => () => {
    const {id, row} = params
    setRowModesModel({
      ...rowModesModel,
      [id]: {mode: GridRowModes.View, ignoreModifications: true},
    });
    if (row.id === "NEW") {
      setPageableAccounts(prev => (prev && {
        ...prev,
        content: prev.content.filter((account) => account.id !== "NEW"),
        page: {
          ...prev.page,
          totalElements: prev.page.totalElements - 1
        }
      }));
    }
  };

  const handleCreateRow = () => {
    setPageableAccounts(prev => (prev && {
      ...prev,
      content: [
        ...prev.content,
        {
          id: "NEW",
          accountId: "",
          accountName: "",
          accountType: "",
        }
      ],
      page: {
        ...prev.page,
        totalElements: prev.page.totalElements + 1
      }
    }));
    setRowModesModel({...rowModesModel, ["NEW"]: {mode: GridRowModes.Edit, fieldToFocus: "accountName"}});
  }

  useEffect(() => {
    onLoad()
  }, []);


  const columns: GridColDef<(Account)>[] = [
    {
      field: 'id', headerName: 'ID'
    },
    {
      field: 'accountName',
      headerName: 'Account Name',
      type: "string",
      editable: true,
      width: 200,
      description: 'The Name of the Account',
    },
    {
      field: 'accountId',
      headerName: 'Account ID',
      type: "string",
      editable: true,
      width: 250,
      description: 'The Account Identifier'
    },
    {
      field: 'accountType',
      headerName: 'Account Type',
      type: "string",
      editable: true,
      width: 200,
      description: 'The Type of the Account',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 80,
      align: "center",
      disableReorder: true,
      disableColumnMenu: true,
      editable: false,
      getActions: (params) => {
        const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
                icon={<SaveIcon/>}
                label="Save"
                sx={{
                  color: 'primary.main',
                }}
                onClick={handleSaveClick(params.id)}
            />,
            <GridActionsCellItem
                icon={<CancelIcon/>}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(params)}
                color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
              icon={<EditIcon/>}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(params.id)}
              color="inherit"
          />,
          <GridActionsCellItem
              icon={<DeleteIcon/>}
              label="Delete"
              onClick={async () => {
                await handleDeleteAccount(params.row.id);
              }}
              color="inherit"
          />,
        ];
      }
    },
  ];


  return (
      <div>
        <Typography fontSize={"x-large"} component={"h5"} style={{
          paddingTop: "5px",
          paddingBottom: "5px",
        }}>Account Edit Table</Typography>
        <div>
          <DataGrid
              loading={isFetching}
              rows={accounts ?? []}
              columns={columns}
              paginationMode={"client"}
              rowModesModel={rowModesModel}
              onRowModesModelChange={(rm) => setRowModesModel(rm)}
              processRowUpdate={async (newRow, oldRow) => {
                if (newRow.id === "NEW") {
                  return await withLoading({
                    setIsFetching,
                    fn: createAccount
                  })(newRow).then((account) => {
                    setPageableAccounts(prev => (prev && {
                      ...prev,
                      content: prev.content.map((a) => {
                        if (a.id === "NEW") {
                          return account
                        }
                        return a
                      })
                    }));
                    return account
                  }).catch((error) => {
                    if (error instanceof ApiValidationError) {
                      alert("Validation Error: " + JSON.stringify(error.error.fields));
                    } else {
                      alert("Failed to create account");
                    }
                    return newRow
                  });
                }
                return await withLoading({
                  setIsFetching,
                  fn: updateAccount
                })(newRow).catch((error) => {
                  if (error instanceof ApiValidationError) {
                    alert("Validation Error: " + JSON.stringify(error.error.fields));
                  } else {
                    alert("Failed to update account");
                  }
                  return oldRow
                });
              }}
              slots={{
                toolbar: () => {
                  return (<GridToolbarContainer>
                        <Button onClick={() => {
                          handleCreateRow()
                        }} variant={"outlined"} startIcon={<AddBoxIcon/>} color={"primary"}
                                disabled={newRowExists}>Add Account</Button>
                      </GridToolbarContainer>
                  )
                }
              }}
              disableColumnFilter={true}
              editMode={"row"}
          />
        </div>
      </div>
  )
}
