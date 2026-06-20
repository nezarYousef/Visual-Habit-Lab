declare module "expo-sqlite" {
  export type SQLiteDatabase = {
    execAsync(source: string): Promise<void>;
    runAsync(source: string, ...params: unknown[]): Promise<unknown>;
    getAllAsync<T>(source: string, ...params: unknown[]): Promise<T[]>;
  };

  export function openDatabaseAsync(name: string): Promise<SQLiteDatabase>;
}
