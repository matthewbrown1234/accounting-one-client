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
import {GridSortModel} from "@mui/x-data-grid/models/gridSortModel";
import {useEffect, useState} from "react";
import {Account, AccountEntry, ApiValidationError, Pageable} from "../types";
import {
  createAccountEntry,
  deleteAccountEntry,
  fetchAccountEntries,
  fetchAccounts,
  updateAccountEntry,
  withLoading
} from "../integration/Api.ts";
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import {GridRowParams} from "@mui/x-data-grid/models/params/gridRowParams";

const pagingSize = 50

export default function AccountEntries() {
  const [isFetching, setIsFetching] = useState(false);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [pageableAccountEntries, setPageableAccountEntries] = useState<Pageable<AccountEntry> | undefined>(undefined);
  const [pageableAccounts, setPageableAccounts] = useState<Pageable<Account> | undefined>(undefined);
  const newRowExists = pageableAccountEntries?.content.some((accountEntry) => accountEntry.id === "NEW");
  const accounts = pageableAccounts?.content ?? []

  const onLoad = async () => {
    const pageableAccountEntry = await withLoading({
      setIsFetching,
      fn: fetchAccountEntries
    })({
      page: 0,
      size: pagingSize,
      sort: "id",
      direction: "DESC"
    });
    setPageableAccountEntries(pageableAccountEntry)
    const pageableAccount = await withLoading({
      setIsFetching,
      fn: fetchAccounts
    })();
    setPageableAccounts(pageableAccount)
  }

  const handleDeleteAccountEntry = async (id: number | "NEW") => {
    if (id !== "NEW") {
      await deleteAccountEntry(id)
    }
    setPageableAccountEntries(prev => (prev && {
      ...prev,
      content: prev.content
      .filter((accountEntry) => accountEntry.id !== id),
      page: {
        ...prev.page,
        totalElements: prev.page.totalElements - 1
      }
    }));
  }
  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.Edit}});
  };
  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.View}});
  };
  const handleCancelClick = (params: GridRowParams<AccountEntry>) => () => {
    const {id, row} = params
    setRowModesModel({
      ...rowModesModel,
      [id]: {mode: GridRowModes.View, ignoreModifications: true},
    });
    if (row.id === "NEW") {
      setPageableAccountEntries(prev => (prev && {
        ...prev,
        content: prev.content.filter((entry) => entry.id !== "NEW"),
        page: {
          ...prev.page,
          totalElements: prev.page.totalElements - 1
        }
      }));
    }
  };

  const handleCreateRow = () => {
    setRowModesModel({...rowModesModel, ["NEW"]: {mode: GridRowModes.Edit, fieldToFocus: "value"}});

    setPageableAccountEntries(prev => (prev && {
      ...prev,
      content: [
        ...prev.content,
        {
          id: "NEW",
          value: 0,
          name: "",
          entryDate: undefined,
          accountId: "",
          accountName: ""
        }
      ],
      page: {
        ...prev.page,
        totalElements: prev.page.totalElements + 1
      }
    }));
  }

  useEffect(() => {
    onLoad()
  }, []);


  const columns: GridColDef<(AccountEntry)>[] = [
    {
      field: 'id', headerName: 'ID'
    },
    {
      field: 'value',
      headerName: 'Value',
      type: "string",
      editable: true,
      description: 'The dollar value of the entry',
      valueFormatter: (value: number) => {
        return value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD"
        });
      }
    },
    {
      field: 'name',
      headerName: 'Name',
      type: "string",
      editable: true,
      width: 300,
      description: 'The Name of the entry',
    },
    {
      field: 'accountId',
      headerName: 'Account Name',
      type: 'singleSelect',
      valueOptions: [
        ...accounts.map((account) => ({
          value: account.id,
          label: account.accountName
        }))],
      width: 250,
      editable: true,
      description: 'The name of the account',
    },
    {
      field: 'entryDate',
      headerName: 'Date',
      sortable: true,
      editable: true,
      type: "dateTime",
      width: 250,
      valueGetter: (value) => {
        if (!value) {
          return "";
        }
        return new Date(value);
      },
      description: 'The date of the entry',
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
                await handleDeleteAccountEntry(params.row.id);
              }}
              color="inherit"
          />,
        ];
      }
    },
  ];

  const total = pageableAccountEntries?.content?.reduce((acc, entry) => {
    return acc + entry.value;
  },0) ?? 0;


  return (
      <div>
        <Typography fontSize={"x-large"} component={"h5"} style={{
          paddingTop: "5px",
          paddingBottom: "5px",
        }}>Account Entries Edit Table</Typography>
        <div>
          <DataGrid
              loading={isFetching}
              pagination={true}
              rows={pageableAccountEntries?.content ?? []}
              columns={columns}
              rowCount={pageableAccountEntries?.page.totalElements ?? 0}
              paginationMode={"server"}
              pageSizeOptions={[pagingSize]}
              paginationModel={{
                page: pageableAccountEntries?.page.number ?? 0,
                pageSize: pageableAccountEntries?.page.size ?? pagingSize
              }}
              rowModesModel={rowModesModel}
              onRowModesModelChange={(rm) => setRowModesModel(rm)}
              processRowUpdate={async (newRow, oldRow) => {
                if (newRow.id === "NEW") {
                  return await withLoading({
                    setIsFetching,
                    fn: createAccountEntry
                  })(newRow).then((accountEntry) => {
                    setPageableAccountEntries(prev => (prev && {
                      ...prev,
                      content: prev.content.map((entry) => {
                        if (entry.id === "NEW") {
                          return accountEntry
                        }
                        return entry
                      })
                    }));
                    return accountEntry
                  }).catch((error) => {
                    if (error instanceof ApiValidationError) {
                      alert("Validation Error: " + JSON.stringify(error.error.fields));
                    } else {
                      alert("Failed to create account entry");
                    }
                    return newRow
                  });
                }
                return await withLoading({
                  setIsFetching,
                  fn: updateAccountEntry
                })(newRow).catch((error) => {
                  if (error instanceof ApiValidationError) {
                    alert("Validation Error: " + JSON.stringify(error.error.fields));
                  } else {
                    alert("Failed to update account entry");
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
                                disabled={newRowExists}>Add Entry</Button>
                      </GridToolbarContainer>
                  )
                }
              }}
              disableColumnFilter={true}
              onPaginationModelChange={async (model) => {
                const response = await withLoading({
                  setIsFetching,
                  fn: fetchAccountEntries
                })({
                  page: model.page,
                  size: model.pageSize,
                  sort: "id",
                  direction: "DESC"
                });
                setPageableAccountEntries(response)
              }}
              onSortModelChange={async (model: GridSortModel,) => {
                const response = await withLoading({
                  setIsFetching,
                  fn: fetchAccountEntries
                })({
                  page: pageableAccountEntries?.page.number ?? 0,
                  size: pageableAccountEntries?.page.size ?? pagingSize,
                  sort: model[0]?.field,
                  direction: model[0]?.sort
                });
                setPageableAccountEntries(response)
              }}
              editMode={"row"}
          />
        </div>
        <div>
          total: {total} <br/>
          average: {total / (pageableAccountEntries?.content?.length ?? 0)}
        </div>
      </div>
  )
}
