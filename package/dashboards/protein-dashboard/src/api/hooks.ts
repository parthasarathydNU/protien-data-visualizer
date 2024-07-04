/**
 * Author : Dhruv Parthasarathy
 * This file contains the various API calls wrapped around react query's useQuery API
 * 
 * All the queries use the following settings by default
    staleTime: Infinity, // Data never goes stale automatically
    refetchOnWindowFocus: false, // Do not refetch on window focus
    refetchOnReconnect: false, // Do not refetch on reconnect
    refetchOnMount: false, // Do not refetch on mount

   Manually update the options for specific APIs following the documentation
   https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
 */
import { useQuery } from "@tanstack/react-query";

export const getUseQuery = (queryKey: string[], queryFn: Promise<any[] | undefined>) => {
    return useQuery({
      queryKey,
      queryFn: () => queryFn,
      staleTime: Infinity, // Data never goes stale automatically
      refetchOnWindowFocus: false, // Do not refetch on window focus
      refetchOnReconnect: false, // Do not refetch on reconnect
      refetchOnMount: false, // Do not refetch on mount
    });
  };
  