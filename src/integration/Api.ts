import {Dispatch, SetStateAction} from "react";
import {Account, AccountEntry, Pageable} from "../types";
import {handleResponse} from "./utilities.ts";
import {Api} from "../generated/Api.ts"

const api = new Api({baseUrl: window.location.origin})

export const fetchAccountEntries = async (args: {
  page: number | undefined | null,
  size: number | undefined | null,
  sort: string | undefined | null,
  direction: "ASC" | "DESC" | "asc" | "desc" | undefined | null
}): Promise<Pageable<AccountEntry>> => {
  const {page, size, sort, direction} = args;
  const url = new URL("/api/account-entries", window.location.origin);

  if (page) {
    url.searchParams.set("page", page.toString());
  }
  if (size) {
    url.searchParams.set("size", size.toString());
  }
  if (sort) {
    let dir = "ASC";
    if (direction) {
      dir = direction.toUpperCase();
    }
    url.searchParams.set("sort", `${sort},${dir}`);
  }

  return await fetch(url, {
    method: "GET",
  })
  .then(handleResponse<Pageable<AccountEntry>>)
}

export const deleteAccountEntry = async (accountEntryId: number) => api.deleteAccountEntry(accountEntryId)

export const deleteAccount = async (id: number) => api.deleteAccount(id).then(handleResponse);

export const createAccountEntry = async (accountEntry: AccountEntry) => api.createAccountEntry(accountEntry.accountId as number, {
      value: accountEntry.value,
      name: accountEntry.name,
      entryDate: accountEntry.entryDate!!
    })
  .then(handleResponse<AccountEntry>)

export const createAccount = async (account: Account) => api.createAccount({
      accountId: account.accountId,
      accountName: account.accountName,
      accountType: account.accountType
  })
  .then(handleResponse<Account>)

export const updateAccountEntry = async (accountEntry: AccountEntry) => api.updateAccountEntry(accountEntry.accountId as number, accountEntry.id as number, {
    value: accountEntry.value,
    name: accountEntry.name,
    entryDate: accountEntry.entryDate!
  })
  .then(handleResponse<AccountEntry>)

export const updateAccount = async (account: Account) => api.updateAccount(account.id as number, {
    accountId: account.accountId,
    accountName:  account.accountName,
    accountType: account.accountType
  })
  .then(handleResponse<Account>)

export const fetchAccounts = async () => api.getAccounts({
        pageable: {
          size: Number.MAX_SAFE_INTEGER
        }
      })
  .then(handleResponse<Pageable<Account>>)

export const withLoading = <T, A>({setIsFetching, fn}: {
  setIsFetching: Dispatch<SetStateAction<boolean>>;
  fn: (...args: A[]) => Promise<T>
}) => async (...args: A[]) => {
  setIsFetching(true);
  return await fn(...args).finally(() => {
    setIsFetching(false);
  });
}
