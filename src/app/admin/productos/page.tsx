'use server'
import { Metadata } from 'next';
import { CustomTable } from './tables'

export async function metadata (): Promise<Metadata> {
  return {
    title: 'Productos',
  };
}

export default async function Page() {
    return (
      <>

        <CustomTable />
    
      </>
    );
}
