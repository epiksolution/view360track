import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('location.db');

export const createLocationTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS location_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tracking_type TEXT,
        user_id TEXT,
        user_name TEXT,
        lat REAL,
        lng REAL,
        createdOn TEXT,
        mobile_brand TEXT,
        mobile_model TEXT,
        mobile_os_name TEXT,
        mobile_os_version TEXT,
        mobile_os_internal_buildid TEXT
      );`
    );
  });
};

export const insertLocationTable = (data: {
  tracking_type: string;
  user_id: string;
  user_name: string;
  lat: number;
  lng: number;
  createdOn: string;
  mobile_brand: string;
  mobile_model: string;
  mobile_os_name: string;
  mobile_os_version: string;
  mobile_os_internal_buildid: string;
}) => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO location_history (
        tracking_type, user_id, user_name, lat, lng, createdOn,
        mobile_brand, mobile_model, mobile_os_name, mobile_os_version, mobile_os_internal_buildid
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.tracking_type,
        data.user_id,
        data.user_name,
        data.lat,
        data.lng,
        data.createdOn,
        data.mobile_brand,
        data.mobile_model,
        data.mobile_os_name,
        data.mobile_os_version,
        data.mobile_os_internal_buildid
      ]
    );
  });
};