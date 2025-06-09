import oracledb from "oracledb";

const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD || "DnAQEPdIe@P$2sdfPPQW",
  connectionString: process.env.ORACLE_CONNECTION_STRING,
};

export async function executeQuery(query, params = []) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const isInsert = query.trim().toUpperCase().startsWith("INSERT");
    const result = await connection.execute(query, params, {
      autoCommit: true,
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      fetchTypeHandler: function (metaData) {
        metaData.name = metaData.name
          .toLowerCase()
          .replace(/_(\w)/g, (m, p1) => p1.toUpperCase());
      },
    });

    if (isInsert) {
      return result;
    }
    return result.rows;
  } catch (error) {
    console.error("Database Error: ", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
