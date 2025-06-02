import { useState, useEffect } from "react";

/* 
useFetch helps you load data from an API (or any async function), 
while managing loading and error states automatically.

It’s a reusable helper so you don’t have to keep writing 
the same useState, useEffect, and try/catch logic over and over.
*/

const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
  // data: stores the result from your API call.
  // loading: tells whether the request is in progress.
  // error: stores any error that occurred.

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Starts by setting loading to true
  // Runs the provided fetchFunction (which should return a Promise)
  // Saves the result to data
  // If something goes wrong, catches and stores the error
  // Always sets loading to false at the end

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
    } finally {
      setLoading(false);
    }
  };

  // clear everything and start fresh
  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  //Automatically Fetch on Mount when autoFetch defaulted to true
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, []);

  // data: the fetched result
  // loading: true/false
  // error: if something went wrong
  // refetch(): manually fetch again
  // reset(): clear everything

  return { data, loading, error, refetch: fetchData, reset };
};

export default useFetch;
