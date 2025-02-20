import oracledb from "oracledb";

const dbConfig = {
  user: process.env.ORACLE_USER || "DBACST",
  password: process.env.ORACLE_PASSWORD || "DaDFJLqoQ@1sPS$PS@!P",
  connectionString:
    process.env.ORACLE_CONNECTION_STRING || "//10.250.0.115:1521/hrmsdev",
};

export async function executeQuery(query, params = []) {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(query, params, {
      autoCommit: true,
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      fetchTypeHandler: function (metaData) {
        metaData.name = metaData.name
          .toLowerCase()
          .replace(/_(\w)/g, (m, p1) => p1.toUpperCase());
      },
    });
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
