import {Dispatch, SetStateAction} from "react";
import {Account, AccountEntry, Pageable} from "../types";
import {handleResponse} from "./utilities.ts";

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

export const deleteAccountEntry = async (accountEntryId: number): Promise<void> => {
  await fetch(`/api/account-entries/${accountEntryId}`, {
    method: "DELETE",
  });
  return
}

export const deleteAccount = async (id: number): Promise<void> => {
  await fetch(`/api/accounts/${id}`, {
    method: "DELETE",
  }).then(handleResponse);
  return
}

export const createAccountEntry = async (accountEntry: AccountEntry): Promise<AccountEntry> => {
  return await fetch(`/api/accounts/${accountEntry.accountId}/account-entries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      value: accountEntry.value,
      name: accountEntry.name,
      entryDate: accountEntry.entryDate
    }),
  })
  .then(handleResponse<AccountEntry>)
}

export const createAccount = async (account: Account): Promise<Account> => {
  return await fetch(`/api/accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accountId: account.accountId,
      accountName: account.accountName,
      accountType: account.accountType
    }),
  })
  .then(handleResponse<Account>)
}

export const updateAccountEntry = async (accountEntry: AccountEntry): Promise<AccountEntry> => {
  return await fetch(`/api/accounts/${accountEntry.accountId}/account-entries/${accountEntry.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      value: accountEntry.value,
      name: accountEntry.name,
      entryDate: accountEntry.entryDate
    }),
  })
  .then(handleResponse<AccountEntry>)
}

export const updateAccount = async (account: Account): Promise<Account> => {
  return await fetch(`/api/accounts/${account.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accountId: account.accountId,
      accountName: account.accountName,
      accountType: account.accountType
    }),
  })
  .then(handleResponse<Account>)
}

export const fetchAccounts = async (): Promise<Pageable<Account>> => {
  const url = new URL("/api/accounts", window.location.origin);

  url.searchParams.set("size", Number.MAX_SAFE_INTEGER.toString());

  return await fetch(url, {
    method: "GET",
  })
  .then(handleResponse<Pageable<Account>>)
}

export const withLoading = <T, A>({setIsFetching, fn}: {
  setIsFetching: Dispatch<SetStateAction<boolean>>;
  fn: (...args: A[]) => Promise<T>
}) => async (...args: A[]) => {
  setIsFetching(true);
  return await fn(...args).finally(() => {
    setIsFetching(false);
  });
}
